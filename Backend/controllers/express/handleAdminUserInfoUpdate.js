const pool = require("../../db");
const { jwtVerify, getJwt } = require("../jwt/jwtAuth");
require("dotenv").config();
const { Logtail } = require("@logtail/node");
const logtail = new Logtail(process.env.LOGTAIL_BACKEND_SOURCE_TOKEN);
const bcrypt = require("bcrypt");

const handleAdminUserInfoUpdate = async (req, res) => {
  const token = getJwt(req);

  if (!token) {
    res.json({ loggedIn: false });
    return;
  }

  jwtVerify(token, process.env.JWT_SECRET)
    .then(async decoded => {
      if (req.body.password != null && req.body.password !== "") {
        const hashedPass = await bcrypt.hash(req.body.password, 10);
        const credentialResult = await pool.query(
          "UPDATE Credentials SET password_hash = $1 WHERE uid = $2;",
          [hashedPass, body.req.uid]
        );

        if (credentialResult.rowCount !== 1) {
          res.json({ status_code: -1, status_message: 'Failed to update user credentials.' });
          return;
        }
      }

      const userResult = await pool.query(
        "UPDATE Users SET name = $2, contact_no = $3, email = $4, address = $5, gender = $6, rid = $7 WHERE uid = $1;",
        [req.body.uid, req.body.name, req.body.phoneno, req.body.email, req.body.address, req.body.gender, req.body.role]
      );

      if (userResult.rowCount !== 1) {
        res.json({ status_code: -1, status_message: 'Failed to update user information.' });
        return;
      }

      const latestTestResult = req.body.testresult.length > 8 ? null : req.body.testresult;

      const medicalResult = await pool.query(
        "UPDATE MedicalHistories SET vaccination_history = $2, recent_test_result = $3 WHERE uid = $1;",
        [req.body.uid, req.body.vaccinationhistory, latestTestResult]
      );

      if (medicalResult.rowCount !== 1) {
        res.json({ status_code: -1, status_message: 'Failed to update user medical history.' });
        return;
      }

      const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
      logtail.info(`Health Authority ${decoded.username} updated a user information.`, {
        ipaddress: ip
      });

      res.status(200);
      res.json({ status: 'Update success!' });
    })
    .catch((e) => {
      console.log(e);
      res.status(400);
      res.json({ status: 'Update user information failed. Try again later.' });
    });
};

module.exports = handleAdminUserInfoUpdate;
