
export const setWorld = (langSlug, worldSlug) => {
    // console.log('action::setWorld', langSlug, worldSlug);

    return {
        type: 'SET_WORLD',
        langSlug,
        worldSlug,
    };
};
