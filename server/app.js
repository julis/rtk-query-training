const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Database setup
const db = new sqlite3.Database('./tasks.db', (err) => {
  if (err) {
    console.error('Error opening database', err);
  } else {
    console.log('Connected to the SQLite database.');
    db.run(`CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'pending'
    )`);
  }
});

// Routes
const apiRouter = express.Router();

// Get all tasks
apiRouter.get('/tasks', (req, res) => {
  db.all('SELECT * FROM tasks', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get a single task
apiRouter.get('/tasks/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM tasks WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    res.json(row);
  });
});

// Create a new task
apiRouter.post('/tasks', (req, res) => {
  const { title, description } = req.body;
  db.run('INSERT INTO tasks (title, description) VALUES (?, ?)', [title, description], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(201).json({ id: this.lastID, title, description, status: 'pending' });
  });
});

// Update a task
apiRouter.put('/tasks/:id', (req, res) => {
  const id = req.params.id;
  const { title, description, status } = req.body;
  db.run('UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ?', [title, description, status, id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    res.json({ id, title, description, status });
  });
});

// Delete a task
apiRouter.delete('/tasks/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM tasks WHERE id = ?', id, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    res.json({ message: 'Task deleted successfully' });
  });
});

// Mount the API router under /api
app.use('/api', apiRouter);

// Start the server
app.listen(port, () => {
  console.log(`Task management API server running on port ${port}`);
});