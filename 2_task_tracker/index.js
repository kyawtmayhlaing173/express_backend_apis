// npx nodemon index.js
// npx prisma studio

const express = require("express");
const app = express();

const prisma = require("./prismaClient");

const cors = require("cors");
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { taskRouter } = require("./routers/task");
app.use("/", taskRouter);

const { userRouter } = require("./routers/user");
app.use("/user", userRouter);

app.listen(8000, () => {
    console.log("API started at 8000...")
});

const gracefulShutdown = async () => {
    await prisma.$disconnect();
    server.close(() => {
        console.log("Yaycha API closed");
        process.exit(0);
    });
};

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);