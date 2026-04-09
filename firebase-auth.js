// Firebase Authentication Functions
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { set, ref, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

let currentUser = null;

// Registration
function registerUser(name, email, password) {
    return createUserWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
            const user = userCredential.user;
            // Save user profile data
            return set(ref(database, 'users/' + user.uid), {
                name: name,
                email: email,
                totalPoints: 0,
                predictionsCount: 0,
                createdAt: serverTimestamp()
            });
        });
}

// Login
function loginUser(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
}

// Logout
function logoutUser() {
    return signOut(auth);
}

// Auth state observer
onAuthStateChanged(auth, user => {
    currentUser = user;
    if (user) {
        showUserProfile(user);
        loadUserData(user);
    } else {
        showAuthForms();
    }
});

// Show/hide auth sections
function showAuthForms() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('userProfile').style.display = 'none';
    document.getElementById('predictionForm').style.display = 'none';
}

function showUserProfile(user) {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('userProfile').style.display = 'block';
    document.getElementById('predictionForm').style.display = 'block';
}

// Load user data
function loadUserData(user) {
    database.ref('users/' + user.uid).once('value').then(snapshot => {
        const userData = snapshot.val();
        if (userData) {
            document.getElementById('userName').textContent = userData.name;
            document.getElementById('userPoints').textContent = userData.totalPoints || 0;
            document.getElementById('userPredictions').textContent = userData.predictionsCount || 0;
        }
    });
}

// Setup auth event listeners
function setupAuthListeners() {
    // Login
    document.getElementById('loginBtn').addEventListener('click', () => {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const errorElement = document.getElementById('loginError');
        
        loginUser(email, password)
            .then(() => {
                errorElement.style.display = 'none';
            })
            .catch(error => {
                errorElement.textContent = error.message;
                errorElement.style.display = 'block';
            });
    });
    
    // Register
    document.getElementById('registerBtn').addEventListener('click', () => {
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const errorElement = document.getElementById('registerError');
        
        if (!name || !email || !password) {
            errorElement.textContent = 'Please fill all fields';
            errorElement.style.display = 'block';
            return;
        }
        
        registerUser(name, email, password)
            .then(() => {
                errorElement.style.display = 'none';
            })
            .catch(error => {
                errorElement.textContent = error.message;
                errorElement.style.display = 'block';
            });
    });
    
    // Logout
    document.getElementById('logoutBtn').addEventListener('click', () => {
        logoutUser();
    });
    
    // Toggle between login/register
    document.querySelectorAll('.auth-form h3').forEach(h3 => {
        h3.style.cursor = 'pointer';
        h3.addEventListener('click', function() {
            const isLogin = this.textContent === 'Login';
            document.getElementById('loginForm').style.display = isLogin ? 'block' : 'none';
            document.getElementById('registerForm').style.display = isLogin ? 'none' : 'block';
        });
    });
}
