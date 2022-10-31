const { jwtVerify, getJwt } = require("../jwt/jwtAuth");
const pool = require("../../db");
require("dotenv").config();
const { Logtail } = require("@logtail/node");
const logtail = new Logtail(process.env.LOGTAIL_BACKEND_SOURCE_TOKEN);

const handleGetMedicalInfo = async (req, res) => {

  const token = getJwt(req);

  if (!token || token === "null") {
    res.json({ status_code: -1 });
    return;
  }

  jwtVerify(token, process.env.JWT_SECRET)
    .then(async decoded => {
      const medicalInfos = await pool.query(
        "SELECT vaccination_history, COALESCE(recent_test_result, 'No test result') AS recent_test_result FROM MedicalHistories WHERE uid = $1;",
        [decoded.userid]
      );
      
      const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
      logtail.info("User " + decoded.username + " is fetching their medical information.", {
        ipaddress: ip
      });

      res.json({ status_code: 0, ...medicalInfos.rows[0] });
    })
    .catch(() => {
      res.json({ status_code: -1 });
    });
};

module.exports = handleGetMedicalInfo;
