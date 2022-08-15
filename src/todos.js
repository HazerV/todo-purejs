const db = require('./db.js')
const todosAct = {}

todosAct.create = async function(req, res) {
    const {name, is_done} = req.body
    const newTodo = await db.query(`insert into todos (name, is_done, user_id) values ($1, $2, $3) RETURNING *`, [name, is_done, req.user.userId])
    res.json(newTodo.rows[0])
}

todosAct.update = async function (req, res) {
    const id = req.params.id
    const {is_done} = req.body
    const todo = await db.query('update todos set is_done = $2 where id = $1 RETURNING *', [id, is_done])
    res.json(todo.rows[0])
}

todosAct.getById = async function (req, res) {
    const id = req.params.id
    const todoId = await db.query('select * from todos where id = $1', [id])
    res.json(todoId.rows[0])
}

todosAct.get = async function (req, res) {
    const todos = await db.query('select * from todos')
    res.json(todos.rows[0])
}

todosAct.delete = async function (req, res) {
    const id = req.params.id
    const users = await db.query('delete from todos where id = $1', [id])
    res.json(users.rows)
}

module.exports = todosAct


