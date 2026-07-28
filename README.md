# Drag & Drop Task List

A 5-block (Today / Tomorrow / This Week / Next Week / Unplanned) drag-and-drop
task board, built with React + Vite.

## Project structure

```
drag-drop-task-list/
├── index.html
├── package.json
├── vite.config.js
├── README.md
└── src/
    ├── main.jsx                     # React entry point
    ├── App.jsx                      # App root
    ├── index.css                    # Global base styles
    └── components/
        ├── DragDropTaskList.jsx     # Main board component (state + drag logic)
        ├── DragDropTaskList.css     # Component styles
        └── taskData.js              # Column config + seeded task list
```

## Getting started

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually http://localhost:5173).

## Build for production

```bash
npm run build
npm run preview
```

## Notes

- `Unplanned` starts with 10 seeded tasks; the other four blocks start empty.
- Tasks can be dragged between any block and any other block, and reordered
  within a block.
- Column colors/labels live in `src/components/taskData.js` — edit that file
  to rename blocks or change the color coding.
