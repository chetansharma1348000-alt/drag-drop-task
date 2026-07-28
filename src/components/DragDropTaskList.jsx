import { useState, useRef } from "react";
import { GripVertical } from "lucide-react";
import { COLUMNS, INITIAL_TASKS } from "./taskData.js";
import "./DragDropTaskList.css";

function makeId() {
  return Math.random().toString(36).slice(2, 9);
}

export default function DragDropTaskList() {
  const [board, setBoard] = useState(() => ({
    today: [],
    tomorrow: [],
    thisWeek: [],
    nextWeek: [],
    unplanned: INITIAL_TASKS.map((text) => ({ id: makeId(), text })),
  }));
  const [dragInfo, setDragInfo] = useState(null); // { taskId, fromCol }
  const [dragOverCol, setDragOverCol] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const counter = useRef(INITIAL_TASKS.length);

  function handleDragStart(e, taskId, fromCol) {
    setDragInfo({ taskId, fromCol });
    e.dataTransfer.effectAllowed = "move";
    try {
      e.dataTransfer.setData("text/plain", taskId);
    } catch (err) {
      /* some browsers restrict this in sandboxed iframes; state fallback is enough */
    }
  }

  function handleDragEnd() {
    setDragInfo(null);
    setDragOverCol(null);
    setDragOverIndex(null);
  }

  function handleDragOverColumn(e, colId, index = null) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverCol(colId);
    setDragOverIndex(index);
  }

  function handleDrop(e, toCol, dropIndex = null) {
    e.preventDefault();
    if (!dragInfo) return;
    const { taskId, fromCol } = dragInfo;

    setBoard((prev) => {
      const sourceList = [...prev[fromCol]];
      const taskIdx = sourceList.findIndex((t) => t.id === taskId);
      if (taskIdx === -1) return prev;
      const [task] = sourceList.splice(taskIdx, 1);

      const destList = fromCol === toCol ? sourceList : [...prev[toCol]];

      let insertAt = dropIndex === null ? destList.length : dropIndex;
      if (fromCol === toCol && taskIdx < insertAt) insertAt -= 1;
      insertAt = Math.max(0, Math.min(insertAt, destList.length));
      destList.splice(insertAt, 0, task);

      return {
        ...prev,
        [fromCol]: fromCol === toCol ? destList : sourceList,
        [toCol]: destList,
      };
    });

    setDragInfo(null);
    setDragOverCol(null);
    setDragOverIndex(null);
  }

  return (
    <div className="dnd-root">
      <div className="dnd-header">
        <p className="dnd-eyebrow">Planner · drag any card to any block</p>
        <h1 className="dnd-title">Task Board</h1>
      </div>

      <div className="dnd-grid">
        {COLUMNS.map((col) => {
          const tasks = board[col.id];
          const isFull = col.id === "unplanned";
          return (
            <div
              key={col.id}
              className={
                "dnd-column" +
                (dragOverCol === col.id ? " is-over" : "") +
                (isFull ? " dnd-col-full" : "")
              }
              style={{ "--col-accent": col.accent, "--col-tint": col.tint }}
              onDragOver={(e) => handleDragOverColumn(e, col.id, tasks.length)}
              onDrop={(e) => handleDrop(e, col.id, tasks.length)}
            >
              <div className="dnd-col-tape" />
              <div className="dnd-col-head">
                <span className="dnd-col-label">{col.label}</span>
                <span className="dnd-col-count">{tasks.length}</span>
              </div>
              <div className={"dnd-col-body" + (tasks.length === 0 ? " empty" : "")}>
                {tasks.map((task, idx) => (
                  <div key={task.id}>
                    {dragOverCol === col.id &&
                      dragOverIndex === idx &&
                      dragInfo &&
                      dragInfo.taskId !== task.id && <div className="dnd-drop-line" />}
                    <div
                      className={
                        "dnd-task" +
                        (dragInfo && dragInfo.taskId === task.id ? " dragging" : "")
                      }
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id, col.id)}
                      onDragEnd={handleDragEnd}
                      onDragOver={(e) => {
                        e.stopPropagation();
                        handleDragOverColumn(e, col.id, idx);
                      }}
                      onDrop={(e) => {
                        e.stopPropagation();
                        handleDrop(e, col.id, idx);
                      }}
                    >
                      <GripVertical size={13} className="grip" />
                      <span className="dnd-task-text">{task.text}</span>
                    </div>
                  </div>
                ))}
                {dragOverCol === col.id && dragOverIndex === tasks.length && dragInfo && (
                  <div className="dnd-drop-line" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
