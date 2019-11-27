# youtube-recommendations
Chrome extension for mapping how a given user is recommended videos. 

## How it works
- Add this extension to Chrome
- log into YouTube
- watch videos and the extension will do the rest

## How to run
### backend
- `pip3 install flask flask-cors`
- `cd backend`
- `python3 api.py`

### visualization
- follow backend steps above
  - *optionally* change the data in backend/static/videos.json to whatever data that you have collected
- navigate to `127.0.0.1/full_graph` in your browser

### extension
- 1) go to chrome://extensions > Load unpacked > navigate to the extension directory and select it
- 2) go to youtube and start watching videos
- 2.1) BUG: currently, 11/17, you have to refresh the page for it work. This is because youtube is a 
  single page app and our content script, `logger.js`, currently fires on the first page load instead
  of when a particular event is fired, not super sure how to fix this. 
## Data we're collecting
We aren't collecting any personal data about you automatically. There are really three
tiers of personal data you can give us. First, you can use the extension anonymously. 
This will give us the data on what videos you watched and what videos YouTube recommended
you given that video. Second, you can tell us who you are but not what videos you watched.
This will mainly help us in generating a rough demographic report on who is using our tool
and as a result, how we should look at the data. Third, you can tell us who you are and which
videos you watched. This, in the future, could also include your subscriptions and demographic
information.

## Automating data collection
There will also be a feature to allow the extension to automatically navigate to the next video 
in the queue after a certain amount of time. There is obviously already autoplay implemented on 
YouTube itself but this feature will make it a bit less time consuming for testers to generate
viewing histories if they choose to. 

## How it *actually* works
We take the link of the video you're currently watching and also scrape the top ten recommended
videos from the page. We then send it to our backend in the following form:
```
{
  "user": username,
  "current_video": "link",
  "recommended": ["link","link"...]
}
```
As you can see, there is an optional user field that contains your username if you elect to share
that information with us. Again, you can choose whether or not to share this information with us.

## What happens with the data
We're still wondering what to do for this part. One idea is to make sure that people watch from 
the set set of videos and then visualize all the different paths that YouTube sends you down.
Hopefully the structure will be interesting, perhaps like what's shown below. 

```
                                                       +----------+
                                                 +---->+  VIDEO 4 |
                                                 |     +----------+
                              +-----------+      |     +----------+
+----------------+----------->+  VIDEO 2  +------+---->+  VIDEO 5 |
|                |            +-----------+            +----------+
|   VIDEO 1      |
|                |            +-----------+            +----------+
+----------------+----------->+  VIDEO 3  +------+---->+  VIDEO 6 |
                              +-----------+      |     +----------+
                                                 |     +----------+
                                                 +---->+  VIDEO 7 |
                                                       +----------+
```

# Checklist
- [x] Initial Proposal
- [x] Readme
- [x] Meeting with Prof. Mislove
- [x] Decide on YouTube ad crawling
- [x] Build a test that generates correct json
- [x] Build backend endpoint that logs viewed json
- [x] Fix refresh bug
- [x] Visualization for video graph
- [ ] Read flat videos.json file so we can append to it
- [ ] Automate viewing in extension
- [ ] Setup dedicated backend on (AWS, heroku?)
