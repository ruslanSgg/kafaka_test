const Joi = require('joi')

module.exports = function useJoi(schema) {
  validate.schema = schema
  function validate(req, res, next) {
    var validation = schema
    if(!schema.isJoi) {
      const role = (req.payload && req.payload.role) || 'user'
      validation = Joi.object().keys(schema[role] || schema.common)
    }
    var data = Object.assign({}, req.body, req.query, req.params)
    Joi.validate(data, validation, {stripUnknown: {objects: true}}, (err, value) => {
      if(err) {
        const [ error ] = err.details

        const namespace = ['@validation', 'error']

        return res
          .status(422)
          .json({
            message: namespace.concat(error.path).concat(error.type).join('.'),
            details: error.context,
            error: error.message,
          })
      }
      req.joi = value
      return next()
    })
  }
  return validate
}