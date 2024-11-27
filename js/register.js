// Firebase configuration
const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyB9eKtlnkh0m1iy0jXRmeV0M4l9--L5SO0",
    authDomain: "skibidi-b2e25.firebaseapp.com",
    projectId: "skibidi-b2e25",
    storageBucket: "skibidi-b2e25.firebasestorage.app",
    messagingSenderId: "85996005175",
    appId: "1:85996005175:web:66c4b1dae60695c54a9cb2",
    measurementId: "G-Y2CCMJZ4E6"
});

// Initialize Firebase services
const db = firebaseApp.firestore();
const auth = firebaseApp.auth();

// Function to toggle between login and signup forms
function toggleForms() {
    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");
    if (loginForm.style.display === "none") {
        loginForm.style.display = "block";
        signupForm.style.display = "none";
    } else {
        loginForm.style.display = "none";
        signupForm.style.display = "block";
    }
}
 
// Login function
function login() {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    auth.signInWithEmailAndPassword(email, password)
        .then((userCredentials) => {
            sessionStorage.setItem("uid", userCredentials.user.uid);
            window.location.href = "./index.html"; // Redirect after login
        })
        .catch((error) => {
            console.error("Login failed: ", error.message);
            alert("Login failed: " + error.message);
        });
}

// Signup function
function signUp() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const fname = document.getElementById("fname").value;
    const lname = document.getElementById("lname").value;

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredentials) => {
            sessionStorage.setItem("uid", userCredentials.user.uid);
            return db.collection("users").doc(userCredentials.user.uid).set({
                firstname: fname,
                lastname: lname,
                email: email,
                userId: userCredentials.user.uid
            });
        })
        .then(() => {
            window.location.href = "./index.html"; // Redirect after signup
        })
        .catch((err) => {
            alert("Signup failed: " + err.message);
            console.log("Error code: ", err.code);
            console.log("Error message: ", err.message);
        });
}

// Add event listeners to trigger login/signup on Enter key press
document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        const loginForm = document.getElementById("loginForm");
        const signupForm = document.getElementById("signupForm");
        if (loginForm.style.display !== "none") {
            login(); // Trigger login if login form is visible
        } else if (signupForm.style.display !== "none") {
            signUp(); // Trigger signup if signup form is visible
        }
    }
});
