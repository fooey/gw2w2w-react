import React from 'react';
import Perf from 'react-addons-perf';

export default class Performance extends React.Component {
    onStart() {
        Perf.start();
        console.log('Perf started');
    }

    onStop() {
        Perf.stop();
        console.log('Perf stopped');
        const lastMeasurements = Perf.getLastMeasurements();
        // console.dir(lastMeasurements);
        // Perf.printDOM(lastMeasurements);
        Perf.printInclusive(lastMeasurements);
        Perf.printExclusive(lastMeasurements);
        Perf.printWasted(lastMeasurements);
    }


    render() {
        return (
            <p>
                <strong>Performance: </strong>
                <button onClick={this.onStart}>Start</button>
                <button onClick={this.onStop}>Stop</button>
            </p>
        );
    }
}