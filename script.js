"use strict";

const dateElement = document.querySelector("#today-date");
const dateInput = document.querySelector("#event-date");
const form = document.querySelector("#schedule-form");
const feedback = document.querySelector("#form-feedback");
const addedPanel = document.querySelector("#added-panel");
const addedList = document.querySelector("#added-list");
const addedCount = document.querySelector("#added-count");
const timeFormatter = new Intl.DateTimeFormat("zh-TW", { hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
const fullDateFormatter = new Intl.DateTimeFormat("zh-TW", { year: "numeric", month: "long", day: "numeric", weekday: "long" });
const shortDateFormatter = new Intl.DateTimeFormat("zh-TW", { month: "long", day: "numeric", weekday: "short" });

function toLocalDateValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function updateToday() {
  const now = new Date();
  dateElement.textContent = fullDateFormatter.format(now);
  dateInput.min = toLocalDateValue(now);
}

const taskStatuses = {
  pending: { label: "待處理", className: "status-pending" },
  progress: { label: "進行中", className: "status-progress" },
  done: { label: "已完成", className: "status-done" }
};

function updateTaskProgress() {
  const items = [...document.querySelectorAll("#task-list .task-item")];
  const complete = items.filter((item) => item.querySelector(".task-status-select").value === "done").length;
  const count = items.length;
  document.querySelector("#task-count").textContent = `${complete} / ${count} 完成`;
  document.querySelector("#progress-text").innerHTML = `${complete} <small>/ ${count} 已完成</small>`;

  items.forEach((item) => {
    const checkbox = item.querySelector(".task-complete");
    const statusSelect = item.querySelector(".task-status-select");
    const status = taskStatuses[statusSelect.value] || taskStatuses.pending;
    checkbox.checked = statusSelect.value === "done";
    item.classList.toggle("is-complete", checkbox.checked);
    statusSelect.className = `task-status-select ${status.className}`;
  });
}

function syncTaskStatus(event) {
  const item = event.target.closest(".task-item");
  if (!item) return;
  const statusSelect = item.querySelector(".task-status-select");
  if (event.target.matches(".task-complete")) {
    statusSelect.value = event.target.checked ? "done" : "pending";
  } else if (event.target.matches(".task-status-select")) {
    item.querySelector(".task-complete").checked = event.target.value === "done";
  } else {
    return;
  }
  updateTaskProgress();
}

document.querySelector("#task-list").addEventListener("change", syncTaskStatus);

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;

  const data = new FormData(form);
  const title = String(data.get("title")).trim();
  const dateValue = String(data.get("date"));
  const timeValue = String(data.get("time"));
  if (!title || !dateValue || !timeValue) {
    feedback.textContent = "請填寫行程名稱、日期與時間。";
    return;
  }

  const date = new Date(`${dateValue}T00:00:00`);
  const item = document.createElement("li");
  item.className = "added-item";
  const name = document.createElement("strong");
  name.textContent = title;
  const dateTime = document.createElement("time");
  dateTime.dateTime = `${dateValue}T${timeValue}`;
  dateTime.textContent = `${shortDateFormatter.format(date)} · ${timeFormatter.format(new Date(`2000-01-01T${timeValue}:00`))}`;
  item.append(name, dateTime);
  addedList.append(item);

  const todayValue = toLocalDateValue(new Date());
  if (dateValue === todayValue) {
    const scheduleItem = document.createElement("article");
    scheduleItem.className = "schedule-item added-schedule-item";
    const eventTime = document.createElement("time");
    eventTime.className = "schedule-time";
    eventTime.dateTime = timeValue;
    const timeText = document.createElement("span");
    timeText.textContent = timeValue;
    const timePeriod = document.createElement("small");
    const hour = Number(timeValue.slice(0, 2));
    timePeriod.textContent = hour < 12 ? "上午" : hour < 18 ? "下午" : "晚上";
    eventTime.append(timeText, timePeriod);
    const dot = document.createElement("span");
    dot.className = "timeline-dot dot-blue";
    dot.setAttribute("aria-hidden", "true");
    const detail = document.createElement("div");
    detail.className = "schedule-detail";
    const eventName = document.createElement("h3");
    eventName.textContent = title;
    const eventNote = document.createElement("p");
    eventNote.textContent = "新增行程";
    detail.append(eventName, eventNote);
    const category = document.createElement("span");
    category.className = "schedule-category category-blue";
    category.textContent = "新增";
    scheduleItem.append(eventTime, dot, detail, category);
    const scheduleList = document.querySelector("#schedule-list");
    const existingEvents = [...scheduleList.querySelectorAll(".schedule-item")];
    const insertBefore = existingEvents.find((existing) => existing.querySelector("time").dateTime > timeValue);
    scheduleList.insertBefore(scheduleItem, insertBefore || null);
    const scheduleCount = scheduleList.querySelectorAll(".schedule-item").length;
    document.querySelector(".schedule-panel .count-pill").textContent = `${scheduleCount} 個安排`;
  }

  addedPanel.hidden = false;
  addedCount.textContent = `${addedList.children.length} 筆`;
  feedback.textContent = `已新增「${title}」行程。`;
  form.reset();
  dateInput.min = toLocalDateValue(new Date());
  document.querySelector("#event-title").focus();
});

updateToday();
updateTaskProgress();
