const {PrismaClient} = require("@prisma/client")
const prisma = new PrismaClient()

async function main() {
    // ... you will write your Prisma Client queries here
    // await prisma.user.create({
    //     data:{
    //         username:"bingus",
    //         hashedpassword:"blahblah"
    //     }
    // })
    // const allUsers = await prisma.user.findMany();
    // // await prisma.user.deleteMany({
    // //     where:{
    // //         username:"bingus",
    // //     },
    // // })

    const allUsers = await prisma.user.count({
      where:{
        id:{
          gt:1
        }
      }

    })
    console.log("count ",allUsers);
  }
  
  main()
    .then(async () => {
      await prisma.$disconnect()
    })
    .catch(async (e) => {
      console.error(e)
      await prisma.$disconnect()
      process.exit(1)
    })