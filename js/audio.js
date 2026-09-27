/* --- Web Audio API Synthesizer Soundscape --- */
let audioCtx = null;
let isPlaying = false;
let masterGain = null;

// Node references
let windGain = null;
let harpGain = null;
let streamGain = null;
let birdsGain = null;

let harpInterval = null;
let birdInterval = null;

function initAudio() {
    if (audioCtx) return;

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();

    // Master Gain
    masterGain = audioCtx.createGain();
    masterGain.gain.value = parseFloat(document.getElementById('masterVolume').value);
    masterGain.connect(audioCtx.destination);

    // 1. Wind Generator (Filtered Pink Noise)
    const bufferSize = audioCtx.sampleRate * 2;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
        let white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        output[i] *= 0.05;
        b6 = white * 0.115926;
    }

    const windSource = audioCtx.createBufferSource();
    windSource.buffer = noiseBuffer;
    windSource.loop = true;

    const windFilter = audioCtx.createBiquadFilter();
    windFilter.type = 'lowpass';
    windFilter.frequency.value = 400;

    windGain = audioCtx.createGain();
    windGain.gain.value = parseFloat(document.getElementById('windSlider').value);

    windSource.connect(windFilter);
    windFilter.connect(windGain);
    windGain.connect(masterGain);
    windSource.start();

    // LFO for wind swelling effect
    const lfo = audioCtx.createOscillator();
    lfo.frequency.value = 0.15; // Slow breeze pulse
    const lfoGain = audioCtx.createGain();
    lfoGain.gain.value = 200;
    lfo.connect(lfoGain);
    lfoGain.connect(windFilter.frequency);
    lfo.start();

    // 2. Stream Water Generator
    const streamSource = audioCtx.createBufferSource();
    streamSource.buffer = noiseBuffer;
    streamSource.loop = true;

    const streamFilter = audioCtx.createBiquadFilter();
    streamFilter.type = 'bandpass';
    streamFilter.frequency.value = 800;
    streamFilter.Q.value = 1.2;

    streamGain = audioCtx.createGain();
    streamGain.gain.value = parseFloat(document.getElementById('streamSlider').value);

    streamSource.connect(streamFilter);
    streamFilter.connect(streamGain);
    streamGain.connect(masterGain);
    streamSource.start();

    // 3. Harp Strings Synth Setup
    harpGain = audioCtx.createGain();
    harpGain.gain.value = parseFloat(document.getElementById('harpSlider').value);
    harpGain.connect(masterGain);

    // 4. Birds Synth Setup
    birdsGain = audioCtx.createGain();
    birdsGain.gain.value = parseFloat(document.getElementById('birdsSlider').value);
    birdsGain.connect(masterGain);
}

// Pentatonic Scale Frequencies for mystical Harp sound
const harpScale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99];

function triggerHarpNote() {
    if (!isPlaying || !audioCtx) return;

    const freq = harpScale[Math.floor(Math.random() * harpScale.length)];
    const osc = audioCtx.createOscillator();
    const noteGain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    noteGain.gain.setValueAtTime(0.01, audioCtx.currentTime);
    noteGain.gain.exponentialRampToValueAtTime(0.3, audioCtx.currentTime + 0.05);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 2.5);

    osc.connect(noteGain);
    noteGain.connect(harpGain);

    osc.start();
    osc.stop(audioCtx.currentTime + 2.6);
}

function triggerBirdChirp() {
    if (!isPlaying || !audioCtx) return;

    const osc = audioCtx.createOscillator();
    const chirpGain = audioCtx.createGain();

    const startFreq = 2200 + Math.random() * 800;
    const endFreq = startFreq + (Math.random() * 600 - 300);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(startFreq, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(endFreq, audioCtx.currentTime + 0.12);

    chirpGain.gain.setValueAtTime(0.01, audioCtx.currentTime);
    chirpGain.gain.linearRampToValueAtTime(0.15, audioCtx.currentTime + 0.03);
    chirpGain.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 0.12);

    osc.connect(chirpGain);
    chirpGain.connect(birdsGain);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.13);
}

