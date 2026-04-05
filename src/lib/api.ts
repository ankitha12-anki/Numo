const API_BASE_URL = 'http://127.0.0.1:8000/api';

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...((options.headers as any) || {}),
  };

  const url = `${API_BASE_URL}${endpoint}`;
  console.log(`Fetching: ${url}`, options);

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });
    console.log(`Response Status: ${response.status}`);
    
    if (response.status === 401) {
      localStorage.removeItem('token');
    }
    return response;
  } catch (error) {
    console.error('Fetch Error:', error);
    throw error;
  }
};

export const authApi = {
  login: (data: any) => apiFetch('/auth/login/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  register: (data: any) => apiFetch('/auth/register/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  forgotPassword: (email: string) => apiFetch('/auth/forgot-password/', {
    method: 'POST',
    body: JSON.stringify({ email }),
  }),
  verifyOtp: (email: string, otp_code: string) => apiFetch('/auth/verify-otp/', {
    method: 'POST',
    body: JSON.stringify({ email, otp_code }),
  }),
  resetPassword: (data: any) => apiFetch('/auth/reset-password/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

export const calculatorApi = {
  calculate: (expression: string) => apiFetch('/calculate/', {
    method: 'POST',
    body: JSON.stringify({ expression }),
  }),
  getHistory: () => apiFetch('/history/', {
    method: 'GET',
  }),
  saveHistory: (expression: string, result: string) => apiFetch('/history/', {
    method: 'POST',
    body: JSON.stringify({ expression, result }),
  }),
  deleteHistory: (id?: number) => apiFetch(`/history/${id ? `?id=${id}` : ''}`, {
    method: 'DELETE',
  }),
};
