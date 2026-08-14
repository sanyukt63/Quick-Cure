// WARNING: This is DEMO-ONLY. Do NOT use in production.
// Replace with a real backend or Supabase/Firebase auth.

/*function saveUser (user) {
  const users = JSON.parse(localStorage.getItem("mr_appointment_users") || "[]");
  users.push(user);
  localStorage.setItem("mr_appointment_users", JSON.stringify(users));
}

function findUser (email, password) {
  const users = JSON.parse(localStorage.getItem("mr_appointment_users") || "[]");
  return users.find(u => u.email === email && u.password === password);
}*/

function redirectByRole(role) {
  if (role === "patient") window.location.href = "indexPatient.html";
  else if (role === "doctor") window.location.href = "indexDoctor.html"; // Corrected to indexDoctor.html
  else window.location.href = "index.html";
}

// Function to toggle doctor-specific fields on signup page
function toggleDoctorFields() {
  const roleSelect = document.getElementById('role');
  const doctorFieldsDiv = document.getElementById('doctorFields');
  if (roleSelect && doctorFieldsDiv) {
    if (roleSelect.value === 'doctor') {
      doctorFieldsDiv.style.display = 'block';
      const licenseInput = document.getElementById('license');
      const specializationInput = document.getElementById('specialization');
      const experienceInput = document.getElementById('experience');
      const hospitalAffiliationInput = document.getElementById('hospitalAffiliation'); // Added
      const doctorCityInput = document.getElementById('doctorCity'); // Added
      const qualificationInput = document.getElementById('qualification'); // Added
      const bioInput = document.getElementById('bio'); // Added

      if (licenseInput) licenseInput.setAttribute('required', 'true');
      if (specializationInput) specializationInput.setAttribute('required', 'true'); // Make required
      if (experienceInput) experienceInput.setAttribute('required', 'true'); // Make required
      if (hospitalAffiliationInput) hospitalAffiliationInput.setAttribute('required', 'true'); // Added
      if (doctorCityInput) doctorCityInput.setAttribute('required', 'true'); // Added
      if (qualificationInput) qualificationInput.setAttribute('required', 'true'); // Added
      // Bio is optional, so not required
    } else {
      doctorFieldsDiv.style.display = 'none';
      const licenseInput = document.getElementById('license');
      const specializationInput = document.getElementById('specialization');
      const experienceInput = document.getElementById('experience');
      const hospitalAffiliationInput = document.getElementById('hospitalAffiliation'); // Added
      const doctorCityInput = document.getElementById('doctorCity'); // Added
      const qualificationInput = document.getElementById('qualification'); // Added
      const bioInput = document.getElementById('bio'); // Added

      if (licenseInput) licenseInput.removeAttribute('required');
      if (specializationInput) specializationInput.removeAttribute('required');
      if (experienceInput) experienceInput.removeAttribute('required');
      if (hospitalAffiliationInput) hospitalAffiliationInput.removeAttribute('required'); // Added
      if (doctorCityInput) doctorCityInput.removeAttribute('required'); // Added
      if (qualificationInput) qualificationInput.removeAttribute('required'); // Added
    }
  }
}

// Initialize sample users if none exist
/*function initializeSampleUsers() {
  const users = JSON.parse(localStorage.getItem("mr_appointment_users") || "[]");
  if (users.length === 0) {
    const sampleUsers = [
      {
        name: "Rajesh Kumar",
        email: "patient@example.com",
        password: "password123",
        role: "patient"
      },
      {
        name: "Dr. Priya Sharma",
        email: "doctor@example.com",
        password: "password123",
        role: "doctor",
        license: "MED123456",
        specialty: "cardiology", // Changed to lowercase for consistency
        experience: 8,
        hospital: "apollo", // Changed to lowercase for consistency
        city: "delhi", // Added city
        qualification: "MBBS, MD", // Added qualification
        bio: "Experienced cardiologist with a focus on preventive care." // Added bio
      },
      {
        name: "Sanyukt",
        email: "admin@example.com",
        password: "Sanyukt1234",
        role: "admin"
      }
    ];
    localStorage.setItem("mr_appointment_users", JSON.stringify(sampleUsers));
  }
}*/

