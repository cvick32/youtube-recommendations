var relatedVideosMax = 5;

var relatedVideosSelector = "div#secondary > #secondary-inner > #related > ytd-watch-next-secondary-results-renderer > #items";
var upNextSelector = relatedVideosSelector + " > ytd-compact-autoplay-renderer > div#contents > ytd-compact-video-renderer > div#dismissable > ytd-thumbnail > a#thumbnail";

/**
 * Gets the recommended videos on a given page up to maximum, 
 * defined above
 */
function getRecommendedVideos() {
  console.log("RECOMMENDATIONS")
  var upNextLink = document.querySelector(upNextSelector).href;
  var recommendedLinks = [];
  // must start from 3
  for (video = 3; video < relatedVideosMax + 3; video++) {
    try {
      recommendedLinks.push(document.querySelector(selectorForVideo(video)).href);
    } catch (err) {
      console.log(err);
    }
  }
  console.log(upNextLink);
  console.log(recommendedLinks);
  toSend = {
    "upNext": upNextLink,
    "recommended": recommendedLinks
  }
  sendAPIRequest(toSend);
}

/**
 * Send JSON to video backend
 * @param jsonBody 
 */
function sendAPIRequest(jsonBody) {
  const req = new XMLHttpRequest();
  const url='http://127.0.0.1:8000/recs';
  req.open("POST", url);
  req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  req.setRequestHeader('Access-Control-Allow-Origin', '*');
  req.send(JSON.stringify(jsonBody));

  req.onreadystatechange = (e) => {
    console.log(req.responseText)
  }
}

/**
 * Returns the DOM selector for a given recommended video
 * @param {index in recommended videos} videoIndex 
 */
function selectorForVideo(videoIndex) {
  return relatedVideosSelector + ` > ytd-compact-video-renderer:nth-child(${videoIndex}) > div#dismissable > ytd-thumbnail > a#thumbnail`;
}

getRecommendedVideos();