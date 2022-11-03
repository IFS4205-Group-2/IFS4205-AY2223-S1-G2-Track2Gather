const redisClient = require("../../redis");
require("dotenv").config();
const { Logtail } = require("@logtail/node");
const logtail = new Logtail(process.env.LOGTAIL_BACKEND_SOURCE_TOKEN);

module.exports.rateLimiter =
  (secondsLimit, limitAmount) => async (req, res, next) => {
    try {
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    [response] = await redisClient
      .multi()
      .incr(ip)
      .expire(ip, secondsLimit)
      .exec();

    if (response[1] > limitAmount) {
      logtail.warn("Bruteforce login attempt detected!", {
        ipaddress: ip
      });

      res.json({
        loggedIn: false,
        status: "Slow down!! Try again in a minute.",
      });
    }
    else next();
    } catch (e) {
      console.log(e);
    }
  };

