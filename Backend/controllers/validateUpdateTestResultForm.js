const Yup = require("yup");

const formSchema = Yup.object({
  testresult: Yup.string()
    .required("Test result required!")
    .matches(/^positive|negative$/, "Please ensure that the chosen test result is valid!"),
});

const validateUpdateTestResultForm = (req, res, next) => {
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

module.exports = validateUpdateTestResultForm;