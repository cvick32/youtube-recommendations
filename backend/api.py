from flask import Flask, json, request, render_template
from flask_cors import CORS, cross_origin

app = Flask(__name__)
app.config['CORS_HEADERS'] = 'Content-Type'
cors = CORS(app, resources={r"/foo": {"origins": "http://localhost:port"}})

DATA_FILE = "static/blank_user_videos.json"

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

@app.route('/full_graph')
def full_graph():
    js_path = "./js/full_graph.js"
    return render_template('base.html', context=js_path)

def record_vids():
  video_log = open(DATA_FILE, "w+")
  video_log.write(json.dumps(videos) + "\n")
  video_log.close()


if __name__ == '__main__':
    video_file = open(DATA_FILE, "r")
    videos = json.load(video_file)
    video_file.close()
    app.run(debug=True, port=8000)

