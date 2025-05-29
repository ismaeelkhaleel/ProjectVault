# 📁 ProjectVault

**ProjectVault** is a full-stack web application designed to manage and showcase academic projects and dissertations. It allows users to upload, browse, filter, and search academic projects. The platform also includes role-based access, project code uploads, and AI-powered personalized project recommendations based on users' skills and bios.

---

## 🌟 Key Features

- 🔐 Role-Based Authentication (User & admin)
- 📄 Project Uploads with Details & github repository link
- 🔍 Search and Filter by Technology, Year, Project Type and supervisor
- 🧠 ML-Based Personalized Project Recommendations
- 🧑‍💼 Editable User Profiles
- 🧾 Clean, Responsive UI with Card and Table Layouts

---

## 📁 Project Structure

projectvault
  backend # Express.js server, MongoDB database
  frontend # React.js client app
  ml-service # Python Flask microservice for AI recommendations


---

## 🧑‍💻 Getting Started

### 🚀 Step 1: Clone the Repository

```
git clone https://github.com/ismaeelkhaleel/ProjectVault.git
cd projectvault
```
🔧 Installation & Setup
📦 Backend Setup (/backend)
1️⃣ Install Dependencies
```
cd backend
npm install
```
Environment Variables
Create a .env file in /backend
```
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5000
GITHUB_TOKEN=your_github_token
EMAIL_PASS=gmail app pass
EMAIL_USER=your email address to sending otp
```
Run the Server
```
nodemon index.js
```
Frontend Setup (/frontend)
1️⃣ Install Dependencies
```
cd frontend
npm install
```
Start the Frontend
```
npm start
```
ML Service Setup (/ml-service)
1️⃣ Install Python Packages
```
cd ml-service
pip install -r requirements.txt
```
Start the Ml service
```
python app.py
```

