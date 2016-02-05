
import React from'react';




export default ({
    color,
    type,
}) => (
    <span className = {`sprite ${type} ${color}`} />
);