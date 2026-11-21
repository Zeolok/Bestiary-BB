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
2. Execute `npm install`.
3. Utilize o MySQL Workbench para criar o banco de dados `bdnode`.
4. Crie e configure as variáveis do arquivo `.env` na raiz do projeto:

`.env`
- DB_HOST=localhost
- DB_USER=root
- DB_PASSWORD=[sua_senha]
- DB_NAME=bdnode
- PORT=3000

5. Configure o banco de dados MySQL.
6. Crie as tabelas e insira os atributos para preencher as colunas.
7. Execute `npm start` no terminal do VS Code.

## Nome do Integrante [Individual]

- Gabriel Bettini Morato

## Acesso

http://localhost:3000