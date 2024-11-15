from flask import Flask, request, jsonify
import pandas as pd
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, mean_absolute_error, mean_squared_error, r2_score
import pickle

app = Flask(__name__)

@app.route("/veriAl", methods=['POST'])
def veriAl():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No input data provided"}), 400

        dataPath = data.get('dataPath')
        modelPath = data.get('modelPath')
        competitionType = data.get('competitionType')
        
        if not dataPath or not modelPath:
            return jsonify({"error": "Missing dataPath or modelPath"}), 400

        # Log the received data
        print(f"Received dataPath: {dataPath}")
        print(f"Received modelPath: {modelPath}")
        print(f"Received competitionType: {competitionType}")

        df = pd.read_csv(dataPath)
        with open(modelPath, 'rb') as file:
            model = pickle.load(file)

        last_column = df.columns[-1]
        X = df.drop([last_column], axis=1)
        y_true = df[last_column]

        if competitionType == "classification":
            y_pred = model.predict(X)

            accuracy = accuracy_score(y_true, y_pred)
            precision = precision_score(y_true, y_pred, average='weighted')
            recall = recall_score(y_true, y_pred, average='weighted')
            f1 = f1_score(y_true, y_pred, average='weighted')

            return jsonify({"accuracy": accuracy, "precision": precision, "recall": recall, "f1Score": f1})
        elif competitionType == "regression":
            y_pred = model.predict(X)

            mae = mean_absolute_error(y_true, y_pred)
            mse = mean_squared_error(y_true, y_pred)
            r2 = r2_score(y_true, y_pred)

            return jsonify({"meanAbsoluteError": mae, "meanSquaredError": mse, "r2Score": r2})
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)