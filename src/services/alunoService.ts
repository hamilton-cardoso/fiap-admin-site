import { api } from '@/lib/api';
import { Aluno, PaginatedResponse } from '@/types';

export interface AlunoFormData {
  nome: string;
  dataNascimento: string;
  cpf: string;
  email: string;
  senha?: string;
}

export const alunoService = {
  async getAll(page = 1, pageSize = 10, search = ''): Promise<PaginatedResponse<Aluno>> {
    const response = await api.get<PaginatedResponse<Aluno>>('/alunos', {
      params: { 
        page, 
        pageSize, 
        q: search 
      },
    });
    return response.data;
  },

  async getById(id: string): Promise<Aluno> {
    const response = await api.get<Aluno>(`/alunos/${id}`);
    return response.data;
  },

  async create(data: AlunoFormData): Promise<Aluno> {
    const response = await api.post<Aluno>('/alunos', data);
    return response.data;
  },

  async update(id: string, data: Partial<AlunoFormData>): Promise<Aluno> {
    const response = await api.put<Aluno>(`/alunos/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/alunos/${id}`);
  },
};
