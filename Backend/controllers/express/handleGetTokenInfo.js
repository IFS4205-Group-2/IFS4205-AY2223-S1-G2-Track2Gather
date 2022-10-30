const { jwtVerify, getJwt } = require("../jwt/jwtAuth");
const pool = require("../../db");
require("dotenv").config();
const { Logtail } = require("@logtail/node");
const logtail = new Logtail(process.env.LOGTAIL_BACKEND_SOURCE_TOKEN);

const handleGetTokenInfo = async (req, res) => {

  const token = getJwt(req);

  if (!token || token === "null") {
    res.json({ status_code: -1 });
    return;
  }

  jwtVerify(token, process.env.JWT_SECRET)
    .then(async decoded => {
      const tokenInfos = await pool.query(
        "SELECT u.uid, OVERLAY(u.nric placing '****' from 2 for 4) AS nric, u.name, t.tid, SUBSTRING(CAST(t.assignedDate AS VARCHAR) from 1 for 10) AS assignedDate FROM users u, tokens t WHERE u.tid = t.tid AND t.status = 1;",
      );
      
      const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
      logtail.info("Health Authority " + decoded.username + " is fetching token information.", {
        ipaddress: ip
      });

      res.json({ status_code: 0, tokenInfos: tokenInfos.rows});
    })
    .catch(() => {
      res.json({ status_code: -1 });
    });
};

module.exports = handleGetTokenInfo;
