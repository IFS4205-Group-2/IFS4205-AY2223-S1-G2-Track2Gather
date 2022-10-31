const { jwtVerify, getJwt } = require("../jwt/jwtAuth");
const pool = require("../../db");
require("dotenv").config();
const { Logtail } = require("@logtail/node");
const logtail = new Logtail(process.env.LOGTAIL_BACKEND_SOURCE_TOKEN);

const handleGetAllUserInfo = async (req, res) => {

  const token = getJwt(req);

  if (!token || token === "null") {
    res.json({ status_code: -1 });
    return;
  }

  jwtVerify(token, process.env.JWT_SECRET)
    .then(async decoded => {
      const userInfos = await pool.query(
        "SELECT u.uid, u.name, c.username, r.rname AS role, CAST(u.rid AS VARCHAR), u.gender, u.address, OVERLAY(nric placing '****' from 2 for 4) AS nric, u.contact_no, u.email, u.zipcode, SUBSTRING(CAST(u.date_of_birth AS VARCHAR), 1, 10) AS date_of_birth, COALESCE(vaccination_history, 'No vaccination history') AS vaccination_history, COALESCE(recent_test_result, 'No test results') AS recent_test_result FROM users u, credentials c, roles r, medicalhistories m WHERE c.uid = u.uid AND r.rid = u.rid AND m.uid = u.uid AND r.rid <> 1;",
      );
      
      const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
      logtail.info("Health Authority " + decoded.username + " is fetching account information.", {
        ipaddress: ip
      });

      res.json({ status_code: 0, userInfos: userInfos.rows });
    })
    .catch(() => {
      res.json({ status_code: -1 });
    });
};

module.exports = handleGetAllUserInfo;
