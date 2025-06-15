# 💼 Phantom Pay

A secure and intelligent payroll anomaly detection system powered by **Flask**, **Firebase**, and **Google Generative AI**.

---

## 🚀 Project Overview

**Phantom Pay** streamlines payroll management and enhances security by detecting anomalies like ghost employees, duplicate logins, and suspicious patterns using AI-powered insights. Built for HR and finance teams, it brings transparency, automation, and compliance to payroll operations.

---

## 🔑 Key Features

- 🧠 **AI-Powered Payroll Analysis**  
  Uses Google Generative AI to analyze patterns, detect anomalies, and flag risks.

- 🔐 **Secure Data Handling**  
  Sensitive financial and employee data is protected using Firebase Authentication.

- ⚙️ **Automated Calculations**  
  Handles salaries, taxes, benefits, and deductions with built-in logic.

- 📊 **Interactive Dashboard**  
  Visual insights for risk distribution, anomaly trends, and suspicious entities.

- 📁 **PDF Report Generation**  
  One-click export of audit-ready anomaly reports.

---

## 🖥️ Tech Stack

| Layer         | Technology                           |
|---------------|---------------------------------------|
| 🧠 AI         | Google Generative AI API              |
| 🧩 Backend    | Flask + SQLAlchemy + Pandas           |
| 🔒 Auth       | Firebase Authentication               |
| 🖼️ Frontend  | HTML5, CSS3 (dark theme), Chart.js     |
| 🗃️ DB        | SQLite (local)                         |
| 📄 Reports    | xhtml2pdf, markdown2                  |

---

## 📊 System Visualizations

### 🔴 Risk Distribution
Shows proportion of high, medium, and low-risk cases.
![image](https://github.com/user-attachments/assets/a25459ac-1d77-4bef-89de-b714c86df4e9)


### 📈 Anomaly Trends
Displays anomaly occurrences across years.
![image](https://github.com/user-attachments/assets/2c5a8de6-0bd0-43e1-9751-61665877c400)


### ⚠️ Detected Anomalies
Detailed table of ghost employees and suspicious patterns.
![image](https://github.com/user-attachments/assets/475f6072-c9cf-449d-a6ab-791ee87a5c32)


### 🔐 Firebase Authentication
Secure user logins with Firebase auth provider info.
![image](https://github.com/user-attachments/assets/75395d38-b702-4ff2-b711-96dd16ad1d5f)

---

## ⚙️ Installation Guide

### 📦 Prerequisites

- Python 3.8+
- pip (Python package manager)
- Git

### 🛠️ Setup Steps

```bash
# Clone the repo
git clone https://github.com/dragonmoth/Phantom-pay.git
cd Phantom-pay

# Create virtual environment
python -m venv venv
venv\Scripts\activate     # (on Windows)
# OR
source venv/bin/activate  # (on macOS/Linux)

# Install dependencies
pip install -r requirements.txt

# Set environment variables
echo FLASK_APP=app.py > .env
echo FLASK_ENV=development >> .env

# Initialize database (if applicable)
flask db init
flask db migrate
flask db upgrade

###Running the Application
Start the Flask development server:
flask run
Open your web browser and navigate to:
http://localhost:5000

###Features
Secure payroll management
Employee data management
Automated calculations
AI-powered insights
User authentication and authorization
Contributing
Fork the repository
Create your feature branch (git checkout -b feature/AmazingFeature)
Commit your changes (git commit -m 'Add some AmazingFeature')
Push to the branch (git push origin feature/AmazingFeature)
Open a Pull Request

###License
This project is licensed under the MIT License - see the LICENSE file for details.

###Contact
Sejal Shantaram Naik - GitHub Profile

Project Link: https://github.com/dragonmoth/Phantom-pay.git
