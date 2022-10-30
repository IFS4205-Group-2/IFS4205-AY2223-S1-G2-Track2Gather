const pool = require("../../db");
const { jwtVerify, getJwt } = require("../jwt/jwtAuth");
require("dotenv").config();

const handleUpdateMedicalInfo = async (req, res) => {
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
        "UPDATE MedicalHistories SET recent_test_result = $1 WHERE uid = $2;",
        [req.body.testresult, decoded.userid]
      );

      res.status(200);
      res.json({ status: 'Update success!' });
    })
    .catch((e) => {
      res.status(400);
      res.json({ status: 'Update user medical information failed. Try again later.' });
    });
};

module.exports = handleUpdateMedicalInfo;
