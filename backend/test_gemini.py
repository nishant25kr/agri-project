import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv('GEMINI_API_KEY')
if not api_key:
    print("NO API KEY")
    exit(1)

genai.configure(api_key=api_key)

try:
    print("Testing gemini-2.5-flash...")
    # model = genai.GenerativeModel('gemini-1.5-flash')
    model = genai.GenerativeModel(
        model_name='gemini-2.5-flash-image',
        generation_config={
            'temperature': 0.1,   # Low temp = consistent, deterministic answers
            'max_output_tokens': 800,
        }
    )
    response = model.generate_content("Hello, what is your name?")
    print("Response:", response.text)
except Exception as e:
    print("Error with gemini-1.5-flash:", e)

try:
    print("Testing gemini-pro...")
    # model = genai.GenerativeModel('gemini-pro')
    model = genai.GenerativeModel(
        model_name='gemini-2.5-flash-image',
        generation_config={
            'temperature': 0.1,   # Low temp = consistent, deterministic answers
            'max_output_tokens': 800,
        }
    )
    response = model.generate_content("Hello, what is your name?")
    print("Response:", response.text)
except Exception as e:
    print("Error with gemini-pro:", e)
