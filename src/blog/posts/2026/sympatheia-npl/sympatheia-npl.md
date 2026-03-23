---
layout: layouts/post.njk
title: "Neural Phase-Locking in Sympatheia: Entrainment Without Headphones"
date: 2026-03-20
summary: "Binaural beats require headphones and have inconsistent research support. Neural phase-locking — amplitude modulation at the target frequency — offers a more acoustically direct mechanism that works over speakers. This post covers the science and how to use Sympatheia's new NPL settings."
category: navigation
tags: [audio, meditation, tools, binaural-beats, neuroscience, sympatheia]
draft: true
---

When I built the binaural beat engine in Sympatheia, I included a note that binaural beats require headphones: both ears need to receive different tones for the difference frequency to appear. I also included a frank caveat that the research supporting binaural entrainment is inconsistent. Both things remain true. This post is about a complementary mechanism that doesn't share either of those limitations — and what I've added to Sympatheia to support it.

---

## The problem with binaural beats

The mechanism behind binaural beats is real and well-documented. When your left ear hears 200 Hz and your right ear hears 210 Hz, the **superior olivary nucleus** in the brainstem computes the 10 Hz difference and produces what's called a frequency-following response (FFR). This happens subcortically — it doesn't require attention or conscious awareness. The disputed question is what happens next: whether that FFR propagates upward and actually entrains cortical oscillations to the target frequency, and whether that entrainment produces any meaningful cognitive or physiological effect.

The research is genuinely split. A [2023 systematic review in PLOS One](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0286023) examined 14 controlled studies of binaural beat entrainment. Five found support for the brainwave entrainment hypothesis. Eight contradicted it. One showed mixed results. A [2024 review in PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC11367212/) reached similar conclusions — genuine inconsistency attributed to carrier frequency, beat frequency, exposure duration, individual differences, and methodology.

This doesn't mean binaural beats do nothing. The relaxation response to any pleasant sustained audio is real, and the subjective sense of altered state that many people report is also real. But the specific claim that binaural beats entrain cortical oscillations through a reliable, predictable mechanism is not well-supported.

---

## A different mechanism: amplitude modulation as entrainment

There is a better-studied pathway that delivers the entrainment signal through real acoustic energy rather than a phantom beat. It goes by several names — **auditory steady-state response (ASSR)**, neural phase-locking, or neural entrainment through rhythmic amplitude modulation — and the underlying mechanism is distinct from binaural beats.

When a sound source is amplitude-modulated at a given frequency — that is, when its volume pulses in and out at that rate — the auditory cortex generates a neural oscillation at that same modulation frequency. This is the ASSR. It's not a subcortical phantom: the modulation is in the actual acoustic waveform, which means it works over speakers, in noise, and without precise left/right ear separation.

The 40 Hz gamma range is the most extensively studied. The brain's response to 40 Hz AM stimulation is robust and has been measured in clinical contexts including research on attention, cognitive load, and Alzheimer's disease. Alpha range AM (8–12 Hz) has also been studied, with findings that align with relaxation and reduced cortical arousal. The evidence base here is meaningfully stronger than for binaural beats, in part because the delivery mechanism is more direct: you're not asking the brain to compute a difference — you're feeding it a modulation it can follow directly.

