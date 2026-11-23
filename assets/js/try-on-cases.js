const viewer = document.getElementById("direct-editing-example");
const index = viewer.querySelector(".case-index");
const tabs = Array.from(index.querySelectorAll("[data-case-link]"));
const cases = tabs.map((tab) => document.getElementById(tab.hash.slice(1)));

index.setAttribute("role", "tablist");
tabs.forEach((tab, i) => {
  tab.setAttribute("role", "tab");
  tab.setAttribute("aria-controls", cases[i].id);
  cases[i].setAttribute("role", "tabpanel");
  cases[i].setAttribute("aria-labelledby", tab.id);
  cases[i].tabIndex = 0;
});

function showCase(selected) {
  tabs.forEach((tab, i) => {
    const active = tab === selected;
    tab.setAttribute("aria-selected", String(active));
    tab.tabIndex = active ? 0 : -1;
    cases[i].hidden = !active;
  });
}

function selectTab(tab) {
  showCase(tab);
  if (location.hash !== tab.hash) history.pushState(null, "", tab.hash);
}

for (const [i, tab] of tabs.entries()) {
  tab.addEventListener("click", (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    selectTab(tab);
  });

  tab.addEventListener("keydown", (event) => {
    const next = { ArrowLeft: (i + tabs.length - 1) % tabs.length, ArrowRight: (i + 1) % tabs.length, Home: 0, End: tabs.length - 1 }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    tabs[next].focus();
    selectTab(tabs[next]);
  });
}

function followFragment() {
  const target = document.getElementById(location.hash.slice(1));
  const panel = target?.closest(".case-study");
  const tab = tabs.find((_, i) => cases[i] === panel);
  showCase(tab || tabs[0]);
  if (tab) {
    viewer.scrollIntoView();
  } else {
    const disclosure = target?.closest("details");
    if (disclosure && !disclosure.open) {
      disclosure.open = true;
      target.scrollIntoView();
    }
  }
}

followFragment();
window.addEventListener("hashchange", followFragment);
