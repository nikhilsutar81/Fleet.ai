<div align="center">

# ⚡ Fleet.ai  
### *AI-Powered Content Generation at Your Fingertips*  

[![Live Demo](https://img.shields.io/badge/demo-live-green?style=for-the-badge&logo=vercel)](https://fleetai-saas.vercel.app)  
[![Made with React](https://img.shields.io/badge/frontend-react_19-61dafb?style=for-the-badge&logo=react)](#tech-stack)  
[![Node.js](https://img.shields.io/badge/backend-node.js_20-43853d?style=for-the-badge&logo=node.js)](#tech-stack)  
[![PostgreSQL](https://img.shields.io/badge/database-postgresql-336791?style=for-the-badge&logo=postgresql)](#tech-stack)  
[![OpenAI](https://img.shields.io/badge/AI-OpenAI-412991?style=for-the-badge&logo=openai)](#ai-capabilities)  

</div>

---

## 📖 Table of Contents  

- [Overview](#-overview)  
- [Key Features](#-key-features)  
- [Tech Stack](#-tech-stack)  
- [Architecture](#-architecture)  
- [Environment Variables](#-environment-variables)  
- [AI Capabilities](#-ai-capabilities)  
- [API Endpoints](#-api-endpoints)  
- [Deployment](#-deployment)  
- [Screenshots](#-screenshots)  
- [Contributing](#-contributing)  


## 🚀 Overview  

**Fleet.ai** is a modern **AI SaaS platform** built with the **PERN stack** and powered by **OpenAI + cutting-edge APIs**. It’s designed to make creativity effortless with AI tools for:  

- 🎨 Image generation & editing  
- 📝 Intelligent content creation  
- 📄 Resume review & optimization  
- 🖼️ Background & object removal  
- ✍️ Blog title generation  
- 👥 Community sharing  


---

## ✨ Key Features  

### 🤖 AI-Powered Tools  
- Generate images from text prompts  
- Remove backgrounds & unwanted objects  
- AI-assisted article & blog writing  
- SEO-friendly blog titles  
- Resume analysis & suggestions  

### 👤 User Experience  
- 🔑 Secure authentication via **Clerk**  
- 📊 Centralized dashboard  
- 🌐 Community sharing hub  
- 📱 Responsive design (mobile-first)  
- ⚡ Real-time AI processing  

### 🛡️ Enterprise-Grade  
- ☁️ Cloudinary for secure file uploads & CDN  
- 📄 PDF resume parsing  
- 📈 Scalable backend with PostgreSQL (Neon)  
- 🧩 API-first architecture 

---

## 🛠️ Tech Stack  

### Frontend  
- **React 19** + **Vite**  
- **Tailwind CSS**  
- **React Router DOM**  
- **Axios**  
- **Lucide React** (icons)  
- **React Hot Toast** (notifications)  
- **Clerk** (authentication)  

### Backend  
- **Node.js + Express 5**  
- **PostgreSQL (Neon)**  
- **OpenAI API / Gemini API / ClipDrop**  
- **Cloudinary** (media handling)  
- **Multer, PDF-Parse, CORS**  

### Deployment  
- **Vercel** (frontend & backend)  
- **Neon** (database hosting)  
- **Cloudinary** (media CDN)  
- **Clerk** (auth service) 

---

## 🏗️ Architecture  

```bash
QuickAI/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── assets/        # Static assets
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Route pages
│   │   └── ...
│
├── server/                # Express Backend
│   ├── configs/          # Cloudinary, DB, multer
│   ├── controllers/      # Business logic
│   ├── middlewares/      # Auth middleware
│   ├── routes/           # API routes
│   └── server.js         # Entry point

```

---

## ⚙️ Environment Variables


**Client (.env)**
```
VITE_CLERK_PUBLISHABLE_KEY=pk_test_Z2xvd2luZy1tYXN0b2Rvbi04Ny5jbGVyay5hY2NvdW50cy5kZXYk
VITE_BASE_URL=http://localhost:3000
```

**Server (.env)**
```
CLOUDINARY_CLOUD_NAME= djkrwlwkr
CLOUDINARY_API_KEY= 751688764292381
CLOUDINARY_API_SECRET= wA5VxsIGMgxZeN2FgKVDY3Fhdzg
PORT=3000
DATABASE_URL= 'postgresql://neondb_owner:npg_jTULAnWYK0h6@ep-dark-bonus-a804djp0-pooler.eastus2.azure.neon.tech/neondb?sslmode=require&channel_binding=require'
CLERK_PUBLISHABLE_KEY=pk_test_Z2xvd2luZy1tYXN0b2Rvbi04Ny5jbGVyay5hY2NvdW50cy5kZXYk
CLERK_SECRET_KEY=sk_test_snf7XT31O1axpMifgJZPGYwos3IXgPyTJ0CWBOIajx
GEMINI_API_KEY=AIzaSyCBq5YnJuT7f8bLIhAmVASdEfsyTHow8j0
CLIPDROP_API_KEY=75004965a6a293880ad6cd38d06f527b072dd816ef60443f4266169de5ff9bc91cc3f7cdb2c5db5a9a5334463044c052
```

---

## 🧠 AI Capabilities

- Image Generation → Text-to-image with DALL·E
- Image Editing → Background & object removal
- Content Creation → Articles, blogs, SEO titles
- Document Processing → Resume review, scoring & skills gap analysis

---

## API Endpoints

### AI Routes (`/api/ai`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/generate-image` | Generate images from text |
| POST | `/remove-background` | Remove image backgrounds |
| POST | `/remove-object` | Remove objects from images |
| POST | `/write-article` | Generate article content |
| POST | `/generate-titles` | Create blog post titles |
| POST | `/review-resume` | Analyze and score resumes |

### User Routes (`/api/users`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/profile` | Get user profile |
| POST | `/creations` | Save user creations |
| GET | `/creations` | Get user's creations |
| GET | `/community` | Get community creations |

---

## Deployment

### Backend (Vercel)
Deploy with environment variables configured for:
- Neon PostgreSQL database
- GEMINI API keys
- Cloudinary credentials
- Clerk secrets

---

## 📸 Screenshots
Dashboard
<img width="1879" height="918" alt="Fleet.ai Screenshot" src="https://github.com/user-attachments/assets/1fe2c198-c9b1-4289-ab47-47b9175b2d59" />

---

## 🤝 Contributing

Contributions are welcome! 🎉
- Fork the repo
- Create a feature branch (git checkout -b feature-xyz)
- Commit changes (git commit -m "Added xyz feature")
- Push & open a PR

---

<div align="center">

**Fleet.ai** - Supercharge your creativity with AI! 🚀

*Built using PERN stack and cutting-edge AI technologies.*

**Made by <i>[nikhilsutar81](https://github.com/nikhilsutar81)</i>**

</div>




