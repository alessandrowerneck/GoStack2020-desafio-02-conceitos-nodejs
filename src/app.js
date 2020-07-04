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

  //creating new instance of repository, with given params
  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  }

  //updating the repositories' array with the new created repository
  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;
  const { likes } = request.body;

  //looking for requested repository's index on repositories' array
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  
  //lookin for requested repository on repositories' array
  //just to ensure that the 'likes params'
  //wasn't updated manually
  const repositoryLikes = repositories.find(repository => repository.id === id);
 
  //case any 'likes params' was found on put event
  //immediatelly stop the flow and return the message
  //alerting that is not permitted to update the 'likes params' manually
  if (likes) {
    return response
      .status(400)
      .json(repositoryLikes);
  }

  //in case of requested repository wasn't found on repositories' array
  if (repositoryIndex < 0) {
    return response
      .status(400)
      .json({ error: `Repository not found! -> ID: [${id}]`});
  }

  //creating new instance of repository, with given params to change it
  const repository = {
    id,
    title, 
    url, 
    techs,
  };

  //updating requested repository on repositories'array
  repositories[repositoryIndex] = repository;

  return response.status(200).json(repository);

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  //looking for requested repository on repositories'array
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  //in case of requested repository wasn't found on repositories'array
  if (repositoryIndex < 0) {

    return response
      .status(400)
      .json({ error: `Repository not found! -> ID: [${id}]`});
  }

  //delete requested repository from repositories' array
  repositories.splice(repositoryIndex, 1);

  //return success message after delete requested repository
  return response
    .status(204)
    .json({ message: `Repository deleted! -> ID: [${id}]`});

});

app.post("/repositories/:id/like", (request, response) => {
  const { id } =  request.params;

  //looking for requested repository on repositories' array
  const repository = repositories.find(repository => repository.id === id);

  //in case of requested repository wasn't found on repositories' array
  if (!repository) {
    return response
      .status(400)
      .json({ message: `Repository not found! -> ID: [${id}]`});
  }

  //updating 'likes params' for the requested repository
  repository.likes += 1;

  return response.json(repository);
});

module.exports = app;
