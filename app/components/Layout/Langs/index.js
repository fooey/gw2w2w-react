
import React from 'react';

import { langs } from 'lib/static';

import LangLink from './LangLink';




const Langs = () => (
    <div id='nav-langs' className='pull-right'>
        <ul className = 'nav navbar-nav'>
            {_.map(langs, (lang, key) =>
                <LangLink key={key} lang={lang} />
            )}
        </ul>
    </div>
);



export default Langs;