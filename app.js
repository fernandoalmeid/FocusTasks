const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const list = document.getElementById("task-list");
const countEl = document.getElementById("count");
const clearBtn = document.getElementById("clear-completed");
const filters = document.querySelectorAll(".filter");

let tasks = JSON.parse(localStorage.getItem("focustasks")) || [];
let currentFilter = "all";

function save() {
  localStorage.setItem("focustasks", JSON.stringify(tasks));
}

function render() {
  list.innerHTML = "";

  const filtered = tasks.filter((t) => {
    if (currentFilter === "active") return !t.completed;
    if (currentFilter === "completed") return t.completed;
    return true;
  });

  if (filtered.length === 0) {
    list.innerHTML = `<li class="empty">No tasks here yet</li>`;
  } else {
    filtered.forEach((task) => {
      const li = document.createElement("li");
      li.className = `task-item ${task.completed ? "completed" : ""}`;
      li.innerHTML = `
        <input type="checkbox" ${task.completed ? "checked" : ""} data-id="${task.id}" />
        <span class="task-text">${escapeHtml(task.text)}</span>
        <button class="delete-btn" data-id="${task.id}" title="Delete">×</button>
      `;
      list.appendChild(li);
    });
  }

  const left = tasks.filter((t) => !t.completed).length;
  countEl.textContent = `${left} task${left !== 1 ? "s" : ""} left`;
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  tasks.unshift({
    id: Date.now(),
    text,
    completed: false,
  });

  input.value = "";
  save();
  render();
});

list.addEventListener("click", (e) => {
  const id = Number(e.target.dataset.id);
  if (!id) return;

  if (e.target.type === "checkbox") {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      task.completed = e.target.checked;
      save();
      render();
    }
  }

  if (e.target.classList.contains("delete-btn")) {
    tasks = tasks.filter((t) => t.id !== id);
    save();
    render();
  }
});

clearBtn.addEventListener("click", () => {
  tasks = tasks.filter((t) => !t.completed);
  save();
  render();
});

filters.forEach((btn) => {
  btn.addEventListener("click", () => {
    filters.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    render();
  });
});

render();