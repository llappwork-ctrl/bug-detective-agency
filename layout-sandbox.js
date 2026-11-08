// Layout sandbox: drag and resize the office furniture, then copy the CSS values.
// This file only controls layout-sandbox.html. It never touches the real game
// (index.html, style.css, script.js) or the real game's saved progress.

// ---- Two scenes, two saved arrangements --------------------------------------------
// A "scene" = a furniture list + its own saved arrangement (its own storage key).
//   whimsical : the new Whimsical Detective Study office (saved as layoutSandbox.whimsical.v1)
//   sunlit    : your earlier arrangement with the old furniture (saved as layoutSandbox.v2).
//               That key is exactly the one the previous sandbox used. It is only changed
//               when YOU move something while the Sunlit scene is showing.
// Switching scenes never copies, merges or deletes anything.
//
// Furniture fields:
//   group     : which parent the piece lives in in the REAL game (for the layer warning)
//   existing  : true if the real game already has this piece (false = proposed, not built yet)
//   hit       : top right bottom left of the visible part, as % of the picture. Only that part
//               catches the mouse, so transparent edges don't grab clicks.
//               (Measured from each PNG's transparency, 6 Nov 2026 for the Whimsical pieces.)
//   toggle    : true = this piece can be shown or hidden to preview different scene states
//   start     : starting suggestion (left, top, width as % of the stage)
const FOLDER = "images/objects/";

const BACKGROUNDS = {
  cozy: {
    label: "Whimsical office (Cozy Bug Detective Agency Office)",
    file: "images/backgrounds/Cozy Bug Detective Agency Office.png",
  },
  sunlit: {
    label: "Sunlit window (the original, for comparison)",
    file: "images/backgrounds/Sunlit Warm Wooden Study with Centered Window.png",
  },
};

