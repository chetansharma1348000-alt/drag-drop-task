function Task({ task, columnKey }) {
  const autoScroll = (e) => {
    const threshold = 120;
    const speed = 15;

    const y = e.clientY;

    // Scroll up
    if (y < threshold) {
      window.scrollBy({
        top: -speed,
        behavior: "auto",
      });
    }

    // Scroll down
    if (y > window.innerHeight - threshold) {
      window.scrollBy({
        top: speed,
        behavior: "auto",
      });
    }
  };

  const handleDragStart = (e) => {
    e.dataTransfer.setData("task", task);
    e.dataTransfer.setData("source", columnKey);

    document.addEventListener("dragover", autoScroll);

    setTimeout(() => {
      e.target.classList.add("dragging");
    }, 0);
  };

  const handleDragEnd = (e) => {
    e.target.classList.remove("dragging");
    document.removeEventListener("dragover", autoScroll);
  };

  return (
    <div
      className="task"
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="task-left">
        <span className="drag-icon">☰</span>
        <span className="task-title">{task}</span>
      </div>

      <span className="task-arrow">→</span>
    </div>
  );
}

export default Task;
