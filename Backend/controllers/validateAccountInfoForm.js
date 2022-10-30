const Yup = require("yup");

const formSchema = Yup.object({
  nric: Yup.string()
    .required("NRIC required!")
    .min(9, "NRIC is too short!")
    .max(9, "NRIC is too long!")
    .matches(/^[STGF]{1}[\d]{7}[A-Z]{1}$/, "Please ensure that your NRIC is correct!"),
  name: Yup.string()
    .required("Full name is required!")
    .matches(/^[A-Za-z\d. -]{1,}$/, "Please ensure that you name is correct!"),
  username: Yup.string()
    .required("Username is required!")
    .min(6, "Username too short!")
    .matches(/^[A-Za-z\d. -]{1,}$/, "Please ensure that you username is correct!"),
  address: Yup.string()
    .required("Address required!")
    .matches(/^[A-Za-z\d,. \-#()]{1,}$/, "Please ensure that your address is correct!"),
  phoneno: Yup.string()
    .required("Phone number required!")
    .matches(/^[\d]{8}$/, "Please ensure that your phone number is correct!"),
  email: Yup.string()
    .required("Email address required!")
    .matches(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, "Please ensure that your email address is correct!"),
  role: Yup.string()
    .required("Role required!")
    .matches(/^[23]{1}$/, "Please ensure that the chosen role is valid!"),
  gender: Yup.string()
    .required("Gender required!")
    .matches(/^Male|Female$/, "Please ensure that the chosen gender is valid!"),
  password: Yup.string()
    .required("Password required!")
    .min(12, "Password too short!")
    .matches(/^(?=.*[0-9])(?=.*[- ?!@#$%^&*\/\\])(?=.*[A-Z])(?=.*[a-z])[a-zA-Z0-9- ?!@#$%^&*\/\\]{12,}$/, "Your password must contain at least one uppercase character, one lowercase character, one digit and one special character."),
});

const validateAccountInfoForm = (req, res, next) => {
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

module.exports = validateAccountInfoForm;