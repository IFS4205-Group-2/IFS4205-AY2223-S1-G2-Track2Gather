const { jwtVerify, getJwt } = require("../jwt/jwtAuth");
const pool = require("../../db");
require("dotenv").config();
const { Logtail } = require("@logtail/node");
const logtail = new Logtail(process.env.LOGTAIL_BACKEND_SOURCE_TOKEN);

const handleLogin = async (req, res) => {

  const token = getJwt(req);

  if (!token) {
    res.json({ loggedIn: false });
    return;
  }

  jwtVerify(token, process.env.JWT_SECRET)
    .then(async decoded => {
      const potentialUser = await pool.query(
        "SELECT username FROM users u WHERE u.username = $1",
        [decoded.username]
      );

      if (potentialUser.rowCount === 0) {
        res.json({ loggedIn: false, token: null });
        return;
      }
      const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
      logtail.info("User " + decoded.username + " in using their token.", {
        ipaddress: ip
      });

      res.json({ loggedIn: true, token });
    })
    .catch(() => {
      res.json({ loggedIn: false });
    });
};

module.exports = handleLogin;
