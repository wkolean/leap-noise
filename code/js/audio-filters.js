(function() {
    var context, soundSource, soundBuffer, 
    url = '/audio/technotime.mp3',
    filter = {},
    freq = 0,
    qual = 0;

    
    // Step 1 - Initialise the Audio Context
    // There can be only one!
    function init() {
        if (typeof AudioContext !== "undefined") {
            context = new AudioContext();
        } else if (typeof webkitAudioContext !== "undefined") {
            context = new webkitAudioContext();
        } else {
            throw new Error('AudioContext not supported. :(');
        }
    }

    // Step 2: Load our Sound using XHR
    function startSound() {
        // Note: this loads asynchronously
        var request = new XMLHttpRequest();
        request.open("GET", url, true);
        request.responseType = "arraybuffer";

        // Our asynchronous callback
        request.onload = function() {
            var audioData = request.response;
            audioGraph(audioData);
        };

        request.send();
    }

    // Finally: tell the source when to start

    function playSound() {
        // play the source now
        // noteOne is depecrated?!?
        soundSource.noteOn(context.currentTime);
    }

    function stopSound() {
        // stop the source now
        soundSource.noteOff(context.currentTime);
    }

    function changeFrequency(){
        console.log(filter.frequency.value)
        var minValue = 40;
        var maxValue = context.sampleRate / 2;
        // Logarithm (base 2) to compute how many octaves fall in the range.
        var numberOfOctaves = Math.log(maxValue / minValue) / Math.LN2;
        // Compute a multiplier from 0 to 1 based on an exponential scale.
        var multiplier = Math.pow(2, numberOfOctaves * (Math.random()- 1.0));
        // Get back to the frequency value between min and max.
        filter.frequency.value = maxValue * multiplier;
    }

    function changeQuality(){

        filter.Q.value = Math.random() * 30;
        console.log(filter.Q.value)
    }

    // Events for the play/stop bottons
    $('.play').click(startSound);
    $('.stop').click(stopSound);
    $('.change-frequency').click(changeFrequency);
    $('.change-quality').click(changeQuality);

    function audioGraph(audioData) {
        soundSource = context.createBufferSource();
        soundBuffer = context.createBuffer(audioData, true);
        soundSource.buffer = soundBuffer;

        filter = context.createBiquadFilter();
        filter.type = 0; //lowpass
        filter.frequency.value = 5000;
        soundSource.connect(filter);
        filter.connect(context.destination);

        volumeNode = context.createGainNode();

        //Set the volume
        volumeNode.gain.value = 0.1;

        // Wiring
        soundSource.connect(volumeNode);
        volumeNode.connect(context.destination);

        // Finally
        playSound(soundSource);
    }


    init();


}());