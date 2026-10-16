import { menuCategories } from '../../../../src/data/menu.js';

export const modelRegistry = Object.fromEntries(
  menuCategories.map(({ id, image }) => [
    id,
    { src: `/models/${id}.gltf`, image, hasModel: true, hasAR: true },
  ]),
);

export const getModelInfo = (categoryId) => {
  return modelRegistry[categoryId] || null;
};

export const hasModel = (categoryId) => {
  return Boolean(modelRegistry[categoryId]?.hasModel);
};

export const hasAR = (categoryId) => {
  return Boolean(modelRegistry[categoryId]?.hasAR);
};
