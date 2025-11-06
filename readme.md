# 🎨 AI Art Generator 🖼️

[![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Render](https://img.shields.io/badge/Render-Hosted-46E3B7?style=for-the-badge&logo=render)](https://render.com/)
[![Hugging Face](https://img.shields.io/badge/%F0%9F%A4%97%20Hugging%20Face-API-FFD21E?style=for-the-badge)](https://huggingface.co/inference-api)

A full-stack web application that generates stunning images from text prompts using the Hugging Face Inference API, served through a sleek, responsive "glassmorphism" interface.

## ✨ Features

- 🎨 **Live AI Image Generation** - Uses Hugging Face's latest router API with FLUX.1-schnell and SDXL models  
- 🔄 **Intelligent Model Fallback** - Automatically tries multiple models (FLUX.1-schnell → SDXL-turbo → SD3-medium → SD2.1) if one fails  
- 🔒 **Secure Backend** - Node.js/Express server keeps your API token 100% safe  
- 🎭 **Cyberpunk Dark Theme** - Sleek, modern UI with neon accents and glassmorphism effects  
- ⚡ **Smart Retry Logic** - Handles model loading, rate limits, and failures gracefully  
- 📥 **Download Images** - One-click download of generated artwork  
- 📱 **Fully Responsive** - Works beautifully on desktop, tablet, and mobile  
- 🎯 **Example Prompts** - Quick-start buttons for instant testing  

## 🚀 Live Demo

**Try it now:** [Live Application](https://ai-art-generator-4wlo.onrender.com)

> ⏱️ Note: First visit may take 30-60 seconds as the free hosting tier wakes up the server.

## 🛠️ Tech Stack

**Frontend:**
- HTML5, CSS3 (Custom Animations & Glassmorphism)
- Vanilla JavaScript (ES6+)
- Responsive Design (Mobile-First)

**Backend:**
- Node.js (v18+)
- Express.js
- Hugging Face Inference API Router
- dotenv (Environment Management)

**AI Models (Multi-Model Fallback):**
1. `black-forest-labs/FLUX.1-schnell` (Primary - Highest Quality)
2. `stabilityai/sdxl-turbo` (Fallback 1 - Fast & Reliable)
3. `stabilityai/stable-diffusion-3-medium` (Fallback 2)
4. `stabilityai/stable-diffusion-2-1` (Fallback 3)

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Hugging Face Account** - [Sign up here](https://huggingface.co/join)
- **Hugging Face API Token** - [Get token here](https://huggingface.co/settings/tokens)

## ⚡ Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/nayansm004/Ai-Art-Generator.git
cd Ai-Art-Generator
2. Install Dependencies
bash
Copy code
npm install
This will install:

express - Web server framework

cors - Cross-origin resource sharing

dotenv - Environment variable management

3. Configure Environment Variables
Create a .env file in the root directory:

bash
Copy code
# Create .env file
touch .env
Add your Hugging Face API token:

env
Copy code
HF_API_TOKEN=your_hugging_face_token_here
PORT=3000
HF_BASE_URL=https://router.huggingface.co/hf-inference
Get your token:

Go to Hugging Face Settings → Tokens

Click "New token"

Give it a name (e.g., "AI Art Generator")

Set role to "read"

Copy the token and paste it in your .env file

4. Start the Server
bash
Copy code
# Production mode
npm start

# Development mode (auto-restart on changes)
npm run dev
5. Open Your Browser
Navigate to: http://localhost:3000

That's it! 🎉 Start generating AI art!

📁 Project Structure
php
Copy code
Ai-Art-Generator/
│
├── public/                    # Frontend files (served statically)
│   ├── index.html            # Main HTML page
│   ├── styles.css            # Cyberpunk dark theme styles
│   └── script.js             # Frontend JavaScript logic
│
├── server.js                 # Backend Express server with multi-model fallback
├── package.json              # Project dependencies and scripts
├── .env                      # Environment variables (DO NOT COMMIT)
├── .env.example              # Template for environment variables
├── .gitignore               # Git ignore file
└── README.md                # This file
🔧 Configuration
Environment Variables
Variable	Description	Default	Required
HF_API_TOKEN	Your Hugging Face API token	-	✅ Yes
PORT	Server port	3000	❌ No
HF_BASE_URL	Hugging Face router endpoint	https://router.huggingface.co/hf-inference	❌ No

Customizing Model Rollback Order
Edit the MODEL_ROLLBACK array in server.js:

javascript
Copy code
const MODEL_ROLLBACK = [
  "black-forest-labs/FLUX.1-schnell",     // Your preferred model
  "stabilityai/sdxl-turbo",               // Fast fallback
  "stabilityai/stable-diffusion-3-medium",
  "stabilityai/stable-diffusion-2-1"      // Most reliable fallback
];
🎯 Usage
Basic Usage
Enter a prompt - Describe the image you want to create

Click "Generate Image" - Wait 5-15 seconds for generation

Download - Save your masterpiece with the download button

Example Prompts
css
Copy code
A mystical forest with glowing mushrooms and fireflies, fantasy art  
Futuristic sports car in neon-lit Tokyo street, cyberpunk style  
Abstract digital art with geometric patterns and vibrant colors  
Portrait of a wise owl wizard wearing a purple robe, digital painting  
Majestic dragon flying over mountain peaks at sunset, epic fantasy  
Tips for Better Results
✅ Do:

Be specific and detailed

Mention art style (e.g., "digital art", "oil painting", "photorealistic")

Include lighting and mood (e.g., "dramatic lighting", "soft glow")

Add quality descriptors (e.g., "highly detailed", "8k", "professional")

❌ Don't:

Use vague prompts like "nice picture"

Make prompts too long (keep under 500 characters)

Request violent or inappropriate content

🚨 How the Multi-Model Fallback Works
The server intelligently handles failures:

Primary Model - Tries FLUX.1-schnell first (highest quality)

Model Loading - If 503 error, waits for estimated load time

Rate Limiting - If 429 error, waits 10 seconds and retries

Model Unavailable - If 404 error, automatically tries next model

Fallback Chain - Cascades through 4 models until success

Console Output Example:

yaml
Copy code
🧠 Trying model: black-forest-labs/FLUX.1-schnell
📡 Attempt 1/2 → black-forest-labs/FLUX.1-schnell
⏳ Model loading: waiting 15s
✅ Image generated via model black-forest-labs/FLUX.1-schnell (245678 bytes)
⚠️ Additional Note 💳
If all models fail, it’s likely that your Hugging Face API token has run out of credits.
To fix this:

Replace it with another Hugging Face token that still has available API credits, or

Run the model locally using your own token and environment.

🐛 Troubleshooting
Issue: "Missing Hugging Face API token"
Solution:

Ensure .env file exists in root directory

Check that HF_API_TOKEN=your_token is correctly set

Verify no extra spaces around the token

Restart the server after adding the token

Issue: "All models failed or are unavailable"
Solution:

Check your Hugging Face account has API access

Verify your token has "read" permissions

Check if you've hit rate limits (wait 10-15 minutes)

Try again - models may be temporarily loading

💳 If still failing: your token credits may have been consumed; replace your token or run the model locally.

Issue: Server won't start
Solution:

bash
Copy code
# Check Node.js version (must be 18+)
node --version

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check if port 3000 is in use
lsof -i :3000  # Mac/Linux
netstat -ano | findstr :3000  # Windows
Issue: Image generation is slow
Causes & Solutions:

First request: Models need to load (15-30s) - this is normal

Subsequent requests: Should be faster (5-10s)

Rate limits: Free tier may slow down with heavy use

Model fallback: If primary model fails, fallbacks may be slower

Issue: Image not displaying
Solution:

Open browser console (F12) and check for errors

Verify server is running (npm start)

Check network tab for failed API calls

Clear browser cache and reload

🔒 Security Best Practices
✅ Never commit .env file

✅ Use .gitignore

✅ Rotate tokens regularly

✅ Backend-only API calls

✅ Use HTTPS in production

📦 Dependencies
json
Copy code
{
  "express": "^4.18.2",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1"
}
🚀 Deployment
Deploy to Render
Create account at Render.com

Connect your GitHub repository

Set environment variable: HF_API_TOKEN

Deploy! ✨

Deploy to Railway
Create account at Railway.app

Click "New Project" → "Deploy from GitHub"

Add environment variable: HF_API_TOKEN

Deploy! 🚂

Deploy to Heroku
bash
Copy code
# Install Heroku CLI
heroku login
heroku create your-app-name

# Set environment variable
heroku config:set HF_API_TOKEN=your_token_here

# Deploy
git push heroku main
📈 Performance
First Generation: 15-30 seconds (model loading)

Subsequent Generations: 5-10 seconds

Image Resolution: 1024x1024 pixels

Supported Formats: PNG, JPEG

Concurrent Users: Handles multiple users with queue system

🤝 Contributing
Contributions are welcome! Here's how you can help:

Fork the repository

Create a feature branch: git checkout -b feature/amazing-feature

Commit your changes: git commit -m 'Add amazing feature'

Push to the branch: git push origin feature/amazing-feature

Open a Pull Request

📝 License
This project is licensed under the MIT License - see the LICENSE file for details.

🙏 Acknowledgments
Hugging Face - For providing the Inference API

Black Forest Labs - For the incredible FLUX.1-schnell model

Stability AI - For Stable Diffusion models

Community - For feedback and contributions

📞 Support
Having issues? Here's how to get help:

🐛 Report a bug

💡 Request a feature

📧 Contact developer

🌟 Star History
If you find this project useful, please consider giving it a ⭐ on GitHub!

Built with ❤️ by nayansm004

Happy Creating! 🎨✨
