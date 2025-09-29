import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { turmaService, TurmaFormData } from "@/services/turmaService";
import { toast } from "sonner";
import { Turma } from "@/types";
import { useEffect } from "react";

const turmaSchema = z.object({
  nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  descricao: z.string().min(1, "Descrição é obrigatória"),
});

type TurmaFormValues = z.infer<typeof turmaSchema>;

interface TurmaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  turma?: Turma;
  onSuccess: () => void;
}

export function TurmaDialog({ open, onOpenChange, turma, onSuccess }: TurmaDialogProps) {
  const form = useForm<TurmaFormValues>({
    resolver: zodResolver(turmaSchema),
    defaultValues: {
      nome: "",
      descricao: "",
    },
  });

  useEffect(() => {
    if (turma) {
      form.reset({
        nome: turma.nome,
        descricao: turma.descricao,
      });
    } else {
      form.reset({
        nome: "",
        descricao: "",
      });
    }
  }, [turma, form]);

  const onSubmit = async (data: TurmaFormValues) => {
    try {
      const formData: TurmaFormData = {
        nome: data.nome,
        descricao: data.descricao,
      };

      if (turma) {
        await turmaService.update(turma.id, formData);
        toast.success("Turma atualizada com sucesso!");
      } else {
        await turmaService.create(formData);
        toast.success("Turma cadastrada com sucesso!");
      }
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao salvar turma");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{turma ? "Editar Turma" : "Nova Turma"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome da turma" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descrição da turma" 
                      rows={4}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                {turma ? "Atualizar" : "Cadastrar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
