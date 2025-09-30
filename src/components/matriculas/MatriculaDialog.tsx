import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { matriculaService } from "@/services/matriculaService";
import { alunoService } from "@/services/alunoService";
import { turmaService } from "@/services/turmaService";
import { toast } from "sonner";

const matriculaSchema = z.object({
  alunoId: z.string().min(1, "Selecione um aluno"),
  turmaId: z.string().min(1, "Selecione uma turma"),
});

type MatriculaFormValues = z.infer<typeof matriculaSchema>;

interface MatriculaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function MatriculaDialog({ open, onOpenChange, onSuccess }: MatriculaDialogProps) {
  const form = useForm<MatriculaFormValues>({
    resolver: zodResolver(matriculaSchema),
    defaultValues: {
      alunoId: "",
      turmaId: "",
    },
  });

  const { data: alunos } = useQuery({
    queryKey: ['alunos-select'],
    queryFn: () => alunoService.getAll(1, 100),
  });

  const { data: turmas } = useQuery({
    queryKey: ['turmas-select'],
    queryFn: () => turmaService.getAll(1, 100),
  });

  const onSubmit = async (data: MatriculaFormValues) => {
    try {
      await matriculaService.create({
        alunoId: data.alunoId,
        turmaId: data.turmaId,
      });
      toast.success("Matrícula realizada com sucesso!");
      onSuccess();
      onOpenChange(false);
      form.reset();
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || error.response?.data?.message || "Erro ao realizar matrícula";
      toast.error(errorMessage);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nova Matrícula</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="alunoId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Aluno</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um aluno" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {alunos?.items.map((aluno) => (
                        <SelectItem key={aluno.id} value={aluno.id}>
                          {aluno.nome} - {aluno.cpf}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="turmaId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Turma</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma turma" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {turmas?.items.map((turma) => (
                        <SelectItem key={turma.id} value={turma.id}>
                          {turma.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">Matricular</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
