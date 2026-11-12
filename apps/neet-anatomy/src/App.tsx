import { useEffect, useRef, useState, type FormEvent, type RefObject } from "react";
import { checks, path, type Check } from "./lesson";
import { replyTo } from "./tutor";

type Screen =
  | { kind: "intro" }
  | { kind: "turn" }
  | { kind: "check"; index: number; phase: "ask" | "wrong" | "right"; picked?: string }
  | { kind: "done" };

type Note = { from: "student" | "tutor"; text: string };

const VIEWER = "/vendor/anatomy/turning-dial-light.html";

function degrees(text: string): number | null {
  const match = text.match(/([\d.]+)°/);
  return match ? Number(match[1]) : null;
}

function useDial(frame: RefObject<HTMLIFrameElement | null>) {
  const [turned, setTurned] = useState(false);

  useEffect(() => {
    const iframe = frame.current;
    if (!iframe) return;
    let detach = () => {};

    const hook = () => {
      detach();
      const doc = iframe.contentDocument;
      const stage = doc?.querySelector<HTMLElement>(".td-stage");
      const readout = doc?.querySelector<HTMLElement>("[data-readout]");
      if (!stage || !readout) return;
      let from = degrees(readout.textContent || "") ?? 0;
      const remember = () => {
        from = degrees(readout.textContent || "") ?? from;
      };
      const finish = () => {
        const now = degrees(readout.textContent || "");
        if (now === null) return;
        const delta = Math.abs(now - from);
        const wrapped = Math.min(delta, 360 - delta);
        if (wrapped > 4) setTurned(true);
      };
      let timer = 0;
      const later = () => {
        window.clearTimeout(timer);
        timer = window.setTimeout(finish, 280);
      };
      stage.addEventListener("pointerdown", remember);
      stage.addEventListener("pointerup", later);
      stage.addEventListener("keyup", later);
      detach = () => {
        window.clearTimeout(timer);
        stage.removeEventListener("pointerdown", remember);
        stage.removeEventListener("pointerup", later);
        stage.removeEventListener("keyup", later);
      };
    };

    iframe.addEventListener("load", hook);
    hook();
    return () => {
      iframe.removeEventListener("load", hook);
      detach();
    };
  }, [frame]);

  return turned;
}

function Path({ current }: { current: number }) {
  return (
    <ol className="path" aria-label="Lesson path">
      {path.map((name, index) => (
        <li key={name} className={index === current ? "now" : undefined}>
          {name}
        </li>
      ))}
    </ol>
  );
}

function Doubt({ revisit }: { revisit?: string }) {
  const [notes, setNotes] = useState<Note[]>([
    {
      from: "tutor",
      text: "Ask about the phalanges, the hinge, or the thumb. I only know this lesson.",
    },
  ]);
  const [draft, setDraft] = useState("");

  const ask = (event: FormEvent) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setNotes((prev) => [
      ...prev,
      { from: "student", text },
      { from: "tutor", text: replyTo(text, { revisit }) },
    ]);
    setDraft("");
  };

  return (
    <section className="doubt" aria-label="Doubt">
      <h3>Doubt</h3>
      <div className="thread">
        {notes.map((note, index) => (
          <p key={index} className={`bubble ${note.from}`}>
            {note.from === "student" ? "You. " : "Tutor. "}
            {note.text}
          </p>
        ))}
      </div>
      <form className="ask" onSubmit={ask}>
        <input
          aria-label="Ask the tutor"
          value={draft}
          placeholder="Why is the knee a hinge?"
          onChange={(event) => setDraft(event.target.value)}
        />
        <button className="send" type="submit">
          Ask
        </button>
      </form>
    </section>
  );
}

function CheckView({
  check,
  phase,
  picked,
  onPick,
  onNext,
}: {
  check: Check;
  phase: "ask" | "wrong" | "right";
  picked?: string;
  onPick: (id: string) => void;
  onNext: () => void;
}) {
  const choice = check.choices.find((item) => item.id === picked);
  const body = phase === "wrong" ? choice?.revisit : phase === "right" ? check.right : check.look;
  return (
    <>
      <h2>{check.title}</h2>
      <p className={phase === "wrong" ? "prose revisit" : phase === "right" ? "prose right" : "prose"}>{body}</p>
      <p className="prompt">{check.prompt}</p>
      <ul className="options">
        {check.choices.map((item) => {
          const pickedThis = picked === item.id && phase !== "ask";
          const klass = pickedThis ? (item.correct ? "option picked-right" : "option picked-wrong") : "option";
          return (
            <li key={item.id}>
              <button className={klass} type="button" onClick={() => onPick(item.id)} disabled={phase === "right"}>
                <span className="tag">({item.label})</span>
                <span>{item.text}</span>
              </button>
            </li>
          );
        })}
      </ul>
      {phase === "wrong" ? <p className="hint">Try the question again.</p> : null}
      {phase === "right" ? (
        <button className="go" type="button" onClick={onNext}>
          Next
        </button>
      ) : null}
    </>
  );
}

