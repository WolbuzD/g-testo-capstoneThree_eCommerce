const config = {
    baseUrl: 'http://localhost:8080',
    debug: true // ✅ Enable debug mode
}

// ✅ Debug helper function
function debugLog(message, data = null) {
    if (config.debug) {
        console.log(`🔍 [DEBUG] ${message}`, data || '');
    }
}

// ✅ Test server connectivity
function testServerConnection() {
    console.log('🔗 Testing server connection...');
    console.log('Backend URL:', config.baseUrl);

    // Test basic connectivity
    fetch(`${config.baseUrl}/categories`)
        .then(response => {
            if (response.ok) {
                console.log('✅ Server is reachable - Status:', response.status);
                return response.json();
            } else {
                throw new Error(`Server responded with status: ${response.status}`);
            }
        })
        .then(data => {
            console.log('✅ Categories endpoint working - Found', data.length, 'categories');
        })
        .catch(error => {
            console.error('❌ Server connection failed:', error);
            if (error.message.includes('fetch')) {
                console.error('🚨 SOLUTION: Make sure your backend server is running on port 8080');
                console.error('🚨 Run: cd capstone-backend-starter && mvn spring-boot:run');
            }
        });
}

// ✅ Test authentication endpoints
function testAuthEndpoints() {
    console.log('🔐 Testing authentication endpoints...');

    // Test login endpoint with invalid credentials (should get 401)
    fetch(`${config.baseUrl}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: 'test',
            password: 'invalid'
        })
    })
    .then(response => {
        console.log('🔐 Login endpoint responding - Status:', response.status);
        if (response.status === 401) {
            console.log('✅ Authentication is working (401 for invalid credentials)');
        }
    })
    .catch(error => {
        console.error('❌ Login endpoint failed:', error);
    });
}

// ✅ Auto-test connection when page loads
document.addEventListener('DOMContentLoaded', () => {
    if (config.debug) {
        setTimeout(() => {
            testServerConnection();
            testAuthEndpoints();
        }, 1000);
    }
});