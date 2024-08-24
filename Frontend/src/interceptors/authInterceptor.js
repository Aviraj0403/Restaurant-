import axios from 'axios';

// Configure request interceptor
axios.interceptors.request.use(
  req => {
    const user = localStorage.getItem('user');
    const token = user && JSON.parse(user).token;
    if (token) {
      req.headers['access_token'] = token; // Ensure header name matches what server expects
    }
    return req;
  },
  error => Promise.reject(error)
);


export default axios;
