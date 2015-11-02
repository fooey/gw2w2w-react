
import React from'react';

const imgPlaceholder = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"></svg>';




export default ({
    guildName,
    size = 256,
}) => {
    return (
        <img
            className = 'emblem'

            src       = {getEmblemSrc(guildName)}
            width     = {size}
            height    = {size}

            onError   = {imgOnError}
        />
    );
};

function getEmblemSrc(guildName) {
    return (guildName)
        ? `https:\/\/guilds.gw2w2w.com\/guilds\/${slugify(guildName)}\/256.svg`
        : imgPlaceholder;
}



function slugify(str) {
    return encodeURIComponent(str.replace(/ /g, '-')).toLowerCase();
}



function imgOnError(e) {
    const currentSrc = $(e.target).attr('src');

    if (currentSrc !== imgPlaceholder) {
        $(e.target).attr('src', imgPlaceholder);
    }
}
