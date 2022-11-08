const { jwtVerify, getJwt } = require("./jwt/jwtAuth");
require("dotenv").config();
const { Logtail } = require("@logtail/node");
const logtail = new Logtail(process.env.LOGTAIL_BACKEND_SOURCE_TOKEN);

const validateContactTracerRole = async (req, res, next) => {

  const token = getJwt(req);

  if (!token || token === "null") {
    res.json({ status_code: -1 });
    return;
  }

  jwtVerify(token, process.env.JWT_SECRET)
    .then(async decoded => {
      if (decoded.roleid === 2) {
        next();
      } else {
        const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
        logtail.warn(`User ${decoded.username} with role ID ${decoded.roleid} is trying to access contact tracer api.`, {
          ipaddress: ip
        });
        res.status(400).send();
      }
    })
    .catch(() => {
      res.status(400).send();
    });
};

module.exports = validateContactTracerRole;
