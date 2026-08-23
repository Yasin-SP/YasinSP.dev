let lenisInstance = null;

export function setLenisInstance(instance) {
  lenisInstance = instance;
}

export function stopGlobalScroll() {
  lenisInstance?.stop();
}

export function startGlobalScroll() {
  lenisInstance?.start();
}

export function scrollToTop() {
  if (lenisInstance) {
    lenisInstance.scrollTo(0, { immediate: false });
    return;
  }
  window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
}
