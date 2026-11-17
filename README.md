# Student Information Management System (Assignment 10.a & 10.b)

This project contains the complete solution for:
- **10.a**: HTML Form to collect student details with mandatory field validation using JavaScript, uploaded to GitHub.
- **10.b**: Jenkins CI/CD configuration to build Docker image and execute a containerized deployment.

---

## 📌 Ports & Access Information

| Component | URL / Port | Credentials / Details |
| :--- | :--- | :--- |
| **Student Web Application** | **`http://localhost:5005`** | Host port: **`5005`** &middot; Container port: **`5000`** |
| **Application Healthcheck** | **`http://localhost:5005/health`** | Returns JSON `status: healthy` |
| **Jenkins CI/CD Dashboard** | **`http://localhost:8081`** | **Username**: `admin`<br>**Password**: `admin123` |
| **GitHub Repository** | **[shruti22-svg/student-details-form](https://github.com/shruti22-svg/student-details-form)** | Main Branch: `main` |

---

## 🛠️ Tech Stack & Features

- **Frontend**: HTML5, CSS3, Font Awesome, JavaScript (ES6+)
  - **Mandatory Field Validations**:
    - Full Name (alphabetic, min 3 characters)
    - Student Roll No. / ID (alphanumeric, 3-15 chars)
    - Email Address (RFC regex validation)
    - Mobile Number (10 digits starting with 6-9)
    - Date of Birth (age between 15 and 70)
    - Gender (mandatory selection)
    - Department & Year of Study (mandatory selection)
    - Permanent Address (mandatory, min 10 characters)
  - Real-time inline feedback (red error state & green success state)
  - Clean confirmation card displaying registered student summary
- **Backend / Microservice**: Python 3.12 Flask
- **Containerization**: Docker & Docker Compose
- **Continuous Integration**: Jenkins Pipeline (`Jenkinsfile`)

---

## 🚀 Running with Docker Directly

```bash
# Build the Docker image
docker build -t student-details-app:latest .

# Run the container
docker run -d --name student-details-app -p 5005:5000 student-details-app:latest

# Verify
curl http://localhost:5005/health
```

---

## ⚙️ Jenkins CI/CD Pipeline Configuration

1. Log into Jenkins at **`http://localhost:8081`** with `admin` / `admin123`.
2. Open job **`student-details-form`**.
3. Click **Build Now**.
4. The pipeline performs:
   - Git SCM Checkout from `https://github.com/shruti22-svg/student-details-form.git`
   - Docker image build (`student-details-app:latest`)
   - Container execution on port `5005`
   - Verification health check
