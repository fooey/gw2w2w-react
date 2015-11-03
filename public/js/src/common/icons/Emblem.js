
import React from'react';

const imgPlaceholder = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"></svg>';




export default ({
    guildId,
    size,
    className = '',
}) => {
    return (
        <img
            className = {`emblem ${className}`}

            src = {getEmblemSrc(guildId)}
            width = {size ? size : null}
            height = {size ? size : null}

            onError   = {imgOnError}
        />
    );
};

function getEmblemSrc(guildId) {
    return `https://guilds.gw2w2w.com/${guildId}.svg`;
}





function imgOnError(e) {
    const currentSrc = $(e.target).attr('src');

    if (currentSrc !== imgPlaceholder) {
        $(e.target).attr('src', imgPlaceholder);
    }
}
