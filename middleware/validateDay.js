const Joi = require('joi')

module.exports = function (req, res, next) {
  if (req.query.day) {
    const schema = {
      day: Joi.string()
      .valid(
        'monday', 'tuesday', 'wednesday', 
        'thursday', 'friday', 'saturday', 'sunday'
      ).required().insensitive()
    }
    let error = Joi.validate(req.query,schema).error;
  
    if (error) return res.status(400).send(error.details[0].message)
    
    req.query.day = req.query.day.toLowerCase();
  }
  next();

}
 