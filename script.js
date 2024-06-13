const apiKey = 'AIzaSyBImGSWgdR5hFz5UTtMs7m9_jJsakWGpis';
const searchButton = document.getElementById('search-button');
const searchQuery = document.getElementById('search-query');
const resultsContainer = document.getElementById('results');
const playerContainer = document.getElementById('player-container');
let player;

// Function to load the YouTube IFrame Player API code asynchronously.
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// This function creates an <iframe> and YouTube player after the API code downloads.
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '315',
        width: '560',
        videoId: '',
        events: {
            'onReady': onPlayerReady
        }
    });
}

searchButton.addEventListener('click', () => {
    const query = searchQuery.value;
    searchYouTube(query);
});

function searchYouTube(query) {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${query}&key=${apiKey}`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayResults(data.items);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

function displayResults(videos) {
    resultsContainer.innerHTML = '';
    videos.forEach(video => {
        const videoElement = document.createElement('div');
        videoElement.classList.add('video');
        
        const thumbnail = video.snippet.thumbnails.default.url;
        const title = video.snippet.title;
        const description = video.snippet.description;
        const videoId = video.id.videoId;
        
        videoElement.innerHTML = `
            <img src="${thumbnail}" alt="${title}">
            <div class="details">
                <h3>${title}</h3>
                <p>${description}</p>
            </div>
        `;
        
        videoElement.addEventListener('click', () => {
            playVideo(videoId);
        });
        
        resultsContainer.appendChild(videoElement);
    });
}

function playVideo(videoId) {
    if (player && player.loadVideoById) {
        player.loadVideoById(videoId);
    } else {
        player = new YT.Player('player', {
            height: '315',
            width: '560',
            videoId: videoId,
            events: {
                'onReady': onPlayerReady
            }
        });
    }
    playerContainer.classList.add('show');
}

function onPlayerReady(event) {
    event.target.playVideo();
}

// Hide the player when clicking outside of it
window.addEventListener('click', function(event) {
    if (event.target === playerContainer) {
        playerContainer.classList.remove('show');
        player.stopVideo();
    }
});
