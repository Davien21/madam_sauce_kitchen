// This function takes in a joi validator function and
// uses it to validate the body of a request

module.exports = validate = (validator) => {
  return (req, res, next) => {
    const { error } = validator(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    if (req.body.day) req.body.day = req.body.day.toLowerCase()
    
    next();
  }
}
