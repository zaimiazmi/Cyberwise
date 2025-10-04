// Utility Functions for Cyberwise Game

// DOM Element Cache
const dom = {
    // Main containers
    introContainer: document.getElementById('intro-container'),
    profileManagement: document.getElementById('profile-management'),
    profileList: document.getElementById('profile-list'),
    gameContainer: document.getElementById('game-container'),
    gameScreen: document.getElementById('game-screen'),
    gameHeader: document.getElementById('game-header'),
    
    // HUD elements
    rankValue: document.getElementById('rank-value'),
    coinsValue: document.getElementById('coins-value'),
    
    // Modal elements
    modal: document.getElementById('modal'),
    modalContent: document.getElementById('modal-content'),
    modalTitle: document.getElementById('modal-title'),
    modalText: document.getElementById('modal-text'),
    modalButton: document.getElementById('modal-button'),
    
    // Mission progress
    missionProgress: document.getElementById('mission-progress'),
    cluesFoundCount: document.getElementById('clues-found-count'),
    cluesTotalCount: document.getElementById('clues-total-count'),
    progressBar: document.getElementById('progress-bar'),
    
    // Notifications
    toast: document.getElementById('toast')
};

// Utility Functions
const utils = {
    // Show toast notification
    showToast(message, type = 'success', duration = 3000) {
        const toast = dom.toast;
        toast.textContent = message;
        toast.className = `toast-notification absolute bottom-5 left-1/2 -translate-x-1/2 text-white py-2 px-4 rounded-lg shadow-lg`;
        
        // Set color based on type
        switch (type) {
            case 'success':
                toast.classList.add('bg-green-500');
                break;
            case 'error':
                toast.classList.add('bg-red-500');
                break;
            case 'warning':
                toast.classList.add('bg-yellow-500');
                break;
            case 'info':
                toast.classList.add('bg-blue-500');
                break;
            default:
                toast.classList.add('bg-green-500');
        }
        
        toast.classList.remove('hidden');
        setTimeout(() => toast.classList.add('hidden'), duration);
    },

    // Show modal dialog
    showModal(title, text, buttonText, callback, isQuiz = false) {
        dom.modalTitle.textContent = title;
        dom.modalText.innerHTML = text;
        dom.modalButton.textContent = buttonText;
        dom.modal.classList.remove('hidden');

        if (isQuiz) {
            dom.modalButton.classList.add('hidden');
        } else {
            dom.modalButton.classList.remove('hidden');
            // Remove old event listeners by cloning the button
            let newButton = dom.modalButton.cloneNode(true);
            dom.modalButton.parentNode.replaceChild(newButton, dom.modalButton);
            dom.modalButton = newButton;
            
            dom.modalButton.addEventListener('click', () => {
                dom.modal.classList.add('hidden');
                if (callback) callback();
            }, { once: true });
        }
    },

    // Hide modal
    hideModal() {
        dom.modal.classList.add('hidden');
    },

    // Update HUD display
    updateHUD() {
        dom.rankValue.textContent = gameData.player.rank;
        dom.coinsValue.textContent = gameData.player.salary.toLocaleString();
    },

    // Apply theme to the game
    applyTheme() {
        const theme = gameConfig.themes[gameData.player.settings.theme];
        const gameContainer = dom.gameContainer;
        
        gameContainer.style.setProperty('--theme-color', theme.color);
        gameContainer.style.setProperty('--theme-color-light', theme.light);
        gameContainer.style.setProperty('--theme-shadow', theme.shadow);
        gameContainer.style.setProperty('--theme-transparent', theme.transparent);
    },

    // Format numbers with appropriate suffixes
    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    },

    // Get current week number (for special ops)
    getWeekNumber(d = new Date()) {
        const date = new Date(d.getTime());
        date.setHours(0, 0, 0, 0);
        date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
        const week1 = new Date(date.getFullYear(), 0, 4);
        return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
    },

    // Random array element selector
    randomChoice(array) {
        return array[Math.floor(Math.random() * array.length)];
    },

    // Debounce function for performance
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Local storage helpers
    storage: {
        save(key, data) {
            try {
                localStorage.setItem(`cyberwise_${key}`, JSON.stringify(data));
                return true;
            } catch (error) {
                console.error('Failed to save to localStorage:', error);
                return false;
            }
        },

        load(key) {
            try {
                const data = localStorage.getItem(`cyberwise_${key}`);
                return data ? JSON.parse(data) : null;
            } catch (error) {
                console.error('Failed to load from localStorage:', error);
                return null;
            }
        },

        remove(key) {
            try {
                localStorage.removeItem(`cyberwise_${key}`);
                return true;
            } catch (error) {
                console.error('Failed to remove from localStorage:', error);
                return false;
            }
        },

        clear() {
            try {
                const keys = Object.keys(localStorage).filter(key => key.startsWith('cyberwise_'));
                keys.forEach(key => localStorage.removeItem(key));
                return true;
            } catch (error) {
                console.error('Failed to clear localStorage:', error);
                return false;
            }
        }
    },

    // Profile management system
    profiles: {
        // Get all saved profiles
        getAllProfiles() {
            const profiles = utils.storage.load('profiles') || {};
            return profiles;
        },

        // Save all profiles
        saveAllProfiles(profiles) {
            return utils.storage.save('profiles', profiles);
        },

        // Create a new profile
        createProfile(profileName) {
            if (!profileName || profileName.trim() === '') {
                return { success: false, error: 'Profile name cannot be empty' };
            }

            const profiles = this.getAllProfiles();
            const profileId = 'profile_' + Date.now();
            
            // Check if name already exists
            const nameExists = Object.values(profiles).some(p => p.name.toLowerCase() === profileName.toLowerCase());
            if (nameExists) {
                return { success: false, error: 'Profile name already exists' };
            }

            // Create new profile with default data
            const newProfile = {
                id: profileId,
                name: profileName.trim(),
                createdDate: new Date().toISOString(),
                lastPlayed: null,
                gameData: {
                    name: profileName.trim(),
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

            profiles[profileId] = newProfile;
            this.saveAllProfiles(profiles);
            
            return { success: true, profileId, profile: newProfile };
        },

        // Delete a profile
        deleteProfile(profileId) {
            const profiles = this.getAllProfiles();
            if (!profiles[profileId]) {
                return { success: false, error: 'Profile not found' };
            }

            delete profiles[profileId];
            this.saveAllProfiles(profiles);
            
            // Also remove from active profile if it was selected
            const activeProfile = utils.storage.load('activeProfile');
            if (activeProfile === profileId) {
                utils.storage.remove('activeProfile');
            }

            return { success: true };
        },

        // Set active profile
        setActiveProfile(profileId) {
            const profiles = this.getAllProfiles();
            if (!profiles[profileId]) {
                return { success: false, error: 'Profile not found' };
            }

            utils.storage.save('activeProfile', profileId);
            profiles[profileId].lastPlayed = new Date().toISOString();
            this.saveAllProfiles(profiles);
            
            return { success: true, profile: profiles[profileId] };
        },

        // Get active profile
        getActiveProfile() {
            const activeProfileId = utils.storage.load('activeProfile');
            if (!activeProfileId) return null;

            const profiles = this.getAllProfiles();
            return profiles[activeProfileId] || null;
        },

        // Update profile data
        updateProfile(profileId, gameData) {
            const profiles = this.getAllProfiles();
            if (!profiles[profileId]) {
                return { success: false, error: 'Profile not found' };
            }

            profiles[profileId].gameData = gameData;
            profiles[profileId].lastPlayed = new Date().toISOString();
            this.saveAllProfiles(profiles);
            
            return { success: true };
        },

        // Get profile count
        getProfileCount() {
            return Object.keys(this.getAllProfiles()).length;
        }
    },

    // Animation helpers
    animations: {
        fadeIn(element, duration = 300) {
            element.style.opacity = '0';
            element.style.display = 'block';
            
            const start = performance.now();
            const animate = (currentTime) => {
                const elapsed = currentTime - start;
                const progress = Math.min(elapsed / duration, 1);
                
                element.style.opacity = progress.toString();
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };
            
            requestAnimationFrame(animate);
        },

        fadeOut(element, duration = 300) {
            const start = performance.now();
            const initialOpacity = parseFloat(getComputedStyle(element).opacity);
            
            const animate = (currentTime) => {
                const elapsed = currentTime - start;
                const progress = Math.min(elapsed / duration, 1);
                
                element.style.opacity = (initialOpacity * (1 - progress)).toString();
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    element.style.display = 'none';
                }
            };
            
            requestAnimationFrame(animate);
        }
    },

    // Validation helpers
    validation: {
        isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        },

        isValidUrl(url) {
            try {
                new URL(url);
                return true;
            } catch {
                return false;
            }
        },

        sanitizeHTML(str) {
            const div = document.createElement('div');
            div.textContent = str;
            return div.innerHTML;
        }
    }
};