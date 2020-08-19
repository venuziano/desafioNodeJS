const express = require('express');
const cors = require('cors');
const { v4, validate } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

//GET /repositories: Rota que lista todos os repositórios;
app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

/*POST /repositories: A rota deve receber title, url e techs dentro do corpo da requisição, sendo a URL o link para o github desse repositório. 
  Ao cadastrar um novo projeto, ele deve ser armazenado dentro de um objeto no seguinte formato: { id: "uuid", title: 'Desafio Node.js', 
  url: 'http://github.com/...', techs: ["Node.js", "..."], likes: 0 }; Certifique-se que o ID seja um UUID, e de sempre iniciar os likes como 0.*/
app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: v4(),
    url,
    title,
    techs,
    likes: 0,
  };

  repositories.push(repository);
  
  return response.json(repository);
});

//PUT /repositories/:id: A rota deve alterar apenas o title, a url e as techs do repositório que possua o id igual ao id presente nos parâmetros da rota;
app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs, likes } = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.'})
  }

  const repository = {
    id,
    title,
    url,
    techs,
    likes,
  }

  if (repository.likes === 0) {
    repositories[repositoryIndex] = repository;

    return response.json(repository);
  } else {
    repository.likes = 0;
    repositories[repositoryIndex] = repository;

    return response.json(repository);
  }
});

//DELETE /repositories/:id: A rota deve deletar o repositório com o id presente nos parâmetros da rota;
app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.'})
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

/*POST /repositories/:id/like: A rota deve aumentar o número de likes do repositório específico escolhido através do id presente nos parâmetros da rota, 
a cada chamada dessa rota, o número de likes deve ser aumentado em 1;*/
app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repository = repositories.find(repository => repository.id === id);
  
  if (repository === undefined) {
    return response.status(400).json({ error: 'Repository not found.'})
  }

  const sumLike = {
    id,
    url: repository.url,
    title: repository.title,
    techs: repository.techs,
    likes: (repository.likes += 1)
  };

  return response.json(sumLike);
});

module.exports = app;
