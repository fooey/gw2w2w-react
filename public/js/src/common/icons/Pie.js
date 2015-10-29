
import React from 'react';


/*
 * Component Globals
 */

const INSTANCE = {
    size  : 60,
    stroke: 2,
};


export default ({scores}) => (
    <img
        src = {getImageSource(scores)}

        width = {INSTANCE.size}
        height = {INSTANCE.size}
    />
);


function getImageSource(scores) {
    return `http:\/\/www.piely.net\/${INSTANCE.size}\/${scores.red},${scores.blue},${scores.green}?strokeWidth=${INSTANCE.stroke}`;
}
