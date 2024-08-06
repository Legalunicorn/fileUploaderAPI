const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");

/**
 * 
 * @param {*} username 
 * @param {*} password 
 * @returns User object from database
 */
async function loginValidation(username,password){
    const user = await prisma.user.findUnique({
        where:{
            username:username
        }
    })

    if (!user){ //User does not exist 
        throw new Error("User with username does not exist")
    }
    if(!bcrypt.compareSync(password,user.hashedpassword)){ //wrong password
        throw new Error("Password or Username incorrrect");
    }

    //Valid 
    return user; 
}

module.exports = loginValidation