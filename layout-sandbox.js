// Layout sandbox: drag and resize the office furniture, then copy the CSS values.
// This file only controls layout-sandbox.html. It never touches the real game
// (index.html, style.css, script.js) or the real game's saved progress.

// ---- The furniture list -------------------------------------------------------
// To swap in new artwork later, change that object's `art` file name (and, if the
// picture has different transparent margins, its `hit` box). Everything else on the
// page is built from this list.
//   group : which parent the piece lives in in the REAL game (for the layer warning)
//   hit   : top right bottom left of the visible part, as % of the picture. Only that
//           part catches the mouse, so transparent edges don't grab clicks.
//           (Measured from each PNG's transparency on 4 Nov 2026.)
const FOLDER = "images/objects/";
const OBJECTS = [
  {
    id: "bookcase", label: "Bookcase", group: "left-side",
    art: "Detective Bookcase of Mysteries.png",
    oldArt: "Golden Detective Bookcase of Mysteries.png", // what v1 layouts were made with
    hit: "16.3% 3.4% 12.8% 3.5%",
    start: { left: 20, top: 25, width: 30 },
  },
  {
    id: "chaise", label: "Chaise", group: "left-side",
    art: "purple-chaise-transparent.png",
    oldArt: "purple-chaise-transparent.png", // unchanged, so old values still fit
    hit: "4.8% 1.5% 4.4% 1.5%",
    start: { left: 3, top: 52, width: 36 },
  },
  {
    id: "desk", label: "Desk", group: "right-side",
    art: "Luxurious Mahogany Mushroom Emblem Desk.png",
    oldArt: "(old brown placeholder box)",
    hit: "11.1% 6.2% 13.7% 7.4%",
    start: { left: 58, top: 48, width: 36 },
  },
  {
    id: "chair", label: "Chair", group: "right-side",
    art: "Ornate Mushroom Emblem Leather Chair - transparent.png",
    oldArt: null, // new in this version: there is no old layout for it
    hit: "5.4% 12.1% 5.5% 8.3%",
    start: { left: 68, top: 30, width: 15 },
  },
];

// Back to front. The chair starts behind the desk.
const START_ORDER = ["chair", "desk", "bookcase", "chaise"];

// The real game's clue movement (style.css: #chaise.chaise-shifted), as a starting point.
const SHIFT_START = { rot: -4, x: 2 };

const STORAGE_KEY = "layoutSandbox.v2";
const OLD_STORAGE_KEY = "layoutSandbox.v1"; // read for migration, NEVER changed or deleted

const IDS = OBJECTS.map(function (o) { return o.id; });
const BY_ID = {};
OBJECTS.forEach(function (o) { BY_ID[o.id] = o; });

const stage = document.getElementById("stage");
const readout = document.getElementById("readout");
const statusText = document.getElementById("status");
const cardsBox = document.getElementById("cards");
const flipBox = document.getElementById("flip-chaise");
const shiftBox = document.getElementById("shift-preview");
const shiftRotInput = document.getElementById("shift-rot");
const shiftXInput = document.getElementById("shift-x");
const layerWarning = document.getElementById("layer-warning");

// ---- Saved layout -------------------------------------------------------------
// Saved shape (v2):
//   items[id] = { left, top, width, art }   art = the picture these numbers were made with
//   order     = ids back to front
//   flipChaise, shiftPreview, shiftRot, shiftX, selected, migrated
// If `art` differs from the picture now in use, the card says "check the alignment"
// instead of quietly treating the old numbers as final.

function freshState() {
  const items = {};
  OBJECTS.forEach(function (o) {
    items[o.id] = { left: o.start.left, top: o.start.top, width: o.start.width, art: o.art };
  });
  return {
    version: 2,
    items: items,
    order: START_ORDER.slice(),
    selected: "chaise",
    flipChaise: false,
    shiftPreview: false,
    shiftRot: SHIFT_START.rot,
    shiftX: SHIFT_START.x,
    migrated: false,
  };
}

function numbersOk(it) {
  return !!it && ["left", "top", "width"].every(function (k) { return Number.isFinite(it[k]); });
}

function readJson(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch (err) {
    return null; // nothing saved, or storage is blocked
  }
}

