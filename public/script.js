/*
 * AI Art Generator - Client-Side JavaScript
 * This script handles all frontend logic:
 * 1. Capturing user input.
 * 2. Communicating with the backend server.
 * 3. Managing all UI states (loading, error, success).
 * 4. Handling interactive elements like example buttons and download links.
 */

// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Select All Necessary DOM Elements ---
    
    // Input elements
    const promptInput = document.getElementById('prompt-input');
    const generateBtn = document.getElementById('generate-btn');
    const exampleButtons = document.querySelectorAll('.example-btn');

    // Output & State elements
    const imageContainer = document.getElementById('image-container');
    const placeholderState = document.getElementById('placeholder-state');
    const loadingState = document.getElementById('loading-state');
    const generatedImage = document.getElementById('generated-image');
    
    // Download & Prompt Display
    const downloadBtn = document.getElementById('download-btn');
    const promptDisplay = document.getElementById('prompt-display');
    const promptDisplayText = document.getElementById('prompt-display-text');

    // Error message elements
    const errorMessageContainer = document.getElementById('error-message');
    const errorText = document.getElementById('error-text');

    const API_ENDPOINT = '/api/generate-image';

    // --- 2. Core Function: Handle Image Generation ---

    /**
     * Main function to handle the image generation process.
     * It gets the prompt, calls the backend, and manages UI updates.
     */
    const handleImageGeneration = async () => {
        const prompt = promptInput.value.trim();

        // Simple validation
        if (!prompt) {
            setErrorState('Please enter a prompt to generate an image.');
            return;
        }

        // --- A. Set UI to Loading State ---
        setLoadingState(true);

        try {
            // --- B. Call the Backend API ---
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: prompt }),
            });

            // Parse the JSON response
            const data = await response.json();

            // --- C. Handle API Response ---
            if (!response.ok || !data.success) {
                // If the server returns an error, throw it to be caught
                throw new Error(data.error || 'An unknown error occurred.');
            }

            // --- D. Set UI to Success State ---
            setSuccessState(data.image, prompt);

        } catch (error) {
            // --- E. Set UI to Error State ---
            console.error('Generation Error:', error);
            setErrorState(error.message);
        } finally {
            // --- F. Always revert loading state ---
            setLoadingState(false);
        }
    };

    // --- 3. UI State Management Functions ---

    /**
     * Toggles the UI into and out of a loading state.
     * @param {boolean} isLoading - Whether to show the loading state.
     */
    function setLoadingState(isLoading) {
        if (isLoading) {
            // Disable inputs
            generateBtn.disabled = true;
            promptInput.disabled = true;
            exampleButtons.forEach(btn => btn.disabled = true);
            
            // Hide other states
            placeholderState.classList.add('hidden');
            errorMessageContainer.classList.add('hidden');
            generatedImage.classList.add('hidden');
            promptDisplay.classList.add('hidden');
            downloadBtn.classList.add('hidden');

            // Show loading spinner
            loadingState.classList.remove('hidden');
        } else {
            // Re-enable inputs
            generateBtn.disabled = false;
            promptInput.disabled = false;
            exampleButtons.forEach(btn => btn.disabled = false);

            // Hide loading spinner
            loadingState.classList.add('hidden');
        }
    }

    /**
     * Updates the UI to show a success state with the generated image.
     * @param {string} base64Image - The base64-encoded image string.
     * @param {string} prompt - The prompt used for generation.
     */
    function setSuccessState(base64Image, prompt) {
        // Hide placeholder and error
        placeholderState.classList.add('hidden');
        errorMessageContainer.classList.add('hidden');

        // Set image source and make it visible
        generatedImage.src = base64Image;
        generatedImage.alt = prompt; // Set alt text for accessibility
        generatedImage.classList.remove('hidden');

        // Set download button link and make it visible
        downloadBtn.href = base64Image;
        downloadBtn.classList.remove('hidden');

        // Set prompt display text and make it visible
        promptDisplayText.textContent = prompt;
        promptDisplay.classList.remove('hidden');
    }

    /**
     * Updates the UI to show an error message.
     * @param {string} message - The error message to display.
     */
    function setErrorState(message) {
        // Hide placeholder and image
        placeholderState.classList.add('hidden');
        generatedImage.classList.add('hidden');
        promptDisplay.classList.add('hidden');
        downloadBtn.classList.add('hidden');
        
        // Set error text and make it visible
        errorText.textContent = message;
        errorMessageContainer.classList.remove('hidden');
    }

    // --- 4. Event Listeners ---

    // Listen for click on the main generate button
    generateBtn.addEventListener('click', handleImageGeneration);

    // Allow pressing 'Enter' in the textarea to submit (optional but nice)
    promptInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { // 'Enter' without 'Shift'
            e.preventDefault(); // Prevent new line
            handleImageGeneration();
        }
    });

    // Listen for clicks on any of the example buttons
    exampleButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Get the prompt from the button's 'data-prompt' attribute
            const prompt = button.getAttribute('data-prompt');
            promptInput.value = prompt; // Set the textarea value
            handleImageGeneration(); // Run the generation
        });
    });

});