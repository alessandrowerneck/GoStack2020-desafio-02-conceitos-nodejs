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

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  }

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
  console.log(`id : [${id}]`);
  if (likes) {
    console.log(`Manually update likes is NOT permitted!-> Likes Sent [${likes}]`);
    console.log(`Repository ID [${id}] likes amount [${likes}]`);
    console.log(`Repository Title [${repositoryLikes.title}]`);
    console.log(`Repository URL [${repositoryLikes.url}]`);
    console.log(`Repository TECHS [${repositoryLikes.techs}]`);
    console.log(`Repository Likes [${repositoryLikes.likes}]`);
    console.log('____________;')
    // const likesContent = `${repositoryLikes.likes}`;
    return response
      .status(400)
      // .json('likes:0');
      // .json(likesContent);
      .json(repositoryLikes);
      // .json([
      //     {message: `Manually update likes is NOT permitted! -> Likes Sent [${likes}]`}, 
      //     repositoryLikes
      //   ]);
  }



  //caso o id nao seja encontrado na lista de repositorios
  if (repositoryIndex < 0) {
    console.log(`Could not Update!  Repository not Found! -> ID: [${id}]`);
    console.log('____________');
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

  console.log(`id : [${ id }]`);

  //procurando indice do repositorio solicitado na lista de repositorios
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  //caso o id nao seja encontrado na lista de repositorios
  if (repositoryIndex < 0) {
    console.log(`Could not Delete!  Repository not Found! -> ID: [${id}]`);
    console.log('____________');
    return response
      .status(400)
      .json({ error: `Repository not found! -> ID: [${id}]`});
  }

  //deletar o id da minha lista de repositorios
  console.log(`Tamanho Lista Repositorios: [${repositories.length}]`);
  repositories.splice(repositoryIndex, 1);
  console.log(`Tamanho Lista Depois de Deletar: [${repositories.length}]`);

  //retornar mensagem de sucesso apos deletar repositorio informado
  console.log(`Repository deleted! -> ID: [${id}]`);
  console.log('____________');
  return response
    .status(204)
    .json({ message: `Repository deleted! -> ID: [${id}]`});

});

app.post("/repositories/:id/like", (request, response) => {
  const { id } =  request.params;

  // console.log(`id : [${ id }]`);
  // console.log(`repositories[0].id : [${ repositories[0].id }]`);

  //procurando o repositorio solicitado na lista de repositorios
  const repository = repositories.find(repository => repository.id === id);

  // Acredito que o erro aqui é que se o repository nao existe, 
  // é justamente porque nao foi encontrado em repositories, 
  // e por isso nao foi nem inicializado
  // por isso, quando faz o if pedindo pra ler o id da variavel 
  // que nem foi inicializada ainda, da o erro de 500
  // if (repository.id !== id) {
  //   // console.log(`repository.id : [${ repository.id }]`);
  //   return response.status(400).json({message : 'Repository not found  with ID'})
  // }

  //caso o repositorio nao seja encontrado na lista de repositorios
  if (!repository) {
    // return response.status(400).send();
    return response
      .status(400)
      .json({ message: `Repository not found! -> ID: [${id}]`});
  }

  //atualizando likes para o repositorio informado
  repository.likes += 1;

  return response.json(repository);
});

module.exports = app;
