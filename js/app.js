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

// Initialize Firebase and Firestore
const db = firebaseApp.firestore();
const auth = firebaseApp.auth();



// Function to add a new anime
function addItem() {
    const title = document.getElementById("title").value;
    const releaseDate = document.getElementById("releaseDate").value;
    const rating = document.getElementById("rating").value;
    const genre = document.getElementById("genre").value;
    const imageUrl = document.getElementById("imageUrl").value;
    let userId = sessionStorage.getItem("uid");

    db.collection("anime").doc(title).set({
        title: title,
        releaseDate: releaseDate,
        rating: rating,
        genre: genre,
        imageUrl: imageUrl,
        userId: userId
    }).then(() => {
        getItems(); // Refresh the anime list
        clearFormFields(); // Clear input fields after adding
    });
}

// Function to clear the form fields
function clearFormFields() {
    document.getElementById("title").value = ""; 
    document.getElementById("releaseDate").value = ""; 
    document.getElementById("rating").value = ""; 
    document.getElementById("genre").value = "";
    document.getElementById("imageUrl").value = "";
}

// Function to display the anime list
function getItems() {
    let items = "";
    let userId = sessionStorage.getItem("uid");
    db.collection("anime").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (doc.data().userId == userId) {

          
            items += `
                <div class='anime-card'>
                    <img src='${data.imageUrl}' alt='${data.title}'>
                    <div>
                        <h2>${data.title}</h2>
                        <p>Genre: ${data.genre}</p>
                        <p>Rating: ${data.rating}/10</p>
                        <p>Released: ${data.releaseDate}</p>
                        <button onclick="confirmDelete('${doc.id}')">Delete</button>
                        <button onclick="openEditModal('${doc.id}')">Edit</button>
                    </div>
                </div>
            `;
        }
        });
        document.getElementById("animeList").innerHTML = items;
    });
}

// Function to confirm deletion
function confirmDelete(id) {
    const confirmation = confirm("Are you sure you want to delete this anime?");
    if (confirmation) {
        deleteItem(id);
    }
}

// Function to delete an anime from Firestore
function deleteItem(id) {
    db.collection("anime").doc(id).delete().then(() => {
        getItems(); // Refresh the anime list after deletion
    }).catch((error) => {
        console.error("Error deleting document: ", error);
    });
}

// Function to open the edit modal
function openEditModal(id) {
    // Create modal HTML
    const modalHTML = `
        <div id="editModal" class="modal">
            <div class="modal-content">
                <span class="close" onclick="closeModal()">&times;</span>
                <h2>Edit Anime</h2>
             <div>  <label>Title<label> <br><input type="text" id="editTitle" placeholder="Anime Name" required> </div>
               <div> <label>Release Date</label><br><input type="date" id="editReleaseDate" placeholder="Release Date" required> </div>
                <div><label>Rating</label><br><input type="number" id="editRating" placeholder="Rating (1-10)" min="1" max="10" required></div>
               <div> <label>Genre</label><br><input type="text" id="editGenre" placeholder="Genre" required> </div>
                <div> <label>Image Url<label><br><input type="url" id="editImageUrl" placeholder="Image URL" required></div>
                <div><button onclick="saveChanges('${id}')">Save Changes</button></div>
            </div>
        </div>
    `;

    // Insert modal into the DOM
    document.body.insertAdjacentHTML("beforeend", modalHTML);

    // Get anime data from Firestore to populate the fields
    db.collection("anime").doc(id).get().then((doc) => {
        if (doc.exists) {
            const data = doc.data();
            document.getElementById("editTitle").value = data.title;
            document.getElementById("editReleaseDate").value = data.releaseDate;
            document.getElementById("editRating").value = data.rating;
            document.getElementById("editGenre").value = data.genre;
            document.getElementById("editImageUrl").value = data.imageUrl;
        }
    });
}

// Function to save changes made in the modal
function saveChanges(id) {
    const title = document.getElementById("editTitle").value;
    const releaseDate = document.getElementById("editReleaseDate").value;
    const rating = document.getElementById("editRating").value;
    const genre = document.getElementById("editGenre").value;
    const imageUrl = document.getElementById("editImageUrl").value;

    db.collection("anime").doc(id).update({
        title: title,
        releaseDate: releaseDate,
        rating: rating,
        genre: genre,
        imageUrl: imageUrl
    }).then(() => {
        closeModal(); // Close the modal after saving
        getItems(); // Refresh the anime list
    });
}

// Function to close and remove the modal from the DOM
function closeModal() {
    const modal = document.getElementById("editModal");
    if (modal) {
        modal.remove();
    }
}

// Initial load of anime list
getItems();

// Function to display a personalized greeting
function displayGreeting() {
    const userId = sessionStorage.getItem("uid"); // Get the logged-in user's UID

    if (userId) {
        // Fetch the user's data from Firestore
        db.collection("users").doc(userId).get()
            .then((doc) => {
                if (doc.exists) {
                    const userData = doc.data();
                    const fullName = `${userData.firstname} ${userData.lastname}`;
                    document.getElementById("hei").textContent = `Hei, ${fullName}! Velkommen tilbake!`;
                } else {
                    console.error("No user data found!");
                }
            })
            .catch((error) => {
                console.error("Error fetching user data: ", error);
            });
    } else {
        document.getElementById("hei").textContent = "Hei! Logg inn for å begynne.";
        window.location.href = "login.html";
    }
}

// Call the function when the page loads
window.onload = displayGreeting;
