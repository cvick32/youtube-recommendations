import sys

from flask import Flask, json, request, render_template
from flask_cors import CORS, cross_origin

app = Flask(__name__)
app.config['CORS_HEADERS'] = 'Content-Type'
cors = CORS(app, resources={r"/foo": {"origins": "http://localhost:port"}})

videos = list()

@app.route('/recs', methods=['POST'])
@cross_origin(origin='localhost',headers=['Content-Type','Authorization'])
def receive_recommendations():
  req_data = request.get_json()
  for vid in req_data["recommended"]:
    l = vid["title"].split("            ")
    l = [x.split() for x in l if x != '']
    vid["title"] = " ".join(l[0])
  videos.append(req_data)
  record_vids()
  return json.dumps({"success": True}), 201

@app.route('/')
def render_graph():
    if request.args.get('seed') and request.args.get('bent'):
        vid_seed = request.args.get('seed')
        vid_bent = request.args.get('bent')
        json_path = f"/static/{vid_bent}_{vid_seed}.json"
    else:
        json_path = "/static/videos.json"
    return render_template('base.html', json_path=json_path)

def record_vids():
  video_log = open(DATA_FILE, "w+")
  video_log.write(json.dumps(videos) + "\n")
  video_log.close()


if __name__ == '__main__':
    if len(sys.argv) == 3:
        bent = sys.argv[1]
        seed = sys.argv[2]
        DATA_FILE = f"static/{bent}_{seed}.json"
    else: 
        DATA_FILE = "static/blank_videos.json"
    video_file = open(DATA_FILE, "w+")
    try:
        videos = json.load(video_file)
    except:
        videos = list()
    video_file.close()
    app.run(debug=True, port=8000)
