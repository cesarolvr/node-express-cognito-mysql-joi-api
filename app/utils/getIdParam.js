import Joi from "joi";

export const getIdParam = (params) => {
  if (!params) return null;

  const paramsChecked = Joi.object({
    id: Joi.string(),
  });

  const paramsValidation = paramsChecked.validate(params);

  const id = paramsValidation.value.id;

  return id;
};
