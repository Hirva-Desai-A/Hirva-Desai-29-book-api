require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Move these to the top, only once
const Course = require('./models/Course');
const Student = require('./models/Student');

const app = express();
// ... rest of your server.js is fine
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));



// --- API ROUTES ---

// 1. Get all courses
app.get('/api/courses', async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (err) { res.status(500).json({ error: 'Failed to fetch courses' }); }
});

// 2. Register Student
app.post('/api/students/register', async (req, res) => {
    try {
        const { name, email } = req.body;
        const existingStudent = await Student.findOne({ email });
        if (existingStudent) return res.status(400).json({ message: 'Email already registered.' });
        const newStudent = new Student({ name, email });
        await newStudent.save();
        res.status(201).json({ message: 'Student registered successfully!' });
    } catch (err) { res.status(500).json({ error: 'Registration failed.' }); }
});

// 3. Login Student
app.post('/api/students/login', async (req, res) => {
    try {
        const { email } = req.body;
        const student = await Student.findOne({ email });
        if (!student) return res.status(404).json({ message: 'Student not found.' });
        res.json({ student: { name: student.name, email: student.email } });
    } catch (err) { res.status(500).json({ error: 'Login failed.' }); }
});

// 4. Enroll (Add Course)
app.post('/api/enroll', async (req, res) => {
    try {
        const { email, courseId } = req.body;
        const student = await Student.findOne({ email });
        const course = await Course.findById(courseId);
        if (!student || !course) return res.status(404).json({ message: 'Data not found.' });
        if (student.enrolledCourses.includes(courseId)) return res.status(400).json({ message: 'Already enrolled.' });
        if (course.availableSeats <= 0) return res.status(400).json({ message: 'Course full.' });

        student.enrolledCourses.push(courseId);
        course.availableSeats -= 1;
        await student.save();
        await course.save();
        res.json({ message: `Successfully added ${course.title}!` });
    } catch (err) { res.status(500).json({ error: 'Enrollment failed.' }); }
});

// 5. Unenroll (Remove Course)
app.post('/api/unenroll', async (req, res) => {
    try {
        const { email, courseId } = req.body;
        const student = await Student.findOne({ email });
        const course = await Course.findById(courseId);
        student.enrolledCourses = student.enrolledCourses.filter(id => id.toString() !== courseId);
        course.availableSeats += 1;
        await student.save();
        await course.save();
        res.json({ message: 'Course removed successfully.' });
    } catch (err) { res.status(500).json({ error: 'Removal failed.' }); }
});

// 6. Get Student's Courses
app.get('/api/students/:email/courses', async (req, res) => {
    try {
        const student = await Student.findOne({ email: req.params.email }).populate('enrolledCourses');
        res.json(student.enrolledCourses);
    } catch (err) { res.status(500).json({ error: 'Failed to fetch your courses' }); }
});

// 7. Seed Database (Corrected: 5 Courses)
app.post('/api/seed-courses', async (req, res) => {
    try {
        await Course.deleteMany({});
        const sampleCourses = [
            { title: 'Introduction to Web Development', credits: 3, availableSeats: 30 },
            { title: 'Database Management Systems', credits: 4, availableSeats: 25 },
            { title: 'Data Structures and Algorithms', credits: 4, availableSeats: 40 },
            { title: 'Cloud Computing Essentials', credits: 3, availableSeats: 20 },
            { title: 'Artificial Intelligence Basics', credits: 4, availableSeats: 15 }
        ];
        await Course.insertMany(sampleCourses);
        res.json({ message: '5 Sample courses added!' });
    } catch (err) { res.status(500).json({ error: 'Seeding failed.' }); }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));