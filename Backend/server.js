const express = require("express");
const { corsConfig } = require("./controllers/serverController");
const { Server } = require("socket.io");
const app = express();
const helmet = require("helmet");
const cors = require("cors");
const authRouter = require("./routers/authRouter");
const recordRouter = require("./routers/recordRouter");
const contactRouter = require("./routers/contactRouter");
const researchRouter = require("./routers/researchRouter");
const pool = require("./db");
const redisClient = require("./redis");
const server = require("http").createServer(app);
const authorizeUser = require("./controllers/authorizeUser");
// const initializeUser = require("./controllers/initializeUser");

const io = new Server(server, {
  cors: corsConfig,
});

app.use(helmet());
app.use(cors(corsConfig));
app.use(express.json());
app.use("/auth", authRouter);
app.use("/tracing", recordRouter);
app.use("/tracing", contactRouter);
app.use("/researcher", researchRouter);
app.set("trust proxy", 1); //???

io.use(authorizeUser); //???

io.on("connect", socket => {
  //initializeUser(socket);
});

server.listen(4000, () => {
  console.log("Server listening on port 4000");
});

const resetEverythingInterval = 1000 * 60 * 15; // 15 minutes, to be chagned

setInterval(() => {
  
  if (process.env.NODE_ENV !== "production") {
    return;
  }
  pool.query("DELETE FROM users u where u.username != $1", ["lester"]);
  redisClient.flushall();
}, resetEverythingInterval);