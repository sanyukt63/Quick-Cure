// Enhanced Admin Sign In with security features
class AdminAuth {
    constructor() {
        this.attempts = 0;
        this.maxAttempts = 10;
        this.lockoutTime =1 * 30 * 1000; // 5 minutes in milliseconds
        this.initializeEventListeners();
        this.checkLockoutStatus();
    }

    initializeEventListeners() {
        const form = document.getElementById("adminSigninForm");
        if (form) {
            form.addEventListener("submit", (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // Add input validation
        document.getElementById("adminUser").addEventListener("input", this.clearError.bind(this));
        document.getElementById("adminPassword").addEventListener("input", this.clearError.bind(this));
    }

    checkLockoutStatus() {
        const lockoutUntil = localStorage.getItem("adminLockoutUntil");
        if (lockoutUntil && Date.now() < parseInt(lockoutUntil)) {
            this.showLockoutMessage(parseInt(lockoutUntil));
            this.disableForm();
        } else {
            localStorage.removeItem("adminLockoutUntil");
            localStorage.removeItem("adminAttempts");
        }
    }

    handleLogin() {
        if (this.isLockedOut()) {
            return;
        }

        const user = document.getElementById("adminUser").value.trim();
        const password = document.getElementById("adminPassword").value;
        const errorMsg = document.getElementById("errorMsg");

        // Enhanced admin credentials
        const ADMIN_CREDENTIALS = [
            { username: "sanyukt", password: "sanyukt1234", role: "superadmin" },
            { username: "admin", password: "admin123", role: "admin" },
            { username: "manager", password: "manager123", role: "manager" }
        ];

        const adminUser = ADMIN_CREDENTIALS.find(cred => 
            cred.username === user && cred.password === password
        );

        if (adminUser) {
            // Successful login
            this.resetAttempts();
            localStorage.setItem("isAdmin", "true");
            localStorage.setItem("adminRole", adminUser.role);
            localStorage.setItem("adminUsername", adminUser.username);
            
            // Set login timestamp
            localStorage.setItem("lastLogin", Date.now().toString());
            
            this.showSuccess("Authentication successful! Redirecting...");
            
            // Redirect after short delay
            setTimeout(() => {
                window.location.href = "admin.html";
            }, 1000);
        } else {
            // Failed login
            this.attempts++;
            localStorage.setItem("adminAttempts", this.attempts.toString());
            
            if (this.attempts >= this.maxAttempts) {
                this.lockoutAccount();
                this.showLockoutMessage(Date.now() + this.lockoutTime);
                this.disableForm();
            } else {
                const remaining = this.maxAttempts - this.attempts;
                this.showError(`Invalid credentials! ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining.`);
            }
        }
    }

    isLockedOut() {
        const lockoutUntil = localStorage.getItem("adminLockoutUntil");
        return lockoutUntil && Date.now() < parseInt(lockoutUntil);
    }

    lockoutAccount() {
        const lockoutUntil = Date.now() + this.lockoutTime;
        localStorage.setItem("adminLockoutUntil", lockoutUntil.toString());
    }

    resetAttempts() {
        this.attempts = 0;
        localStorage.removeItem("adminAttempts");
        localStorage.removeItem("adminLockoutUntil");
    }

    showError(message) {
        const errorMsg = document.getElementById("errorMsg");
        errorMsg.textContent = message;
        errorMsg.className = "error-text";
        
        // Add shake animation
        const form = document.getElementById("adminSigninForm");
        form.classList.add('shake');
        setTimeout(() => form.classList.remove('shake'), 500);
    }

    showSuccess(message) {
        const errorMsg = document.getElementById("errorMsg");
        errorMsg.textContent = message;
        errorMsg.style.color = "#27ae60";
        errorMsg.style.background = "rgba(39, 174, 96, 0.1)";
        errorMsg.style.border = "1px solid rgba(39, 174, 96, 0.2)";
    }

    showLockoutMessage(lockoutUntil) {
        const remainingTime = Math.ceil((lockoutUntil - Date.now()) / 1000 / 60);
        const errorMsg = document.getElementById("errorMsg");
        errorMsg.innerHTML = `🔒 Account locked! Try again in ${remainingTime} minute${remainingTime !== 1 ? 's' : ''}.<br>Too many failed attempts.`;
    }

    clearError() {
        const errorMsg = document.getElementById("errorMsg");
        errorMsg.textContent = "";
        errorMsg.className = "";
    }

    disableForm() {
        const form = document.getElementById("adminSigninForm");
        const inputs = form.querySelectorAll("input, button");
        inputs.forEach(input => input.disabled = true);
    }

    enableForm() {
        const form = document.getElementById("adminSigninForm");
        const inputs = form.querySelectorAll("input, button");
        inputs.forEach(input => input.disabled = false);
    }
}

// Add shake animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
        20%, 40%, 60%, 80% { transform: translateX(10px); }
    }
    
    .shake {
        animation: shake 0.5s ease-in-out;
    }
    
    .btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
    
    input:disabled {
        background-color: #f8f9fa;
        cursor: not-allowed;
    }
`;
document.head.appendChild(style);

// Initialize admin auth when DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
    // Load previous attempt count
    const savedAttempts = localStorage.getItem("adminAttempts");
    if (savedAttempts) {
        window.adminAuth = new AdminAuth();
        window.adminAuth.attempts = parseInt(savedAttempts);
    } else {
        window.adminAuth = new AdminAuth();
    }
    
    // Auto-focus on username field
    const usernameField = document.getElementById("adminUser");
    if (usernameField) {
        usernameField.focus();
    }
    
    // Add enter key support
    document.addEventListener("keypress", function(e) {
        if (e.key === "Enter") {
            const form = document.getElementById("adminSigninForm");
            if (form) {
                const event = new Event("submit", { bubbles: true, cancelable: true });
                form.dispatchEvent(event);
            }
        }
    });
});

// Add security features for page visibility
document.addEventListener("visibilitychange", function() {
    if (document.visibilityState === 'hidden') {
        // Optional Security Measure: Clear sensitive data when tab loses focus
        // This can be annoying for users, uncomment if strict security is required.
        const passwordField = document.getElementById("adminPassword");
        if (passwordField) {
            passwordField.value = "";
        }
    }
});

// Prevent right-click context menu (optional security)
document.addEventListener("contextmenu", function(e) {
    e.preventDefault();
    return false;
});

// Add keyboard shortcut for quick access (Ctrl+Alt+A for admin focus)
document.addEventListener("keydown", function(e) {
    if (e.ctrlKey && e.altKey && e.key === 'a') {
        e.preventDefault();
        const usernameField = document.getElementById("adminUser");
        if (usernameField) {
            usernameField.focus();
        }
    }
});