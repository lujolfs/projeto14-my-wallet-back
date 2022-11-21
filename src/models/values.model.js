import joi from "joi";

export const valuesSchema = joi.object({
  amount:     joi.number().min(0),
  description: joi.string().required()
});
