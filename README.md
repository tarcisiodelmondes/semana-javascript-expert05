# Google Drive Clone - Semana JS Expert 5.0

Esse projeto foi desenvolvido durante a semana JavaScript Expert 5

<a href="#features">Features</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
<a href="#desafios">Desafios</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
<a href="#demonstracao">Demonstração</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
<a href="#pre-requisitos">Pré-requisitos</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
<a href="#creditos">Créditos ao Layout</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
<a href="#tecnologias">Tecnologias</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
<a href="#projeto">Projeto</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp

## Preview

![](./resources/demo.gif)

<a id="features"></a>

## Features

- Web API

  - [x] Deve listar arquivos baixados
  - [x] Deve receber stream de arquivos e salvar em disco
  - [x] Deve notificar sobre progresso de armazenamento de arquivos em disco
  - [x] Deve permitir upload de arquivos em formato image, video ou audio
  - [x] Deve atingir 100% de cobertura de código em testes

- Web App

  - [x] Deve listar arquivos baixados
  - [x] Deve permitir fazer upload de arquivos de qualquer tamanho
  - [x] Deve ter função de upload via botão
  - [x] Deve exibir progresso de upload
  - [x] Deve ter função de upload via drag and drop

<a id="desafios"></a>

## Desafios

- Wev API

  - [ ] Salvar arquivos na AWS usando o S3 + Lambda
  - [ ] Implementar testes para novas funcionalidades

- Web App
  - [ ] Implementar testes com 100% coverage

<a id="demonstracao"></a>

## Demonstração da aplicação

Acesse: [https://gdriver-front-js.herokuapp.com/](https://gdriver-front-js.herokuapp.com/)

<a id="pre-requisitos"></a>

## Pré-requisitos

Antes de começar, você vai precisar ter instalado em sua máquina:

- Git
- Node v16 ou superior
- NPM ou YARN

### Executando o Gdriver

```bash
# Clone este repositório
$ git clone https://github.com/tarcisiodelmondes/semana-javascript-expert05.git

# Acesse a pasta do projeto no terminal/cmd
$ cd semana-javascript-expert05

# API

  # Entre na pasta da API
  $ cd gdriver-webapi

  # Instale as dependências
  $ npm install

  # Depois inicie a API
  $ npm run start

# Web
  # Abra outro termina na pasta semana-javascript-expert05
  # Entre na pasta do front-end
  $ cd gdriver-webapp

  # Instale as dependências
  $ npm install

  # No app.js troque a URL da variavel API_URL
  # para https://0.0.0.0:3000/ salve o arquivo

  # Depois inicie o front-end em mode de desenvolvimento
  $ npm run dev
```

<a id="creditos"></a>

## Créditos ao Layout <3

- O Layout foi adaptado a partir do projeto do brasileiro [Leonardo Santo](https://github.com/leoespsanto) disponibilizado no [codepen](https://codepen.io/leoespsanto/pen/KZMMKG).

<a id="tecnologias"></a>

## 🚀 Tecnologias

Esse projeto foi desenvolvido com as seguintes tecnologias:

- JavaScript
- Node
- Html
- CSS
- <p>Socket.io</p>

<a id="projeto"></a>

## 💻 Projeto

O GDriver é uma aplicação similar ao Google Driver onde os usuários podem salvar seus arquivos na nuvem.

---

Feito com ♥ by Tarcisio Delmondes :wave: [Me siga no linkedin](https://www.linkedin.com/in/tarcisio-delmondes/)
