export class SoundManager {
    constructor(camera) {
        this.context = new (window.AudioContext || window.webkitAudioContext)();
        this.gainNode = this.context.createGain();
        this.gainNode.connect(this.context.destination);
        this.gainNode.gain.value = 0.5;
    }

    playExplosion() {
        if (this.context.state === 'suspended') {
            this.context.resume();
        }

        const duration = 2.5; // Longer rumble tail

        // 1. Generate White Noise Buffer
        const noiseBuffer = this.context.createBuffer(1, this.context.sampleRate * duration, this.context.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < noiseBuffer.length; i++) {
            // White noise (-1 to 1)
            output[i] = Math.random() * 2 - 1;
        }

        const noiseSrc = this.context.createBufferSource();
        noiseSrc.buffer = noiseBuffer;

        // 2. Lowpass Filter to muffle the noise into a deep rumble
        const noiseFilter = this.context.createBiquadFilter();
        noiseFilter.type = 'lowpass';
        // Start with a mid rumble and quickly drop frequency
        noiseFilter.frequency.setValueAtTime(800, this.context.currentTime);
        noiseFilter.frequency.exponentialRampToValueAtTime(40, this.context.currentTime + duration);

        // 3. Noise Volume Envelope
        const noiseGain = this.context.createGain();
        noiseGain.gain.setValueAtTime(1.0, this.context.currentTime);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + duration);

        noiseSrc.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(this.context.destination);

        // 4. Sub-bass Punch (Sine Wave)
        const osc = this.context.createOscillator();
        const oscGain = this.context.createGain();
        osc.type = 'sine';
        // Impact punch drops fast
        osc.frequency.setValueAtTime(150, this.context.currentTime);
        osc.frequency.exponentialRampToValueAtTime(30, this.context.currentTime + 0.5);

        oscGain.gain.setValueAtTime(1.5, this.context.currentTime);
        oscGain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 1.0);

        osc.connect(oscGain);
        oscGain.connect(this.context.destination);

        // Play all
        noiseSrc.start(this.context.currentTime);
        osc.start(this.context.currentTime);
        osc.stop(this.context.currentTime + 1.0);
    }
}
