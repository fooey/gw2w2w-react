import React from 'react';

export default ({env, staticCacheBusted}) => (
<html>
    <head>
        <meta charSet='utf-8' />
        <meta name='viewport'  content='width=device-width, initial-scale=1' />

        <title>gw2w2w</title>

        <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.2.0/css/font-awesome.min.css' />
        <link rel='stylesheet' href={staticCacheBusted('/css/dist/bootstrap.min.css', 'public/css/dist/bootstrap.min.css')} />
        {(env.NODE_ENV === 'development')
            ? <link rel='stylesheet' href={staticCacheBusted('/css/dist/app.css', 'public/css/dist/app.css')} />
            : <link rel='stylesheet' href={staticCacheBusted('/css/dist/app.min.css', 'public/css/dist/app.min.css')} />
        }
    </head>
    <body>
        <div id='react-app' />


        <script src='https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.0.1/lodash.min.js' />
        <script src='https://cdnjs.cloudflare.com/ajax/libs/async/1.5.2/async.min.js' />
        <script src='https://cdnjs.cloudflare.com/ajax/libs/page.js/1.6.4/page.min.js' />

        <script src='https://cdnjs.cloudflare.com/ajax/libs/superagent/1.2.0/superagent.min.js' />
        <script src='https://cdnjs.cloudflare.com/ajax/libs/numeral.js/1.5.3/numeral.min.js' />
        <script src='https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.11.1/moment.min.js' />
        <script src='https://cdnjs.cloudflare.com/ajax/libs/classnames/2.2.0/index.min.js' />

        {(env.NODE_ENV === 'development')
            ? <div>
                <script src='https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.3.14/polyfill.js' />
                <script src='https://cdnjs.cloudflare.com/ajax/libs/react/0.14.6/react.js' />
                <script src='https://cdnjs.cloudflare.com/ajax/libs/react/0.14.6/react-dom.js' />
                <script src={staticCacheBusted('/js/dist/app.js', 'public/js/dist/app.js')} />
            </div>
            : <div>
                <script src='https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.3.14/polyfill.min.js' />
                <script src='https://cdnjs.cloudflare.com/ajax/libs/react/0.14.6/react.min.js' />
                <script src='https://cdnjs.cloudflare.com/ajax/libs/react/0.14.6/react-dom.min.js' />
                <script src={staticCacheBusted('/js/dist/app.min.js', 'public/js/dist/app.min.js')} />
            </div>
        }

        <script dangerouslySetInnerHTML={{__html: `
            (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
            (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
            m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
            })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
            ga('create', 'UA-51384-37', 'auto');
            ga('send', 'pageview');
        `}}/>
    </body>
</html>
);