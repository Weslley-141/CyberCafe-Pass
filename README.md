# 🔐 CyberCafe Pass

Um gerenciador de senhas desktop desenvolvido com **Electron**, criado para organizar credenciais de forma prática, centralizada e com uma interface própria.

O projeto nasceu de uma ideia simples: senhas fazem parte da rotina de praticamente qualquer pessoa que utiliza serviços digitais, e ter uma forma organizada de armazená-las pode tornar o gerenciamento dessas credenciais muito mais simples.

Além de resolver um problema prático, o CyberCafe Pass também explora o desenvolvimento de aplicações desktop utilizando tecnologias web e recursos nativos disponibilizados pelo Electron.

---

## 🎯 Objetivo

O CyberCafe Pass tem como objetivo oferecer uma aplicação desktop dedicada ao gerenciamento de senhas e credenciais.

A proposta é reunir informações que normalmente ficam espalhadas entre anotações, arquivos ou diferentes serviços em uma interface única, permitindo consultar, organizar e administrar essas credenciais de maneira mais conveniente.

O projeto também serve como exploração prática de conceitos importantes no desenvolvimento desktop, como:

- Comunicação entre processos.
- Integração entre interface web e recursos nativos.
- Armazenamento local.
- Gerenciamento de janelas.
- Segurança na comunicação entre processos.
- Organização de uma aplicação Electron.

---

## ✨ Funcionalidades

### 🔐 Gerenciamento de credenciais

O aplicativo foi desenvolvido para centralizar informações de acesso em uma interface dedicada.

Entre as operações disponíveis estão:

- Cadastro de credenciais.
- Visualização dos registros armazenados.
- Organização das informações de acesso.
- Edição de registros.
- Exclusão de registros.
- Consulta das credenciais diretamente pela aplicação.

### 🖥️ Aplicação desktop

Por utilizar Electron, o CyberCafe Pass funciona como uma aplicação desktop independente, utilizando tecnologias web para construir sua interface.

A aplicação possui:

- Janela própria.
- Controles personalizados de janela.
- Inicialização através do processo principal do Electron.
- Comunicação controlada entre a interface e o processo principal.

### 🔒 Comunicação entre processos

A aplicação utiliza um processo `preload` como ponte entre a interface e os recursos disponibilizados pelo Electron.

A configuração utiliza:

- `contextIsolation: true`
- `nodeIntegration: false`

Dessa forma, a interface não acessa diretamente as APIs do Node.js, mantendo as operações do processo principal separadas da camada visual.

---

## 🛠️ Tecnologias

- **Electron** — desenvolvimento da aplicação desktop.
- **Node.js** — execução do processo principal e acesso às APIs do sistema.
- **JavaScript** — lógica da aplicação e comunicação entre processos.
- **HTML5** — estrutura da interface.
- **CSS3** — estilização e identidade visual.
- **electron-vite** — fluxo de desenvolvimento e build da aplicação.

---

## 🏗️ Arquitetura da aplicação

O CyberCafe Pass utiliza a arquitetura de processos do Electron para separar a interface das operações executadas pelo processo principal.

### Processo principal — `main.js`

Responsável pelo gerenciamento da aplicação desktop e pelas operações que precisam de acesso às APIs do Electron/Node.js.

Entre suas responsabilidades estão:

- Inicializar a aplicação.
- Criar e gerenciar a janela principal.
- Controlar o ciclo de vida da aplicação.
- Disponibilizar operações para a interface através do IPC.
- Gerenciar recursos que não devem ser executados diretamente no renderer.

### Ponte segura — `preload.js`

O `preload.js` funciona como uma camada intermediária entre o processo principal e a interface.

A aplicação utiliza `contextBridge` e `ipcRenderer` para expor somente as operações necessárias ao frontend.

Essa abordagem evita disponibilizar diretamente o ambiente Node.js para a interface.

### Interface — Renderer

A camada de interface é responsável pela apresentação visual e pela interação com o usuário.

