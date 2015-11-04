import React from 'react';

export default ({
    obsfuEmail,
}) => (
    <div className='container'>
        <div className='row'>
            <div className='col-xs-24'>
                <footer className='small muted text-center'>
                        <hr />

                        <p>
                            © 2013 ArenaNet, Inc. All rights reserved.
                            NCsoft, the interlocking NC logo, ArenaNet, Guild Wars, Guild Wars Factions, Guild Wars Nightfall, Guild Wars:Eye of the North, Guild Wars 2, and all associated logos and designs are trademarks or registered trademarks of NCsoft Corporation.
                            All other trademarks are the property of their respective owners.
                        </p>

                        <p>
                            Please send comments and bugs to <ObsfuEmail obsfuEmail={obsfuEmail} />
                        </p>

                        <p>
                            Supporting microservices:
                            <a href='http://guilds.gw2w2w.com/'>guilds.gw2w2w.com</a>
                            &nbsp;&ndash;&nbsp;
                            <a href='http://state.gw2w2w.com/'>state.gw2w2w.com</a>
                            &nbsp;&ndash;&nbsp;
                            <a href='http://www.piely.net/'>www.piely.net</a>
                        </p>

                        <p>
                            Source available at <a href='https://github.com/fooey/gw2w2w-react'>https://github.com/fooey/gw2w2w-react</a>
                        </p>
                </footer>
            </div>
        </div>
    </div>
);


const ObsfuEmail = ({obsfuEmail}) => {
    const reconstructed = obsfuEmail.pattern
        .split('')
        .map(ixChunk => obsfuEmail.chunks[ixChunk])
        .join('');

    return <a href={`mailto:${reconstructed}`}>{reconstructed}</a>;
};