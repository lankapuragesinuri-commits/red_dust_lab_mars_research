/* RED DUST LAB — interactive research website
   All values below are the observations and assumptions documented on the page.
   No simulated or synthetic voltage readings are generated. */
(function () {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const lightbox = $("#photoLightbox");
  const lightboxImage = $("#lightboxImage");
  const lightboxCaption = $("#lightboxCaption");
  const closeLightbox = () => { if (lightbox?.open) lightbox.close(); };
  $$('[data-lightbox="evidence"]').forEach((link) => link.addEventListener("click", (event) => {
    if (!lightbox || !lightboxImage) return;
    event.preventDefault();
    const image = $("img", link);
    lightboxImage.src = link.href;
    lightboxImage.alt = image?.alt || "Experimental photograph";
    lightboxCaption.textContent = image?.alt || "RED DUST LAB experimental photograph";
    lightbox.showModal();
  }));
  $("#lightboxClose")?.addEventListener("click", closeLightbox);
  lightbox?.addEventListener("click", (event) => { if (event.target === lightbox) closeLightbox(); });
  lightbox?.addEventListener("close", () => { if (lightboxImage) lightboxImage.removeAttribute("src"); });

  // Mobile navigation
  const menuToggle = $("#menuToggle");
  const mainNav = $("#mainNav");
  menuToggle?.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    menuToggle.textContent = isOpen ? "×" : "☰";
  });
  $$("#mainNav a").forEach((link) => link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
    if (menuToggle) { menuToggle.textContent = "☰"; menuToggle.setAttribute("aria-label", "Open navigation"); }
  }));

  // Scroll progress indicator
  const progress = $("#scrollProgress");
  const updateProgress = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const percent = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    if (progress) progress.style.width = `${Math.min(100, Math.max(0, percent))}%`;
  };
  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  // Reveal-on-scroll animation; content remains visible when reduced motion is requested.
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealItems = $$(".reveal");
  if ("IntersectionObserver" in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  // Count-up metrics
  const counters = $$(".count-up");
  const animateCounter = (element) => {
    const target = Number(element.dataset.count);
    if (!Number.isFinite(target)) return;
    if (reducedMotion) { element.textContent = String(target); return; }
    const start = performance.now();
    const duration = 900;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      element.textContent = String(Math.round(target * eased));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if ("IntersectionObserver" in window && !reducedMotion) {
    const countObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.65 });
    counters.forEach((counter) => countObserver.observe(counter));
  } else {
    counters.forEach(animateCounter);
  }

  // Active navigation state
  const sections = $$("main section[id]");
  if ("IntersectionObserver" in window) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        $$("#mainNav a").forEach((link) => {
          const active = link.getAttribute("href") === `#${entry.target.id}`;
          link.classList.toggle("active", active);
        });
      });
    }, { rootMargin: "-35% 0px -55% 0px" });
    sections.forEach((section) => navObserver.observe(section));
  }

  // Floating dust particles in hero — decorative only, not a physical dust model.
  const canvas = $("#dustCanvas");
  const ctx = canvas?.getContext("2d");
  if (canvas && ctx && !reducedMotion) {
    let width = 0, height = 0, particles = [];
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.6);
      width = rect.width; height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(72, Math.max(22, Math.round(width / 17)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 0.45 + Math.random() * 1.45,
        vx: -0.13 + Math.random() * 0.28,
        vy: -0.18 - Math.random() * 0.26,
        alpha: 0.12 + Math.random() * 0.42,
        phase: Math.random() * Math.PI * 2
      }));
    };
    let frame = 0;
    const drawDust = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.x += p.vx + Math.sin(frame * 0.006 + p.phase) * 0.08;
        p.y += p.vy;
        if (p.y < -5) { p.y = height + 5; p.x = Math.random() * width; }
        if (p.x < -5) p.x = width + 5;
        if (p.x > width + 5) p.x = -5;
        ctx.beginPath();
        ctx.fillStyle = `rgba(230, 173, 126, ${p.alpha})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      frame += 1;
      requestAnimationFrame(drawDust);
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas, { passive: true });
    drawDust();
  }

  // Conceptual coverage explorer retained from the original RED DUST LAB site.
  const coverageRange = $("#coverageRange");
  const coverageValue = $("#coverageValue");
  const uncoveredValue = $("#uncoveredValue");
  const dustLayer = $("#dustLayer");
  const updateCoverage = () => {
    if (!coverageRange || !coverageValue || !uncoveredValue || !dustLayer) return;
    const amount = Math.max(0, Math.min(90, Number(coverageRange.value) || 0));
    coverageValue.textContent = `${amount}%`;
    uncoveredValue.textContent = `${100 - amount}%`;
    dustLayer.style.clipPath = `inset(0 ${100 - amount}% 0 0)`;
    coverageRange.setAttribute("aria-valuetext", `${amount}% illustrative coverage`);
  };
  coverageRange?.addEventListener("input", updateCoverage);
  updateCoverage();

  // Recorded observations used for the chart and CSV export.
  const chartData = {
    labels: ["2:50 p.m.", "3:03 p.m.", "3:06 p.m."],
    rover01: { label: "Rover 01", color: "#c56f4b", voltage: [9.8, 8.9, 0], decrease: [0, 9.1836734694, 100], names: ["9.8 V", "8.9 V", "No measurable output"] },
    rover02: { label: "Rover 02", color: "#4f9ab5", voltage: [4.8, 4.5, 3.5], decrease: [0, 6.25, 27.0833333333], names: ["4.8 V", "4.5 V", "≈3.5 V"] },
    main: { label: "Main panel", color: "#c49a4c", voltage: [0.8, 0, 0], decrease: [0, 100, 100], names: ["0.8 V", "No measurable output", "0 V / no measurable output"] }
  };
  let chartMode = "voltage";
  const visibleSeries = new Set(["rover01", "rover02", "main"]);
  const chart = $("#voltageChart");
  const tooltip = $("#chartTooltip");
  const SVG_NS = "http://www.w3.org/2000/svg";
  const makeSvg = (tag, attrs = {}, textContent = null) => {
    const node = document.createElementNS(SVG_NS, tag);
    Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, String(value)));
    if (textContent !== null) node.textContent = textContent;
    return node;
  };

  function renderChart() {
    if (!chart) return;
    chart.replaceChildren();
    const W = 920, H = 360, left = 64, right = 22, top = 24, bottom = 54;
    const plotW = W - left - right, plotH = H - top - bottom;
    const allValues = [];
    visibleSeries.forEach((key) => chartData[key][chartMode].forEach((value) => {
      if (value !== null && Number.isFinite(value)) allValues.push(value);
    }));
    let minY = chartMode === "voltage" ? 0 : 0;
    let maxY = chartMode === "voltage" ? 10 : 100;
    if (chartMode === "drop" && allValues.length && Math.max(...allValues) < 100) maxY = 100;
    const xAt = (index) => left + (plotW * index / (chartData.labels.length - 1));
    const yAt = (value) => top + plotH * (1 - ((value - minY) / (maxY - minY)));

    for (let i = 0; i <= 5; i += 1) {
      const value = minY + ((maxY - minY) * i / 5);
      const y = yAt(value);
      chart.appendChild(makeSvg("line", { x1: left, x2: W - right, y1: y, y2: y, class: "chart-grid-line" }));
      chart.appendChild(makeSvg("text", { x: left - 13, y: y + 4, "text-anchor": "end", class: "chart-axis-label" }, chartMode === "voltage" ? `${value.toFixed(0)} V` : `${value.toFixed(0)}%`));
    }
    chartData.labels.forEach((label, index) => {
      const x = xAt(index);
      chart.appendChild(makeSvg("line", { x1: x, x2: x, y1: top, y2: H - bottom, stroke: "#f0ebe3", "stroke-width": 1, "stroke-dasharray": "3 6" }));
      chart.appendChild(makeSvg("text", { x, y: H - 24, "text-anchor": "middle", class: "chart-axis-label" }, label));
    });
    chart.appendChild(makeSvg("text", { x: left, y: 13, class: "chart-axis-label" }, chartMode === "voltage" ? "VOLTAGE (VOLTS)" : "DECREASE FROM INITIAL READING (%)"));

    ["rover01", "rover02", "main"].forEach((key) => {
      if (!visibleSeries.has(key)) return;
      const series = chartData[key];
      const values = series[chartMode];
      let path = "";
      let started = false;
      values.forEach((value, index) => {
        if (value === null || !Number.isFinite(value)) { started = false; return; }
        const command = `${xAt(index)},${yAt(value)}`;
        path += `${started ? " L " : " M "}${command}`;
        started = true;
      });
      if (path) chart.appendChild(makeSvg("path", { d: path, class: `chart-series series-${key.replace("rover", "rover")}`, stroke: series.color }));
      values.forEach((value, index) => {
        if (value === null || !Number.isFinite(value)) return;
        const point = makeSvg("circle", {
          cx: xAt(index), cy: yAt(value), r: 5.2,
          class: `chart-point ${key === "rover01" ? "rover01" : key === "rover02" ? "rover02" : "main"}`,
          tabindex: 0, role: "img",
          "aria-label": `${series.label}, ${chartData.labels[index]}: ${series.names[index]}`
        });
        const title = makeSvg("title", {}, `${series.label} · ${chartData.labels[index]} · ${series.names[index]}`);
        point.appendChild(title);
        const showTip = (event) => {
          if (!tooltip) return;
          tooltip.innerHTML = `<b>${series.label}</b>${chartData.labels[index]}<br>${series.names[index]}`;
          tooltip.classList.add("visible");
          const rect = chart.getBoundingClientRect();
          const clientX = event.clientX || rect.left + (xAt(index) / W) * rect.width;
          const clientY = event.clientY || rect.top + (yAt(value) / H) * rect.height;
          tooltip.style.left = `${Math.max(0, Math.min(rect.width - 145, clientX - rect.left + 10))}px`;
          tooltip.style.top = `${Math.max(0, clientY - rect.top - 42)}px`;
        };
        point.addEventListener("pointerenter", showTip);
        point.addEventListener("pointermove", showTip);
        point.addEventListener("pointerleave", () => tooltip?.classList.remove("visible"));
        point.addEventListener("focus", showTip);
        point.addEventListener("blur", () => tooltip?.classList.remove("visible"));
        chart.appendChild(point);
      });
    });
    if (!visibleSeries.size) {
      chart.appendChild(makeSvg("text", { x: W / 2, y: H / 2, "text-anchor": "middle", class: "chart-no-data" }, "Select at least one series above."));
    }
  }
  renderChart();

  $$("[data-chart-mode]").forEach((button) => button.addEventListener("click", () => {
    chartMode = button.dataset.chartMode;
    $$("[data-chart-mode]").forEach((other) => {
      const active = other === button;
      other.classList.toggle("active", active);
      other.setAttribute("aria-pressed", String(active));
    });
    renderChart();
  }));
  $$("[data-series]").forEach((button) => button.addEventListener("click", () => {
    const key = button.dataset.series;
    if (visibleSeries.has(key)) visibleSeries.delete(key); else visibleSeries.add(key);
    const active = visibleSeries.has(key);
    button.classList.toggle("selected", active);
    button.setAttribute("aria-pressed", String(active));
    renderChart();
  }));

  // Export source observations as CSV. Unverified timing is retained as text and not fabricated.
  const downloadButton = $("#downloadCsv");
  downloadButton?.addEventListener("click", () => {
    const rows = [
      ["Observation", "Time", "Rover 01 (V)", "Rover 02 (V)", "Main panel (V)", "Notes"],
      ["Initial", "2:50 p.m.", "9.8", "4.8", "0.8", "Initial recorded readings"],
      ["Second", "Timestamp to verify", "9.0", "4.6", "", "Main panel: very small output, not quantified; excluded from time-series chart"],
      ["Third", "3:03 p.m.", "8.9", "4.5", "0", "Main panel: 0 V / no measurable output reported"],
      ["Final", "3:06 p.m.", "0", "3.5 approx.", "0", "Rover 01 and main panel: 0 V / no measurable output"]
    ];
    const csv = rows.map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(",")).join("
");
    const blob = new Blob(["﻿", csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url; anchor.download = "RED-DUST-LAB-RDL-001-observations.csv";
    document.body.appendChild(anchor); anchor.click(); anchor.remove();
    URL.revokeObjectURL(url);
  });
})();
