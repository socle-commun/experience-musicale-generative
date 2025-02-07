import { Sequence } from "tone";

export default function getDrumsSequence(): Sequence {
    return new Sequence((time, note) => {
        console.log(note);
    }, ["C4", "D4", "E4", "G4"]);
}