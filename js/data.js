// Game Data and Configuration for Cyberwise

// Player Data Model
const gameData = {
    player: {
        name: 'Agent',
        rank: 'Digital Intern',
        salary: 100,
        xp: 0,
        missionsCompleted: { total: 0, byCity: {} },
        inventory: {
            tools: [{ id: 'phishsniffer', level: 1 }],
            cyberCards: [],
            licenses: []
        },
        dataPass: {
            level: 1,
            xp: 0,
            isPremium: false,
            claimedRewards: []
        },
        achievements: {
            unlocked: [],
        },
        settings: {
            theme: 'default'
        },
        lastLoginDate: null,
        specialOps: {
            lastCompletedWeek: null
        }
    }
};

// Game Configuration
const gameConfig = {
    changelog: [
        {
            version: 'V1.0 - The Launch Update',
            date: 'Sep 26, 2025',
            changes: [
                '🎉 **Say hello to Cyberwise! Launched!**',
                '🚀 **Complete Professional Restructuring**: Modular architecture with organized file structure',
                '👥 **Multi-Profile System**: Create and manage multiple agent profiles with isolated save data',
                '💾 **Advanced Save System**: Auto-save every 30 seconds with comprehensive data persistence',
                '🎨 **Enhanced UI/UX**: Professional styling with smooth animations and responsive design',
                '🛡️ **Comprehensive Backup System**: Complete project backup created for future development',
                '📚 **Educational Content**: 4 detailed cybersecurity missions with real-world scenarios',
                '🏆 **Achievement System**: Track progress with unlockable achievements and ranks',
                '⚙️ **Theme System**: 5 customizable themes for personalized experience'
            ]
        },
        {
            version: 'v5.1 - The Stability Update',
            date: 'Aug 13, 2025',
            changes: [
                '**Leaderboards** and **Agent Naming** are temporarily disabled for maintenance.',
                'Fixed a critical error that prevented the game from starting.',
                'Restored the **CyberCards** button to the Agent Dashboard.'
            ]
        },
        {
            version: 'v5.0 - The Live Ops Update',
            date: 'Aug 12, 2025',
            changes: [
                'Added **Special Ops**: High-stakes weekly missions with unique gameplay.',
                'New Special Op Mission: **Live Stakeout** with a real-time Trust Meter mechanic.',
                'Added **Agency Leaderboards** to track agent rankings.',
                'Added **Hub Customization** to the Shop with selectable color themes.',
                'Introduced rival hacker group: **The Glitch Mob**.',
                'Added random **"Code Red"** events and hacker messages after missions.'
            ]
        },
        {
            version: 'v4.0 - The Narrative Update',
            date: 'Aug 11, 2025',
            changes: [
                'Added a new cinematic intro sequence.',
                'Implemented a full Achievements system with passive bonuses.',
                'Added a Daily Login Bonus system.',
                'Expanded the world with the "Darknet Dungeons" city and a "Ransomware" mission.'
            ]
        }
    ],

    themes: {
        default: { 
            name: 'Default Indigo', 
            color: '#4f46e5', 
            light: '#6366f1', 
            shadow: 'rgba(79, 70, 229, 0.5)', 
            transparent: 'rgba(79, 70, 229, 0.3)'
        },
        matrix: { 
            name: 'Matrix Green', 
            color: '#16a34a', 
            light: '#22c55e', 
            shadow: 'rgba(22, 163, 74, 0.5)', 
            transparent: 'rgba(22, 163, 74, 0.3)'
        },
        danger: { 
            name: 'Danger Red', 
            color: '#dc2626', 
            light: '#ef4444', 
            shadow: 'rgba(220, 38, 38, 0.5)', 
            transparent: 'rgba(220, 38, 38, 0.3)'
        },
        cyber: {
            name: 'Cyber Purple',
            color: '#7c3aed',
            light: '#8b5cf6',
            shadow: 'rgba(124, 58, 237, 0.5)',
            transparent: 'rgba(124, 58, 237, 0.3)'
        },
        gold: {
            name: 'Golden Agent',
            color: '#d97706',
            light: '#f59e0b',
            shadow: 'rgba(217, 119, 6, 0.5)',
            transparent: 'rgba(217, 119, 6, 0.3)'
        }
    },

    hackerGroup: {
        name: "The Glitch Mob",
        messages: [
            "Your firewalls are like paper. Pathetic.",
            "We see you, agent. And we're not impressed.",
            "Was that supposed to be a challenge? Try harder.",
            "Every system has a backdoor. We just found yours.",
            "Nice try, but you're always one step behind.",
            "Security through obscurity? How amateur.",
            "We've been watching you. Impressive... for a beginner."
        ]
    }
};

