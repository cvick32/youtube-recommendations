// set data file
video_data = "/static/blank_user_videos.json";

let videos;
let links = [];
let totalLinks = 0;

// set up canvas constants for D3
const width = 2000;
const height = 1000; 
const colors = d3.scaleOrdinal(d3.schemeCategory10);


const svg = d3.select('body')
    .append('svg')
    .attr('oncontextmenu', 'return false;');

svg.call(d3.zoom()
    .scaleExtent([1 / 2, 8])
    .on('zoom', zoomed));

// negative repels objects, positive attracts
let forceStrength = -1000;
let circleSize = 13;

let defs = svg.append('svg:defs')

// define arrow in svg
defs.append('svg:marker')
    .attr('id', 'arrow')
    .attr('viewBox', '0 -5 10 10')
    .attr('refX', 6)
    .attr('markerWidth', 3)
    .attr('markerHeight', 3)
    .attr('orient', 'auto')
.append('svg:path')
    .attr('d', 'M0,-5L10,0L0,5')
    .attr('fill', '#000');


// set up container, path and circle objects
let container = svg.append('svg:g');
let path = container.append('svg:g').selectAll('path');
let circle = container.append('svg:g').selectAll('g');

/**
 * function called on zoom event
 */
function zoomed() {
    container.attr("transform", d3.event.transform);
}

/**
 * initialize d3 force object
 */
function createD3Force() {
    return d3.forceSimulation()
        .force('link', d3.forceLink().id((d) => d.link).distance(150))
        .force('charge', d3.forceManyBody().strength(forceStrength))
        .force('x', d3.forceX(width / 2))
        .force('y', d3.forceY(height / 2))
        .on('tick', tick);
}

/**
 * Ansync method provided by D3 for reading in JSON data.
 * After we grab the data from the file, we set up the link
 * data structure that we will use for graphically rendering
 * the web.
 */
function dataLoadAndSetup() {
    d3.json(video_data).then(function (data) {
        videos = processVideos(data);
        setUpLinks();
        setSVG();
    });
}

function processVideos(data) {
    videos = [];
    for (let i = 0; i < data.length; i++) {
        videos.push(data[i]);
        if (data[i]["recommended"]) {
            for (let j = 0; j < data[i]["recommended"].length; j++) {
                videos.push(data[i]["recommended"][j])
            }
        }
    }
    return videos;
}

/**
 * constructs links between related videos
 */
function setUpLinks() {
    for (let i = 0; i < videos.length; i++) {
        cur_video = videos[i];
        recommended = cur_video["recommended"];
        /**
        up_next_link = cur_video["up_next_link"];
        if (up_next_link) {
            links.push({ source: cur_video, target: up_next_link, left: false, right: true });
        }
        */
        if (recommended) {
            for (let i = 0; i < recommended.length; i++) {
                target = getVideoFromLink(cur_video, recommended[i]["link"]);
            }
        }
    }
}
/**
 * this function takes a source video and a recommendation link
 * and tries to find it in the overall list of videos. if it does
 * a link is added, if not nothing happens.
 * @param {source video} cur_video 
 * @param {linked video} link 
 */
function getVideoFromLink(cur_video, link) {
    let found_vid = videos.filter((vid) => {
        return vid.link === link;
    });
    if (found_vid[0]) {
        links.push({ source: cur_video, target: found_vid[0], left: false, right: true });
    } 
}

/**
 *  d3 function that happens each clock tick
 */
function tick() {
    path.attr('d', (d) => {
        const deltaX = d.target.x - d.source.x;
        const deltaY = d.target.y - d.source.y;
        const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const normX = deltaX / dist;
        const normY = deltaY / dist;
        const sourcePadding = d.left ? 17 : 12;
        const targetPadding = d.right ? 17 : 12;
        const sourceX = d.source.x + (sourcePadding * normX);
        const sourceY = d.source.y + (sourcePadding * normY);
        const targetX = d.target.x - (targetPadding * normX);
        const targetY = d.target.y - (targetPadding * normY);

        return `M${sourceX},${sourceY}L${targetX},${targetY}`;
    });
    circle.attr('transform', (d) => `translate(${d.x},${d.y})`);
}

/**
 * sets the svg objects for all videos and links
 */
function setSVG() {
    path = path.data(links);
    path.exit().remove();

    path = path.enter().append('svg:path')
        .attr('class', 'link')
        .style('marker', (d) => 'url(#arrow)')
        .merge(path);

    circle = circle.data(videos, (d) => d.link);

    circle.exit().remove();

    const g = circle.enter().append('svg:g');

    g.append('svg:circle')
        .attr('class', 'node')
        .attr('r', circleSize)
        .style('stroke', d3.rgb(colors(0)).darker().toString())
        .style('fill', "white");

    g.append('svg:text')
        .attr('x', 10)
        .attr('y', 4)
        .attr('class', 'title')
        .text((d) => d.title);
    
    g.append('svg:a')
        .attr('xlink:href', (d) => d.link)
        .on('click')

    circle = g.merge(circle);

    force = createD3Force();
    force.nodes(videos).force('link').links(links);
    force.alphaTarget(0.3).restart();
}


// app start
dataLoadAndSetup();