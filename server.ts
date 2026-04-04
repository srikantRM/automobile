import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs/promises";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// JSON storage path
const DB_PATH = path.join(process.cwd(), "db.json");

// In-memory data store
let dbData: Record<string, any[]> = {};

// Load data from JSON file
async function loadDb() {
  try {
    const content = await fs.readFile(DB_PATH, "utf-8");
    dbData = JSON.parse(content);
    console.log("✅ Database loaded from db.json");
  } catch (error) {
    console.log("⚠️ No existing database found, creating new one...");
    dbData = {};
    await saveDb();
  }
}

// Save data to JSON file
async function saveDb() {
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(dbData, null, 2));
  } catch (error) {
    console.error("❌ Error saving to db.json:", error);
  }
}

// Initialize database tables (simulated for JSON)
async function initDb() {
  console.log("⚠️ Initializing JSON-based storage...");
  await loadDb();
  
  const tables = [
    "inverter_products",
    "auto_products",
    "customers",
    "suppliers",
    "job_cards",
    "mechanics",
    "transactions",
    "purchase_orders",
    "purchases",
    "purchase_items",
    "sales",
    "sale_items",
    "job_card_items"
  ];

  tables.forEach(table => {
    if (!dbData[table]) {
      dbData[table] = [];
    }
  });
  
  await saveDb();
  console.log("✨ JSON database initialization complete");
}

// Health check and DB status
app.get("/api/db-status", async (req, res) => {
  const stats: Record<string, number> = {};
  Object.keys(dbData).forEach(table => {
    stats[table] = dbData[table].length;
  });
  res.json({ status: "connected", host: "local-json", type: "json", stats });
});

// Generic API Routes
app.get("/api/:table", async (req, res) => {
  const { table } = req.params;
  try {
    const rows = dbData[table] || [];
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch from ${table}` });
  }
});

app.get("/api/:table/:id", async (req, res) => {
  const { table, id } = req.params;
  try {
    if (!dbData[table]) return res.status(404).json({ error: "Table not found" });
    const item = dbData[table].find((item: any) => item.id === id);
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ error: "Item not found" });
    }
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch from ${table}` });
  }
});

app.post("/api/:table", async (req, res) => {
  const { table } = req.params;
  try {
    const data = req.body;
    if (!dbData[table]) dbData[table] = [];
    dbData[table].push(data);
    await saveDb();
    res.status(201).json(data);
  } catch (error) {
    console.error(`Error saving to ${table}:`, error);
    res.status(500).json({ error: `Failed to save to ${table}` });
  }
});

app.put("/api/:table/:id", async (req, res) => {
  const { table, id } = req.params;
  try {
    if (!dbData[table]) return res.status(404).json({ error: "Table not found" });
    const index = dbData[table].findIndex((item: any) => item.id === id);
    if (index !== -1) {
      dbData[table][index] = { ...dbData[table][index], ...req.body };
      await saveDb();
      res.json(dbData[table][index]);
    } else {
      res.status(404).json({ error: "Item not found" });
    }
  } catch (error) {
    res.status(500).json({ error: `Failed to update ${table}` });
  }
});

app.patch("/api/:table/:id", async (req, res) => {
  const { table, id } = req.params;
  try {
    if (!dbData[table]) return res.status(404).json({ error: "Table not found" });
    const index = dbData[table].findIndex((item: any) => item.id === id);
    if (index !== -1) {
      dbData[table][index] = { ...dbData[table][index], ...req.body };
      await saveDb();
      res.json(dbData[table][index]);
    } else {
      res.status(404).json({ error: "Item not found" });
    }
  } catch (error) {
    res.status(500).json({ error: `Failed to patch ${table}` });
  }
});

app.delete("/api/:table", async (req, res) => {
  const { table } = req.params;
  try {
    dbData[table] = [];
    await saveDb();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: `Failed to clear ${table}` });
  }
});

app.delete("/api/:table/:id", async (req, res) => {
  const { table, id } = req.params;
  try {
    if (!dbData[table]) return res.status(404).json({ error: "Table not found" });
    dbData[table] = dbData[table].filter((item: any) => item.id !== id);
    await saveDb();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: `Failed to delete from ${table}` });
  }
});

async function startServer() {
  console.log("🚀 Starting server startup process...");
  
  try {
    // Initialize DB first to see if it works
    console.log("🛠️ Initializing database...");
    await initDb();
    console.log("✅ Database initialization step finished");

    if (process.env.NODE_ENV !== "production") {
      console.log("🛠️ Initializing Vite middleware...");
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
      console.log("✅ Vite middleware initialized");
    } else {
      console.log("🛠️ Setting up static file serving for production...");
      const distPath = path.join(process.cwd(), "dist");
      app.use(express.static(distPath));
      app.get("*", (req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
      });
    }

    console.log(`🛠️ Attempting to listen on port ${PORT}...`);
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`📡 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Fatal error during server startup:", err);
  }
}

startServer();
