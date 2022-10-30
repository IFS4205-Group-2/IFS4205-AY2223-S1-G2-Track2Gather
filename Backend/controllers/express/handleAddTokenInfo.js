const { jwtVerify, getJwt } = require("../jwt/jwtAuth");
const pool = require("../../db");
require("dotenv").config();
const { Logtail } = require("@logtail/node");
const logtail = new Logtail(process.env.LOGTAIL_BACKEND_SOURCE_TOKEN);

const handleAddTokenInfo = async (req, res) => {

  const token = getJwt(req);

  if (!token || token === "null") {
    res.json({ status_code: -1 });
    return;
  }

  jwtVerify(token, process.env.JWT_SECRET)
    .then(async decoded => {
      const tokenExists = await pool.query(
        "SELECT * FROM Tokens WHERE tid = $1;",
        [req.body.tokenID.toLowerCase().replace(/:/g, "-")]
      );

      if (tokenExists.rows[0].status === 1) {
        res.json({ status_code: -1, status_message: 'Token is assigned to other user.'});
        return;
      }

      let tokenResult;

      if (tokenExists.rowCount === 1) {
        tokenResult = await pool.query(
          "UPDATE Tokens SET status = 1 WHERE tid = $1;",
          [req.body.tokenID.toLowerCase().replace(/:/g, "-")]
        );
      } else {
        const currDate = new Date();
        tokenResult = await pool.query(
          "INSERT INTO Tokens (tid, assignedDate, status) VALUES($1, $2, 1);",
          [req.body.tokenID.toLowerCase().replace(/:/g, "-"), currDate]
        );
      }

      if (tokenResult.rowCount !== 1) {
        res.json({ status_code: -1 });
        return;
      }

      const userResult = await pool.query(
        "UPDATE Users SET tid = $2 WHERE nric = $1;",
        [req.body.nric, req.body.tokenID.toLowerCase().replace(/:/g, "-")]
      );
      
      const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
      logtail.info(`Health Authority ${decoded.username} is assigning token ${req.body.tokenID} to a user.`, {
        ipaddress: ip
      });

      if (userResult.rowCount === 1) {
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

module.exports = handleAddTokenInfo;
