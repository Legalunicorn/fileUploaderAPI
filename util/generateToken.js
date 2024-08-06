// const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

function generateToken(id){
    return jwt.sign({id},process.env.SECRET,{expiresIn:'7d'})
}

module.exports = generateToken