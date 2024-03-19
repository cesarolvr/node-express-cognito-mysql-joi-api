import Joi from "joi";

export const getParam = (params, key) => {
  if (!params) return null;

  const paramsChecked = Joi.object({
    [key]: Joi.string(),
  });

  const paramsValidation = paramsChecked.validate(params);

  return paramsValidation.value[key];
};
