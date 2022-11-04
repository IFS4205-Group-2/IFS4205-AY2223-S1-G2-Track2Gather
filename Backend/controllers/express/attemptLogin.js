const pool = require("../../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { jwtSign } = require("../jwt/jwtAuth");
require("dotenv").config();
const { Logtail } = require("@logtail/node");
const logtail = new Logtail(process.env.LOGTAIL_BACKEND_SOURCE_TOKEN);

const attemptLogin = async (req, res) => {
  if (req.headers['x-forwarded-host'] != "ifs4205-gp02-1.comp.nus.edu.sg") {
    res.json({ loggedIn: false, status: "Unable to process request not from proxy" });
  } else {
    const potentialLogin = await pool.query(
      "SELECT c.uid, c.username, c.password_hash, u.rid FROM credentials c, users u WHERE c.uid = u.uid AND c.username = $1;",
      [req.body.username]
    );
   
    if (potentialLogin.rowCount > 0) {
      const isSamePass = await bcrypt.compare(
        req.body.password,
        potentialLogin.rows[0].password_hash
      );
      if (isSamePass) {
        const ip = req.headers["x-forwarded-for"];
        logtail.info("User " + req.body.username + " in via login page.", {
          ipaddress: ip
        });
  
        jwtSign(
          {
            username: req.body.username,
            userid: potentialLogin.rows[0].uid,
            roleid: potentialLogin.rows[0].rid,
          },
          process.env.JWT_SECRET,
          { expiresIn: "20mins" }
        )
          .then(token => {
            res.json({ loggedIn: true, token });
          })
          .catch(err => {
            console.log(err);
            res.json({ loggedIn: false, status: "Try again later" });
          }); 
      } else {
        res.json({ loggedIn: false, status: "Wrong username or password!" });
      }
    } else {
      //Run dummy bcrypt command
      await bcrypt.compare(
        req.body.password,
        "$2b$10$jrUVh8rzQ0Hx99XZU/MdKO9U6X/CHUHeebCS82YiAFAqVKoEylSoO"
      );      
      res.json({ loggedIn: false, status: "Wrong username or password!" });
    }
  }
};

module.exports = attemptLogin;
