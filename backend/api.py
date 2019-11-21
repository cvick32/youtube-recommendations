from flask import Flask, json, request
from flask_cors import CORS, cross_origin

app = Flask(__name__)
app.config['CORS_HEADERS'] = 'Content-Type'
cors = CORS(app, resources={r"/foo": {"origins": "http://localhost:port"}})

videos = list()

@app.route('/recs', methods=['POST'])
@cross_origin(origin='localhost',headers=['Content-Type','Authorization'])
def receive_recommendations():
  req_data = request.get_json()
  videos.append(req_data)
  record_vids()
  return json.dumps({"success": True}), 201

def record_vids():
  video_log = open("data/videos.json", "w+")
  video_log.write(json.dumps(videos) + "\n")
  video_log.close()

if __name__ == '__main__':
  app.run(debug=True, port=8000)

"""
toSend = {
        "name": curVideo,
        "channel": curChannel,
        "link": curUrl,
        "up_next_link": upNextLink,
        "recommended": [recVideoStruct]
    }
"""

"""
recVideoStruct = {
        "title": "",
        "channel": "",
        "link": ""
    }
"""