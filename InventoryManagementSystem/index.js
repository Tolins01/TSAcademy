const express = require('express');
const path = require('path');
const { loadStudents, saveStudents } = require('./db');
const app = express();
const dotenv = require('dotenv');
const connDB = require('./Config/ConfigDataBase');
const port = 3000;


let students = loadStudents(); // load existing data on startup
let nextId = students.length > 0 ? Math.random() * students[0].id + 1 : 1;

dotenv.config(); // Load environment variables from .env file

connDB(); // Connect to the database

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// VIEW ROUTE 
app.get('/api/student-portal', (req, res) => {
  res.render('home');
});

// CREATE 
app.post('/api/student-portal', (req, res) => {
  const { Fullname, email, matriculationNumber, phone, gender, password, verifypassword } = req.body;

  if (!Fullname || !email || !matriculationNumber || !phone || !gender || !password || !verifypassword) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  if (password !== verifypassword) {
    return res.status(400).json({ error: 'Passwords do not match.' });
  }

  const existing = students.find(s => s.matriculationNumber === matriculationNumber || s.email === email);
  if (existing) {
    return res.status(409).json({ error: 'Student with this email or matriculation number already exists.' });
  }

  const newStudent = {
    id: nextId++,
    Fullname,
    email,
    matriculationNumber,
    phone,
    gender,
    password
  };

  students.push(newStudent);
  saveStudents(students); // persist to disk

  res.status(201).json({ message: 'Student registered successfully.', student: sanitize(newStudent) });
});

// READ (all students) 
app.get('/api/students', (req, res) => {
  res.json(students.map(sanitize));
});

// READ (single student)
app.get('/api/students/:id', (req, res) => {
  const student = students.find(s => s.id === parseInt(req.params.id));
  if (!student) {
    return res.status(404).json({ error: 'Student not found.' });
  }
  res.json(sanitize(student));
});

// UPDATE 
app.put('/api/students/:id', (req, res) => {
  const student = students.find(s => s.id === parseInt(req.params.id));
  if (!student) {
    return res.status(404).json({ error: 'Student not found.' });
  }

  const { Fullname, email, matriculationNumber, phone, gender, password, verifypassword } = req.body;

  if (password || verifypassword) {
    if (password !== verifypassword) {
      return res.status(400).json({ error: 'Passwords do not match.' });
    }
    student.password = password;
  }

  if (Fullname) student.Fullname = Fullname;
  if (email) student.email = email;
  if (matriculationNumber) student.matriculationNumber = matriculationNumber;
  if (phone) student.phone = phone;
  if (gender) student.gender = gender;

  saveStudents(students); // persist to disk

  res.json({ message: 'Student updated successfully.', student: sanitize(student) });
});

// DELETE 
app.delete('/api/students/:id', (req, res) => {
  const index = students.findIndex(s => s.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Student not found.' });
  }

  const deleted = students.splice(index, 1)[0];
  saveStudents(students); // persist to disk
  res.json({ message: 'Student deleted successfully.', student: sanitize(deleted) });
});

// Auth: strip password before sending back to client 
function sanitize(student) {
  const { password, ...others } = student;
  return others;
}

// LOGIN 
app.get('/api/student-portal/login', (req, res) => {
  res.render('login');
});

app.post('/api/student-portal/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }
  else if (!email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email format.' });
  }
  verifyStudent(email, password, (err, student) => {
    if (err) {
      return res.status(401).json({ error: err.message });
    }
    return res.json({ message: 'Login successful.', student: sanitize(student) });
  });
});

function verifyStudent(email, password, callback) {
  const student = students.find(s => s.email === email);
  if (!student) {
    return callback(new Error('Student not found.'));
  }
  if (student.password !== password) {
    return callback(new Error('Incorrect password.'));
  }
  callback(null, student);
}

app.listen(port, () => {
  console.log(`Inventory Management System is running on port ${port}`);
});