function loadState() {
  const state = freshState();

  // 1. A v2 layout wins.
  const v2 = readJson(STORAGE_KEY);
  if (v2 && v2.items) {
    OBJECTS.forEach(function (o) {
      const it = v2.items[o.id];
      if (numbersOk(it)) {
        state.items[o.id] = { left: it.left, top: it.top, width: it.width, art: typeof it.art === "string" ? it.art : o.oldArt };
      }
    });
    if (Array.isArray(v2.order)) {
      const known = v2.order.filter(function (id) { return IDS.includes(id); });
      const missing = IDS.filter(function (id) { return !known.includes(id); });
      state.order = missing.concat(known); // anything new goes to the back
    }
    if (IDS.includes(v2.selected)) state.selected = v2.selected;
    state.flipChaise = v2.flipChaise === true;
    state.shiftPreview = v2.shiftPreview === true;
    if (Number.isFinite(v2.shiftRot)) state.shiftRot = v2.shiftRot;
    if (Number.isFinite(v2.shiftX)) state.shiftX = v2.shiftX;
    state.migrated = v2.migrated === true;
    return state;
  }

  // 2. No v2 yet: carry over the v1 arrangement. v1 is only read, never changed.
  const v1 = readJson(OLD_STORAGE_KEY);
  if (v1 && v1.items) {
    let carried = 0;
    OBJECTS.forEach(function (o) {
      const it = v1.items[o.id];
      if (numbersOk(it)) {
        // Keep her numbers, and remember they were made with the OLD picture.
        state.items[o.id] = { left: it.left, top: it.top, width: it.width, art: o.oldArt };
        carried++;
      }
    });
    if (carried > 0) {
      if (Array.isArray(v1.order)) {
        const known = v1.order.filter(function (id) { return IDS.includes(id); });
        const missing = IDS.filter(function (id) { return !known.includes(id); });
        state.order = missing.concat(known);
      }
      if (IDS.includes(v1.selected)) state.selected = v1.selected;
      state.migrated = true;
    }
  }

  // 3. Nothing saved: the starting suggestions.
  return state;
}

let state = loadState();
let drag = null;

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    // Saving is a convenience only.
  }
}

function round1(n) {
  return Math.round(n * 10) / 10;
}

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

function setField(id, field, value) {
  const limits = { left: [-50, 100], top: [-50, 100], width: [2, 100] };
  state.items[id][field] = round1(clamp(value, limits[field][0], limits[field][1]));
}

function needsCheck(id) {
  return state.items[id].art !== BY_ID[id].art;
}

// ---- The pieces on the stage ---------------------------------------------------

const items = {};
const cards = {};

function buildItem(o) {
  const el = document.createElement("div");
  el.className = "item";
  el.dataset.id = o.id;
  el.style.setProperty("--hit", o.hit);

  const img = document.createElement("img");
  img.src = FOLDER + o.art;
  img.alt = "";
  img.draggable = false;
  img.addEventListener("load", function () {
    const dims = cards[o.id] && cards[o.id].querySelector(".art-info");
    if (dims) dims.textContent = o.art + " (" + img.naturalWidth + " x " + img.naturalHeight + " px)";
  });
  img.addEventListener("error", function () {
    const dims = cards[o.id] && cards[o.id].querySelector(".art-info");
    if (dims) dims.textContent = "Could not load " + o.art;
  });

  const hit = document.createElement("div");
  hit.className = "hit";

  el.appendChild(img);
  el.appendChild(hit);
  stage.appendChild(el);
  items[o.id] = el;
}

function buildCard(o) {
  const card = document.createElement("section");
  card.className = "card";
  card.innerHTML =
    '<h3><label><input type="radio" name="selected" value="' + o.id + '"> ' + o.label +
    ' <span class="tag">real game: ' + o.group + "</span></label></h3>" +
    '<p class="art-info small"></p>' +
    '<div class="check-note" hidden>' +
    '<span>Position carried over from your earlier arrangement (older artwork). The new picture has different margins and proportions, so check the alignment.</span> ' +
    '<button type="button" data-action="checked">Looks right, mark as checked</button>' +
    "</div>" +
    '<div class="fields">' +
    '<label>left <input type="number" step="0.1" data-field="left"> %</label>' +
    '<label>top <input type="number" step="0.1" data-field="top"> %</label>' +
    '<label>width <input type="number" step="0.1" min="2" max="100" data-field="width"> %</label>' +
    "</div>" +
    '<input type="range" min="2" max="90" step="0.1" data-field="width" aria-label="' + o.label + ' width">' +
    '<div class="layer">' +
    '<button type="button" data-action="back">Send backward</button>' +
    '<button type="button" data-action="forward">Bring forward</button>' +
    '<span class="layer-label"></span>' +
    "</div>";

  card.addEventListener("input", function (e) {
    const field = e.target.dataset.field;
    if (!field) return;
    const value = parseFloat(e.target.value);
    if (!Number.isFinite(value)) return;
    setField(o.id, field, value);
    commit();
  });

  card.addEventListener("change", function (e) {
    if (e.target.name === "selected") select(o.id);
  });

  card.addEventListener("click", function (e) {
    const action = e.target.dataset.action;
    if (action === "forward") moveLayer(o.id, 1);
    if (action === "back") moveLayer(o.id, -1);
    if (action === "checked") {
      state.items[o.id].art = o.art;
      commit();
    }
  });

  cards[o.id] = card;
  cardsBox.appendChild(card);
}

