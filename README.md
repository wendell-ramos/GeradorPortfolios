# Gerador de Portfolios

> Projeto em desenvolvimento. Esta versao e um prototipo funcional e ainda nao representa o produto final.

Aplicacao web para criar portfolios interativos e personalizaveis. A primeira fase do projeto esta concentrada em portfolios para desenvolvedores, permitindo organizar informacoes profissionais e experimentar diferentes formas de apresentar o mesmo conteudo.

## Demonstracao

A versao atual pode ser acessada em:

[wendell-ramos.github.io/GeradorPortfolios](https://wendell-ramos.github.io/GeradorPortfolios/)

## Objetivo

O objetivo e evoluir o projeto para uma plataforma em que cada pessoa possa montar seu proprio site de portfolio, escolher as secoes que deseja utilizar, personalizar o visual e gerar uma experiencia adequada a sua area profissional.

O desenvolvimento esta sendo feito por etapas. Primeiro sera consolidada a experiencia para desenvolvedores; depois, novos segmentos como design e producao audiovisual poderao receber estruturas e templates proprios.

## O que ja funciona

- Inicio com dados de exemplo ou preenchimento manual
- Cadastro da identidade e do resumo profissional
- Cadastro e organizacao de experiencias
- Configuracao de stack, projetos e contatos
- Upload de foto de perfil e capas de projetos
- Secoes configuraveis e secoes personalizadas
- Cores globais e personalizacao visual por area
- Template Desktop retro
- Template Terminal hacker com comandos interativos
- Template Docs moderno com navegacao propria
- Visualizacao completa e responsiva do site gerado

## Estado atual

A aplicacao ainda funciona como um prototipo no navegador. Nesta fase:

- Os dados nao sao salvos em banco de dados
- Nao existem contas ou autenticacao de usuarios
- O preenchimento pode ser perdido ao atualizar a pagina
- Ainda nao ha exportacao ou publicacao automatica do portfolio criado
- Os templates e controles de personalizacao continuam sendo aprimorados
- O foco atual esta somente em portfolios para desenvolvedores

## Proximos passos

- Refinar os templates e a experiencia de personalizacao
- Melhorar a montagem e edicao das secoes
- Criar persistencia de dados e CRUD
- Permitir salvar e continuar um portfolio posteriormente
- Gerar ou publicar o site criado pelo usuario
- Adicionar novos segmentos profissionais com templates proprios
- Realizar testes com usuarios e ajustar o fluxo com base no uso real

## Tecnologias

- React
- TypeScript
- Vite
- CSS
- Oxlint
- GitHub Actions e GitHub Pages

## Executar localmente

```bash
npm install
npm run dev
```

Acesse `http://127.0.0.1:5173/` no navegador.

## Validacao

```bash
npm run lint
npm run build
```

## Contribuicao

O projeto ainda esta passando por mudancas frequentes de estrutura e experiencia. Sugestoes, testes e relatos de problemas sao bem-vindos durante o desenvolvimento.