const SCENES = {
  whimsical: {
    label: "Whimsical office (new furniture)",
    storageKey: "layoutSandbox.whimsical.v1",
    legacyKey: null,
    defaultBackground: "cozy",
    objects: [
      {
        id: "desk", label: "Desk", group: "right-side", existing: true,
        art: "Mabel Quibble’s Enchanted Detective Desk.png",
        hit: "2.4% 0.3% 0.1% 0.9%",
        start: { left: 12, top: 45, width: 40 },
      },
      {
        id: "chair", label: "Chair", group: "right-side", existing: true,
        art: "Whimsical_chair.png",
        hit: "1.2% 6% 2.5% 6%",
        start: { left: 21, top: 27, width: 17 },
      },
      {
        id: "chaise", label: "Chaise", group: "left-side", existing: true,
        art: "03_purple_chaise.png",
        hit: "0.3% 0.2% 0.3% 0.2%",
        start: { left: 56, top: 56, width: 30 },
      },
      {
        id: "flower-lamp", label: "Flower floor lamp", group: "right-side", existing: false, toggle: true,
        art: "04_orange_flower_floor_lamp (2).png",
        hit: "0.2% 0.3% 0.2% 0.3%",
        start: { left: 59, top: 17, width: 17 },
      },
      {
        id: "mushroom-lamp", label: "Mushroom desk lamp", group: "right-side", existing: false, toggle: true,
        art: "06_mario_green_mushroom_lamp.png",
        hit: "0.3% 0.4% 0.6% 0.8%",
        start: { left: 37.5, top: 45, width: 7.5 },
      },
      {
        id: "reward-plant", label: "Flower Pot 1", group: "right-side", existing: false, toggle: true,
        art: "Flower Pot 1.png",
        hit: "13.8% 12.9% 17.1% 12.7%",
        start: { left: 9, top: 28, width: 7 },
      },
      {
        id: "reward-table", label: "Ornate flower table", group: "right-side", existing: false, toggle: true,
        art: "Ornate Table with Butterfly Flower Pot.png",
        hit: "5.6% 24.2% 10.3% 23.4%",
        start: { left: 53.4, top: 56, width: 11 },
      },
      {
        id: "flower-pot-2", label: "Flower Pot 2", group: "right-side", existing: false, toggle: true,
        art: "Flower Pot 2.png",
        hit: "1.5% 0.8% 1.6% 1%",
        start: { left: 3, top: 66, width: 6 },
      },
      {
        id: "flower-pot-3", label: "Flower Pot 3", group: "right-side", existing: false, toggle: true,
        art: "Flower Pot 3.png",
        hit: "10.8% 10.9% 14.5% 10.5%",
        start: { left: 47, top: 52, width: 7 },
      },
      {
        id: "sleeping-kitty", label: "Sleeping kitty in a basket", group: "right-side", existing: false, toggle: true,
        art: "Kitty in a Basket.png",
        hit: "19.8% 6% 18.1% 5.6%",
        start: { left: 80, top: 72, width: 15 },
      },
    ],
    // Back to front: the chaise is in front of the table and other decorations.
    startOrder: ["chair", "flower-lamp", "desk", "mushroom-lamp", "reward-plant", "reward-table", "flower-pot-2", "flower-pot-3", "sleeping-kitty", "chaise"],
    selected: "chaise",
    // Starting point = the real game's current clue movement (style.css: #chaise.chaise-shifted).
    shiftStart: { rot: -3, x: 15 },
  },

  sunlit: {
    label: "Earlier Sunlit office (your saved v2 arrangement)",
    storageKey: "layoutSandbox.v2",
    legacyKey: "layoutSandbox.v1", // read for migration, NEVER changed or deleted
    defaultBackground: "sunlit",
    objects: [
      {
        id: "bookcase", label: "Bookcase", group: "left-side", existing: true,
        art: "Detective Bookcase of Mysteries.png",
        oldArt: "Golden Detective Bookcase of Mysteries.png", // what v1 layouts were made with
        hit: "16.3% 3.4% 12.8% 3.5%",
        start: { left: 20, top: 25, width: 30 },
      },
      {
        id: "chaise", label: "Chaise", group: "left-side", existing: true,
        art: "purple-chaise-transparent.png",
        oldArt: "purple-chaise-transparent.png", // unchanged, so old values still fit
        hit: "4.8% 1.5% 4.4% 1.5%",
        start: { left: 3, top: 52, width: 36 },
      },
      {
        id: "desk", label: "Desk", group: "right-side", existing: true,
        art: "Luxurious Mahogany Mushroom Emblem Desk.png",
        oldArt: "(old brown placeholder box)",
        hit: "11.1% 6.2% 13.7% 7.4%",
        start: { left: 58, top: 48, width: 36 },
      },
      {
        id: "chair", label: "Chair", group: "right-side", existing: true,
        art: "Ornate Mushroom Emblem Leather Chair - transparent.png",
        oldArt: null, // new in v2: there is no v1 layout for it
        hit: "5.4% 12.1% 5.5% 8.3%",
        start: { left: 68, top: 30, width: 15 },
      },
    ],
    startOrder: ["chair", "desk", "bookcase", "chaise"],
    selected: "chaise",
    shiftStart: { rot: -4, x: 2 },
  },
};

const SCENE_ORDER = ["whimsical", "sunlit"];

// Which scene and background were showing last (separate key; never touches an arrangement).
const UI_KEY = "layoutSandbox.ui.v1";

const stage = document.getElementById("stage");
const readout = document.getElementById("readout");
const statusText = document.getElementById("status");
const cardsBox = document.getElementById("cards");
const flipBox = document.getElementById("flip-chaise");
const shiftBox = document.getElementById("shift-preview");
const shiftRotInput = document.getElementById("shift-rot");
const shiftXInput = document.getElementById("shift-x");
const shiftNote = document.getElementById("shift-note");
const layerWarning = document.getElementById("layer-warning");
const sceneSelect = document.getElementById("scene-select");
const backgroundSelect = document.getElementById("background-select");
const statesBox = document.getElementById("scene-states");
const statesList = document.getElementById("scene-states-list");