function toggleSound() {
    if (!audioCtx) initAudio();

    isPlaying = !isPlaying;

    const masterIcon = document.getElementById('masterIcon');
    const quickIcon = document.getElementById('quickIcon');
    const statusTitle = document.getElementById('soundStatusTitle');
    const statusSub = document.getElementById('soundStatusSub');
    const quickText = document.getElementById('quickPlayText');

    if (isPlaying) {
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        masterGain.gain.setValueAtTime(parseFloat(document.getElementById('masterVolume').value), audioCtx.currentTime);

        masterIcon.setAttribute('data-lucide', 'pause');
        quickIcon.setAttribute('data-lucide', 'pause');
        statusTitle.innerText = "Âm Thanh Đang Phát";
        statusSub.innerText = "Tận hưởng giai điệu thư thái từ thung lũng";
        quickText.innerText = "TẠM DỪNG ÂM THANH";

        // Interval loops for ambient notes
        clearInterval(harpInterval);
        clearInterval(birdInterval);

        harpInterval = setInterval(() => {
            if (isPlaying && Math.random() > 0.3) triggerHarpNote();
        }, 1200);

        birdInterval = setInterval(() => {
            if (isPlaying && Math.random() > 0.5) triggerBirdChirp();
        }, 2500);

    } else {
        // Tắt triệt để âm thanh
        clearInterval(harpInterval);
        clearInterval(birdInterval);
        harpInterval = null;
        birdInterval = null;

        if (masterGain) {
            masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
        }
        if (audioCtx && audioCtx.state === 'running') {
            audioCtx.suspend();
        }

        masterIcon.setAttribute('data-lucide', 'play');
        quickIcon.setAttribute('data-lucide', 'music');
        statusTitle.innerText = "Âm Thanh Đang Tắt";
        statusSub.innerText = "Nhấn nút để bật trải nghiệm âm hưởng thiên nhiên";
        quickText.innerText = "PHÁT NHẠC THIÊN NHIÊN";
    }
    lucide.createIcons();
}

document.getElementById('masterPlayBtn').addEventListener('click', toggleSound);
document.getElementById('quickPlayBtn').addEventListener('click', toggleSound);

// Volume Sliders Bindings
document.getElementById('masterVolume').addEventListener('input', (e) => {
    if (masterGain && isPlaying) masterGain.gain.value = parseFloat(e.target.value);
});

document.getElementById('windSlider').addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    if (windGain) windGain.gain.value = val;
    document.getElementById('windVal').innerText = Math.round(val * 100) + '%';
});

document.getElementById('harpSlider').addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    if (harpGain) harpGain.gain.value = val;
    document.getElementById('harpVal').innerText = Math.round(val * 100) + '%';
});

document.getElementById('streamSlider').addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    if (streamGain) streamGain.gain.value = val;
    document.getElementById('streamVal').innerText = Math.round(val * 100) + '%';
});

document.getElementById('birdsSlider').addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    if (birdsGain) birdsGain.gain.value = val;
    document.getElementById('birdsVal').innerText = Math.round(val * 100) + '%';
});

// Sound Presets
function setSoundPreset(type) {
    const wind = document.getElementById('windSlider');
    const harp = document.getElementById('harpSlider');
    const stream = document.getElementById('streamSlider');
    const birds = document.getElementById('birdsSlider');

    if (type === 'dawn') {
        wind.value = 0.4; harp.value = 0.6; stream.value = 0.4; birds.value = 0.8;
    } else if (type === 'twilight') {
        wind.value = 0.7; harp.value = 0.3; stream.value = 0.5; birds.value = 0.1;
    } else if (type === 'meditation') {
        wind.value = 0.3; harp.value = 0.7; stream.value = 0.2; birds.value = 0.0;
    }

    wind.dispatchEvent(new Event('input'));
    harp.dispatchEvent(new Event('input'));
    stream.dispatchEvent(new Event('input'));
    birds.dispatchEvent(new Event('input'));

    if (!isPlaying) toggleSound();
}