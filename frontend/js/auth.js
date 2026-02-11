class AuthService {
    constructor() {
        this.isAuthenticated = false;
        this.user = null;
        this.token = localStorage.getItem('auth_token');
        this.clientId = '639252232066-hfue1haicnfpqn65qgrcpsgr5muh6uic.apps.googleusercontent.com';
        this.initGoogleAuth();
    }

    initGoogleAuth() {
        // Check if Google script is already loaded
        if (window.google) {
            this.initializeGoogle();
        } else {
            // Load Google API client
            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            script.async = true;
            script.defer = true;
            script.onload = () => this.initializeGoogle();
            document.head.appendChild(script);
        }
    }

    initializeGoogle() {
        try {
            google.accounts.id.initialize({
                client_id: this.clientId,
                callback: this.handleGoogleSignIn.bind(this)
            });
            
            // Render the button
            google.accounts.id.renderButton(
                document.getElementById("g_id_signin"),
                { 
                    type: 'standard',
                    theme: 'outline',
                    size: 'medium',
                    text: 'sign_in_with',
                    shape: 'rectangular',
                    logo_alignment: 'left'
                }
            );
            
            console.log('Google Sign-In initialized successfully');
        } catch (error) {
            console.error('Error initializing Google Sign-In:', error);
        }
    }

    async handleGoogleSignIn(response) {
        console.log('Google Sign-In response:', response);
        try {
            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: response.credential })
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.detail || 'Authentication failed');
            }

            const data = await res.json();
            this.setAuth(data);
            return data;
        } catch (error) {
            console.error('Google sign-in error:', error);
            throw error;
        }
    }

    // ... rest of your AuthService methods ...
}

// Initialize auth service
const authService = new AuthService();