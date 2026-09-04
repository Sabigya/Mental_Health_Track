# Mental Health Detection

A Machine Learning project that predicts a student's **mental wellness score** based on lifestyle, academic, social-media usage, sleep, physical activity, and stress-related factors.

## Features

* Machine Learning-based prediction
* FastAPI backend
* HTML, CSS, and JavaScript frontend
* REST API
* Input validation
* Wellness score prediction

## Technologies

* Python
* Pandas
* Scikit-learn
* Joblib
* FastAPI
* Pydantic
* HTML
* CSS
* JavaScript

## Input Features

The model uses:

* Age
* Gender
* Country
* Academic Level
* Most Used Platform
* Purpose of Use
* Average Daily Usage Hours
* Daily Unlocks
* Study Hours
* Physical Activity Hours
* Sleep Hours Per Night
* Stress Level

## API

The FastAPI server runs at:

```text
http://127.0.0.1:8000
```

Prediction endpoint:

```text
POST /predict
```

### Example Request

```json
{
  "Age": 21,
  "Gender": "Male",
  "Country": "Nepal",
  "Academic_Level": "Undergraduate",
  "Most_Used_Platform": "Instagram",
  "Purpose_Of_Use": "Entertainment",
  "Avg_Daily_Usage_Hours": 8,
  "Daily_Unlocks": 50,
  "Study_Hours": 5,
  "Physical_Activity_Hours": 1,
  "Sleep_Hours_Per_Night": 7,
  "Stress_Level": "Medium"
}
```

### Example Response

```json
{
  "predicted_Score": 72.35
}
```

## How to Run

### Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/mental-health-detection.git
cd mental-health-detection
```

### Install dependencies

```bash
pip install -r requirements.txt
```

### Run FastAPI

```bash
uvicorn main:app --reload
```

The API will be available at:

```text
http://127.0.0.1:8000
```

API documentation:

```text
http://127.0.0.1:8000/docs
```

## Frontend

Open the `index.html` file in the browser after starting the FastAPI backend.

The frontend sends the user's information to the `/predict` endpoint and displays the predicted wellness score.

## Disclaimer

This project is developed for **educational purposes**. The predicted score is not a medical diagnosis and should not replace professional mental-health advice.

## Author

**Sabigya Adhikari**
