let userService;

class UserService {
    currentUser = {};

    constructor()
    {
        this.loadUser();
        this.setupAxiosInterceptors(); // ✅ NEW: Setup interceptors
    }

    // ✅ NEW: Setup Axios interceptors for better error handling
    setupAxiosInterceptors() {
        // Request interceptor to add auth token to all requests
        axios.interceptors.request.use(
            (config) => {
                if (this.currentUser.token) {
                    config.headers.Authorization = `Bearer ${this.currentUser.token}`;
                }
                console.log('🔍 Request:', config.method?.toUpperCase(), config.url);
                return config;
            },
            (error) => {
                console.error('❌ Request Error:', error);
                return Promise.reject(error);
            }
        );

        // Response interceptor for better error handling
        axios.interceptors.response.use(
            (response) => {
                console.log('✅ Response:', response.status, response.config.url);
                return response;
            },
            (error) => {
                console.error('❌ Response Error:', {
                    message: error.message,
                    status: error.response?.status,
                    url: error.config?.url,
                    response: error.response?.data
                });

                // If we get a 401, the token might be expired
                if (error.response && error.response.status === 401) {
                    console.log('🔓 Token expired, logging out...');
                    this.logout();
                }

                return Promise.reject(error);
            }
        );
    }

    getHeader()
    {
        if(this.currentUser.token) {
            return {
                    'Authorization': `Bearer ${this.currentUser.token}`
            };
        }

        return {};
    }

    saveUser(user)
    {
        this.currentUser = {
            token: user.token,
            userId: user.user.id,
            username: user.user.username,
            role: user.user.authorities[0].name
        }
        localStorage.setItem('user', JSON.stringify(this.currentUser));
        
        // ✅ Set default headers immediately after saving user
        this.updateAxiosDefaults();
        console.log('👤 User logged in:', this.currentUser.username);
    }

    loadUser()
    {
        const user = localStorage.getItem('user');
        if(user)
        {
            this.currentUser = JSON.parse(user);
            this.updateAxiosDefaults();
            console.log('👤 User loaded from storage:', this.currentUser.username);
        }
    }

    // ✅ NEW: Method to update axios default headers
    updateAxiosDefaults() {
        if (this.currentUser.token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${this.currentUser.token}`;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    }

    getHeaders()
    {
        const headers = {
            'Content-Type': 'application/json'
        }

        if(this.currentUser.token)
        {
            headers.Authorization = `Bearer ${this.currentUser.token}`;
        }

        return headers;
    }

    getUserName()
    {
        return this.isLoggedIn() ? this.currentUser.username : '';
    }

    isLoggedIn()
    {
        return this.currentUser.token !== undefined;
    }

    getCurrentUser()
    {
        return this.currentUser;
    }

    setHeaderLogin()
    {
        const user = {
                username: this.getUserName(),
                loggedin: this.isLoggedIn(),
                loggedout: !this.isLoggedIn()
            };

        templateBuilder.build('header', user, 'header-user');
    }

    register (username, password, confirm)
    {
        const url = `${config.baseUrl}/register`;
        const register = {
            username: username,
            password: password,
            confirmPassword: confirm,
            role: 'USER'
        };

        return axios.post(url, register)
             .then(response => {
                 console.log('✅ Registration successful:', response.data)
                 return response.data;
             })
            .catch(error => {
                console.error('❌ Registration failed:', error);
                const data = {
                    error: "User registration failed."
                };
                templateBuilder.append("error", data, "errors");
                throw error;
            });
    }

    login (username, password)
    {
        const url = `${config.baseUrl}/login`;
        const login = {
            username: username,
            password: password
        };

        return axios.post(url, login)
            .then(response => {
                this.saveUser(response.data);
                this.setHeaderLogin();
                productService.enableButtons();
                cartService.loadCart();
                return response.data;
            })
            .catch(error => {
                console.error('❌ Login failed:', error);
                const data = {
                    error: "Login failed."
                };
                templateBuilder.append("error", data, "errors");
                throw error;
            });
    }

    logout()
    {
        localStorage.removeItem('user');
        this.currentUser = {};
        this.updateAxiosDefaults();

        this.setHeaderLogin();
        productService.enableButtons();
        
        // Clear cart on logout
        if (cartService) {
            cartService.cart = { items: [], total: 0 };
            cartService.updateCartDisplay();
        }
        
        console.log('🔓 User logged out');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    userService = new UserService();
    userService.setHeaderLogin();
});