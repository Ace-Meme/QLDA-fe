/**
 * Decode JWT token to get user information
 * @returns {Object|null} Decoded token data or null if no token exists
 */
export const getTokenData = () => {
    // Try to get token from sessionStorage first
    let token = sessionStorage.getItem('token');
    
    // If not found in sessionStorage, try localStorage
    if (!token) {
        token = localStorage.getItem('token');
    }
    
    if (!token) {
        return null;
    }
    
    try {
        // Get the payload part of the JWT token (second part)
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (err) {
        console.error('Error decoding token:', err);
        return null;
    }
};
