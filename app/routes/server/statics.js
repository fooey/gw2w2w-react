
import favicon from 'serve-favicon';
import serveStatic from 'serve-static';


export default (app, express) => {


    /*
    *
    * favicon
    *
    */

    app.use(favicon('./assets/img/logo/gw2-dragon-32.png'));




    /*
    *
    * Static Routes
    *
    */

    const staticOptions = {
        dotfiles   : 'deny',
        etag       : true,
        maxAge     : '999d',
        // index   : false,
        // redirect: true,
    };

    app.use(serveStatic('build', staticOptions));
    app.use(serveStatic('assets', staticOptions));

    // app.use('/nm', serveStatic(`${process.cwd()}/node_modules`));
    // app.use('/node_modules', serveStatic(`${process.cwd()}/node_modules`));
    // app.use('/routes', serveStatic(`${process.cwd()}/routes`, staticOptions));
    // app.use('/views', serveStatic(`${process.cwd()}/views`, staticOptions));

    express.static.mime.define({
        'text/plain': ['map'],
        'text/css'  : ['less'],
        'text/jsx'  : ['jsx'],
    });

};
