import joblib
from fastapi import FastAPI
from pydantic import BaseModel, Field  
import pandas as pd
from typing import Literal
from fastapi.middleware.cors import CORSMiddleware


model = joblib.load('Mental_Health.pkl')
app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

class StudentInput(BaseModel):
    Age : int = Field(..., ge=10, le=100, description="Age of the student (between 10 and 100)")
    Gender: Literal['Male', 'Female'] = Field(..., description="Gender of the student (Male, Female, Other)")
    Country : Literal['Other', 'India', 'USA', 'Canada', 'Australia', 'UK', 'Germany', 'Mexico', 'Turkey', 'France', 'Spain', 'Ireland', 'Denmark', 'Japan', 'Switzerland', 'Nepal', 'Italy', 'Russia', 'Sri Lanka', 'Maldives', 'Bangladesh', 'Pakistan', 'Poland', 'South Korea', 'China', 'Brazil', 'Singapore', 'New Zealand', 'Malaysia', 'Netherlands', 'UAE', 'Finland', 'Uzbekistan', 'Qatar', 'Sweden', 'Norway', 'Egypt', 'Paraguay', 'Cyprus', 'Vietnam', 'Argentina', 'Costa Rica', 'Romania', 'Moldova', 'Georgia', 'Andorra', 'Belgium', 'Greece', 'South Africa', 'Peru', 'Panama', 'Trinidad', 'Czech Republic', 'Latvia', 'Lithuania', 'North Macedonia', 'Lebanon', 'Iraq', 'Afghanistan', 'Hong Kong', 'Morocco', 'Nigeria', 'Slovakia', 'Ukraine', 'Kazakhstan', 'Tajikistan', 'Monaco', 'San Marino', 'Vatican City', 'Albania', 'Austria', 'Portugal', 'Philippines', 'Indonesia', 'Taiwan', 'Israel', 'Ghana', 'Chile', 'Venezuela', 'Jamaica', 'Bahamas', 'Hungary', 'Bulgaria', 'Estonia', 'Azerbaijan', 'Malta', 'Luxembourg', 'Liechtenstein', 'Kosovo', 'Bahrain', 'Oman', 'Jordan', 'Bhutan', 'Thailand', 'Kenya', 'Colombia', 'Ecuador', 'Uruguay', 'Bolivia', 'Iceland', 'Croatia', 'Serbia', 'Slovenia', 'Belarus', 'Kyrgyzstan', 'Armenia', 'Montenegro', 'Bosnia', 'Kuwait', 'Yemen', 'Syria']
    Academic_Level :Literal['Undergraduate', 'Graduate', 'High School']
    Most_Used_Platform : Literal['Instagram','TikTok','Facebook','LinkedIn','YouTube','Twitter','Snapchat','WhatsApp','LINE','VKontakte','KakaoTalk','WeChat']
    Purpose_Of_Use : Literal['Entertainment', 'Education', 'Networking', 'News']
    Avg_Daily_Usage_Hours :float = Field(..., ge=0, le=24, description="Average daily usage hours (between 6 and 24)") 
    Daily_Unlocks : int = Field(..., ge=1,description="Number of daily unlocks (between 1 and 100)")
    Study_Hours : float = Field(..., ge=0, le=24, description="Study hours (between 0 and 24)")
    Physical_Activity_Hours: float = Field(..., ge=0, le=24, description="Physical activity hours (between 0 and 24)")  
    Sleep_Hours_Per_Night : float = Field(..., ge=0, le=24, description="Sleep hours per night (between 0 and 24)")
    Stress_Level : Literal['Very High', 'High', 'Medium', 'Low']

class PredictionOutput(BaseModel):
     predicted_Score:float
     


@app.post("/predict", response_model=PredictionOutput)
def predict(data: StudentInput):
     input_row = pd.DataFrame([data.dict().values()], columns=data.dict().keys())
     prediction = model.predict(input_row)

     return PredictionOutput(predicted_Score=round(float(prediction[0]), 2))
