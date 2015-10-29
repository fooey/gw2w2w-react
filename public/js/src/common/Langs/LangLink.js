
import React from 'react';
import classnames from 'classnames';


export default ({
    lang,
    linkLang,
    world,
}) =>  (
    <li
        className={getClassname(lang, linkLang)}
        title={linkLang.name}
    >
        <a href={getLink(linkLang, world)}>{linkLang.label}</a>
    </li>
);



function getClassname(lang, linkLang) {
    return classnames({
        active: lang.label === linkLang.label,
    });
}

function getLink(lang, world) {
    const langSlug = lang.slug;

    let link = `/${langSlug}`;

    if (world) {
        const worldSlug = world[langSlug].slug;

        link += `/${worldSlug}`;
    }

    return link;
}
