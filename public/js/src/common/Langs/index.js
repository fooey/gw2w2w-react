

import React from 'react';

import STATIC from 'lib/static';

import LangLink from './LangLink';






export default ({
    lang,
    world,
}) => (
    <ul className = 'nav navbar-nav'>
        {_.map(STATIC.langs, (linkLang, key) =>
            <LangLink
                key = {key}

                lang = {lang}
                linkLang = {linkLang}
                world = {world}
            />
        )}
    </ul>
);
