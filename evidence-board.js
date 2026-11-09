// The board reads the same discovery keys as the notebook.
const boardRecords = {
    r01: { key: "recordR01Found", title: "R01 — Plant Delivery Register",
        details: "BG-218 · September 18 · Service entrance", magnets: 1 },
    r02: { key: "recordR02Found", title: "R02 — Revised Plant Delivery Register",
        details: "BG-218 · September 19 · East Begonia Bed", magnets: 2 }
};
const boardMagnetNames = ["butterfly", "mushroom", "beetle"];
const boardSlotCount = 6;
const evidenceRoom = document.getElementById("evidence-room");
const openEvidenceRoom = document.getElementById("open-evidence-room");
const leaveEvidenceRoom = document.getElementById("leave-evidence-room");
const boardSlots = document.getElementById("evidence-board-slots");
const magnetTray = document.getElementById("evidence-magnet-tray");
const boardStatus = document.getElementById("evidence-board-status");
const pinAllRecords = document.getElementById("pin-all-records");
const placeLooseMagnet = document.getElementById("place-loose-magnet");
const pinRecordButtons = document.querySelectorAll("[data-pin-record]");
let selectedMagnet = "butterfly";
let draggedBoardSlot = null;
let boardItems = [];

try {
    const savedItems = JSON.parse(localStorage.getItem("evidenceBoardLayout") || "[]");
    if (Array.isArray(savedItems)) boardItems = savedItems;
} catch {
    // An unreadable layout starts with an empty board.
}

function boardRecordFound(id) {
    return localStorage.getItem(boardRecords[id].key) === "true";
}

function makeBoardMagnet(name) {
    const image = document.createElement("img");
    image.src = "images/objects/evidence-magnets/" + name + "-magnet.png";
    image.alt = "";
    image.draggable = false;
    return image;
}

function updateMagnetSelection() {
    magnetTray.querySelectorAll("button").forEach(function (button) {
        button.setAttribute("aria-pressed", String(button.dataset.magnet === selectedMagnet));
    });
}

for (const name of boardMagnetNames) {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.magnet = name;
    button.setAttribute("aria-label", "Choose " + name + " magnet");
    button.append(makeBoardMagnet(name));
    button.addEventListener("click", function () {
        selectedMagnet = name;
        updateMagnetSelection();
        boardStatus.textContent = "Selected the " + name + " magnet.";
    });
    magnetTray.append(button);
}
updateMagnetSelection();

function saveEvidenceBoard(message) {
    localStorage.setItem("evidenceBoardLayout", JSON.stringify(boardItems));
    renderEvidenceBoard();
    boardStatus.textContent = message;
}

function moveBoardItem(from, to) {
    const item = boardItems.find(entry => entry.slot === from);
    if (!item || from === to) return;
    const other = boardItems.find(entry => entry.slot === to);
    if (other) other.slot = from;
    item.slot = to;
    saveEvidenceBoard("Moved to spot " + (to + 1) + ".");
}

function makeEvidenceCard(item) {
    const record = boardRecords[item.record];
    const title = record ? record.title : item.magnet + " magnet";
    const card = document.createElement("article");
    card.className = record ? "evidence-board-card" : "evidence-board-card evidence-board-loose";
    card.setAttribute("aria-label", title);
    card.draggable = true;
    card.addEventListener("dragstart", function (event) {
        draggedBoardSlot = item.slot;
        event.dataTransfer.setData("text/plain", title);
    });
    card.addEventListener("dragend", function () {
        draggedBoardSlot = null;
    });

    const magnets = document.createElement("div");
    magnets.className = "evidence-board-magnets";
    magnets.append(makeBoardMagnet(item.magnet));
    if (record?.magnets === 2) magnets.append(makeBoardMagnet(item.magnet));
    card.append(magnets);

    if (record) {
        const heading = document.createElement("strong");
        heading.textContent = record.title;
        const details = document.createElement("p");
        details.textContent = record.details;
        card.append(heading, details);
    }

    const move = document.createElement("select");
    move.setAttribute("aria-label", "Move " + title);
    move.add(new Option("Move…", ""));
    for (let slot = 0; slot < boardSlotCount; slot++) {
        if (slot !== item.slot) move.add(new Option("Spot " + (slot + 1), slot));
    }
    move.addEventListener("change", function () {
        if (move.value === "") return;
        const destination = Number(move.value);
        moveBoardItem(item.slot, destination);
        boardSlots.children[destination].querySelector("select").focus();
    });

    const remove = document.createElement("button");
    remove.type = "button";
    remove.textContent = record ? "Unpin" : "Remove";
    remove.setAttribute("aria-label", remove.textContent + " " + title);
    remove.addEventListener("click", function () {
        boardItems = boardItems.filter(entry => entry !== item);
        saveEvidenceBoard("Removed " + title + " from the board.");
        const pinButton = record && document.querySelector('[data-pin-record="' + item.record + '"]');
        (pinButton || placeLooseMagnet).focus();
    });
    card.append(move, remove);
    return card;
}

