# Portfy - Gerador de Portfolios

> Projeto em desenvolvimento. A versao publicada e um prototipo funcional e ainda nao representa o produto final.

O Portfy e um builder web para criar sites de portfolio interativos e personalizaveis. O usuario organiza suas informacoes profissionais, escolhe uma identidade visual e acompanha o resultado em um site completo e responsivo.

Nesta primeira fase, a experiencia e os quatro templates disponiveis sao voltados para desenvolvedores. A proposta e ampliar as opcoes para esse publico e, futuramente, atender outras areas profissionais, como design, audiovisual e fotografia.

## Demonstracao

Acesse a versao atual publicada no GitHub Pages:

[wendell-ramos.github.io/GeradorPortfolios](https://wendell-ramos.github.io/GeradorPortfolios/)

## Templates disponiveis

- **Desktop retro:** transforma as secoes em atalhos e janelas de uma interface inspirada em sistemas operacionais antigos.
- **Terminal:** apresenta o portfolio como uma experiencia de linha de comando, com comandos e navegacao proprios.
- **Landing page interativa:** organiza o conteudo em uma narrativa visual, com projetos em destaque, metricas e movimento.
- **Docs moderno:** estrutura as informacoes como uma documentacao tecnica, com navegacao lateral e leitura organizada.

Cada template possui configuracoes especificas. Elementos que fazem sentido no Desktop, por exemplo, nao sao exibidos como controles do Terminal.

## Funcionalidades atuais

- Inicio com dados de exemplo ou preenchimento do zero
- Fluxo guiado dividido em seis etapas
- Cadastro de identidade, apresentacao e experiencias profissionais
- Upload opcional de foto de perfil
- Inclusao opcional de curriculo em PDF
- Cadastro e organizacao de stack, projetos e contatos
- Upload de imagens de capa para projetos
- Links para projeto publicado e repositorio
- Contatos predefinidos com icones das principais redes sociais
- Ativacao, desativacao e reordenacao de secoes
- Criacao de secoes personalizadas
- Personalizacao de cor principal, fundo e areas compativeis
- Configuracoes proprias para cada template
- Pre-visualizacoes durante o preenchimento
- Visualizacao completa do portfolio gerado
- Layout responsivo no builder e nos quatro templates
- Salvamento automatico do rascunho no navegador com IndexedDB

## Fluxo do builder

1. **Identidade:** informacoes principais, apresentacao, experiencias, foto e curriculo.
2. **Estilo:** escolha e personalizacao do template.
3. **Secoes:** definicao da estrutura e da ordem do portfolio.
4. **Projetos:** cadastro dos trabalhos, capas, tecnologias e links.
5. **Contato:** selecao e configuracao das redes sociais.
6. **Visualizacao:** abertura do site gerado para navegacao e revisao.

O rascunho e salvo automaticamente no proprio dispositivo. Ao retornar, o usuario pode continuar de onde parou ou sair para escolher novamente entre dados de exemplo e preenchimento manual.

## Estado atual

O projeto funciona inteiramente no navegador e ainda esta em evolucao. Nesta fase:

- Nao existem contas ou autenticacao de usuarios
- Nao ha banco de dados ou backend remoto
- O rascunho fica armazenado localmente no navegador e nao e sincronizado entre dispositivos
- Ainda nao existe exportacao, hospedagem ou publicacao automatica do portfolio criado
- O foco atual esta em portfolios para desenvolvedores
- Templates e controles de personalizacao continuam sendo refinados

## Proximos passos

- Ampliar as possibilidades de personalizacao dos templates atuais
- Criar novos estilos voltados para desenvolvedores
- Realizar testes com usuarios e aprimorar o fluxo com base no uso real
- Preparar a base para contas, projetos salvos e persistencia remota
- Permitir exportar ou publicar o site criado
- Adicionar templates proprios para outras areas profissionais

## Tecnologias

- React 19
- TypeScript
- Vite
- CSS
- IndexedDB
- Lucide React
- Manrope e Space Grotesk
- Oxlint
- GitHub Pages

## Executar localmente

Requisitos: Node.js e npm.

```bash
git clone https://github.com/wendell-ramos/GeradorPortfolios.git
cd GeradorPortfolios
npm install
npm run dev
```

Acesse o endereco informado pelo Vite no terminal, normalmente `http://localhost:5173/`.

## Validacao

```bash
npm run lint
npm run build
```

## Contribuicao e feedback

O Portfy ainda passa por mudancas frequentes de interface e experiencia. Sugestoes, testes e relatos de problemas sao bem-vindos durante o desenvolvimento.
