
import fs from 'fs-extra';
import path from 'path';

// export const regexHashInDir  = /\/~[A-Za-z0-9_-]{7,14}~\//;  // /~asdf~/*
export const regexHashInFile = /\.~[A-Za-z0-9_-]{7,14}~\./;  // filename.~asdf~.ext


export function getUrlHashified(urlPath, filePath) {
    const fullPath = path.resolve(filePath);
    const { dir, name, ext } = path.parse(urlPath);

    const modifiedHash = getModifiedHash(fullPath);

    const hashToken = `~${modifiedHash}~`;
    const hashName = `${name}.${hashToken}${ext}`;
    const hashPath =  `${dir}/${hashName}`;

    return hashPath;
}


export function getModifiedHash(fullPath) {
    const fileStats = fs.statSync(fullPath);
    const timestamp = fileStats.mtime.getTime();
    const modifiedHash = timestamp.toString(36);

    return modifiedHash;
}


export function unHashifyMiddleware() {
    return (req, res, next) => {
        if (req.url.match(regexHashInFile)) {
            req.url = req.url.replace(regexHashInFile, '.');
        }
        // else if (req.url.match(regexHashInDir)) {
        //     req.url = req.url.replace(regexHashInDir, '/');
        // }

        next();
    };
}