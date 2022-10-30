const pool = require("../../db");
const { jwtVerify, getJwt } = require("../jwt/jwtAuth");
require("dotenv").config();

const handleUserInfoUpdate = async (req, res) => {
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

      const result = await pool.query(
        "UPDATE Users SET name = $2, contact_no = $3, email = $4, address = $5 WHERE uid = $1",
        [decoded.userid, req.body.name, req.body.phoneno, req.body.email, req.body.address]
      );

      res.status(200);
      res.json({ status: 'Update success!' });
    })
    .catch((e) => {
      res.status(400);
      res.json({ status: 'Update user information failed. Try again later.' });
    });
};

module.exports = handleUserInfoUpdate;
