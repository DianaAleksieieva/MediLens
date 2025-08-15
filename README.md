# 💊 MediLens

**AI-powered prescription and pill label assistant** that extracts, interprets, and explains medical information in simple, accessible language.  
Users can scan medication packaging or prescriptions and ask follow-up questions about usage, side effects, and interactions.

---

## 🚀 Features
- 📷 **OCR-based extraction** of pill names and prescription instructions.
- 🤖 **AI-powered explanation** of medical jargon in clear, natural language.
- 💊 **FDA-backed information** on approved uses, side effects, warnings, and contraindications.
- 💬 **Follow-up questions** in plain English.
- ♿ **Accessibility-friendly**: Screen reader-ready output, with potential for voice assistance.

---

## 🛠 Tech Stack & Data Flow

### **Frontend**
- **React** – Responsive web application for mobile-first use.
- Handles image uploads and displays AI-generated responses.

### **Backend**
- **FastAPI** – Connects frontend to OCR service, AI processing, and FDA API.
- **PaddleOCR** – Extracts text from pill labels and prescriptions.
- **LangGraph + Gemini** – Processes extracted text, generates user-friendly explanations, and handles Q&A in natural language.
- **openFDA API** – Retrieves official drug information, including approved uses, side effects, and warnings.

---

### **Data Flow**
1. **User Input** – Upload an image of a pill label or prescription via the React frontend.
2. **OCR Processing** – FastAPI sends the image to PaddleOCR to extract text.
3. **Drug Info Retrieval** – Extracted text is passed to LangGraph + Gemini; calls openFDA API for official data.
4. **AI Explanation** – Gemini generates simplified explanations and answers follow-up questions.
5. **Response to User** – FastAPI returns the explanation to the React frontend for display.

---

## 📌 Current Status
- **Backend** ✅ Fully implemented — OCR, AI processing, and FDA API integrations are functional.
- **Frontend** ⚠️ UI in place, but not yet connected to backend endpoints.

---

## 📂 Project Structure
MediLens/
│── backend/           # FastAPI backend with OCR, AI, and FDA API integrations
│── frontend/          # React app for uploading images and displaying results
│── requirements.txt   # Python dependencies
│── package.json       # Frontend dependencies
└── README.md

## 🔮 Future Enhancements
- 🔗 Integrate backend with frontend.
- 🗣 Add voice assistant mode for visually impaired users.
- 🌍 Multi-language support for OCR and AI responses.
- 🔐 User authentication and saved prescription history.
