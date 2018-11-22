const State = require('../../../models/state')
const Joi = require('joi')
const joi = require('../../../middlewares/joi')

const Int = Joi.number().integer()
const ID = Int.min(1)
const validations = Joi.object().keys({
  id: ID,
})

function show(req,res){
  const state = new State(req.joi.id)
  res.json(state.toObj)
}

module.exports = [
  joi(validations),
  show,
]
