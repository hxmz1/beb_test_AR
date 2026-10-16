import { menuCategories } from '../../../../src/data/menu.js';

export const modelRegistry = Object.fromEntries(
  menuCategories.map(({ id, image }) => [
    id,
    { src: `/models/${id}.gltf`, image, hasModel: true, hasAR: true },
  ]),
);

const modelViewers = new Map();

export const getModelInfo = (categoryId) => {
  return modelRegistry[categoryId] || null;
};

export const registerModelViewer = (categoryId, viewer) => {
  if (viewer) {
    modelViewers.set(categoryId, viewer);
  } else {
    modelViewers.delete(categoryId);
  }
};

export const getModelViewer = (categoryId) => modelViewers.get(categoryId) || null;

export const hasModel = (categoryId) => {
  return Boolean(modelRegistry[categoryId]?.hasModel);
};

export const hasAR = (categoryId) => {
  return Boolean(modelRegistry[categoryId]?.hasAR);
};
