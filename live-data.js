/**
 * CrowdShield - Live Data Connector
 * Include this AFTER dashboard.js in dashboard.html
 */

(function () {
  const LOCAL_API = "http://localhost:5050/api/crowd-data";
  const FALLBACK_JSON = "detection_data.json";
  const POLL_INTERVAL_MS = 2000;

  let useLocalApi = true;

  async function fetchData() {
    if (useLocalApi) {
      try {
        const res = await fetch(LOCAL_API, { cache: "no-store" });
        if (res.ok) return await res.json();
        throw new Error("API responded with error");
      } catch (e) {
        useLocalApi = false;
      }
    }

    try {
      const res = await fetch(FALLBACK_JSON, { cache: "no-store" });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("CrowdShield: no live data source available", e);
    }
    return null;
  }

  function applyData(data) {
    if (!data) return;

    document.querySelectorAll('[data-live="count"]').forEach((el) => {
      el.textContent = data.count;
    });

    document.querySelectorAll('[data-live="level"]').forEach((el) => {
      el.textContent = data.level;
      el.classList.remove("status-safe", "status-warning", "status-critical");
      el.classList.add("status-" + data.level.toLowerCase());
    });

    document.querySelectorAll('[data-live="timestamp"]').forEach((el) => {
      const ts = data.timestamp ? new Date(data.timestamp) : new Date();
      el.textContent = ts.toLocaleTimeString();
    });

    window.dispatchEvent(new CustomEvent("crowdshield:update", { detail: data }));
  }

  async function poll() {
    const data = await fetchData();
    applyData(data);
  }

  document.addEventListener("DOMContentLoaded", () => {
    poll();
    setInterval(poll, POLL_INTERVAL_MS);
  });
})();