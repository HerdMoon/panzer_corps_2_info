(function () {
  const STORAGE_KEY = "pz2_units_index_filters";
  const input = document.getElementById("filter");
  const factionSelect = document.getElementById("factionFilter");
  const rows = Array.from(document.querySelectorAll("tbody tr"));
  const count = document.getElementById("visibleCount");

  function loadSavedFilters() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (typeof saved.q === "string") input.value = saved.q;
      if (typeof saved.faction === "string") factionSelect.value = saved.faction;
    } catch (_err) {
      // Ignore malformed storage data.
    }
  }

  function saveFilters(q, faction) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ q, faction }));
    } catch (_err) {
      // Ignore storage failures.
    }
  }

  function runFilter() {
    const q = input.value.trim().toLowerCase();
    const selectedFaction = factionSelect.value;
    let visible = 0;
    rows.forEach((row) => {
      const text = row.dataset.search;
      const factions = (row.dataset.factions || "").split(",");
      const textMatch = !q || text.includes(q);
      const factionMatch = !selectedFaction || factions.includes(selectedFaction);
      const show = textMatch && factionMatch;
      row.style.display = show ? "" : "none";
      if (show) visible += 1;
    });
    count.textContent = String(visible);
    saveFilters(input.value, selectedFaction);
  }

  loadSavedFilters();
  input.addEventListener("input", runFilter);
  factionSelect.addEventListener("change", runFilter);
  runFilter();
})();
