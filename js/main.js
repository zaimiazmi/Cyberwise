// Main Game Logic for Cyberwise

// Game state and core systems
const game = {
    // Initialization
    init() {
        this.setupEventListeners();
        this.loadGameData();
        this.applyTheme();
    },

    // Set up initial event listeners
    setupEventListeners() {
        document.getElementById('start-game-btn').addEventListener('click', () => this.startGame());
        document.getElementById('manage-profiles-btn').addEventListener('click', () => ui.renderProfileManagement());
        document.getElementById('create-profile-btn').addEventListener('click', () => ui.showCreateProfileDialog());
        document.getElementById('back-to-intro-btn').addEventListener('click', () => ui.returnToIntro());
        
        // Setup changelog button
        const changelogBtn = document.getElementById('changelog-btn');
        if (changelogBtn) {
            changelogBtn.addEventListener('click', () => this.showChangelog());
        }
    },

    // Load saved game data
    loadGameData() {
        // Check if we have profiles system or old single-save system
        const profiles = utils.profiles.getAllProfiles();
        const activeProfile = utils.profiles.getActiveProfile();
        
        if (activeProfile) {
            // Load from active profile
            Object.assign(gameData.player, activeProfile.gameData);
        } else if (Object.keys(profiles).length === 0) {
            // Check for legacy save data and migrate
            const legacySaveData = utils.storage.load('gameData');
            if (legacySaveData) {
                this.migrateLegacySave(legacySaveData);
            }
        }
        
        // Ensure cities are unlocked based on current rank
        this.updateCityUnlocks();
    },

    // Migrate old save system to new profile system
    migrateLegacySave(legacySaveData) {
        const profileName = legacySaveData.name || 'Agent';
        const result = utils.profiles.createProfile(profileName);
        
        if (result.success) {
            // Update the profile with legacy data
            result.profile.gameData = { ...legacySaveData };
            utils.profiles.updateProfile(result.profileId, legacySaveData);
            utils.profiles.setActiveProfile(result.profileId);
            
            // Load the migrated data
            Object.assign(gameData.player, legacySaveData);
            
            // Remove legacy save
            utils.storage.remove('gameData');
            
            utils.showToast('Save data migrated to new profile system!');
        }
    },

    // Save game data
    saveGameData() {
        const activeProfile = utils.profiles.getActiveProfile();
        if (activeProfile) {
            utils.profiles.updateProfile(activeProfile.id, gameData.player);
        }
    },

    // Apply current theme
    applyTheme() {
        utils.applyTheme();
    },

    // Start the game
    startGame() {
        dom.introContainer.classList.add('hidden');
        dom.gameContainer.classList.remove('hidden');
        
        const gameHeader = document.getElementById('game-header');
        if (gameHeader) {
            gameHeader.style.display = 'flex';
        }

        utils.updateHUD();
        this.applyTheme();
        this.checkDailyLogin();
        ui.renderHub();
        
        // Auto-save every 30 seconds
        setInterval(() => this.saveGameData(), 30000);
    },

    // Show changelog modal
    showChangelog() {
        const changelogHTML = gameConfig.changelog.map(log => `
            <div class="text-left bg-gray-800 p-4 rounded-lg mb-4">
                <h4 class="font-orbitron text-lg text-amber-400">${log.version} - ${log.date}</h4>
                <ul class="list-disc list-inside text-sm mt-2 space-y-1">
                    ${log.changes.map(change => 
                        `<li>${change.replace(/\*\*(.*?)\*\*/g, '<strong class="text-amber-300">$1</strong>')}</li>`
                    ).join('')}
                </ul>
            </div>
        `).join('');
        
        utils.showModal(
            'Version History', 
            `<div class="space-y-4 max-h-80 overflow-y-auto">${changelogHTML}</div>`, 
            'Close'
        );
    },

    // Daily login bonus system
    checkDailyLogin() {
        const today = new Date().toDateString();
        if (gameData.player.lastLoginDate !== today) {
            gameData.player.lastLoginDate = today;
            gameData.player.salary += 100;
            utils.updateHUD();
            utils.showModal(
                'Daily Login Bonus', 
                'Welcome back, Agent! Here\'s a bonus of <strong class="text-amber-400">100 Salary</strong> for your dedication.', 
                'Awesome!'
            );
        }
    },

    // Update city unlocks based on rank
    updateCityUnlocks() {
        locationData.cities.forEach(city => {
            if (city.rankRequired) {
                const requiredRankIndex = rankData.ranks.findIndex(r => r.name === city.rankRequired);
                const currentRankIndex = rankData.ranks.findIndex(r => r.name === gameData.player.rank);
                city.unlocked = currentRankIndex >= requiredRankIndex;
            }
        });
    },

    // Check for achievements
    checkAchievements() {
        achievementData.achievements.forEach(ach => {
            if (!gameData.player.achievements.unlocked.includes(ach.id) && ach.condition(gameData.player)) {
                gameData.player.achievements.unlocked.push(ach.id);
                utils.showToast(`Achievement Unlocked: ${ach.name}`, 'success');
            }
        });
    },

    // Check for rank promotion
    checkRankUp() {
        const currentRankIndex = rankData.ranks.findIndex(r => r.name === gameData.player.rank);
        const nextRank = rankData.ranks[currentRankIndex + 1];
        
        if (nextRank && 
            gameData.player.xp >= nextRank.xpRequired && 
            gameData.player.inventory.licenses.length >= nextRank.licensesRequired) {
            
            gameData.player.rank = nextRank.name;
            this.updateCityUnlocks();
            
            // Unlock new tool if city becomes available
            const newCity = locationData.cities.find(c => c.rankRequired === nextRank.name);
            if (newCity && newCity.toolUnlock && !gameData.player.inventory.tools.some(t => t.id === newCity.toolUnlock)) {
                gameData.player.inventory.tools.push({ id: newCity.toolUnlock, level: 1 });
                utils.showToast(`New Tool Unlocked: ${toolData.tools[newCity.toolUnlock].name}`);
            }
            
            const promotionText = `
                <div class="text-center">
                    <div class="text-6xl mb-4">🎖️</div>
                    <p class="text-lg mb-4">Congratulations! You have been promoted to:</p>
                    <h3 class="font-orbitron text-3xl text-amber-400 mb-4">${gameData.player.rank}</h3>
                    <p class="text-sm text-gray-300">Your dedication to digital safety has been recognized!</p>
                </div>
            `;
            
            utils.showModal('PROMOTION!', promotionText, 'Excellent!');
            this.checkAchievements();
        }
    },

    // Mission system
    missions: {
        // Start a mission
        startMission(missionId) {
            const mission = missionData.getMissionById(missionId);
            if (!mission) return;

            missionData.currentMission = mission;
            missionData.foundClues = [];
            missionData.firewallIntegrity = 100;

            // Render mission content
            dom.gameScreen.innerHTML = mission.content;
            dom.cluesFoundCount.textContent = '0';
            dom.cluesTotalCount.textContent = mission.clues.length;
            dom.progressBar.style.width = '0%';
            dom.missionProgress.classList.remove('hidden');

            // Add clue event listeners
            dom.gameScreen.querySelectorAll('.clue').forEach(el => {
                el.addEventListener('click', (e) => this.handleClueClick(e));
            });

            // Auto-detect clue for upgraded PhishSniff tool
            const phishSniffer = gameData.player.inventory.tools.find(t => t.id === 'phishsniffer');
            if (phishSniffer && phishSniffer.level >= 3 && mission.cityId === 'inbox_isles') {
                utils.showToast('PhishSniff™ v3 auto-detected a threat!');
                setTimeout(() => {
                    const firstClueElement = dom.gameScreen.querySelector('.clue');
                    if (firstClueElement) {
                        this.handleClueClick({ target: firstClueElement, preventDefault: () => {} });
                    }
                }, 1500);
            }

            // Initialize firewall for high-risk missions
            if (mission.hasFirewall) {
                this.updateFirewallUI();
            }
        },

        // Handle clue clicks
        handleClueClick(event) {
            event.preventDefault();
            const element = event.target;
            const clueId = element.dataset.clueId;
            
            if (!element.classList.contains('clue') || missionData.foundClues.includes(clueId)) {
                return;
            }
            
            const mission = missionData.currentMission;
            const clueInfo = mission.clues.find(c => c.id === clueId);
            
            if (clueInfo) {
                // Correct clue found
                missionData.foundClues.push(clueId);
                element.classList.add('correct');
                element.classList.remove('clue');
                
                const reasonText = `
                    <div class="text-left">
                        <h4 class="font-orbitron text-lg text-green-400 mb-2">✅ CLUE IDENTIFIED</h4>
                        <p>${clueInfo.reason}</p>
                    </div>
                `;
                
                utils.showModal('Correct Analysis', reasonText, 'Continue');
                this.updateProgress();
                
                if (missionData.foundClues.length === mission.clues.length) {
                    setTimeout(() => this.endMission(), 1000);
                }
            } else if (mission.hasFirewall) {
                // Wrong clue in firewall mission
                missionData.firewallIntegrity -= (mission.firewallDamagePerMistake || 25);
                this.updateFirewallUI();
                utils.showToast('Incorrect Analysis! Firewall damaged!', 'error');
                
                if (missionData.firewallIntegrity <= 0) {
                    utils.showModal(
                        'Mission Failed!', 
                        'Your firewall has been breached. The system is compromised. You must retreat and try again.', 
                        'Retry Mission', 
                        () => this.startMission(mission.id)
                    );
                }
            }
        },

        // Update mission progress
        updateProgress() {
            const mission = missionData.currentMission;
            const progress = (missionData.foundClues.length / mission.clues.length) * 100;
            dom.cluesFoundCount.textContent = missionData.foundClues.length;
            dom.progressBar.style.width = `${progress}%`;
        },

        // Update firewall UI
        updateFirewallUI() {
            const firewallStatusEl = document.getElementById('firewall-status');
            if (firewallStatusEl) {
                const barEl = document.getElementById('firewall-bar');
                if (barEl) {
                    barEl.style.width = `${missionData.firewallIntegrity}%`;
                    
                    // Change color based on integrity
                    barEl.className = 'h-full rounded-full transition-all duration-1000';
                    if (missionData.firewallIntegrity > 70) {
                        barEl.classList.add('bg-green-500');
                    } else if (missionData.firewallIntegrity > 30) {
                        barEl.classList.add('bg-yellow-500');
                    } else {
                        barEl.classList.add('bg-red-500');
                    }
                }
            }
        },

        // End mission
        endMission() {
            const mission = missionData.currentMission;
            let salaryEarned = mission.reward.salary;
            
            // Apply achievement bonuses
            if (gameData.player.achievements.unlocked.includes('scam_spotter') && mission.cityId === 'inbox_isles') {
                salaryEarned = Math.ceil(salaryEarned * 1.10);
            }
            if (gameData.player.achievements.unlocked.includes('master_of_disguise') && mission.cityId === 'social_square') {
                salaryEarned = Math.ceil(salaryEarned * 1.10);
            }
            if (gameData.player.achievements.unlocked.includes('privacy_guardian') && mission.cityId === 'privacy_peaks') {
                salaryEarned = Math.ceil(salaryEarned * 1.15);
            }
            if (gameData.player.achievements.unlocked.includes('elite_defender') && mission.cityId === 'darknet_dungeons') {
                salaryEarned = Math.ceil(salaryEarned * 1.20);
            }

            // Apply tool bonuses
            const phishSniffer = gameData.player.inventory.tools.find(t => t.id === 'phishsniffer');
            if (phishSniffer && phishSniffer.level >= 2 && mission.cityId === 'inbox_isles') {
                salaryEarned = Math.ceil(salaryEarned * 1.10);
            }
            
            const socialScope = gameData.player.inventory.tools.find(t => t.id === 'socialscope');
            if (socialScope && socialScope.level >= 2 && mission.cityId === 'social_square') {
                salaryEarned = Math.ceil(salaryEarned * 1.10);
            }
            
            const leakTracker = gameData.player.inventory.tools.find(t => t.id === 'leaktracker');
            if (leakTracker && leakTracker.level >= 2 && mission.cityId === 'privacy_peaks') {
                salaryEarned = Math.ceil(salaryEarned * 1.15);
            }

            // Update player stats
            gameData.player.salary += salaryEarned;
            gameData.player.xp += mission.reward.xp;
            gameData.player.dataPass.xp += mission.reward.dataPassXp;
            
            // Level up data pass
            while (gameData.player.dataPass.xp >= dataPassData.config.xpPerLevel) {
                gameData.player.dataPass.xp -= dataPassData.config.xpPerLevel;
                gameData.player.dataPass.level++;
                utils.showToast(`Data Pass Level Up! Reached Level ${gameData.player.dataPass.level}`);
            }

            // Update mission completion stats
            gameData.player.missionsCompleted.total++;
            gameData.player.missionsCompleted.byCity[mission.cityId] = 
                (gameData.player.missionsCompleted.byCity[mission.cityId] || 0) + 1;

            // Award CyberCard
            if (mission.reward.card && !gameData.player.inventory.cyberCards.includes(mission.reward.card)) {
                gameData.player.inventory.cyberCards.push(mission.reward.card);
            }

            // Hide mission progress
            dom.missionProgress.classList.add('hidden');
            
            // Show results
            const resultsText = `
                <div class="text-center">
                    <div class="text-6xl mb-4">✅</div>
                    <h3 class="font-orbitron text-xl text-green-400 mb-4">Mission Complete!</h3>
                    <div class="space-y-2 text-left bg-gray-800 p-4 rounded-lg">
                        <p><strong class="text-amber-400">💰 Salary Earned:</strong> ${salaryEarned}</p>
                        <p><strong class="text-indigo-400">📈 Career XP Gained:</strong> ${mission.reward.xp}</p>
                        <p><strong class="text-purple-400">📊 Data Pass XP Gained:</strong> ${mission.reward.dataPassXp}</p>
                        ${mission.reward.card ? '<p><strong class="text-green-400">🃏 New CyberCard Acquired!</strong></p>' : ''}
                    </div>
                </div>
            `;
            
            const postMissionCallback = () => {
                utils.updateHUD();
                game.checkRankUp();
                game.checkAchievements();
                
                // Random post-mission events
                if (Math.random() < 0.3) {
                    game.events.triggerCodeRed();
                } else if (Math.random() < 0.25) {
                    game.events.showHackerMessage();
                } else {
                    ui.renderHub();
                }
            };
            
            utils.showModal('Case Closed', resultsText, 'Return to Hub', postMissionCallback);
        }
    },

    // Shop system
    shop: {
        // Purchase tool upgrade
        purchaseUpgrade(toolId) {
            const tool = gameData.player.inventory.tools.find(t => t.id === toolId);
            const toolInfo = toolData.tools[toolId];
            const nextLevel = toolInfo.upgrades.find(u => u.level === tool.level + 1);
            
            if (!nextLevel || gameData.player.salary < nextLevel.cost) {
                utils.showToast('Insufficient funds!', 'error');
                return;
            }

            gameData.player.salary -= nextLevel.cost;
            tool.level++;
            utils.updateHUD();
            ui.renderShop();
            
            utils.showModal(
                'Upgrade Successful!', 
                `${toolInfo.name} is now Level ${tool.level}.<br><br><em>${nextLevel.effect}</em>`, 
                'OK'
            );
        },

        // Purchase theme
        purchaseTheme(itemId) {
            const item = shopData.items.find(i => i.id === itemId);
            if (!item || gameData.player.salary < item.cost) {
                utils.showToast('Insufficient funds!', 'error');
                return;
            }
            
            gameData.player.salary -= item.cost;
            gameData.player.settings.theme = item.value;
            utils.applyTheme();
            utils.updateHUD();
            ui.renderShop();
            utils.showToast(`${item.name} equipped!`);
        }
    },

    // Data Pass system
    dataPass: {
        // Buy premium pass
        buyPremium() {
            if (gameData.player.salary >= 500) {
                gameData.player.salary -= 500;
                gameData.player.dataPass.isPremium = true;
                utils.showToast('Premium Data Pass Activated!');
                utils.updateHUD();
                ui.renderDataPass();
            } else {
                utils.showModal('Insufficient Funds', 'You need at least 500 Salary to buy the Premium Pass.', 'OK');
            }
        },

        // Claim reward
        claimReward(rewardId) {
            const [type, levelStr] = rewardId.split('_');
            const level = parseInt(levelStr);
            const rewardData = dataPassData.config.rewards.find(r => r.level === level);
            const reward = type === 'f' ? rewardData.free : rewardData.premium;
            
            if (!reward || gameData.player.dataPass.claimedRewards.includes(rewardId)) return;

            switch(reward.type) {
                case 'salary':
                    gameData.player.salary += reward.value;
                    utils.showToast(`+${reward.value} Salary Claimed!`);
                    break;
                case 'tool_level':
                    const tool = gameData.player.inventory.tools.find(t => t.id === reward.toolId);
                    if (tool) {
                        tool.level++;
                        utils.showToast(`${toolData.tools[tool.id].name} leveled up!`);
                    } else { 
                        gameData.player.inventory.tools.push({ id: reward.toolId, level: 1 });
                        utils.showToast(`New Tool Unlocked: ${toolData.tools[reward.toolId].name}`);
                    }
                    break;
                case 'cyberCard':
                    if (gameData.player.inventory.cyberCards.includes(reward.cardId)) {
                        gameData.player.salary += 100;
                        utils.showToast(`Duplicate CyberCard! +100 Salary bonus.`);
                    } else {
                        gameData.player.inventory.cyberCards.push(reward.cardId);
                        utils.showToast(`CyberCard Acquired!`);
                    }
                    break;
                case 'cosmetic':
                     utils.showToast(`Cosmetic Unlocked: Gold Visor!`);
                     break;
            }
            
            gameData.player.dataPass.claimedRewards.push(rewardId);
            utils.updateHUD();
            ui.renderDataPass();
        }
    },

    // CyberCards system
    cards: {
        // Take quiz for license
        takeQuiz(cardId) {
            const cardInfo = cardData.cyberCards.find(c => c.id === cardId);
            const { question, options, answer } = cardInfo.quiz;
            
            let quizHTML = `
                <div class="text-left">
                    <h4 class="font-orbitron text-lg text-amber-400 mb-4">License Quiz</h4>
                    <p class="mb-4 text-lg">${question}</p>
                    <div class="flex flex-col gap-2">
                        ${options.map(opt => 
                            `<button class="quiz-option-btn btn btn-secondary w-full py-2" data-answer="${opt}">
                                ${opt}
                            </button>`
                        ).join('')}
                    </div>
                </div>
            `;
            
            utils.showModal('License Quiz', quizHTML, '', () => {}, true);
            
            document.querySelectorAll('.quiz-option-btn').forEach(btn => {
                btn.addEventListener('click', e => {
                    const selectedAnswer = e.target.dataset.answer;
                    
                    if (selectedAnswer === answer) {
                        if (!gameData.player.inventory.licenses.includes(cardInfo.license)) {
                           gameData.player.inventory.licenses.push(cardInfo.license);
                        }
                        
                        utils.showModal(
                            'Correct!', 
                            `<div class="text-center">
                                <div class="text-6xl mb-4">🎓</div>
                                <p class="text-lg mb-2">Congratulations!</p>
                                <p>You have earned the <strong class="text-green-400">${cardInfo.license}</strong> license!</p>
                            </div>`, 
                            'Awesome!', 
                            () => ui.renderCardView(cardId)
                        );
                        
                        game.checkRankUp();
                    } else {
                        utils.showModal(
                            'Incorrect', 
                            'That\'s not quite right. Review the card content and try again.', 
                            'Try Again'
                        );
                    }
                });
            });
        }
    },

    // Profile Management System
    profiles: {
        // Select and load a profile
        selectProfile(profileId) {
            const result = utils.profiles.setActiveProfile(profileId);
            if (result.success) {
                // Load profile data into game
                Object.assign(gameData.player, result.profile.gameData);
                
                // Start the game
                game.startGame();
                
                utils.showToast(`Welcome back, ${result.profile.name}!`);
            } else {
                utils.showToast('Failed to load profile', 'error');
            }
        },

        // Confirm profile deletion
        confirmDeleteProfile(profileId, profileName) {
            const confirmHTML = `
                <div class="text-center">
                    <div class="text-6xl mb-4">⚠️</div>
                    <h4 class="font-orbitron text-lg text-red-400 mb-4">Delete Profile</h4>
                    <p class="mb-4">Are you sure you want to delete the profile:</p>
                    <p class="font-bold text-xl text-amber-400 mb-4">"${profileName}"</p>
                    <p class="text-red-400 text-sm mb-6">This action cannot be undone!</p>
                    <div class="flex gap-2">
                        <button id="confirm-delete" class="btn bg-red-600 hover:bg-red-700 font-bold py-2 px-4 flex-1">
                            Delete Forever
                        </button>
                        <button id="cancel-delete" class="btn btn-secondary py-2 px-4 flex-1">
                            Cancel
                        </button>
                    </div>
                </div>
            `;

            utils.showModal('Confirm Deletion', confirmHTML, '', () => {}, true);

            document.getElementById('confirm-delete').addEventListener('click', () => {
                const result = utils.profiles.deleteProfile(profileId);
                if (result.success) {
                    utils.hideModal();
                    ui.updateProfileList();
                    utils.showToast(`Profile "${profileName}" deleted`, 'warning');
                } else {
                    utils.showToast('Failed to delete profile', 'error');
                }
            });

            document.getElementById('cancel-delete').addEventListener('click', () => {
                utils.hideModal();
            });
        }
    },

    // Special events system
    events: {
        // Code Red mini-game
        triggerCodeRed() {
            const sequenceLength = 3 + Math.floor(gameData.player.dataPass.level / 2);
            const sequence = Array.from({length: sequenceLength}, () => Math.floor(Math.random() * 9));
            let playerSequence = [];
            let timeLeft = 15;
            let timer;

            const nodesHTML = Array(9).fill(0).map((_, i) => 
                `<div id="node-${i}" class="intrusion-node"></div>`
            ).join('');
            
            const miniGameHTML = `
                <div class="text-center">
                    <h3 class="font-orbitron text-2xl text-red-500 mb-2">🚨 CODE RED: Network Intrusion 🚨</h3>
                    <p class="mb-4">A hacker from ${gameConfig.hackerGroup.name} is attempting to breach the system! 
                    Repeat the sequence to block them!</p>
                    <div id="code-red-timer" class="font-orbitron text-xl my-4 text-amber-400">Time: ${timeLeft}s</div>
                    <div class="grid grid-cols-3 gap-4 w-48 mx-auto my-6">${nodesHTML}</div>
                    <p id="code-red-status" class="text-sm text-gray-300">Status: Awaiting sequence...</p>
                </div>
            `;
            
            utils.showModal('CODE RED', miniGameHTML, '', null, true);

            // Play sequence after delay
            setTimeout(() => {
                document.getElementById('code-red-status').textContent = 'Status: Memorize sequence...';
                let i = 0;
                
                const playInterval = setInterval(() => {
                    if (i >= sequence.length) {
                        clearInterval(playInterval);
                        startPlayerTurn();
                        return;
                    }
                    
                    const nodeEl = document.getElementById(`node-${sequence[i]}`);
                    nodeEl.classList.add('active');
                    setTimeout(() => nodeEl.classList.remove('active'), 400);
                    i++;
                }, 600);
            }, 2000);

            function startPlayerTurn() {
                document.getElementById('code-red-status').textContent = 'Status: Your turn!';
                document.querySelectorAll('.intrusion-node').forEach((node, i) => {
                    node.classList.add('active');
                    node.onclick = () => handleNodeClick(i);
                });

                timer = setInterval(() => {
                    timeLeft--;
                    document.getElementById('code-red-timer').textContent = `Time: ${timeLeft}s`;
                    if (timeLeft <= 0) {
                        endCodeRed(false);
                    }
                }, 1000);
            }

            function handleNodeClick(nodeIndex) {
                playerSequence.push(nodeIndex);
                const correctIndex = playerSequence.length - 1;
                
                if (sequence[correctIndex] !== nodeIndex) {
                    endCodeRed(false);
                    return;
                }

                if (playerSequence.length === sequence.length) {
                    endCodeRed(true);
                }
            }

            function endCodeRed(success) {
                clearInterval(timer);
                if (success) {
                    gameData.player.salary += 150;
                    gameData.player.dataPass.xp += 50;
                    utils.showModal(
                        'Success!', 
                        `<div class="text-center">
                            <div class="text-6xl mb-4">🛡️</div>
                            <p class="text-lg mb-2">Intrusion blocked!</p>
                            <p>Your quick response has been noted. Bonus of <strong class="text-amber-400">150 Salary</strong> 
                            and <strong class="text-purple-400">50 Data Pass XP</strong> awarded.</p>
                        </div>`, 
                        'Excellent!', 
                        () => ui.renderHub()
                    );
                } else {
                    utils.showModal(
                        'Failure!', 
                        `<div class="text-center">
                            <div class="text-6xl mb-4">💥</div>
                            <p class="text-lg mb-2">The hacker breached the firewall.</p>
                            <p>The network is safe for now, but be more careful next time.</p>
                        </div>`, 
                        'Understood', 
                        () => ui.renderHub()
                    );
                }
                utils.updateHUD();
            }
        },

        // Show random hacker message
        showHackerMessage() {
            const message = utils.randomChoice(gameConfig.hackerGroup.messages);
            utils.showModal(
                'Incoming Message...', 
                `<div class="text-center">
                    <div class="text-6xl mb-4">💀</div>
                    <p class="text-red-400 font-mono text-lg mb-2">>> ${message}</p>
                    <p class="text-sm text-gray-400">- ${gameConfig.hackerGroup.name}</p>
                </div>`, 
                'Dismiss', 
                () => ui.renderHub()
            );
        }
    }
};

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    game.init();
});