# 🏨 HotelSpot
### Full Stack Hotel Booking Web Application

![React](https://img.shields.io/badge/Frontend-React-blue)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green)
![Express](https://img.shields.io/badge/Framework-Express-lightgrey)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-darkgreen)
![License](https://img.shields.io/badge/License-MIT-orange)

HotelSpot is a **full-stack hotel booking web application** designed to help users easily discover hotels, view detailed information, and manage bookings through a simple and user-friendly interface.

The platform also includes an **admin dashboard** that allows administrators to manage hotel listings, update hotel information, and monitor bookings efficiently.

This project demonstrates the implementation of **modern full-stack web development including frontend, backend APIs, authentication, and database integration.**

---

# 🚀 Features

## 👤 User Features
- User registration and login
- Browse and search hotels
- View detailed hotel information
- Add hotels to favourites
- Book hotels
- View booking history
- Manage personal profile

## 🛠 Admin Features
- Admin dashboard
- Add new hotels
- Update hotel details
- Delete hotel listings
- Manage bookings
- Monitor platform activity

---

# 🧑‍💻 Tech Stack

| Layer | Technology |
|------|-------------|
| Frontend | React / Next.js |
| Backend | Node.js |
| Framework | Express.js |
| Database | MongoDB |
| Authentication | JWT |
| Version Control | Git & GitHub |

---

# 🏗 System Architecture

Frontend (React / Next.js)
│
▼
Backend API (Node.js + Express)
│
▼
Database (MongoDB)

# 📂 Project Structure


hotelspot/
│
├── hotelspot-frontend/ # Frontend application
│ 
│
├── hotelspot-backend/ # Backend application
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── middleware/
│ └── config/



# ⚙️ Installation & Setup

## 1️⃣ Clone the Repository

git clone https://github.com/your-username/hotelspot.git
cd hotelspot


## 2️⃣ Install Backend Dependencies
cd backend
npm install


## 3️⃣ Install Frontend Dependencies
cd hotelspot-frontend
npm install

🔑 Environment Variables
PORT=5050
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

▶️ Running the Application
1. Start Backend
cd backend
npm run dev

Backend runs on:
http://localhost:5050

2. Start Frontend
cd hotelspot-frontend
npm run dev

Frontend runs on:
http://localhost:3000


🌐 Application Workflow
User registers or logs in.
User browses available hotels.
User views hotel details.
User adds hotels to favourites or books them.
Admin manages hotel listings and bookings, users, review, through the admin dashboard.

🔒 Security

JWT-based authentication
Password hashing
Secure API routes
MongoDB database protection


🚀 Future Improvements

Real-time room availability
Email notifications
Mobile responsive improvements


👨‍💻 Author
Asrim Suwal
Undergraduate Computing Student
GitHub: https://github.com/asrim10

⭐ Support
If you like this project, please consider giving it a star ⭐ on GitHub.
