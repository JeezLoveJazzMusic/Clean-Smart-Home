from flask import Flask, request, jsonify
import joblib
import pandas as pd

app = Flask(__name__)

# Load trained model
model = joblib.load("energy_model.pkl")

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    temperature = data['temperature']
    occupancy = data['occupancy']
    energy_usage = data['energy_usage']

    # Prepare input data
    input_data = pd.DataFrame([[temperature, occupancy, energy_usage]], 
                              columns=['Temperature (°C)', 'Occupancy (people)', 'Energy Usage (kWh)'])

    # Make prediction
    prediction = model.predict(input_data)[0]
    suggestion = "Reduce usage" if prediction == 1 else "Usage is okay"

    return jsonify({"prediction": suggestion})

if __name__ == '__main__':
    app.run(debug=True)