OBJECTS.forEach(function (o) {
  buildCard(o);
  buildItem(o);
});

// ---- Drawing the current state ---------------------------------------------------

function apply() {
  OBJECTS.forEach(function (o) {
    const id = o.id;
    const it = state.items[id];
    const el = items[id];
    el.style.left = it.left + "%";
    el.style.top = it.top + "%";
    el.style.width = it.width + "%";
    el.style.zIndex = state.order.indexOf(id) + 1;
    el.classList.toggle("selected", id === state.selected);

    const card = cards[id];
    card.classList.toggle("active", id === state.selected);
    card.querySelector('input[type="radio"]').checked = id === state.selected;
    card.querySelectorAll("[data-field]").forEach(function (input) {
      // Don't overwrite the box the person is typing in.
      if (document.activeElement !== input) input.value = it[input.dataset.field];
    });
    const layer = state.order.indexOf(id) + 1;
    card.querySelector(".layer-label").textContent = "Layer " + layer + " of " + IDS.length + " (1 = back)";
    card.querySelector('[data-action="back"]').disabled = layer === 1;
    card.querySelector('[data-action="forward"]').disabled = layer === IDS.length;
    card.querySelector(".check-note").hidden = !needsCheck(id);
  });

  // The two chaise previews. The flip is on the picture; the shift is on the box.
  const chaise = items.chaise;
  chaise.classList.toggle("flipped", state.flipChaise);
  chaise.classList.toggle("shifted", state.shiftPreview);
  chaise.style.setProperty("--shift-rot", state.shiftRot + "deg");
  chaise.style.setProperty("--shift-x", state.shiftX + "%");
  flipBox.checked = state.flipChaise;
  shiftBox.checked = state.shiftPreview;
  if (document.activeElement !== shiftRotInput) shiftRotInput.value = state.shiftRot;
  if (document.activeElement !== shiftXInput) shiftXInput.value = state.shiftX;

  showLayerWarning();
  readout.value = makeCss();
}

// The real game keeps #left-side above #right-side. Warn if this order can't be copied there.
function showLayerWarning() {
  const clashes = [];
  OBJECTS.forEach(function (right) {
    if (right.group !== "right-side") return;
    OBJECTS.forEach(function (left) {
      if (left.group !== "left-side") return;
      if (state.order.indexOf(right.id) > state.order.indexOf(left.id)) {
        clashes.push(right.label + " is in front of the " + left.label.toLowerCase());
      }
    });
  });
  if (clashes.length === 0) {
    layerWarning.hidden = true;
    layerWarning.textContent = "";
    return;
  }
  layerWarning.hidden = false;
  layerWarning.textContent =
    "Heads up: " + clashes.join("; ") + ". That is fine for experimenting, but the real game " +
    "can't do it as built, because everything in #left-side always sits in front of everything in " +
    "#right-side. Copying this order would need a layout change in the real game first.";
}

function commit() {
  apply();
  save();
}

function select(id) {
  state.selected = id;
  commit();
}

function moveLayer(id, step) {
  const i = state.order.indexOf(id);
  const j = i + step;
  if (j < 0 || j >= state.order.length) return;
  const swap = state.order[j];
  state.order[j] = id;
  state.order[i] = swap;
  commit();
}

