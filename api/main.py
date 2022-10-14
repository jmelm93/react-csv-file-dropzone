#----------------------------------------------------------------------------#
# Imports / App Config.
#----------------------------------------------------------------------------#

from flask import Flask, request
from flask_cors import CORS 

import pandas as pd
import os
import json 

app = Flask(__name__)
CORS(app)


#----------------------------------------------------------------------------#
# Controllers.
#----------------------------------------------------------------------------#



@app.route('/test-endpoint', methods=['GET', 'POST'])
def test_report():
    if request.method == 'GET':
        return 'GET request received'

    if request.method == 'POST':
        
        json_obj = request.get_json()
        
        top_values = json_obj['topValues']
        top_headers = json_obj['topHeaders']
        
        bottom_values = json_obj['bottomValues']
        bottom_headers = json_obj['bottomHeaders']
        
        print("type of top_values: ", type(top_values))
        print("type of top_headers: ", type(top_headers))
        print("type of bottom_values: ", type(bottom_values))
        print("type of bottom_headers: ", type(bottom_headers))
        
        top_df = pd.DataFrame(top_values, columns=top_headers)
        bottom_df = pd.DataFrame(bottom_values, columns=bottom_headers)
        
        print(top_df.head())
        print(bottom_df.head())
        
        top_len = len(top_df)
        bottom_len = len(bottom_df)
        
        response = {
            "message": "Len of top_df: " + str(top_len) + " Len of bottom_df: " + str(bottom_len),
            "status": 200
        }
        
        return json.dumps(response)
        
        # top_files = parse_files(req=request, input_param='top-file')
        # bottom_files = parse_files(req=request, input_param='bottom-file')
        
        # return render_template('pages/placeholder.home.html')


#----------------------------------------------------------------------------#
# Launch.
#----------------------------------------------------------------------------#

# Default port:
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)