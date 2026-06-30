import ApiError from '../utils/ApiError.js';

const mapValidationErrors = (details = []) =>
  details.map((detail) => detail.message.replace(/['"]/g, ''));

export const validate = ({ body, query, params }) => (req, _res, next) => {
  const applyValidation = (schema, source, key) => {
    if (!schema) {
      return source;
    }

    const { error, value } = schema.validate(source, {
      abortEarly: false,
      allowUnknown: false,
      stripUnknown: true
    });

    if (error) {
      throw new ApiError(400, 'Validation failed', mapValidationErrors(error.details));
    }

    req[key] = value;
    return value;
  };

  try {
    applyValidation(body, req.body, 'body');
    applyValidation(query, req.query, 'query');
    applyValidation(params, req.params, 'params');
    next();
  } catch (error) {
    next(error);
  }
};

