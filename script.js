let currentDate = new Date();

document.getElementById("prev").addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
});

document.getElementById("next").addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
});

async function loadEvents() {
  const response = await fetch("events.json");
  return await response.json();
}

function formatDate(date) {
  return date.toISOString().split("T")[0];
}

async function renderCalendar() {
  const monthYear = document.getElementById("monthYear");
  const calendarGrid = document.getElementById("calendarGrid");

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const events = await loadEvents();
  calendarGrid.innerHTML = "";
  monthYear.textContent = `${currentDate.toLocaleString("default", { month: "long" })} ${year}`;

  // Padding days before 1st
  for (let i = 0; i < firstDay; i++) {
    const cell = document.createElement("div");
    cell.className = "day-cell";
    calendarGrid.appendChild(cell);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dateStr = formatDate(date);
    const cell = document.createElement("div");
    cell.className = "day-cell";

    if (formatDate(today) === dateStr) {
      cell.classList.add("today");
    }

    const strong = document.createElement("strong");
    strong.textContent = day;
    cell.appendChild(strong);

    const dayEvents = events.filter(e => e.date === dateStr);
    const seenTimes = new Set();

    dayEvents.forEach(event => {
      const eventEl = document.createElement("div");
      eventEl.className = "event";
      if (seenTimes.has(event.time)) {
        eventEl.classList.add("conflict");
      }
      seenTimes.add(event.time);

      eventEl.textContent = `${event.time} - ${event.title}`;
      cell.appendChild(eventEl);
    });

    calendarGrid.appendChild(cell);
  }
}

renderCalendar();
