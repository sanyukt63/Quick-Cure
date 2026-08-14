// Admin Dashboard JavaScript

// Function to fill tables dynamically
function fillTable(tbodyId, data, headers) {
  const tbody = document.getElementById(tbodyId);
  if (!tbody) return;

  tbody.innerHTML = ""; // Clear existing body

  if (!data || data.length === 0) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    const colSpan = headers.length; // Use the provided headers length
    td.setAttribute("colspan", colSpan);
    td.textContent = "No data available.";
    td.style.textAlign = "center";
    td.style.padding = "20px";
    td.style.color = "#7f8c8d";
    tr.appendChild(td);
    tbody.appendChild(tr);
    return;
  }

  data.forEach(rowData => {
    const tr = document.createElement("tr");
    headers.forEach(headerKey => {
      const td = document.createElement("td");
      let value = rowData[headerKey];

      // Special formatting for certain keys
      if (headerKey === 'verified') {
        td.textContent = value ? '✅ Verified' : '⏳ Pending';
        td.className = value ? 'verified-true' : 'verified-false'; // Assuming CSS classes exist
      } else if (headerKey === 'status') {
        td.textContent = value.charAt(0).toUpperCase() + value.slice(1); // Capitalize first letter
        td.className = `status-${value.toLowerCase()}`; // Assuming CSS classes exist
      } else if (headerKey === 'fee' || headerKey === 'fees') {
        td.textContent = `₹${value}`;
      } else if (headerKey === 'specialty') {
        // Format specialty for display
        const specialties = {
          cardiology: 'Cardiology', dermatology: 'Dermatology', orthopedics: 'Orthopedics',
          pediatrics: 'Pediatrics', ent: 'ENT', psychiatry: 'Psychiatry',
          general: 'General Physician', neurology: 'Neurology', oncology: 'Oncology',
          gynecology: 'Gynecology'
        };
        td.textContent = specialties[value] || value;
      } else if (headerKey === 'hospital') {
        // Format hospital name (assuming hospital ID or short name is stored)
        const hospitals = {
          apollo: 'Apollo Hospitals', fortis: 'Fortis Healthcare', max: 'Max Super Speciality',
          medanta: 'Medanta The Medicity', artemis: 'Artemis Hospitals', city_general: 'City General Hospital',
          green_valley: 'Green Valley Multi-speciality', metro_care: 'Metro Care Clinic',
          national_health: 'National Health Center', apollo_speciality: 'Apollo Speciality Hospital',
          fortis_healthcare: 'Fortis Healthcare'
        };
        td.textContent = hospitals[value] || value;
      } else if (headerKey === 'city') {
        const cities = {
          delhi: 'Delhi', mumbai: 'Mumbai', bengaluru: 'Bengaluru', kolkata: 'Kolkata',
          chennai: 'Chennai', hyderabad: 'Hyderabad', pune: 'Pune', lucknow: 'Lucknow'
        };
        td.textContent = cities[value] || value;
      }
      else {
        td.textContent = value;
      }
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
}

// Function to fetch data from localStorage
function getHospitalsFromLocalStorage() {
  return JSON.parse(localStorage.getItem('quickcare_hospitals') || '[]');
}

function getDoctorsFromLocalStorage() {
  // Admin-doctor.js manages the 'doctors' key, which is more detailed
  return JSON.parse(localStorage.getItem('doctors') || '[]');
}

function getUsersFromLocalStorage() {
  return JSON.parse(localStorage.getItem('mr_appointment_users') || '[]');
}

// Function to generate mock appointments for display
// In a real app, these would come from a backend
function generateMockAppointments(doctors, users) {
  const appointments = [];
  const patientUsers = users.filter(u => u.role === 'patient');

  if (doctors.length === 0 || patientUsers.length === 0) {
    return [];
  }

  const numAppointments = Math.min(6, doctors.length * patientUsers.length); // Limit for display

  for (let i = 0; i < numAppointments; i++) {
    const randomDoctor = doctors[Math.floor(Math.random() * doctors.length)];
    const randomPatient = patientUsers[Math.floor(Math.random() * patientUsers.length)];
    const randomTime = `${Math.floor(Math.random() * 10) + 9}:` + (Math.random() < 0.5 ? '00' : '30');
    const randomFee = randomDoctor.fee || 500; // Use doctor's fee if available, else default

    appointments.push({
      time: randomTime,
      patient: randomPatient.name,
      doctor: randomDoctor.name,
      hospital: randomDoctor.hospital, // Use doctor's hospital
      fees: randomFee
    });
  }
  return appointments;
}


document.addEventListener("DOMContentLoaded", () => {
  // BUG FIX: Commented out localStorage.removeItem calls.
  // Clearing doctor and appointment data on every dashboard load is not ideal for persistence.
  // In a real application, data persistence would be handled by a backend,
  // and clearing data would be a deliberate action, not an automatic one on page load.
  // localStorage.removeItem('doctors');
  // localStorage.removeItem('doctor_appointments_dr.rajesh@apollo.com');
  // localStorage.removeItem('doctor_appointments_dr.priya@fortis.com');


  // Fetch data
  const hospitals = getHospitalsFromLocalStorage();
  const doctors = getDoctorsFromLocalStorage(); // From admin-doctor.js's storage
  const users = getUsersFromLocalStorage(); // All users from auth.js's storage

  // Filter users by role for stats
  const totalPatients = users.filter(u => u.role === 'patient').length;
  const totalDoctors = users.filter(u => u.role === 'doctor').length;
  const verifiedDoctors = doctors.filter(d => d.availability !== 'pending_verification').length; // Assuming 'pending_verification' status for unverified

  // Generate mock appointments for display on admin dashboard
  const mockAppointments = generateMockAppointments(doctors, users);

  // Update stats
  const hospitalCount = document.getElementById("hospitalCount");
  if (hospitalCount) hospitalCount.textContent = hospitals.length;

  const doctorCount = document.getElementById("doctorCount");
  if (doctorCount) doctorCount.textContent = verifiedDoctors; // Display verified doctors

  const appointmentsToday = document.getElementById("appointmentsToday");
  if (appointmentsToday) appointmentsToday.textContent = mockAppointments.length;

  const totalUsers = document.getElementById("totalUsers");
  if (totalUsers) totalUsers.textContent = users.length;

  // Populate tables
  fillTable("hospitalTable", hospitals, ['name', 'type', 'city', 'verified']);
  fillTable("doctorTable", doctors, ['name', 'specialty', 'hospital', 'experience', 'availability']); // Using 'experience' and 'availability' from doctor objects
  fillTable("appointmentTable", mockAppointments, ['time', 'patient', 'doctor', 'hospital', 'fees']);
});