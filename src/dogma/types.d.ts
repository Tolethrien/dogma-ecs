import DOGMA_CONFIG from "../sandbox/dogma-config";

export type DogmaSystemsKeys = keyof Omit<
  typeof DOGMA_CONFIG.DOGMA_SYSTEM_LIST,
  "AbstractSystem"
>;
export type DogmaComponentsKeys = keyof Omit<
  typeof DOGMA_CONFIG.DOGMA_COMPONENTS_LIST,
  "AbstractComponent"
>;
export type DogmaSystemsKeysInternal = keyof typeof DOGMA_SYSTEM_LIST;
export type DogmaComponentsKeysInternal = keyof typeof DOGMA_COMPONENTS_LIST;
