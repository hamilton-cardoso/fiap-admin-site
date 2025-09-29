import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, UserPlus, TrendingUp } from "lucide-react";
import { alunoService } from "@/services/alunoService";
import { turmaService } from "@/services/turmaService";

export default function Dashboard() {
  const { data: alunos } = useQuery({
    queryKey: ['alunos-count'],
    queryFn: () => alunoService.getAll(1, 1),
  });

  const { data: turmas } = useQuery({
    queryKey: ['turmas-count'],
    queryFn: () => turmaService.getAll(1, 1),
  });

  const stats = [
    {
      title: "Total de Alunos",
      value: alunos?.total || 0,
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Total de Turmas",
      value: turmas?.total || 0,
      icon: BookOpen,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      title: "Matrículas Ativas",
      value: "Em breve",
      icon: UserPlus,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Taxa de Ocupação",
      value: "Em breve",
      icon: TrendingUp,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Visão geral do sistema administrativo"
      />
      <div className="container mx-auto px-6 py-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`${stat.bgColor} p-2 rounded-lg`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Bem-vindo ao Sistema FIAP</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Gerencie alunos, turmas e matrículas de forma simples e eficiente.
                Use o menu lateral para navegar entre as diferentes seções do sistema.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                • Cadastrar novo aluno<br />
                • Criar nova turma<br />
                • Realizar matrícula<br />
                • Visualizar relatórios
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
