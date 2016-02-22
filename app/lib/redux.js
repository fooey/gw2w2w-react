
import Immutable from 'immutable';
import { createSelectorCreator, defaultMemoize } from 'reselect';

// create a "selector creator" that uses Immutable.is instead of ===
export const createImmutableSelector = createSelectorCreator(
  defaultMemoize,
  Immutable.is
);