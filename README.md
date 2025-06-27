# 🚀 ResolveNow - Complaint Management System

**ResolveNow** is a full-stack, role-based complaint management system that helps organizations efficiently manage, assign, and resolve complaints. Built with **React**, **Node.js**, **Express**, and **MongoDB**, ResolveNow provides user-friendly interfaces for Users, Admins, and Engineers, and is completely free and open source.

---

## 🌐 Live Demo

> [🔗 View Live (Optional)](https://your-deployed-site.com)

---

## 📸 Screenshots

![Landing Page](./screenshots/landing.png)
![User Dashboard](./screenshots/user-dashboard.png)
![Admin Dashboard](./screenshots/admin-dashboard.png)
![Engineer Dashboard](./screenshots/engineer-dashboard.png)

---

## 🧰 Tech Stack

### Frontend
- ⚛️ React
- 🔄 React Router
- 🎨 Bootstrap 5
- 🔐 Context API (Authentication)
- 📡 Axios

### Backend
- 🟢 Node.js
- 🚀 Express.js
- 🍃 MongoDB + Mongoose
- 🔐 JWT (Authentication)
- 🔑 bcrypt.js
- 🌐 dotenv
- 🔄 CORS

---

## 👥 User Roles & Features

### 👤 User
- Register, login, logout
- Raise new complaints with priority levels
- View status of submitted complaints

### 🛠 Admin
- Register, login, logout
- View all complaints
- Assign complaints to engineers
- Monitor complaint statuses

### 🧑‍🔧 Engineer
- Register, login, logout
- View assigned complaints
- Update complaint statuses (e.g., In Progress, Resolved)

---

## 🧾 Key Features

- 🚪 Role-based authentication & authorization
- 🎯 Secure JWT authentication
- ✅ Complaint lifecycle tracking
- 🧰 Admin dashboard for assigning and managing complaints
- 📱 Responsive UI using Bootstrap
- 🔒 Passwords hashed with bcrypt
- 🌍 API structured with REST principles

---

## 📁 Project Structure
<pre>
ResolveNow/
├── client/
│ ├── public/
│ └── src/
│ ├── components/
│ │ ├── Navbar.tsx
│ │ └── ProtectedRoute.tsx
│ ├── contexts/
│ │ └── AuthContext.tsx
│ ├── pages/
│ │ ├── LandingPage.tsx
│ │ ├── Login.tsx
│ │ ├── Register.tsx
│ │ ├── Dashboard.tsx
│ │ ├── NewComplaint.tsx
│ │ └── ComplaintDetails.tsx
│ ├── App.tsx
│ ├── main.tsx
│ └── index.css
├── server/
│ ├── models/
│ │ ├── User.js
│ │ └── Complaint.js
│ ├── routes/
│ │ ├── auth.js
│ │ ├── complaints.js
│ │ └── users.js
│ ├── middleware/
│ │ └── auth.js
│ ├── .env
│ └── index.js
├── .gitignore
├── package.json
├── README.md
.
</pre>



## ⚙️ Getting Started

### 1. Clone the repository
git clone https://github.com/your-username/resolve-now.git
cd resolve-now

### 2. Install required packages
cd server
npm install

### 3. Create ".env" file and fill in the credentials
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

### 4. Start the Server
npm run dev


