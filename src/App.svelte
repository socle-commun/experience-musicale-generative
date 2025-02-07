<script lang="ts">
  import "@/App.css";

  import { onMount } from "svelte";
  
  import {
    FMSynth,
    getTransport,
    MembraneSynth,
    NoiseSynth,
    PolySynth,
    Sequence,
    start,
  } from "tone";

  let isPlaying = $state<boolean>(false);

  let kick = $state<MembraneSynth | null>(null);
  let snare = $state<NoiseSynth | null>(null);
  let hihat = $state<NoiseSynth | null>(null);

  let bass = $state<FMSynth | null>(null);

  let chords = $state<PolySynth | null>(null);

  let sequences = $state<Sequence[]>([]);

  onMount(() => {
    getTransport().bpm.value = 120;

    kick = new MembraneSynth().toDestination();
    snare = new NoiseSynth({
      noise: { type: "white" },
      envelope: { attack: 0.001, decay: 0.2, sustain: 0 },
    }).toDestination();
    hihat = new NoiseSynth({
      noise: { type: "pink" },
      envelope: { attack: 0.01, decay: 0.1, release: 0.1 },
    }).toDestination();

    bass = new FMSynth().toDestination();

    chords = new PolySynth().toDestination();

    let drumSequence = new Sequence(
      (time, step) => {
        const [kickPattern, snarePattern, hihatPattern] = step.split(":");
        if (kickPattern) kick?.triggerAttackRelease("C2", "16n", time);
        if (snarePattern) snare?.triggerAttackRelease("16n", time);
        if (hihatPattern) hihat?.triggerAttackRelease("16n", time);
      },
      [
        "kick::hihat",
        "::",
        "::hihat",
        "::",
        "kick:snare:hihat",
        "::",
        "::hihat",
        "::",
        "kick::hihat",
        "::",
        "::hihat",
        "::",
        "kick:snare:hihat",
        "::",
        "::hihat",
        "::",
      ],
      "16n",
    );
    drumSequence.loopEnd = 16;
    drumSequence.loop = true;

    sequences.push(drumSequence);

    let bassSequence = new Sequence(
      (time, step) => {
        const [note, duration] = step.split(":");
        if (note)
          bass?.triggerAttackRelease(note, duration ? duration : "16n", time);
      },
      [
        "C2:8n",
        ":",
        "D2:4n",
        ":",
        ":",
        "C3:",
        ":",
        "C2:",
        ":",
        "E2:",
        ":",
        "D2:",
        ":",
        "B2:",
        ":",
        "C2:",
      ],
      "16n",
    );
    bassSequence.loopEnd = 16;
    bassSequence.loop = true;

    sequences.push(bassSequence);

    let chordsSequence = new Sequence(
      (time, step) => {
        const [notes, duration] = step.split(":");
        const chord = notes.split(",");
        if (notes)
          chords?.triggerAttackRelease(chord, duration ? duration : "16n", time);
      },
      [
        "C4,E4,G4:1n",
        "E4,G4,B4:1n",
        "D4,F4,A4:1n",
        "B3,D4,F4:1n",
      ],
      "1n",
    );
    chordsSequence.loopEnd = 4;
    chordsSequence.loop = true;

    sequences.push(chordsSequence);
  });

  async function startBeat() {
    if (!isPlaying) {
      await start();

      sequences?.forEach((sequence) => sequence.start(0));
      getTransport().start();
      isPlaying = true;
    } else {
      getTransport().stop();
      sequences?.forEach((sequence) => sequence.stop());
      isPlaying = false;
    }
  }
</script>

<main></main>

<footer class="h-16 flex items-center justify-center">
  <button
    onclick={startBeat}
    class="px-4 py-2 border-2 text-sky-500 border-sky-500 rounded-full cursor-pointer hover:bg-sky-200 hover:dark:bg-sky-800 hover:bg-transparent"
  >
    {isPlaying ? "Stop" : "Play"}
  </button>
</footer>

<style>
</style>
