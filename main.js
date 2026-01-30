function numAttr(el, name) {
  const raw = el.getAttribute(name);
  if (raw == null) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

function rafDebounce(fn) {
  let raf = 0;
  return () => {
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      raf = 0;
      fn();
    });
  };
}

function setupBoltSnap() {
  const bolt = document.querySelector(".hero__bolt");
  const lockup = document.querySelector(".hero__lockup");
  if (!bolt || !lockup) return;

  const tipXRaw = numAttr(bolt, "data-tip-x");
  const tipYRaw = numAttr(bolt, "data-tip-y");
  const targetX = numAttr(lockup, "data-target-x");
  const targetY = numAttr(lockup, "data-target-y");
  if (tipXRaw == null || tipYRaw == null || targetX == null || targetY == null) return;

  const tipX = tipXRaw;
  const tipY = tipYRaw;

  const ensureLoaded = () =>
    (bolt.complete && (bolt.naturalWidth || 0) > 0) &&
    (lockup.complete && (lockup.naturalWidth || 0) > 0);

  const relayout = () => {
    if (!ensureLoaded()) return;

    // Always measure from the “base” (no extra dx/dy) to avoid drift on zoom/resizes.
    bolt.style.setProperty("--dx", "0px");
    bolt.style.setProperty("--dy", "0px");

    const boltRect = bolt.getBoundingClientRect();
    const lockRect = lockup.getBoundingClientRect();
    if (boltRect.width <= 0 || boltRect.height <= 0 || lockRect.width <= 0 || lockRect.height <= 0) return;

    const boltW = bolt.naturalWidth;
    const boltH = bolt.naturalHeight;
    const lockW = lockup.naturalWidth;
    const lockH = lockup.naturalHeight;

    const boltScaleX = boltRect.width / boltW;
    const boltScaleY = boltRect.height / boltH;
    const lockScaleX = lockRect.width / lockW;
    const lockScaleY = lockRect.height / lockH;

    const tipGX = boltRect.left + tipX * boltScaleX;
    const tipGY = boltRect.top + tipY * boltScaleY;

    const targetGX = lockRect.left + targetX * lockScaleX;
    const targetGY = lockRect.top + targetY * lockScaleY;

    const dx = targetGX - tipGX;
    const dy = targetGY - tipGY;

    bolt.style.setProperty("--dx", `${dx}px`);
    bolt.style.setProperty("--dy", `${dy}px`);
  };

  const run = rafDebounce(relayout);

  const ro = new ResizeObserver(run);
  ro.observe(bolt);
  ro.observe(lockup);
  window.addEventListener("resize", run, { passive: true });
  bolt.addEventListener("load", run, { passive: true });
  lockup.addEventListener("load", run, { passive: true });
  run();

  return run;
}

setupBoltSnap();
