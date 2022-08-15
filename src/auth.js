const db = require("./db")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const salt = 10;
const jwtSecret = "jf82udoal!jfismfp0fisufhdjvnb.,m"
const { validationResult } = require('express-validator')


const register = {}

register.create = async function(req, res) {
    const {login, password} = req.body               
    const errors = validationResult(req)                                                //Validator
    if(!errors.isEmpty()) {
        return res.status(400). json({message: 'Ошибка при регистрации', errors})      
    }
    const user = await db.query(`select * from users where login = $1`, [login])

    if (user.rows > 0) {
        res.status(409).send(`user ${user.login} has already register`)
    } else {
        const crypt_pass = bcrypt.hashSync(password, salt)
        await db.query(`insert into users (login, password) values ($1, $2)`, [login, crypt_pass])
        res.send(`user succesfully created!!!`)
    }
} 

register.updPass = async function (req, res) {                                          // Change password
    const {password} = req.body
    const crypt_pass = bcrypt.hashSync(password, salt)
    await db.query(`update users set password = $1 where login = $2`, [crypt_pass, req.user.userId])
    res.send('Password has been succesfully update!')
}

register.accessToken = async function(req, res) {                                   // Generate access token
    const {login, password} = req.body
    const result = await db.query(`select * from users where login = $1`, [login])
    
    if (result.rowCount > 0) {
        const user = result.rows[0]

        if (bcrypt.compareSync(password, user.password)) {
            res.send({
                token: jwt.sign({userId: user.id}, jwtSecret)                       
            })
        } else {
            res.status(403).send({
                msg: 'Unauthorized'
            })
        }
    } else {
        res.status(401).send({
            msg: 'user with such login is not found'
        })
    }
}

register.get = async function (req, res) {
    const get = await db.query('select * from users')
    res.json(get.rows[0])
}

register.sec = async (req, res, next) => {
    if (req.method === 'Options') {
        next()
    }

    try {
        const token = req.headers.authorization.split(' ')[0]
        if (!token) {
            return res.status(403).json({message: 'User unauthorized!!!'})

        }
        const decodedData = jwt.verify(token, jwtSecret)
        req.user = decodedData
        next()

    } catch (e) {
        console.log(e)
        return res.status(403).json({message: 'User unauthorized!!!'})
    }
}

module.exports = register