// ---- Small helpers --------------------------------------------------------------------

function readJson(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch (err) {
    return null; // nothing saved, or storage is blocked
  }
}

function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
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

function numbersOk(it) {
  return !!it && ["left", "top", "width"].every(function (k) { return Number.isFinite(it[k]); });
}

// ---- Which scene is showing ---------------------------------------------------------------

let ui = readJson(UI_KEY) || {};
if (!SCENES[ui.scene]) ui.scene = "whimsical";
if (!ui.backgrounds || typeof ui.backgrounds !== "object") ui.backgrounds = {};

let sceneId = ui.scene;
let scene = SCENES[sceneId];
let OBJECTS = [];
let IDS = [];
let BY_ID = {};
let state = null;
let items = {};
let cards = {};
let drag = null;

function saveUi() {
  writeJson(UI_KEY, ui);
}

function backgroundKey() {
  const chosen = ui.backgrounds[sceneId];
  return BACKGROUNDS[chosen] ? chosen : scene.defaultBackground;
}

// ---- Saved layout ----------------------------------------------------------------------------
// Saved shape:
//   items[id] = { left, top, width, art }   art = the picture these numbers were made with
//   order     = ids back to front
//   flipChaise, shiftPreview, shiftRot, shiftX, selected, migrated
//   visible   = { id: true/false } (only scenes that have show/hide pieces)
// If `art` differs from the picture now in use, the card says "check the alignment"
// instead of quietly treating the old numbers as final.

function freshState() {
  const itemsFresh = {};
  OBJECTS.forEach(function (o) {
    itemsFresh[o.id] = { left: o.start.left, top: o.start.top, width: o.start.width, art: o.art };
  });
  const s = {
    version: sceneId === "sunlit" ? 2 : 1,
    items: itemsFresh,
    order: scene.startOrder.slice(),
    selected: scene.selected,
    flipChaise: false,
    shiftPreview: false,
    shiftRot: scene.shiftStart.rot,
    shiftX: scene.shiftStart.x,
    migrated: false,
  };
  if (OBJECTS.some(function (o) { return o.toggle; })) {
    s.visible = {};
    OBJECTS.forEach(function (o) {
      if (o.toggle) s.visible[o.id] = true;
    });
  }
  return s;
}

function mergeOrder(saved) {
  const known = saved.filter(function (id) { return IDS.includes(id); });
  const missing = IDS.filter(function (id) { return !known.includes(id); });
  return missing.concat(known); // anything new goes to the back
}

function loadState() {
  const s = freshState();

  // 1. This scene's own saved arrangement wins.
  const saved = readJson(scene.storageKey);
  if (saved && saved.items) {
    OBJECTS.forEach(function (o) {
      const it = saved.items[o.id];
      if (numbersOk(it)) {
        s.items[o.id] = { left: it.left, top: it.top, width: it.width, art: typeof it.art === "string" ? it.art : o.oldArt };
      }
    });
    if (Array.isArray(saved.order)) s.order = mergeOrder(saved.order);
    if (IDS.includes(saved.selected)) s.selected = saved.selected;
    s.flipChaise = saved.flipChaise === true;
    s.shiftPreview = saved.shiftPreview === true;
    if (Number.isFinite(saved.shiftRot)) s.shiftRot = saved.shiftRot;
    if (Number.isFinite(saved.shiftX)) s.shiftX = saved.shiftX;
    s.migrated = saved.migrated === true;
    if (s.visible && saved.visible) {
      Object.keys(s.visible).forEach(function (id) {
        if (saved.visible[id] === false) s.visible[id] = false;
      });
    }
    return s;
  }

  // 2. Sunlit scene only: no v2 yet, so carry over the v1 arrangement. v1 is only read, never changed.
  if (scene.legacyKey) {
    const v1 = readJson(scene.legacyKey);
    if (v1 && v1.items) {
      let carried = 0;
      OBJECTS.forEach(function (o) {
        const it = v1.items[o.id];
        if (numbersOk(it)) {
          // Keep her numbers, and remember they were made with the OLD picture.
          s.items[o.id] = { left: it.left, top: it.top, width: it.width, art: o.oldArt };
          carried++;
        }
      });
      if (carried > 0) {
        if (Array.isArray(v1.order)) s.order = mergeOrder(v1.order);
        if (IDS.includes(v1.selected)) s.selected = v1.selected;
        s.migrated = true;
      }
    }
  }

  // 3. Nothing saved: the starting suggestions.
  return s;
}

