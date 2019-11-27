var relatedVideos = "div#secondary > #secondary-inner > #related > ytd-watch-next-secondary-results-renderer > #items ";
var upNext = relatedVideos + " > ytd-compact-autoplay-renderer > div#contents > ytd-compact-video-renderer > div#dismissable > ytd-thumbnail > a#thumbnail";

var currentVideoTitle = "div#primary > #primary-inner > #info > #info-contents > ytd-video-primary-info-renderer  #container > h1 > yt-formatted-string";
var currentChannelName = "#channel-name > #container > #text-container > yt-formatted-string > a";
var i = 0;

var RELATEDVIDEOSMAX = 5;
/**
 * Gets the recommended videos on a given page up to maximum, 
 * defined above
 */
function getRecommendedVideos(curUrl) {
    console.log("RECOMMENDATIONS");

    this.upNextLink = document.querySelector(upNext).href;
    var curVideo   = document.querySelector(currentVideoTitle).text;
    var curChannel = document.querySelector(currentChannelName).text;
    
    var recommendedLinks = getRecommendedLinks();
    
    console.log(upNextLink);
    console.log(recommendedLinks);
    toSend = {
        "name": curVideo,
        "channel": curChannel,
        "link": curUrl,
        "up_next_link": upNextLink,
        "recommended": recommendedLinks
    }
    return toSend;
}

/**
 * Returns an array that contains the recommended video
 * information for the current video
 */
function getRecommendedLinks() {
    var recommendedLinks = [];
    for (video = 3; video < RELATEDVIDEOSMAX + 3; video++) {
        try {
            recommendedLinks.push(getRecommendedVideoStructure(video));
        } catch (err) {
            console.log(err);
        }
    }
    return recommendedLinks;
}

/**
 * Returns the DOM selector for a given recommended video
 * @param {index in recommended videos} videoIndex 
 */
function getRecommendedVideoStructure(videoIndex) {
    var recVideoStruct = {
        "title": "",
        "channel": "",
        "link": ""
    }
    var recPrefix = relatedVideos + `> ytd-compact-video-renderer:nth-child(${videoIndex}) > div#dismissable`;
    
    var vidTitle = recPrefix + ` > div > div.metadata.style-scope.ytd-compact-video-renderer > a`; 
    var chanName = vidTitle  + " > div > ytd-video-meta-block > #metadata > #byline-container > #channel-name > #container > #text-container > #text";
    var vidLink  = recPrefix + ` > ytd-thumbnail > a#thumbnail`;

    recVideoStruct["title"] = document.querySelector(vidTitle).text.replace(/(\r\n|\n|\r)/gm,"").trim().trim();
    recVideoStruct["channel"] = document.querySelector(chanName).title;
    recVideoStruct["link"] = document.querySelector(vidLink).href;
    return recVideoStruct;
}

/**
 * Send JSON to video backend
 * @param jsonBody 
 */
function sendAPIRequest(jsonBody) {
    const req = new XMLHttpRequest();
    const url = 'http://127.0.0.1:8000/recs';
    req.open("POST", url);
    req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    req.setRequestHeader('Access-Control-Allow-Origin', '*');
    req.send(JSON.stringify(jsonBody));

    req.onreadystatechange = (e) => {
        console.log(req.responseText)
    }
}


/**
 * Sleeps for `time_ms`
 * @param {timeout in milliseconds} time_ms 
 */
function sleep(time_ms) {
    return new Promise(resolve => setTimeout(resolve, time_ms));
}

/**
 * Runs the recommended video scrape for `video_limit`
 * number of videos and sends the json to the backend
 * @param {int} video_limit 
 */
async function videoScrapeLoop(video_limit) {
    
    var curUrl = window.location.href;
    while (this.i < video_limit) {
        if (curUrl != window.location.href) {
            curUrl = window.location.href;
            rec_vids_json = getRecommendedVideos(curUrl);
            sendAPIRequest(rec_vids_json);
            this.i++;
        }
       await sleep(5000);
       document.querySelector(upNext).click();
    }
    console.log("Finished");
}

json = getRecommendedVideos();
sendAPIRequest(json);
videoScrapeLoop(3);
