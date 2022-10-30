const { jwtVerify, getJwt } = require("../jwt/jwtAuth");
const pool = require("../../db");
require("dotenv").config();
const { Logtail } = require("@logtail/node");
const logtail = new Logtail(process.env.LOGTAIL_BACKEND_SOURCE_TOKEN);
const bcrypt = require("bcrypt");

const handleAddUser = async (req, res) => {

  const token = getJwt(req);

  if (!token || token === "null") {
    res.json({ status_code: -1 });
    return;
  }

  jwtVerify(token, process.env.JWT_SECRET)
    .then(async decoded => {
      const accountExists = await pool.query(
        "SELECT * FROM Users WHERE nric = $1;",
        [req.body.nric]
      );

      if (accountExists.rowCount === 1) {
        res.json({ status_code: -1, status_message: 'User account already exists.'});
        return;
      }

      const currMaxUserId = await pool.query(
        "SELECT uid FROM credentials c WHERE c.uid = (SELECT MAX (uid) FROM credentials)"
      );
      const userId = currMaxUserId.rows[0].uid + 1;
      const hashedPass = await bcrypt.hash(req.body.password, 10);

      const credentialResult = await pool.query(
        "INSERT INTO Credentials (uid, password_hash, username) VALUES ($1, $2, $3);",
        [userId, hashedPass, req.body.username]
      );

      if (credentialResult.rowCount !== 1) {
        res.json({ status_code: -1, status_message: 'Failed to create user credentials.' });
        return;
      }

      const userResult = await pool.query(
        "INSERT INTO Users (uid, nric, name, email, contact_no, gender, address, rid) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);",
        [userId, req.body.nric, req.body.name, req.body.email, req.body.phoneno, req.body.gender, req.body.address, req.body.role]
      );
      
      const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
      logtail.info(`Health Authority ${decoded.username} created a user account.`, {
        ipaddress: ip
      });

      if (userResult.rowCount !== 1) {
        res.json({ status_code: -1 });
        return;
      }

      const medicalResult = await pool.query(
        "INSERT INTO MedicalHistories (uid, vaccination_history, recent_test_result) VALUES ($1, $2, $3);",
        [userId, null, 'No test results']
      );

      if (medicalResult.rowCount === 1) {
        res.json({ status_code: 0 });
        return;
      }
      
      res.json({ status_code: -1 });
      res.send();
    })
    .catch((err) => {
      console.log(err);
      res.json({ status_code: -1 });
      res.send();
    });
};

module.exports = handleAddUser;
