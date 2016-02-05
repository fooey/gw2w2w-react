import { worlds } from 'lib/static';


export function getWorldFromSlug(langSlug, worldSlug) {
    // console.log('getWorldFromSlug()', langSlug, worldSlug);

    const world = _.find(
        worlds,
        w => w[langSlug].slug === worldSlug
    );

    return {
        id: world.id,
        ...world[langSlug],
    };
}