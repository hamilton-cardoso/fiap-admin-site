export interface Aluno {
  id: string;
  nome: string;
  dataNascimento: string;
  cpf: string;
  email: string;
  createdAt: string;
}

export interface Turma {
  id: string;
  nome: string;
  descricao: string;
  alunosCount: number;
  createdAt: string;
}

export interface Matricula {
  alunoId: string;
  turmaId: string;
  aluno?: Aluno;
  turma?: Turma;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
