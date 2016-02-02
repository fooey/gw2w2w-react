
import path from 'path';


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

    const morgan       = require('morgan');
    const compression  = require('compression');
    const errorhandler = require('errorhandler');


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




    return app;
};
