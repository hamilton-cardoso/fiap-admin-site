import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { alunoService, AlunoFormData } from "@/services/alunoService";
import { toast } from "sonner";
import { Aluno } from "@/types";
import { useEffect } from "react";

const alunoSchema = z.object({
  nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  dataNascimento: z.string().min(1, "Data de nascimento é obrigatória"),
  cpf: z.string().regex(/^\d{11}$/, "CPF deve ter 11 dígitos"),
  email: z.string().email("E-mail inválido"),
  senha: z.string()
    .min(8, "Senha deve ter no mínimo 8 caracteres")
    .regex(/[A-Z]/, "Senha deve conter ao menos uma letra maiúscula")
    .regex(/[a-z]/, "Senha deve conter ao menos uma letra minúscula")
    .regex(/[0-9]/, "Senha deve conter ao menos um número")
    .regex(/[^A-Za-z0-9]/, "Senha deve conter ao menos um caractere especial")
    .optional()
    .or(z.literal("")),
});

type AlunoFormValues = z.infer<typeof alunoSchema>;

interface AlunoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  aluno?: Aluno;
  onSuccess: () => void;
}

export function AlunoDialog({ open, onOpenChange, aluno, onSuccess }: AlunoDialogProps) {
  const form = useForm<AlunoFormValues>({
    resolver: zodResolver(alunoSchema),
    defaultValues: {
      nome: "",
      dataNascimento: "",
      cpf: "",
      email: "",
      senha: "",
    },
  });

  useEffect(() => {
    if (aluno) {
      form.reset({
        nome: aluno.nome,
        dataNascimento: aluno.dataNascimento.split('T')[0],
        cpf: aluno.cpf,
        email: aluno.email,
        senha: "",
      });
    } else {
      form.reset({
        nome: "",
        dataNascimento: "",
        cpf: "",
        email: "",
        senha: "",
      });
    }
  }, [aluno, form]);

  const onSubmit = async (data: AlunoFormValues) => {
    try {
      const formData: AlunoFormData = {
        nome: data.nome,
        dataNascimento: data.dataNascimento,
        cpf: data.cpf,
        email: data.email,
        senha: data.senha || undefined,
      };

      if (aluno) {
        await alunoService.update(aluno.id, formData);
        toast.success("Aluno atualizado com sucesso!");
      } else {
        await alunoService.create(formData);
        toast.success("Aluno cadastrado com sucesso!");
      }
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || error.response?.data?.message || "Erro ao salvar aluno";
      toast.error(errorMessage);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{aluno ? "Editar Aluno" : "Novo Aluno"}</DialogTitle>
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
                    <Input placeholder="Nome completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dataNascimento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Nascimento</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cpf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPF</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="12345678900" 
                      maxLength={11} 
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="aluno@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="senha"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{aluno ? "Nova Senha (opcional)" : "Senha"}</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
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
                {aluno ? "Atualizar" : "Cadastrar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
