import { api } from '@/lib/api';
import { Turma, PaginatedResponse } from '@/types';

export interface TurmaFormData {
  nome: string;
  descricao: string;
}

export const turmaService = {
  async getAll(page = 1, pageSize = 10): Promise<PaginatedResponse<Turma>> {
    const response = await api.get<PaginatedResponse<Turma>>('/turmas', {
      params: { page, pageSize },
    });
    return response.data;
  },

  async getById(id: string): Promise<Turma> {
    const response = await api.get<Turma>(`/turmas/${id}`);
    return response.data;
  },

  async create(data: TurmaFormData): Promise<Turma> {
    const response = await api.post<Turma>('/turmas', data);
    return response.data;
  },

  async update(id: string, data: Partial<TurmaFormData>): Promise<Turma> {
    const response = await api.put<Turma>(`/turmas/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/turmas/${id}`);
  },
};
