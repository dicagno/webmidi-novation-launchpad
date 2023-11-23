let launchpads = [];

// reference: https://fael-downloads-prod.focusrite.com/customer/prod/downloads/launchpad-programmers-reference.pdf
const LED_VALUES = {
    OFF: 12,
    RED_LOW: 13,
    RED: 15,
    AMBER_LOW: 29,
    AMBER: 63,
    YELLOW: 62,
    GREEN_LOW: 28,
    GREEN: 60
}

const launchpadMap = [
    [0, 1, 2, 3, 4, 5, 6, 7],
    [16, 17, 18, 19, 20, 21, 22, 23],
    [32, 33, 34, 35, 36, 37, 38, 39],
    [48, 49, 50, 51, 52, 53, 54, 55],
    [64, 65, 66, 67, 68, 69, 70, 71],
    [80, 81, 82, 83, 84, 85, 86, 87],
    [96, 97, 98, 99, 100, 101, 102, 103],
    [112, 113, 114, 115, 116, 117, 118, 119],

]

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

document.addEventListener('DOMContentLoaded', () => {
    // Check if Web MIDI is supported
    if (navigator.requestMIDIAccess) {
        // Prompt the user to connect a MIDI device
        const connectBtn = document.getElementById('connectBtn');
        const startSequenceBtn = document.getElementById('startSequenceBtn');
        connectBtn.addEventListener('click', connectMIDI);
        startSequenceBtn.addEventListener('click', onClick);
    } else {
        console.log('Web MIDI is not supported in this browser.');
    }

    // navigator.permissions.query({ name: "midi", sysex: true }).then((result) => {
    //     if (result.state === "granted") {
    //         const connectBtn = document.getElementById('connectBtn');
    //         connectBtn.addEventListener('click', connectMIDI);
    //     } else if (result.state === "prompt") {
    //         // Using API will prompt for permission
    //     }
    //     // Permission was denied by user prompt or permission policy
    // });
});

function connectMIDI() {
    navigator.requestMIDIAccess()
        .then(onMIDISuccess)
        .catch(onMIDIFailure);
}

const stepPos = [0, 0, 0, 0, 0, 0, 0, 0];

async function runSequenceAtRowId([rowFrom, rowTo], color, interval = 100) {
    for (let colId = 0; colId < 8; colId++) {
        for (let rowId = rowFrom; rowId <= rowTo; rowId++) {
            const row = launchpadMap[rowId];
            const midiOutput = launchpads[0].output;
            const pixelId = row[colId];
            midiOutput.send([0x90, pixelId, color]);
        }
        await sleep(interval);
        for (let rowId = rowFrom; rowId <= rowTo; rowId++) {
            const row = launchpadMap[rowId];
            const midiOutput = launchpads[0].output;
            const pixelId = row[colId];
            midiOutput.send([0x90, pixelId, LED_VALUES.OFF]);
        }
    }
}

async function onClick() {
    for (; ;) {
        await runSequenceAtRowId([0, 7], LED_VALUES.RED, 500);
    }
}

function onMIDISuccess(midiAccess) {
    const outputs = midiAccess.outputs.values();
    for (let output of outputs) {
        console.log(output.name)
        console.log(outputs)
        if (output.name === 'Launchpad') {
            //TODO: add respective input
            launchpads.push({output});
        }
    }

    console.log('MIDI connection established.');
}

function onMIDIFailure(error) {
    console.error('MIDI connection failed:', error);
}

function onMIDIMessage(event) {
    // Handle MIDI messages here
    // For example:
    console.log('MIDI Message:', event.data);
}
