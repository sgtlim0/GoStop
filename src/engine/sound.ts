function randomPitch(base: number, v: number = 0.04): number {
  return base * (1 + (Math.random() * 2 - 1) * v)
}

class SoundEngine {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private _muted = false
  private _init = false

  get muted() { return this._muted }

  init() {
    if (this._init) return
    try {
      this.ctx = new AudioContext()
      this.master = this.ctx.createGain()
      this.master.gain.value = 1
      this.master.connect(this.ctx.destination)
      this._init = true
    } catch { /* unsupported */ }
  }

  private ensure(): AudioContext | null {
    if (!this.ctx) return null
    if (this.ctx.state === 'suspended') this.ctx.resume()
    return this.ctx
  }

  toggleMute(): boolean {
    this._muted = !this._muted
    if (this.master) this.master.gain.value = this._muted ? 0 : 1
    return this._muted
  }

  private noise(dur: number): AudioBufferSourceNode | null {
    const c = this.ensure()
    if (!c) return null
    const buf = c.createBuffer(1, Math.floor(c.sampleRate * dur), c.sampleRate)
    const d = buf.getChannelData(0)
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
    const s = c.createBufferSource()
    s.buffer = buf
    return s
  }

  playCardPlace() {
    const c = this.ensure()
    if (!c || !this.master) return
    const n = this.noise(0.06)
    if (!n) return
    const f = c.createBiquadFilter()
    f.type = 'bandpass'
    f.frequency.value = randomPitch(3500)
    f.Q.value = 1.2
    const g = c.createGain()
    const t = c.currentTime
    g.gain.setValueAtTime(0, t)
    g.gain.linearRampToValueAtTime(0.5, t + 0.004)
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.05)
    n.connect(f)
    f.connect(g)
    g.connect(this.master)
    n.start(t)
    n.stop(t + 0.06)
  }

  playCapture() {
    const c = this.ensure()
    if (!c || !this.master) return
    const t = c.currentTime
    for (let i = 0; i < 2; i++) {
      const n = this.noise(0.08)
      if (!n) return
      const f = c.createBiquadFilter()
      f.type = 'highpass'
      f.frequency.value = randomPitch(2000)
      const g = c.createGain()
      const st = t + i * 0.06
      g.gain.setValueAtTime(0, st)
      g.gain.linearRampToValueAtTime(0.35, st + 0.005)
      g.gain.exponentialRampToValueAtTime(0.001, st + 0.07)
      n.connect(f)
      f.connect(g)
      g.connect(this.master)
      n.start(st)
      n.stop(st + 0.08)
    }
  }

  playSweep() {
    const c = this.ensure()
    if (!c || !this.master) return
    const t = c.currentTime
    const notes = [880, 1100, 1320]
    notes.forEach((freq, i) => {
      const o = c.createOscillator()
      o.type = 'triangle'
      o.frequency.value = randomPitch(freq)
      const g = c.createGain()
      const st = t + i * 0.06
      g.gain.setValueAtTime(0, st)
      g.gain.linearRampToValueAtTime(0.3, st + 0.01)
      g.gain.exponentialRampToValueAtTime(0.001, st + 0.15)
      o.connect(g)
      g.connect(this.master!)
      o.start(st)
      o.stop(st + 0.15)
    })
  }

  playGo() {
    const c = this.ensure()
    if (!c || !this.master) return
    const t = c.currentTime
    const o = c.createOscillator()
    o.type = 'sawtooth'
    o.frequency.value = 220
    o.frequency.linearRampToValueAtTime(440, t + 0.3)
    const g = c.createGain()
    g.gain.setValueAtTime(0, t)
    g.gain.linearRampToValueAtTime(0.3, t + 0.05)
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.3)
    o.connect(g)
    g.connect(this.master)
    o.start(t)
    o.stop(t + 0.3)
  }

  playStop() {
    const c = this.ensure()
    if (!c || !this.master) return
    const t = c.currentTime
    const notes = [523.25, 659.25, 783.99, 1046.5]
    notes.forEach((freq, i) => {
      const o = c.createOscillator()
      o.type = 'triangle'
      o.frequency.value = randomPitch(freq)
      const g = c.createGain()
      const st = t + i * 0.1
      g.gain.setValueAtTime(0, st)
      g.gain.linearRampToValueAtTime(0.35, st + 0.015)
      g.gain.exponentialRampToValueAtTime(0.001, st + 0.4)
      o.connect(g)
      g.connect(this.master!)
      o.start(st)
      o.stop(st + 0.4)
    })
  }

  playLose() {
    const c = this.ensure()
    if (!c || !this.master) return
    const t = c.currentTime
    const notes = [392, 349, 311]
    notes.forEach((freq, i) => {
      const o = c.createOscillator()
      o.type = 'sine'
      o.frequency.value = randomPitch(freq)
      const g = c.createGain()
      const st = t + i * 0.15
      g.gain.setValueAtTime(0, st)
      g.gain.linearRampToValueAtTime(0.3, st + 0.02)
      g.gain.exponentialRampToValueAtTime(0.001, st + 0.35)
      o.connect(g)
      g.connect(this.master!)
      o.start(st)
      o.stop(st + 0.35)
    })
  }

  playFlip() {
    const c = this.ensure()
    if (!c || !this.master) return
    const n = this.noise(0.12)
    if (!n) return
    const f = c.createBiquadFilter()
    f.type = 'bandpass'
    const t = c.currentTime
    f.frequency.setValueAtTime(2000, t)
    f.frequency.exponentialRampToValueAtTime(5000, t + 0.04)
    f.frequency.exponentialRampToValueAtTime(1500, t + 0.1)
    f.Q.value = 0.7
    const g = c.createGain()
    g.gain.setValueAtTime(0, t)
    g.gain.linearRampToValueAtTime(0.3, t + 0.008)
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.1)
    n.connect(f)
    f.connect(g)
    g.connect(this.master)
    n.start(t)
    n.stop(t + 0.12)
  }

  playDeal() {
    const c = this.ensure()
    if (!c || !this.master) return
    const n = this.noise(0.3)
    if (!n) return
    const f = c.createBiquadFilter()
    f.type = 'bandpass'
    f.frequency.value = 2500
    f.Q.value = 0.4
    const t = c.currentTime
    const g = c.createGain()
    g.gain.setValueAtTime(0, t)
    g.gain.linearRampToValueAtTime(0.2, t + 0.04)
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.25)
    n.connect(f)
    f.connect(g)
    g.connect(this.master)
    n.start(t)
    n.stop(t + 0.3)
  }

  playClick() {
    const c = this.ensure()
    if (!c || !this.master) return
    const o = c.createOscillator()
    o.type = 'sine'
    o.frequency.value = randomPitch(1200)
    const t = c.currentTime
    const g = c.createGain()
    g.gain.setValueAtTime(0, t)
    g.gain.linearRampToValueAtTime(0.25, t + 0.003)
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.04)
    o.connect(g)
    g.connect(this.master)
    o.start(t)
    o.stop(t + 0.04)
  }
}

export const soundEngine = new SoundEngine()
