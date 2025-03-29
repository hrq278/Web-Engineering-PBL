// Theme Switching Functionality
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    body.classList.toggle('dark-mode', savedTheme === 'dark');
    updateThemeButton();
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const isDarkMode = body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    updateThemeButton();
});

function updateThemeButton() {
    const isDarkMode = body.classList.contains('dark-mode');
    const icon = themeToggle.querySelector('i');
    const text = themeToggle.querySelector('span');
    
    if (isDarkMode) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
        text.textContent = 'Light Mode';
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
        text.textContent = 'Dark Mode';
    }
}

// Profile Photo Upload Functionality
const photoUpload = document.getElementById('photo-upload');
const profilePhoto = document.getElementById('profile-photo');
const profilePhotoPreview = document.getElementById('profile-photo-preview');

if (photoUpload && profilePhotoPreview) {
    photoUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                profilePhotoPreview.src = e.target.result;
                // Save the photo to localStorage (as base64)
                localStorage.setItem('profilePhoto', e.target.result);
                // Update all profile photos on the page
                updateAllProfilePhotos(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    });
}

// Function to update all profile photos on the page
function updateAllProfilePhotos(photoUrl) {
    const allProfilePhotos = document.querySelectorAll('#profile-photo');
    allProfilePhotos.forEach(photo => {
        photo.src = photoUrl;
    });
}

// Load saved profile photo
const savedPhoto = localStorage.getItem('profilePhoto');
if (savedPhoto) {
    updateAllProfilePhotos(savedPhoto);
}

// Add smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Add loading animation for course cards
const courseCards = document.querySelectorAll('.course-card');
courseCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        const progress = card.querySelector('.progress');
        const currentWidth = progress.style.width;
        progress.style.width = '100%';
        setTimeout(() => {
            progress.style.width = currentWidth;
        }, 1000);
    });
});

// Initialize tooltips for stats cards
const statsCards = document.querySelectorAll('.card');
statsCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        const info = card.querySelector('.card-info p');
        const originalText = info.textContent;
        info.textContent = 'Click to view details';
        
        card.addEventListener('mouseleave', () => {
            info.textContent = originalText;
        });
    });
});

// Study Reminders Functionality
const reminderForm = document.querySelector('.reminder-form');
const reminderList = document.querySelector('.reminder-list');
const reminderTitle = document.getElementById('reminder-title');
const reminderTime = document.getElementById('reminder-time');
const addReminderBtn = document.getElementById('add-reminder');

// Load saved reminders
let reminders = JSON.parse(localStorage.getItem('reminders')) || [];

function saveReminders() {
    localStorage.setItem('reminders', JSON.stringify(reminders));
}

function createReminderElement(reminder) {
    const reminderElement = document.createElement('div');
    reminderElement.className = 'reminder-item';
    reminderElement.dataset.id = reminder.id;

    const reminderInfo = document.createElement('div');
    reminderInfo.className = 'reminder-info';
    reminderInfo.innerHTML = `
        <h3>${reminder.title}</h3>
        <p>${new Date(reminder.time).toLocaleString()}</p>
    `;

    const reminderActions = document.createElement('div');
    reminderActions.className = 'reminder-actions';
    reminderActions.innerHTML = `
        <button class="edit-reminder" title="Edit reminder">
            <i class="fas fa-edit"></i>
        </button>
        <button class="delete-reminder" title="Delete reminder">
            <i class="fas fa-trash"></i>
        </button>
    `;

    reminderElement.appendChild(reminderInfo);
    reminderElement.appendChild(reminderActions);

    // Add event listeners for actions
    const editBtn = reminderActions.querySelector('.edit-reminder');
    const deleteBtn = reminderActions.querySelector('.delete-reminder');

    editBtn.addEventListener('click', () => editReminder(reminder.id));
    deleteBtn.addEventListener('click', () => deleteReminder(reminder.id));

    return reminderElement;
}

function renderReminders() {
    reminderList.innerHTML = '';
    reminders.forEach(reminder => {
        reminderList.appendChild(createReminderElement(reminder));
    });
}

function addReminder() {
    const title = reminderTitle.value.trim();
    const time = reminderTime.value;

    if (!title || !time) {
        alert('Please fill in all fields');
        return;
    }

    const reminder = {
        id: Date.now(),
        title,
        time,
        completed: false
    };

    reminders.push(reminder);
    saveReminders();
    renderReminders();

    // Clear form
    reminderTitle.value = '';
    reminderTime.value = '';
}

function editReminder(id) {
    const reminder = reminders.find(r => r.id === id);
    if (!reminder) return;

    reminderTitle.value = reminder.title;
    reminderTime.value = reminder.time;
    deleteReminder(id);
}

function deleteReminder(id) {
    reminders = reminders.filter(r => r.id !== id);
    saveReminders();
    renderReminders();
}

// Event Listeners
addReminderBtn.addEventListener('click', addReminder);
reminderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addReminder();
});

// Check for upcoming reminders
function checkUpcomingReminders() {
    const now = new Date();
    reminders.forEach(reminder => {
        const reminderDate = new Date(reminder.time);
        const timeDiff = reminderDate - now;
        
        if (timeDiff > 0 && timeDiff <= 60000 && !reminder.completed) { // Within 1 minute
            showNotification(reminder);
            reminder.completed = true;
            saveReminders();
        }
    });
}

function showNotification(reminder) {
    if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                new Notification('Study Reminder', {
                    body: reminder.title,
                    icon: '/path/to/icon.png'
                });
            }
        });
    }
}

// Check reminders every minute
setInterval(checkUpcomingReminders, 60000);

// Initial render
renderReminders();

// Sidebar Toggle Functionality
const sidebar = document.querySelector('.sidebar');
const sidebarOverlay = document.createElement('div');
sidebarOverlay.className = 'sidebar-overlay';
document.body.appendChild(sidebarOverlay);

function toggleSidebar() {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
        const sidebar = document.querySelector('.sidebar');
        const sidebarOverlay = document.querySelector('.sidebar-overlay');
        sidebar.classList.toggle('active');
        sidebarOverlay.classList.toggle('active');
    }
}

// Close sidebar when clicking overlay
sidebarOverlay.addEventListener('click', toggleSidebar);

// Close sidebar when pressing Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('active')) {
        toggleSidebar();
    }
});

// Update the window resize event listener
window.addEventListener('resize', () => {
    const isMobile = window.innerWidth <= 768;
    const sidebar = document.querySelector('.sidebar');
    const sidebarOverlay = document.querySelector('.sidebar-overlay');
    
    if (!isMobile && sidebar.classList.contains('active')) {
        // Don't remove 'active' class on desktop
        // Just hide the overlay if it exists
        if (sidebarOverlay) {
            sidebarOverlay.classList.remove('active');
        }
    }
});