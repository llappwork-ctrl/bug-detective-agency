// The board reads the same discovery keys as the notebook.
const boardRecords = {
    r01: { key: "recordR01Found", title: "R01 — Plant Delivery Register",
        details: "BG-218 · September 18 · Service entrance", magnets: 1 },
    r02: { key: "recordR02Found", title: "R02 — Revised Plant Delivery Register",
        details: "BG-218 · September 19 · East Begonia Bed", magnets: 2 },
    r03: { key: "recordR03Found", title: "R03 — Garden Maintenance Log (draft)",
        details: "Freshly disturbed soil near the East Begonia Bed", magnets: 2 },
    r04: { key: "recordR04Found", title: "R04 — Witness Observation (draft)",
        details: "Begonias appeared to move without a noticeable breeze", magnets: 1 },
    r05: { key: "recordR05Found", title: "R05 — Original Delivery Slip (draft)",
        details: "BG-218 · Order for twelve trays of begonias", magnets: 2 }
};
const boardMagnetNames = ["butterfly", "mushroom", "beetle"];
const boardSlotCount = 9;
const evidenceRoom = document.getElementById("evidence-room");
const openEvidenceRoom = document.getElementById("open-evidence-room");
const leaveEvidenceRoom = document.getElementById("leave-evidence-room");
const boardSlots = document.getElementById("evidence-board-slots");
const magnetTray = document.getElementById("evidence-magnet-tray");
const boardStatus = document.getElementById("evidence-board-status");
const pinAllRecords = document.getElementById("pin-all-records");
const pinRecordButtons = document.querySelectorAll("[data-pin-record]");

const returnLooseMagnets = document.getElementById("return-loose-magnets");
let boardItems = [];

