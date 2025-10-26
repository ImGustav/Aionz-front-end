# Projeto AIONZ - Front-end (Angular)

[![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Material](https://img.shields.io/badge/Material--UI-0081CB?style=for-the-badge&logo=material-ui&logoColor=white)](https://material.angular.io/)
[![RxJS](https://img.shields.io/badge/RxJS-B7178C?style=for-the-badge&logo=reactivex&logoColor=white)](https://rxjs.dev/)

Este repositório contém o código-fonte do front-end da Avaliação Prática para Vaga Júnior Full Stack.

Construída com **Angular** e **Angular Material**, esta aplicação consome a API RESTful do back-end (NestJS) para fornecer uma interface de usuário completa para o gerenciamento de produtos e categorias.

## Funcionalidades

* **Arquitetura Standalone:** Utiliza a arquitetura moderna de componentes standalone do Angular.
* **CRUD de Produtos:** Interface completa para Criar, Ler, Atualizar e Deletar produtos, utilizando um modal reutilizável (`MatDialog`).
* **Paginação e Busca (Server-Side):** A lista de produtos é paginada e filtrada, com as consultas sendo executadas no back-end para máxima performance.
* **Lazy Loading:** As rotas de produtos são carregadas sob demanda (`loadChildren`), resultando em um carregamento inicial mais rápido.
* **SEO Básico:** As rotas de detalhes do produto (`/produtos/:id`) atualizam dinamicamente as meta tags (`<title>`, `og:image`, etc.) para melhor indexação e compartilhamento em redes sociais.
* **Notificações:** Feedback ao usuário para ações de sucesso ou erro, utilizando o `MatSnackBar`.
* **Formatação de Código:** O projeto está configurado com o Prettier para garantir um padrão de código consistente.

## Visão Geral 

<img src="./public/sys.gif" alt="Gif da aplicação Angular rodando" width="800"/>

## Tecnologias Utilizadas

* **Angular 17+**: Framework front-end moderno baseado em TypeScript.
* **Angular Material**: Biblioteca de componentes de UI do Google.
* **TypeScript**: Superconjunto tipado de JavaScript.
* **SCSS**: Pré-processador CSS para estilos mais organizados.
* **RxJS**: Para programação reativa e gerenciamento de streams de dados (ex: `debounceTime` na busca).
* **Prettier**: Formatador de código para manter a consistência.

## Pré-requisitos (Back-end)

Para que esta aplicação funcione, **a API do back-end deve estar em execução**.

Por favor, siga as instruções de instalação no [README do Back-end](https://github.com/ImGustav/Aionz-back-end) e garanta que o servidor esteja rodando (padrão: `http://localhost:3000`).

## Instalação e Execução (Local)

Siga os passos abaixo para configurar e rodar o projeto em sua máquina local:

1.  **Clone o Repositório:**
    ```bash
    git clone https://github.com/ImGustav/Aionz-front-end
    ```

2.  **Instale as Dependências:**
    ```bash
    npm install
    ```

3.  **Configuração do Ambiente:**

    Verifique o arquivo `src/environments/environment.ts` e garanta que a `apiBaseUrl` aponta para o seu back-end:

    ```typescript
    // src/environments/environment.ts
    export const environment = {
      production: false,
      apiBaseUrl: 'http://localhost:3000' 
    };
    ```

4.  **Inicie o Servidor de Desenvolvimento:**
    ```bash
    npm start
    # ou
    ng serve
    ```
    A aplicação estará disponível em `http://localhost:4200`.

## Formatação de Código

Este projeto usa o **Prettier** para padronização. Para formatar todos os arquivos, rode:

```bash
npm run format
```

## Autor

**Gustavo Henrique Carvalho**
* **Email:** [oakhenry2@gmail.com](mailto:oakhenry2@gmail.com)
* **LinkedIn:** [gustavo-oak](https://www.linkedin.com/in/gustavo-oak/)