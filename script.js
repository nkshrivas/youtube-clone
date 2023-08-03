// script.js
const API_KEY = 'AIzaSyAwaTURGoTgniCZ6WL6DP3oPeq6EuK8O0o';
const BASEURL_VIDEO = 'https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&regionCode=IN&maxResults=50';
const BASEURL_SEARCH = 'https://www.googleapis.com/youtube/v3/search';

let videoData = [];
function createVideoCard(video) {
    const videoId = video.id.kind === 'youtube#video' ? video.id.videoId : video.id;
    console.log(video, 'search data', videoId);

    document.getElementById('video-card').innerHTML += `
        <div class="card" id='${videoId}'>
        <a href="video.html?id=${videoId}">
            <img src="${video.snippet.thumbnails.medium.url}" alt="Avatar" style="width:100%">
            <div class="container">
                <h4><b>${video.snippet.title}</b></h4>
                <p>${video.snippet.channelTitle}</p>
                <p>${video.snippet.publishedAt}</p>
            </div>
           <a/> 
        </div>
    `;
}

function getVideoData(searchQuery) {
    try {
        const params = new URLSearchParams({
            part: 'snippet',
            q: searchQuery,
            maxResults: 50,
            key: API_KEY,
        });

        const url = searchQuery?`${BASEURL_SEARCH}?${params.toString()}`:`${BASEURL_VIDEO}&key=${API_KEY}`;
        console.log(url,searchQuery)

       fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        }).then((response) => {
            return response.json();
        }).then((data) => {
            videoData = data.items;
            // console.log(videoData);
             
            // Clear previous search results
            document.getElementById('video-card').innerHTML = '';

            // create cards
            videoData.map((video) => {
                createVideoCard(video);
            });
        }).catch((error) => {
            console.log(error);
        });
    } catch (error) {
        console.log(error);
    }
}
getVideoData();


document.getElementById('search-btn').addEventListener('click', () => {
    const searchQuery = document.getElementById('search-input').value;
    console.log(searchQuery)
    if (searchQuery.trim() !== '') {
        getVideoData(searchQuery);
    }
});

document.getElementById('search-input').addEventListener('keyup', (event) => {
    if (event.keyCode === 13) {
        const searchQuery = event.target.value;
        if (searchQuery.trim() !== '') {
            getVideoData(searchQuery);
        }
    }
});
