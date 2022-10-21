const redisClient = require("../redis");

const initializeUser = async socket => {
  socket.join(socket.user.userid);
  await redisClient.hset(
    `userid:${socket.user.username}`,
    "userid",
    socket.user.userid,
    "connected",
    true
  );
};

module.exports = initializeUser;
