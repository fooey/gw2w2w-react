
import React from'react';




const Sprite = ({
    color,
    type,
}) => (
    <span className = {`sprite ${type} ${color}`} />
);

export default Sprite;