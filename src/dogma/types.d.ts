import { DOGMA_COMPONENTS_LIST, DOGMA_SYSTEM_LIST } from "./dogma";

export type DogmaSystemsKeys = keyof Omit<
  typeof DOGMA_SYSTEM_LIST,
  "AbstractSystem"
>;
export type DogmaComponentsKeys = keyof Omit<
  typeof DOGMA_COMPONENTS_LIST,
  "AbstractComponent"
>;
export type DogmaSystems = keyof typeof DOGMA_SYSTEM_LIST;
export type DogmaComponents = keyof typeof DOGMA_COMPONENTS_LIST;
