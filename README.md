# 🛠️ Equipment Rental Platform

## 📅 Project Duration:
**February 2025 – March 2025**

## 📌 Overview
**Equipment Rental** is a full-featured web platform that enables users to rent and list various types of equipment. It connects **equipment owners** with **renters** and simplifies the entire process through automation. The system supports user authentication, real-time booking requests, approval workflows, payment processing, notifications, and user feedback — offering a complete rental ecosystem.

## 🎯 Features
- 📝 Equipment owners can **list items** with name, availability, location, and pricing  
- 🔍 Renters can **search and filter** equipment based on needs  
- 📆 **Booking system** with request and approval flow  
- 🔐 **User authentication** and role-based access  
- 💬 **Notifications** for requests, approvals, and updates  
- ⭐ **Reviews and ratings** to build trust and reliability  
- 💳 (Optional) Payment integration  
- 📱 Fully responsive UI for all devices  

## 🛠️ Tech Stack
- **Frontend:** HTML, CSS, JavaScript, EJS, Bootstrap  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB with Mongoose  
- **Authentication:** Express-session / Passport.js (if used)  
- **Templating Engine:** EJS  

## 🚀 How It Works
1. **Users register/login** to access the platform  
2. **Owners upload equipment** with full details  
3. **Renters browse or search** for required tools  
4. **Booking request** is sent to the owner  
5. **Owner approves/rejects**, and renter gets notified  
6. **Post-rental**, users can **leave reviews and ratings**

## 💻 Installation

### 1. Clone the repository
```sh
git clone https://github.com/yourusername/equipment-rental.git
cd equipment-rental


2. Install dependencies
sh
Copy
Edit
npm install
3. Set up environment variables
Create a .env file in the root directory with the following:

env
Copy
Edit
MONGO_URI=your_mongo_connection_string
SESSION_SECRET=your_secret_key
PORT=3000
4. Run the app
sh
Copy
Edit
npm start
The app will run at: http://localhost:3000



📷 Screenshots
![image](https://github.com/user-attachments/assets/d518a392-a60d-487e-88d1-76752ce127da)
![image](https://github.com/user-attachments/assets/ca192b65-4119-4581-982d-5f3dd1228f38)



🧠 Use Cases

Peer-to-peer tool or equipment rental

Campus lab equipment sharing

Community-based resource platforms

Small businesses managing local rentals

📌 Future Enhancements

Real-time chat between renter and owner

Admin panel to manage platform-wide content

Online payment support (Stripe, Razorpay, etc.)

Equipment availability calendar integration

🙌 Acknowledgements

Node.js

Express.js

MongoDB

EJS

Bootstrap
