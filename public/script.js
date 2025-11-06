// script.js - Frontend JavaScript for AI Art Generator

// DOM Elements
const promptInput = document.getElementById('promptInput');
const generateBtn = document.getElementById('generateBtn');
const generatedImage = document.getElementById('generatedImage');
const loadingMessage = document.getElementById('loadingMessage');
const errorMessage = document.getElementById('errorMessage');
const errorText = errorMessage.querySelector('.error-text');
const downloadBtn = document.getElementById('downloadBtn');
const placeholderState = document.getElementById('placeholderState');
const promptDisplay = document.getElementById('promptDisplay');
const promptDisplayText = promptDisplay.querySelector('.prompt-display-text');
const exampleButtons = document.querySelectorAll('.example-btn');

// API Configuration
const API_URL = '/api/generate-image';

// State
let isGenerating = false;
let currentPrompt = '';

// Initialize
function init() {
    // Add event listeners
    generateBtn.addEventListener('click', handleGenerate);
    downloadBtn.addEventListener('click', handleDownload);
    promptInput.addEventListener('keydown', handleKeyPress);
    
    // Add example button listeners
    exampleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (!isGenerating) {
                promptInput.value = btn.dataset.prompt;
                promptInput.focus();
            }
        });
    });

    // Focus on input
    promptInput.focus();
}

// Handle keyboard shortcuts
function handleKeyPress(e) {
    if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        handleGenerate();
    }
}

// Main generation function
async function handleGenerate() {
    const prompt = promptInput.value.trim();

    // Validation
    if (!prompt) {
        showError('Please enter a prompt to generate an image');
        return;
    }

    if (prompt.length > 1000) {
        showError('Prompt is too long. Please keep it under 1000 characters.');
        return;
    }

    if (isGenerating) {
        return;
    }

    // Start generation
    isGenerating = true;
    currentPrompt = prompt;
    
    // Update UI
    hideError();
    showLoading();
    disableInputs();

    try {
        // Call backend API
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success && data.image) {
            displayImage(data.image, prompt);
        } else {
            throw new Error('Invalid response from server');
        }

    } catch (error) {
        console.error('Generation error:', error);
        showError(error.message || 'Failed to generate image. Please try again.');
        hideLoading();
        showPlaceholder();
    } finally {
        isGenerating = false;
        enableInputs();
    }
}

// Display generated image
function displayImage(imageData, prompt) {
    generatedImage.src = imageData;
    generatedImage.classList.remove('hidden');
    
    promptDisplayText.textContent = `"${prompt}"`;
    promptDisplay.classList.remove('hidden');
    
    downloadBtn.classList.remove('hidden');
    
    hideLoading();
    hidePlaceholder();
}

// Download image
function handleDownload() {
    if (!generatedImage.src) return;

    const link = document.createElement('a');
    link.href = generatedImage.src;
    link.download = `ai-art-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// UI State Management
function showLoading() {
    loadingMessage.classList.remove('hidden');
    placeholderState.classList.add('hidden');
    generatedImage.classList.add('hidden');
}

function hideLoading() {
    loadingMessage.classList.add('hidden');
}

function showPlaceholder() {
    placeholderState.classList.remove('hidden');
    generatedImage.classList.add('hidden');
    promptDisplay.classList.add('hidden');
    downloadBtn.classList.add('hidden');
}

function hidePlaceholder() {
    placeholderState.classList.add('hidden');
}

function showError(message) {
    errorText.textContent = message;
    errorMessage.classList.remove('hidden');
}

function hideError() {
    errorMessage.classList.add('hidden');
    errorText.textContent = '';
}

function disableInputs() {
    promptInput.disabled = true;
    generateBtn.disabled = true;
    generateBtn.querySelector('.btn-text').textContent = 'Generating...';
    exampleButtons.forEach(btn => btn.disabled = true);
}

function enableInputs() {
    promptInput.disabled = false;
    generateBtn.disabled = false;
    generateBtn.querySelector('.btn-text').textContent = 'Generate Image';
    exampleButtons.forEach(btn => btn.disabled = false);
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}