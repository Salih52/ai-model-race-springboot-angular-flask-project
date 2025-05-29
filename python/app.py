from flask import Flask, request, jsonify
import pandas as pd
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, mean_absolute_error, mean_squared_error, r2_score
from sklearn.preprocessing import StandardScaler
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import LabelEncoder
import joblib  

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
        preProcessCode = data.get('preProcessCode')

        if competitionType == "deepLearning":
            from keras_preprocessing.image import ImageDataGenerator
            from keras.src.saving import load_model
            import numpy as np

            # Load the saved model
            print(dataPath)
            model = load_model(modelPath)

            # Define the test data directory
            test_data_dir = str(dataPath)

            # Create an ImageDataGenerator for the test data
            test_datagen = ImageDataGenerator(rescale=1./255)

            # Create a test data generator
            test_gen = test_datagen.flow_from_directory(
                test_data_dir,
                target_size=(224, 224),
                batch_size=32,
                class_mode='categorical',
                shuffle=False
            )

            # Evaluate the model on the test data
            test_loss, test_accuracy = model.evaluate(test_gen)
            print(f'Test accuracy: {test_accuracy:.5f}')
            return jsonify({"accuracy": test_accuracy})
        
        if competitionType == "nlpClassification":
            model = joblib.load(modelPath)
            dt = pd.read_csv(dataPath)
            text = dt[dt.columns[0]]
            labels = dt[dt.columns[1]]
            test_lebelencoder = LabelEncoder()
            x = test_lebelencoder.fit_transform(labels)

            predictions = model.predict(text)
            accuracy = accuracy_score(x, predictions)
            return jsonify({"accuracy": accuracy})
            

        dfreal = pd.read_csv(dataPath)
        last_column = dfreal.columns[-1]
        df = dfreal.drop([last_column], axis=1)
        y_true = dfreal[last_column]
         # Apply preprocessing if preProcessCode is provided
        if preProcessCode:
            preProcessCode = preProcessCode.replace(u'\u00A0', ' ')
            local_vars = {}
            exec(preProcessCode, globals(), local_vars)
            preprocessing = local_vars['preprocessing']
            df = preprocessing(df)

        
        # model = pickle.load(open(modelPath, 'rb'))
        model1 = joblib.load(modelPath)
        print(type(model1))

        if competitionType == "classification":
            y_pred = model1.predict(df)

            accuracy = accuracy_score(y_true, y_pred)
            precision = precision_score(y_true, y_pred, average='weighted')
            recall = recall_score(y_true, y_pred, average='weighted')
            f1 = f1_score(y_true, y_pred, average='weighted')

            return jsonify({"accuracy": accuracy, "precision": precision, "recall": recall, "f1Score": f1})
        elif competitionType == "regression":
            y_pred = model1.predict(df)

            mae = mean_absolute_error(y_true, y_pred)
            mse = mean_squared_error(y_true, y_pred)
            r2 = r2_score(y_true, y_pred)

            return jsonify({"meanAbsoluteError": mae, "meanSquaredError": mse, "r2Score": r2})

    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)