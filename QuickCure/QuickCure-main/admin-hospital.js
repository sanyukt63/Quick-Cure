// Admin Hospital Management JavaScript

class HospitalManager {
  constructor() {
    this.hospitals = JSON.parse(localStorage.getItem('quickcare_hospitals')) || []; // Detailed hospital profiles
    this.currentEditId = null;

    // Prepare data first, then bind events & render
    this.initializeSampleHospitals();
    this.initializeEventListeners();
    this.loadHospitals();
  }

  initializeEventListeners() {
    const addForm = document.getElementById('addHospitalForm');
    if (addForm) {
      addForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleAddHospital();
      });
    }

    const search = document.getElementById('hospitalSearch');
    if (search) search.addEventListener('input', () => this.filterHospitals());

    const filterType = document.getElementById('filterType');
    if (filterType) filterType.addEventListener('change', () => this.filterHospitals());

    const filterCity = document.getElementById('filterCity');
    if (filterCity) filterCity.addEventListener('change', () => this.filterHospitals());

    // BUG FIX: Added event listener for filterVerification
    const filterVerification = document.getElementById('filterVerification');
    if (filterVerification) filterVerification.addEventListener('change', () => this.filterHospitals());

    const clearBtn = document.querySelector('.btn.clear');
    if (clearBtn) clearBtn.addEventListener('click', () => this.resetForm());
  }

  initializeSampleHospitals() {
    // Check if hospitals data already exists in localStorage
    if (this.hospitals.length === 0) {
      // Use the mockHospitals data from app.js
      // Ensure mockHospitals is accessible or copy it here if app.js is not loaded before this script
      const mockHospitals = [
        {
          id: 1,
          name: "City General Hospital",
          type: "Govt",
          city: "delhi",
          image: "https://www.vecteezy.com/free-vector/hospital",
          rating: 4.5,
          reviews: 234,
          distanceKm: 2.8,
          address: "123 Main Street, Connaught Place",
          phone: "+91 11 2345 6789",
          email: "citygeneral@example.com", // Added email
          verified: true // Added for admin dashboard display
        },
        {
          id: 2,
          name: "Green Valley Multi-speciality",
          type: "Private",
          city: "mumbai",
          image: "https://www.vecteezy.com/free-vector/hospital",
          rating: 4.7,
          reviews: 156,
          distanceKm: 4.2,
          address: "456 Marine Drive, Colaba",
          phone: "+91 22 9876 5432",
          email: "greenvalley@example.com", // Added email
          verified: true
        },
        {
          id: 3,
          name: "Metro Care Clinic",
          type: "Private",
          city: "delhi",
          image: "https://placehold.co/600x400/e74c3c/ffffff?text=Metro+Care+Clinic&font=montserrat",
          rating: 4.3,
          reviews: 89,
          distanceKm: 1.5,
          address: "789 MG Road, Karol Bagh",
          phone: "+91 11 8765 4321",
          email: "metrocare@example.com", // Added email
          verified: false // Example of unverified
        },
        {
          id: 4,
          name: "National Health Center",
          type: "Govt",
          city: "bengaluru",
          image: "https://placehold.co/600x400/9b59b6/ffffff?text=National+Health+Center&font=montserrat",
          rating: 4.6,
          reviews: 312,
          distanceKm: 3.7,
          address: "321 Brigade Road, MG Road",
          phone: "+91 80 2345 6789",
          email: "nationalhealth@example.com", // Added email
          verified: true
        },
        {
          id: 5,
          name: "Apollo Speciality Hospital",
          type: "Private",
          city: "chennai",
          image: "https://www.vecteezy.com/free-vector/hospital",
          rating: 4.8,
          reviews: 478,
          distanceKm: 5.1,
          address: "654 Greams Road, Thousand Lights",
          phone: "+91 44 9876 5432",
          email: "apollo@example.com", // Added email
          verified: true
        },
        {
          id: 6,
          name: "Fortis Healthcare",
          type: "Private",
          city: "mumbai",
          image: "https://www.vecteezy.com/free-vector/hospital",
          rating: 4.9,
          reviews: 345,
          distanceKm: 6.3,
          address: "987 Linking Road, Bandra West",
          phone: "+91 22 3456 7890",
          email: "fortis@example.com", // Added email
          verified: true
        },
        {
          id: 7,
          name: "Kolkata Medical Research Institute",
          type: "Private",
          city: "kolkata",
          image: "https://placehold.co/600x400/1abc9c/ffffff?text=Kolkata+MRI&font=montserrat",
          rating: 4.6,
          reviews: 280,
          distanceKm: 3.9,
          address: "45 Park Street, Taltala",
          phone: "+91 33 2345 6789",
          email: "kolkatamri@example.com", // Added email
          verified: true
        },
        {
          id: 8,
          name: "Hyderabad Global Hospital",
          type: "Private",
          city: "hyderabad",
          image: "https://placehold.co/600x400/2980b9/ffffff?text=Hyderabad+Global&font=montserrat",
          rating: 4.7,
          reviews: 310,
          distanceKm: 4.5,
          address: "67 Banjara Hills Road, Hyderabad",
          phone: "+91 40 3456 7890",
          email: "hyderabadglobal@example.com", // Added email
          verified: true
        },
        {
          id: 9,
          name: "Pune Health Hub",
          type: "Private",
          city: "pune",
          image: "https://placehold.co/600x400/f39c12/ffffff?text=Pune+Health+Hub&font=montserrat",
          rating: 4.4,
          reviews: 180,
          distanceKm: 3.1,
          address: "101 Baner Road, Pune",
          phone: "+91 20 1234 5678",
          email: "punehealth@example.com", // Added email
          verified: true
        },
        {
          id: 10,
          name: "Lucknow Care Center",
          type: "Govt",
          city: "lucknow",
          image: "https://placehold.co/600x400/27ae60/ffffff?text=Lucknow+Care&font=montserrat",
          rating: 4.2,
          reviews: 95,
          distanceKm: 2.5,
          address: "202 Hazratganj, Lucknow",
          phone: "+91 522 9876 5432",
          email: "lucknowcare@example.com", // Added email
          verified: true
        },
        {
          id: 11,
          name: "Delhi Advanced Medical",
          type: "Private",
          city: "delhi",
          image: "https://placehold.co/600x400/34495e/ffffff?text=Delhi+Advanced&font=montserrat",
          rating: 4.7,
          reviews: 400,
          distanceKm: 5.0,
          address: "505 Defence Colony, Delhi",
          phone: "+91 11 5678 1234",
          email: "delhiadvanced@example.com", // Added email
          verified: true
        },
        {
          id: 12,
          name: "Mumbai Coastal Hospital",
          type: "Govt",
          city: "mumbai",
          image: "https://placehold.co/600x400/e67e22/ffffff?text=Mumbai+Coastal&font=montserrat",
          rating: 4.1,
          reviews: 120,
          distanceKm: 1.9,
          address: "303 Juhu Beach, Mumbai",
          phone: "+91 22 1122 3344",
          email: "mumbaicoastal@example.com", // Added email
          verified: true
        },
        {
          id: 13,
          name: "Bengaluru Tech Hospital",
          type: "Private",
          city: "bengaluru",
          image: "https://placehold.co/600x400/8e44ad/ffffff?text=Bengaluru+Tech&font=montserrat",
          rating: 4.6,
          reviews: 290,
          distanceKm: 4.0,
          address: "707 Koramangala, Bengaluru",
          phone: "+91 80 5566 7788",
          email: "bengalurutech@example.com", // Added email
          verified: true
        },
        {
          id: 14,
          name: "Chennai Wellness Center",
          type: "Private",
          city: "chennai",
          image: "https://placehold.co/600x400/16a085/ffffff?text=Chennai+Wellness&font=montserrat",
          rating: 4.5,
          reviews: 210,
          distanceKm: 3.5,
          address: "808 Anna Salai, Chennai",
          phone: "+91 44 2233 4455",
          email: "chennaiwellness@example.com", // Added email
          verified: true
        },
        {
          id: 15,
          name: "Kolkata Heart Institute",
          type: "Private",
          city: "kolkata",
          image: "https://placehold.co/600x400/c0392b/ffffff?text=Kolkata+Heart&font=montserrat",
          rating: 4.8,
          reviews: 350,
          distanceKm: 4.8,
          address: "909 Park Circus, Kolkata",
          phone: "+91 33 5544 3322",
          email: "kolkataheart@example.com", // Added email
          verified: true
        },
        {
          id: 16,
          name: "Hyderabad City Clinic",
          type: "Govt",
          city: "hyderabad",
          image: "https://placehold.co/600x400/7f8c8d/ffffff?text=Hyderabad+City&font=montserrat",
          rating: 4.0,
          reviews: 75,
          distanceKm: 2.2,
          address: "111 Abids Road, Hyderabad",
          phone: "+91 40 6677 8899",
          email: "hyderabadcity@example.com", // Added email
          verified: true
        },
        {
          id: 17,
          name: "Delhi North Hospital",
          type: "Govt",
          city: "delhi",
          image: "https://placehold.co/600x400/28a745/ffffff?text=Delhi+North&font=montserrat",
          rating: 4.2,
          reviews: 150,
          distanceKm: 6.0,
          address: "Sector 15, Rohini, Delhi",
          phone: "+91 11 9988 7766",
          email: "delhinorth@example.com", // Added email
          verified: true
        },
        {
          id: 18,
          name: "Delhi South Clinic",
          type: "Private",
          city: "delhi",
          image: "https://placehold.co/600x400/fd7e14/ffffff?text=Delhi+South&font=montserrat",
          rating: 4.6,
          reviews: 280,
          distanceKm: 3.2,
          address: "Greater Kailash, Delhi",
          phone: "+91 11 1122 3344",
          email: "delhisouth@example.com", // Added email
          verified: true
        },
        {
          id: 19,
          name: "Mumbai Central Hospital",
          type: "Private",
          city: "mumbai",
          image: "https://placehold.co/600x400/6f42c1/ffffff?text=Mumbai+Central&font=montserrat",
          rating: 4.5,
          reviews: 200,
          distanceKm: 2.5,
          address: "Parel, Mumbai",
          phone: "+91 22 2233 4455",
          email: "mumbaicentral@example.com", // Added email
          verified: true
        },
        {
          id: 20,
          name: "Mumbai Suburban Clinic",
          type: "Govt",
          city: "mumbai",
          image: "https://placehold.co/600x400/17a2b8/ffffff?text=Mumbai+Suburban&font=montserrat",
          rating: 4.0,
          reviews: 90,
          distanceKm: 7.0,
          address: "Andheri, Mumbai",
          phone: "+91 22 5566 7788",
          email: "mumbaisuburban@example.com", // Added email
          verified: true
        },
        {
          id: 21,
          name: "Bengaluru East Clinic",
          type: "Private",
          city: "bengaluru",
          image: "https://placehold.co/600x400/dc3545/ffffff?text=Bengaluru+East&font=montserrat",
          rating: 4.3,
          reviews: 160,
          distanceKm: 5.5,
          address: "Indiranagar, Bengaluru",
          phone: "+91 80 1122 3344",
          email: "bengalurueast@example.com", // Added email
          verified: true
        },
        {
          id: 22,
          name: "Bengaluru West Hospital",
          type: "Govt",
          city: "bengaluru",
          image: "https://placehold.co/600x400/ffc107/ffffff?text=Bengaluru+West&font=montserrat",
          rating: 4.1,
          reviews: 110,
          distanceKm: 6.2,
          address: "Rajajinagar, Bengaluru",
          phone: "+91 80 9988 7766",
          email: "bengaluruwest@example.com", // Added email
          verified: true
        },
        {
          id: 23,
          name: "Chennai North Clinic",
          type: "Govt",
          city: "chennai",
          image: "https://placehold.co/600x400/6c757d/ffffff?text=Chennai+North&font=montserrat",
          rating: 4.0,
          reviews: 80,
          distanceKm: 4.0,
          address: "Ambattur, Chennai",
          phone: "+91 44 8877 6655",
          email: "chennainorth@example.com", // Added email
          verified: true
        },
        {
          id: 24,
          name: "Chennai South Hospital",
          type: "Private",
          city: "chennai",
          image: "https://placehold.co/600x400/20c997/ffffff?text=Chennai+South&font=montserrat",
          rating: 4.7,
          reviews: 300,
          distanceKm: 7.0,
          address: "OMR, Chennai",
          phone: "+91 44 3344 5566",
          email: "chennaisouth@example.com", // Added email
          verified: true
        },
        {
          id: 25,
          name: "Kolkata East Hospital",
          type: "Govt",
          city: "kolkata",
          image: "https://placehold.co/600x400/6610f2/ffffff?text=Kolkata+East&font=montserrat",
          rating: 4.1,
          reviews: 100,
          distanceKm: 5.0,
          address: "Salt Lake City, Kolkata",
          phone: "+91 33 1122 3344",
          email: "kolkataeast@example.com", // Added email
          verified: true
        },
        {
          id: 26,
          name: "Kolkata West Clinic",
          type: "Private",
          city: "kolkata",
          image: "https://placehold.co/600x400/e83e8c/ffffff?text=Kolkata+West&font=montserrat",
          rating: 4.4,
          reviews: 190,
          distanceKm: 3.0,
          address: "Howrah, Kolkata",
          phone: "+91 33 9988 7766",
          email: "kolkatawest@example.com", // Added email
          verified: true
        },
        {
          id: 27,
          name: "Hyderabad East Clinic",
          type: "Private",
          city: "hyderabad",
          image: "https://placehold.co/600x400/ffc107/ffffff?text=Hyderabad+East&font=montserrat",
          rating: 4.3,
          reviews: 140,
          distanceKm: 3.8,
          address: "Kothapet, Hyderabad",
          phone: "+91 40 1122 3344",
          email: "hyderabadeast@example.com", // Added email
          verified: true
        },
        {
          id: 28,
          name: "Hyderabad West Hospital",
          type: "Govt",
          city: "hyderabad",
          image: "https://placehold.co/600x400/007bff/ffffff?text=Hyderabad+West&font=montserrat",
          rating: 4.0,
          reviews: 85,
          distanceKm: 5.0,
          address: "Gachibowli, Hyderabad",
          phone: "+91 40 9988 7766",
          email: "hyderabadwest@example.com", // Added email
          verified: true
        },
        {
          id: 29,
          name: "Pune Central Hospital",
          type: "Govt",
          city: "pune",
          image: "https://placehold.co/600x400/6c757d/ffffff?text=Pune+Central&font=montserrat",
          rating: 4.1,
          reviews: 105,
          distanceKm: 2.0,
          address: "Shivajinagar, Pune",
          phone: "+91 20 9988 7766",
          email: "punecentral@example.com", // Added email
          verified: true
        },
        {
          id: 30,
          name: "Pune South Clinic",
          type: "Private",
          city: "pune",
          image: "https://placehold.co/600x400/28a745/ffffff?text=Pune+South&font=montserrat",
          rating: 4.5,
          reviews: 220,
          distanceKm: 4.5,
          address: "Hadapsar, Pune",
          phone: "+91 20 1122 3344",
          email: "punesouth@example.com", // Added email
          verified: true
        },
        {
          id: 31,
          name: "Lucknow North Hospital",
          type: "Private",
          city: "lucknow",
          image: "https://placehold.co/600x400/ffc107/ffffff?text=Lucknow+North&font=montserrat",
          rating: 4.3,
          reviews: 130,
          distanceKm: 3.5,
          address: "Gomti Nagar, Lucknow",
          phone: "+91 522 1122 3344",
          email: "lucknownorth@example.com", // Added email
          verified: true
        },
        {
          id: 32,
          name: "Lucknow South Clinic",
          type: "Govt",
          city: "lucknow",
          image: "https://placehold.co/600x400/17a2b8/ffffff?text=Lucknow+South&font=montserrat",
          rating: 4.0,
          reviews: 70,
          distanceKm: 4.0,
          address: "Alambagh, Lucknow",
          phone: "+91 522 9988 7766",
          email: "lucknowsouth@example.com", // Added email
          verified: true
        }
      ];
      this.hospitals = mockHospitals.map(h => ({
        ...h,
        createdAt: new Date().toISOString(),
        // Ensure 'verified' status is explicitly set for new hospitals
        verified: h.verified !== undefined ? h.verified : true // Default to true if not specified in mock
      }));
      this.saveHospitals();
    }
  }

  handleAddHospital() {
    const formData = this.getFormData();

    if (!this.validateForm(formData)) return;

    if (this.currentEditId) {
      this.updateHospital(this.currentEditId, formData);
    } else {
      this.addHospital(formData);
    }

    this.resetForm();
  }

  getFormData() {
    const val = (id) => (document.getElementById(id)?.value || '').trim();
    // BUG FIX: Correctly read checked property for checkbox
    const checked = (id) => document.getElementById(id)?.checked;

    return {
      name: val('hospitalName'),
      type: val('hospitalType'),
      city: val('hospitalCity'),
      address: val('hospitalAddress'), // Added missing field
      phone: val('hospitalPhone'),     // Added missing field
      email: val('hospitalEmail'),     // Added missing field
      rating: parseFloat(val('hospitalRating')), // Added missing field
      reviews: parseInt(val('hospitalReviews'), 10), // Added missing field
      distanceKm: parseFloat(val('hospitalDistance')), // Added missing field
      verified: checked('hospitalVerified') // Corrected to read from checkbox
    };
  }

  validateForm(data) {
    this.clearErrors();
    let isValid = true;

    if (!data.name) {
      this.showError('hospitalName', 'Name is required');
      isValid = false;
    }
    if (!data.type) {
      this.showError('hospitalType', 'Type is required');
      isValid = false;
    }
    if (!data.city) {
      this.showError('hospitalCity', 'City is required');
      isValid = false;
    }
    // Added validation for new fields
    if (!data.address) {
      this.showError('hospitalAddress', 'Address is required');
      isValid = false;
    }
    if (!data.phone) {
      this.showError('hospitalPhone', 'Phone is required');
      isValid = false;
    } else if (!/^\+?\d{10,15}$/.test(data.phone)) { // Basic phone number validation
      this.showError('hospitalPhone', 'Please enter a valid phone number');
      isValid = false;
    }
    if (!data.email || !this.isValidEmail(data.email)) {
      this.showError('hospitalEmail', 'Please enter a valid email address');
      isValid = false;
    }
    if (isNaN(data.rating) || data.rating < 0 || data.rating > 5) {
      this.showError('hospitalRating', 'Rating must be between 0 and 5');
      isValid = false;
    }
    if (isNaN(data.reviews) || data.reviews < 0) {
      this.showError('hospitalReviews', 'Reviews must be a non-negative number');
      isValid = false;
    }
    if (isNaN(data.distanceKm) || data.distanceKm < 0) {
      this.showError('hospitalDistance', 'Distance must be a non-negative number');
      isValid = false;
    }

    // Check for duplicate name (case-insensitive) only if adding a new hospital
    if (!this.currentEditId && this.hospitals.some(h => h.name.toLowerCase() === data.name.toLowerCase())) {
      this.showError('hospitalName', 'A hospital with this name already exists');
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

  addHospital(hospitalData) {
    const newHospital = {
      id: Date.now(), // Simple unique ID
      ...hospitalData,
      createdAt: new Date().toISOString()
    };

    this.hospitals.push(newHospital);
    this.saveHospitals();
    this.loadHospitals();
    this.showMessage('Hospital added successfully!', 'success');
  }

  updateHospital(id, updatedData) {
    const index = this.hospitals.findIndex((hospital) => hospital.id == id); // Use == for potential type coercion
    if (index !== -1) {
      this.hospitals[index] = {
        ...this.hospitals[index],
        ...updatedData,
        updatedAt: new Date().toISOString()
      };
      this.saveHospitals();
      this.loadHospitals();
      this.showMessage('Hospital updated successfully!', 'success');
    }
  }

  editHospital(id) {
    const hospital = this.hospitals.find((h) => h.id == id);
    if (!hospital) return;

    document.getElementById('hospitalName').value = hospital.name;
    document.getElementById('hospitalType').value = hospital.type;
    document.getElementById('hospitalCity').value = hospital.city;
    document.getElementById('hospitalAddress').value = hospital.address; // Added missing field
    document.getElementById('hospitalPhone').value = hospital.phone;     // Added missing field
    document.getElementById('hospitalEmail').value = hospital.email;     // Added missing field
    document.getElementById('hospitalRating').value = hospital.rating;   // Added missing field
    document.getElementById('hospitalReviews').value = hospital.reviews; // Added missing field
    document.getElementById('hospitalDistance').value = hospital.distanceKm; // Added missing field
    // BUG FIX: Set checked property for checkbox
    document.getElementById('hospitalVerified').checked = hospital.verified;

    this.currentEditId = id;
    const addBtn = document.querySelector('.btn.add');
    if (addBtn) addBtn.textContent = 'Update Hospital';
  }

  deleteHospital(id) {
    if (!confirm('Are you sure you want to delete this hospital?')) return;

    this.hospitals = this.hospitals.filter((hospital) => hospital.id != id);
    this.saveHospitals();
    this.loadHospitals();
    this.showMessage('Hospital deleted successfully!', 'success');
  }

  loadHospitals() {
    const tableBody = document.getElementById('hospitalListBody');
    if (!tableBody) return;

    if (!this.hospitals || this.hospitals.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="9" class="empty-state">
            <h3>No hospitals found</h3>
            <p>Add your first hospital to get started.</p>
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = this.hospitals
      .map(
        (hospital) => `
        <tr>
          <td>${this.escapeHtml(hospital.name)}</td>
          <td>${this.escapeHtml(this.formatType(hospital.type))}</td>
          <td>${this.escapeHtml(this.formatCity(hospital.city))}</td>
          <td>${hospital.rating} ⭐</td>
          <td>${hospital.reviews}</td>
          <td>${hospital.distanceKm} km</td>
          <td><span class="status-badge ${hospital.verified ? 'verified-true' : 'verified-false'}">${hospital.verified ? '✅ Verified' : '⏳ Pending'}</span></td>
          <td>
            <div class="action-buttons">
              <button class="btn btn-edit" onclick="hospitalManager.editHospital('${hospital.id}')">Edit</button>
              <button class="btn btn-delete" onclick="hospitalManager.deleteHospital('${hospital.id}')">Delete</button>
            </div>
          </td>
        </tr>`
      )
      .join('');
  }

  filterHospitals() {
    const searchTerm = (document.getElementById('hospitalSearch')?.value || '').toLowerCase();
    const typeFilter = document.getElementById('filterType')?.value || '';
    const cityFilter = document.getElementById('filterCity')?.value || '';
    // BUG FIX: Get value from filterVerification
    const verificationFilter = document.getElementById('filterVerification')?.value;


    let filteredHospitals = this.hospitals || [];

    if (searchTerm) {
      filteredHospitals = filteredHospitals.filter(
        (hospital) =>
          hospital.name.toLowerCase().includes(searchTerm) ||
          hospital.city.toLowerCase().includes(searchTerm) ||
          hospital.address.toLowerCase().includes(searchTerm)
      );
    }

    if (typeFilter) {
      filteredHospitals = filteredHospitals.filter((hospital) => hospital.type.toLowerCase() === typeFilter.toLowerCase());
    }

    if (cityFilter) {
      filteredHospitals = filteredHospitals.filter((hospital) => hospital.city.toLowerCase() === cityFilter.toLowerCase());
    }

    // BUG FIX: Filter by verification status
    if (verificationFilter !== '' && verificationFilter !== undefined) {
      const isVerified = verificationFilter === 'true';
      filteredHospitals = filteredHospitals.filter(hospital => hospital.verified === isVerified);
    }

    this.renderFilteredHospitals(filteredHospitals);
  }

  renderFilteredHospitals(hospitals) {
    const tableBody = document.getElementById('hospitalListBody');
    if (!tableBody) return;

    if (!hospitals || hospitals.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="9" class="empty-state">
            <h3>No matching hospitals found</h3>
            <p>Try adjusting your search criteria.</p>
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = hospitals
      .map(
        (hospital) => `
        <tr>
          <td>${this.escapeHtml(hospital.name)}</td>
          <td>${this.escapeHtml(this.formatType(hospital.type))}</td>
          <td>${this.escapeHtml(this.formatCity(hospital.city))}</td>
          <td>${hospital.rating} ⭐</td>
          <td>${hospital.reviews}</td>
          <td>${hospital.distanceKm} km</td>
          <td><span class="status-badge ${hospital.verified ? 'verified-true' : 'verified-false'}">${hospital.verified ? '✅ Verified' : '⏳ Pending'}</span></td>
          <td>
            <div class="action-buttons">
              <button class="btn btn-edit" onclick="hospitalManager.editHospital('${hospital.id}')">Edit</button>
              <button class="btn btn-delete" onclick="hospitalManager.deleteHospital('${hospital.id}')">Delete</button>
            </div>
          </td>
        </tr>`
      )
      .join('');
  }

  formatType(type) {
    return type.charAt(0).toUpperCase() + type.slice(1);
  }

  formatCity(city) {
    const cities = {
      delhi: 'Delhi', mumbai: 'Mumbai', bengaluru: 'Bengaluru', kolkata: 'Kolkata',
      chennai: 'Chennai', hyderabad: 'Hyderabad', pune: 'Pune', lucknow: 'Lucknow'
    };
    return cities[city] || city;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text ?? '';
    return div.innerHTML;
  }

  resetForm() {
    document.getElementById('addHospitalForm')?.reset();
    document.getElementById('hospitalVerified').checked = false; // Reset checkbox
    this.clearErrors();
    this.currentEditId = null;
    const addBtn = document.querySelector('.btn.add');
    if (addBtn) addBtn.textContent = 'Add Hospital';
  }

  saveHospitals() {
    localStorage.setItem('quickcare_hospitals', JSON.stringify(this.hospitals || []));
  }

  showMessage(message, type) {
    const existingMessage = document.querySelector('.message');
    if (existingMessage) existingMessage.remove();

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;

    const container = document.querySelector('.hospital-management-section'); // Assuming a container for messages
    if (container) container.insertBefore(messageDiv, container.firstChild);

    setTimeout(() => messageDiv.remove(), 3000);
  }
}

// Initialize hospital manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.hospitalManager = new HospitalManager();
});