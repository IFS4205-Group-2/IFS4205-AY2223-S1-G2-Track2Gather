const Yup = require("yup");

const formSchema = Yup.object({
  nric: Yup.string()
    .required("NRIC required!")
    .min(9, "NRIC is too short!")
    .max(9, "NRIC is too long!")
    .matches(/^[STGF]{1}[\d]{7}[A-Z]{1}$/, "Please ensure that your NRIC is correct!"),
  tokenID: Yup.string()
    .required("Token ID required!")
    .min(17, "Token ID too short!")
    .max(17, "Token ID too long!")
    .matches(/^[\dA-Fa-f]{2}:[\dA-Fa-f]{2}:[\dA-Fa-f]{2}:[\dA-Fa-f]{2}:[\dA-Fa-f]{2}:[\dA-Fa-f]{2}$/, "Please ensure that your token ID is correct!"),
});

const validateTokenInfoForm = (req, res, next) => {
  const formData = req.body;
  formSchema
    .validate(formData)
    .catch(() => {
      res.status(422).send();
    })
    .then(valid => {
      if (valid) {
        next();
      } else {
        res.status(422).send();
      }
    });
};

module.exports = validateTokenInfoForm;