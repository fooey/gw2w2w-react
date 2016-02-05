
export const setLang = slug => {
    // console.log('action::setLang', slug);

    return {
        type: 'SET_LANG',
        slug,
    };
};
