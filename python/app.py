from flask import Flask, request, jsonify
import pandas as pd
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
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
        
        if not dataPath or not modelPath:
            return jsonify({"error": "Missing dataPath or modelPath"}), 400

        # Log the received data
        print(f"Received dataPath: {dataPath}")
        print(f"Received modelPath: {modelPath}")

        df = pd.read_csv(dataPath)
        with open(modelPath, 'rb') as file:
            model = pickle.load(file)

        X = df.drop(['Id', 'Species'], axis=1)
        y_true = df['Species']
        y_pred = model.predict(X)

        accuracy = accuracy_score(y_true, y_pred)
        precision = precision_score(y_true, y_pred, average='weighted')
        recall = recall_score(y_true, y_pred, average='weighted')
        f1 = f1_score(y_true, y_pred, average='weighted')

        return jsonify({"accuracy": accuracy, "precision": precision, "recall": recall, "f1Score": f1})
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)