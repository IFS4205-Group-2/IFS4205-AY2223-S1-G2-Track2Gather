const express = require("express");
const { corsConfig } = require("./controllers/serverController");
const app = express();
const helmet = require("helmet");
const cors = require("cors");
const authRouter = require("./routers/authRouter");
const recordRouter = require("./routers/recordRouter");
const contactRouter = require("./routers/contactRouter");
const researchRouter = require("./routers/researchRouter");
const userRouter = require('./routers/userRouter');
const medicalRouter = require('./routers/medicalRouter');
const tokenRouter = require('./routers/tokenRouter');
const statsRouter = require('./routers/statsRouter');
const redisClient = require("./redis");
const server = require("http").createServer(app);


app.use(helmet());
app.use(cors(corsConfig));
app.use(express.json());
app.use("/auth", authRouter);
app.use("/contacttracer", recordRouter);
app.use("/tracing", contactRouter);
app.use("/researcher", researchRouter);
app.use('/user', userRouter);
app.use('/medical', medicalRouter);
app.use('/token', tokenRouter);
app.use('/stats', statsRouter);
app.set("trust proxy", 1);


server.listen(4000, () => {
  console.log("Server listening on port 4000");
});

const resetEverythingInterval = 1000 * 60 * 15; // 15 minutes, to be chagned

setInterval(() => {
  
  if (process.env.NODE_ENV !== "production") {
    return;
  }
  redisClient.flushall();
}, resetEverythingInterval);