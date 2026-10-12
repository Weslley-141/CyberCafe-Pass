# 🔐 CyberCafe Pass

> **Gerenciador de senhas local com abordagem Zero-Knowledge e visual Cozy Cyberpunk.**

O **CyberCafe Pass** é uma aplicação desktop desenvolvida para armazenar e organizar credenciais de forma local, combinando uma interface moderna com uma arquitetura baseada em **Electron + React + TypeScript**.

O projeto nasceu de uma necessidade prática: ter um gerenciador de senhas próprio, local e sob controle do usuário, enquanto explora conceitos de desenvolvimento desktop, comunicação entre processos e segurança em aplicações Electron.

A proposta visual combina uma estética **Cozy Cyberpunk**, utilizando tons escuros, tipografia monoespaçada e elementos de interface inspirados em tecnologia e ambientes digitais.

---

## 🎯 Objetivos

O CyberCafe Pass foi criado com três objetivos principais:

- Criar um gerenciador de credenciais desktop próprio.
- Explorar o desenvolvimento de aplicações desktop utilizando tecnologias web.
- Estudar e aplicar boas práticas de arquitetura e segurança no Electron.

Além da aplicação em si, o projeto serve como um laboratório prático para conceitos como:

- Arquitetura Main / Preload / Renderer.
- Comunicação IPC.
- Isolamento entre interface e processo principal.
- Gerenciamento de estado.
- Armazenamento local.
- Tipagem estática com TypeScript.
- Build e distribuição de aplicações Electron.
- Organização de projetos modernos com Vite.

---

## ✨ Principais características

### 🔐 Gerenciamento de credenciais

A aplicação foi desenvolvida para centralizar informações de acesso em uma interface dedicada.

O fluxo da aplicação contempla operações como:

- Cadastro de credenciais.
- Visualização de registros.
- Edição de informações.
- Exclusão de registros.
- Organização dos dados dentro da aplicação.

### 🖥️ Aplicação desktop

O CyberCafe Pass utiliza Electron para transformar a aplicação web em um aplicativo desktop.

Isso permite combinar:

- React para a interface.
- TypeScript para tipagem e organização do código.
- Electron para integração com recursos nativos.
- Vite para desenvolvimento e build.
- Electron Builder para empacotamento.

### 🎨 Cozy Cyberpunk

A interface foi pensada para fugir do visual tradicional de aplicações de gerenciamento de senhas.

A identidade visual combina:

- Tema escuro.
- Elementos inspirados em cyberpunk.
- Tipografia `JetBrains Mono`.
- Tipografia `Quicksand`.
- Ícones com Lucide React.
- Interface construída com Tailwind CSS.

A ideia é criar uma aplicação que seja funcional sem abrir mão de personalidade visual.

---

## 🔒 Segurança e arquitetura Electron

Como o projeto trabalha com credenciais, a segurança faz parte da arquitetura desde a camada de comunicação entre os processos.

O Electron separa a aplicação em diferentes contextos:

```text
┌──────────────────────────────┐
│          Renderer            │
│      React / Interface       │
└──────────────┬───────────────┘
               │
               │ API controlada
               ▼
┌──────────────────────────────┐
│           Preload            │
│   Ponte entre os processos   │
└──────────────┬───────────────┘
               │
               │ IPC
               ▼
┌──────────────────────────────┐
│        Main Process          │
│       Electron / Node        │
└──────────────────────────────┘
```

A aplicação utiliza uma configuração de Electron que mantém o ambiente Node separado da interface, incluindo:

- `contextIsolation: true`
- `nodeIntegration: false`
- API exposta através do processo `preload`
- Comunicação entre processos utilizando IPC

Essa separação reduz a superfície de acesso da interface e evita disponibilizar diretamente as APIs do Node.js ao renderer.

### Zero-Knowledge

O projeto adota uma abordagem **local e Zero-Knowledge**, buscando manter os dados do usuário sob controle da própria aplicação, sem depender de um serviço remoto para armazenar as credenciais.

> **Importante:** o CyberCafe Pass é um projeto pessoal e está em desenvolvimento. Ele não deve ser considerado uma solução de segurança profissional ou substituir gerenciadores de senhas amplamente auditados.

---

## 🏗️ Arquitetura

A aplicação segue a arquitetura de processos do Electron combinada com uma interface React.

### Main Process

Responsável pelas operações que precisam de acesso ao ambiente Electron/Node.js e pelo ciclo de vida da aplicação desktop.

### Preload

Funciona como uma camada intermediária entre o renderer e o processo principal.

O objetivo é expor somente as operações necessárias para a interface, evitando acesso direto do frontend às APIs do Node.js.

### Renderer

É a camada responsável pela interface da aplicação.

Construída com React + TypeScript, ela concentra os componentes visuais, interações e gerenciamento do estado da aplicação.

---

## 🛠️ Stack

### Desktop

- **Electron**
- **Electron Builder**
- **electron-vite**

### Frontend

- **React**
- **TypeScript**
- **Tailwind CSS**
- **Vite**
- **Lucide React**

### Estado e dados

- **Zustand**

### Qualidade e testes

- **ESLint**
- **Prettier**
- **TypeScript**
- **Vitest**

### Tipografia

- **JetBrains Mono**
- **Quicksand**

---

## 📂 Estrutura do projeto

A estrutura principal do repositório é organizada da seguinte maneira:

