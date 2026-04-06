import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || "127.0.0.1",
  port: parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USER || "auto",
  password: process.env.DB_PASSWORD || "auto@5051",
  database: process.env.DB_NAME || "shrivenkyauto",
};

let pool: mysql.Pool | null = null;

// Initialize MySQL tables
async function initMySQL() {
  if (!pool) return;
  
  console.log("🛠️ Initializing MySQL tables...");
  
  const tables = [
    `CREATE TABLE IF NOT EXISTS inverter_products (id VARCHAR(255) PRIMARY KEY, data JSON)`,
    `CREATE TABLE IF NOT EXISTS auto_products (id VARCHAR(255) PRIMARY KEY, data JSON)`,
    `CREATE TABLE IF NOT EXISTS customers (id VARCHAR(255) PRIMARY KEY, data JSON)`,
    `CREATE TABLE IF NOT EXISTS suppliers (id VARCHAR(255) PRIMARY KEY, data JSON)`,
    `CREATE TABLE IF NOT EXISTS job_cards (id VARCHAR(255) PRIMARY KEY, data JSON)`,
    `CREATE TABLE IF NOT EXISTS mechanics (id VARCHAR(255) PRIMARY KEY, data JSON)`,
    `CREATE TABLE IF NOT EXISTS transactions (id VARCHAR(255) PRIMARY KEY, data JSON)`,
    `CREATE TABLE IF NOT EXISTS purchase_orders (id VARCHAR(255) PRIMARY KEY, data JSON)`,
    `CREATE TABLE IF NOT EXISTS purchases (id VARCHAR(255) PRIMARY KEY, data JSON)`,
    `CREATE TABLE IF NOT EXISTS purchase_items (id VARCHAR(255) PRIMARY KEY, data JSON)`,
    `CREATE TABLE IF NOT EXISTS sales (id VARCHAR(255) PRIMARY KEY, data JSON)`,
    `CREATE TABLE IF NOT EXISTS sale_items (id VARCHAR(255) PRIMARY KEY, data JSON)`,
    `CREATE TABLE IF NOT EXISTS job_card_items (id VARCHAR(255) PRIMARY KEY, data JSON)`,
    `CREATE TABLE IF NOT EXISTS account_heads (id VARCHAR(255) PRIMARY KEY, data JSON)`
  ];

  for (const sql of tables) {
    await pool.query(sql);
  }
  console.log("✅ MySQL tables initialized");
}

// Initialize database
async function initDb() {
  try {
    console.log("📡 Attempting to connect to MySQL...");
    pool = mysql.createPool(dbConfig);
    // Test connection
    await pool.getConnection();
    console.log("✅ Connected to MySQL successfully");
    await initMySQL();
  } catch (error) {
    console.error("❌ MySQL connection failed:", error);
    throw new Error("Database connection failed. Please check your MySQL configuration.");
  }
}

// Health check and DB status
app.get("/api/db-status", async (req, res) => {
  if (pool) {
    res.json({ status: "connected", host: dbConfig.host, type: "mysql" });
  } else {
    res.status(503).json({ status: "disconnected", type: "mysql" });
  }
});

// Generic API Routes
app.get("/api/:table", async (req, res) => {
  const { table } = req.params;
  try {
    if (!pool) throw new Error("Database not connected");
    const [rows] = await pool.query(`SELECT data FROM ${table}`);
    res.json((rows as any[]).map(row => row.data));
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch from ${table}` });
  }
});

app.get("/api/:table/:id", async (req, res) => {
  const { table, id } = req.params;
  try {
    if (!pool) throw new Error("Database not connected");
    const [rows] = await pool.query(`SELECT data FROM ${table} WHERE id = ?`, [id]);
    const item = (rows as any[])[0]?.data;
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
    if (!pool) throw new Error("Database not connected");
    const data = req.body;
    const id = data.id || Math.random().toString(36).substr(2, 9);
    data.id = id;

    await pool.query(`INSERT INTO ${table} (id, data) VALUES (?, ?) ON DUPLICATE KEY UPDATE data = ?`, [id, JSON.stringify(data), JSON.stringify(data)]);
    res.status(201).json(data);
  } catch (error) {
    console.error(`Error saving to ${table}:`, error);
    res.status(500).json({ error: `Failed to save to ${table}` });
  }
});

app.put("/api/:table/:id", async (req, res) => {
  const { table, id } = req.params;
  try {
    if (!pool) throw new Error("Database not connected");
    const data = req.body;
    await pool.query(`UPDATE ${table} SET data = ? WHERE id = ?`, [JSON.stringify(data), id]);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: `Failed to update ${table}` });
  }
});

app.patch("/api/:table/:id", async (req, res) => {
  const { table, id } = req.params;
  try {
    if (!pool) throw new Error("Database not connected");
    const patchData = req.body;
    const [rows] = await pool.query(`SELECT data FROM ${table} WHERE id = ?`, [id]);
    const currentData = (rows as any[])[0]?.data;
    if (currentData) {
      const newData = { ...currentData, ...patchData };
      await pool.query(`UPDATE ${table} SET data = ? WHERE id = ?`, [JSON.stringify(newData), id]);
      res.json(newData);
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
    if (!pool) throw new Error("Database not connected");
    await pool.query(`DELETE FROM ${table}`);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: `Failed to clear ${table}` });
  }
});

app.delete("/api/:table/:id", async (req, res) => {
  const { table, id } = req.params;
  try {
    if (!pool) throw new Error("Database not connected");
    await pool.query(`DELETE FROM ${table} WHERE id = ?`, [id]);
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
  } catch (err) {
    console.error("❌ Database initialization failed:", err);
    // Continue starting the server so the frontend can load and show the error status
  }

  try {
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
