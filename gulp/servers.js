import {spawn} from 'child_process';
import path from 'path';

import gulp from 'gulp';
import gutil from 'gulp-util';


const nodeInstances = {};

const DEFAULT_ENV = {
    NODE_ENV: 'development',
    NODE_PATH: path.resolve('./'),
    PORT: '8080',
};



export default function createServerTask(server, livereload) {
    if (Array.isArray(server)) {
        return server.map(s => createServerTask(s, livereload));
    }


    const taskName = `server::${server.entry}`;
    const dependencies = server.dependencies ? server.dependencies : [];
    const env = Object.assign({}, DEFAULT_ENV, server.env);

    gulp.task(taskName, [...dependencies], cb => {
        return startServer(
            server.entry,
            env,
            livereload,
            cb
        );
    });



    if (server.watch) {
        gulp
            // .watch(server.watch, [taskName])
            .watch(
                server.watch,
                e => startServer(
                    server.entry,
                    env,
                    livereload,
                    () => console.log(`Watch event '${e.type}' on '${e.path}'`)
                )
            );
            // .on('change', event => {
            //     console.log(`File ${event.path} was ${event.type}, running tasks...`);
            // });
    }


    return taskName;
}




function startServer(entry, env, livereload, cb = () => null) {

    if (nodeInstances[entry]) {
        gutil.log('KILL PROCESS', entry);
        nodeInstances[entry].kill();
    }

    gutil.log('Spawn process', entry);
    nodeInstances[entry] = spawn('node', [entry], {stdio: 'inherit', env})
        .on('error', err => gutil.log('PROCESS ERROR', entry, err))
        .on('message', msg => gutil.log('PROCESS message', entry, msg))
        .on('close', code => {
            if (code === 8) {
                gutil.log('PROCESS CLOSE', entry, code);
            }
        });


    setTimeout(() => livereload.reload(''), 500);

    return cb();
}
