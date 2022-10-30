const { jwtVerify, getJwt } = require("../jwt/jwtAuth");
const pool = require("../../db");
require("dotenv").config();
const { Logtail } = require("@logtail/node");
const logtail = new Logtail(process.env.LOGTAIL_BACKEND_SOURCE_TOKEN);

const handleGetUserInfo = async (req, res) => {

  const token = getJwt(req);

  if (!token || token === "null") {
    res.json({ status_code: -1 });
    return;
  }

  jwtVerify(token, process.env.JWT_SECRET)
    .then(async decoded => {
      const userInfos = await pool.query(
        "SELECT name, OVERLAY(nric placing '*****' from 1 for 5) AS nric, address, contact_no, email FROM users WHERE uid = $1;",
        [decoded.userid]
      );
      
      const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
      logtail.info("User " + decoded.username + " is fetching their personal information.", {
        ipaddress: ip
      });

      res.json({ status_code: 0, ...userInfos.rows[0] });
    })
    .catch(() => {
      res.json({ status_code: -1 });
    });
};

module.exports = handleGetUserInfo;
