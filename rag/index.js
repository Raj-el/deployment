import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { ChromaClient } from "chromadb";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// --- Initialize Gemini and in-memory Chroma
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const chroma = new ChromaClient({ path: "http://localhost:8000" }); 
const collection = await chroma.getOrCreateCollection({ name: "plans_memory" });

console.log("✅ In-memory Chroma initialized");

// ---------------------------------------------------------------------
// Add new plan memory (called after a plan succeeds/fails)
// ---------------------------------------------------------------------
app.post("/memory/add", async (req, res) => {
  try {
    const { id, text, metadata } = req.body;
    if (!id || !text)
      return res.status(400).json({ message: "id and text are required" });

    await collection.add({
      ids: [id],
      documents: [text],
      metadatas: [metadata || {}],
    });

    res.json({ message: `🧩 Added plan ${id} to vector memory.` });
  } catch (err) {
    console.error("Error adding memory:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------------------------------------------------
// Retrieve similar plans (based on context query)
// ---------------------------------------------------------------------
app.post("/memory/query", async (req, res) => {
  try {
    const { query, n = 5 } = req.body;
    if (!query) return res.status(400).json({ message: "Query is required" });

    const result = await collection.query({
      queryTexts: [query],
      nResults: n,
    });

    res.json({ results: result.documents?.[0] || [] });
  } catch (err) {
    console.error("Error querying memory:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------------------------------------------------
// Generate a Get-Well Plan using Gemini + memory context
// ---------------------------------------------------------------------
app.post("/generate", async (req, res) => {
  try {
    const { customer } = req.body;
    if (!customer)
      return res.status(400).json({ message: "Customer details required" });

    // Step 1: Retrieve top relevant past plans
    const queryText = `${customer.industry || ""} ${customer.region || ""} ${
      customer.riskLevel || ""
    }`;
    const similar = await collection.query({ queryTexts: [queryText], nResults: 5 });

    const context = similar.documents?.[0]?.join("\n") || "No prior plans found.";

    // Step 2: Build intelligent prompt for Gemini
    const prompt = `
You are a Customer Success AI.
Use the following historical plans and outcomes to generate a new Get-Well Plan.

Historical context:
${context}

Customer details:
${JSON.stringify(customer, null, 2)}

Return JSON:
{
  "summary": "One-line summary",
  "focusAreas": ["3–5 focus themes"],
  "recommendations": [{"action": "string", "owner": "string", "due": "string"}]
}
`;

    // Step 3: Generate via Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);

    let planText = result.response.text();
    let plan;
    try {
      plan = JSON.parse(planText);
    } catch {
      plan = { summary: planText, focusAreas: [], recommendations: [] };
    }

    res.json({
      message: "✅ AI plan generated successfully.",
      plan,
    });
  } catch (err) {
    console.error("Error generating plan:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(4000, () => console.log("🚀 RAG service running at http://localhost:4000"));
