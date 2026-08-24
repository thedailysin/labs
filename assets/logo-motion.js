(() => {
  const logo = document.querySelector('.shared-logo img, .logo-placeholder img');
  if (!logo || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let angle = 0;
  let target = 0;
  let velocity = 0;
  let frame = 0;
  let touchY = null;

  const animate = () => {
    const pull = (target - angle) * 0.075;
    velocity = (velocity + pull) * 0.79;
    angle += velocity;
    logo.style.transform = `rotate(${angle}deg)`;

    if (Math.abs(target - angle) > 0.015 || Math.abs(velocity) > 0.015) {
      frame = requestAnimationFrame(animate);
    } else {
      angle = target;
      velocity = 0;
      frame = 0;
      logo.style.transform = `rotate(${angle}deg)`;
    }
  };

  const nudge = amount => {
    target += Math.max(-48, Math.min(48, amount));
    if (!frame) frame = requestAnimationFrame(animate);
  };

  addEventListener('wheel', event => {
    nudge(event.deltaY * 0.12);
  }, { passive: true });

  addEventListener('touchstart', event => {
    touchY = event.touches[0]?.clientY ?? null;
  }, { passive: true });

  addEventListener('touchmove', event => {
    const nextY = event.touches[0]?.clientY;
    if (touchY === null || nextY === undefined) return;
    nudge((touchY - nextY) * 0.42);
    touchY = nextY;
  }, { passive: true });

  addEventListener('touchend', () => {
    touchY = null;
  }, { passive: true });

  addEventListener('touchcancel', () => {
    touchY = null;
  }, { passive: true });
})();
