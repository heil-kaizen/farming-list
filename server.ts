import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";

const app = express();
const PORT = 3000;

// Initialize Database
const db = new Database("farming.db");
db.exec(`
  CREATE TABLE IF NOT EXISTS targets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    status TEXT DEFAULT 'Active',
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

app.use(express.json());

// API Routes
app.get("/api/targets", (req, res) => {
  const stmt = db.prepare("SELECT * FROM targets ORDER BY created_at DESC");
  const targets = stmt.all();
  res.json(targets);
});

app.post("/api/targets", (req, res) => {
  const { name, status, notes } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }
  const stmt = db.prepare("INSERT INTO targets (name, status, notes) VALUES (?, ?, ?)");
  const info = stmt.run(name, status || 'Active', notes || '');
  res.json({ id: info.lastInsertRowid, name, status: status || 'Active', notes: notes || '' });
});

app.put("/api/targets/:id", (req, res) => {
  const { id } = req.params;
  const { name, status, notes } = req.body;
  const stmt = db.prepare("UPDATE targets SET name = ?, status = ?, notes = ? WHERE id = ?");
  const info = stmt.run(name, status, notes, id);
  if (info.changes === 0) {
    return res.status(404).json({ error: "Target not found" });
  }
  res.json({ id, name, status, notes });
});

app.delete("/api/targets/:id", (req, res) => {
  const { id } = req.params;
  const stmt = db.prepare("DELETE FROM targets WHERE id = ?");
  const info = stmt.run(id);
  if (info.changes === 0) {
    return res.status(404).json({ error: "Target not found" });
  }
  res.json({ message: "Target deleted" });
});


// Vite middleware for development
if (process.env.NODE_ENV !== "production") {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
} else {
  // In production, serve static files from dist
  // (This part is handled by the build process, but good to have for completeness if we were deploying)
  app.use(express.static("dist"));
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
