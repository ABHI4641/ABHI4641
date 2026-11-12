# qSarthi · Joints of the hand

A single NEET Biology lesson (Class 11, locomotion and movement) for [qSarthi](https://www.qsarthi.com/). The student turns one 3D figure, answers three checks, and can ask a tutor that works with no API key.

The figure is the Anatomy project’s own 3D viewer, copied unchanged:

`public/vendor/anatomy/turning-dial-light.html`

from [wheresryan22/anatomy](https://github.com/wheresryan22/anatomy) `examples/turning-dial/turning-dial-light.html` (MIT). See `public/vendor/anatomy/SOURCE.txt`.

That viewer shows a jointed mechanical hand on a turning dial. This lesson uses the finger that lifts, and the thumb beside it. It does not redraw the figure.

## Run

```sh
cd apps/neet-anatomy
npm install
npm run dev
```

Open the URL Vite prints (http://127.0.0.1:5173). No environment variables.

`npm run build` then `npm run preview` serves the production build.
