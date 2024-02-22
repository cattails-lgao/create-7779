import http from '@/utils/http';

export const login = () => http.post('/login');
