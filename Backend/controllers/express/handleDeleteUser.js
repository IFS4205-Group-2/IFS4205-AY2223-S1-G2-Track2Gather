const { jwtVerify, getJwt } = require("../jwt/jwtAuth");
const pool = require("../../db");
require("dotenv").config();
const { Logtail } = require("@logtail/node");
const logtail = new Logtail(process.env.LOGTAIL_BACKEND_SOURCE_TOKEN);

const handleDeleteUser = async (req, res) => {

  const token = getJwt(req);

  if (!token || token === "null") {
    res.json({ status_code: -1 });
    return;
  }

  jwtVerify(token, process.env.JWT_SECRET)
    .then(async decoded => {
      const userInfo = await pool.query(
        "SELECT tid FROM Users WHERE uid = $1;",
        [req.body.uid]
      );

      if (userInfo.rowCount !== 1) {
        res.json({ status_code: -1, status_message: "User not found." });
        return;
      }

      if (userInfo.rows[0].tid != null) {
        const tokenInfo = await pool.query(
          "UPDATE Tokens SET status = 0 WHERE tid = $1;",
          [userInfo.rows[0].tid]
        );

        if (tokenInfo.rowCount !== 1) {
          res.json({ status_code: -1, status_message: "Error making token available." });
          return;
        }
      }

      const userDeletionResult = await pool.query(
        "DELETE FROM Users WHERE uid = $1;",
        [req.body.uid]
      );

      const credentialsDeletionResult = await pool.query(
        "DELETE FROM Credentials WHERE uid = $1;",
        [req.body.uid]
      );
      
      const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
      logtail.info(`Health Authority ${decoded.username} is deleting user account ${req.body.uid}.`, {
        ipaddress: ip
      });

      if (userDeletionResult.rowCount === 1 && credentialsDeletionResult.rowCount === 1) {
        res.json({ status_code: 0 });
        return;
      }
      
      res.json({ status_code: -1 });
      res.send();
    })
    .catch(() => {
      res.json({ status_code: -1 });
    });
};

module.exports = handleDeleteUser;
