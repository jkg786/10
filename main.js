// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadToolCategories();

    // Parallax Scrolling for Floating Icons
    const icons = document.querySelectorAll('.floating-icons .icon');
    
    // Position icons randomly
    icons.forEach(icon => {
        icon.style.left = `${Math.random() * 90}%`;
        icon.style.top = `${Math.random() * 70}%`;
        icon.style.animationDelay = `${Math.random() * 2}s`;
    });

    // Parallax effect on scroll
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        icons.forEach(icon => {
            const speed = icon.getAttribute('data-speed');
            icon.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

    // Dynamic background based on time
    const updateBackground = () => {
        const hour = new Date().getHours();
        const heroSection = document.querySelector('.hero-section');
        
        if (hour >= 6 && hour < 12) { // Morning
            heroSection.style.background = 'linear-gradient(135deg, #FF9A8B, #FF6B6B)';
        } else if (hour >= 12 && hour < 18) { // Afternoon
            heroSection.style.background = 'linear-gradient(135deg, #4ECDC4, #45B7D1)';
        } else { // Evening/Night
            heroSection.style.background = 'linear-gradient(135deg, #2C3E50, #3498DB)';
        }
    };

    updateBackground();
    setInterval(updateBackground, 1800000); // Update every 30 minutes

    // Enhanced Voice Search
    setupVoiceSearch();

    // Confetti Animation
    const freeBadge = document.querySelector('.free-badge');
    let confetti;

    freeBadge.addEventListener('mouseenter', () => {
        if (!confetti) {
            confetti = new Confetti({
                target: '.confetti-container',
                max: 80,
                size: 2,
                animate: true,
                props: ['circle', 'square', 'triangle', 'line'],
                colors: [[165, 104, 246], [230, 61, 135], [0, 199, 228], [253, 214, 126]],
                clock: 25,
                rotate: true
            });
        }
        confetti.start();
        
        // Optional sound effect
        const audio = new Audio('sounds/confetti-pop.mp3');
        audio.volume = 0.3;
        audio.play().catch(() => {}); // Ignore if autoplay is blocked
    });

    freeBadge.addEventListener('mouseleave', () => {
        if (confetti) {
            confetti.stop();
        }
    });

    // AI Search Suggestions
    const searchInput = document.querySelector('.hero-search');
    const suggestionsContainer = document.querySelector('.ai-suggestions');
    let typingTimer;

    searchInput.addEventListener('input', (e) => {
        clearTimeout(typingTimer);
        if (e.target.value) {
            typingTimer = setTimeout(() => {
                // Simulate AI suggestions
                const suggestions = [
                    'Image Resizer - Perfect for social media',
                    'PDF to Word Converter - Most popular',
                    'Video Compressor - Save space',
                ].filter(s => s.toLowerCase().includes(e.target.value.toLowerCase()));
                
                showSuggestions(suggestions);
            }, 300);
        } else {
            suggestionsContainer.innerHTML = '';
        }
    });

    // Tool Categories Data Structure
    const toolCategories = {
        'Image Tools': {
            icon: 'images/icons/image-tools.svg',
            tools: [
                { name: 'Image Resizer', icon: 'images/icons/resize.svg' },
                { name: 'Image Converter', icon: 'images/icons/convert.svg' },
                { name: 'Image Compressor', icon: 'images/icons/compress.svg' }
            ]
        },
        'Text Tools': {
            icon: 'images/icons/text-tools.svg',
            tools: [
                { name: 'Text Editor', icon: 'images/icons/edit.svg' },
                { name: 'Word Counter', icon: 'images/icons/count.svg' },
                { name: 'Case Converter', icon: 'images/icons/case.svg' }
            ]
        }
        // Add more categories as needed
    };

    // Initialize the application
    class App {
        constructor() {
            this.searchInput = null;
            this.searchSuggestions = null;
            this.init();
        }

        init() {
            document.addEventListener('DOMContentLoaded', () => {
                this.searchInput = document.querySelector('.search-input');
                this.searchSuggestions = document.querySelector('.search-suggestions');
                this.initializeSearch();
                this.initializeCategories();
                this.updateMostUsedTools();
            });
        }

        initializeSearch() {
            if (this.searchInput) {
                this.searchInput.addEventListener('input', this.handleSearch.bind(this));
                document.addEventListener('click', (event) => {
                    if (!this.searchInput.contains(event.target) && !this.searchSuggestions.contains(event.target)) {
                        this.searchSuggestions.style.display = 'none';
                    }
                });
            }
        }

        initializeCategories() {
            document.querySelectorAll('.category-header').forEach(header => {
                header.addEventListener('click', () => {
                    const content = header.nextElementSibling;
                    const isExpanded = header.getAttribute('aria-expanded') === 'true';
                    
                    header.setAttribute('aria-expanded', !isExpanded);
                    content.style.display = isExpanded ? 'none' : 'block';
                    
                    // Smooth height animation
                    if (!isExpanded) {
                        const height = content.scrollHeight;
                        content.style.height = '0px';
                        content.offsetHeight; // Force reflow
                        content.style.height = height + 'px';
                    } else {
                        content.style.height = '0px';
                    }
                });
            });
        }

        debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func.apply(this, args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }

        handleSearch = this.debounce((event) => {
            const searchTerm = event.target.value.trim();
            if (searchTerm.length === 0) {
                this.searchSuggestions.style.display = 'none';
                return;
            }
            const suggestions = this.filterTools(searchTerm);
            this.displaySearchSuggestions(suggestions);
        }, 300);

        filterTools(searchTerm) {
            const results = [];
            Object.entries(toolCategories).forEach(([category, data]) => {
                data.tools.forEach(tool => {
                    if (tool.name.toLowerCase().includes(searchTerm.toLowerCase())) {
                        results.push({
                            ...tool,
                            category
                        });
                    }
                });
            });
            return results;
        }

        displaySearchSuggestions(suggestions) {
            if (!this.searchSuggestions) return;
            
            this.searchSuggestions.innerHTML = '';
            
            if (suggestions.length === 0) {
                this.searchSuggestions.style.display = 'none';
                return;
            }

            suggestions.forEach(suggestion => {
                const div = document.createElement('div');
                div.className = 'suggestion-item';
                div.innerHTML = `
                    <img src="${suggestion.icon}" alt="${suggestion.name} icon">
                    <div class="suggestion-info">
                        <span class="tool-name">${suggestion.name}</span>
                        <span class="tool-category">${suggestion.category}</span>
                    </div>
                `;
                div.addEventListener('click', () => {
                    window.location.href = `/${suggestion.name.toLowerCase().replace(/\s+/g, '-')}`;
                });
                this.searchSuggestions.appendChild(div);
            });
            
            this.searchSuggestions.style.display = 'block';
        }

        trackToolUsage(toolName) {
            let toolUsage = JSON.parse(localStorage.getItem('toolUsage') || '{}');
            toolUsage[toolName] = (toolUsage[toolName] || 0) + 1;
            localStorage.setItem('toolUsage', JSON.stringify(toolUsage));
            this.updateMostUsedTools();
        }

        updateMostUsedTools() {
            const mostUsedSection = document.querySelector('.most-used-tools');
            if (!mostUsedSection) return;

            const toolUsage = JSON.parse(localStorage.getItem('toolUsage') || '{}');
            const sortedTools = Object.entries(toolUsage)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 6);

            if (sortedTools.length > 0) {
                mostUsedSection.innerHTML = sortedTools.map(([name, uses]) => {
                    const tool = this.findToolByName(name);
                    return `
                        <div class="tool-card">
                            <img src="${tool?.icon || 'images/icons/default.svg'}" alt="${name} icon">
                            <h3>${name}</h3>
                            <p>Used ${uses} times</p>
                        </div>
                    `;
                }).join('');
            }
        }

        findToolByName(name) {
            for (const [category, data] of Object.entries(toolCategories)) {
                const tool = data.tools.find(t => t.name === name);
                if (tool) return tool;
            }
            return null;
        }
    }

    // Initialize the application
    const app = new App();
});