function save() {
  writeJson(scene.storageKey, state);
}

function setField(id, field, value) {
  const limits = { left: [-50, 100], top: [-50, 100], width: [2, 100] };
  state.items[id][field] = round1(clamp(value, limits[field][0], limits[field][1]));
}

function needsCheck(id) {
  return state.items[id].art !== BY_ID[id].art;
}

function isVisible(id) {
  return !(state.visible && state.visible[id] === false);
}

function tagText(o) {
  return (o.existing ? "real game: " : "proposed for the real game: ") + o.group;
}

// ---- Building the stage and the cards for the current scene ------------------------------------

function buildItem(o) {
  const el = document.createElement("div");
  el.className = "item";
  el.dataset.id = o.id;
  el.style.setProperty("--hit", o.hit);

  const img = document.createElement("img");
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
  img.src = FOLDER + o.art;

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
    ' <span class="tag">' + tagText(o) + "</span></label></h3>" +
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

// The "show / hide" checkboxes for the lamps.
function buildStates() {
  statesList.innerHTML = "";
  const toggles = OBJECTS.filter(function (o) { return o.toggle; });
  statesBox.hidden = toggles.length === 0;
  toggles.forEach(function (o) {
    const label = document.createElement("label");
    label.className = "option";
    const box = document.createElement("input");
    box.type = "checkbox";
    box.dataset.visibleFor = o.id;
    box.addEventListener("change", function () {
      state.visible[o.id] = box.checked;
      commit();
    });
    label.appendChild(box);
    label.appendChild(document.createTextNode(" Show the " + o.label.toLowerCase()));
    statesList.appendChild(label);
  });
}

function loadScene(id) {
  sceneId = id;
  scene = SCENES[id];
  OBJECTS = scene.objects;
  IDS = OBJECTS.map(function (o) { return o.id; });
  BY_ID = {};
  OBJECTS.forEach(function (o) { BY_ID[o.id] = o; });

  // Rebuild the stage and the cards.
  stage.innerHTML = "";
  cardsBox.innerHTML = "";
  items = {};
  cards = {};
  drag = null;
  stage.classList.remove("dragging");
  OBJECTS.forEach(function (o) {
    buildCard(o);
    buildItem(o);
  });
  buildStates();

  state = loadState();

  sceneSelect.value = id;
  backgroundSelect.value = backgroundKey();
  shiftNote.textContent =
    "The shift starts with " + (id === "whimsical" ? "the real game's current numbers" : "the numbers from your earlier sandbox") +
    " (rotate " + scene.shiftStart.rot + " deg, slide " + scene.shiftStart.x + "%). " +
    "Flipping only mirrors the picture inside the box, and the shift moves the box, so the two never cancel each other.";

  applyBackground();
  apply();
}

function applyBackground() {
  stage.style.backgroundImage = 'url("' + BACKGROUNDS[backgroundKey()].file + '")';
}

// ---- Drawing the current state ------------------------------------------------------------------

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
    el.hidden = !isVisible(id);

    const card = cards[id];
    card.classList.toggle("active", id === state.selected);
    card.classList.toggle("is-hidden", !isVisible(id));
    card.querySelector('input[type="radio"]').checked = id === state.selected;
    card.querySelectorAll("[data-field]").forEach(function (input) {
      // Don't overwrite the box the person is typing in.
      if (document.activeElement !== input) input.value = it[input.dataset.field];
    });
    const layer = state.order.indexOf(id) + 1;
    card.querySelector(".layer-label").textContent =
      "Layer " + layer + " of " + IDS.length + " (1 = back)" + (isVisible(id) ? "" : " - hidden in the preview");
    card.querySelector('[data-action="back"]').disabled = layer === 1;
    card.querySelector('[data-action="forward"]').disabled = layer === IDS.length;
    card.querySelector(".check-note").hidden = !needsCheck(id);
  });

  statesList.querySelectorAll("[data-visible-for]").forEach(function (box) {
    box.checked = isVisible(box.dataset.visibleFor);
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
    if (right.group !== "right-side" || !isVisible(right.id)) return;
    OBJECTS.forEach(function (left) {
      if (left.group !== "left-side" || !isVisible(left.id)) return;
      if (state.order.indexOf(right.id) > state.order.indexOf(left.id)) {
        clashes.push("the " + right.label.toLowerCase() + " is in front of the " + left.label.toLowerCase());
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
  const lines = [
    "/* Layout sandbox values: percent of the stage. z-index: higher = in front. */",
    "/* Scene: " + scene.label + ".  Background: " + BACKGROUNDS[backgroundKey()].file + " */",
  ];
  OBJECTS.forEach(function (o) {
    const it = state.items[o.id];
    let line =
      "#" + o.id + " { left: " + it.left + "%; top: " + it.top + "%; width: " + it.width +
      "%; z-index: " + (state.order.indexOf(o.id) + 1) + "; }  /* art: " + o.art;
    if (!isVisible(o.id)) line += " - hidden in the preview right now";
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
  if (sceneId === "whimsical") {
    lines.push("/* Real game groups today: chaise is in #left-side (always in front); desk + chair are in #right-side. */");
    lines.push("/* The flower lamp and mushroom lamp do not exist in the real game yet; #right-side is proposed for both. */");
    lines.push("/* The real #desk is HTML with buttons inside; these values only place artwork in the sandbox. */");
  } else {
    lines.push("/* Real game groups: bookcase + chaise are in #left-side (always in front); desk + chair are in #right-side. */");
    lines.push("/* The real #desk is HTML with min-height and buttons inside; these values only place artwork in the sandbox. */");
  }
  return lines.join("\n");
}

// ---- Dragging with the mouse ---------------------------------------------------------------------

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
    moved: false,
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
  drag.moved = true;
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

// ---- Arrow keys nudge the selected object ---------------------------------------------------------

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

// ---- Scene and background pickers --------------------------------------------------------------------

sceneSelect.addEventListener("change", function () {
  ui.scene = sceneSelect.value;
  saveUi();
  loadScene(ui.scene);
  say("Showing: " + scene.label + ". The other arrangement is untouched.");
});

backgroundSelect.addEventListener("change", function () {
  ui.backgrounds[sceneId] = backgroundSelect.value;
  saveUi();
  applyBackground();
  apply();
});

// ---- Chaise previews, options, copy and reset -----------------------------------------------------------

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
  }, 4000);
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
    "Replace the arrangement for \"" + scene.label + "\" with its starting suggestions?\n\n" +
    "Only this scene is reset. The other scene's saved arrangement is not touched.\n\n" +
    "Tip: press Cancel and use Copy CSS first if you want to keep your current values."
  );
  if (!ok) return;
  state = freshState();
  commit();
  say("Reset to starting suggestions.");
});

// ---- Start -----------------------------------------------------------------------------------------------

// Loading never writes a saved arrangement. Only a change you make does.
const hadSavedSunlit = readJson(SCENES.sunlit.storageKey) !== null;
loadScene(sceneId);
if (sceneId === "sunlit" && state.migrated && !hadSavedSunlit) {
  say("Your earlier arrangement was carried over. Check the artwork's alignment.");
}
