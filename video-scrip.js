// video.js
const API_KEY = 'AIzaSyAwaTURGoTgniCZ6WL6DP3oPeq6EuK8O0o';


// video.js
const BASEURL_VIDEO = 'https://www.googleapis.com/youtube/v3/videos';
const BASEURL_COMMENTS = 'https://www.googleapis.com/youtube/v3/commentThreads';
const BASEURL_RELATED_VIDEOS = 'https://www.googleapis.com/youtube/v3/search';

function truncateDescription(description, maxLength) {
    if (description.length <= maxLength) {
        return description;
    }
    return description.substr(0, maxLength) + '...';
}
function showMore(videoId) {
    const videoDetailsContainer = document.getElementById('video-details');
    const video = videoData.find((video) => video.id === videoId);

    videoDetailsContainer.innerHTML = `
        <iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
        <h5>${video.snippet.title}</h5>
        <p>${video.snippet.publishedAt}</p>
        <p>${video.snippet.channelTitle}</p>
        <p>${video.snippet.description}</p>
        <button onclick="showLess('${videoId}')">Show Less</button>
    `;
}

function showLess(videoId) {
    const videoDetailsContainer = document.getElementById('video-details');
    const video = videoData.find((video) => video.id === videoId);

    videoDetailsContainer.innerHTML = `
        <iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
        <h5>${video.snippet.title}</h5>
        <p>${video.snippet.publishedAt}</p>
        <p>${video.snippet.channelTitle}</p>
        <p>${truncateDescription(video.snippet.description, 100)}</p>
        ${
            video.snippet.description.length > 100
                ? `<button onclick="showMore('${videoId}')">Show More</button>`
                : ''
        }
    `;
}

function displayVideoDetails(videoId) {
    // Fetch video details
    const videoParams = new URLSearchParams({
        part: 'snippet',
        id: videoId,
        key: API_KEY,
    });

    const videoUrl = `${BASEURL_VIDEO}?${videoParams.toString()}`;

    fetch(videoUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    }).then((response) => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    }).then((data) => {
        const video = data.items[0];
        console.log(video);

        // Display video details on the video page
        const videoDetailsContainer = document.getElementById('video-details');
        videoDetailsContainer.innerHTML = `
            <iframe width="760" height="415" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
            <h5>${video.snippet.title}</h5>
            <p>${video.snippet.publishedAt}</p>
            <p>${video.snippet.channelTitle}</p>
            <p>${truncateDescription(video.snippet.description,100) }</p>
            ${
                video.snippet.description.length > 100 ?
                `<span id="show" onclick="showMore(${videoId})"><b>Show More</b></span>` : ''

            }
            <div class="add-comment">
            <input type="text"  placeholder="Add a public comment...">
            </div> 
            `;

        // Fetch and display comments
        fetchComments(videoId);

        // Fetch and display recommended videos
        fetchRelatedVideos(videoId);
    }).catch((error) => {
        console.log('Error:', error);
    });
}

function fetchComments(videoId) {
    const commentsParams = new URLSearchParams({
        part: 'snippet',
        videoId: videoId,
        key: API_KEY,
    });

    const commentsUrl = `${BASEURL_COMMENTS}?${commentsParams.toString()}`;
    console.log(commentsUrl,'commentsUrl')

    fetch(commentsUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    }).then((response) => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    }).then((data) => {
        const comments = data.items;
        console.log(comments,'comments');

        // Display comments on the video page
        const commentsContainer = document.getElementById('comments');
        commentsContainer.innerHTML = '';

        comments.forEach((comment) => {
            const commentSnippet = comment.snippet.topLevelComment.snippet;
            commentsContainer.innerHTML += `
          
            <div class="comment">
                    <img src="${commentSnippet.authorProfileImageUrl}" alt="Profile Image">
                    <div class="comment-content">
                        <h4>${commentSnippet.authorDisplayName}</h4>
                        <p>${commentSnippet.textDisplay}</p>
                    </div>
                </div>
            `;
        });
    }).catch((error) => {
        console.log('Error:', error);
    });
}

function fetchRelatedVideos(videoId) {
    const relatedVideosParams = new URLSearchParams({
        part: 'snippet',
        type: 'video',
        relatedToVideoId: videoId,
        maxResults: 10,
        key: API_KEY,
    });

    const relatedVideosUrl = `${BASEURL_RELATED_VIDEOS}?${relatedVideosParams.toString()}`;

    fetch(relatedVideosUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    }).then((response) => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    }).then((data) => {
        const relatedVideos = data.items;
        console.log(relatedVideos);

        // Display related videos on the video page
        const relatedVideosContainer = document.getElementById('related-videos');
        relatedVideosContainer.innerHTML = '';

        relatedVideos?.forEach((video) => {
            const videoId = video.id.videoId;
            const videoTitle = video.snippet.title;
            relatedVideosContainer.innerHTML += `
                <div class="related-video">
                    <a href="video.html?id=${videoId}">
                        <img src="${video.snippet.thumbnails.medium.url}" alt="Video Thumbnail">
                        <h4>${videoTitle}</h4>
                    </a>
                </div>
            `;
        });
    }).catch((error) => {
        console.log('Error:', error);
    });
}


// Get the video ID from the URL parameter
const urlParams = new URLSearchParams(window.location.search);
const videoId = urlParams.get('id');

// Fetch and display video details, comments, and recommended videos
if (videoId) {
    displayVideoDetails(videoId);
} else {
    console.log('Video ID not found in URL');
}



























// const BASEURL_VIDEO = 'https://www.googleapis.com/youtube/v3/videos';

// function displayVideoDetails(videoId) {
//     const params = new URLSearchParams({
//         part: 'snippet',
//         id: videoId,
//         key: API_KEY,
//     });

//     const url = `${BASEURL_VIDEO}?${params.toString()}`;

//     fetch(url, {
//         method: 'GET',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//     }).then((response) => {
//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }
//         return response.json();
//     }).then((data) => {
//         const video = data.items[0];
//         console.log(video);

//         // Display video details on the video page
//         const videoDetailsContainer = document.getElementById('video-details');
//         videoDetailsContainer.innerHTML = `
//             <h2>${video.snippet.title}</h2>
//             <p>${video.snippet.channelTitle}</p>
//             <p>${video.snippet.publishedAt}</p>
//             <iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
//         `;
//     }).catch((error) => {
//         console.log('Error:', error);
//     });
// }

// // Get the video ID from the URL parameter
// const urlParams = new URLSearchParams(window.location.search);
// const videoId = urlParams.get('id');

// // Fetch and display video details
// if (videoId) {
//     displayVideoDetails(videoId);
// } else {
//     console.log('Video ID not found in URL');
// }
