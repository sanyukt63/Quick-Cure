// doctor.js

// =======================
// Utility Functions
// =======================
function formatDateOnlyUTC(date) {
  const d = new Date(date);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(
    2,
    "0"
  )}-${String(d.getUTCDate()).padStart(2, "0")}`;
}

async function apiFetch(url, options = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url, { ...options, headers });
  if (!res.ok) throw new Error(`API error ${res.status}: ${await res.text()}`);
  return res.json();
}

let currentDoctorId = null;
let currentSchedule = [];

// =======================
// Load Doctor Profile
// =======================
async function loadDoctorProfile() {
  try {
    const data = await apiFetch("http://localhost:3040/doctors/profile");
    const profile = data.profile || data;
    currentDoctorId = profile._id;
    currentSchedule = profile.schedule || [];

    // Header
    document.getElementById("doctorProfileName").textContent = profile.name;
    document.getElementById(
      "doctorProfileSpecialty"
    ).textContent = `${profile.specialization} • ${profile.yearsOfExperience} Years Experience`;

    // Form
    document.getElementById("editDoctorName").value = profile.name || "";
    document.getElementById("editDoctorSpecialty").value =
      profile.specialization || "";
    document.getElementById("editDoctorExperience").value =
      profile.yearsOfExperience || 0;
    document.getElementById("editDoctorHospital").value =
      profile.hospital || "";

    renderSlots();
  } catch (err) {
    console.error("Error loading doctor profile:", err.message);
  }
}

// =======================
// Update Doctor Profile
// =======================
document
  .getElementById("doctorProfileForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const updates = {
      name: document.getElementById("editDoctorName").value,
      specialization: document.getElementById("editDoctorSpecialty").value,
      yearsOfExperience: parseInt(
        document.getElementById("editDoctorExperience").value,
        10
      ),
      hospital: document.getElementById("editDoctorHospital").value,
    };

    try {
      await apiFetch("http://localhost:3040/doctors/update", {
        method: "POST",
        body: JSON.stringify(updates),
      });
      alert("Profile updated!");
      loadDoctorProfile();
    } catch (err) {
      console.error("Error updating profile:", err.message);
    }
  });

// =======================
// Schedule / Availability
// =======================
document
  .getElementById("availabilityForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const date = document.getElementById("availDate").value;
    const start = document.getElementById("availStart").value;
    const end = document.getElementById("availEnd").value;
    const slotMinutes = parseInt(
      document.getElementById("availSlot").value,
      10
    );
    const fee = parseInt(document.getElementById("docFee").value, 10);

    const slots = generateSlots(start, end, slotMinutes);
    const scheduleDay = {
      date: new Date(date),
      slots: slots.map((t) => ({ time: t, booked: false })),
      fees: fee,
    };

    currentSchedule.push(scheduleDay);

    try {
      await apiFetch(
        `http://localhost:3040/doctors/${currentDoctorId}/schedule`,
        {
          method: "PUT",
          body: JSON.stringify({ schedule: currentSchedule }),
        }
      );
      alert("Availability saved!");
      renderSlots();
    } catch (err) {
      console.error("Error saving schedule:", err.message);
    }
  });

function generateSlots(start, end, duration) {
  const slots = [];
  let startTime = new Date(`1970-01-01T${start}:00`);
  const endTime = new Date(`1970-01-01T${end}:00`);
  while (startTime < endTime) {
    slots.push(
      startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
    startTime = new Date(startTime.getTime() + duration * 60000);
  }
  return slots;
}

function renderSlots() {
  const list = document.getElementById("slotsList");
  list.innerHTML = "";

  currentSchedule.forEach((day, dayIndex) => {
    const li = document.createElement("li");
    const dateStr = new Date(day.date).toDateString();
    const slotsStr = day.slots.map((s) => s.time).join(", ");
    li.innerHTML = `
      <div style="flex:1"><strong>${dateStr}</strong> → ${slotsStr}</div>
      <button class="removeDayBtn" data-day="${dayIndex}">Remove</button>
    `;
    list.appendChild(li);
  });

  document.querySelectorAll(".removeDayBtn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const index = parseInt(e.target.dataset.day, 10);
      if (confirm("Are you sure you want to remove this day's slots?")) {
        currentSchedule.splice(index, 1);
        try {
          await apiFetch(
            `http://localhost:3040/doctors/${currentDoctorId}/schedule`,
            {
              method: "PUT",
              body: JSON.stringify({ schedule: currentSchedule }),
            }
          );
          renderSlots();
        } catch (err) {
          console.error("Error removing day:", err.message);
        }
      }
    });
  });
}

// =======================
// Appointments
// =======================
async function loadAppointments() {
  try {
    const appts = await apiFetch("http://localhost:3040/appointments/me");
    const todayStr = formatDateOnlyUTC(new Date());

    const todayAppts = appts.filter(
      (a) => formatDateOnlyUTC(a.date) === todayStr
    );

    //console.log("All appointments:", appts);
    //console.log("Today's appointments:", todayAppts);

    renderAppointments(todayAppts);
    renderAppointmentStats(todayAppts);
    renderEarnings(appts);
    renderPatientRecords(appts);
  } catch (err) {
    console.error("Error loading appointments:", err.message);
  }
}

