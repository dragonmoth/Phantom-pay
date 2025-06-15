# Phantom Pay

A secure and efficient payroll management system built with Flask and Google's Generative AI.

---

## 🧠 Project Description

**Phantom Pay** is an intelligent payroll management system designed to simplify and secure the payroll process for businesses of all sizes. With Google's Generative AI integrated, it delivers automated analysis, anomaly detection, and smart insights — all while maintaining a user-friendly experience.

---

## 🚀 Key Features

- 🤖 **AI-Powered Analysis**: Leverages Google’s Generative AI to detect anomalies and payroll trends
- 🔐 **Secure Data Management**: Protects sensitive employee and financial information
- 🧮 **Automated Calculations**: Manages taxes, benefits, and other payroll components
- 🧾 **Comprehensive Reports**: Exports intelligent insights as PDFs
- 👥 **Multi-User Support**: Role-based access for admins, HR, and managers
- 🔑 **Firebase Authentication**: Secure user logins and management
- 📊 **System Visualizations**: Graphs and analytics for quick decision-making

---

## 🛠️ Tech Stack

- **Backend**: Flask (Python)
- **Frontend**: HTML/CSS/JS (Responsive UI)
- **Database**: Flask-SQLAlchemy (SQLAlchemy ORM)
- **AI Integration**: Google Generative AI (via Gemini Flash/Gemini Pro)
- **Authentication**: Firebase Auth
- **Data Analysis**: Pandas, NumPy
- **PDF Reporting**: WeasyPrint

---

## 💡 Use Cases

- Small to mid-sized businesses automating their payroll workflow
- HR teams reducing manual calculation overhead
- Organizations seeking anomaly detection & compliance insights
- Projects exploring secure AI+payroll integration

---

## 🖼️ System Visualizations

1. **📈 Risk Distribution**
2. **📉 Anomaly Trends**
3. **🚨 Detected Anomalies**
4. **🔐 Firebase Authentication View**

---

## 🔧 Prerequisites

- Python 3.8+
- pip
- Git

---

## 🧰 Installation

```bash
# Clone the repository
git clone https://github.com/dragonmoth/Phantom-pay.git
cd Phantom-pay

# Create a virtual environment
python -m venv venv
venv\Scripts\activate     # On Windows
# OR
source venv/bin/activate  # On macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Create your .env file
# .env
FLASK_APP=app.py
FLASK_ENV=development
