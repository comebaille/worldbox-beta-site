(() => {
  const MOBILE_QUERY = "(max-width: 900px)";
  const pendingTasks = new Map();

  function isCompactLayout() {
    return window.matchMedia(MOBILE_QUERY).matches;
  }

  function isPanelVisible(element) {
    if (!element || element.hidden) return false;
    if (isCompactLayout() && element.classList.contains("mobile-panel-collapsed")) return false;
    return true;
  }

  function schedule(key, task, options = {}) {
    cancel(key);
    if (options.immediate) {
      task();
      return;
    }

    const run = () => {
      pendingTasks.delete(key);
      task();
    };
    const handle = typeof window.requestIdleCallback === "function"
      ? window.requestIdleCallback(run, { timeout: options.timeout ?? 180 })
      : window.setTimeout(run, 16);
    pendingTasks.set(key, handle);
  }

  function cancel(key) {
    const handle = pendingTasks.get(key);
    if (handle === undefined) return;
    if (typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(handle);
    window.clearTimeout(handle);
    pendingTasks.delete(key);
  }

  window.WorldBoxRuntime = {
    isCompactLayout,
    isPanelVisible,
    schedule,
    cancel,
  };
})();
