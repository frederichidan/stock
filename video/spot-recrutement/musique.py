"""Musique originale du spot (30 s, 120 BPM, ré mineur), synthétisée de zéro : libre de droits.

Structure calée sur le montage (1 mesure = 2 s) :
  0-4   intro : nappe, sub, toms et montée
  4-24  groove complet (kick, clap, charleston, basse, nappe, arpège)
  24-26 break : roulement de caisse claire et montée
  26-30 final : impact, dernier groove, coup final et queue de réverbération
"""
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve
import wave

SR = 44100
DUR = 30.0
BPM = 120
BEAT = 60 / BPM
N = int(SR * DUR)
rng = np.random.default_rng(7)

L = np.zeros(N); R = np.zeros(N)
send = np.zeros(N)  # bus réverbération (mono)


def t_(d):
    return np.arange(int(SR * d)) / SR


def add(sig, at, pan=0.0, gain=1.0, rev=0.0):
    i = int(at * SR)
    if i >= N:
        return
    s = sig[: N - i] * gain
    L[i:i + len(s)] += s * np.sqrt(0.5 * (1 - pan))
    R[i:i + len(s)] += s * np.sqrt(0.5 * (1 + pan))
    if rev:
        send[i:i + len(s)] += s * rev


def filt(x, kind, f, order=2):
    if np.ndim(f):
        f = [min(max(v, 20), SR / 2 - 100) for v in f]
    else:
        f = min(max(f, 20), SR / 2 - 100)
    return sosfilt(butter(order, f, kind, fs=SR, output='sos'), x)


def note(n):  # n : numéro MIDI
    return 440 * 2 ** ((n - 69) / 12)


# ---------- instruments ----------
def kick(g=1.0):
    t = t_(0.45)
    f = 45 + 110 * np.exp(-t * 28)
    ph = 2 * np.pi * np.cumsum(f) / SR
    s = np.sin(ph) * np.exp(-t * 7.5)
    s[:220] += rng.standard_normal(220) * np.linspace(0.5, 0, 220)
    return np.tanh(s * 1.6) * g


def clap():
    t = t_(0.35)
    n = filt(rng.standard_normal(len(t)), 'bandpass', [900, 4200])
    env = np.exp(-t * 16)
    for k in (0.0, 0.011, 0.022):  # attaques multiples façon clap
        i = int(k * SR); env[i:i + 60] += 0.6
    tone = np.sin(2 * np.pi * 190 * t) * np.exp(-t * 30) * 0.4
    return (n * env + tone) * 0.55


def hat(open_=False):
    t = t_(0.28 if open_ else 0.06)
    n = filt(rng.standard_normal(len(t)), 'highpass', 7000)
    return n * np.exp(-t * (9 if open_ else 70)) * 0.28


def tom(freq=95, g=1.0):
    t = t_(0.6)
    f = freq * (1 + 0.6 * np.exp(-t * 20))
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 6)
    s += filt(rng.standard_normal(len(t)), 'lowpass', 1500) * np.exp(-t * 25) * 0.3
    return np.tanh(s * 1.4) * g


def snare(g=1.0):
    t = t_(0.22)
    n = filt(rng.standard_normal(len(t)), 'bandpass', [1500, 8000]) * np.exp(-t * 22)
    tone = np.sin(2 * np.pi * 200 * t) * np.exp(-t * 35)
    return (n * 0.7 + tone * 0.5) * g


def saw(freq, d, detune=0.0):
    t = t_(d)
    ph = (t * freq * (1 + detune)) % 1.0
    return 2 * ph - 1


def bass(n, d):
    f = note(n)
    s = saw(f, d) * 0.6 + np.sin(2 * np.pi * f * t_(d)) * 0.7
    s = filt(s, 'lowpass', 520)
    t = t_(d)
    env = np.minimum(1, t * 400) * np.exp(-t * 3.2)
    return np.tanh(s * env * 1.4) * 0.5


def pad(notes, d, cutoff=1800):
    t = t_(d)
    s = np.zeros(len(t))
    for n in notes:
        for dt in (-0.006, 0.0, 0.007):
            s += saw(note(n), d, dt)
    s = filt(s / (len(notes) * 3), 'lowpass', cutoff)
    env = np.minimum(1, t / 0.35) * np.minimum(1, (d - t) / 0.3)
    return s * env * 0.45


def pluck(n, d=0.24):
    t = t_(d)
    f = note(n)
    s = saw(f, d) * 0.5 + np.sign(np.sin(2 * np.pi * f * t)) * 0.25
    s = filt(s, 'lowpass', 3200)
    return s * np.exp(-t * 14) * 0.22


def riser(d, f0=300, f1=9000, g=0.5):
    t = t_(d)
    n = rng.standard_normal(len(t))
    out = np.zeros(len(t))
    seg = int(SR * 0.05)
    for i in range(0, len(t), seg):
        k = i / len(t)
        fc = f0 * (f1 / f0) ** k
        out[i:i + seg] = filt(n[i:i + seg + 400], 'bandpass', [fc * 0.7, fc * 1.3])[: len(out[i:i + seg])]
    sweep = np.sin(2 * np.pi * np.cumsum(120 + 900 * (t / d) ** 2) / SR) * 0.15
    return (out + sweep) * (t / d) ** 2 * g


def whoosh(d=0.6, g=0.35):
    t = t_(d)
    n = filt(rng.standard_normal(len(t)), 'bandpass', [600, 5000])
    env = np.sin(np.pi * t / d) ** 2
    return n * env * g


