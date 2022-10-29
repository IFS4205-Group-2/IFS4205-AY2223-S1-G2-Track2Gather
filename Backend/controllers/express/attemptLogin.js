const pool = require("../../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { jwtSign } = require("../jwt/jwtAuth");
require("dotenv").config();
const { Logtail } = require("@logtail/node");
const logtail = new Logtail(process.env.LOGTAIL_BACKEND_SOURCE_TOKEN);


const { JSEncrypt } = require("jsencrypt");
 
const attemptLogin = async (req, res) => {
    // Decrypt with the private key...
    const decryptedData = crypto.privateDecrypt({
      key: process.env.RSA_PRIVATE_KEY,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    }, Buffer.from(req.body.username, 'base64')
    );
    console.log(decryptedData.toString);
  // const potentialLogin = await pool.query(
  //   "SELECT uid, password_hash, username FROM credentials c WHERE c.username=$1",
  //   [req.body.username]
  // );

  // if (potentialLogin.rowCount > 0) {
  //   const isSamePass = await bcrypt.compare(
  //     req.body.password,
  //     potentialLogin.rows[0].password_hash
  //   );
  //   if (isSamePass) {
  //     const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  //     logtail.info("User " + req.body.username + " in via login page.", {
  //       ipaddress: ip
  //     });

  //     jwtSign(
  //       {
  //         id: potentialLogin.rows[0].uid,
  //         username: req.body.username,
  //       },
  //       process.env.JWT_SECRET,
  //       { expiresIn: "15mins" } //to be changed
  //     )
  //       .then(token => {
  //         res.json({ loggedIn: true, token });
  //       })
  //       .catch(err => {
  //         console.log(err);
  //         res.json({ loggedIn: false, status: "Try again later" });
  //       });
  //   } else {
  //     res.json({ loggedIn: false, status: "Wrong username or password!" });
  //     console.log("wrong pass");
  //   }
  // } else {
  //   res.json({ loggedIn: false, status: "Wrong username or password!" });
  // }
};

module.exports = attemptLogin;
