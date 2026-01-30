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

  const baseTransform = "translate(-50%, -50%)";

  const boltVB = {
    x: numAttr(bolt, "data-vb-x") ?? 0,
    y: numAttr(bolt, "data-vb-y") ?? 0,
    w: numAttr(bolt, "data-vb-w"),
    h: numAttr(bolt, "data-vb-h"),
  };
  const lockVB = {
    x: numAttr(lockup, "data-vb-x") ?? 0,
    y: numAttr(lockup, "data-vb-y") ?? 0,
    w: numAttr(lockup, "data-vb-w"),
    h: numAttr(lockup, "data-vb-h"),
  };
  if (
    boltVB.w == null ||
    boltVB.h == null ||
    lockVB.w == null ||
    lockVB.h == null ||
    boltVB.w <= 0 ||
    boltVB.h <= 0 ||
    lockVB.w <= 0 ||
    lockVB.h <= 0
  ) {
    return;
  }

  const tipXRaw = numAttr(bolt, "data-tip-x");
  const tipYRaw = numAttr(bolt, "data-tip-y");
  const targetX = numAttr(lockup, "data-target-x");
  const targetY = numAttr(lockup, "data-target-y");
  if (tipXRaw == null || tipYRaw == null || targetX == null || targetY == null) return;

  const tipX = tipXRaw;
  const tipY = tipYRaw;

  const ensureLoaded = () => bolt.complete && lockup.complete;

  const applyOffset = (dx, dy) => {
    if (!Number.isFinite(dx) || !Number.isFinite(dy)) return;
    bolt.style.transform = `${baseTransform} translate3d(${dx}px, ${dy}px, 0)`;
  };

  const toGlobal = (rect, vb, x, y) => {
    const nx = (x - vb.x) / vb.w;
    const ny = (y - vb.y) / vb.h;
    return {
      x: rect.left + nx * rect.width,
      y: rect.top + ny * rect.height,
    };
  };

  const relayout = () => {
    if (!ensureLoaded()) return;

    // Always measure from the “base” (no extra dx/dy) to avoid drift on zoom/resizes.
    bolt.style.transform = baseTransform;

    const boltRect = bolt.getBoundingClientRect();
    const lockRect = lockup.getBoundingClientRect();
    if (boltRect.width <= 0 || boltRect.height <= 0 || lockRect.width <= 0 || lockRect.height <= 0) return;

    const tipG = toGlobal(boltRect, boltVB, tipX, tipY);
    const targetG = toGlobal(lockRect, lockVB, targetX, targetY);

    const dx = targetG.x - tipG.x;
    const dy = targetG.y - tipG.y;

    applyOffset(dx, dy);
  };

  const run = rafDebounce(relayout);

  if (window.ResizeObserver) {
    const ro = new ResizeObserver(run);
    ro.observe(bolt);
    ro.observe(lockup);
  }
  window.addEventListener("resize", run, { passive: true });
  window.addEventListener("orientationchange", run, { passive: true });
  window.visualViewport?.addEventListener("resize", run, { passive: true });
  bolt.addEventListener("load", run, { passive: true });
  lockup.addEventListener("load", run, { passive: true });
  run();

  return run;
}

setupBoltSnap();
