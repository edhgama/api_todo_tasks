const express = require("express")
const todosRoutes = express.Router()
const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient();

// let todos = [{todo:"task",status:false}]

//c
todosRoutes.post('/todos', async (req, res) => {
  const { name } = req.body;
  const todo = await prisma.todo.create({
    data: {
      name,
    }
  })

  // todos.push({name,status:false})
  return res.status(201).json(todo)
})

//r
todosRoutes.get('/todos', async (req, res) => {
  const todos = await prisma.todo.findMany()
  return res.status(200).json(todos)
})
//u
todosRoutes.put('/todos', async (req, res) => {
  const { id, name, status } = req.body;

  if (!id) res.status(400).json("id é obrigatório!")
  //tb checar se ID tem na lista btw
  const idExists = await prisma.todo.findUnique({where: {id}})
  if (!idExists) res.status(404).json("Id não existe!")

  const todo = await prisma.todo.update({
    where: {
      id,
    },
    data: {
      name,
      status
    }
  })

  return res.status(200).json(todo)
})


//d
todosRoutes.delete("/todos/:id", async (req,res) => {
   const {id} = req.params;
   const intId = parseInt(id)

  if (!intId) return res.status(400).json("id é obrigatório!")
 
  const idExists = await prisma.todo.findUnique({where: {id: intId}})

  if (!idExists) return res.status(404).json("Id não existe!")
  
  await prisma.todo.delete({where: {id: intId}})
  return res.status(200).send()
})



module.exports = todosRoutes