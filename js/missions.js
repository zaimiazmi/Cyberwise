// Mission System for Cyberwise Game

const missionData = {
    // Mission definitions
    missions: [
        {
            id: 'phishing_01',
            cityId: 'inbox_isles',
            title: 'Suspicious Account Alert',
            briefing: 'A concerning email has been flagged by our monitoring systems. The sender claims to be from "Bank of Cyber" and is requesting urgent account verification. Your task is to analyze this email and identify all suspicious elements that indicate this is a phishing attempt.',
            difficulty: 'Beginner',
            reward: { 
                salary: 50, 
                xp: 100, 
                dataPassXp: 50, 
                card: 'phishing101' 
            },
            clues: [
                { 
                    id: 'sender', 
                    reason: 'The sender email domain "bo-cyber.net" is a close imitation of the real bank domain. This is called typosquatting - a common phishing tactic.' 
                },
                { 
                    id: 'salutation', 
                    reason: 'Legitimate banks use personalized greetings with your actual name. "Dear Valued Customer" is a generic salutation used in mass phishing campaigns.' 
                },
                { 
                    id: 'link', 
                    reason: 'Hovering over this link would reveal a suspicious URL that doesn\'t match the bank\'s official domain. Always verify links before clicking.' 
                },
                { 
                    id: 'urgency', 
                    reason: 'Creating false urgency is a classic social engineering technique. Legitimate institutions rarely threaten immediate account suspension.' 
                },
                { 
                    id: 'attachment', 
                    reason: 'Unexpected attachments, especially compressed files, can contain malware. Banks typically don\'t send security reports as attachments.' 
                }
            ],
            content: `
                <div class="bg-white text-black p-6 rounded-md text-left shadow-lg w-full">
                    <div class="border-b pb-2 mb-4">
                        <p><strong>From:</strong> <span class="clue" data-clue-id="sender">Bank of Cyber &lt;security-update@bo-cyber.net&gt;</span></p>
                        <p><strong>To:</strong> agent@cyberwise.com</p>
                        <p><strong>Subject:</strong> 🚨 Urgent Security Alert - Action Required</p>
                        <p class="text-sm text-gray-500"><strong>Date:</strong> Today, 2:47 PM</p>
                    </div>
                    <div class="space-y-4">
                        <p><span class="clue" data-clue-id="salutation">Dear Valued Customer,</span></p>
                        <p>We have detected unusual activity on your account from an unrecognized device. For your security, we have temporarily limited access to your account.</p>
                        <p><span class="clue" data-clue-id="urgency">You must verify your identity within 24 hours to avoid permanent account suspension.</span></p>
                        <p>Please <a href="#" class="clue text-blue-600 hover:underline" data-clue-id="link">click here to verify your account immediately</a> and restore full access.</p>
                        <p>If you do not complete verification, your account will be permanently closed and funds may be transferred to our security department.</p>
                        <hr class="my-4">
                        <p class="text-sm text-gray-600">Attachment: <span class="clue" data-clue-id="attachment">security_report_urgent.zip</span> (247 KB)</p>
                        <p class="text-xs text-gray-400">Bank of Cyber - Protecting your financial future since 1995</p>
                    </div>
                </div>`
        },
        {
            id: 'fake_profile_01',
            cityId: 'social_square',
            title: 'Influencer Investigation',
            briefing: 'A social media profile has been reported for suspicious activity. The account claims to be a cryptocurrency influencer with insider trading tips. Analyze the profile to determine if this is a legitimate influencer or a scammer targeting cryptocurrency investors.',
            difficulty: 'Beginner',
            reward: { 
                salary: 75, 
                xp: 120, 
                dataPassXp: 60, 
                card: 'fakeprofile101' 
            },
            clues: [
                { 
                    id: 'name', 
                    reason: 'Generic usernames with random numbers (like "CryptoKing_88") are commonly used by bot accounts and scammers to appear legitimate.' 
                },
                { 
                    id: 'pic', 
                    reason: 'This profile picture appears to be a stock photo or AI-generated image rather than a real person. Reverse image searching would likely reveal its artificial origin.' 
                },
                { 
                    id: 'bio', 
                    reason: 'The bio is filled with generic cryptocurrency buzzwords and promises of "guaranteed gains" - legitimate financial advisors never guarantee profits.' 
                },
                { 
                    id: 'posts', 
                    reason: 'All posts were made at the same time and only contain promotional content. Real influencers have varied content and natural posting patterns.' 
                },
                { 
                    id: 'followers', 
                    reason: 'The follower count seems inflated compared to engagement levels. Many followers are likely purchased bots.' 
                }
            ],
            content: `
                <div class="bg-white text-black p-6 rounded-md text-left shadow-lg w-full">
                    <div class="flex items-center gap-4 border-b pb-4">
                        <img src="https://placehold.co/80x80/7c3aed/ffffff?text=AI" class="clue rounded-full" data-clue-id="pic" alt="Profile picture">
                        <div class="w-full">
                            <h3 class="text-xl font-bold clue" data-clue-id="name">CryptoKing_88 ✨</h3>
                            <p class="text-sm text-gray-600"><span class="clue" data-clue-id="followers">128K followers</span> • 45 following</p>
                            <p class="text-sm text-gray-600 clue mt-2" data-clue-id="bio">🚀 Crypto Expert 💰 10x gains GUARANTEED! 💎 Premium signals = FREE MONEY! Click link below! 🔥</p>
                            <a href="#" class="text-blue-500 text-sm">🔗 crypto-gains-now.com/free-signals</a>
                        </div>
                    </div>
                    <div class="mt-4 space-y-4">
                        <p class="font-bold">Recent Posts:</p>
                        <div class="clue bg-gray-100 p-3 rounded" data-clue-id="posts">
                            <div class="mb-2">
                                <strong>CryptoKing_88</strong> • 2 hours ago
                                <br>🚨 URGENT: New coin launching in 1 HOUR! 1000x gains GUARANTEED! 
                                <br>First 100 people get my secret signals FOR FREE! 💰💰💰
                                <br>Don't miss out on this LIFE-CHANGING opportunity! 🔥🚀
                            </div>
                            <div class="mb-2">
                                <strong>CryptoKing_88</strong> • 2 hours ago
                                <br>Just made $50K in 10 minutes with my exclusive method! 💎
                                <br>My followers are getting RICH! Join now before it's too late! 📈
                            </div>
                            <div>
                                <strong>CryptoKing_88</strong> • 2 hours ago
                                <br>Banks HATE this one simple trick! Turn $100 into $10,000 OVERNIGHT! 
                                <br>Click my bio link NOW! Limited time offer! ⏰
                            </div>
                        </div>
                        <div class="text-xs text-gray-500">
                            <p>❤️ 23 likes • 💬 2 comments • 🔄 1 share</p>
                            <p>Account created: 3 days ago</p>
                        </div>
                    </div>
                </div>`
        },
        {
            id: 'data_leak_01',
            cityId: 'privacy_peaks',
            title: 'Vacation Overshare Alert',
            briefing: 'A social media user has posted a photo celebrating their new passport before an international trip. This post has been flagged by our privacy monitoring system as potentially dangerous oversharing. Identify all the sensitive information that could be exploited by identity thieves.',
            difficulty: 'Intermediate',
            reward: { 
                salary: 100, 
                xp: 150, 
                dataPassXp: 75, 
                card: 'oversharing101' 
            },
            clues: [
                { 
                    id: 'fullname', 
                    reason: 'Full legal names are personally identifiable information (PII) that can be used for identity theft, account takeovers, and social engineering attacks.' 
                },
                { 
                    id: 'passport_num', 
                    reason: 'Passport numbers are extremely sensitive government-issued identifiers. Combined with other PII, they can be used for sophisticated fraud.' 
                },
                { 
                    id: 'dob', 
                    reason: 'Date of birth is a key piece of PII used in identity verification. It\'s often used as a security question or account recovery method.' 
                },
                { 
                    id: 'nationality', 
                    reason: 'Nationality information can help scammers narrow down potential targets and craft more convincing social engineering attacks.' 
                }
            ],
            content: `
                <div class="bg-white text-black p-6 rounded-md text-left shadow-lg w-full">
                    <div class="flex items-center gap-3 mb-4">
                        <img src="https://placehold.co/50x50/3b82f6/ffffff?text=JS" class="rounded-full">
                        <div>
                            <h3 class="font-bold">Jessica Smith</h3>
                            <p class="text-sm text-gray-500">2 hours ago • 📍 Home</p>
                        </div>
                    </div>
                    <h3 class="font-bold text-lg mb-3">Finally got my new passport! Europe here I come! ✈️🌍 So excited for my solo backpacking trip!</h3>
                    <div class="mt-4 bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                        <div class="text-center mb-3">
                            <h4 class="font-bold text-blue-900">UNITED STATES OF AMERICA</h4>
                            <p class="text-sm">PASSPORT</p>
                        </div>
                        <div class="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p><strong>Type/Type:</strong> P</p>
                                <p><strong>Code/Code:</strong> USA</p>
                                <p><strong>Passport No./Passeport No.:</strong></p>
                                <p class="clue font-mono text-lg" data-clue-id="passport_num">X47291856</p>
                            </div>
                            <div>
                                <p><strong>Surname/Nom:</strong></p>
                                <p class="clue font-bold text-lg" data-clue-id="fullname">SMITH</p>
                                <p><strong>Given Names/Prénoms:</strong></p>
                                <p class="clue font-bold text-lg" data-clue-id="fullname">JESSICA MARIE</p>
                            </div>
                        </div>
                        <div class="mt-4 grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p><strong>Nationality/Nationalité:</strong></p>
                                <p class="clue" data-clue-id="nationality">UNITED STATES OF AMERICA</p>
                                <p><strong>Date of Birth/Date de naissance:</strong></p>
                                <p class="clue font-mono" data-clue-id="dob">15 MAR 1995</p>
                            </div>
                            <div>
                                <p><strong>Sex/Sexe:</strong> F</p>
                                <p><strong>Place of Birth/Lieu de naissance:</strong> CALIFORNIA, USA</p>
                                <p><strong>Date of Issue/Date de délivrance:</strong> 10 SEP 2024</p>
                                <p><strong>Date of Expiration/Date d'expiration:</strong> 09 SEP 2034</p>
                            </div>
                        </div>
                    </div>
                    <div class="mt-4 text-sm text-gray-600">
                        <p>💬 15 comments • ❤️ 42 likes • 🔄 8 shares</p>
                        <div class="mt-2">
                            <p><strong>Mom:</strong> "Be safe honey! Don't talk to strangers!"</p>
                            <p><strong>Travel_Blogger_Pro:</strong> "DM me! I have amazing deals for solo travelers! 🎒"</p>
                        </div>
                    </div>
                </div>`
        },
        {
            id: 'ransomware_01',
            cityId: 'darknet_dungeons',
            title: 'Code Red: Active Breach',
            briefing: 'EMERGENCY: A critical system is under active attack by The Glitch Mob! Our firewall is holding but showing signs of stress. You must identify the malicious process quickly before our defenses fail completely. This is a time-sensitive operation - every second counts!',
            difficulty: 'Advanced',
            reward: { 
                salary: 200, 
                xp: 250, 
                dataPassXp: 100 
            },
            clues: [
                { 
                    id: 'process', 
                    reason: 'The process "svch0st.exe" is a deliberate misspelling of the legitimate Windows process "svchost.exe". This is a common malware tactic called process hollowing.' 
                },
                { 
                    id: 'cpu_usage', 
                    reason: 'The extremely high CPU usage (95%) indicates this process is performing intensive operations, likely encryption for a ransomware attack.' 
                },
                { 
                    id: 'network_activity', 
                    reason: 'Unusual outbound network connections to suspicious domains suggest data exfiltration or command and control communication.' 
                }
            ],
            content: `
                <div class="bg-gray-900 text-white p-6 rounded-md text-left shadow-lg w-full font-mono">
                    <div class="border-b border-red-500 pb-2 mb-4">
                        <h3 class="text-red-400 font-orbitron text-lg animate-pulse">⚠️ CRITICAL ALERT: ACTIVE BREACH DETECTED ⚠️</h3>
                        <p class="text-red-300 text-sm">Threat Actor: ${gameConfig.hackerGroup.name.toUpperCase()}</p>
                        <p class="text-yellow-300 text-sm">Status: FIREWALL UNDER STRESS</p>
                    </div>
                    
                    <div id="firewall-status" class="my-4">
                        <p class="text-amber-400">Firewall Integrity:</p>
                        <div class="w-full bg-gray-700 rounded-full h-4 mt-1 border-2 border-red-500">
                            <div class="bg-green-500 h-full rounded-full transition-all duration-1000" style="width: 100%" id="firewall-bar"></div>
                        </div>
                        <p class="text-xs text-gray-400 mt-1">System automatically scanning for threats...</p>
                    </div>

                    <div class="bg-black p-3 rounded border border-gray-600">
                        <p class="text-green-400 mb-2">SYSTEM PROCESS MONITOR:</p>
                        <div class="space-y-1 text-sm">
                            <div class="flex justify-between">
                                <span>explorer.exe</span>
                                <span class="text-blue-400">CPU: 2% | MEM: 45MB | NET: 0.1KB/s</span>
                            </div>
                            <div class="flex justify-between">
                                <span>chrome.exe</span>
                                <span class="text-blue-400">CPU: 8% | MEM: 234MB | NET: 12KB/s</span>
                            </div>
                            <div class="flex justify-between clue" data-clue-id="process">
                                <span class="text-red-400">svch0st.exe</span>
                                <span class="text-red-400 clue" data-clue-id="cpu_usage">CPU: 95% | MEM: 512MB | NET: 1.2MB/s</span>
                            </div>
                            <div class="flex justify-between">
                                <span>cyberwise_agent.exe</span>
                                <span class="text-green-400">CPU: 3% | MEM: 67MB | NET: 0.5KB/s</span>
                            </div>
                            <div class="flex justify-between">
                                <span>antivirus.exe</span>
                                <span class="text-yellow-400">CPU: 15% | MEM: 123MB | NET: 2KB/s</span>
                            </div>
                        </div>
                    </div>

                    <div class="mt-4 bg-red-900/30 p-3 rounded border border-red-500">
                        <p class="text-red-400 text-xs mb-2">NETWORK ACTIVITY LOG:</p>
                        <div class="text-xs space-y-1 font-mono">
                            <p>→ svch0st.exe connecting to: <span class="clue text-red-300" data-clue-id="network_activity">darkweb-c2.onion:8080</span></p>
                            <p>→ svch0st.exe sending encrypted data packets</p>
                            <p>→ Multiple file encryption operations detected</p>
                            <p class="text-yellow-300">⚠️ WARNING: Potential ransomware activity detected</p>
                        </div>
                    </div>

                    <div class="mt-4 text-center">
                        <p class="text-red-400 animate-pulse">IDENTIFY AND NEUTRALIZE THE THREAT IMMEDIATELY!</p>
                        <p class="text-xs text-gray-400 mt-2">Click on suspicious processes to investigate</p>
                    </div>
                </div>`,
            hasFirewall: true,
            firewallDamagePerMistake: 25
        }
    ],

    // Mission state management
    currentMission: null,
    foundClues: [],
    firewallIntegrity: 100,

    // Mission utility functions
    getMissionById(id) {
        return this.missions.find(mission => mission.id === id);
    },

    getMissionsByCity(cityId) {
        return this.missions.filter(mission => mission.cityId === cityId);
    },

    resetMissionState() {
        this.currentMission = null;
        this.foundClues = [];
        this.firewallIntegrity = 100;
    }
};