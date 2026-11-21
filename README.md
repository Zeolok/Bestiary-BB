# Bestiário de Bloodborne

## Tema escolhido

Sistema de gerenciamento de criaturas inspirado no universo
de Bloodborne (videogame), desenvolvido para fins acadêmicos.

## Como executar

### Pré-requisitos

- Node.js
- MySQL Server
- MySQL Workbench
- Git ou GitHub Desktop

1. Clone o repositório.
2. Abra a pasta do projeto no Visual Studio Code.
3. Execute `npm install` no terminal.
4. Execute o arquivo script.sql no MySQL Workbench para criar o banco de dados, as tabelas e os registros iniciais.
5. Crie um arquivo .env na raiz do projeto utilizando o .env.example como modelo.
6. Configure as variáveis de ambiente conforme suas credenciais do MySQL:

`.env`
- DB_HOST=localhost
- DB_USER=root
- DB_PASSWORD=[sua_senha]
- DB_NAME=bdnode
- PORT=3000

7. Execute `npm start` no terminal do VS Code.

## Nome do Integrante [Individual]

- Gabriel Bettini Morato

## Acesso

http://localhost:3000