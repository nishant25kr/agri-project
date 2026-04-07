from django.http import JsonResponse
from django.core.files.storage import FileSystemStorage
from django.views.decorators.csrf import csrf_exempt
from .models import DiseaseDetection
from PIL import Image
import os
import json
import base64
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()


def disease_home(request):
    return JsonResponse({"status": "Disease Detection API is online"})


def analyze_with_gemini(image_path):
    """
    Use Gemini Vision to analyze a leaf image and return structured diagnosis.
    """
    api_key = os.getenv('GEMINI_API_KEY')
    if not api_key or api_key == 'your-gemini-api-key-here':
        raise ValueError("Gemini API key not configured.")

    genai.configure(api_key=api_key)
    model = genai.GenerativeModel(
        model_name='gemini-2.5-flash-image',
        generation_config={
            'temperature': 0.1,   # Low temp = consistent, deterministic answers
            'max_output_tokens': 800,
        }
    )

    # Open and send the actual image to Gemini
    image = Image.open(image_path).convert("RGB")

    prompt = """You are a professional plant pathologist. Carefully analyze this leaf image and provide a diagnosis.

Respond ONLY with a valid JSON object in exactly this format (no markdown, no extra text):
{
  "disease": "<Exact disease name, e.g. 'Early Blight', 'Powdery Mildew', 'Healthy'. Be specific.>",
  "confidence": <integer from 60 to 99>,
  "plant": "<Plant species if identifiable, else 'Unknown'>",
  "cause": "<Brief cause: fungus/bacteria/virus/pest name>",
  "symptoms": "<Key visible symptoms in 1-2 sentences>",
  "treatment": "<Specific actionable cure: chemical/fungicide name, dosage, and frequency>",
  "prevention": "<2-3 specific prevention tips>"
}

If the leaf looks healthy, set disease to "Healthy" and adjust other fields accordingly.
Base your diagnosis ONLY on what you actually see in the image — do not guess randomly."""

    response = model.generate_content([prompt, image])
    text = response.text.strip()

    # Strip markdown code fences if present
    if text.startswith("```"):
        text = text.split("```")[1]
        if text.startswith("json"):
            text = text[4:]
    text = text.strip()

    data = json.loads(text)
    return data


@csrf_exempt
def upload_image_api(request):
    """JSON API endpoint for React frontend — uses Gemini Vision for real diagnosis."""
    if request.method != 'POST' or not request.FILES.get('image'):
        return JsonResponse({'success': False, 'error': 'No image uploaded'}, status=400)

    try:
        uploaded_file = request.FILES['image']
        fs = FileSystemStorage()
        filename = fs.save(uploaded_file.name, uploaded_file)
        file_path = fs.path(filename)

        # Real AI analysis
        result = analyze_with_gemini(file_path)

        disease      = result.get('disease', 'Unknown')
        confidence   = result.get('confidence', 75)
        plant        = result.get('plant', 'Unknown')
        cause        = result.get('cause', '')
        symptoms     = result.get('symptoms', '')
        treatment    = result.get('treatment', 'Consult an agricultural expert.')
        prevention   = result.get('prevention', '')

        # Save to DB
        try:
            DiseaseDetection.objects.create(
                image=filename,
                predicted_disease=disease,
                confidence=float(confidence) / 100.0,
                treatment_suggestion=treatment,
            )
        except Exception:
            pass  # Don't fail if DB save errors

        return JsonResponse({
            'success': True,
            'disease': disease,
            'confidence': confidence,
            'plant': plant,
            'cause': cause,
            'symptoms': symptoms,
            'treatment': treatment,
            'prevention': prevention,
            'image_url': fs.url(filename),
        })

    except json.JSONDecodeError:
        return JsonResponse({'success': False, 'error': 'AI returned an unexpected format. Please try again.'}, status=500)
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=500)


def upload_image(request):
    """Legacy HTML view — redirects to home."""
    return disease_home(request)