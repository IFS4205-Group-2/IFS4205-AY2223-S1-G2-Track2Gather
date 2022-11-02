const { jwtVerify, getJwt } = require("../jwt/jwtAuth");
const pool = require("../../db");
require("dotenv").config();
const { Logtail } = require("@logtail/node");
const logtail = new Logtail(process.env.LOGTAIL_BACKEND_SOURCE_TOKEN);

const handleGetContact = async (req, res) => {

  const token = getJwt(req);

  if (!token || token === "null") {
    res.json({ status_code: -1 });
    return;
  }

  jwtVerify(token, process.env.JWT_SECRET)
    .then(async decoded => {
      const contacts = await pool.query(
        "SELECT name, contact_no, email, gender, zipcode, tid FROM users;"
      );
      
      const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
      logtail.info("Contact Tracer " + decoded.username + " is fetching contact information.", {
        ipaddress: ip
      });

      res.json({ status_code: 0, contacts: contacts.rows });
    })
    .catch(() => {
      res.json({ status_code: -1 });
    });
};

module.exports = handleGetContact;
