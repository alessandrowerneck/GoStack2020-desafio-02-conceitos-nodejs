const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  //criando uma nova instancia do repositorio, com os dados informados 
  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  }

  //atualizando o array de repositorios com o novo repositorio criado
  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;
  const { likes } = request.body;

  //procurando indice do repositorio solicitado na lista de repositorios
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  
  //procurando o repositorio solicitado na lista de repositorios
  //apenas para garantir 
  //que sua quantidade de likes nao foi alterada manualmente
  const repositoryLikes = repositories.find(repository => repository.id === id);
 
  //caso seja enviado o campo likes no evento de put, 
  //já interrompe fluxo e retorna informando que 
  // nao se pode atualizar os likes manualmente
  if (likes) {
    return response
      .status(400)
      .json(repositoryLikes);
  }

  //caso o id nao seja encontrado na lista de repositorios
  if (repositoryIndex < 0) {
    return response
      .status(400)
      .json({ error: `Repository not found! -> ID: [${id}]`});
  }

  //criando uma nova instancia do repositorio, com os dados informados 
  const repository = {
    id,
    title, 
    url, 
    techs,
  };

  //atualizando repositorio informado na lista de repositorios 
  repositories[repositoryIndex] = repository;

  return response.status(200).json(repository);

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  //procurando indice do repositorio solicitado na lista de repositorios
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  //caso o id nao seja encontrado na lista de repositorios
  if (repositoryIndex < 0) {

    return response
      .status(400)
      .json({ error: `Repository not found! -> ID: [${id}]`});
  }

  //deletar o id da lista de repositorios
  repositories.splice(repositoryIndex, 1);

  //retornar mensagem de sucesso apos deletar repositorio informado
  return response
    .status(204)
    .json({ message: `Repository deleted! -> ID: [${id}]`});

});

app.post("/repositories/:id/like", (request, response) => {
  const { id } =  request.params;

  //procurando o repositorio solicitado na lista de repositorios
  const repository = repositories.find(repository => repository.id === id);

  //caso o repositorio nao seja encontrado na lista de repositorios
  if (!repository) {
    return response
      .status(400)
      .json({ message: `Repository not found! -> ID: [${id}]`});
  }

  //atualizando likes para o repositorio informado
  repository.likes += 1;

  return response.json(repository);
});

module.exports = app;
