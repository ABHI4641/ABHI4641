export type Choice = {
  id: string;
  label: string;
  text: string;
  correct?: boolean;
  revisit: string;
};

export type Check = {
  id: string;
  title: string;
  look: string;
  prompt: string;
  choices: Choice[];
  right: string;
};

export const path = ["Turn", "Phalanges", "Hinge", "Thumb"] as const;

export const checks: Check[] = [
  {
    id: "phalanges",
    title: "Phalanges",
    look: "Watch the finger that lifts off the dial as the figure turns. It is built in three segments. In your hand, those segments are the phalanges of one finger. The thumb is the short digit set to the side of the palm block, and it does not have the middle segment.",
    prompt: "How many phalanges does one finger have, other than the thumb?",
    choices: [
      {
        id: "two",
        label: "a",
        text: "2",
        revisit:
          "Two is the thumb. Look again at the finger that lifts: three segments, not two. Proximal, middle, and distal phalanx.",
      },
      {
        id: "three",
        label: "b",
        text: "3",
        correct: true,
        revisit: "",
      },
      {
        id: "five",
        label: "c",
        text: "5",
        revisit:
          "Five is the number of metacarpals, the palm bones, one for each digit. Phalanges are the bones beyond the palm. Count the three parts of the lifting finger.",
      },
      {
        id: "eight",
        label: "d",
        text: "8",
        revisit:
          "Eight is the carpals, the wrist bones. The finger bones are the phalanges. The lifting finger on the dial shows three of them.",
      },
    ],
    right:
      "Three. Proximal, middle, and distal. The thumb has two, so one hand has 14 phalanges: 3 × 4 fingers, plus 2 in the thumb.",
  },
  {
    id: "hinge",
    title: "Hinge joint",
    look: "That same finger only bends and straightens. It does not twist, and it does not sweep sideways. That one-plane bend is hinge movement. In the textbook, the hinge joint is named with the knee.",
    prompt: "Which of these is a hinge joint?",
    choices: [
      {
        id: "shoulder",
        label: "a",
        text: "Shoulder joint",
        revisit:
          "The shoulder is a ball-and-socket joint. It moves in many planes. Look at the lifting finger again: it only tips up and down. That is a hinge, and the textbook example is the knee.",
      },
      {
        id: "knee",
        label: "b",
        text: "Knee joint",
        correct: true,
        revisit: "",
      },
      {
        id: "atlas",
        label: "c",
        text: "Joint between atlas and axis",
        revisit:
          "Atlas and axis make a pivot joint. The head rotates. A hinge does not rotate: it flexes and extends, the way the finger on the dial tips up and down. The textbook hinge is the knee.",
      },
      {
        id: "carpals",
        label: "d",
        text: "Joint between the carpals",
        revisit:
          "Carpals meet at gliding joints. They slide. The bend you see in the lifting finger is a hinge, and the textbook example of a hinge is the knee.",
      },
    ],
    right:
      "The knee. A hinge allows flexion and extension in one plane, which is the motion of that finger. The shoulder is ball-and-socket, atlas–axis is a pivot, and the carpals glide.",
  },
  {
    id: "thumb",
    title: "Thumb",
    look: "Find the thumb: the short digit on the round knuckle, off to the side of the three-part finger. What lets a real thumb touch the other fingertips is not that hinge bend. It is the saddle joint at the base of the thumb.",
    prompt: "Which joint lets the thumb touch the tips of the other fingers?",
    choices: [
      {
        id: "saddle",
        label: "a",
        text: "Saddle joint between the carpal and the metacarpal of the thumb",
        correct: true,
        revisit: "",
      },
      {
        id: "pivot",
        label: "b",
        text: "Pivot joint between atlas and axis",
        revisit:
          "That pivot is in the neck, between the first two vertebrae. Come back to the thumb on the model, the short digit beside the palm. Its reach across the hand is the saddle joint between a carpal and the metacarpal of the thumb.",
      },
      {
        id: "ball",
        label: "c",
        text: "Ball-and-socket joint at the shoulder",
        revisit:
          "The shoulder is ball-and-socket, and it moves the whole arm. Opposition of the thumb is local: a saddle joint between the carpal and the metacarpal of the thumb. The short digit on the dial is the one to look at.",
      },
      {
        id: "glide",
        label: "d",
        text: "Gliding joint between the carpals",
        revisit:
          "Carpals glide on each other, but that slide is not how the thumb opposes the fingers. The joint is a saddle, between one carpal and the metacarpal of the thumb. Look at the short digit set off from the lifting finger.",
      },
    ],
    right:
      "The saddle joint between a carpal and the metacarpal of the thumb. That is the textbook example, and it is what opposition uses.",
  },
];
