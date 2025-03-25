# 🧠 AI News Show – Project Summary

## 📺 Project Overview

The **AI News Show** is a multi-character interactive news broadcast featuring:

- Real-time generated voice
- On-screen 2D animations
- A producer's control panel

The system pulls live news from the **Google News API** (filtered by AI/ML/Tech/Futurology) and generates fictional news when no major stories are available.


![WhatsApp Image 2025-01-29 at 16 27 44_45e687f5](https://github.com/user-attachments/assets/80884553-1f97-4d64-a47d-b47ac2828099)

---

## 🚀 Key Features

### 🎙️ Five Unique Characters
Each with distinct personality, voice, and visual avatar:

- **Macallan** – witty, ironic, narcissistic (human host)
- **Zyx-9** – mind-bending AI with quantum sarcasm
- **The Blob** – confused alien, comedic relief
- **Glitch** – digital conspiracy theorist
- **Chronos** – time-traveling historian

### 🔊 Real-Time Voice Generation
- Powered by OpenAI Realtime API
- Character-specific voice settings
- Lip-sync animations synced to voice
- Streaming audio playback

### 🎛️ Interactive Producer Panel
- Password-protected login
- Character energy level controls
- Custom story injection
- News queue manager
- Emergency stop button

### 💬 Live Chat System
- Real-time messaging between viewers
- Character responses to chat
- Username selection and authentication

### 🗞️ News Management
- Google News API integration
- Fallback to AI-generated “fake news”
- Breaking news ticker

---

## 🧩 Key Components

Frontend Components
NewsShow – Main application layout

Character – On-screen avatar/animation

VoiceGenerator – Connects to OpenAI API

LipSync – Syncs phonemes to animation

ProducerPanel – Admin tools

ChatBox – Live chat UI

Backend Components
NewsService – Fetches Google or fake news

VoiceService – Sends voice generation requests

DatabaseService – File-based storage engine

NewsShowOrchestrator – Controls event flow

---

## ☁️ Deployment Options
Frontend	Backend
Vercel	Heroku
Netlify	Google Cloud Run
AWS Amplify	AWS EC2 / DigitalOcean
See docs/deployment_guide.md for detailed setup steps.

---

## 📚 Documentation

###File	Description
user_manual.md	
End-user guide for viewers and producers
deployment_guide.md	
How to deploy frontend + backend
testing_plan.md	
QA and verification checklist
system_architecture.md	Visual and logic architecture
character_profiles.md	

Details on all 5 character personalities

---

## 🧭 Next Steps

Clone the repo

Set up API keys for:

OpenAI (Realtime Voice)

Google News API

Deploy the backend

Deploy the frontend

Access the producer panel with:

text
Copy
Edit
password: producer123

---

## 🌱 Future Enhancements
Persistent memory for each character

Full-body motion system

News source aggregator (Reddit, RSS, etc.)

Mobile-friendly mode

VR/AR immersive version

---


## 🛠️ Technical Implementation

| Layer       | Stack                    |
|-------------|--------------------------|
| Frontend    | Next.js + Tailwind CSS   |
| Backend     | Node.js + Express        |
| Realtime    | Socket.IO                |
| Animation   | PIXI.js                  |
| Voice       | OpenAI Realtime API      |
| Database    | File-based (upgradable)  |

---

## 📂 Project Structure

```plaintext
ai-news-show/
├── frontend/               # Next.js frontend
│   ├── src/
│   │   ├── app/            # Next.js pages
│   │   ├── components/     # React components
│   │   └── styles/         # CSS modules or Tailwind
│   ├── public/             # Static files
│   └── package.json        # Frontend dependencies
├── backend/                # Express backend
│   ├── routes/             # API endpoints
│   ├── services/           # News, voice, state logic
│   ├── data/               # JSON/flat-file DB
│   └── server.js           # Server entry point
├── docs/                   # Documentation
│   ├── character_profiles.md
│   ├── deployment_guide.md
│   ├── system_architecture.md
│   ├── testing_plan.md
│   └── user_manual.md
└── design/                 # Architecture & UI assets
    └── system_architecture.png

![system_architecture](https://github.com/user-attachments/assets/686a99d5-58ed-4384-9e5a-347d5d793a5d)




