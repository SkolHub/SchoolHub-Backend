import api from "../api";

export function getOrganizations(): Promise<any> {
    return api.get('/api/organization');
}

export function getOrganizationClasses(id: number): Promise<any> {
    return api.get(`/api/organization/${id}/classes`);
}

export function createOrganization(payload: { name: string }): Promise<any> {
    return api.post('/api/organization', payload);
}

export function updateOrganization(id: number, payload: { name: string }): Promise<any> {
    return api.put(`/api/organization/${id}`, payload);
}

export function deleteOrganization(id: number): Promise<any> {
    return api.delete(`/api/organization/${id}`);
}