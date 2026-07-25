// Haven Web Audio Synthesizer & Multi-Channel Ambient Sound Engine
import { SoundChannelId } from '../types';

interface ChannelNodeGroup {
  sourceNodes: AudioNode[];
  gainNode: GainNode;
  filterNode?: BiquadFilterNode;
  lfoNode?: OscillatorNode;
}

class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private channelNodes: Map<SoundChannelId, ChannelNodeGroup> = new Map();
  private channelVolumes: Map<SoundChannelId, number> = new Map();
  private channelMuted: Map<SoundChannelId, boolean> = new Map();

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // --- Chime Synthesizers ---

  public playTimerFinishSound() {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      // Warm chord: C5 -> E5 -> G5 -> B5 -> C6
      const notes = [523.25, 659.25, 783.99, 987.77, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);
        gain.gain.setValueAtTime(0, now + idx * 0.12);
        gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.12 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 1.2);
        osc.connect(gain);
        gain.connect(this.masterGain || ctx.destination);
        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 1.3);
      });
    } catch (e) {}
  }

  public playClickSound() {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(640, now + 0.03);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
      osc.connect(gain);
      gain.connect(this.masterGain || ctx.destination);
      osc.start(now);
      osc.stop(now + 0.04);
    } catch (e) {}
  }

  public playAchievementSound() {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const notes = [392.00, 523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.25, now + idx * 0.08 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.8);
        osc.connect(gain);
        gain.connect(this.masterGain || ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.85);
      });
    } catch (e) {}
  }

  // --- Multi-Channel Synthesizer Audio Engine ---

  public setChannelVolume(id: SoundChannelId, volume: number) {
    this.channelVolumes.set(id, volume);
    const group = this.channelNodes.get(id);
    if (group && this.ctx) {
      const isMuted = this.channelMuted.get(id) || false;
      group.gainNode.gain.setValueAtTime(isMuted ? 0 : volume, this.ctx.currentTime);
    }
  }

  public toggleChannelMute(id: SoundChannelId): boolean {
    const nextMuted = !(this.channelMuted.get(id) || false);
    this.channelMuted.set(id, nextMuted);
    const group = this.channelNodes.get(id);
    if (group && this.ctx) {
      const vol = this.channelVolumes.get(id) ?? 0.5;
      group.gainNode.gain.setValueAtTime(nextMuted ? 0 : vol, this.ctx.currentTime);
    }
    return nextMuted;
  }

  public toggleChannelPlay(id: SoundChannelId): boolean {
    if (this.channelNodes.has(id)) {
      this.stopChannel(id);
      return false;
    } else {
      const vol = this.channelVolumes.get(id) ?? 0.5;
      this.startChannel(id, vol);
      return true;
    }
  }

  public startChannel(id: SoundChannelId, volume: number = 0.5) {
    this.stopChannel(id);
    const ctx = this.getContext();
    const gainNode = ctx.createGain();
    const isMuted = this.channelMuted.get(id) || false;
    gainNode.gain.setValueAtTime(isMuted ? 0 : volume, ctx.currentTime);
    gainNode.connect(this.masterGain!);

    const sourceNodes: AudioNode[] = [];

    switch (id) {
      case 'rain':
        this.buildRainChannel(ctx, gainNode, sourceNodes, 900);
        break;
      case 'heavy_rain':
        this.buildRainChannel(ctx, gainNode, sourceNodes, 1600);
        break;
      case 'thunder':
        this.buildThunderChannel(ctx, gainNode, sourceNodes);
        break;
      case 'fireplace':
        this.buildFireplaceChannel(ctx, gainNode, sourceNodes);
        break;
      case 'forest':
        this.buildForestChannel(ctx, gainNode, sourceNodes);
        break;
      case 'ocean':
        this.buildOceanChannel(ctx, gainNode, sourceNodes);
        break;
      case 'coffeeshop':
        this.buildCoffeeShopChannel(ctx, gainNode, sourceNodes);
        break;
      case 'library':
        this.buildLibraryChannel(ctx, gainNode, sourceNodes);
        break;
      case 'wind':
        this.buildWindChannel(ctx, gainNode, sourceNodes);
        break;
      case 'crickets':
        this.buildCricketsChannel(ctx, gainNode, sourceNodes);
        break;
      case 'snow':
        this.buildSnowChannel(ctx, gainNode, sourceNodes);
        break;
      case 'train':
        this.buildTrainChannel(ctx, gainNode, sourceNodes);
        break;
      case 'whitenoise':
        this.buildNoiseChannel(ctx, gainNode, sourceNodes, 'white');
        break;
      case 'brownnoise':
        this.buildNoiseChannel(ctx, gainNode, sourceNodes, 'brown');
        break;
      case 'pinknoise':
        this.buildNoiseChannel(ctx, gainNode, sourceNodes, 'pink');
        break;
    }

    this.channelNodes.set(id, { sourceNodes, gainNode });
    this.channelVolumes.set(id, volume);
  }

  public stopChannel(id: SoundChannelId) {
    const group = this.channelNodes.get(id);
    if (group) {
      group.sourceNodes.forEach((node) => {
        try {
          if ('stop' in node && typeof (node as any).stop === 'function') {
            (node as any).stop();
          }
          node.disconnect();
        } catch (e) {}
      });
      group.gainNode.disconnect();
      this.channelNodes.delete(id);
    }
  }

  public stopAllChannels() {
    Array.from(this.channelNodes.keys()).forEach((id) => this.stopChannel(id));
  }

  public setMasterVolume(vol: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(vol, this.ctx.currentTime);
    }
  }

  // --- Noise Buffer Helpers ---

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
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }
    return buffer;
  }

  private createBrownNoiseBuffer(ctx: AudioContext): AudioBuffer {
    const bufferSize = 4 * ctx.sampleRate;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5;
    }
    return buffer;
  }

  private createWhiteNoiseBuffer(ctx: AudioContext): AudioBuffer {
    const bufferSize = 2 * ctx.sampleRate;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.15;
    }
    return buffer;
  }

  // --- Channel Builders ---

  private buildRainChannel(ctx: AudioContext, masterOut: GainNode, nodes: AudioNode[], cutoff: number) {
    const noiseBuffer = this.createPinkNoiseBuffer(ctx);
    const source = ctx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = cutoff;

    source.connect(filter);
    filter.connect(masterOut);
    source.start();
    nodes.push(source, filter);
  }

  private buildThunderChannel(ctx: AudioContext, masterOut: GainNode, nodes: AudioNode[]) {
    const noiseBuffer = this.createBrownNoiseBuffer(ctx);
    const source = ctx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 180;

    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.08;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 120;

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    source.connect(filter);
    filter.connect(masterOut);
    source.start();
    lfo.start();
    nodes.push(source, filter, lfo, lfoGain);
  }

  private buildFireplaceChannel(ctx: AudioContext, masterOut: GainNode, nodes: AudioNode[]) {
    const noiseBuffer = this.createBrownNoiseBuffer(ctx);
    const source = ctx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 350;
    filter.Q.value = 2;

    source.connect(filter);
    filter.connect(masterOut);
    source.start();
    nodes.push(source, filter);
  }

  private buildForestChannel(ctx: AudioContext, masterOut: GainNode, nodes: AudioNode[]) {
    const noiseBuffer = this.createPinkNoiseBuffer(ctx);
    const wind = ctx.createBufferSource();
    wind.buffer = noiseBuffer;
    wind.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 550;

    wind.connect(filter);
    filter.connect(masterOut);
    wind.start();
    nodes.push(wind, filter);
  }

  private buildOceanChannel(ctx: AudioContext, masterOut: GainNode, nodes: AudioNode[]) {
    const noiseBuffer = this.createPinkNoiseBuffer(ctx);
    const source = ctx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400;

    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.12;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 300;

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    source.connect(filter);
    filter.connect(masterOut);
    source.start();
    lfo.start();
    nodes.push(source, filter, lfo, lfoGain);
  }

  private buildCoffeeShopChannel(ctx: AudioContext, masterOut: GainNode, nodes: AudioNode[]) {
    const noiseBuffer = this.createPinkNoiseBuffer(ctx);
    const source = ctx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 650;

    source.connect(filter);
    filter.connect(masterOut);
    source.start();
    nodes.push(source, filter);
  }

  private buildLibraryChannel(ctx: AudioContext, masterOut: GainNode, nodes: AudioNode[]) {
    const noiseBuffer = this.createBrownNoiseBuffer(ctx);
    const source = ctx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 300;

    source.connect(filter);
    filter.connect(masterOut);
    source.start();
    nodes.push(source, filter);
  }

  private buildWindChannel(ctx: AudioContext, masterOut: GainNode, nodes: AudioNode[]) {
    const noiseBuffer = this.createPinkNoiseBuffer(ctx);
    const source = ctx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 450;
    filter.Q.value = 3;

    source.connect(filter);
    filter.connect(masterOut);
    source.start();
    nodes.push(source, filter);
  }

  private buildCricketsChannel(ctx: AudioContext, masterOut: GainNode, nodes: AudioNode[]) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.value = 4500;

    const lfo = ctx.createOscillator();
    lfo.frequency.value = 8;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.2;

    lfo.connect(lfoGain);
    lfoGain.connect(gain.gain);

    osc.connect(gain);
    gain.connect(masterOut);
    osc.start();
    lfo.start();
    nodes.push(osc, gain, lfo, lfoGain);
  }

  private buildSnowChannel(ctx: AudioContext, masterOut: GainNode, nodes: AudioNode[]) {
    const noiseBuffer = this.createWhiteNoiseBuffer(ctx);
    const source = ctx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 500;

    source.connect(filter);
    filter.connect(masterOut);
    source.start();
    nodes.push(source, filter);
  }

  private buildTrainChannel(ctx: AudioContext, masterOut: GainNode, nodes: AudioNode[]) {
    const noiseBuffer = this.createBrownNoiseBuffer(ctx);
    const source = ctx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 250;

    const lfo = ctx.createOscillator();
    lfo.frequency.value = 1.5;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 100;

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    source.connect(filter);
    filter.connect(masterOut);
    source.start();
    lfo.start();
    nodes.push(source, filter, lfo, lfoGain);
  }

  private buildNoiseChannel(ctx: AudioContext, masterOut: GainNode, nodes: AudioNode[], type: 'white' | 'brown' | 'pink') {
    const buf = type === 'white' ? this.createWhiteNoiseBuffer(ctx) : type === 'brown' ? this.createBrownNoiseBuffer(ctx) : this.createPinkNoiseBuffer(ctx);
    const source = ctx.createBufferSource();
    source.buffer = buf;
    source.loop = true;

    source.connect(masterOut);
    source.start();
    nodes.push(source);
  }
}

export const soundEngine = new SoundEngine();
