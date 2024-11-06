import { DOGMA_SYSTEM_LIST } from "./dogma";

export type DogmaSystemsKeys = keyof Omit<
  typeof DOGMA_SYSTEM_LIST,
  "AbstractSystem"
>;
export type DogmaSystems = keyof typeof DOGMA_SYSTEM_LIST;
export type EntityID = string;
