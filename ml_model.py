import pandas as pd
import numpy as np
from sklearn.tree import DecisionTreeClassifier
import joblib

# Load data from CSV file
data = pd.read_csv("simulated_energy_data.csv") 

# Convert recommendation labels to binary (1 = Reduce usage, 0 = Usage is okay)
data['suggestion'] = data['Recommendation'].apply(lambda x: 1 if x == "Reduce usage" else 0)

X = data[['Temperature (°C)', 'Occupancy (people)', 'Energy Usage (kWh)']]
y = data['suggestion']

model = DecisionTreeClassifier()
model.fit(X, y)

joblib.dump(model, "energy_model.pkl")

# Function to make a prediction
def predict_suggestion(temperature, occupancy, energy_usage):
    model = joblib.load("energy_model.pkl")
    input_data = pd.DataFrame([[temperature, occupancy, energy_usage]], columns=['Temperature (°C)', 'Occupancy (people)', 'Energy Usage (kWh)'])
    prediction = model.predict(input_data)
    return "Reduce usage" if prediction[0] == 1 else "Usage is okay"

# # Example input
# example_temperature = 34
# example_occupancy = 1
# example_energy_usage = 300

# # Output prediction
# output = predict_suggestion(example_temperature, example_occupancy, example_energy_usage)
# print("Prediction:", output)