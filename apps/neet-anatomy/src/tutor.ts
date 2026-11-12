export type TutorContext = {
  revisit?: string;
};

const FALLBACK =
  "This sitting is only the hand. I can explain the phalanges, why the knee is the hinge example, or the thumb's saddle joint. Ask one of those.";

type Rule = {
  test: RegExp;
  answer: string;
};

const rules: Rule[] = [
  {
    test: /how many (bones|phalanges).*(hand|total)|phalanges in (a|one|the) hand|14 phalanx|fourteen/,
    answer:
      "One hand has 14 phalanges: three in each of four fingers, and two in the thumb. Add 8 carpals and 5 metacarpals and the hand itself is 27 bones.",
  },
  {
    test: /forelimb|30 bone|bones in (the |a |one )?(arm|limb)/,
    answer:
      "One forelimb has 30 bones: humerus, radius, ulna, 8 carpals, 5 metacarpals, and 14 phalanges.",
  },
  {
    test: /thumb.*(how many|phalange)|how many.*thumb|two phalange/,
    answer:
      "The thumb has two phalanges. Every other finger has three. On the model, the thumb is the short digit on the round knuckle, beside the finger that lifts in three segments.",
  },
  {
    test: /metacarpal/,
    answer:
      "Metacarpals are the five palm bones, one for each digit. They are not the segments of the lifting finger. Those segments are phalanges. The thumb's saddle joint sits between a carpal and the metacarpal of the thumb.",
  },
  {
    test: /(?<!meta)carpals?|wrist/,
    answer:
      "The wrist has 8 carpals. They meet at gliding joints. They are not the three segments of the finger on the dial.",
  },
  {
    test: /saddle|oppos/,
    answer:
      "Opposition, the thumb touching the other fingertips, uses a saddle joint between a carpal and the metacarpal of the thumb. That is the example in the locomotion chapter. The model only shows the thumb set off to the side. It does not draw the carpal.",
  },
  {
    test: /hinge|knee|one plane|flex/,
    answer:
      "A hinge joint flexes and extends in one plane. The textbook example is the knee. The finger that lifts off the dial does that same bend. It is not the shoulder, which is ball-and-socket, and it is not the pivot between atlas and axis.",
  },
  {
    test: /ball|shoulder|hip/,
    answer:
      "Ball-and-socket joints are the shoulder (humerus and pectoral girdle) and the hip. They move in many planes. Don't confuse them with the one-plane bend of the finger on the dial.",
  },
  {
    test: /pivot|atlas|axis/,
    answer:
      "The pivot joint in this chapter is between atlas and axis. The head rotates. A hinge does not do that.",
  },
  {
    test: /glid/,
    answer:
      "Gliding joints are the ones between the carpals. The bones slide. That is different from the hinge bend of the lifting finger, and different from the thumb's saddle joint.",
  },
  {
    test: /what is (this|the) (model|figure|viewer)|robot|dial|mechanical|not a (real|bone|scan)/,
    answer:
      "The figure is the Anatomy project's own 3D viewer, the turning dial, embedded unchanged. A jointed hand sits on the dial. We use the finger that lifts, and the short thumb beside it, as the things to look at while you answer. It is a mechanical model, not a scan of bones.",
  },
  {
    test: /heart|aorta|ventricle|lung|nephron|photosynth/,
    answer:
      "This demo teaches one system, the hand, from locomotion and movement. I don't have the heart or any other chapter. Ask about phalanges, the hinge, or the thumb.",
  },
  {
    test: /simpler|easier|explain again|don't get|do not get|confused|revisit/,
    answer:
      "Slow version. The lifting finger has three phalanges and bends in one plane, like a hinge, and the textbook hinge is the knee. The thumb has two phalanges, and it can cross the palm because of a saddle joint at its base.",
  },
];

export function replyTo(question: string, context: TutorContext = {}): string {
  const asked = question.trim();
  if (!asked) return "Type a doubt about the phalanges, the hinge, or the thumb.";
  const text = asked.toLowerCase();
  if (/(why|what).*(wrong|incorrect|mistake)|i (got|picked) (it|that) wrong/.test(text) && context.revisit) {
    return context.revisit;
  }
  for (const rule of rules) {
    if (rule.test.test(text)) return rule.answer;
  }
  return FALLBACK;
}