try {
    const savedItems = JSON.parse(localStorage.getItem("evidenceBoardLayout") || "[]");
    if (Array.isArray(savedItems)) {
        boardItems = savedItems.map(item => ({
            ...item,
            x: item.x ?? (item.slot % 3) / 2,
            y: item.y ?? Math.floor(item.slot / 3)
        }));
    }
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

const trayOrder = [...boardMagnetNames];

while (trayOrder.length > 0) {
    const name = pickRandom(trayOrder);
    trayOrder.splice(trayOrder.indexOf(name), 1);

    const button = document.createElement("button");
    button.type = "button";
    button.dataset.magnet = name;
    button.setAttribute("aria-label", "Place " + name + " magnet");
    button.append(makeBoardMagnet(name));

    button.addEventListener("click", function () {
        const slot = placeBoardItem(null, name);
        saveEvidenceBoard("Placed a " + name + " magnet.");
        boardSlots.children[slot].querySelector(".evidence-board-magnets").focus();
    });

    magnetTray.append(button);
}

function persistEvidenceBoard() {
    localStorage.setItem("evidenceBoardLayout", JSON.stringify(boardItems));
}

function saveEvidenceBoard(message) {
    persistEvidenceBoard();
    renderEvidenceBoard();
    boardStatus.textContent = message;
}

function positionBoardCard(card, item) {
    card.style.left = (boardSlots.clientWidth - card.offsetWidth) * item.x + "px";
    card.style.top = (boardSlots.clientHeight - card.offsetHeight) * item.y + "px";
}

function addBoardMovement(card, handle, item) {
    function moveTo(left, top) {
        const width = Math.max(1, boardSlots.clientWidth - card.offsetWidth);
        const height = Math.max(1, boardSlots.clientHeight - card.offsetHeight);
        item.x = Math.max(0, Math.min(1, left / width));
        item.y = Math.max(0, Math.min(1, top / height));
        positionBoardCard(card, item);
    }

    let drag;
    handle.addEventListener("pointerdown", function (event) {
        if (!event.isPrimary || event.button !== 0) return;
        drag = { id: event.pointerId, x: event.clientX - card.offsetLeft,
            y: event.clientY - card.offsetTop };
        handle.setPointerCapture(event.pointerId);
    });
    handle.addEventListener("pointermove", function (event) {
        if (drag?.id !== event.pointerId) return;
        moveTo(event.clientX - drag.x, event.clientY - drag.y);
    });
    handle.addEventListener("lostpointercapture", function () {
        drag = undefined;
        persistEvidenceBoard();
    });
    handle.addEventListener("keydown", function (event) {
        const steps = { ArrowLeft: [-12, 0], ArrowRight: [12, 0],
            ArrowUp: [0, -12], ArrowDown: [0, 12] };
        const step = steps[event.key];
        if (!step) return;
        event.preventDefault();
        moveTo(card.offsetLeft + step[0], card.offsetTop + step[1]);
        persistEvidenceBoard();
    });
}

function makeEvidenceCard(item) {
    const record = boardRecords[item.record];
    const title = record ? record.title : item.magnet + " magnet";
    const card = document.createElement("article");
    card.className = record ? "evidence-board-card" : "evidence-board-card evidence-board-loose";
    card.setAttribute("aria-label", title);
    const magnets = document.createElement("button");
    magnets.type = "button";
    magnets.setAttribute("aria-label", "Move " + title + " with arrow keys");
    addBoardMovement(card, magnets, item);
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

    if (record) {
        const unpin = document.createElement("button");
        unpin.type = "button";
        unpin.textContent = "Unpin";
        unpin.setAttribute("aria-label", "Unpin " + title);
        unpin.addEventListener("click", function () {
            boardItems = boardItems.filter(entry => entry !== item);
            saveEvidenceBoard("Unpinned " + title + ".");
            document.querySelector('[data-pin-record="' + item.record + '"]').focus();
        });
        card.append(unpin);
    }
    return card;
}

function renderEvidenceBoard() {
    boardSlots.replaceChildren();
    for (const item of boardItems) {
        const card = makeEvidenceCard(item);
        boardSlots.append(card);
        positionBoardCard(card, item);
    }

    for (const button of pinRecordButtons) {
        const id = button.dataset.pinRecord;
        button.hidden = !boardRecordFound(id);
        button.disabled = boardItems.some(item => item.record === id);
    }
    pinAllRecords.disabled = !Array.from(pinRecordButtons).some(button => !button.hidden && !button.disabled);
    returnLooseMagnets.disabled = !boardItems.some(item => !item.record);
    const looseLimitReached = boardItems.filter(item => !item.record).length >= 3;

magnetTray.querySelectorAll("button").forEach(function (button) {
    button.disabled = looseLimitReached;
});
}
function pickRandom(items) {
    const index = Math.floor(Math.random() * items.length);
    return items[index];
}
function placeBoardItem(record, magnetName) {
    const magnet = magnetName ?? pickRandom(boardMagnetNames);
    for (let slot = 0; slot < boardSlotCount; slot++) {
        const x = (slot % 3) / 2;
        const y = Math.floor(slot / 3) / 2;

        if (boardItems.some(item => item.x === x && item.y === y)) continue;

        boardItems.push({ record, x, y, magnet });
        return boardItems.length - 1;
    }

    boardItems.push({ record, x: 0.1, y: 0.1, magnet });
    return boardItems.length - 1;
}

for (const button of pinRecordButtons) {
    button.addEventListener("click", function () {
        const id = button.dataset.pinRecord;
        const slot = placeBoardItem(id);
        saveEvidenceBoard("Pinned " + boardRecords[id].title + ".");
        boardSlots.children[slot].querySelector(".evidence-board-magnets").focus();
    });
}

pinAllRecords.addEventListener("click", function () {
    const available = Array.from(pinRecordButtons).filter(button => !button.hidden && !button.disabled);
    const firstSlot = placeBoardItem(available[0].dataset.pinRecord);
    for (const button of available.slice(1)) placeBoardItem(button.dataset.pinRecord);
    saveEvidenceBoard("Pinned the available records.");
    boardSlots.children[firstSlot].querySelector(".evidence-board-magnets").focus();
});

returnLooseMagnets.addEventListener("click", function () {
    boardItems = boardItems.filter(item => item.record);
    saveEvidenceBoard("Returned loose magnets to the tray.");
    magnetTray.querySelector("button").focus();
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

new ResizeObserver(function () {
    if (evidenceRoom.hidden) return;
    boardItems.forEach((item, index) => positionBoardCard(boardSlots.children[index], item));
}).observe(boardSlots);