// Shop Items
const shopData = {
    items: [
        { 
            id: 'theme_default', 
            name: 'Default Indigo Theme', 
            description: 'The standard issue Cyberwise agent theme.', 
            cost: 0, 
            type: 'theme', 
            value: 'default' 
        },
        { 
            id: 'theme_matrix', 
            name: 'Matrix Green Theme', 
            description: 'For agents who like the classic hacker vibe.', 
            cost: 300, 
            type: 'theme', 
            value: 'matrix' 
        },
        { 
            id: 'theme_danger', 
            name: 'Danger Red Theme', 
            description: 'A high-alert theme for seasoned veterans.', 
            cost: 300, 
            type: 'theme', 
            value: 'danger' 
        },
        { 
            id: 'theme_cyber', 
            name: 'Cyber Purple Theme', 
            description: 'A mystical theme for advanced agents.', 
            cost: 500, 
            type: 'theme', 
            value: 'cyber' 
        },
        { 
            id: 'theme_gold', 
            name: 'Golden Agent Theme', 
            description: 'An elite theme for master agents.', 
            cost: 750, 
            type: 'theme', 
            value: 'gold' 
        }
    ]
};

// Leaderboards (Demo Data)
const leaderboardData = {
    missions: [
        { name: 'Agent Zero', score: 15 },
        { name: 'Cypher', score: 12 },
        { name: 'Glitch', score: 9 },
        { name: 'Proxy', score: 5 }
    ],
    salary: [
        { name: 'Agent Zero', score: 10500 },
        { name: 'Cypher', score: 8200 },
        { name: 'Glitch', score: 6500 },
        { name: 'Proxy', score: 3000 }
    ]
};

// Achievement System
const achievementData = {
    achievements: [
        { 
            id: 'scam_spotter', 
            name: 'Scam Spotter', 
            description: 'Complete 2 missions in Inbox Isles.', 
            rewardText: '+10% Salary from Inbox Isles missions.', 
            condition: (p) => (p.missionsCompleted.byCity['inbox_isles'] || 0) >= 2 
        },
        { 
            id: 'junior_agent', 
            name: 'Junior Analyst', 
            description: 'Get promoted to Junior Analyst.', 
            rewardText: 'Unlocks Social Square.', 
            condition: (p) => rankData.ranks.findIndex(r => r.name === p.rank) >= 1 
        },
        { 
            id: 'master_of_disguise', 
            name: 'Master of Disguise', 
            description: 'Complete 2 missions in Social Square.', 
            rewardText: '+10% Salary from Social Square missions.', 
            condition: (p) => (p.missionsCompleted.byCity['social_square'] || 0) >= 2 
        },
        { 
            id: 'privacy_guardian', 
            name: 'Privacy Guardian', 
            description: 'Complete 3 missions in Privacy Peaks.', 
            rewardText: '+15% Salary from Privacy Peaks missions.', 
            condition: (p) => (p.missionsCompleted.byCity['privacy_peaks'] || 0) >= 3 
        },
        { 
            id: 'elite_defender', 
            name: 'Elite Defender', 
            description: 'Complete 2 missions in Darknet Dungeons.', 
            rewardText: '+20% Salary from Darknet Dungeons missions.', 
            condition: (p) => (p.missionsCompleted.byCity['darknet_dungeons'] || 0) >= 2 
        }
    ]
};

// Data Pass Configuration
const dataPassData = {
    config: {
        xpPerLevel: 100,
        rewards: [
            { 
                level: 1, 
                free: { type: 'salary', value: 50 }, 
                premium: { type: 'tool_level', toolId: 'phishsniffer' } 
            },
            { 
                level: 2, 
                free: { type: 'cyberCard', cardId: 'phishing101' }, 
                premium: { type: 'salary', value: 200 } 
            },
            { 
                level: 3, 
                free: { type: 'salary', value: 100 }, 
                premium: { type: 'tool_level', toolId: 'socialscope' } 
            },
            { 
                level: 4, 
                free: { type: 'cyberCard', cardId: 'fakeprofile101' }, 
                premium: { type: 'cyberCard', cardId: 'malware101', isExclusive: true } 
            },
            { 
                level: 5, 
                free: { type: 'salary', value: 250 }, 
                premium: { type: 'cosmetic', id: 'gold_visor' } 
            }
        ]
    }
};

// Rank System
const rankData = {
    ranks: [
        { name: 'Digital Intern', xpRequired: 0, licensesRequired: 0 },
        { name: 'Junior Analyst', xpRequired: 100, licensesRequired: 1 },
        { name: 'Threat Investigator', xpRequired: 300, licensesRequired: 2 },
        { name: 'Senior Agent', xpRequired: 700, licensesRequired: 3 },
        { name: 'Cyber Guardian', xpRequired: 1500, licensesRequired: 5 }
    ]
};

