import "bootstrap-icons/font/bootstrap-icons.css";
import "./assets/scss/all.scss";

const accordionTriggers = document.querySelectorAll(".accordion-trigger");

accordionTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const panelId = trigger.getAttribute("aria-controls");

    if (!panelId) {
      return;
    }

    const panel = document.getElementById(panelId);

    if (!panel) {
      return;
    }

    const isExpanded = trigger.getAttribute("aria-expanded") === "true";

    trigger.setAttribute("aria-expanded", String(!isExpanded));
    panel.hidden = isExpanded;
  });
});

document.querySelectorAll(".tab-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const targetId = button.getAttribute("data-target");

    // 1. 移除所有按鈕的 active 狀態
    document
      .querySelectorAll(".tab-btn")
      .forEach((btn) => btn.classList.remove("active"));
    // 2. 移除所有面板的 active 狀態
    document
      .querySelectorAll(".tab-panel")
      .forEach((panel) => panel.classList.remove("active"));

    // 3. 為當前點擊的按鈕與對應面板加上 active
    button.classList.add("active");
    document.getElementById(targetId).classList.add("active");
  });
});

// (mobile menu toggle removed)
