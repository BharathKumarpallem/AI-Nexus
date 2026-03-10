const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const request = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, config);
    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.detail || 'API request failed');
    }
    return response.json();
};

export const login = (data) => {
    const formData = new URLSearchParams();
    formData.append('username', data.username);
    formData.append('password', data.password);

    return request('/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString()
    });
};

export const register = (data) => request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data)
});

export const generateOtp = (data) => request('/auth/generate-otp', {
    method: 'POST',
    body: JSON.stringify(data)
});

export const getHistory = () => request('/chat/history');

export const sendChat = (data) => request('/chat/', {
    method: 'POST',
    body: JSON.stringify(data)
});

export const getWeather = (lat, lon) => {
    const params = (lat && lon) ? `?lat=${lat}&lon=${lon}` : '';
    return request(`/weather${params}`);
};

export const generateImage = (prompt) => request(`/generate-image?prompt=${encodeURIComponent(prompt)}`, {
    method: 'POST'
});

export const searchImages = (query) => request(`/search-images?query=${encodeURIComponent(query)}`);

export const googleLogin = (data) => request('/auth/google-login', {
    method: 'POST',
    body: JSON.stringify(data)
});

export const githubLogin = (data) => request('/auth/github-login', {
    method: 'POST',
    body: JSON.stringify(data)
});
