
# 🌿 FARMMASTER Frontend – React + Vite

This is the frontend of **FARMMASTER**, a comprehensive agricultural land and crop management system.  
The frontend is built using **React 18 + Vite**, with **Tailwind**, **Context API**, and **Axios**.

---

## 🚀 Tech Stack

### **Frontend**
- React 18 (Vite)
- React Router v6
- Context API
- Tailwind CSS
- Axios
- Leaflet (OpenStreetMap)
- Stripe React SDK

---

## 📁 Folder Structure

````

FARMMASTER-Frontend/
├── src/
│   ├── components/
│   │   ├── landownerdashboard/
│   │   ├── operationalmanagerdashboard/
│   │   ├── fieldsupervisordashboard/
│   │   ├── financialmanagerdashboard/
│   │   ├── buyerdashboard/
│   │   ├── cart/
│   │   ├── alerts/
│   │   ├── home/
│   │   ├── about/
│   │   └── contact/
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── ResetPassword.jsx
│   │   └── Profile.jsx
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   ├── SearchContext.jsx
│   │   └── CartContext.jsx
│   ├── assets/
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
└── .env

````

---

## ⚙️ Installation

### **1. Install dependencies**
```bash
npm install
````

### **2. Add environment variables**

Create `.env`:

```env
VITE_API_URL=http://localhost/FarmMaster/FARMMASTER-Backend
```

### **3. Start development server**

```bash
npm run dev
```

### **4. App URLs**

```
Frontend: http://localhost:5173
Backend API: http://localhost/FarmMaster/FARMMASTER-Backend/api.php
```

---

## 🌟 Core Features

### ✔ Authentication

* Login / Register
* Forgot Password / Reset Password (Email OTP)
* Role-based UI (OM, FM, Supervisor, Landowner, Buyer)

### ✔ Land Management (Leaflet Map)

* Select land location via map
* Display Sri Lanka boundaries
* Reverse geocoding

### ✔ Marketplace (Buyers)

* View crops & products
* Add to cart (cookie persistence)
* Stripe card payments
* Track order history

### ✔ Dashboards

Each role has a personalized dashboard:

* Landowner Dashboard
* Operational Manager Dashboard
* Financial Manager Dashboard
* Field Supervisor Dashboard
* Buyer Dashboard

### ✔ State Management

* `AuthContext`: login state
* `CartContext`: shopping cart
* `SearchContext`: product filtering

---

## 🔌 API Communication

Axios setup (`withCredentials: true`):

```js
axios.get(`${import.meta.env.VITE_API_URL}/api/users/profile`, {
  withCredentials: true
});
```

---

## 🧪 Testing (Manual)

* Test authentication pages
* Validate CORS calls
* Check map dragging & marker accuracy
* Stripe test cards:

  * Success → 4242 4242 4242 4242
  * Fail → 4000 0000 0000 0002

---

## 🐛 Troubleshooting

### **CORS Errors**

* Ensure backend has:

```php
header("Access-Control-Allow-Origin: http://localhost:5173");
```

### **Map Not Loading**

* Ensure Leaflet CSS is imported
* Check API key (if using geocoding API)

### **Stripe Errors**

* Verify publishable key
* Use test mode

---

## 📄 License

Open-source — for academic & learning purposes.


