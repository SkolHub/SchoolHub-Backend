import api from "../api";

export function getAccount(): Promise<any> {
    return api.get('/api/account');
}

export function login(payload: { email?: string, username?: string, password: string }): Promise<any> {
    return api.post('/api/auth/login', payload);
}

export function register(payload: { username: string, password: string, email: string, firstName: string, lastName: string }): Promise<any> {
    return api.post('/api/auth/register', payload);
}