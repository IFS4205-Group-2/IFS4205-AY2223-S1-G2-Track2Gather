const { jwtVerify, getJwt } = require("../jwt/jwtAuth");
const pool = require("../../db");
require("dotenv").config();

const handleGetUserInfo = async (req, res) => {

  const token = getJwt(req);

  if (!token || token === "null") {
    res.json({ status_code: -1 });
    return;
  }

  jwtVerify(token, process.env.JWT_SECRET)
    .then(async decoded => {
      const userRoles = await pool.query(
        "SELECT rid FROM Users WHERE uid = $1;",
        [decoded.userid]
      );

      res.json({ status_code: 0, ...userRoles.rows[0] });
    })
    .catch(() => {
      res.json({ status_code: -1 });
    });
};

module.exports = handleGetUserInfo;
