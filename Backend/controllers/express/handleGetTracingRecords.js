const { jwtVerify, getJwt } = require("../jwt/jwtAuth");
const pool = require("../../db");
require("dotenv").config();
const { Logtail } = require("@logtail/node");
const logtail = new Logtail(process.env.LOGTAIL_BACKEND_SOURCE_TOKEN);

const handleGetTracingRecords = async (req, res) => {

  const token = getJwt(req);

  if (!token || token === "null") {
    res.json({ status_code: -1 });
    return;
  }

  jwtVerify(token, process.env.JWT_SECRET)
    .then(async decoded => {
      const records = await pool.query(
        "SELECT tr.tokenid AS tokenid1, tr.time AS time1, tr.location AS location1, tr2.tokenid AS tokenid2, tr2.time AS time2 FROM tracingrecords tr LEFT JOIN tracingrecords tr2 ON tr.location = tr2.location AND tr.tokenid <> tr2.tokenid WHERE tr2.time - tr.time < interval '30 seconds' AND tr2.time - tr.time > interval '0 seconds';",
      );
      
      const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
      logtail.info("Contact Tracer " + decoded.username + " is fetching tracing records information.", {
        ipaddress: ip
      });

      res.json({ status_code: 0, records: records.rows });
    })
    .catch(() => {
      res.json({ status_code: -1 });
    });
};

module.exports = handleGetTracingRecords;