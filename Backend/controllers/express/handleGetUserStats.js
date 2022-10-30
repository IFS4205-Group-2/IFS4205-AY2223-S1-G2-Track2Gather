const pool = require("../../db");
const { jwtVerify, getJwt } = require("../jwt/jwtAuth");
require("dotenv").config();
const { Logtail } = require("@logtail/node");
const logtail = new Logtail(process.env.LOGTAIL_BACKEND_SOURCE_TOKEN);

const handleGetUserStats = async (req, res) => {
  const token = getJwt(req);

  if (!token) {
    res.json({ loggedIn: false });
    return;
  }

  jwtVerify(token, process.env.JWT_SECRET)
    .then(async decoded => {
      // If account role is not user
      if (decoded.roleid !== 3) {
        res.status(400);
        res.json({ status: 'Forbidden' });
        return;
      }

      const testRecord = await pool.query(
        "SELECT recent_test_result FROM MedicalHistories WHERE uid = $1;",
        [decoded.userid]
      );

      const vaccinationRecord = await pool.query(
        "SELECT vaccination_history FROM MedicalHistories WHERE uid = $1;",
        [decoded.userid]
      );
      
      const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
      logtail.info("User " + decoded.username + " is fetching statistics information.", {
        ipaddress: ip
      });

      res.json({
        status_code: 0,
        statistics: {
          hasQuarantineStatus: testRecord.rows[0].recent_test_result === 'positive',
          vaccinationHistory: vaccinationRecord.rows[0].vaccination_history || '0'
        } 
      });
    })
    .catch((e) => {
      console.log(e);
      res.status(400);
      res.json({ status: 'Fetch statistics information failed. Try again later.' });
    });
};

module.exports = handleGetUserStats;
