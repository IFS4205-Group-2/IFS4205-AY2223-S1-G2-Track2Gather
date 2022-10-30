const Yup = require("yup");

const formSchema = Yup.object({
  uid: Yup.string()
    .required("User ID is required!")
    .matches(/^[\d]{1,}$/, "Please ensure that the user ID is valid!"),
  name: Yup.string()
    .required("Full name is required!")
    .matches(/^[A-Za-z\d. -]{1,}$/, "Please ensure that your name is correct!"),
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
  vaccinationhistory: Yup.string()
    .matches(/^[A-Za-z\d\-+=!@#$()/|[\]{},.\s]{0,}$/, "Your input contains illegal characters!"),
  testresult: Yup.string()
    .required("Test result required!")
    .matches(/^positive|negative|No test results$/, "Please ensure that the chosen test result is valid!"),
});

const passwordSchema = Yup.object({
  password: Yup.string()
    .min(12, "Password too short!")
    .matches(/[A-Z]/, "Your password must contain at least one uppercase character.")
    .matches(/[a-z]/, "Your password must contain at least one lowercase character.")
    .matches(/[\d]/, "Your password must contain at least one digit.")
    .matches(/[$-/:-?{-~!"^_`[\]#]/, "Your password must contain at least one special character."),
});

const validateAdminUpdateUserInfoForm = (req, res, next) => {
  const formData = req.body;
  formSchema
    .validate(formData)
    .catch((err) => {
      res.status(422).send();
    })
    .then(valid => {
      if (valid) {
        if (formData.password !== "") {
          passwordSchema
            .validate(formData.password)
            .catch((err) => {
              res.status(422).send();
            })
            .then(valid => {
              if (!valid) {
                res.status(422).send();
              }
            })
        }
        next();
      } else {
        res.status(422).send();
      }
    });
};

module.exports = validateAdminUpdateUserInfoForm;