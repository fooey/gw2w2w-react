
import path from 'path';

import morgan from 'morgan';
import compression from 'compression';
import errorhandler from 'errorhandler';

import { unHashifyMiddleware } from 'lib/cacheBust';


export function createExpressApp(express, nodeEnv) {
    const app = express();

    const isDev  = (nodeEnv === 'development');
    // const isProd = !isDev;

    app.set('env', nodeEnv);




    /*
    *
    *   Views
    *
    */

    app.set('views', path.normalize(path.join(process.cwd(), 'views')));
    // app.set('view engine', 'jade');
    app.set('case sensitive', true);
    app.set('strict routing', true);
    // app.engine('jade', require('jade').__express);





    /*
    *
    *   Middleware
    *
    */

    if (isDev) {
        app.use(errorhandler());
        app.use(morgan('dev'));
        app.set('view cache', false);
    }
    else {
        app.use(morgan('combined'));
        app.set('view cache', true);
    }

    app.use(compression());
    app.use(unHashifyMiddleware());




    return app;
};
