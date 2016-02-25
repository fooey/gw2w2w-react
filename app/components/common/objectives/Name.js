
import React from'react';

import * as STATIC from 'lib/static';



const ObjectiveName = ({
    id,
    lang,
}) => (
    <span>{STATIC.objectives[id].name[lang.get('slug')]}</span>
);



export default ObjectiveName;