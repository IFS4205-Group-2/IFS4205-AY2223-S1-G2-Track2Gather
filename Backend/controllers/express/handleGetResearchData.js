const { jwtVerify, getJwt } = require("../jwt/jwtAuth");
const pool = require("../../db");
require("dotenv").config();
const { Logtail } = require("@logtail/node");
const logtail = new Logtail(process.env.LOGTAIL_BACKEND_SOURCE_TOKEN);

const handleGetResearchData = async (req, res) => {

  const token = getJwt(req);

  if (!token || token === "null") {
    res.json({ status_code: -1 });
    return;
  }

  jwtVerify(token, process.env.JWT_SECRET)
    .then(async decoded => {
      const research = await pool.query(
        "select us.gender gender, extract(year from us.date_of_birth) birthday, us.zipcode postal, mh.vaccination_history vaccination, mh.recent_test_result testresult from users us left join medicalhistories mh on us.uid = mh.uid;"
      );
      
      const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
      logtail.info("Researcher " + decoded.username + " is fetching data.", {
        ipaddress: ip
      });

      res.json({ status_code: 0, research: research.rows });
    })
    .catch(() => {
      res.json({ status_code: -1 });
    });
};

module.exports = handleGetResearchData;
