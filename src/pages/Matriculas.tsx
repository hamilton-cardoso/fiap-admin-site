import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { MatriculaDialog } from "@/components/matriculas/MatriculaDialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { turmaService } from "@/services/turmaService";
import { matriculaService } from "@/services/matriculaService";
import { Badge } from "@/components/ui/badge";

export default function Matriculas() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTurmaId, setSelectedTurmaId] = useState<string>("");

  const { data: turmas } = useQuery({
    queryKey: ['turmas-all'],
    queryFn: () => turmaService.getAll(1, 100),
  });

  const { data: alunos, refetch } = useQuery({
    queryKey: ['alunos-turma', selectedTurmaId],
    queryFn: () => matriculaService.getAlunosByTurma(selectedTurmaId),
    enabled: !!selectedTurmaId,
  });

  return (
    <div>
      <PageHeader
        title="Matrículas"
        description="Gerencie as matrículas de alunos nas turmas"
        action={
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Matrícula
          </Button>
        }
      />
      <div className="container mx-auto px-6 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Visualizar Alunos por Turma</CardTitle>
            <CardDescription>
              Selecione uma turma para visualizar os alunos matriculados
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={selectedTurmaId} onValueChange={setSelectedTurmaId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma turma" />
              </SelectTrigger>
              <SelectContent>
                {turmas?.items.map((turma) => (
                  <SelectItem key={turma.id} value={turma.id}>
                    {turma.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedTurmaId && (
              <div className="space-y-2">
                <h3 className="font-semibold text-sm text-muted-foreground">
                  Alunos Matriculados ({alunos?.items.length || 0})
                </h3>
                <div className="space-y-2">
                  {alunos?.items && alunos.items.length > 0 ? (
                    alunos.items.map((aluno) => (
                      <div
                        key={aluno.id}
                        className="flex items-center justify-between p-3 border rounded-lg bg-card"
                      >
                        <div>
                          <p className="font-medium">{aluno.nome}</p>
                          <p className="text-sm text-muted-foreground">{aluno.email}</p>
                        </div>
                        <Badge variant="secondary">{aluno.cpf}</Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Nenhum aluno matriculado nesta turma
                    </p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <MatriculaDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={refetch}
      />
    </div>
  );
}
