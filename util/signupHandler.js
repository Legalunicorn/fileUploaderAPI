const {PrismaClient} = require("@prisma/client")
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs")

async function signupHandler(username,password){
    //santisation and validation done by controller
    const exist = await prisma.user.findUnique({
        where:{
            username:username
        }
    })

    if (exist){
        throw new Error("Username has already been taken")
    }
    else{
        const user = await prisma.user.create({
            data:{
                username: username,
                hashedpassword: encryptPassword(password)
            }
        })

        console.log("new user created: ",user)
        return user; //return the new user
    }
}

function encryptPassword(password){
    const salt = bcrypt.genSaltSync(10); //random salt
    const hash = bcrypt.hashSync(password,salt,null);
    return hash;
}

module.exports  = signupHandler