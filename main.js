import "./assets/scss/all.scss";
import "bootstrap-icons/font/bootstrap-icons.css";

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
