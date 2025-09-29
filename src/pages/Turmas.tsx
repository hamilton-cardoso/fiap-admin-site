import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Users } from "lucide-react";
import { turmaService } from "@/services/turmaService";
import { TurmaDialog } from "@/components/turmas/TurmaDialog";
import { DeleteDialog } from "@/components/shared/DeleteDialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination } from "@/components/shared/Pagination";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Turma } from "@/types";

export default function Turmas() {
  const [page, setPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTurma, setSelectedTurma] = useState<Turma | undefined>();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['turmas', page],
    queryFn: () => turmaService.getAll(page, 10),
  });

  const handleEdit = (turma: Turma) => {
    setSelectedTurma(turma);
    setIsDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedTurma) return;
    try {
      await turmaService.delete(selectedTurma.id);
      toast.success("Turma excluída com sucesso!");
      refetch();
      setIsDeleteDialogOpen(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao excluir turma");
    }
  };

  const openDeleteDialog = (turma: Turma) => {
    setSelectedTurma(turma);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div>
      <PageHeader
        title="Turmas"
        description="Gerencie as turmas cadastradas no sistema"
        action={
          <Button onClick={() => { setSelectedTurma(undefined); setIsDialogOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Turma
          </Button>
        }
      />
      <div className="container mx-auto px-6 py-8">
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Alunos</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    Carregando...
                  </TableCell>
                </TableRow>
              ) : data?.items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    Nenhuma turma encontrada
                  </TableCell>
                </TableRow>
              ) : (
                data?.items.map((turma) => (
                  <TableRow key={turma.id}>
                    <TableCell className="font-medium">{turma.nome}</TableCell>
                    <TableCell className="max-w-md truncate">{turma.descricao}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="gap-1">
                        <Users className="h-3 w-3" />
                        {turma.alunosCount || 0}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(turma)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(turma)}>
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

      <TurmaDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        turma={selectedTurma}
        onSuccess={refetch}
      />

      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Excluir Turma"
        description={`Tem certeza que deseja excluir a turma ${selectedTurma?.nome}?`}
      />
    </div>
  );
}
