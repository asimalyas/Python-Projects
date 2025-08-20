import pickle
import json
import numpy as np
import pandas as pd

__data_columns = None
__model = None

def get_prediction_of_heart(age, RestingBP, Cholesterol, FastingBS, RestingECG,
                            MaxHR, ExerciseAngina, Oldpeak, ST_Slope, Sex_M,
                            ChestPainType_ATA, ChestPainType_NAP, ChestPainType_TA):
    input_data = [[age, RestingBP, Cholesterol, FastingBS, RestingECG,
                   MaxHR, ExerciseAngina, Oldpeak, ST_Slope, Sex_M,
                   ChestPainType_ATA, ChestPainType_NAP, ChestPainType_TA]]

    feature_names = ['Age', 'RestingBP', 'Cholesterol', 'FastingBS', 'RestingECG', 
                     'MaxHR', 'ExerciseAngina', 'Oldpeak', 'ST_Slope', 'Sex_M', 
                     'ChestPainType_ATA', 'ChestPainType_NAP', 'ChestPainType_TA']

    df_input = pd.DataFrame(input_data, columns=feature_names)
    return __model.predict(df_input)[0]


def load_saved_artifacts():
    print("artifacts are loading")
    global __data_columns
    with open("./artifacts/columns.json", "r") as f:
        __data_columns = json.load(f)['data_columns']

    global __model
    if __model is None:
        with open('./artifacts/Heart_model', 'rb') as f:
            __model = pickle.load(f)
    print("loading saved artifacts...done")


def get_data_columns():
    return __data_columns


if __name__ == '__main__':
    load_saved_artifacts()
    print(__data_columns)
    print("testing")
    
    # Test call
    prediction = get_prediction_of_heart(49, 160, 180, 0, 1, 156, 0, 1.0, 2, 0, 0, 1, 0)
    print("ANS :", prediction)
    print("asim")