document.addEventListener("DOMContentLoaded", () => {
  //initializeSampleUsers();
  
  const signupForm = document.getElementById("signupForm");
  const signinForm = document.getElementById("signinForm");

  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim().toLowerCase();
      const password = document.getElementById("password").value;
      const role = document.getElementById("role").value;
      
      // Doctor-specific fields
      const license = document.getElementById("license") ? document.getElementById("license").value.trim() : '';
      const specialization = document.getElementById("specialization") ? document.getElementById("specialization").value : '';
      const experience = document.getElementById("experience") ? parseInt(document.getElementById("experience").value, 10) : 0;
      const hospitalAffiliation = document.getElementById("hospitalAffiliation") ? document.getElementById("hospitalAffiliation").value : ''; // Added
      const doctorCity = document.getElementById("doctorCity") ? document.getElementById("doctorCity").value : ''; // Added
      const qualification = document.getElementById("qualification") ? document.getElementById("qualification").value.trim() : ''; // Added
      const bio = document.getElementById("bio") ? document.getElementById("bio").value.trim() : ''; // Added


      if (!name || !email || !password || !role) {
        alert("Please fill all required fields.");
        return;
      }

      if (role === 'doctor') {
        if (!license) {
          alert("Please enter your Medical License Number.");
          return;
        }
        if (!specialization) {
          alert("Please select your Specialization.");
          return;
        }
        if (isNaN(experience) || experience < 0) {
          alert("Please enter a valid Years of Experience.");
          return;
        }
        if (!hospitalAffiliation) { // Added validation
          alert("Please select your Hospital Affiliation.");
          return;
        }
        if (!doctorCity) { // Added validation
          alert("Please select your City.");
          return;
        }
        if (!qualification) { // Added validation
          alert("Please enter your Qualification.");
          return;
        }
      }



      try {
        const res = await fetch("http://localhost:3040/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            password,
            role,
            licenseNumber: license,
            specialization,
            yearsOfExperience: experience,
            hospital: hospitalAffiliation,
            city: doctorCity,
            qualification,
            bio,
          }),
        });

        const data = await res.json();
        if (res.ok) {
          alert("Account created successfully!");
          redirectByRole(data.user.role);
          //window.location.href = "login.html";
        } else {
          alert(data.msg || data.error || "Registration failed");
        }
      } catch (err) {
        console.error(err);
        alert("Error registering user");
      }
    });
  







      // Check if email already exists
      /*const existingUsers = JSON.parse(localStorage.getItem("mr_appointment_users") || "[]");
      if (existingUsers.some(user => user.email === email)) {
        alert("This email is already registered. Please use a different email or sign in.");
        return;
      }

      // Save user with additional doctor fields
      const newUser  = { name, email, password, role };
      if (role === 'doctor') {
        newUser.license = license;
        newUser.specialty = specialty;
        newUser.experience = experience;
        newUser.hospital = hospitalAffiliation; // Used new field
        newUser.city = doctorCity; // Added city
        newUser.qualification = qualification; // Added qualification
        newUser.bio = bio; // Added bio
      }
      saveUser (newUser );
      alert("✅ Account created successfully! Redirecting...");
      redirectByRole(role);
    });*/

    // Ensure toggleDoctorFields is called on page load for signup form
    toggleDoctorFields();
    // Add event listener for role change
    const roleSelect = document.getElementById('role');
    if (roleSelect) {
      roleSelect.addEventListener('change', toggleDoctorFields);
    }
  }

  if (signinForm) {
    signinForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value.trim().toLowerCase();
      const password = document.getElementById("password").value;


       try {
        const res = await fetch("http://localhost:3040/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        if (res.ok && data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          //localStorage.setItem("mr_appointment_current_user", JSON.stringify(data.user));
          //console.log(localStorage.getItem("user"));
          //console.log(localStorage.getItem("token"));
          alert("Signed in successfully!");
          redirectByRole(data.user.role);
        } else {
          alert(data.msg || "Invalid email or password");
        }
      } catch (err) {
        console.error(err);
        alert("Error logging in");
      }


      /*const user = findUser (email, password);
      if (!user) {
        alert("❌ Invalid email or password. Please try again.");
        return;
      }

      localStorage.setItem("mr_appointment_current_user", JSON.stringify(user));
      alert("✅ Signed in successfully! Redirecting...");
      redirectByRole(user.role);*/
    });
  }
});// WARNING: This is DEMO-ONLY. Do NOT use in production.
// Replace with a real backend or Supabase/Firebase auth.

