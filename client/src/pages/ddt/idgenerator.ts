// idGenerator.ts
let lastId = 0;

export const getId = (): number => {
  lastId += 1;
  return lastId;
};