function makeCss() {
  const lines = ["/* Layout sandbox values: percent of the stage. z-index: higher = in front. */"];
  OBJECTS.forEach(function (o) {
    const it = state.items[o.id];
    let line =
      "#" + o.id + " { left: " + it.left + "%; top: " + it.top + "%; width: " + it.width +
      "%; z-index: " + (state.order.indexOf(o.id) + 1) + "; }  /* art: " + o.art;
    if (needsCheck(o.id)) line += " - NEEDS ALIGNMENT CHECK: numbers came from older artwork";
    lines.push(line + " */");
  });
  lines.push("");
  lines.push("/* Chaise flip: " + (state.flipChaise ? "ON" : "off") + " */");
  if (state.flipChaise) {
    lines.push("#chaise img { transform: scaleX(-1); }");
  }
  lines.push("/* Clue shift (preview " + (state.shiftPreview ? "ON" : "off") + "). It moves the chaise box, the flip only mirrors the picture, so they don't clash. */");
  lines.push("#chaise.chaise-shifted { transform: rotate(" + state.shiftRot + "deg) translateX(" + state.shiftX + "%); transition: transform 0.5s ease; }");
  lines.push("");
  lines.push("/* Real game groups: bookcase + chaise are in #left-side (always in front); desk + chair are in #right-side. */");
  lines.push("/* The real #desk is HTML with min-height and buttons inside; these values only place artwork in the sandbox. */");
  return lines.join("\n");
}

// ---- Dragging with the mouse -----------------------------------------------------

stage.addEventListener("pointerdown", function (e) {
  const el = e.target.closest(".item");
  if (!el) return;
  const id = el.dataset.id;
  const box = stage.getBoundingClientRect();
  drag = {
    id: id,
    startX: e.clientX,
    startY: e.clientY,
    left: state.items[id].left,
    top: state.items[id].top,
    width: box.width,
    height: box.height,
  };
  try {
    stage.setPointerCapture(e.pointerId);
  } catch (err) {
    // Capture only keeps the drag going outside the stage.
  }
  stage.classList.add("dragging");
  stage.focus({ preventScroll: true });
  e.preventDefault();
  select(id);
});

stage.addEventListener("pointermove", function (e) {
  if (!drag) return;
  const dx = ((e.clientX - drag.startX) / drag.width) * 100;
  const dy = ((e.clientY - drag.startY) / drag.height) * 100;
  setField(drag.id, "left", drag.left + dx);
  setField(drag.id, "top", drag.top + dy);
  apply();
});

function endDrag() {
  if (!drag) return;
  drag = null;
  stage.classList.remove("dragging");
  save();
}

stage.addEventListener("pointerup", endDrag);
stage.addEventListener("pointercancel", endDrag);

// ---- Arrow keys nudge the selected object ----------------------------------------

stage.addEventListener("keydown", function (e) {
  const step = e.shiftKey ? 1 : 0.1;
  const moves = {
    ArrowLeft: ["left", -step],
    ArrowRight: ["left", step],
    ArrowUp: ["top", -step],
    ArrowDown: ["top", step],
  };
  const move = moves[e.key];
  if (!move) return;
  e.preventDefault();
  const it = state.items[state.selected];
  setField(state.selected, move[0], it[move[0]] + move[1]);
  commit();
});

// ---- Chaise previews, options, copy and reset -------------------------------------

flipBox.addEventListener("change", function () {
  state.flipChaise = flipBox.checked;
  commit();
});

shiftBox.addEventListener("change", function () {
  state.shiftPreview = shiftBox.checked;
  commit();
});

shiftRotInput.addEventListener("input", function () {
  const v = parseFloat(shiftRotInput.value);
  if (!Number.isFinite(v)) return;
  state.shiftRot = round1(clamp(v, -45, 45));
  commit();
});

shiftXInput.addEventListener("input", function () {
  const v = parseFloat(shiftXInput.value);
  if (!Number.isFinite(v)) return;
  state.shiftX = round1(clamp(v, -50, 50));
  commit();
});

document.getElementById("show-boxes").addEventListener("change", function (e) {
  stage.classList.toggle("show-boxes", e.target.checked);
});

function say(message) {
  statusText.textContent = message;
  setTimeout(function () {
    if (statusText.textContent === message) statusText.textContent = "";
  }, 2500);
}

document.getElementById("copy").addEventListener("click", function () {
  readout.select();
  let done = false;
  try {
    done = document.execCommand("copy");
  } catch (err) {
    done = false;
  }
  say(done ? "Copied!" : "Press Ctrl+C to copy the selected text.");
});

document.getElementById("reset").addEventListener("click", function () {
  const ok = window.confirm(
    "Replace your arrangement with the starting suggestions for the new artwork?\n\n" +
    "Tip: press Cancel and use Copy CSS first if you want to keep your current values."
  );
  if (!ok) return;
  state = freshState();
  commit();
  say("Reset to starting suggestions.");
});

const firstRunOfV2 = readJson(STORAGE_KEY) === null;
commit();
if (state.migrated && firstRunOfV2) {
  say("Your earlier arrangement was carried over. Check the new artwork's alignment.");
}
