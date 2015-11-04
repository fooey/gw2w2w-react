
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

            src = {`https://guilds.gw2w2w.com/${guildId}.svg`}
            width = {size ? size : null}
            height = {size ? size : null}

            onError = {(e) => (e.target.src = imgPlaceholder)}
        />
    );
};
