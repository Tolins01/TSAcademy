const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'data', 'students.json');

// Ensure the data folder + file exist
function initDB() {
  const dataDir = path.dirname(DB_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify([]));
  }
}

// Load students array from file
function loadStudents() {
  initDB();
  const raw = fs.readFileSync(DB_FILE, 'utf-8');
  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse students.json, returning empty array.', err);
    return [];
  }
}

// Save students array to file
function saveStudents(students) {
  fs.writeFileSync(DB_FILE, JSON.stringify(students, null, 2));
}

module.exports = { loadStudents, saveStudents };