// Tool System
const toolData = {
    tools: {
        phishsniffer: { 
            name: 'PhishSniff™', 
            description: 'Highlights suspicious links and domains.', 
            upgrades: [ 
                { level: 1, cost: 0, effect: 'Base version.' }, 
                { level: 2, cost: 150, effect: '+10% salary from email missions.' }, 
                { level: 3, cost: 400, effect: 'Auto-detects 1 clue in email missions.' } 
            ] 
        },
        socialscope: { 
            name: 'SocialScope™', 
            description: 'Flags bot-like behavior in profiles.', 
            upgrades: [ 
                { level: 1, cost: 0, effect: 'Base version.' }, 
                { level: 2, cost: 200, effect: '+10% salary from profile missions.' },
                { level: 3, cost: 450, effect: 'Reveals hidden social patterns.' }
            ] 
        },
        leaktracker: { 
            name: 'LeakTracker™', 
            description: 'Reveals exposed personal data.', 
            upgrades: [ 
                { level: 1, cost: 0, effect: 'Base version.' },
                { level: 2, cost: 300, effect: '+15% salary from privacy missions.' }
            ] 
        },
        firewallforge: { 
            name: 'FirewallForge™', 
            description: 'Strengthens firewall for high-risk missions.', 
            upgrades: [ 
                { level: 1, cost: 0, effect: 'Base version.' },
                { level: 2, cost: 500, effect: 'Reduces firewall damage by 50%.' }
            ] 
        }
    }
};

// City/Location System
const locationData = {
    cities: [
        { 
            id: 'inbox_isles', 
            name: 'Inbox Isles', 
            unlocked: true, 
            toolUnlock: 'phishsniffer', 
            description: 'A sector plagued by phishing emails and malicious attachments.' 
        },
        { 
            id: 'social_square', 
            name: 'Social Square', 
            unlocked: false, 
            rankRequired: 'Junior Analyst', 
            toolUnlock: 'socialscope', 
            description: 'A bustling hub where fake profiles and misinformation run rampant.' 
        },
        { 
            id: 'privacy_peaks', 
            name: 'Privacy Peaks', 
            unlocked: false, 
            rankRequired: 'Threat Investigator', 
            toolUnlock: 'leaktracker', 
            description: 'A treacherous zone of data overexposure and privacy violations.' 
        },
        { 
            id: 'darknet_dungeons', 
            name: 'Darknet Dungeons', 
            unlocked: false, 
            rankRequired: 'Senior Agent', 
            toolUnlock: 'firewallforge', 
            description: 'High-stakes missions against active threats.' 
        }
    ]
};

// CyberCards System
const cardData = {
    cyberCards: [
        { 
            id: 'phishing101', 
            name: 'Phishing 101', 
            content: 'Phishing is a cyberattack that uses disguised email as a weapon. Attackers impersonate trusted entities to steal sensitive information like passwords, credit card numbers, and personal data.',
            quiz: { 
                question: 'Phishing attacks can only happen through email.', 
                options: ['True', 'False'], 
                answer: 'False' 
            }, 
            license: 'Phishing Basics' 
        },
        { 
            id: 'fakeprofile101', 
            name: 'Fake Profiles 101', 
            content: 'Fake profiles often use stolen photos and have very few friends or interactions. They may have generic names, incomplete information, and post promotional content frequently.',
            quiz: { 
                question: 'A profile with many followers is always legitimate.', 
                options: ['True', 'False'], 
                answer: 'False' 
            }, 
            license: 'Social Media Literacy' 
        },
        { 
            id: 'oversharing101', 
            name: 'Oversharing 101', 
            content: 'Posting sensitive information like your address, phone number, or financial details online is called oversharing and can lead to identity theft, stalking, and financial fraud.',
            quiz: { 
                question: 'Is it safe to post a picture of your new driver\'s license on social media?', 
                options: ['True', 'False'], 
                answer: 'False' 
            }, 
            license: 'Data Privacy Fundamentals' 
        },
        { 
            id: 'malware101', 
            name: 'Advanced Malware', 
            content: 'Malware can hide in legitimate-looking files and exploit system vulnerabilities to steal data, encrypt files for ransom, or create backdoors for unauthorized access.',
            quiz: { 
                question: 'All free software from the internet is safe to install.', 
                options: ['True', 'False'], 
                answer: 'False' 
            }, 
            license: 'Malware Analysis' 
        },
        { 
            id: 'passwords101', 
            name: 'Password Security', 
            content: 'Strong passwords use a combination of uppercase, lowercase, numbers, and special characters. Password managers help create and store unique passwords for each account.',
            quiz: { 
                question: 'Using the same password for multiple accounts is acceptable if it\'s strong.', 
                options: ['True', 'False'], 
                answer: 'False' 
            }, 
            license: 'Authentication Security' 
        }
    ]
};