// Tool Categories Data
const toolCategories = [
    {
        id: 'image-tools',
        name: 'Image Tools',
        icon: 'fas fa-image',
        tools: [
            { name: 'Image to PNG', url: 'tools/image-to-png.html' },
            { name: 'Image to JPG', url: 'tools/image-to-jpg.html' },
            { name: 'Image Resizer', url: 'tools/image-resizer.html' }
        ]
    },
    {
        id: 'text-tools',
        name: 'Text Tools',
        icon: 'fas fa-font',
        tools: [
            { name: 'Text to Speech', url: 'tools/text-to-speech.html' },
            { name: 'Word Counter', url: 'tools/word-counter.html' },
            { name: 'Case Converter', url: 'tools/case-converter.html' }
        ]
    },
    // Add more categories as needed
];

// Load Tool Categories
function loadToolCategories() {
    const categoriesContainer = document.getElementById('toolCategories');
    categoriesContainer.innerHTML = toolCategories.map(category => `
        <div class="col-md-4 col-lg-3">
            <div class="tool-category-card" data-category="${category.id}">
                <i class="${category.icon} tool-category-icon"></i>
                <h3>${category.name}</h3>
                <p>${category.tools.length} tools</p>
            </div>
        </div>
    `).join('');

    // Add click event listeners
    document.querySelectorAll('.tool-category-card').forEach(card => {
        card.addEventListener('click', () => {
            const categoryId = card.dataset.category;
            const category = toolCategories.find(c => c.id === categoryId);
            if (category) {
                showCategoryTools(category);
            }
        });
    });
}

// Search Functionality
const toolSearch = document.getElementById('toolSearch');
const voiceSearch = document.getElementById('voiceSearch');

toolSearch.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    filterTools(searchTerm);
});

// Voice Search
if ('webkitSpeechRecognition' in window) {
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    voiceSearch.addEventListener('click', () => {
        recognition.start();
        voiceSearch.classList.add('active');
    });

    recognition.onresult = (event) => {
        const searchTerm = event.results[0][0].transcript.toLowerCase();
        toolSearch.value = searchTerm;
        filterTools(searchTerm);
    };

    recognition.onend = () => {
        voiceSearch.classList.remove('active');
    };
}

