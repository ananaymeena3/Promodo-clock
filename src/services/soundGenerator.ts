// Web Audio API Sound Synthesizer & Ambient Sound Engine

class SoundEngine {
  private ctx: AudioContext | null = null;
  private ambientSourceNodes: AudioNode[] = [];
  private ambientGainNode: GainNode | null = null;
  private currentTrack: string | null = null;
  private isAmbientPlaying = false;
  private ambientVolume = 0.5;

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // --- Notification Sound Synthesizers ---

  public playTimerFinishSound() {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      
      // Chime sequence: G5 -> C6 -> E6 -> G6
      const notes = [783.99, 1046.50, 1318.51, 1567.98];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.15);
        
        gain.gain.setValueAtTime(0, now + idx * 0.15);
        gain.gain.linearRampToValueAtTime(0.3, now + idx * 0.15 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.15 + 0.8);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(now + idx * 0.15);
        osc.stop(now + idx * 0.15 + 0.85);
      });
    } catch (e) {
      console.warn('Audio play failed', e);
    }
  }

  public playClickSound() {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.04);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch (e) {}
  }

  public playAchievementSound() {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);
        gain.gain.setValueAtTime(0, now + idx * 0.1);
        gain.gain.linearRampToValueAtTime(0.3, now + idx * 0.1 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.65);
      });
    } catch (e) {}
  }

  // --- Ambient Generators ---

  public startAmbient(track: string, volume: number = 0.5) {
    this.stopAmbient();
    const ctx = this.getContext();
    this.currentTrack = track;
    this.ambientVolume = volume;
    this.isAmbientPlaying = true;

    this.ambientGainNode = ctx.createGain();
    this.ambientGainNode.gain.setValueAtTime(volume, ctx.currentTime);
    this.ambientGainNode.connect(ctx.destination);

    if (track === 'rain') {
      this.createRainSound();
    } else if (track === 'ocean') {
      this.createOceanSound();
    } else if (track === 'whitenoise') {
      this.createWhiteNoise();
    } else if (track === 'forest') {
      this.createForestSound();
    } else if (track === 'coffee') {
      this.createCoffeeShopSound();
    } else if (track === 'lofi') {
      this.createLofiDrone();
    }
  }

  public stopAmbient() {
    this.ambientSourceNodes.forEach(node => {
      try {
        if ('stop' in node && typeof (node as any).stop === 'function') {
          (node as any).stop();
        }
        node.disconnect();
      } catch (e) {}
    });
    this.ambientSourceNodes = [];
    this.isAmbientPlaying = false;
    this.currentTrack = null;
  }

  public setAmbientVolume(val: number) {
    this.ambientVolume = val;
    if (this.ambientGainNode && this.ctx) {
      this.ambientGainNode.gain.setValueAtTime(val, this.ctx.currentTime);
    }
  }

  private createPinkNoiseBuffer(ctx: AudioContext): AudioBuffer {
    const bufferSize = 4 * ctx.sampleRate;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      data[i] *= 0.11;
      b6 = white * 0.115926;
    }
    return buffer;
  }

  private createRainSound() {
    const ctx = this.getContext();
    const noiseBuffer = this.createPinkNoiseBuffer(ctx);
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1000;

    noiseSource.connect(filter);
    filter.connect(this.ambientGainNode!);

    noiseSource.start();
    this.ambientSourceNodes.push(noiseSource, filter);
  }

  private createOceanSound() {
    const ctx = this.getContext();
    const noiseBuffer = this.createPinkNoiseBuffer(ctx);
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400;

    // Modulate filter frequency to simulate waves
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.12; // wave speed
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 350;

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    noiseSource.connect(filter);
    filter.connect(this.ambientGainNode!);

    noiseSource.start();
    lfo.start();
    this.ambientSourceNodes.push(noiseSource, filter, lfo, lfoGain);
  }

  private createWhiteNoise() {
    const ctx = this.getContext();
    const bufferSize = 2 * ctx.sampleRate;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.1;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;
    noiseSource.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1200;

    noiseSource.connect(filter);
    filter.connect(this.ambientGainNode!);

    noiseSource.start();
    this.ambientSourceNodes.push(noiseSource, filter);
  }

  private createForestSound() {
    const ctx = this.getContext();
    // Soft wind background
    const noiseBuffer = this.createPinkNoiseBuffer(ctx);
    const wind = ctx.createBufferSource();
    wind.buffer = noiseBuffer;
    wind.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 600;
    filter.Q.value = 1;

    wind.connect(filter);
    filter.connect(this.ambientGainNode!);

    wind.start();
    this.ambientSourceNodes.push(wind, filter);
  }

  private createCoffeeShopSound() {
    const ctx = this.getContext();
    // Warm low rumble murmur noise
    const noiseBuffer = this.createPinkNoiseBuffer(ctx);
    const source = ctx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 700;

    source.connect(filter);
    filter.connect(this.ambientGainNode!);

    source.start();
    this.ambientSourceNodes.push(source, filter);
  }

  private createLofiDrone() {
    const ctx = this.getContext();
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();

    osc1.type = 'sine';
    osc1.frequency.value = 130.81; // C3
    osc2.type = 'triangle';
    osc2.frequency.value = 196.00; // G3

    filter.type = 'lowpass';
    filter.frequency.value = 400;

    const gain1 = ctx.createGain();
    gain1.gain.value = 0.15;

    osc1.connect(gain1);
    osc2.connect(gain1);
    gain1.connect(filter);
    filter.connect(this.ambientGainNode!);

    osc1.start();
    osc2.start();
    this.ambientSourceNodes.push(osc1, osc2, gain1, filter);
  }
}

export const soundEngine = new SoundEngine();
