# 🌾 AgriZone - AI-Powered Agriculture Platform

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Version](https://img.shields.io/badge/version-1.0.0-orange)
![Python](https://img.shields.io/badge/python-3.11+-blue)
![React](https://img.shields.io/badge/react-19-blue)

**AgriZone** is a high-performance, intelligence-driven Agri-Tech platform designed to empower farmers with real-time AI insights, hyper-local data, and sustainable agricultural strategies. By merging cutting-edge neural networks with precision data, AgriZone provides actionable advice for every step of the farming journey.

---

## 📖 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Usage](#-usage)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

- **🧠 Crop Advisor**: Precision AI recommendations based on NPK values, soil pH, and local microclimate data.
- **🔬 Disease Scan**: AI Vision model powered by Gemini to diagnose plant pathologies from leaf photographs instantly.
- **🌤️ Smart Weather**: Hyper-local forecasts calibrated to exact field coordinates for better planning.
- **🤖 AI Farm Assistant**: 24/7 agricultural expert (LLM) to answer farming queries, from pest control to market timing.
- **⚠️ Risk Alerts**: Automated regional outbreak and pest warnings before they reach your fields.

---

## 🛠 Tech Stack

### 🔗 Backend
- **Framework**: [Django 5.0](https://www.djangoproject.com/) + [Django REST Framework](https://www.django-rest-framework.org/)
- **AI Models**: [Google Gemini 2.0 Flash](https://ai.google.dev/) (Image & Text generation), [Scikit-learn](https://scikit-learn.org/) (Pickled ML models)
- **Database**: SQLite (Default) / PostgreSQL support
- **Preprocessing**: Pillow (Image), NumPy, Pandas

### 🎨 Frontend
- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [TailwindCSS 4](https://tailwindcss.com/) + Custom Vanilla CSS
- **Routing**: [React Router Dom 7](https://reactrouter.com/)
- **Typography**: [Google Fonts](https://fonts.google.com/) (Lora & DM Sans)

---

## 📋 Prerequisites

Before setting up AgriZone, ensure you have the following installed:
- **Python 3.11+**
- **Node.js 18+** & **npm**
- **API Keys**: Google Gemini API key and OpenWeather API key.

---

## 🚀 Installation

### 1. Clone the repository
```bash
git clone https://github.com/your-username/agrizone.git
cd agrizone
```

### 2. Backend Setup
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows use: .venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

---

## 💻 Usage

### Start Backend Server
```bash
cd backend
source .venv/bin/activate
python manage.py runserver
```
The backend will be available at `http://localhost:8000`.

### Start Frontend Dev Server
```bash
cd frontend
npm run dev
```
The application will be accessible at `http://localhost:5173`.

---

## 🔑 Environment Variables

Create a `.env` file in the `backend/` directory with the following variables:

| Variable | Description |
|---|---|
| `SECRET_KEY` | Django Secret Key |
| `DEBUG` | Set to `True` for development |
| `GEMINI_API_KEY` | Your Google Gemini API Key |
| `OPENWEATHER_API_KEY` | Your OpenWeatherMap API Key |
| `OPENAI_API_KEY` | (Optional) OpenAI API Key for fallback |
| `EMAIL_HOST_USER` | Gmail address for support notifications |
| `EMAIL_HOST_PASSWORD` | App-specific password for Gmail |

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/predict/` | Get crop recommendation based on soil data |
| `GET` | `/weather/get-weather/` | Fetch current hyper-local weather data |
| `POST` | `/disease/api/upload/` | Upload image for plant disease diagnosis |
| `POST` | `/chatbot/send-message/` | Send query to the AI Farm Assistant |
| `GET` | `/alerts/get-alerts/` | Fetch regional pest outbreak alerts |

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

*“Feeding the Future through Advanced Intelligence.”* 🌾✨