Brain.fm, one of the better-resourced commercial audio platforms in this space, [explicitly abandoned binaural beats](https://www.brain.fm/blog/binaural-beats-vs-neural-phase-locking) in favour of neural phase-locking for this reason. Their argument: rhythmic amplitude modulation through carefully timed sound events is a more robust entrainment pathway than the binaural phantom beat.

---

## What the 2025 parametric study adds

A [2025 study in Nature Scientific Reports](https://www.nature.com/articles/s41598-025-88517-z) provides useful nuance. It compared binaural beats against background noise conditions and found that:

- White noise in the background *reduced* EEG entrainment strength from binaural beats, especially at higher target frequencies — because gamma-range EEG signals are already low amplitude (the 1/f characteristic of neural noise means high-frequency signals are weaker and more easily masked)
- However, binaural beats *with* white noise still improved attention performance — suggesting that the cognitive effect may partially decouple from the measured entrainment mechanism
- At low noise levels, there may be a stochastic resonance effect where broadband noise sharpens beat perception; this inverts at higher levels

The practical implication for ambient audio backgrounds (ocean sounds, pink noise) is that they're essentially harmless to the binaural mechanism — they don't introduce competing tonal structure. But they do slightly attenuate the entrainment signal. This is less of a concern for AM-based entrainment because the modulation is carried in the amplitude envelope itself, which rides on top of any background.

---

## What Sympatheia added

Sympatheia now has two dedicated NPL mechanisms:

### ISO Pulse: Sine AM mode

The ISO Pulse channel has always delivered isochronic pulses — sharp gate-shaped amplitude envelopes at the target beat frequency. This works. But gate pulses have a steep attack and release, which produces audible clicks at higher beat frequencies and a slightly mechanical quality throughout.

**Sine AM mode** replaces the gate scheduler with a continuous AM oscillator. The carrier oscillator runs at its normal frequency; its amplitude is modulated by a second oscillator running at the beat frequency. The resulting envelope is a smooth sine wave: the gain swings continuously from 0 to 1 at the target rate with no clicks and no hard edges. This is acoustically gentler and more natural-feeling at any beat frequency.

To use it: in the **ISO Pulse** strip in the layers mixer, change the shape selector from **Gate** to **Sine AM**.

The duty-cycle control disappears in Sine AM mode — it doesn't apply to a continuous sine envelope.

**Speaker-safe**: because the modulation is in the amplitude of the output waveform, it works over speakers. Headphones are not required for the entrainment signal to reach the auditory cortex.

### Pads: Beat Sync

The chord pads channel has a slow LFO that modulates its output amplitude — the tremolo effect. **Beat Sync** locks the tremolo rate to the current beat frequency, turning the harmonic pad texture itself into an AM entrainment signal.

With Beat Sync active:

- The pads tremolo oscillator is set to `beatFreq` Hz immediately when pads start
- Every time the beat frequency changes (via slider, direct input, or sequencer ramp), the tremolo oscillator updates in step — continuously, with no scheduler gaps
- If Beat Drift is also enabled, the same drift signal wired to the binaural right oscillator is also connected to the pads tremolo oscillator at the AudioParam level, giving sample-accurate beat-drift tracking: the tremolo follows the actual instantaneous beat frequency including its slow wander

The result is a musically interesting texture — rich harmonic pads slowly breathing at the target entrainment frequency — that delivers AM modulation over speakers with each pulse.

To use it: in the **Pads** strip, set a tremolo depth (30–50% is a good starting range for AM entrainment while remaining musically pleasant), then press **Beat Sync**. The AM rate chip "AM ◎ Beat Sync" will appear in the options row to confirm that at least one NPL mechanism is active.

**A note on tremolo depth and NPL**: the research on optimal AM modulation depth for ASSR is not precise. Too little modulation and the entrainment signal is too weak; too much and it becomes perceptually dominant and fatiguing. In the alpha range, a slow 10 Hz breath at 30–50% modulation is musically well-integrated into a chord pad texture. At stronger depths the pads take on a more rhythmic, pulse-like quality — which may or may not be what you want.

---

## The two NPL built-in programs

Sympatheia ships with two demonstration programs. Load them from the library in the Sequencer panel.

### Alpha Flow [NPL] — speaker-safe

A 30-minute alpha session designed to work without headphones.

- **Beat**: 10 Hz (mid-alpha, relaxed focus)
- **Binaural**: off
- **ISO Pulse**: sine AM, 10 Hz beat, 432 Hz carrier
- **Pads**: Lydian Float progression, Beat Sync active at 30% tremolo depth, palindrome, inversion cycling, sub oscillator, cathedral reverb, 11-second crossfades
- **Ocean**: background environment at moderate level

The 432 Hz ISO carrier gives the iso pulse a warm, slightly warm tonal quality that sits below the pad register without muddying it. The Lydian Float progression (A major with the raised fourth — that bright, open modal colour) and the palindromic movement mean the harmony never settles into a predictable pattern.

This session uses no binaural beats. Place it on a speaker in your workspace, put it on in the background of a yoga practice, run it during sleep or rest. No headphones, no spatial placement required.

### Theta Descent [NPL] — headphones recommended

A 30-minute session that descends from alpha into theta, layering all three entrainment mechanisms simultaneously.

- **Beat**: starts at 9 Hz (low alpha), ramps to 6 Hz (theta) over two steps
- **Binaural**: enabled (headphones recommended for this)
- **ISO Pulse**: sine AM tracking the same beat arc (6 Hz at end)
- **Pads**: Dorian Drift progression, Beat Sync, pedal point, palindrome, sub oscillator
- **Ocean**: background

The sequencer program:

| Step | Beat | Carrier | Ramp | Hold |
|------|------|---------|------|------|
| 1 | 9.0 Hz | 200 Hz | — | 10 min |
| 2 | 6.0 Hz | 174 Hz | 3 min | 15 min |

The 3-minute ramp in step 2 is slow enough that the binaural oscillators, the ISO AM oscillator, and the pads tremolo all descend together continuously — it's a guided downward slide rather than a step change. The carrier drops to 174 Hz (Foundation) at the theta depth.

At 6 Hz with Beat Sync active, the pads tremolo is breathing once every ~167ms — slow enough to be felt as a gentle pulse in the harmony, fast enough to be clearly rhythmic.

---

## Building your own NPL program

You don't need to use the built-in programs. The most direct path to a custom NPL session:

1. **Set your beat frequency** with the main Beat slider
2. **Enable ISO Pulse**, set a carrier frequency (174–432 Hz works well), change shape to **Sine AM**
3. **Enable Pads**, choose a progression, set tremolo depth to 0.3–0.5, press **Beat Sync**
4. **Optionally enable Binaural** if you're using headphones — all three mechanisms layer
5. Press play. The "AM ◎ Beat Sync" chip confirms NPL is active.

For a sequencer session that sweeps through multiple states, the ISO AM oscillator and pads tremolo both update continuously as the beat frequency ramps — you don't need to do anything special. Set your steps as usual; the NPL tracking is automatic.

**Frequency targeting notes:**

| Target | Beat | State | Notes |
|--------|------|-------|-------|
| Gamma | 40 Hz | Peak cognition | AM at 40 Hz is buzzy in pads; use ISO sine only |
| Beta | 18–25 Hz | Focus, alertness | Audible but not unpleasant in ISO; pads tremolo quite fast |
| Alpha | 8–12 Hz | Relaxed focus | Sweet spot for pads Beat Sync — musical and effective |
| Theta | 4–7 Hz | Deep meditation | Slow, satisfying pulse in pads; very meditative quality |

Gamma (40 Hz) is the most research-supported ASSR frequency but is poorly suited to the pads Beat Sync due to the tremolo speed. For gamma work, use ISO Pulse in Sine AM mode only, optionally combined with the Sub-bass channel at 40 Hz.

---

## What this is and isn't

**What the research does support:**

- The ASSR is real and reliably measurable via EEG
- 40 Hz AM stimulation produces robust 40 Hz cortical oscillations
- AM stimulation at alpha range correlates with measurable changes in EEG alpha power
- The mechanism is more direct and consistent than binaural beats

**What remains uncertain:**

- Whether ASSR-based entrainment produces reliable subjective state changes (the research is thinner here than on the neural mechanism itself)
- Optimal modulation depth, session duration, and carrier type for different targets
- Whether pads tremolo at musical AM depths delivers sufficient modulation for entrainment versus purely aesthetic effect

This is honest: the NPL features in Sympatheia are built on a scientifically more grounded foundation than binaural beats, but they are not a guaranteed neurological intervention. They are a layer of structure added to an ambient audio experience — one that aligns with the best available evidence for how acoustic AM affects cortical oscillations. Use them experimentally, with attention.

---

## Further reading

- [PLOS One: Binaural beats to entrain the brain? A systematic review (2023)](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0286023)
- [PMC: A Review of Binaural Beats and the Brain (2024)](https://pmc.ncbi.nlm.nih.gov/articles/PMC11367212/)
- [Nature Scientific Reports: Parametric investigation of binaural beats for entrainment and attention (2025)](https://www.nature.com/articles/s41598-025-88517-z)
- [eNeuro: Binaural Beats through the Auditory Pathway — from brainstem to cortical connectivity (2020)](https://pmc.ncbi.nlm.nih.gov/articles/PMC7082494/)
- [Brain.fm: Binaural Beats vs. Neural Phase-Locking](https://www.brain.fm/blog/binaural-beats-vs-neural-phase-locking)
- Oster, G. (1973). "Auditory Beats in the Brain." *Scientific American*, 229(4), 94–102 — still the clearest introduction to the binaural beat mechanism
- Galambos, R., Makeig, S., & Talmachoff, P.J. (1981). "A 40-Hz auditory potential recorded from the human scalp." *PNAS*, 78(4), 2643–2647 — the original ASSR paper
