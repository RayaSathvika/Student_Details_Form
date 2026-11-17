// Student Details Form Validation (Assignment 10.a)
// Enforces mandatory fields and format constraints using pure JavaScript.

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("studentForm");
  const successCard = document.getElementById("successCard");
  const detailsTableBody = document.getElementById("detailsTableBody");
  const btnRegisterNew = document.getElementById("btnRegisterNew");
  const btnReset = document.getElementById("btnReset");

  // Input Elements
  const fields = {
    fullName: document.getElementById("fullName"),
    studentId: document.getElementById("studentId"),
    email: document.getElementById("email"),
    phone: document.getElementById("phone"),
    dob: document.getElementById("dob"),
    department: document.getElementById("department"),
    year: document.getElementById("year"),
    address: document.getElementById("address"),
  };

  // Validators
  const validators = {
    fullName(value) {
      if (!value || value.trim().length === 0) {
        return "Full Name is mandatory and cannot be empty.";
      }
      if (value.trim().length < 3) {
        return "Full Name must contain at least 3 characters.";
      }
      if (!/^[a-zA-Z\s.'-]+$/.test(value.trim())) {
        return "Full Name must contain letters, spaces, or dots only.";
      }
      return null;
    },

    studentId(value) {
      if (!value || value.trim().length === 0) {
        return "Student Roll No. / ID is mandatory.";
      }
      if (!/^[a-zA-Z0-9_-]{3,15}$/.test(value.trim())) {
        return "Student ID must be 3-15 alphanumeric characters (e.g. 21B91A0501).";
      }
      return null;
    },

    email(value) {
      if (!value || value.trim().length === 0) {
        return "Email Address is mandatory.";
      }
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(value.trim())) {
        return "Please enter a valid email address (e.g. student@college.edu).";
      }
      return null;
    },

    phone(value) {
      if (!value || value.trim().length === 0) {
        return "Mobile Number is mandatory.";
      }
      const phoneDigits = value.trim().replace(/\D/g, "");
      if (phoneDigits.length !== 10) {
        return "Mobile Number must be exactly 10 digits.";
      }
      if (!/^[6-9]\d{9}$/.test(phoneDigits)) {
        return "Mobile Number must start with 6, 7, 8, or 9.";
      }
      return null;
    },

    dob(value) {
      if (!value) {
        return "Date of Birth is mandatory.";
      }
      const birthDate = new Date(value);
      const today = new Date();
      if (isNaN(birthDate.getTime())) {
        return "Please provide a valid date of birth.";
      }
      if (birthDate >= today) {
        return "Date of Birth must be in the past.";
      }

      // Age calculation
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      if (age < 15) {
        return "Student must be at least 15 years of age.";
      }
      if (age > 70) {
        return "Please check the birth year (age exceeds 70).";
      }
      return null;
    },

    gender() {
      const selected = document.querySelector('input[name="gender"]:checked');
      if (!selected) {
        return "Please select a gender (mandatory).";
      }
      return null;
    },

    department(value) {
      if (!value || value.trim().length === 0) {
        return "Department / Course selection is mandatory.";
      }
      return null;
    },

    year(value) {
      if (!value || value.trim().length === 0) {
        return "Academic Year selection is mandatory.";
      }
      return null;
    },

    address(value) {
      if (!value || value.trim().length === 0) {
        return "Permanent Address is mandatory.";
      }
      if (value.trim().length < 10) {
        return "Address must be at least 10 characters long.";
      }
      return null;
    },
  };

  // Helper: show/clear field error
  function setFieldError(fieldId, errorMsg) {
    const group = document.getElementById(`group-${fieldId}`);
    const errorEl = document.getElementById(`error-${fieldId}`);
    if (!group || !errorEl) return;

    if (errorMsg) {
      group.classList.add("has-error");
      group.classList.remove("has-success");
      errorEl.textContent = errorMsg;
    } else {
      group.classList.remove("has-error");
      group.classList.add("has-success");
      errorEl.textContent = "";
    }
  }

  // Validate a single field
  function validateField(name) {
    if (name === "gender") {
      const err = validators.gender();
      setFieldError("gender", err);
      return !err;
    }

    const input = fields[name];
    if (!input) return true;

    const validator = validators[name];
    if (!validator) return true;

    const err = validator(input.value);
    setFieldError(name, err);
    return !err;
  }

  // Attach live event listeners
  Object.keys(fields).forEach((name) => {
    const input = fields[name];
    if (!input) return;

    input.addEventListener("blur", () => validateField(name));
    input.addEventListener("input", () => {
      const group = document.getElementById(`group-${name}`);
      if (group && group.classList.contains("has-error")) {
        validateField(name);
      }
    });
  });

  // Attach listener for gender radio group
  document.querySelectorAll('input[name="gender"]').forEach((radio) => {
    radio.addEventListener("change", () => validateField("gender"));
  });

  // Reset form helper
  function resetAllValidation() {
    Object.keys(fields).forEach((name) => {
      const group = document.getElementById(`group-${name}`);
      const err = document.getElementById(`error-${name}`);
      if (group) group.classList.remove("has-error", "has-success");
      if (err) err.textContent = "";
    });
    const genderGroup = document.getElementById("group-gender");
    const genderErr = document.getElementById("error-gender");
    if (genderGroup) genderGroup.classList.remove("has-error", "has-success");
    if (genderErr) genderErr.textContent = "";
  }

  btnReset.addEventListener("click", () => {
    resetAllValidation();
  });

  // Form Submit Handler
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    let isValid = true;

    // Validate all fields
    const fieldNames = ["fullName", "studentId", "email", "phone", "dob", "gender", "department", "year", "address"];
    fieldNames.forEach((name) => {
      const fieldValid = validateField(name);
      if (!fieldValid) {
        isValid = false;
      }
    });

    if (!isValid) {
      // Focus first error field
      const firstError = document.querySelector(".form-group.has-error input, .form-group.has-error select, .form-group.has-error textarea");
      if (firstError) firstError.focus();
      return;
    }

    // Collect validated student data
    const genderSelected = document.querySelector('input[name="gender"]:checked');
    const studentData = {
      fullName: fields.fullName.value.trim(),
      studentId: fields.studentId.value.trim(),
      email: fields.email.value.trim(),
      phone: fields.phone.value.trim(),
      dob: fields.dob.value,
      gender: genderSelected ? genderSelected.value : "",
      department: fields.department.value,
      year: fields.year.value,
      address: fields.address.value.trim(),
      submittedAt: new Date().toLocaleString(),
    };

    // Optionally post to backend API
    try {
      await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(studentData),
      });
    } catch (err) {
      console.warn("Backend API call notice (client-side submission succeeded):", err);
    }

    // Render submitted details in table
    detailsTableBody.innerHTML = `
      <tr><th>Full Name</th><td>${escapeHtml(studentData.fullName)}</td></tr>
      <tr><th>Student Roll No. / ID</th><td><strong>${escapeHtml(studentData.studentId)}</strong></td></tr>
      <tr><th>Email Address</th><td>${escapeHtml(studentData.email)}</td></tr>
      <tr><th>Mobile Number</th><td>${escapeHtml(studentData.phone)}</td></tr>
      <tr><th>Date of Birth</th><td>${escapeHtml(studentData.dob)}</td></tr>
      <tr><th>Gender</th><td>${escapeHtml(studentData.gender)}</td></tr>
      <tr><th>Department / Course</th><td>${escapeHtml(studentData.department)}</td></tr>
      <tr><th>Academic Year</th><td>${escapeHtml(studentData.year)}</td></tr>
      <tr><th>Permanent Address</th><td>${escapeHtml(studentData.address)}</td></tr>
      <tr><th>Registered At</th><td><small>${escapeHtml(studentData.submittedAt)}</small></td></tr>
    `;

    // Hide form and show success card
    form.classList.add("hidden");
    form.style.display = "none";
    successCard.classList.remove("hidden");
    successCard.scrollIntoView({ behavior: "smooth" });
  });

  // Register another student button
  btnRegisterNew.addEventListener("click", () => {
    form.reset();
    resetAllValidation();
    form.style.display = "block";
    form.classList.remove("hidden");
    successCard.classList.add("hidden");
    fields.fullName.focus();
  });

  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
});
