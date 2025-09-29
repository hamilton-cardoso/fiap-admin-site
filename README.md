# Sistema FIAP - Gestão Administrativa

Sistema administrativo para gestão de alunos, turmas e matrículas da FIAP.

## Tecnologias Utilizadas

- **Vite** - Build tool e dev server
- **TypeScript** - Linguagem de programação
- **React** - Framework frontend
- **shadcn-ui** - Biblioteca de componentes
- **Tailwind CSS** - Framework CSS

## Como executar o projeto

### Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone <URL_DO_SEU_REPOSITORIO>

# Navegue até o diretório do projeto
cd fiap-admin-site

# Instale as dependências
npm install

# Execute o projeto em modo de desenvolvimento
npm run dev
```

O projeto estará disponível em `http://localhost:8080`

## Scripts Disponíveis

- `npm run dev` - Executa o projeto em modo de desenvolvimento
- `npm run build` - Gera o build de produção
- `npm run build:dev` - Gera o build em modo de desenvolvimento
- `npm run lint` - Executa o linter
- `npm run preview` - Visualiza o build de produção

## Estrutura do Projeto

```
src/
├── components/     # Componentes React
├── hooks/         # Custom hooks
├── lib/           # Utilitários e configurações
├── pages/         # Páginas da aplicação
├── services/      # Serviços de API
└── types/         # Definições de tipos TypeScript
```

## Deploy

Para fazer o deploy do projeto, execute:

```bash
npm run build
```

Os arquivos de produção serão gerados na pasta `dist/`.