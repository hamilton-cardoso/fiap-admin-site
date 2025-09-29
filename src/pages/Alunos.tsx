import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { alunoService } from "@/services/alunoService";
import { AlunoDialog } from "@/components/alunos/AlunoDialog";
import { DeleteDialog } from "@/components/shared/DeleteDialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination } from "@/components/shared/Pagination";
import { toast } from "sonner";
import { Aluno } from "@/types";

export default function Alunos() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAluno, setSelectedAluno] = useState<Aluno | undefined>();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['alunos', page, search],
    queryFn: () => alunoService.getAll(page, 10, search),
  });

  const handleEdit = (aluno: Aluno) => {
    setSelectedAluno(aluno);
    setIsDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedAluno) return;
    try {
      await alunoService.delete(selectedAluno.id);
      toast.success("Aluno excluído com sucesso!");
      refetch();
      setIsDeleteDialogOpen(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao excluir aluno");
    }
  };

  const openDeleteDialog = (aluno: Aluno) => {
    setSelectedAluno(aluno);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div>
      <PageHeader
        title="Alunos"
        description="Gerencie os alunos cadastrados no sistema"
        action={
          <Button onClick={() => { setSelectedAluno(undefined); setIsDialogOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Aluno
          </Button>
        }
      />
      <div className="container mx-auto px-6 py-8">
        <div className="mb-6">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>CPF</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Data de Nascimento</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Carregando...
                  </TableCell>
                </TableRow>
              ) : data?.items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Nenhum aluno encontrado
                  </TableCell>
                </TableRow>
              ) : (
                data?.items.map((aluno) => (
                  <TableRow key={aluno.id}>
                    <TableCell className="font-medium">{aluno.nome}</TableCell>
                    <TableCell>{aluno.cpf}</TableCell>
                    <TableCell>{aluno.email}</TableCell>
                    <TableCell>{new Date(aluno.dataNascimento).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(aluno)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(aluno)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {data && data.totalPages > 1 && (
          <div className="mt-4">
            <Pagination
              currentPage={page}
              totalPages={data.totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>

      <AlunoDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        aluno={selectedAluno}
        onSuccess={refetch}
      />

      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Excluir Aluno"
        description={`Tem certeza que deseja excluir o aluno ${selectedAluno?.nome}?`}
      />
    </div>
  );
}
