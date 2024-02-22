import http from '@/utils/http';

export const getMenu = () => http.get('/getAsyncRoutes');