def impact(g=1.0):
    t = t_(2.5)
    boom = np.sin(2 * np.pi * np.cumsum(38 + 60 * np.exp(-t * 8)) / SR) * np.exp(-t * 1.8)
    crash = filt(rng.standard_normal(len(t)), 'highpass', 2500) * np.exp(-t * 2.2) * 0.35
    return (np.tanh(boom * 1.5) + crash) * g


# ---------- composition ----------
# Accords (1 par mesure) : Dm - Bb - F - C
CHORDS = [
    ([62, 65, 69], 38),   # Dm  (basse D2)
    ([58, 62, 65], 34),   # Bb  (basse Bb1)
    ([60, 65, 69], 41),   # F   (basse F2)
    ([60, 64, 67], 36),   # C   (basse C2)
]
BAR = 4 * BEAT


def chord_at(t):
    return CHORDS[int(t / BAR) % 4]


# Intro 0-4 : nappe sombre, sub, toms, montée
for b in range(2):
    notes, root = chord_at(b * BAR)
    add(pad(notes, BAR, cutoff=700), b * BAR, gain=0.9, rev=0.25)
    add(np.sin(2 * np.pi * note(root) * t_(BAR)) * np.minimum(1, t_(BAR) * 2) * 0.25, b * BAR)
for at, f in [(0.0, 80), (1.0, 80), (2.0, 90), (2.5, 90), (3.0, 105), (3.25, 105), (3.5, 120), (3.75, 120)]:
    add(tom(f), at, gain=0.8, rev=0.35)
add(riser(4.0, g=0.45), 0.0, rev=0.2)

# Groove 4-24 et 26-29
def groove(start, end, arp=True, open_hats=False):
    t = start
    while t < end - 1e-6:
        beat_idx = int(round((t - start) / BEAT))
        add(kick(), t, gain=0.95)
        if beat_idx % 2 == 1:
            add(clap(), t, gain=0.9, rev=0.3)
        add(hat(), t + BEAT / 2, pan=0.3)
        add(hat(), t + BEAT / 4, pan=-0.3, gain=0.5)
        add(hat(), t + 3 * BEAT / 4, pan=-0.3, gain=0.5)
        if open_hats and beat_idx % 2 == 1:
            add(hat(True), t + BEAT / 2, pan=0.2, gain=0.7)
        t += BEAT
    t = start
    while t < end - 1e-6:
        notes, root = chord_at(t)
        add(pad(notes, BAR), t, gain=0.8, rev=0.25)
        # basse : croches, octave sur les contretemps
        for k in range(8):
            n = root + (12 if k % 2 else 0)
            add(bass(n, BEAT / 2), t + k * BEAT / 2)
        if arp:
            seq = [notes[0] + 12, notes[1] + 12, notes[2] + 12, notes[1] + 12]
            for k in range(16):
                add(pluck(seq[k % 4] + (12 if k in (6, 14) else 0)), t + k * BEAT / 4,
                    pan=0.35 if k % 2 else -0.35, rev=0.2)
        t += BAR


add(impact(0.9), 4.0, rev=0.4)
groove(4.0, 8.0, arp=False)
groove(8.0, 16.0, arp=True)
groove(16.0, 24.0, arp=True, open_hats=True)

# Break 24-26 : roulement qui accélère + montée
t = 24.0
for step, n in [(BEAT / 2, 4), (BEAT / 4, 4), (BEAT / 8, 8)]:
    for i in range(n):
        add(snare(0.35 + 0.6 * (t - 24) / 2), t, rev=0.2)
        t += step
notes, _ = chord_at(24.0)
add(pad(notes, 2.0, cutoff=2500), 24.0, gain=0.9, rev=0.35)
add(riser(2.0, f0=500, f1=12000, g=0.55), 24.0, rev=0.2)

# Final 26-30
add(impact(1.0), 26.0, rev=0.5)
groove(26.0, 29.0, arp=True, open_hats=True)
add(impact(0.9), 29.0, rev=0.6)
add(pad([62, 65, 69, 74], 1.0, cutoff=1500), 29.0, gain=0.7, rev=0.6)

# Transitions (souffles) aux changements de plan
for at in [5.7, 7.7, 9.7, 11.7, 15.6, 19.6, 23.6]:
    add(whoosh(), at, pan=rng.uniform(-0.4, 0.4), rev=0.2)

# ---------- mixage ----------
ir_t = t_(1.6)
ir = rng.standard_normal(len(ir_t)) * np.exp(-ir_t * 3.2)
ir = filt(ir, 'lowpass', 6000)
wet = fftconvolve(send, ir)[:N]
wet /= (np.abs(wet).max() + 1e-9)
L += wet * 0.22; R += np.roll(wet, 441) * 0.22

mix = np.stack([L, R], axis=1)
mix = filt(mix.T, 'highpass', 28).T
mix /= np.abs(mix).max()
mix = np.tanh(mix * 1.8) / np.tanh(1.8)          # compression douce
fade = np.ones(N); nf = int(SR * 0.8)
fade[-nf:] = np.linspace(1, 0, nf) ** 2          # fondu final
fade[:int(SR * 0.02)] = np.linspace(0, 1, int(SR * 0.02))
mix *= fade[:, None] * 0.93

with wave.open('musique.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((mix * 32767).astype('<i2').tobytes())
print('musique.wav', mix.shape[0] / SR, 's')
