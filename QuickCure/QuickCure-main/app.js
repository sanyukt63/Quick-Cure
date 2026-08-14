document.addEventListener("DOMContentLoaded", () => {
  const specialtySelect = document.getElementById("specialty");
  const citySelect = document.getElementById("city");
  const nextBtn = document.getElementById("nextBtn");
  const bookingStep = document.getElementById("bookingStep");
  const doctorSection = document.getElementById("doctorSection");
  const doctorListDiv = document.getElementById("doctorList");

  if (!currentUser || currentUser.role !== "patient" || !token) {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  alert("Please sign in as a patient to book an appointment.");
  window.location.href = "signin.html";
  return;
}


  /*// Get logged-in user and token
  const currentUser = JSON.parse(localStorage.getItem("user"));
  // Only alert if we're not already redirecting
if (!currentUser || currentUser.role !== "patient") {
  // Prevent infinite redirect loops
  if (window.location.pathname.includes("indexPatient.html") || window.location.pathname.includes("patient_booking.html")) {
    alert("Please sign in as a patient to book an appointment.");
  }
  window.location.href = "signin.html";
  return;
}*/
  /*const token = localStorage.getItem("token");

  if (!currentUser || currentUser.role !== "patient" || !token) {
    alert("Please sign in as a patient to book an appointment.");
    window.location.href = "signin.html";
    return;
  }*/

  // Fetch doctors from backend
  async function fetchDoctors(specialty, city) {
    try {
      const params = new URLSearchParams();
      if (specialty) params.append("specialization", specialty);
      if (city) params.append("city", city);

      const res = await fetch(`http://localhost:3040/doctors/search?${params.toString()}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch doctors");
      return await res.json();
    } catch (err) {
      console.error(err);
      alert("Error fetching doctors");
      return [];
    }
  }

  // Render doctor cards
  function renderDoctors(doctors) {
    if (!doctorListDiv) return;

    if (!doctors || doctors.length === 0) {
      doctorListDiv.innerHTML = `<p style="text-align:center;color:#6c757d;">No doctors found.</p>`;
      return;
    }

    doctorListDiv.innerHTML = doctors.map(doc => `
      <div class="doctor-card" style="margin-bottom: 20px; padding: 15px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); display: flex; gap: 15px; align-items: center;">
        <img src="${doc.image || 'https://placehold.co/100x100/3498db/ffffff?text=DR'}" alt="${doc.name}" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover;" />
        <div style="flex-grow: 1;">
          <h3>${doc.name}</h3>
          <p>Specialty: ${capitalize(doc.specialization)}</p>
          <p>Hospital: ${doc.hospital?.name || 'N/A'}</p>
          <p>City: ${capitalize(doc.hospital?.city || '')}</p>
          <p>Fee: ₹${doc.fees || 0}</p>
          <button class="btn book-btn" data-id="${doc._id}">Book Appointment</button>
        </div>
      </div>
    `).join("");

    // Add click listener to each book button
    document.querySelectorAll(".book-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const doctorId = btn.getAttribute("data-id");
        showBookingDialog(doctorId);
      });
    });
  }

  function capitalize(str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
  }

  // Booking modal
  async function showBookingDialog(doctorId) {
    try {
      const res = await fetch(`http://localhost:3040/doctors/${doctorId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch doctor details");
      const doc = await res.json();

      // Flatten available slots
      const slots = [];
      (doc.schedule || []).forEach(day => {
        (day.slots || []).forEach(s => {
          if (!s.booked) slots.push({ date: day.date, time: s.time });
        });
      });

      if (slots.length === 0) {
        alert("No available slots for this doctor.");
        return;
      }

      // Create modal overlay
      const modalOverlay = document.createElement("div");
      modalOverlay.style = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background-color: rgba(0,0,0,0.5); display: flex;
        justify-content: center; align-items: center; z-index: 1000;
      `;

      const modalContent = document.createElement("div");
      modalContent.style = `
        background-color: #fff; padding: 30px; border-radius: 12px;
        width: 320px; text-align: center; box-shadow: 0 8px 25px rgba(0,0,0,0.15);
      `;

      modalContent.innerHTML = `
        <h3>Book Appointment with ${doc.name}</h3>
        <p>Select a date and time:</p>
        <select id="appointmentTimeSelect" style="width: 100%; padding: 10px; margin-bottom: 20px; border-radius: 8px; border: 1px solid #ccc;">
          ${slots.map(s => `<option value="${s.date}|${s.time}">${new Date(s.date).toLocaleDateString()} ${s.time}</option>`).join("")}
        </select>
        <button id="confirmBookingBtn" class="btn" style="width: 100%;">Confirm Booking</button>
        <button id="cancelBookingBtn" class="btn clear" style="width: 100%; margin-top: 10px;">Cancel</button>
      `;

      modalOverlay.appendChild(modalContent);
      document.body.appendChild(modalOverlay);

      document.getElementById("confirmBookingBtn").addEventListener("click", async () => {
        const value = document.getElementById("appointmentTimeSelect").value;
        const [date, time] = value.split("|");

        try {
          const res = await fetch(`http://localhost:3040/appointments`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ doctorId, date, time })
          });

          const data = await res.json();
          if (res.ok) {
            alert("Appointment booked successfully!");
            document.body.removeChild(modalOverlay);
            window.location.href = "patient_profile.html";
          } else {
            alert(data.msg || "Failed to book appointment");
          }
        } catch (err) {
          console.error(err);
          alert("Error booking appointment");
        }
      });

      document.getElementById("cancelBookingBtn").addEventListener("click", () => {
        document.body.removeChild(modalOverlay);
      });

    } catch (err) {
      console.error(err);
      alert("Error loading doctor details");
    }
  }

  // Handle "Find Doctors" button
  nextBtn.addEventListener("click", async () => {
    const specialty = specialtySelect.value;
    const city = citySelect.value;

    if (!specialty) { alert("Please select a specialty."); return; }
    if (!city) { alert("Please select a city."); return; }

    const doctors = await fetchDoctors(specialty, city);
    bookingStep.style.display = "none";
    doctorSection.style.display = "block";
    renderDoctors(doctors);
  });

  
});


document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutBtn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", async (e) => {
      e.preventDefault(); // prevent default link redirect

      try {
        await fetch("http://localhost:3040/logout", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      } catch (err) {
        console.error("Logout failed:", err.message);
      }

      // Clear token & redirect always
      localStorage.removeItem("token");
      window.location.href = "index.html";
    });
  }
});

