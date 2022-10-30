const { jwtVerify, getJwt } = require("../jwt/jwtAuth");
const pool = require("../../db");
require("dotenv").config();
const { Logtail } = require("@logtail/node");
const logtail = new Logtail(process.env.LOGTAIL_BACKEND_SOURCE_TOKEN);

const handleDeleteTokenInfo = async (req, res) => {

  const token = getJwt(req);

  if (!token || token === "null") {
    res.json({ status_code: -1 });
    return;
  }

  jwtVerify(token, process.env.JWT_SECRET)
    .then(async decoded => {
      const result = await pool.query(
        "UPDATE Tokens SET status = 0 WHERE tid IN (SELECT u.tid FROM Users u WHERE uid = $1);",
        [req.body.uid]
      );
      
      const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
      logtail.info("Health Authority " + decoded.username + " is deleting token information.", {
        ipaddress: ip
      });

      if (result.rowCount === 1) {
        res.json({ status_code: 0 });
        return;
      }
      
      res.json({ status_code: -1 });
    })
    .catch(() => {
      res.json({ status_code: -1 });
    });
};

module.exports = handleDeleteTokenInfo;
