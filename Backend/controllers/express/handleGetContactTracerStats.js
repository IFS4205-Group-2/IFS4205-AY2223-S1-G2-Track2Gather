const { jwtVerify, getJwt } = require("../jwt/jwtAuth");
const pool = require("../../db");
const pooldb2 = require("../../db2");
require("dotenv").config();
const { Logtail } = require("@logtail/node");
const logtail = new Logtail(process.env.LOGTAIL_BACKEND_SOURCE_TOKEN);

const handleGetContactTracerStats = async (req, res) => {

  const token = getJwt(req);

  if (!token || token === "null") {
    res.json({ status_code: -1 });
    return;
  }

  jwtVerify(token, process.env.JWT_SECRET)
    .then(async decoded => {
      const caseCount = await pool.query(
        "SELECT COUNT(*) AS activecases FROM MedicalHistories WHERE recent_test_result = 'positive';",
      );

      const closeContactCount = await pooldb2.query(
        "select COUNT(*) AS closecases from tracingrecords tr left join tracingrecords tr2 on tr.location = tr2.location and tr.tokenid <> tr2.tokenid where tr2.time - tr.time < interval '30 seconds' and tr2.time - tr.time > interval '0 seconds';",
      );
      
      const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
      logtail.info("Contact Tracer " + decoded.username + " is fetching statistics information.", {
        ipaddress: ip
      });

      res.json({
        status_code: 0,
        statistics: {
          totalCases: caseCount.rows[0].activecases,
          closeCases: closeContactCount.rows[0].closecases,
        } 
      });
    })
    .catch(() => {
      res.json({ status_code: -1 });
    });
};

module.exports = handleGetContactTracerStats;
