(function () {
  const PST = "America/Los_Angeles";
  const STORAGE_TREATS = "rubys-world-treats";

  function getPstDayKey() {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: PST,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());
  }

  function getPstDateLabel() {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: PST,
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date());
  }

  function loadTreatState() {
    const today = getPstDayKey();
    try {
      const raw = localStorage.getItem(STORAGE_TREATS);
      if (!raw) return { day: today, count: 0 };
      const data = JSON.parse(raw);
      if (data.day !== today) return { day: today, count: 0 };
      const count = Number(data.count);
      return {
        day: today,
        count: Number.isFinite(count) ? Math.max(0, Math.floor(count)) : 0,
      };
    } catch {
      return { day: today, count: 0 };
    }
  }

  function saveTreatState(state) {
    localStorage.setItem(STORAGE_TREATS, JSON.stringify(state));
  }

  const treatDateEl = document.getElementById("treat-date");
  const treatCountEl = document.getElementById("treat-count");
  const treatBtn = document.getElementById("treat-btn");

  if (treatDateEl) treatDateEl.textContent = getPstDateLabel();

  function syncTreatUi() {
    const state = loadTreatState();
    if (treatCountEl) treatCountEl.textContent = String(state.count);
    saveTreatState(state);
  }

  syncTreatUi();

  let lastPstDay = getPstDayKey();
  setInterval(() => {
    const today = getPstDayKey();
    if (today !== lastPstDay) {
      lastPstDay = today;
      if (treatDateEl) treatDateEl.textContent = getPstDateLabel();
      saveTreatState({ day: today, count: 0 });
      if (treatCountEl) treatCountEl.textContent = "0";
    }
  }, 60_000);

  if (treatBtn) {
    treatBtn.addEventListener("click", () => {
      const state = loadTreatState();
      state.count += 1;
      saveTreatState(state);
      if (treatCountEl) treatCountEl.textContent = String(state.count);
    });
  }
})();