/*function saveUser (user) {
  const users = JSON.parse(localStorage.getItem("mr_appointment_users") || "[]");
  users.push(user);
  localStorage.setItem("mr_appointment_users", JSON.stringify(users));
}

function findUser (email, password) {
  const users = JSON.parse(localStorage.getItem("mr_appointment_users") || "[]");
  return users.find(u => u.email === email && u.password === password);
}

function redirectByRole(role) {
  if (role === "patient") window.location.href = "indexPatient.html";
  else if (role === "doctor") window.location.href = "indexDoctor.html"; // Corrected to indexDoctor.html
  else window.location.href = "index.html";
}

// Function to toggle doctor-specific fields on signup page
function toggleDoctorFields() {
  const roleSelect = document.getElementById('role');
  const doctorFieldsDiv = document.getElementById('doctorFields');
  if (roleSelect && doctorFieldsDiv) {
    if (roleSelect.value === 'doctor') {
      doctorFieldsDiv.style.display = 'block';
      const licenseInput = document.getElementById('license');
      const specializationInput = document.getElementById('specialization');
      const experienceInput = document.getElementById('experience');
      const hospitalAffiliationInput = document.getElementById('hospitalAffiliation'); // Added
      const doctorCityInput = document.getElementById('doctorCity'); // Added
      const qualificationInput = document.getElementById('qualification'); // Added
      const bioInput = document.getElementById('bio'); // Added

      if (licenseInput) licenseInput.setAttribute('required', 'true');
      if (specializationInput) specializationInput.setAttribute('required', 'true'); // Make required
      if (experienceInput) experienceInput.setAttribute('required', 'true'); // Make required
      if (hospitalAffiliationInput) hospitalAffiliationInput.setAttribute('required', 'true'); // Added
      if (doctorCityInput) doctorCityInput.setAttribute('required', 'true'); // Added
      if (qualificationInput) qualificationInput.setAttribute('required', 'true'); // Added
      // Bio is optional, so not required
    } else {
      doctorFieldsDiv.style.display = 'none';
      const licenseInput = document.getElementById('license');
      const specializationInput = document.getElementById('specialization');
      const experienceInput = document.getElementById('experience');
      const hospitalAffiliationInput = document.getElementById('hospitalAffiliation'); // Added
      const doctorCityInput = document.getElementById('doctorCity'); // Added
      const qualificationInput = document.getElementById('qualification'); // Added
      const bioInput = document.getElementById('bio'); // Added

      if (licenseInput) licenseInput.removeAttribute('required');
      if (specializationInput) specializationInput.removeAttribute('required');
      if (experienceInput) experienceInput.removeAttribute('required');
      if (hospitalAffiliationInput) hospitalAffiliationInput.removeAttribute('required'); // Added
      if (doctorCityInput) doctorCityInput.removeAttribute('required'); // Added
      if (qualificationInput) qualificationInput.removeAttribute('required'); // Added
    }
  }
}

// Initialize sample users if none exist
/*function initializeSampleUsers() {
  const users = JSON.parse(localStorage.getItem("mr_appointment_users") || "[]");
  if (users.length === 0) {
    const sampleUsers = [
      {
        name: "Rajesh Kumar",
        email: "patient@example.com",
        password: "password123",
        role: "patient"
      },
      {
        name: "Dr. Priya Sharma",
        email: "doctor@example.com",
        password: "password123",
        role: "doctor",
        license: "MED123456",
        specialty: "cardiology", // Changed to lowercase for consistency
        experience: 8,
        hospital: "apollo", // Changed to lowercase for consistency
        city: "delhi", // Added city
        qualification: "MBBS, MD", // Added qualification
        bio: "Experienced cardiologist with a focus on preventive care." // Added bio
      },
      {
        name: "Sanyukt",
        email: "admin@example.com",
        password: "Sanyukt1234",
        role: "admin"
      }
    ];
    localStorage.setItem("mr_appointment_users", JSON.stringify(sampleUsers));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initializeSampleUsers();
  
  const signupForm = document.getElementById("signupForm");
  const signinForm = document.getElementById("signinForm");

  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim().toLowerCase();
      const password = document.getElementById("password").value;
      const role = document.getElementById("role").value;
      
      // Doctor-specific fields
      const license = document.getElementById("license") ? document.getElementById("license").value.trim() : '';
      const specialty = document.getElementById("specialization") ? document.getElementById("specialization").value : '';
      const experience = document.getElementById("experience") ? parseInt(document.getElementById("experience").value, 10) : 0;
      const hospitalAffiliation = document.getElementById("hospitalAffiliation") ? document.getElementById("hospitalAffiliation").value : ''; // Added
      const doctorCity = document.getElementById("doctorCity") ? document.getElementById("doctorCity").value : ''; // Added
      const qualification = document.getElementById("qualification") ? document.getElementById("qualification").value.trim() : ''; // Added
      const bio = document.getElementById("bio") ? document.getElementById("bio").value.trim() : ''; // Added


      if (!name || !email || !password || !role) {
        alert("Please fill all required fields.");
        return;
      }

      if (role === 'doctor') {
        if (!license) {
          alert("Please enter your Medical License Number.");
          return;
        }
        if (!specialty) {
          alert("Please select your Specialization.");
          return;
        }
        if (isNaN(experience) || experience < 0) {
          alert("Please enter a valid Years of Experience.");
          return;
        }
        if (!hospitalAffiliation) { // Added validation
          alert("Please select your Hospital Affiliation.");
          return;
        }
        if (!doctorCity) { // Added validation
          alert("Please select your City.");
          return;
        }
        if (!qualification) { // Added validation
          alert("Please enter your Qualification.");
          return;
        }
      }

      // Check if email already exists
      const existingUsers = JSON.parse(localStorage.getItem("mr_appointment_users") || "[]");
      if (existingUsers.some(user => user.email === email)) {
        alert("This email is already registered. Please use a different email or sign in.");
        return;
      }

      // Save user with additional doctor fields
      const newUser  = { name, email, password, role };
      if (role === 'doctor') {
        newUser.license = license;
        newUser.specialty = specialty;
        newUser.experience = experience;
        newUser.hospital = hospitalAffiliation; // Used new field
        newUser.city = doctorCity; // Added city
        newUser.qualification = qualification; // Added qualification
        newUser.bio = bio; // Added bio
      }
      saveUser (newUser );
      alert("✅ Account created successfully! Redirecting...");
      redirectByRole(role);
    });

    // Ensure toggleDoctorFields is called on page load for signup form
    toggleDoctorFields();
    // Add event listener for role change
    const roleSelect = document.getElementById('role');
    if (roleSelect) {
      roleSelect.addEventListener('change', toggleDoctorFields);
    }
  }

  if (signinForm) {
    signinForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value.trim().toLowerCase();
      const password = document.getElementById("password").value;

      const user = findUser (email, password);
      if (!user) {
        alert("❌ Invalid email or password. Please try again.");
        return;
      }

      localStorage.setItem("mr_appointment_current_user", JSON.stringify(user));
      alert("✅ Signed in successfully! Redirecting...");
      redirectByRole(user.role);
    });
  }
});*/