function renderAppointments(appts) {
  const list = document.getElementById("appointmentList");
  if (!appts.length) {
    list.innerHTML = `<p style="text-align:center;color:#6c757d;">No appointments today.</p>`;
    return;
  }

  list.innerHTML = appts
    .map(
      (a) => `
    <li style="padding:10px;border-bottom:1px solid #ddd;">
      <strong>${a.patient?.name || "Patient"}</strong> – ${a.time} 
      (<span style="color:${
        a.status === "booked" ? "#007bff" : "#28a745"
      };">
        ${a.status}
      </span>)
    </li>
  `
    )
    .join("");
}

function renderAppointmentStats(appts) {
  const total = appts.length;
  const completed = appts.filter((a) => a.status === "completed").length;
  const upcoming = appts.filter((a) => a.status === "booked").length;

  document.getElementById("totalScheduled").textContent = total;
  document.getElementById("completed").textContent = completed;
  document.getElementById("upcoming").textContent = upcoming;
}



// =======================
// Earnings
// =======================
function renderEarnings(appts) {
  const todayStr = formatDateOnlyUTC(new Date());
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 7);

  const todayTotal = appts
    .filter(
      (a) =>
        a.status === "completed" && formatDateOnlyUTC(a.date) === todayStr
    )
    .reduce((sum, a) => sum + (a.fees || 0), 0);

  const weekTotal = appts
    .filter((a) => a.status === "completed" && new Date(a.date) >= weekStart)
    .reduce((sum, a) => sum + (a.fees || 0), 0);

  document.getElementById("todayEarnings").textContent = todayTotal;
  document.getElementById("weekEarnings").textContent = weekTotal;
}

// =======================
// Patient Records
// =======================
function renderPatientRecords(appts) {
  const list = document.getElementById("patientRecordsList");
  const patients = {};

  appts.forEach((a) => {
    if (a.patient) patients[a.patient._id] = a.patient;
  });

  list.innerHTML = Object.values(patients)
    .map(
      (p) => `
    <div class="patient-card">
      <h4>${p.name}</h4>
      <p>Email: ${p.email || "N/A"}</p>
    </div>
  `
    )
    .join("");
}

// =======================
// Logout
// =======================
document.getElementById("logoutBtn").addEventListener("click", async () => {
  try {
    await fetch("http://localhost:3040/logout", {
      method: "GET",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    localStorage.removeItem("token");
    window.location.href = "index.html";
  } catch (err) {
    console.error("Logout failed:", err.message);
  }
});

// =======================
// Init
// =======================
document.addEventListener("DOMContentLoaded", () => {
  loadDoctorProfile();
  loadAppointments();
});


// =======================
// Patient Records (Search + Details)
// =======================
function renderPatientRecords(appts) {
  const list = document.getElementById("patientRecordsList");
  const searchInput = document.querySelector(".search-box input");
  const patients = {};

  // Collect unique patients
  appts.forEach((a) => {
    if (a.patient) patients[a.patient._id] = a.patient;
  });

  const patientArray = Object.values(patients);

  // Render full list
  function renderList(filter = "") {
    const lowerFilter = filter.toLowerCase();

    const filtered = patientArray.filter(
      (p) =>
        p.name.toLowerCase().includes(lowerFilter) ||
        (p.email && p.email.toLowerCase().includes(lowerFilter))
    );

    if (!filtered.length) {
      list.innerHTML =
        `<p style="text-align:center;color:#6c757d;">No matching patients.</p>`;
      return;
    }

    list.innerHTML = filtered
      .map(
        (p) => `
      <div class="patient-card" data-id="${p._id}" style="cursor:pointer;">
        <h4>${p.name}</h4>
        <p>Email: ${p.email || "N/A"}</p>
      </div>
    `
      )
      .join("");

    // Add click handler for patient detail view
    document.querySelectorAll(".patient-card").forEach((card) => {
      card.addEventListener("click", () => {
        const id = card.dataset.id;
        showPatientDetails(id, appts);
      });
    });
  }

  // Live search
  searchInput.addEventListener("input", (e) => {
    renderList(e.target.value);
  });

  // First render
  renderList();
}

function showPatientDetails(patientId, appts) {
  const list = document.getElementById("patientRecordsList");
  const patientAppts = appts.filter((a) => a.patient?._id === patientId);

  if (!patientAppts.length) {
    list.innerHTML = `<p>No history found for this patient.</p>`;
    return;
  }

  const patient = patientAppts[0].patient;

  list.innerHTML = `
    <button id="backToPatients" >⬅ Back to Patients</button>
    <h3>${patient.name}</h3>
    <p>Email: ${patient.email || "N/A"}</p>
    <h4>📖 Appointment History</h4>
    ${patientAppts
      .map(
        (a) => `
      <div style="border:1px solid #ddd;padding:10px;margin-bottom:10px;border-radius:6px;">
        <p><strong>Date:</strong> ${new Date(a.date).toDateString()}</p>
        <p><strong>Time:</strong> ${a.time}</p>
        <p><strong>Status:</strong> ${a.status}</p>
        <p><strong>Fee:</strong> ₹${a.fees || 0}</p>
      </div>
    `
      )
      .join("")}
  `;

  document.getElementById("backToPatients").addEventListener("click", () => {
    renderPatientRecords(appts); // back to full list
  });
}

