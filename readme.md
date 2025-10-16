# 🎨 AI Art Generator 🖼️

[![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Render](https://img.shields.io/badge/Render-Hosted-46E3B7?style=for-the-badge&logo=render)](https://render.com/)
[![Hugging Face](https://img.shields.io/badge/%F0%9F%A4%97%20Hugging%20Face-API-FFD21E?style=for-the-badge)](https://huggingface.co/inference-api)

A full-stack web application that generates stunning images from text prompts using the Hugging Face Inference API, served through a sleek, responsive "glassmorphism" interface.

---

## 🚀 Live Demo

**Try the application live right now!**

### ➡️ [https://ai-art-generator-4wlo.onrender.com/](https://ai-art-generator-4wlo.onrender.com/)

*(Note: This project runs on a free hosting tier. The server may take 30-60 seconds to "wake up" on the first visit if it has been inactive.)*

---

`)
-->
## ✨ Features

* **Live AI Image Generation:** Uses the powerful `black-forest-labs/FLUX.1-schnell` model via the Hugging Face API.
* **Secure Backend:** A Node.js/Express server handles all API calls, keeping the secret API token 100% secure.
* **Modern "Glassmorphism" UI:** A clean, responsive, and beautiful frontend built with vanilla HTML, CSS, and JavaScript.
* **Dynamic UI States:** The app provides clear user feedback with integrated loading spinners, error messages, and success displays.
* **One-Click Prompts:** Includes example buttons to let users test the app instantly.
* **Download Your Art:** Instantly download the generated image with a convenient download button.

## 💻 Or... Run It Locally

Want to run the project on your own machine? Here’s how:

### Prerequisites

* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* [npm](https://www.npmjs.com/) (comes with Node.js)
* A [Hugging Face Account](https://huggingface.co/join) and API Token.

### 1. Get the Code

Clone this repository to your local machine:
```bash
git clone [https://github.com/nayansm004/Ai-Art-Generator.git](https://github.com/nayansm004/Ai-Art-Generator.git)
cd ai-art-generator
