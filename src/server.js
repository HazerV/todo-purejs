const express = require('express')
const jwt = require('jsonwebtoken')
const db = require('./db.js')
const auth = require("./auth")
const { Router } = require('express')
const {check} = require('express-validator')
const PORT = process.env.PORT || 5000
const app = express()
const todosRouter = require('./todos.routes')

app.use(express.json())


app.post('/register', [check("login", "Поле логина не может быть пустым!!").notEmpty(), check("password", "Поле пароля не может быть пустым!!!").notEmpty()], auth.create)
app.post('/access_token', auth.accessToken)
app.get('/users', auth.get)
app.put('/user/change_pass', auth.sec, auth.updPass)
const todoRouter = new Router()

todoRouter.use(async (req, res, next) => {
    if (!req.header('authorizaion')) {
        res.status(401).send({
            msg: 'access denied'
        })
    } else {
        next()
    }
    
})
app.use(todosRouter)

app.listen(PORT, () => {
    try {
        console.log(`Server started on PORT ${PORT}`)
    } catch (e) {
        console.log(e)
    }
})


