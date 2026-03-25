const API_URL = 'http://localhost:3000/api';

const authSection = document.getElementById('auth-section');
const coursesSection = document.getElementById('courses-section');
const myCoursesSection = document.getElementById('my-courses-section');
const userInfo = document.getElementById('user-info');
const welcomeMessage = document.getElementById('welcome-message');
const statusMsg = document.getElementById('status-msg');

let currentUser = JSON.parse(localStorage.getItem('currentUser'));
let enrolledIds = []; // To track what the user already has

if (currentUser) showDashboard(currentUser);

// --- Helper: UI Feedback (Replaces Alert) ---
function showMessage(text, isError = false) {
    statusMsg.textContent = text;
    statusMsg.className = `status-container ${isError ? 'error-text' : 'success-text'}`;
    statusMsg.style.display = 'block';

    // Auto-hide after 3 seconds
    setTimeout(() => {
        statusMsg.style.display = 'none';
    }, 3000);
}

// --- Auth ---
document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    try {
        const response = await fetch(`${API_URL}/students/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email })
        });
        const data = await response.json();
        showMessage(data.message, !response.ok);
        if (response.ok) e.target.reset();
    } catch (err) { showMessage("Registration failed.", true); }
});

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    try {
        const response = await fetch(`${API_URL}/students/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('currentUser', JSON.stringify(data.student));
            currentUser = data.student;
            showDashboard(currentUser);
        } else { showMessage(data.message, true); }
    } catch (err) { showMessage("Login failed.", true); }
});

document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    location.reload();
});

// --- UI Logic ---
function showDashboard(user) {
    authSection.classList.add('hidden');
    coursesSection.classList.remove('hidden');
    myCoursesSection.classList.remove('hidden');
    userInfo.classList.remove('hidden');
    welcomeMessage.textContent = `Welcome, ${user.name}!`;
    refreshData();
}

async function refreshData() {
    // 1. Get student's enrolled courses first
    await loadMyCourses();
    // 2. Get all courses and filter them based on enrollment
    await loadCourses();
}

async function loadMyCourses() {
    if (!currentUser) return;
    try {
        const response = await fetch(`${API_URL}/students/${currentUser.email}/courses`);
        const courses = await response.json();

        // Save IDs so we can filter the "Available" list later
        enrolledIds = courses.map(c => c._id);

        const tbody = document.getElementById('my-courses-body');
        tbody.innerHTML = '';
        courses.forEach(c => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${c.title}</td><td>${c.credits}</td>
                <td><button class="remove-btn" onclick="unenrollCourse('${c._id}')">Remove</button></td>`;
            tbody.appendChild(row);
        });
    } catch (err) { console.error(err); }
}

async function loadCourses() {
    try {
        const response = await fetch(`${API_URL}/courses`);
        const allCourses = await response.json();
        const tbody = document.getElementById('courses-body');
        tbody.innerHTML = '';

        // DYNAMIC FILTER: Hide courses that the student already added
        const availableOnly = allCourses.filter(c => !enrolledIds.includes(c._id));

        if (availableOnly.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4">No new courses available.</td></tr>';
            return;
        }

        availableOnly.forEach(c => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${c.title}</td><td>${c.credits}</td><td>${c.availableSeats}</td>
                <td><button onclick="enrollStudent('${c._id}')">Add</button></td>`;
            tbody.appendChild(row);
        });
    } catch (err) { console.error(err); }
}

// --- Actions (No Alerts) ---
window.enrollStudent = async function (courseId) {
    try {
        const response = await fetch(`${API_URL}/enroll`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: currentUser.email, courseId })
        });
        const data = await response.json();
        if (response.ok) {
            showMessage("Course added successfully!");
            refreshData(); // Triggers the transfer effect
        } else {
            showMessage(data.message, true);
        }
    } catch (err) { showMessage("Network error during enrollment.", true); }
};

window.unenrollCourse = async function (courseId) {
    if (!confirm("Remove this course?")) return;
    try {
        const response = await fetch(`${API_URL}/unenroll`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: currentUser.email, courseId })
        });
        const data = await response.json();
        if (response.ok) {
            showMessage("Course removed successfully.");
            refreshData(); // Triggers the transfer effect
        } else {
            showMessage(data.message, true);
        }
    } catch (err) { showMessage("Network error during removal.", true); }
};