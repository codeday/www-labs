import random from 'knuth-shuffle-seeded';

export function randomizeJsonSchemaFormDisplay(schema, uiSchema, seed) {
  const keys = Object.keys(schema.properties ?? schema);
  return {
    ...uiSchema,
    "ui:order": [...random(keys, seed), '*'],
  };
}