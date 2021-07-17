const express = require('express');
const Ajv = require('ajv');
const { default: ValidationError } = require('ajv/dist/runtime/validation_error');

const router = express.Router();
const ajv = new Ajv()

router.post('/', function(req, res, next) {
  const { body } = req;

  const schema = {
    type: "object",
      properties: {
        name: { type: "string" },
        lastname: { type: "string" },
        address: { type: "string" }
      },
    additionalProperties: false,
  }

  const validate = ajv.compile(schema)
  const valid = validate(body)

  if (valid) console.log(body)
  else res.send({ status: 'invalid data', payload: { error: validate.errors} })

});

module.exports = router;
