const express = require("express");

const server = express();

server.use(express.json());

const projects = [];
let requests = 0;

server.use((req, res, next) => {
  console.time("Request");
  console.log(`Métode: ${req.method}; URL: ${req.url};`);

  next();

  console.timeEnd("Request");
});

// Verifica quando o usuário faz uma requisição e encrementa o contador de requisições
function requestsCount(req, res, next) {
  requests++;

  console.log(`Contagem de equisições: ${requests}`);

  return next();
}

server.use(requestsCount);

// Verificar se o usuário informou um título
function checkProjectExists(req, res, next) {
  if (!req.body.title) {
    return res.status(400).json({ error: "Title is required" });
  }

  return next();
}

// Verificar se o projeto existe
function checkProjectInArray(req, res, next) {
  const { index } = req.params;

  console.log(projects);

  if (!projects.find(p => p.id == index)) {
    return res.status(400).json({ error: "Project does not exists" });
  }

  return next();
}

// Listra projetos
server.get("/projects", (req, res) => {
  return res.json(projects);
});

// Mostrar projeto
server.get("/projects/:index", checkProjectInArray, (req, res) => {
  const { index } = req.params;
  return res.json(req.projects[index]);
});

// Criando projeto
server.post("/projects", checkProjectExists, (req, res) => {
  const { id } = req.body;
  const { title } = req.body;

  projects.push({ id: id, title: title, tasks: [] });

  return res.json(projects);
});

// criando tarefa
server.post(
  "/projects/:index/tasks",
  checkProjectExists,
  checkProjectInArray,
  (req, res) => {
    const { index } = req.params;
    const { title } = req.body;
    const project = projects.find(p => p.id === index);

    project.tasks.push(title);

    return res.json(project);
  }
);

// Atualizar título do projeto
server.put(
  "/projects/:index",
  checkProjectInArray,
  checkProjectExists,
  (req, res) => {
    const { index } = req.params;
    const { title } = req.body;
    const project = projects.find(p => p.id === index);

    project.title = title;

    return res.json(project);
  }
);

// Deletar projeto
server.delete("/projects/:index", checkProjectInArray, (req, res) => {
  const { index } = req.params;
  const projectId = projects.findIndex(p => p.id === index);

  projects.splice(projectId, 1);

  return res.send();
});

server.listen(3000);
