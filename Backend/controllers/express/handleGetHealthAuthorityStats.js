const { jwtVerify, getJwt } = require("../jwt/jwtAuth");
const pool = require("../../db");
require("dotenv").config();
const { Logtail } = require("@logtail/node");
const logtail = new Logtail(process.env.LOGTAIL_BACKEND_SOURCE_TOKEN);

const handleGetHealthAuthorityStats = async (req, res) => {

  const token = getJwt(req);

  if (!token || token === "null") {
    res.json({ status_code: -1 });
    return;
  }

  jwtVerify(token, process.env.JWT_SECRET)
    .then(async decoded => {
      const positiveCount = await pool.query(
        "SELECT COUNT(*) AS activecases FROM MedicalHistories WHERE recent_test_result = 'positive';",
      );

      const recoveryCount = await pool.query(
        "SELECT COUNT(*) AS recoveredcases FROM MedicalHistories WHERE recent_test_result = 'negative';",
      );

      const tokenCount = await pool.query(
        "SELECT COUNT(*) AS tokencount FROM Tokens WHERE status = 1;",
      );
      
      const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
      logtail.info("Health Authority " + decoded.username + " is fetching statistics information.", {
        ipaddress: ip
      });

      res.json({
        status_code: 0,
        statistics: {
          activeCases: positiveCount.rows[0].activecases,
          recoveredCount: recoveryCount.rows[0].recoveredcases,
          tokensIssued: tokenCount.rows[0].tokencount
        } 
      });
    })
    .catch(() => {
      res.json({ status_code: -1 });
    });
};

module.exports = handleGetHealthAuthorityStats;
