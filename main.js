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

document.addEventListener('DOMContentLoaded', () => {
    // Check if Web MIDI is supported
    if (navigator.requestMIDIAccess) {
        // Prompt the user to connect a MIDI device
        const connectBtn = document.getElementById('connectBtn');
        connectBtn.addEventListener('click', connectMIDI);
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

function onMIDISuccess(midiAccess) {
    const outputs = midiAccess.outputs.values();
    for (let output of outputs) {
        console.log(output)
        if(output.name === 'Launchpad') {
            launchpads.push(output);
            //input.onmidimessage = onMIDIMessage;
        }
        let message = [0x90, 0, LED_VALUES.GREEN];
        output.send(message);

        message[1] = 1;
        message[2] = LED_VALUES.AMBER;
        output.send(message)

        message[1] = 2;
        message[2] = LED_VALUES.RED;
        output.send(message)
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
