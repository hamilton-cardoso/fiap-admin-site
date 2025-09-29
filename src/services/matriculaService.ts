import { api } from '@/lib/api';
import { Matricula, Aluno, PaginatedResponse } from '@/types';

export interface MatriculaFormData {
  alunoId: string;
  turmaId: string;
}

export const matriculaService = {
  async create(data: MatriculaFormData): Promise<Matricula> {
    const response = await api.post<Matricula>('/matriculas', data);
    return response.data;
  },

  async getAlunosByTurma(turmaId: string, page = 1, pageSize = 10): Promise<PaginatedResponse<Aluno>> {
    const response = await api.get<PaginatedResponse<Aluno>>(`/matriculas/turma/${turmaId}/alunos`, {
      params: { page, pageSize }
    });
    return response.data;
  },

  async delete(alunoId: string, turmaId: string): Promise<void> {
    await api.delete(`/matriculas/${alunoId}/${turmaId}`);
  },
};
