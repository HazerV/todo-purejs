const Router = require('express')
const todosRouter = new Router()
const todosAct = require('./todos.js')
const register = require('./auth.js')

todosRouter.post('/todo', register.sec, todosAct.create)
todosRouter.get('/todo', register.sec, todosAct.get)
todosRouter.get('/todo/:id', todosAct.getById)
todosRouter.put('/todo/:id', todosAct.update)
todosRouter.delete('/todo/:id', todosAct.delete)

module.exports = todosRouter