export function App() {
  const frame = useRef<HTMLIFrameElement>(null);
  const turned = useDial(frame);
  const [screen, setScreen] = useState<Screen>({ kind: "intro" });

  const stepIndex = screen.kind === "intro" || screen.kind === "turn" ? 0 : screen.kind === "done" ? 3 : screen.index + 1;
  const revisit =
    screen.kind === "check" && screen.phase === "wrong"
      ? checks[screen.index].choices.find((item) => item.id === screen.picked)?.revisit
      : undefined;

  const pick = (id: string) => {
    if (screen.kind !== "check" || screen.phase === "right") return;
    const choice = checks[screen.index].choices.find((item) => item.id === id);
    if (!choice) return;
    setScreen({
      kind: "check",
      index: screen.index,
      phase: choice.correct ? "right" : "wrong",
      picked: id,
    });
  };

  const next = () => {
    if (screen.kind !== "check") return;
    if (screen.index + 1 >= checks.length) setScreen({ kind: "done" });
    else setScreen({ kind: "check", index: screen.index + 1, phase: "ask" });
  };

  return (
    <div className="app">
      <header className="top">
        <div className="mark">qSarthi</div>
        <div className="subject">NEET Biology · Class 11 · Locomotion and movement</div>
      </header>
      <h1>Joints of the hand</h1>
      <p className="deck">One short lesson. Turn the figure, then answer three checks. The path changes when you miss.</p>

      <div className="stage">
        <div className="viewer-wrap">
          <div className="viewer">
            <iframe ref={frame} title="Anatomy 3D turning dial" src={VIEWER} />
          </div>
          <p className="credit">
            3D viewer, unchanged, from{" "}
            <a href="https://github.com/wheresryan22/anatomy">Anatomy by Ryan</a> (turning dial, light theme, MIT). It is a
            mechanical hand on a dial, not a bone scan.
            The lesson uses the finger that lifts, and the short thumb beside it.
          </p>
        </div>

        <section className="lesson" aria-label="Lesson">
          <Path current={stepIndex} />
          {screen.kind === "intro" ? (
            <>
              <h2>Start</h2>
              <p className="prose">
                The figure is already the 3D viewer from the Anatomy project. A hand sits on the dial. One finger lifts
                while it turns. You will use that finger, and the thumb next to it, for three NEET checks on the hand.
              </p>
              <button className="go" type="button" onClick={() => setScreen({ kind: "turn" })}>
                Start the lesson
              </button>
            </>
          ) : null}

          {screen.kind === "turn" ? (
            <>
              <h2>Turn the hand</h2>
              <p className="prose">
                Click the dial and drag it, or focus it and use the arrow keys. Watch the finger that lifts off the
                face. It bends in one plane. The thumb is the shorter digit on the round knuckle, off to the side of
                that finger.
              </p>
              <button className="go" type="button" disabled={!turned} onClick={() => setScreen({ kind: "check", index: 0, phase: "ask" })}>
                I have turned it
              </button>
              <p className="hint">{turned ? "The dial moved. Continue when you can see the lifting finger." : "The button waits until the dial actually turns."}</p>
            </>
          ) : null}

          {screen.kind === "check" ? (
            <CheckView check={checks[screen.index]} phase={screen.phase} picked={screen.picked} onPick={pick} onNext={next} />
          ) : null}

          {screen.kind === "done" ? (
            <>
              <h2>That’s the sitting</h2>
              <p className="prose">
                A finger other than the thumb has three phalanges. Its bend is a hinge, and the textbook hinge is the
                knee. The thumb reaches the other fingertips at a saddle joint between a carpal and its metacarpal.
              </p>
              <p className="prose">The doubt box still answers from this lesson only.</p>
            </>
          ) : null}

          <Doubt revisit={revisit} />
        </section>
      </div>
    </div>
  );
}
