import fs from 'fs-extra';
import path from 'path';;

const buildPath = './app/build';


const paths    = {};

paths.public   = './app/public';

paths.css      = {};
paths.css.src  = './app/css';
paths.css.dist = `${buildPath}/css`;

paths.js       = {};
paths.js.src   = './app';
paths.js.dist = `${buildPath}/js`;


fs.ensureDirSync(path.resolve(buildPath));
fs.ensureDirSync(path.resolve(paths.css.dist));
fs.ensureDirSync(path.resolve(paths.js.dist));



export default {
    paths,
};