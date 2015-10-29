
import React from'react';





export default ({oMeta}) => {
    const imgSrc = getArrowSrc(oMeta);

    return (
        <span className = 'direction'>
            {(imgSrc)
                ? <img src = {imgSrc} />
                : null
            }
        </span>
    );
};





/*
 *
 * Private Methods
 *
 */

function getArrowSrc(meta) {
    if (!meta.get('d')) {
        return null;
    }

    let src = ['/img/icons/dist/arrow'];

    if (meta.get('n')) {
        src.push('north');
    }
    else if (meta.get('s')) {
        src.push('south');
    }

    if (meta.get('w')) {
        src.push('west');
    }
    else if (meta.get('e')) {
        src.push('east');
    }


    return src.join('-') + '.svg';
}




/*
 *
 * Export Module
 *
 */

module.exports = Arrow;
