from flask import Flask, request, jsonify
from flask_cors import CORS  # ✅ Needed for frontend requests
import utill  # ✅ Your utility functions for prediction

app = Flask(__name__)
CORS(app)  # ✅ Allow CORS from all origins (important for frontend)

@app.route("/get_prediction_of_heart", methods=['POST'])
def predictionOfHeart():
    data = request.get_json()

    # Extracting input values from request JSON
    age = data['age']
    RestingBP = data['RestingBP']
    Cholesterol = data['Cholesterol']
    FastingBS = data['FastingBS']
    RestingECG = data['RestingECG']
    MaxHR = data['MaxHR']
    ExerciseAngina = data['ExerciseAngina']
    Oldpeak = data['Oldpeak']
    ST_Slope = data['ST_Slope']
    Sex_M = data['Sex_M']
    ChestPainType_ATA = data['ChestPainType_ATA']
    ChestPainType_NAP = data['ChestPainType_NAP']
    ChestPainType_TA = data['ChestPainType_TA']

    # Make prediction using utility function
    result = utill.get_prediction_of_heart(
        age, RestingBP, Cholesterol, FastingBS, RestingECG,
        MaxHR, ExerciseAngina, Oldpeak, ST_Slope, Sex_M,
        ChestPainType_ATA, ChestPainType_NAP, ChestPainType_TA
    )

    return jsonify({'prediction': int(result)})

@app.route("/asim", methods=['GET'])
def get_features_names():
    return jsonify({
        'features': utill.get_data_columns()
    })

if __name__ == "__main__":
    utill.load_saved_artifacts()
    app.run(debug=True)
