
import Immutable from 'immutable';
import {
    createSelector,
    createSelectorCreator,
    defaultMemoize,
 } from 'reselect';



// create a "selector creator" that uses Immutable.is instead of ===
export const createImmutableSelector = createSelectorCreator(
  defaultMemoize,
  Immutable.is
);



/*
    const mapStateToProps = mapSelectorsToProps({
        key: selector,
        key2: selector2,
    });

    to

    const mapStateToProps = createSelector(
        ..selectors,
        (...keys) => ({...keys})
    );
*/

export const mapSelectorsToProps = (selectorsMap, selectorCreator = createSelector) => {
    const keys = Object.keys(selectorsMap);
    const selectors = keys.map(k => selectorsMap[k]);

    return () => selectorCreator(
        ...selectors,
        (...args) => keys.reduce(
            (result, val, i) =>
            ({ ...result, [val]: args[i] }), {})
    );
};

export const mapImmutableSelectorsToProps = (selectorsMap) => mapSelectorsToProps(selectorsMap, createImmutableSelector);