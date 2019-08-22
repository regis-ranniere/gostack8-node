/*
Carrega o módulo do express;
Para instalação do express utilize o comando: 
yarn add express
*/
const express = require("express");

//Inicia a instância do express.
const server = express();

//Define que o servidor irá ler o corpo da requisição como json
server.use(express.json());

//Define a porta que a aplicação irá ser executada.
server.listen(3001);

//Query Params = ?username=rannie
server.get("/get/byquery", (request, response) => {
  const username = request.query.username;

  const helloMessage = `Hello my friend ${username}`;
  return response.json({ message: helloMessage });
});

//Route Params = /users/1
server.get("/get/byroute/users/:username", (request, response) => {
  const { username } = request.params;

  const helloMessage = `Hello my friend ${username}`;
  return response.json({ message: helloMessage });
});

//Obtendo um GET simples respondendo um json
server.get("/get/simple", (request, response) => {
  return response.json({ message: "Hello Word" });
});

//Request body = {"id": "1", "username" = "ranniere" }
//CRUD BÁSICO DE USUARIOS - CREATE READ UPDATE DELETE
const users = ["Vanessa", "Ranniere", "Cecília"];

//GET ALL
server.get("/users", (request, response) => {
  return response.json(users);
});

//GET BY INDEX
server.get("/users/:index", checkExistsUser, (request, response) => {
  const helloMessage = `Hello my friend ${request.user}`;

  return response.json({ message: helloMessage });
});

//GET BY USERNAME
server.get("/users/user/:username", (request, response) => {
  const { username } = request.params;
  const indexUser = users.find(x => x === username);

  const helloMessage = `Hello my friend index ${indexUser}`;

  return response.json({ message: helloMessage });
});

//CREATE USER
server.post("/users", checkUserExists, (request, response) => {
  const { username } = request.body;
  users.push(username);
  return response.json(users);
});

//UPDATE USER
server.put("/users/:index", checkExistsUser, (request, response) => {
  const { index } = request.params;
  const { username } = request.body;

  users[index] = username;

  return response.json(users);
});

//DELETE USER
server.delete("/users/:index", checkExistsUser, (request, response) => {
  const { index } = request.params;

  users.splice(index, 1);

  return response.send();
});

//Middleware GLOBAL - Será executado em todas as chamadas a API
server.use((req, res, next) => {
  //Inicia a contagem de tempo da execução do evento chamado
  console.time("Request");

  console.log(`Método: ${req.method} | URL: ${req.url}`);

  //Continua a execução do pipeline indo para a rota
  next();
  //return next(); Continua a execução do pipeline e finaliza a execução do middleware

  //Será executado após a execução da chamada Next();
  console.timeEnd("Request");
});

//Middleware LOCAL - Será executado nas rotas que for injetado
function checkUserExists(req, res, next) {
  //Verifica se o usuário existe no body da aplicação;
  //Caso não exista ele retornar um error;
  if (!req.body.username) {
    return res.status(400).json({ error: "Incorrect Body" });
  }

  //Continua o pipeline
  return next();
}

function checkExistsUser(req, res, next) {
  const user = users[req.params.index];

  if (!user) {
    return res.status(400).json({ error: "User not found" });
  }

  //Alterando a requisição do usuário;
  req.user = user;

  return next();
}
