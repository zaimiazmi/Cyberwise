// UI Rendering Functions for Cyberwise Game

const ui = {
    // Main screen rendering function
    renderScreen(title, contentHTML, backCallback) {
        dom.gameScreen.innerHTML = `
            <div class="w-full text-left space-y-4">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="font-orbitron text-3xl text-indigo-300">${title}</h2>
                    <button id="back-btn" class="btn btn-secondary py-2 px-4">Back</button>
                </div>
                ${contentHTML}
            </div>`;
        
        if (backCallback) {
            document.getElementById('back-btn').addEventListener('click', backCallback);
        }
    },

    // Render the main hub/dashboard
    renderHub() {
        dom.gameScreen.innerHTML = `
            <div class="text-center space-y-4 w-full">
                <h2 class="font-orbitron text-3xl text-indigo-400">AGENT DASHBOARD</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 max-w-4xl mx-auto">
                    <button id="hub-missions-btn" class="hub-btn">
                        <h3 class="font-orbitron text-xl text-amber-400">WORLD MAP</h3>
                        <p class="text-sm font-normal normal-case text-gray-300">Access Cyber Cities & missions.</p>
                    </button>
                    <button id="hub-specops-btn" class="hub-btn">
                        <h3 class="font-orbitron text-xl text-red-400">SPECIAL OPS</h3>
                        <p class="text-sm font-normal normal-case text-gray-300">High-stakes weekly missions.</p>
                    </button>
                    <button id="hub-pass-btn" class="hub-btn">
                        <h3 class="font-orbitron text-xl text-purple-400">DATA PASS</h3>
                        <p class="text-sm font-normal normal-case text-gray-300">View season progress & rewards.</p>
                    </button>
                    <button id="hub-leaderboards-btn" class="hub-btn">
                        <h3 class="font-orbitron text-xl text-teal-400">LEADERBOARDS</h3>
                        <p class="text-sm font-normal normal-case text-gray-300">Check your agency ranking.</p>
                    </button>
                    <button id="hub-achievements-btn" class="hub-btn">
                        <h3 class="font-orbitron text-xl text-yellow-400">ACHIEVEMENTS</h3>
                        <p class="text-sm font-normal normal-case text-gray-300">View career milestones.</p>
                    </button>
                    <button id="hub-career-btn" class="hub-btn">
                        <h3 class="font-orbitron text-xl text-cyan-400">CAREER</h3>
                        <p class="text-sm font-normal normal-case text-gray-300">View rank, tools & licenses.</p>
                    </button>
                    <button id="hub-cards-btn" class="hub-btn">
                        <h3 class="font-orbitron text-xl text-green-400">CYBERCARDS</h3>
                        <p class="text-sm font-normal normal-case text-gray-300">Review intel and take quizzes.</p>
                    </button>
                    <button id="hub-shop-btn" class="hub-btn col-span-1 md:col-span-2">
                        <h3 class="font-orbitron text-xl text-pink-400">SHOP</h3>
                        <p class="text-sm font-normal normal-case text-gray-300">Upgrade tools & customize hub.</p>
                    </button>
                </div>
            </div>`;

        // Add event listeners
        document.getElementById('hub-missions-btn').addEventListener('click', () => ui.renderCitySelect());
        document.getElementById('hub-specops-btn').addEventListener('click', () => ui.renderSpecialOps());
        document.getElementById('hub-pass-btn').addEventListener('click', () => ui.renderDataPass());
        document.getElementById('hub-leaderboards-btn').addEventListener('click', () => ui.renderLeaderboards());
        document.getElementById('hub-achievements-btn').addEventListener('click', () => ui.renderAchievements());
        document.getElementById('hub-career-btn').addEventListener('click', () => ui.renderCareer());
        document.getElementById('hub-cards-btn').addEventListener('click', () => ui.renderCardDeck());
        document.getElementById('hub-shop-btn').addEventListener('click', () => ui.renderShop());
    },

    // Render city selection screen
    renderCitySelect() {
        let cityListHTML = locationData.cities.map(city => `
            <div class="bg-gray-800 p-4 rounded-lg flex justify-between items-center ${!city.unlocked ? 'opacity-60' : ''}">
                <div>
                    <h3 class="font-orbitron text-xl ${city.unlocked ? 'text-amber-400' : 'text-gray-500'}">
                        ${city.name} ${!city.unlocked ? '(LOCKED)' : ''}
                    </h3>
                    <p class="text-sm text-gray-400">${city.description}</p>
                    ${!city.unlocked ? `<p class="text-xs text-red-400">Requires Rank: ${city.rankRequired}</p>` : ''}
                </div>
                <button data-city-id="${city.id}" class="city-select-btn btn font-bold py-2 px-4" ${!city.unlocked ? 'disabled' : ''}>
                    Enter
                </button>
            </div>
        `).join('');

        this.renderScreen('WORLD MAP', `<div class="space-y-4">${cityListHTML}</div>`, () => ui.renderHub());

        // Add event listeners
        document.querySelectorAll('.city-select-btn').forEach(btn => {
            btn.addEventListener('click', (e) => ui.renderMissionSelect(e.target.dataset.cityId));
        });
    },

    // Render mission selection for a city
    renderMissionSelect(cityId) {
        const cityMissions = missionData.getMissionsByCity(cityId);
        const cityName = locationData.cities.find(c => c.id === cityId)?.name;

        let missionListHTML = cityMissions.map(mission => `
            <div class="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                <div class="flex-grow">
                    <h3 class="font-orbitron text-xl text-amber-400">${mission.title}</h3>
                    <p class="text-sm text-gray-400">${mission.briefing}</p>
                    <div class="flex gap-4 mt-2 text-xs">
                        <span class="text-indigo-400">Difficulty: ${mission.difficulty}</span>
                        <span class="text-green-400">Reward: ${mission.reward.salary} Salary</span>
                        <span class="text-purple-400">XP: ${mission.reward.xp}</span>
                    </div>
                </div>
                <button data-mission-id="${mission.id}" class="mission-start-btn btn font-bold py-2 px-4 ml-4">
                    Accept
                </button>
            </div>
        `).join('');

        this.renderScreen(`${cityName} - MISSIONS`, `<div class="space-y-4">${missionListHTML}</div>`, () => ui.renderCitySelect());

        // Add event listeners
        document.querySelectorAll('.mission-start-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const missionId = e.target.dataset.missionId;
                const mission = missionData.getMissionById(missionId);
                
                utils.showModal(
                    'Mission Briefing', 
                    `<div class="text-left">
                        <h4 class="font-bold text-amber-400 mb-2">${mission.title}</h4>
                        <p class="mb-4">${mission.briefing}</p>
                        <div class="bg-gray-800 p-3 rounded">
                            <p class="text-sm"><strong>Difficulty:</strong> ${mission.difficulty}</p>
                            <p class="text-sm"><strong>Reward:</strong> ${mission.reward.salary} Salary, ${mission.reward.xp} XP</p>
                            ${mission.reward.card ? `<p class="text-sm"><strong>CyberCard:</strong> ${cardData.cyberCards.find(c => c.id === mission.reward.card)?.name}</p>` : ''}
                        </div>
                    </div>`, 
                    'Start Mission', 
                    () => game.missions.startMission(missionId)
                );
            });
        });
    },

    // Render achievements screen
    renderAchievements() {
        let achievementsHTML = achievementData.achievements.map(ach => {
            const isUnlocked = gameData.player.achievements.unlocked.includes(ach.id);
            return `
                <div class="bg-gray-800 p-4 rounded-lg ${isUnlocked ? 'border-2 border-yellow-400' : 'opacity-60'}">
                    <h3 class="font-orbitron text-xl ${isUnlocked ? 'text-yellow-400' : 'text-gray-400'}">${ach.name}</h3>
                    <p class="text-sm text-gray-300 mt-1">${ach.description}</p>
                    <p class="text-sm font-bold text-green-400 mt-2">
                        ${isUnlocked ? `REWARD: ${ach.rewardText}` : 'LOCKED'}
                    </p>
                </div>
            `;
        }).join('');

        this.renderScreen('ACHIEVEMENTS', `<div class="grid grid-cols-1 md:grid-cols-2 gap-4">${achievementsHTML}</div>`, () => ui.renderHub());
    },

    // Render career profile screen
    renderCareer() {
        const toolsHTML = gameData.player.inventory.tools.map(tool => {
            const toolInfo = toolData.tools[tool.id];
            return `<li class="bg-gray-700 p-2 rounded-md">${toolInfo.name} - Lv. ${tool.level}</li>`;
        }).join('');

        const licensesHTML = gameData.player.inventory.licenses.length > 0 
            ? gameData.player.inventory.licenses.map(license => `<li class="bg-gray-700 p-2 rounded-md">${license}</li>`).join('')
            : '<li class="text-gray-500">No licenses earned yet.</li>';

        const currentRankIndex = rankData.ranks.findIndex(r => r.name === gameData.player.rank);
        const nextRank = rankData.ranks[currentRankIndex + 1];

        const contentHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div class="bg-gray-800 p-4 rounded-lg">
                    <strong class="text-indigo-400">Agent:</strong> ${gameData.player.name}
                </div>
                <div class="bg-gray-800 p-4 rounded-lg">
                    <strong class="text-indigo-400">Rank:</strong> ${gameData.player.rank}
                </div>
                <div class="bg-gray-800 p-4 rounded-lg">
                    <strong class="text-indigo-400">XP:</strong> ${gameData.player.xp} ${nextRank ? `/ ${nextRank.xpRequired}` : '(MAX)'}
                </div>
                <div class="bg-gray-800 p-4 rounded-lg">
                    <strong class="text-indigo-400">Missions Completed:</strong> ${gameData.player.missionsCompleted.total}
                </div>
                <div class="bg-gray-800 p-4 rounded-lg">
                    <strong class="text-indigo-400">Licenses Earned:</strong> ${gameData.player.inventory.licenses.length} ${nextRank ? `/ ${nextRank.licensesRequired}` : ''}
                </div>
                <div class="bg-gray-800 p-4 rounded-lg">
                    <strong class="text-indigo-400">Current Salary:</strong> ${utils.formatNumber(gameData.player.salary)}
                </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <h4 class="font-orbitron text-lg font-bold mb-2 text-cyan-400">Tools & Equipment:</h4>
                    <ul class="space-y-2">${toolsHTML}</ul>
                </div>
                <div>
                    <h4 class="font-orbitron text-lg font-bold mb-2 text-green-400">Earned Licenses:</h4>
                    <ul class="space-y-2">${licensesHTML}</ul>
                </div>
            </div>
            ${nextRank ? `
                <div class="mt-6 bg-indigo-900/50 p-4 rounded-lg border border-indigo-500">
                    <h4 class="font-orbitron text-lg font-bold text-indigo-400 mb-2">Next Promotion: ${nextRank.name}</h4>
                    <div class="space-y-2">
                        <div>
                            <p class="text-sm">XP Progress: ${gameData.player.xp} / ${nextRank.xpRequired}</p>
                            <div class="w-full bg-gray-700 rounded-full h-2">
                                <div class="bg-indigo-500 h-2 rounded-full" style="width: ${Math.min((gameData.player.xp / nextRank.xpRequired) * 100, 100)}%"></div>
                            </div>
                        </div>
                        <div>
                            <p class="text-sm">Licenses: ${gameData.player.inventory.licenses.length} / ${nextRank.licensesRequired}</p>
                            <div class="w-full bg-gray-700 rounded-full h-2">
                                <div class="bg-green-500 h-2 rounded-full" style="width: ${Math.min((gameData.player.inventory.licenses.length / nextRank.licensesRequired) * 100, 100)}%"></div>
                            </div>
                        </div>
                    </div>
                </div>
            ` : '<div class="mt-6 bg-yellow-900/50 p-4 rounded-lg border border-yellow-500"><p class="font-orbitron text-yellow-400 text-center">Maximum Rank Achieved!</p></div>'}
        `;

        this.renderScreen('CAREER PROFILE', contentHTML, () => ui.renderHub());
    },

    // Render Data Pass screen
    renderDataPass() {
        const { level, xp, isPremium } = gameData.player.dataPass;
        const xpForNextLevel = dataPassData.config.xpPerLevel;
        const progressPercent = Math.min((xp / xpForNextLevel) * 100, 100);

        let rewardsHTML = dataPassData.config.rewards.map(r => {
            const isUnlocked = level >= r.level;
            const freeClaimed = gameData.player.dataPass.claimedRewards.includes(`f_${r.level}`);
            const premiumClaimed = gameData.player.dataPass.claimedRewards.includes(`p_${r.level}`);
            
            function getRewardHTML(reward, type, isClaimed) {
                if (!reward) return '<div class="h-16"></div>';
                
                let text = '';
                let exclusiveClass = reward.isExclusive ? 'text-amber-300' : '';
                
                switch(reward.type) {
                    case 'salary': 
                        text = `💰 ${reward.value}`; 
                        break;
                    case 'tool_level': 
                        text = `🔧 ${toolData.tools[reward.toolId].name} Lvl Up`; 
                        break;
                    case 'cyberCard': 
                        const cardName = cardData.cyberCards.find(c => c.id === reward.cardId)?.name;
                        text = `<span class="${exclusiveClass}">🃏 ${cardName}</span>`; 
                        break;
                    case 'cosmetic': 
                        text = `<span class="text-amber-300">✨ Gold Visor</span>`; 
                        break;
                }
                
                return `
                    <div class="data-pass-reward ${isClaimed ? 'claimed' : ''} bg-gray-700/50 p-2 rounded h-16 flex items-center justify-center text-center text-xs font-bold">
                        ${text}
                    </div>
                    <button data-reward-id="${type}_${r.level}" class="claim-btn btn w-full mt-1 text-xs py-1" ${!isUnlocked || isClaimed ? 'disabled' : ''}>
                        ${isClaimed ? 'Claimed' : 'Claim'}
                    </button>
                `;
            }

            return `
                <div class="data-pass-level flex-shrink-0 w-32 text-center">
                    <div class="font-orbitron text-lg mb-2 h-8 flex items-center justify-center rounded-t-lg ${isUnlocked ? 'bg-indigo-500' : 'bg-gray-600'}">
                        LVL ${r.level}
                    </div>
                    <div class="p-2 space-y-2">
                        ${getRewardHTML(r.free, 'f', freeClaimed)}
                        <div class="h-px bg-gray-500"></div>
                        ${isPremium 
                            ? getRewardHTML(r.premium, 'p', premiumClaimed) 
                            : `<div class="h-16 flex items-center justify-center text-gray-400 text-xs">🔒 Premium</div>
                               <button class="btn w-full mt-1 text-xs py-1" disabled>Claim</button>`
                        }
                    </div>
                </div>
            `;
        }).join('');
        
        const contentHTML = `
            <div class="bg-gray-800 p-4 rounded-lg mb-4">
                <div class="flex justify-between items-center font-orbitron mb-2">
                    <span>Level ${level}</span>
                    <span>${xp} / ${xpForNextLevel} XP</span>
                </div>
                <div class="w-full bg-gray-700 rounded-full h-4 mt-2">
                    <div class="bg-purple-500 h-4 rounded-full transition-all duration-500" style="width: ${progressPercent}%"></div>
                </div>
                ${!isPremium ? `
                    <button id="buy-premium-pass" class="btn btn-premium w-full mt-4">
                        Unlock Premium Pass (500 Salary)
                    </button>
                ` : `
                    <p class="text-center mt-4 text-amber-400 font-bold">Premium Pass Activated ✨</p>
                `}
            </div>
            <div class="flex overflow-x-auto data-pass-track p-2 rounded-lg gap-1">
                ${rewardsHTML}
            </div>
        `;
        
        this.renderScreen('DATA PASS', contentHTML, () => ui.renderHub());
        
        if (!isPremium) {
            document.getElementById('buy-premium-pass').addEventListener('click', () => game.dataPass.buyPremium());
        }
        
        document.querySelectorAll('.claim-btn').forEach(btn => {
            btn.addEventListener('click', e => game.dataPass.claimReward(e.target.dataset.rewardId));
        });
    },

    // Render shop screen
    renderShop() {
        const toolUpgradesHTML = gameData.player.inventory.tools.map(tool => {
            const toolInfo = toolData.tools[tool.id];
            const nextLevel = toolInfo.upgrades.find(u => u.level === tool.level + 1);
            
            if (!nextLevel) {
                return `
                    <div class="bg-gray-800 p-4 rounded-lg opacity-60">
                        <div>
                            <h3 class="font-orbitron text-xl text-pink-400">${toolInfo.name}</h3>
                            <p class="text-sm text-gray-400">Max Level Reached</p>
                        </div>
                    </div>
                `;
            }
            
            const canAfford = gameData.player.salary >= nextLevel.cost;
            return `
                <div class="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                    <div>
                        <h3 class="font-orbitron text-xl text-pink-400">${toolInfo.name} Lv. ${nextLevel.level}</h3>
                        <p class="text-sm text-gray-400">${nextLevel.effect}</p>
                        <p class="font-bold mt-2">Cost: <span class="text-amber-400">${nextLevel.cost}</span></p>
                    </div>
                    <button data-tool-id="${tool.id}" class="buy-btn btn font-bold py-2 px-4" ${!canAfford ? 'disabled' : ''}>
                        Upgrade
                    </button>
                </div>
            `;
        }).join('');

        const themeUpgradesHTML = shopData.items.filter(i => i.type === 'theme').map(item => {
            const isOwned = gameData.player.settings.theme === item.value;
            const canAfford = gameData.player.salary >= item.cost;
            
            return `
                <div class="bg-gray-800 p-4 rounded-lg flex justify-between items-center ${isOwned ? 'opacity-60' : ''}">
                    <div>
                        <h3 class="font-orbitron text-xl text-pink-400">${item.name}</h3>
                        <p class="text-sm text-gray-400">${item.description}</p>
                        <p class="font-bold mt-2">Cost: <span class="text-amber-400">${item.cost}</span></p>
                    </div>
                    <button data-item-id="${item.id}" class="buy-theme-btn btn font-bold py-2 px-4" ${isOwned || !canAfford ? 'disabled' : ''}>
                        ${isOwned ? 'Equipped' : 'Buy'}
                    </button>
                </div>
            `;
        }).join('');

        const contentHTML = `
            <div class="space-y-6">
                <div>
                    <h3 class="font-orbitron text-2xl mb-4 text-pink-400">Tool Upgrades</h3>
                    <div class="space-y-4">${toolUpgradesHTML}</div>
                </div>
                <div>
                    <h3 class="font-orbitron text-2xl mb-4 text-pink-400">Hub Customization</h3>
                    <div class="space-y-4">${themeUpgradesHTML}</div>
                </div>
            </div>
        `;
        
        this.renderScreen('SHOP', contentHTML, () => ui.renderHub());
        
        document.querySelectorAll('.buy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => game.shop.purchaseUpgrade(e.target.dataset.toolId));
        });
        
        document.querySelectorAll('.buy-theme-btn').forEach(btn => {
            btn.addEventListener('click', (e) => game.shop.purchaseTheme(e.target.dataset.itemId));
        });
    },

    // Render CyberCards deck
    renderCardDeck() {
        if (gameData.player.inventory.cyberCards.length === 0) {
            this.renderScreen('CYBERCARDS', 
                `<div class="text-center mt-12">
                    <div class="text-6xl mb-4">🃏</div>
                    <h3 class="font-orbitron text-xl text-gray-400 mb-2">No CyberCards Collected</h3>
                    <p class="text-gray-400">Complete missions to earn CyberCards and expand your knowledge base.</p>
                </div>`, 
                () => ui.renderHub()
            );
            return;
        }

        let cardsHTML = gameData.player.inventory.cyberCards.map(cardId => {
            const cardInfo = cardData.cyberCards.find(c => c.id === cardId);
            const hasLicense = gameData.player.inventory.licenses.includes(cardInfo.license);
            
            return `
                <div class="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                    <div>
                        <h3 class="font-orbitron text-xl text-green-400">${cardInfo.name}</h3>
                        <p class="text-sm text-gray-400">
                            ${hasLicense 
                                ? `✅ License Earned: ${cardInfo.license}` 
                                : '📝 Quiz available to earn license'
                            }
                        </p>
                    </div>
                    <button data-card-id="${cardId}" class="card-view-btn btn font-bold py-2 px-4">
                        ${hasLicense ? 'Review' : 'Study'}
                    </button>
                </div>
            `;
        }).join('');
        
        this.renderScreen('CYBERCARDS', `<div class="space-y-4">${cardsHTML}</div>`, () => ui.renderHub());
        
        document.querySelectorAll('.card-view-btn').forEach(btn => {
            btn.addEventListener('click', e => ui.renderCardView(e.target.dataset.cardId));
        });
    },

    // Render individual card view
    renderCardView(cardId) {
        const cardInfo = cardData.cyberCards.find(c => c.id === cardId);
        const hasLicense = gameData.player.inventory.licenses.includes(cardInfo.license);
        
        const contentHTML = `
            <div class="cyber-card-container h-64 mb-6">
                <div class="cyber-card">
                    <div class="card-face card-front">
                        <div>
                            <h4 class="font-orbitron font-bold text-xl mb-4 text-indigo-400">📚 INTEL:</h4>
                            <p class="text-lg leading-relaxed">${cardInfo.content}</p>
                        </div>
                        <button id="flip-to-back-btn" class="btn self-center font-bold py-2 px-6">
                            Flip to Quiz →
                        </button>
                    </div>
                    <div class="card-face card-back">
                        <div>
                            <h4 class="font-orbitron font-bold text-xl mb-4 text-amber-400">❓ QUIZ:</h4>
                            <p class="text-lg leading-relaxed">${cardInfo.quiz.question}</p>
                        </div>
                        <button id="flip-to-front-btn" class="btn self-center font-bold py-2 px-6">
                            ← Flip to Intel
                        </button>
                    </div>
                </div>
            </div>
            <button id="take-quiz-btn" class="btn w-full font-bold py-3 mt-4" ${hasLicense ? 'disabled' : ''}>
                ${hasLicense ? '✅ License Earned' : '🎯 Take License Quiz'}
            </button>
        `;
        
        this.renderScreen(cardInfo.name, contentHTML, () => ui.renderCardDeck());
        
        const cardElement = dom.gameScreen.querySelector('.cyber-card');
        document.getElementById('flip-to-back-btn').addEventListener('click', () => {
            cardElement.classList.add('is-flipped');
        });
        document.getElementById('flip-to-front-btn').addEventListener('click', () => {
            cardElement.classList.remove('is-flipped');
        });

        if (!hasLicense) {
            document.getElementById('take-quiz-btn').addEventListener('click', () => {
                game.cards.takeQuiz(cardId);
            });
        }
    },

    // Render Special Ops (placeholder)
    renderSpecialOps() {
        const contentHTML = `
            <div class="text-center space-y-6">
                <div class="text-6xl mb-4">🚨</div>
                <h3 class="font-orbitron text-2xl text-red-400">SPECIAL OPERATIONS</h3>
                <div class="bg-red-900/30 p-6 rounded-lg border border-red-500">
                    <p class="text-lg">High-stakes weekly missions with unique gameplay mechanics.</p>
                    <p class="text-sm text-gray-400 mt-2">Feature coming in a future update...</p>
                </div>
                <div class="bg-gray-800 p-4 rounded-lg">
                    <h4 class="font-orbitron text-lg text-amber-400 mb-2">Coming Soon:</h4>
                    <ul class="text-left space-y-2 text-sm">
                        <li>• Live Stakeout missions with real-time mechanics</li>
                        <li>• Weekly rotating challenges</li>
                        <li>• Exclusive rewards and achievements</li>
                        <li>• Multiplayer cooperative missions</li>
                    </ul>
                </div>
            </div>
        `;
        
        this.renderScreen('SPECIAL OPS', contentHTML, () => ui.renderHub());
    },

    // Render Leaderboards (disabled)
    renderLeaderboards() {
        utils.showModal(
            'Feature Unavailable', 
            'Leaderboards are temporarily offline for maintenance. Please check back later.', 
            'OK'
        );
    },

    // Profile Management UI
    renderProfileManagement() {
        dom.introContainer.classList.add('hidden');
        dom.profileManagement.classList.remove('hidden');
        
        this.updateProfileList();
    },

    // Update the profile list display
    updateProfileList() {
        const profiles = utils.profiles.getAllProfiles();
        const profilesArray = Object.values(profiles).sort((a, b) => 
            new Date(b.lastPlayed || b.createdDate) - new Date(a.lastPlayed || a.createdDate)
        );

        if (profilesArray.length === 0) {
            dom.profileList.innerHTML = `
                <div class="text-center py-12">
                    <div class="text-6xl mb-4">👤</div>
                    <h3 class="font-orbitron text-xl text-gray-400 mb-2">No Profiles Found</h3>
                    <p class="text-gray-500">Create your first agent profile to begin your cybersecurity journey.</p>
                </div>
            `;
            return;
        }

        dom.profileList.innerHTML = profilesArray.map(profile => {
            const lastPlayed = profile.lastPlayed 
                ? new Date(profile.lastPlayed).toLocaleDateString()
                : 'Never';
            const createdDate = new Date(profile.createdDate).toLocaleDateString();
            
            return `
                <div class="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                    <div class="flex-grow text-left">
                        <h3 class="font-orbitron text-xl text-indigo-400">${profile.name}</h3>
                        <div class="text-sm text-gray-400 mt-1">
                            <p><strong>Rank:</strong> ${profile.gameData.rank}</p>
                            <p><strong>Salary:</strong> ${utils.formatNumber(profile.gameData.salary)}</p>
                            <p><strong>Missions:</strong> ${profile.gameData.missionsCompleted.total}</p>
                        </div>
                        <div class="text-xs text-gray-500 mt-2">
                            <p>Created: ${createdDate} • Last Played: ${lastPlayed}</p>
                        </div>
                    </div>
                    <div class="flex gap-2 ml-4">
                        <button data-profile-id="${profile.id}" class="select-profile-btn btn font-bold py-2 px-4">
                            Select
                        </button>
                        <button data-profile-id="${profile.id}" data-profile-name="${profile.name}" 
                                class="delete-profile-btn btn btn-secondary py-2 px-3 text-red-400 hover:bg-red-900">
                            🗑️
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        // Add event listeners
        document.querySelectorAll('.select-profile-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const profileId = e.target.dataset.profileId;
                game.profiles.selectProfile(profileId);
            });
        });

        document.querySelectorAll('.delete-profile-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const profileId = e.target.dataset.profileId;
                const profileName = e.target.dataset.profileName;
                game.profiles.confirmDeleteProfile(profileId, profileName);
            });
        });
    },

    // Show create profile dialog
    showCreateProfileDialog() {
        const createProfileHTML = `
            <div class="text-left">
                <h4 class="font-orbitron text-lg text-indigo-400 mb-4">Create New Agent Profile</h4>
                <label class="block text-sm font-medium text-gray-300 mb-2">Agent Name:</label>
                <input type="text" id="profile-name-input" 
                       class="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                       placeholder="Enter agent name..." maxlength="20">
                <p class="text-xs text-gray-400 mt-1">Maximum 20 characters</p>
                
                <div class="flex gap-2 mt-6">
                    <button id="create-profile-confirm" class="btn font-bold py-2 px-4 flex-1">
                        Create Profile
                    </button>
                    <button id="create-profile-cancel" class="btn btn-secondary py-2 px-4">
                        Cancel
                    </button>
                </div>
            </div>
        `;

        utils.showModal('New Agent Profile', createProfileHTML, '', () => {}, true);

        // Focus on input
        setTimeout(() => {
            const input = document.getElementById('profile-name-input');
            input?.focus();
        }, 100);

        // Add event listeners
        document.getElementById('create-profile-confirm').addEventListener('click', () => {
            const input = document.getElementById('profile-name-input');
            const profileName = input?.value?.trim();
            
            if (!profileName) {
                utils.showToast('Please enter an agent name', 'error');
                return;
            }

            const result = utils.profiles.createProfile(profileName);
            if (result.success) {
                utils.hideModal();
                this.updateProfileList();
                utils.showToast(`Profile "${profileName}" created successfully!`);
            } else {
                utils.showToast(result.error, 'error');
            }
        });

        document.getElementById('create-profile-cancel').addEventListener('click', () => {
            utils.hideModal();
        });

        // Enter key to confirm
        document.getElementById('profile-name-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                document.getElementById('create-profile-confirm').click();
            }
        });
    },

    // Return to intro screen
    returnToIntro() {
        dom.profileManagement.classList.add('hidden');
        dom.introContainer.classList.remove('hidden');
    }
};