// Filter Tools
function filterTools(searchTerm) {
    const allTools = toolCategories.flatMap(category => 
        category.tools.map(tool => ({
            ...tool,
            category: category.name
        }))
    );

    const filteredTools = allTools.filter(tool => 
        tool.name.toLowerCase().includes(searchTerm) ||
        tool.category.toLowerCase().includes(searchTerm)
    );

    displaySearchResults(filteredTools);
}

// Display Search Results
function displaySearchResults(tools) {
    const resultsContainer = document.createElement('div');
    resultsContainer.className = 'search-results mt-3';
    
    if (tools.length === 0) {
        resultsContainer.innerHTML = '<p class="text-center">No tools found</p>';
    } else {
        resultsContainer.innerHTML = tools.map(tool => `
            <div class="search-result-item p-2">
                <a href="${tool.url}" class="text-decoration-none">
                    <h5>${tool.name}</h5>
                    <small class="text-muted">${tool.category}</small>
                </a>
            </div>
        `).join('');
    }

    const existingResults = document.querySelector('.search-results');
    if (existingResults) {
        existingResults.remove();
    }

    toolSearch.parentNode.appendChild(resultsContainer);
}

// Show Category Tools
function showCategoryTools(category) {
    const toolsContainer = document.createElement('div');
    toolsContainer.className = 'category-tools mt-4';
    
    toolsContainer.innerHTML = `
        <h3 class="mb-4">${category.name}</h3>
        <div class="row g-4">
            ${category.tools.map(tool => `
                <div class="col-md-4">
                    <div class="tool-card">
                        <a href="${tool.url}" class="text-decoration-none">
                            <h5>${tool.name}</h5>
                        </a>
                    </div>
                </div>
            `).join('')}
        </div>
    `;

    const existingTools = document.querySelector('.category-tools');
    if (existingTools) {
        existingTools.remove();
    }

    document.querySelector('.tool-categories').appendChild(toolsContainer);
}

// Translation Function
function translatePage(language) {
    // This is a placeholder for translation functionality
    // In a real implementation, you would load translation files and update the content
    console.log(`Translating to ${language}`);
}

// Category Preview Carousel
document.querySelectorAll('.category-card').forEach(card => {
    let isHovered = false;
    
    card.addEventListener('mouseenter', () => {
        isHovered = true;
        rotatePreview(card);
    });

    card.addEventListener('mouseleave', () => {
        isHovered = false;
    });

    function rotatePreview(card) {
        if (!isHovered) return;
        
        const carousel = card.querySelector('.preview-carousel');
        carousel.style.transform = 'translateX(-50%)';
        
        setTimeout(() => {
            carousel.style.transition = 'none';
            carousel.style.transform = 'translateX(0)';
            setTimeout(() => {
                carousel.style.transition = 'transform 0.5s ease';
                if (isHovered) {
                    rotatePreview(card);
                }
            }, 50);
        }, 2000);
    }
});

// Show message to user
function showMessage(message, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `alert alert-${type} alert-dismissible fade show message-popup`;
    messageDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// Show suggestions
function showSuggestions(suggestions) {
    suggestionsContainer.innerHTML = suggestions
        .map(s => `<div class="suggestion-item">${s}</div>`)
        .join('');
}

// Setup Voice Search
function setupVoiceSearch() {
    const voiceButton = document.querySelector('.voice-search-btn');
    const searchInput = document.querySelector('.hero-search');
    const searchBtn = document.querySelector('.search-btn');
    
    // Handle search button click
    searchBtn.addEventListener('click', () => {
        performSearch(searchInput.value);
    });

    // Handle voice search
    if ('webkitSpeechRecognition' in window) {
        const recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US'; // Set default language

        voiceButton.addEventListener('click', async () => {
            try {
                // Request microphone permission
                await navigator.mediaDevices.getUserMedia({ audio: true });
                
                recognition.start();
                voiceButton.classList.add('listening');
                
                // Show feedback to user
                showMessage('Listening...', 'info');
            } catch (err) {
                showMessage('Please enable microphone access in your browser settings', 'error');
            }
        });

        recognition.onresult = (event) => {
            const text = event.results[0][0].transcript;
            searchInput.value = text;
            performSearch(text);
        };

        recognition.onend = () => {
            voiceButton.classList.remove('listening');
        };

        recognition.onerror = (event) => {
            if (event.error === 'not-allowed') {
                showMessage('Microphone access was denied. Please enable it in your browser settings.', 'error');
            }
            voiceButton.classList.remove('listening');
        };
    } else {
        voiceButton.style.display = 'none';
        showMessage('Voice search is not supported in your browser', 'warning');
    }
}

// Perform search
function performSearch(query) {
    if (!query.trim()) return;
    
    // Add loading state
    const searchBtn = document.querySelector('.search-btn');
    searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    
    // Simulate search (replace with actual search logic)
    setTimeout(() => {
        searchBtn.innerHTML = '<i class="fas fa-search"></i>';
        filterTools(query);
    }, 500);
} 