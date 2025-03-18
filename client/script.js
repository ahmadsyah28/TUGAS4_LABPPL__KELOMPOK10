// API URL (replace with your actual API URL)
const API_URL = 'http://localhost:3000/api/anime';

// DOM Elements
const animeForm = document.getElementById('animeForm');
const animeList = document.getElementById('animeList');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const modal = document.getElementById('animeModal');
const closeModalBtn = document.querySelector('.close');
const animeDetails = document.getElementById('animeDetails');

// Stats elements
const totalAnimeEl = document.getElementById('totalAnime');
const avgEpisodesEl = document.getElementById('avgEpisodes');
const avgRatingEl = document.getElementById('avgRating');

// Current anime being edited
let currentAnimeId = null;

// Fetch all anime and display them
async function fetchAndDisplayAnime() {
    try {
        const response = await fetch(API_URL);
        const result = await response.json();
        
        if (result.status === 'success') {
            displayAnimeList(result.data);
            updateStats(result.data);
        } else {
            showMessage('Error fetching anime data');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('Failed to connect to the server');
    }
}

// Display anime list
function displayAnimeList(animeArray) {
    animeList.innerHTML = '';
    
    if (animeArray.length === 0) {
        animeList.innerHTML = '<p class="no-data">No anime found. Add some to your collection!</p>';
        return;
    }
    
    animeArray.forEach(anime => {
        const animeCard = document.createElement('div');
        animeCard.className = 'anime-card';
        animeCard.dataset.id = anime.id;
        
        animeCard.innerHTML = `
            <div class="anime-card-header">
                <h3>${anime.title}</h3>
            </div>
            <div class="anime-card-body">
                <p class="genre">${anime.genre}</p>
                <p>Episodes: ${anime.episodes}</p>
                <p class="rating">Rating: ${anime.rating ? anime.rating : 'N/A'}</p>
                <div class="actions">
                    <button class="edit-btn" data-id="${anime.id}">Edit</button>
                    <button class="delete-btn" data-id="${anime.id}">Delete</button>
                </div>
            </div>
        `;
        
        animeList.appendChild(animeCard);
        
        // Add click event to view details
        animeCard.addEventListener('click', (e) => {
            // Prevent triggering when clicking buttons
            if (!e.target.classList.contains('edit-btn') && !e.target.classList.contains('delete-btn')) {
                showAnimeDetails(anime);
            }
        });
    });
    
    // Add event listeners to edit and delete buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            editAnime(id);
        });
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            if (confirm('Are you sure you want to delete this anime?')) {
                deleteAnime(id);
            }
        });
    });
}

// Show anime details in modal
function showAnimeDetails(anime) {
    animeDetails.innerHTML = `
        <h3>${anime.title}</h3>
        <div class="detail-row">
            <strong>Genre:</strong> <span>${anime.genre}</span>
        </div>
        <div class="detail-row">
            <strong>Episodes:</strong> <span>${anime.episodes}</span>
        </div>
        <div class="detail-row">
            <strong>Rating:</strong> <span>${anime.rating ? anime.rating : 'N/A'}</span>
        </div>
        <div class="detail-row">
            <strong>Studio:</strong> <span>${anime.studio ? anime.studio : 'Unknown'}</span>
        </div>
    `;
    
    modal.style.display = 'block';
}

// Update stats
function updateStats(animeArray) {
    if (animeArray.length === 0) {
        totalAnimeEl.textContent = '0';
        avgEpisodesEl.textContent = '0';
        avgRatingEl.textContent = '0';
        return;
    }
    
    const totalAnime = animeArray.length;
    
    const totalEpisodes = animeArray.reduce((sum, anime) => sum + anime.episodes, 0);
    const avgEpisodes = Math.round(totalEpisodes / totalAnime);
    
    const validRatings = animeArray.filter(anime => anime.rating !== null && anime.rating !== undefined);
    const totalRating = validRatings.reduce((sum, anime) => sum + anime.rating, 0);
    const avgRating = validRatings.length > 0 ? (totalRating / validRatings.length).toFixed(1) : 'N/A';
    
    totalAnimeEl.textContent = totalAnime;
    avgEpisodesEl.textContent = avgEpisodes;
    avgRatingEl.textContent = avgRating;
}

// Submit form (add or update anime)
async function submitForm(e) {
    e.preventDefault();
    
    const title = document.getElementById('title').value;
    const genre = document.getElementById('genre').value;
    const episodes = parseInt(document.getElementById('episodes').value);
    const ratingInput = document.getElementById('rating').value;
    const rating = ratingInput ? parseFloat(ratingInput) : null;
    const studio = document.getElementById('studio').value;
    
    const animeData = {
        title,
        genre,
        episodes,
        rating,
        studio
    };
    
    try {
        let url = API_URL;
        let method = 'POST';
        
        // If editing, use PUT method
        if (currentAnimeId) {
            url = `${API_URL}/${currentAnimeId}`;
            method = 'PUT';
        }
        
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(animeData)
        });
        
        const result = await response.json();
        
        if (result.status === 'success') {
            resetForm();
            fetchAndDisplayAnime();
            showMessage(currentAnimeId ? 'Anime updated successfully' : 'Anime added successfully');
        } else {
            showMessage(`Error: ${result.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('Failed to connect to the server');
    }
}

// Edit anime
async function editAnime(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const result = await response.json();
        
        if (result.status === 'success') {
            const anime = result.data;
            
            // Fill the form with anime data
            document.getElementById('title').value = anime.title;
            document.getElementById('genre').value = anime.genre;
            document.getElementById('episodes').value = anime.episodes;
            document.getElementById('rating').value = anime.rating || '';
            document.getElementById('studio').value = anime.studio || '';
            
            // Set current anime ID and change button text
            currentAnimeId = anime.id;
            submitBtn.textContent = 'Update Anime';
            cancelBtn.style.display = 'inline-block';
            
            // Scroll to form
            document.querySelector('.anime-form-container').scrollIntoView({ behavior: 'smooth' });
        } else {
            showMessage(`Error: ${result.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('Failed to connect to the server');
    }
}

// Delete anime
async function deleteAnime(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.status === 'success') {
            fetchAndDisplayAnime();
            showMessage('Anime deleted successfully');
        } else {
            showMessage(`Error: ${result.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('Failed to connect to the server');
    }
}

// Search anime
async function searchAnime() {
    const query = searchInput.value.trim();
    
    if (!query) {
        fetchAndDisplayAnime();
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/search/query?q=${encodeURIComponent(query)}`);
        const result = await response.json();
        
        if (result.status === 'success') {
            displayAnimeList(result.data);
            updateStats(result.data);
        } else {
            showMessage(`Error: ${result.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('Failed to connect to the server');
    }
}

// Reset form
function resetForm() {
    animeForm.reset();
    currentAnimeId = null;
    submitBtn.textContent = 'Add Anime';
    cancelBtn.style.display = 'none';
}

// Show message (you can implement a toast or other notification)
function showMessage(message) {
    alert(message);
}

// Event Listeners
animeForm.addEventListener('submit', submitForm);
searchBtn.addEventListener('click', searchAnime);
searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        searchAnime();
    }
});
cancelBtn.addEventListener('click', resetForm);

// Modal events
closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Load anime when page loads
document.addEventListener('DOMContentLoaded', fetchAndDisplayAnime);