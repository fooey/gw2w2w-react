export const setRoute = (ctx) => {
    return {
        type: 'SET_ROUTE',
        path: ctx.path,
        params: ctx.params,
    };
};