```text
CyberCafe-Pass/
│
├── .vscode/                  # Configurações e recomendações do VS Code
├── resources/                # Recursos utilizados pela aplicação
├── src/                      # Código principal da aplicação
├── types/                    # Tipagens compartilhadas
│
├── .editorconfig             # Padronização do editor
├── .gitignore                # Arquivos ignorados pelo Git
├── .prettierignore           # Exclusões do Prettier
├── .prettierrc.yaml          # Configuração do Prettier
│
├── electron-builder.yml      # Configuração do empacotamento
├── electron.vite.config.ts   # Configuração do Electron-Vite
├── eslint.config.mjs         # Configuração do ESLint
│
├── package.json              # Dependências e scripts
├── package-lock.json         # Lockfile do npm
│
├── tsconfig.json             # Configuração base do TypeScript
├── tsconfig.node.json        # Configuração TypeScript para Node/Electron
├── tsconfig.web.json         # Configuração TypeScript para o frontend
│
└── README.md                 # Documentação
```

Arquivos de configuração como `tsconfig.*`, ESLint, Prettier, Electron-Vite e Electron Builder fazem parte do fluxo normal de desenvolvimento e distribuição da aplicação.

---

## 💻 Requisitos

Antes de executar o projeto, tenha instalado:

- **Node.js 22 LTS**
- **npm**
- **Git**

> O projeto utiliza atualmente Node.js 22 LTS como ambiente recomendado para desenvolvimento.

---

## 🚀 Instalação

Clone o repositório e entre na pasta do projeto:

```bash
git clone https://github.com/Weslley-141/CyberCafe-Pass.git
cd CyberCafe-Pass
```

Instale as dependências:

```bash
npm install
```

Inicie o ambiente de desenvolvimento:

```bash
npm run dev
```

---

## ⚙️ Scripts disponíveis

### Desenvolvimento

```bash
npm run dev
```

Inicia a aplicação em modo de desenvolvimento através do Electron-Vite.

### Preview

```bash
npm run start
```

Inicia a aplicação utilizando o build existente em modo de preview.

### Build

```bash
npm run build
```

Executa a verificação de tipos e gera o build da aplicação.

### TypeScript

```bash
npm run typecheck
```

Executa as verificações de tipos para os ambientes Node/Electron e Web.

Também é possível executar cada verificação separadamente:

```bash
npm run typecheck:node
npm run typecheck:web
```

### Lint

```bash
npm run lint
```

Executa o ESLint no projeto.

### Formatação

```bash
npm run format
```

Formata os arquivos utilizando Prettier.

### Testes

```bash
npm run test
```

Executa os testes automatizados através do Vitest.

### Build sem empacotamento final

```bash
npm run build:unpack
```

Gera o build e prepara uma versão não empacotada através do Electron Builder.

### Build para Windows

```bash
npm run build:win
```

### Build para macOS

```bash
npm run build:mac
```

### Build para Linux

```bash
npm run build:linux
```

---

## 🧠 Decisões técnicas

### Por que Electron?

O Electron permite utilizar tecnologias web modernas para construir uma aplicação desktop multiplataforma.

Para o CyberCafe Pass, isso permite combinar:

```text
React + TypeScript
        │
        ▼
      Vite
        │
        ▼
     Electron
        │
        ▼
Aplicação Desktop
```

A escolha também permite estudar conceitos que não aparecem da mesma forma em aplicações web tradicionais, como processos separados, IPC, preload e integração com o sistema operacional.

### Por que React?

React oferece uma arquitetura baseada em componentes que facilita a organização da interface e permite que diferentes partes da aplicação evoluam de forma independente.

### Por que TypeScript?

Como o projeto trabalha com diferentes camadas — renderer, preload e main process — a tipagem ajuda a manter contratos mais claros entre elas e reduz erros durante o desenvolvimento.

### Por que Zustand?

O Zustand foi escolhido para gerenciamento de estado por ser simples, leve e adequado para controlar o estado compartilhado da interface sem adicionar uma camada excessivamente complexa à aplicação.

### Por que Vite?

O Vite fornece um ciclo de desenvolvimento rápido e integra-se diretamente ao fluxo utilizado pelo electron-vite.

---

## 🚧 Estado atual

O CyberCafe Pass está em desenvolvimento.

A estrutura principal da aplicação desktop já está estabelecida, incluindo o ambiente Electron, frontend React/TypeScript, gerenciamento de estado, configuração de build e ferramentas de qualidade.

O projeto continua evoluindo conforme novas funcionalidades, melhorias de UX e decisões relacionadas à proteção dos dados são implementadas.

### Próximos passos

Algumas áreas que podem receber melhorias futuras:

- Refinamento da proteção das credenciais.
- Melhorias na experiência de gerenciamento.
- Busca e filtros.
- Categorias de credenciais.
- Geração de senhas fortes.
- Melhorias de UX/UI.
- Expansão dos testes automatizados.
- Refinamento do armazenamento local.
- Empacotamento e distribuição das versões finais.

---

## ⚠️ Aviso

O CyberCafe Pass é um **projeto pessoal e experimental**.

Apesar de utilizar práticas de segurança importantes na arquitetura Electron, ele não passou por uma auditoria de segurança independente e não deve ser utilizado como substituto de um gerenciador de senhas profissional para armazenar credenciais críticas.

O projeto existe principalmente como uma aplicação funcional e como estudo prático de desenvolvimento desktop, arquitetura, segurança e engenharia de software.

---

## 👨‍💻 Autor

**Weslley-141**

**CyberCafe Pass** é um projeto autoral desenvolvido para transformar uma necessidade real em uma aplicação própria e explorar novas tecnologias fora do desenvolvimento web tradicional.