function renderEvidenceBoard() {
    boardSlots.replaceChildren();
    for (let slot = 0; slot < boardSlotCount; slot++) {
        const cell = document.createElement("div");
        cell.className = "evidence-board-slot";
        cell.setAttribute("role", "group");
        cell.setAttribute("aria-label", "Spot " + (slot + 1));
        const item = boardItems.find(entry => entry.slot === slot);
        if (item) cell.append(makeEvidenceCard(item));
        cell.addEventListener("dragover", function (event) {
            if (draggedBoardSlot !== null) event.preventDefault();
        });
        cell.addEventListener("drop", function (event) {
            if (draggedBoardSlot === null) return;
            event.preventDefault();
            moveBoardItem(draggedBoardSlot, slot);
            draggedBoardSlot = null;
        });
        boardSlots.append(cell);
    }

    for (const button of pinRecordButtons) {
        const id = button.dataset.pinRecord;
        button.hidden = !boardRecordFound(id);
        button.disabled = boardItems.some(item => item.record === id);
    }
    pinAllRecords.disabled = !Array.from(pinRecordButtons).some(button => !button.hidden && !button.disabled);
    placeLooseMagnet.disabled = boardItems.filter(item => !item.record).length >= 3;
}

function placeBoardItem(record) {
    for (let slot = 0; slot < boardSlotCount; slot++) {
        if (boardItems.some(item => item.slot === slot)) continue;
        boardItems.push({ record, slot, magnet: selectedMagnet });
        return slot;
    }
}

for (const button of pinRecordButtons) {
    button.addEventListener("click", function () {
        const id = button.dataset.pinRecord;
        const slot = placeBoardItem(id);
        saveEvidenceBoard("Pinned " + boardRecords[id].title + ".");
        boardSlots.children[slot].querySelector("select").focus();
    });
}

pinAllRecords.addEventListener("click", function () {
    const available = Array.from(pinRecordButtons).filter(button => !button.hidden && !button.disabled);
    const firstSlot = placeBoardItem(available[0].dataset.pinRecord);
    for (const button of available.slice(1)) placeBoardItem(button.dataset.pinRecord);
    saveEvidenceBoard("Pinned the available records.");
    boardSlots.children[firstSlot].querySelector("select").focus();
});

placeLooseMagnet.addEventListener("click", function () {
    const slot = placeBoardItem(null);
    saveEvidenceBoard("Placed a " + selectedMagnet + " magnet.");
    boardSlots.children[slot].querySelector("select").focus();
});

openEvidenceRoom.addEventListener("click", function () {
    officeScene.hidden = true;
    evidenceRoom.hidden = false;
    openEvidenceRoom.hidden = true;
    updateGardenAccess();
    boardItems = boardItems.filter(item => !item.record || boardRecordFound(item.record));
    renderEvidenceBoard();
    boardStatus.textContent = Array.from(pinRecordButtons).every(button => button.hidden)
        ? "Find R01 or R02 in the office to pin a record." : "";
    leaveEvidenceRoom.focus();
});

leaveEvidenceRoom.addEventListener("click", function () {
    evidenceRoom.hidden = true;
    officeScene.hidden = false;
    openEvidenceRoom.hidden = false;
    updateGardenAccess();
    openEvidenceRoom.focus();
});
