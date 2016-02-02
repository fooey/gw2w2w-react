import {spawn} from 'child_process';
import path from 'path';

import gulp from 'gulp';


const nodeInstances = {};

const DEFAULT_ENV = {
    NODE_ENV: 'development',
    NODE_PATH: path.resolve('./'),
    PORT: '8080',
};



export default function addServerTask(server, livereload) {
    if (Array.isArray(server)) {
        return server.map(s => addServerTask(s, livereload));
    }


    const taskName = `server::${server.entry}`;

    console.log(
        Date.now(),
        'Starting Server',
        server.entry,
    );

    gulp.task(taskName, [], cb => {
        const env = Object.assign({}, DEFAULT_ENV, server.env);

        livereload.reload();

        return startServer(
            server.entry,
            env,
            livereload,
            cb
        );
    });



    if (server.watch) {
        gulp
            .watch(server.watch, [taskName])
            .on('change', event => {
                console.log(`File ${event.path} was ${event.type}, running tasks...`);
            });
    }


    return taskName;
}




function startServer(entry, env, livereload, cb) {
    console.log('spawn server', entry, env);

    if (nodeInstances[entry]) {
        nodeInstances[entry].kill();
    }

    nodeInstances[entry] = spawn('node', [entry], {
        stdio: 'inherit',
        env,
    });


    setTimeout(() => {
        console.log('livereload.reload()');
        livereload.reload('');
    }, 500);


    nodeInstances[entry].on('error', err => {
        console.log('PROCESS ERROR', entry, err);
    });

    nodeInstances[entry].on('message', msg => {
        console.log('PROCESS message', entry, msg);
    });

    nodeInstances[entry].on('close', code => {
        if (code === 8) {
            console.log('PROCESS CLOSE', entry, code);
        }
    });

    return cb();
}
