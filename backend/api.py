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
      vid["title"] = " ".join(vid["title"].split())
  videos.append(req_data)
  record_vids()
  return json.dumps({"success": True}), 201

@app.route('/full_graph')
def full_graph():
    js_path = "./js/full_graph.js"
    return render_template('graph.html', context=js_path)

def record_vids():
  video_log = open("data/videos.json", "w+")
  video_log.write(json.dumps(videos) + "\n")
  video_log.close()



if __name__ == '__main__':
  app.run(debug=True, port=8000)

