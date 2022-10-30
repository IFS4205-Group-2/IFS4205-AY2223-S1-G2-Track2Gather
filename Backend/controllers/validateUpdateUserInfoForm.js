const Yup = require("yup");

const formSchema = Yup.object({
  nric: Yup.string()
    .required("NRIC required!")
    .min(9, "NRIC is too short!")
    .max(9, "NRIC is too long!")
    .matches(/^[*]{5}[\d]{3}[A-Za-z]{1}$/, "Please ensure that your NRIC is correct!"),
  name: Yup.string()
    .required("Full name is required!")
    .matches(/^[A-Za-z\d. -]{1,}$/, "Please ensure that you name is correct!"),
  address: Yup.string()
    .required("Address required!")
    .matches(/^[A-Za-z\d,. \-#()]{1,}$/, "Please ensure that your address is correct!"),
  phoneno: Yup.string()
    .required("Phone number required!")
    .matches(/^[\d]{8}$/, "Please ensure that your phone number is correct!"),
  email: Yup.string()
    .required("Email address required!")
    .matches(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, "Please ensure that your email address is correct!")
});

const validateUpdateUserInfoForm = (req, res, next) => {
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

module.exports = validateUpdateUserInfoForm;