Ela utiliza as APIs disponibilizadas pelo `preload.js` para solicitar operações ao processo principal, mantendo a separação entre apresentação e recursos nativos.

---

## 🔐 Segurança

Como o objetivo da aplicação é trabalhar com credenciais, segurança é uma preocupação importante no projeto.

A arquitetura Electron foi configurada para reduzir a exposição da interface aos recursos do processo principal:

```text
Renderer
   │
   │ API controlada
   ▼
Preload
   │
   │ IPC
   ▼
Main Process
   │
   └── Recursos do sistema
```

Entre as configurações utilizadas estão:

- `contextIsolation: true`
- `nodeIntegration: false`
- Uso de `preload.js` como ponte controlada.
- Separação entre interface e processo principal.

> **Importante:** o CyberCafe Pass é um projeto pessoal e não deve ser considerado uma solução de segurança profissional ou substituto de um gerenciador de senhas auditado. O projeto está em desenvolvimento e pode receber melhorias futuras relacionadas à proteção e ao armazenamento das credenciais.

---

## 📂 Estrutura do projeto

A estrutura principal segue a organização tradicional de uma aplicação Electron:

```text
cybercafe-pass/
│
├── main.js              # Processo principal do Electron
├── preload.js           # Ponte segura entre processos
├── index.html           # Interface da aplicação
│
├── src/                 # Código da interface
│
├── package.json         # Configuração e dependências
├── package-lock.json    # Versões exatas das dependências
├── electron.vite.config.*
└── README.md            # Documentação do projeto
```

> A estrutura interna pode evoluir conforme novas funcionalidades forem adicionadas ao projeto.

---

## 💻 Como executar

### Pré-requisitos

- **Node.js 22 LTS**
- **npm**
- Git

O projeto atualmente utiliza **Node.js 22 LTS** como ambiente recomendado.

### Instalação

Clone o repositório:

```bash
git clone https://github.com/Weslley-141/cybercafe-pass.git
cd cybercafe-pass
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

## ⚙️ Scripts

Os principais comandos utilizados durante o desenvolvimento são:

```bash
npm run dev
```

Inicia a aplicação em modo de desenvolvimento.

```bash
npm run build
```

Gera a versão de produção da aplicação, conforme a configuração do projeto.

> Os scripts disponíveis podem ser consultados diretamente no `package.json`.

---

## 🧠 Decisões técnicas

### Por que Electron?

O Electron permite utilizar tecnologias web já conhecidas no desenvolvimento de uma aplicação desktop, ao mesmo tempo em que disponibiliza APIs para integração com o sistema operacional.

Para este projeto, isso permite combinar:

```text
HTML + CSS + JavaScript
          │
          ▼
       Electron
          │
          ▼
   Aplicação Desktop
```

### Por que utilizar `preload`?

Em vez de disponibilizar diretamente as APIs do Node.js para a interface, o projeto utiliza um `preload.js` para controlar quais operações podem ser acessadas pelo renderer.

Isso proporciona uma separação mais clara entre:

- Interface.
- Comunicação IPC.
- Processo principal.
- Recursos do sistema.

---

## 🚧 Estado do projeto

O CyberCafe Pass está em desenvolvimento.

A aplicação já possui sua estrutura desktop funcionando e uma base preparada para o gerenciamento das credenciais. Novas funcionalidades e melhorias de segurança podem ser adicionadas conforme o projeto evolui.

Possíveis melhorias futuras incluem:

- Melhorias na proteção das credenciais.
- Sistema de busca e filtros.
- Categorias para diferentes tipos de contas.
- Geração de senhas fortes.
- Melhorias na experiência de edição e visualização.
- Empacotamento para distribuição.
- Testes automatizados.
- Refinamento da arquitetura de armazenamento.

---

## 👨‍💻 Autor

**Weslley Eugênio**

GitHub: [@Weslley-141](https://github.com/Weslley-141)
