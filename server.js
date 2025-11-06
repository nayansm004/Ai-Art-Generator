// server.js – Image Generator with Multi-Model Rollback (fixed)
// ============================================================================

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// -------- Fetch polyfill (works on Node 18+ and falls back to undici/node-fetch if needed) ----------
let fetchImpl = globalThis.fetch;
if (!fetchImpl) {
  try {
    // undici is recommended for Node <18: npm install undici
    fetchImpl = require("undici").fetch;
  } catch (e1) {
    try {
      // node-fetch v2 works in CJS; if you use node-fetch v3 (ESM-only) this will fail.
      fetchImpl = require("node-fetch");
    } catch (e2) {
      console.error("❌ No fetch implementation available. Install Node 18+, or 'undici' or 'node-fetch'.");
      process.exit(1);
    }
  }
}
const fetch = fetchImpl;
// ---------------------------------------------------------------------------------------------------

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Hugging Face config
const HF_API_TOKEN = process.env.HF_API_TOKEN;
// Keep your HF router or inference endpoint here; you may override with .env
const HF_BASE_URL = process.env.HF_BASE_URL || "https://router.huggingface.co/hf-inference";

// List of models to try (in order) for rollback
// Put your preferred, allowed models here.
const MODEL_ROLLBACK = [
  "black-forest-labs/FLUX.1-schnell",
  "stabilityai/sdxl-turbo",
  "stabilityai/stable-diffusion-3-medium",
  "stabilityai/stable-diffusion-2-1"
];

if (!HF_API_TOKEN) {
  console.error("❌ Missing Hugging Face API token! Add HF_API_TOKEN in .env");
  process.exit(1);
}

console.log("✅ HF token configured");
console.log("🌐 Base URL:", HF_BASE_URL);
console.log("🎨 Models rollback order:");
MODEL_ROLLBACK.forEach((m, i) => console.log(`   ${i + 1}. ${m}`));

// Delay utility
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Helper to build model URL (keeps a single slash)
function buildModelUrl(base, model) {
  // Ensure no duplicate slashes
  return `${base.replace(/\/+$/, "")}/models/${encodeURIComponent(model)}`;
}

// Query function with rollback and retries
async function queryHF(prompt, retriesPerModel = 2, options = {}) {
  for (const model of MODEL_ROLLBACK) {
    const url = buildModelUrl(HF_BASE_URL, model);
    console.log(`\n🧠 Trying model: ${model}`);
    for (let attempt = 1; attempt <= retriesPerModel; attempt++) {
      try {
        console.log(`📡 Attempt ${attempt}/${retriesPerModel} → ${model}`);
        const body = {
          inputs: prompt,
          options: { wait_for_model: true, use_cache: false }
        };

        // You can extend body with options (like inference params)
        Object.assign(body, options);

        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${HF_API_TOKEN}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(body),
          // no timeout here; you can add AbortController if needed
        });

        console.log(`📊 Response status: ${res.status}`);

        // 404 = model missing on router
        if (res.status === 404) {
          console.warn(`❌ Model ${model} not found on router. Rolling back to next model...`);
          break; // move to next model
        }

        // 503 = model loading; HF often returns {"estimated_time": n}
        if (res.status === 503) {
          let data = {};
          try { data = await res.json(); } catch (e) {}
          const waitTime = data.estimated_time || 10;
          console.log(`⏳ Model loading: waiting ${waitTime}s`);
          await delay(waitTime * 1000);
          continue; // retry same model
        }

        if (res.status === 429) {
          console.log("⚠️ Rate limited. Waiting 10s before retry...");
          await delay(10000);
          continue;
        }

        if ([401, 403].includes(res.status)) {
          // Bad token or unauthorized
          const text = await res.text().catch(() => "");
          throw new Error(`Unauthorized (status ${res.status}). ${text}`);
        }

        if (!res.ok) {
          // Try to parse JSON error if possible
          const contentType = res.headers.get("content-type") || "";
          if (contentType.includes("application/json")) {
            const json = await res.json().catch(() => ({}));
            throw new Error(`HF API error ${res.status}: ${JSON.stringify(json)}`);
          } else {
            const text = await res.text().catch(() => "");
            throw new Error(`HF API error ${res.status}: ${text}`);
          }
        }

        // Success path: response might be binary (image bytes) or JSON containing base64/etc.
        const contentType = res.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
          // Some HF routes respond with JSON that includes a base64 string
          const json = await res.json();
          // try to detect common shapes
          if (json && typeof json === "object") {
            // if HF returned an array of artifacts or a single object with 'data' or 'image'
            // adapt as needed for your target model
            // Attempt to find base64-encoded bytes
            const maybeBase64 = (json.data && json.data[0] && json.data[0].b64_json) ||
                                json.image_base64 || json.base64 || json.data;
            if (maybeBase64 && typeof maybeBase64 === "string") {
              const buffer = Buffer.from(maybeBase64, "base64");
              console.log(`✅ Image recovered from JSON via model ${model} (${buffer.byteLength} bytes)`);
              return { buffer, model };
            } else {
              // if json is bytes array (rare) or some other structure, try to stringify for debugging
              throw new Error(`Received JSON but couldn't find image data. Response keys: ${Object.keys(json).join(", ")}`);
            }
          } else {
            throw new Error("Unexpected JSON response shape from HF.");
          }
        } else {
          // Assume binary image (PNG/JPEG)
          const arrayBuffer = await res.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          console.log(`✅ Image generated via model ${model} (${buffer.byteLength} bytes)`);
          return { buffer, model };
        }
      } catch (err) {
        console.warn(`⚠️ Error with model ${model}, attempt ${attempt}: ${err.message}`);
        if (attempt < retriesPerModel) {
          console.log(`⏱ Retrying model ${model} after 5s...`);
          await delay(5000);
        } else {
          console.log(`🔁 Giving up on model ${model}, moving to next.`);
        }
      }
    }
  }
  throw new Error("All models failed or are unavailable at this time.");
}

// API Endpoint
app.post("/api/generate-image", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return res.status(400).json({ success: false, error: "A valid prompt is required." });
    }
    console.log(`\n🎨 Prompt: "${prompt.slice(0, 200)}"`);
    const { buffer, model } = await queryHF(prompt);
    const base64 = buffer.toString("base64");
    res.json({
      success: true,
      prompt,
      model,
      image: `data:image/png;base64,${base64}`
    });
  } catch (err) {
    console.error("❌ Generation error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    baseURL: HF_BASE_URL,
    modelsTried: MODEL_ROLLBACK,
    tokenConfigured: !!HF_API_TOKEN
  });
});

// Serve static index
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log("\n" + "=".repeat(60));
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log("🎨 Model rollback list:");
  MODEL_ROLLBACK.forEach((m, i) => console.log(`   ${i + 1}. ${m}`));
  console.log("=".repeat(60) + "\n");
});
