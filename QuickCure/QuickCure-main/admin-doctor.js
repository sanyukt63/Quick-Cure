// Admin Doctor Management JavaScript

class DoctorManager {
  constructor() {
    this.doctors = JSON.parse(localStorage.getItem('doctors')) || []; // Detailed doctor profiles
    this.allUsers = JSON.parse(localStorage.getItem('mr_appointment_users') || '[]'); // All user accounts
    this.currentEditId = null;

    // Prepare data first, then bind events & render
    this.initializeSampleDoctors(); // This will also sync with allUsers
    this.initializeEventListeners();
    this.loadDoctors();
  }

  initializeEventListeners() {
    const addForm = document.getElementById('addDoctorForm');
    if (addForm) {
      addForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleAddDoctor();
      });
    }

    const search = document.getElementById('doctorSearch');
    if (search) search.addEventListener('input', () => this.filterDoctors());

    const filterSpecialty = document.getElementById('filterSpecialty');
    if (filterSpecialty) filterSpecialty.addEventListener('change', () => this.filterDoctors());

    const filterCity = document.getElementById('filterCity');
    if (filterCity) filterCity.addEventListener('change', () => this.filterDoctors());

    const clearBtn = document.querySelector('.btn.clear');
    if (clearBtn) clearBtn.addEventListener('click', () => this.resetForm());
  }

  initializeSampleDoctors() {
    if (!Array.isArray(this.doctors)) this.doctors = [];

    // Only add sample doctors if both 'doctors' and 'mr_appointment_users' don't have doctor entries
    const hasDoctorsInUsers = this.allUsers.some(u => u.role === 'doctor');
    const hasDoctorsInDoctors = this.doctors.length > 0;

    if (!hasDoctorsInUsers && !hasDoctorsInDoctors) {
      const sampleDoctors = [
        {
          id: '1',
          name: 'Dr. Rajesh Sharma',
          email: 'dr.rajesh@apollo.com',
          specialty: 'cardiology',
          experience: 12,
          hospital: 'apollo',
          city: 'delhi',
          qualification: 'MBBS, MD, DM Cardiology',
          availability: 'available',
          bio: 'Senior Cardiologist with 12+ years of experience in interventional cardiology',
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Dr. Priya Singh',
          email: 'dr.priya@fortis.com',
          specialty: 'pediatrics',
          experience: 8,
          hospital: 'fortis',
          city: 'mumbai',
          qualification: 'MBBS, DCH, DNB Pediatrics',
          availability: 'busy',
          bio: 'Pediatric specialist with expertise in child healthcare and vaccination',
          createdAt: new Date().toISOString()
        },
        {
          id: '3',
          name: 'Dr. Sunita Nair',
          email: 'dr.sunita@greenvalley.com',
          specialty: 'dermatology',
          experience: 10,
          hospital: 'green_valley',
          city: 'mumbai',
          qualification: 'MBBS, MD Dermatology',
          availability: 'available',
          bio: 'Dermatologist specializing in skin diseases and cosmetic dermatology',
          createdAt: new Date().toISOString()
        },
        {
          id: '4',
          name: 'Dr. Rohan Shah',
          email: 'dr.rohan@metrocare.com',
          specialty: 'orthopedics',
          experience: 12,
          hospital: 'metro_care',
          city: 'delhi',
          qualification: 'MBBS, MS Orthopedics',
          availability: 'on_leave',
          bio: 'Orthopedic surgeon specialized in joint replacement and sports injuries',
          createdAt: new Date().toISOString()
        },
        {
          id: '5',
          name: 'Dr. Kavita Rao',
          email: 'dr.kavita@citygeneral.com',
          specialty: 'general',
          experience: 8,
          hospital: 'city_general',
          city: 'delhi',
          qualification: 'MBBS, MD General Medicine',
          availability: 'available',
          bio: 'General physician with expertise in internal medicine and chronic care',
          createdAt: new Date().toISOString()
        }
      ];
      this.doctors = sampleDoctors;
      this.saveDoctors(); // Save detailed doctor profiles

      // Also add these as user accounts if they don't exist
      sampleDoctors.forEach(doc => {
        if (!this.allUsers.some(u => u.email === doc.email)) {
          this.allUsers.push({
            name: doc.name,
            email: doc.email,
            password: 'password123', // Default password for sample doctors
            role: 'doctor',
            license: 'SAMPLE_LIC', // Default license
            specialty: doc.specialty,
            experience: doc.experience,
            hospital: doc.hospital
          });
        }
      });
      this.saveAllUsers(); // Save user accounts
    } else if (hasDoctorsInUsers && !hasDoctorsInDoctors) {
      // If users exist but detailed doctors don't, populate detailed doctors from users
      this.doctors = this.allUsers.filter(u => u.role === 'doctor').map(u => ({
        id: u.email, // Use email as ID for simplicity
        name: u.name,
        email: u.email,
        specialty: u.specialty,
        experience: u.experience,
        hospital: u.hospital,
        qualification: u.qualification || 'N/A',
        availability: u.availability || 'available',
        bio: u.bio || '',
        createdAt: u.createdAt || new Date().toISOString()
      }));
      this.saveDoctors();
    }
  }

  handleAddDoctor() {
    const formData = this.getFormData();

    if (!this.validateForm(formData)) return;

    if (this.currentEditId) {
      this.updateDoctor(this.currentEditId, formData);
    } else {
      this.addDoctor(formData);
    }

    this.resetForm();
  }

  getFormData() {
    const val = (id) => (document.getElementById(id)?.value || '').trim();

    return {
      name: val('doctorName'),
      email: val('doctorEmail'),
      specialty: val('doctorSpecialty'),
      experience: parseInt(val('doctorExperience'), 10),
      hospital: val('doctorHospital'),
      city: val('doctorCity'),
      qualification: val('doctorQualification'),
      availability: val('doctorAvailability'),
      bio: val('doctorBio')
    };
  }

  validateForm(data) {
    this.clearErrors();
    let isValid = true;

    if (!data.name) {
      this.showError('doctorName', 'Name is required');
      isValid = false;
    }

    if (!data.email || !this.isValidEmail(data.email)) {
      this.showError('doctorEmail', 'Please enter a valid email address');
      isValid = false;
    }

    if (!data.specialty) {
      this.showError('doctorSpecialty', 'Please select a specialty');
      isValid = false;
    }

    if (Number.isNaN(data.experience) || data.experience < 0) {
      this.showError('doctorExperience', 'Please enter a valid experience');
      isValid = false;
    }

    if (!data.hospital) {
      this.showError('doctorHospital', 'Please select a hospital');
      isValid = false;
    }

    if (!data.city) {
      this.showError('doctorCity', 'Please select a city');
      isValid = false;
    }

    if (!data.qualification) {
      this.showError('doctorQualification', 'Qualification is required');
      isValid = false;
    }

    // Check for duplicate email only if adding a new doctor
    if (
      !this.currentEditId &&
      (this.doctors.some((doc) => doc.email.toLowerCase() === data.email.toLowerCase()) ||
       this.allUsers.some((user) => user.email.toLowerCase() === data.email.toLowerCase()))
    ) {
      this.showError('doctorEmail', 'A doctor with this email already exists');
      isValid = false;
    }

    return isValid;
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;

    field.classList.add('error');

    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;

    field.parentNode && field.parentNode.appendChild(errorDiv);
  }

  clearErrors() {
    document.querySelectorAll('.error').forEach((el) => el.classList.remove('error'));
    document.querySelectorAll('.error-message').forEach((el) => el.remove());
  }

  addDoctor(doctorData) {
    const newDoctor = {
      id: Date.now().toString(), // Unique ID for detailed profile
      ...doctorData,
      createdAt: new Date().toISOString()
    };

    this.doctors.push(newDoctor);
    this.saveDoctors();

    // Also add to allUsers array for login purposes
    this.allUsers.push({
      name: newDoctor.name,
      email: newDoctor.email,
      password: 'password123', // Default password for newly added doctors
      role: 'doctor',
      license: 'ADMIN_ADDED', // Default license
      specialty: newDoctor.specialty,
      experience: newDoctor.experience,
      hospital: newDoctor.hospital,
      qualification: newDoctor.qualification,
      availability: newDoctor.availability
    });
    this.saveAllUsers();

    this.loadDoctors();
    this.showMessage('Doctor added successfully!', 'success');
  }

  updateDoctor(id, updatedData) {
    const index = this.doctors.findIndex((doctor) => doctor.id === id);
    if (index !== -1) {
      this.doctors[index] = {
        ...this.doctors[index],
        ...updatedData,
        updatedAt: new Date().toISOString()
      };
      this.saveDoctors();

      // Also update in allUsers array
      const userIndex = this.allUsers.findIndex(u => u.email === updatedData.email);
      if (userIndex !== -1) {
        this.allUsers[userIndex] = {
          ...this.allUsers[userIndex],
          name: updatedData.name,
          specialty: updatedData.specialty,
          experience: updatedData.experience,
          hospital: updatedData.hospital,
          qualification: updatedData.qualification,
          availability: updatedData.availability
        };
      } else {
        // If for some reason user account doesn't exist, create it
        this.allUsers.push({
          name: updatedData.name,
          email: updatedData.email,
          password: 'password123', // Default password
          role: 'doctor',
          license: 'ADMIN_UPDATED',
          specialty: updatedData.specialty,
          experience: updatedData.experience,
          hospital: updatedData.hospital,
          qualification: updatedData.qualification,
          availability: updatedData.availability
        });
      }
      this.saveAllUsers();

      this.loadDoctors();
      this.showMessage('Doctor updated successfully!', 'success');
    }
  }

  editDoctor(id) {
    const doctor = this.doctors.find((d) => d.id === id);
    if (!doctor) return;

    document.getElementById('doctorName').value = doctor.name;
    document.getElementById('doctorEmail').value = doctor.email;
    document.getElementById('doctorSpecialty').value = doctor.specialty;
    document.getElementById('doctorExperience').value = doctor.experience;
    document.getElementById('doctorHospital').value = doctor.hospital;
    document.getElementById('doctorCity').value = doctor.city;
    document.getElementById('doctorQualification').value = doctor.qualification;
    document.getElementById('doctorAvailability').value = doctor.availability;
    document.getElementById('doctorBio').value = doctor.bio || '';

    this.currentEditId = id;
    const addBtn = document.querySelector('.btn.add');
    if (addBtn) addBtn.textContent = 'Update Doctor';
  }

  deleteDoctor(id) {
    if (!confirm('Are you sure you want to delete this doctor?')) return;

    const doctorToDelete = this.doctors.find((doctor) => doctor.id === id);
    if (!doctorToDelete) return;

    this.doctors = this.doctors.filter((doctor) => doctor.id !== id);
    this.saveDoctors();

    // Also remove from allUsers array
    this.allUsers = this.allUsers.filter(u => u.email !== doctorToDelete.email);
    this.saveAllUsers();

    this.loadDoctors();
    this.showMessage('Doctor deleted successfully!', 'success');
  }

  loadDoctors() {
    const tableBody = document.getElementById('doctorListBody');
    if (!tableBody) return;

    if (!this.doctors || this.doctors.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="7" class="empty-state">
            <h3>No doctors found</h3>
            <p>Add your first doctor to get started.</p>
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = this.doctors
      .map(
        (doctor) => `
        <tr>
          <td>${this.escapeHtml(doctor.name)}</td>
          <td>${this.escapeHtml(this.formatSpecialty(doctor.specialty))}</td>
          <td>${this.escapeHtml(this.formatHospital(doctor.hospital))}</td>
          <td>${this.escapeHtml(this.formatCity(doctor.city))}</td>
          <td>${doctor.experience} years</td>
          <td><span class="status-badge status-${doctor.availability}">${this.formatAvailability(doctor.availability)}</span></td>
          <td>
            <div class="action-buttons">
              <button class="btn-edit" onclick="doctorManager.editDoctor('${doctor.id}')">Edit</button>
              <button class="btn-delete" onclick="doctorManager.deleteDoctor('${doctor.id}')">Delete</button>
            </div>
          </td>
        </tr>`
      )
      .join('');
  }

  filterDoctors() {
    const searchTerm = (document.getElementById('doctorSearch')?.value || '').toLowerCase();
    const specialtyFilter = document.getElementById('filterSpecialty')?.value || '';
    const cityFilter = document.getElementById('filterCity')?.value || '';

    let filteredDoctors = this.doctors || [];

    if (searchTerm) {
      filteredDoctors = filteredDoctors.filter(
        (doctor) =>
          doctor.name.toLowerCase().includes(searchTerm) ||
          doctor.specialty.toLowerCase().includes(searchTerm) ||
          doctor.city.toLowerCase().includes(searchTerm) ||
          (doctor.qualification || '').toLowerCase().includes(searchTerm)
      );
    }

    if (specialtyFilter) {
      filteredDoctors = filteredDoctors.filter((doctor) => doctor.specialty === specialtyFilter);
    }

    if (cityFilter) {
      filteredDoctors = filteredDoctors.filter((doctor) => doctor.city === cityFilter);
    }

    this.renderFilteredDoctors(filteredDoctors);
  }

  renderFilteredDoctors(doctors) {
    const tableBody = document.getElementById('doctorListBody');
    if (!tableBody) return;

    if (!doctors || doctors.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="7" class="empty-state">
            <h3>No matching doctors found</h3>
            <p>Try adjusting your search criteria.</p>
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = doctors
      .map(
        (doctor) => `
        <tr>
          <td>${this.escapeHtml(doctor.name)}</td>
          <td>${this.escapeHtml(this.formatSpecialty(doctor.specialty))}</td>
          <td>${this.escapeHtml(this.formatHospital(doctor.hospital))}</td>
          <td>${this.escapeHtml(this.formatCity(doctor.city))}</td>
          <td>${doctor.experience} years</td>
          <td><span class="status-badge status-${doctor.availability}">${this.formatAvailability(doctor.availability)}</span></td>
          <td>
            <div class="action-buttons">
              <button class="btn-edit" onclick="doctorManager.editDoctor('${doctor.id}')">Edit</button>
              <button class="btn-delete" onclick="doctorManager.deleteDoctor('${doctor.id}')">Delete</button>
            </div>
          </td>
        </tr>`
      )
      .join('');
  }

  formatSpecialty(specialty) {
    const specialties = {
      cardiology: 'Cardiology',
      dermatology: 'Dermatology',
      orthopedics: 'Orthopedics',
      pediatrics: 'Pediatrics',
      ent: 'ENT',
      psychiatry: 'Psychiatry',
      general: 'General Physician',
      neurology: 'Neurology',
      oncology: 'Oncology',
      gynecology: 'Gynecology'
    };
    return specialties[specialty] || specialty;
  }

  formatHospital(hospital) {
    const hospitals = {
      apollo: 'Apollo Hospitals',
      fortis: 'Fortis Healthcare',
      max: 'Max Super Speciality',
      medanta: 'Medanta The Medicity',
      artemis: 'Artemis Hospitals',
      city_general: 'City General Hospital',
      green_valley: 'Green Valley Multi-speciality',
      metro_care: 'Metro Care Clinic',
      national_health: 'National Health Center',
      apollo_speciality: 'Apollo Speciality Hospital',
      fortis_healthcare: 'Fortis Healthcare'
    };
    return hospitals[hospital] || hospital;
  }

  formatCity(city) {
    const cities = {
      delhi: 'Delhi',
      mumbai: 'Mumbai',
      bengaluru: 'Bengaluru',
      kolkata: 'Kolkata',
      chennai: 'Chennai',
      hyderabad: 'Hyderabad',
      pune: 'Pune',
      lucknow: 'Lucknow'
    };
    return cities[city] || city;
  }

  formatAvailability(availability) {
    const statuses = {
      available: 'Available',
      busy: 'Busy',
      on_leave: 'On Leave'
    };
    return statuses[availability] || availability;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text ?? '';
    return div.innerHTML;
  }

  resetForm() {
    document.getElementById('addDoctorForm')?.reset();
    this.clearErrors();
    this.currentEditId = null;
    const addBtn = document.querySelector('.btn.add');
    if (addBtn) addBtn.textContent = 'Add Doctor';
  }

  saveDoctors() {
    localStorage.setItem('doctors', JSON.stringify(this.doctors || []));
  }

  saveAllUsers() {
    localStorage.setItem('mr_appointment_users', JSON.stringify(this.allUsers || []));
  }

  showMessage(message, type) {
    const existingMessage = document.querySelector('.message');
    if (existingMessage) existingMessage.remove();

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;

    const container = document.querySelector('.doctor-management-section');
    if (container) container.insertBefore(messageDiv, container.firstChild);

    setTimeout(() => messageDiv.remove(), 3000);
  }
}

// Initialize doctor manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.doctorManager = new DoctorManager();
});