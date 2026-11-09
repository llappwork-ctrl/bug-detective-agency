// Find the two things we need on the page, using their id names from index.html.

const caseButton = document.getElementById("case-file-button");
const casePanel = document.getElementById("case-panel");
const closeCaseButton = document.getElementById("close-case-file");

if (caseButton && casePanel && closeCaseButton) {

    caseButton.setAttribute("aria-controls", "case-panel");
    caseButton.setAttribute("aria-expanded", "false");

    // Open the notebook.
    caseButton.addEventListener("click", function () {
        casePanel.showModal();
        caseButton.setAttribute("aria-expanded", "true");
    });

    // Close the notebook using its button.
    closeCaseButton.addEventListener("click", function () {
        casePanel.close();
    });

    // Keep the button's state correct when the notebook closes.
    casePanel.addEventListener("close", function () {
        caseButton.setAttribute("aria-expanded", "false");
    });
}

const begoniaBook = document.getElementById("begonia-book");
const caseArchive = document.getElementById("case-archive");

if (begoniaBook && caseArchive) {
    begoniaBook.setAttribute("aria-controls", "case-archive");
    begoniaBook.setAttribute("aria-haspopup", "dialog");
    const chaise = document.getElementById("chaise");
    let begoniaClueFound = localStorage.getItem("begoniaClueFound") === "true";

    if (begoniaClueFound && chaise) {
        chaise.classList.add("chaise-shifted");
    }

    begoniaBook.addEventListener("click", function () {
        if (!begoniaClueFound) {
            begoniaClueFound = true;
            localStorage.setItem("begoniaClueFound", "true");
            if (chaise) chaise.classList.add("chaise-shifted");
            updateR02OfficeRewards();
            console.log("Clue discovered: Suspicious Begonia");
        }
        caseArchive.showModal();
    });
}
// Mario's Lamp — click to turn on or off
const marioLamp = document.getElementById("mario-lamp");

if (marioLamp) {
    marioLamp.addEventListener("click", function () {
        marioLamp.classList.toggle("lamp-on");

        const isOn = marioLamp.classList.contains("lamp-on");

        marioLamp.setAttribute("aria-pressed", String(isOn));
    });
}
// Reset the investigation for testing
const resetButton = document.getElementById("reset-investigation");

if (resetButton) {
    resetButton.addEventListener("click", function () {

        // Forget saved investigation progress.
        localStorage.removeItem("begoniaClueFound");
        localStorage.removeItem("detectiveNotebookNotes");
        localStorage.removeItem("evidenceBoardLayout");
        localStorage.removeItem("flowerLampAccepted");
        evidenceEntries.forEach(function (entry) {
            localStorage.removeItem(entry.dataset.foundKey);
        });

        // Reload the office in its starting state.
        window.location.reload();

    });
}
// Detective Notebook
const notebookButton = document.getElementById("notebook-button");
const notebookPanel = document.getElementById("notebook-panel");
const closeNotebookButton = document.getElementById("close-notebook");
const detectiveNotes = document.getElementById("detective-notes");
const notesStatus = document.getElementById("notes-status");


if (
    notebookButton &&
    notebookPanel &&
    closeNotebookButton &&
    detectiveNotes &&
    notesStatus
) {
    notebookButton.setAttribute("aria-controls", "notebook-panel");
    notebookButton.setAttribute("aria-expanded", "false");

    // Load saved notes if they exist
    const savedNotes = localStorage.getItem("detectiveNotebookNotes");
    if (savedNotes) {
        detectiveNotes.value = savedNotes;
        notesStatus.textContent = "Saved notes loaded.";
    }

    // Open notebook
    notebookButton.addEventListener("click", function () {
        notebookPanel.showModal();
        notebookButton.setAttribute("aria-expanded", "true");
    });

    // Close notebook with button
    closeNotebookButton.addEventListener("click", function () {
    localStorage.setItem("detectiveNotebookNotes", detectiveNotes.value);
    notebookPanel.close();
});

    // Keep button state accurate when notebook closes
    notebookPanel.addEventListener("close", function () {
        notebookButton.setAttribute("aria-expanded", "false");
    });

    // Save notes whenever the detective types
    detectiveNotes.addEventListener("input", function () {
        localStorage.setItem("detectiveNotebookNotes", detectiveNotes.value);
        notesStatus.textContent = "Your notes are saved automatically.";
    });

}
const filingCabinetButton =
    document.getElementById("filing-cabinet-button");

const r02Dialog =
    document.getElementById("record-r02-dialog");

const closeR02Button =
    document.getElementById("close-r02");

const r02Message =
    document.getElementById("r02-discovery-message");

if (filingCabinetButton && r02Dialog && closeR02Button && r02Message) {

    filingCabinetButton.addEventListener("click", function () {

        const alreadyFound =
            localStorage.getItem("recordR02Found") === "true";

        if (alreadyFound) {
            r02Message.textContent =
                "Previously discovered. You can examine this record again.";
        } else {
            localStorage.setItem("recordR02Found", "true");

            r02Message.textContent =
                "New evidence discovered! R02 has been recorded.";
        }
        updateR02OfficeRewards();
        updateFlowerLamp();
        r02Dialog.showModal();
    });

    closeR02Button.addEventListener("click", function () {
        r02Dialog.close();
    });
}

// The cabinet and notebook open the same draft document.
const cabinetPreview = document.getElementById("cabinet-preview");
const cabinetPreviewTitle = document.getElementById("cabinet-preview-title");
const cabinetRecords = {
    "filing-cabinet-r03": { title: "R03 — Garden Maintenance Log", key: "recordR03Found" },
    "filing-cabinet-r05": { title: "R05 — Original Delivery Slip", key: "recordR05Found" }
};

function openCabinetRecord(id) {
    cabinetPreviewTitle.textContent = cabinetRecords[id].title;
    cabinetPreview.querySelectorAll(".cabinet-draft").forEach(function (draft) {
        draft.hidden = draft.id !== id + "-draft";
    });
    cabinetPreview.showModal();
}

if (cabinetPreview && cabinetPreviewTitle) {
    for (const [id, record] of Object.entries(cabinetRecords)) {
        const drawer = document.getElementById(id);
        if (drawer) {
            drawer.addEventListener("click", function () {
                openCabinetRecord(id);
                if (localStorage.getItem(record.key) !== "true") {
                    localStorage.setItem(record.key, "true");
                    updateNotebookEvidence();
                    updateOfficeDecorations();
                    updateGardenAccess();
                }
            });
        }
    }

    notebookPanel?.querySelectorAll("[data-cabinet-record]").forEach(function (button) {
        button.addEventListener("click", function () {
            const id = button.dataset.cabinetRecord;
            const record = cabinetRecords[id];
            if (!record || localStorage.getItem(record.key) !== "true") return;
            notebookPanel.close();
            openCabinetRecord(id);
        });
    });
}

// Show collected evidence in the notebook.

const recordR01 = document.getElementById("record-r01");
const notebookOpenR01 = document.getElementById("notebook-open-r01");
const notebookNoEvidence = document.getElementById("notebook-no-evidence");
const notebookOpenR02 = document.getElementById("notebook-open-r02");


const evidenceEntries = document.querySelectorAll("#notebook-evidence [data-found-key]");

function updateNotebookEvidence() {
    let anyFound = false;
    evidenceEntries.forEach(function (entry) {
        const found = localStorage.getItem(entry.dataset.foundKey) === "true";
        entry.hidden = !found;
        if (found) anyFound = true;
    });
    if (notebookNoEvidence) notebookNoEvidence.hidden = anyFound;
}

// Check saved discoveries whenever the notebook opens.
if (notebookButton) {
    notebookButton.addEventListener("click", updateNotebookEvidence);
}

// Allow the detective to reopen an already found document.
if (notebookOpenR02 && notebookPanel && r02Dialog && r02Message) {
    notebookOpenR02.addEventListener("click", function () {

        if (localStorage.getItem("recordR02Found") !== "true") {
            return;
        }

        notebookPanel.close();

        r02Message.textContent =
            "Previously discovered. You can examine this record again.";

            updateR02OfficeRewards();
            r02Dialog.showModal();
    });
}
if (recordR01) {
    recordR01.addEventListener("toggle", function () {
        if (recordR01.open) {
            localStorage.setItem("recordR01Found", "true");
            updateNotebookEvidence();
            updateFlowerLamp()
        }
    });
}

if (notebookOpenR01 && notebookPanel && casePanel && caseButton && recordR01) {
    notebookOpenR01.addEventListener("click", function () {
        notebookPanel.close();
        recordR01.open = true;
        casePanel.showModal();
        caseButton.setAttribute("aria-expanded", "true");
    });
}

const mysteriesBook = document.getElementById("mysteries-book");
const r04Dialog = document.getElementById("record-r04-dialog");
const notebookOpenR04 = document.getElementById("notebook-open-r04");

if (mysteriesBook && r04Dialog) {
    mysteriesBook.addEventListener("click", function () {
        if (localStorage.getItem("recordR04Found") !== "true") {
            localStorage.setItem("recordR04Found", "true");
            updateNotebookEvidence();
            updateGardenAccess();
        }
        r04Dialog.showModal();
    });
}

if (notebookOpenR04 && notebookPanel && r04Dialog) {
    notebookOpenR04.addEventListener("click", function () {
        if (localStorage.getItem("recordR04Found") !== "true") return;
        notebookPanel.close();
        r04Dialog.showModal();
    });
}

// Display the correct state when the page first loads.
updateNotebookEvidence();

// R02 office rewards

const teaSteam = document.getElementById("tea-steam");
const rewardPlant = document.getElementById("reward-plant");
const rewardTable = document.getElementById("reward-table");

function updateR02OfficeRewards() {
    const r02Found =
        localStorage.getItem("recordR02Found") === "true";

    if (teaSteam) {
        teaSteam.hidden = !r02Found;
    }

    if (rewardPlant) {
        rewardPlant.hidden = !r02Found;
    }
    if (rewardTable) {
        const chaiseMoved = localStorage.getItem("begoniaClueFound") === "true";
        rewardTable.hidden = !(r02Found && chaiseMoved);
    }
     
} updateR02OfficeRewards();
function updateOfficeDecorations() {
    const r03Found = localStorage.getItem("recordR03Found") === "true";
    const r05Found = localStorage.getItem("recordR05Found") === "true";

    document.getElementById("flower-pot-3").hidden = !r03Found;
    document.getElementById("sleeping-kitty").hidden = !r03Found;
    document.getElementById("flower-pot-2").hidden = !r05Found;
}

updateOfficeDecorations();
const flowerLamp = document.getElementById("flower-lamp");
const flowerLampOffer = document.getElementById("flower-lamp-offer");
const acceptFlowerLamp = document.getElementById("accept-flower-lamp");

function updateFlowerLamp() {
    const r01Found = localStorage.getItem("recordR01Found") === "true";
    const r02Found = localStorage.getItem("recordR02Found") === "true";
    const lampAccepted = localStorage.getItem("flowerLampAccepted") === "true";

    flowerLamp.hidden = !lampAccepted;
    flowerLampOffer.hidden = !(r01Found && r02Found && !lampAccepted);
}

acceptFlowerLamp.addEventListener("click", function () {
    localStorage.setItem("flowerLampAccepted", "true");
    updateFlowerLamp();
    notebookButton.focus();
});

updateFlowerLamp();
const visitGardenButton = document.getElementById("visit-garden");
const returnToOfficeButton = document.getElementById("return-to-office");
const officeScene = document.getElementById("office");
const gardenScene = document.getElementById("garden-scene");

function updateGardenAccess() {
    const r03Found = localStorage.getItem("recordR03Found") === "true";
    const r04Found = localStorage.getItem("recordR04Found") === "true";

    visitGardenButton.hidden = gardenScene.hidden === false || !document.getElementById("evidence-room").hidden || !(r03Found && r04Found);
}

visitGardenButton.addEventListener("click", function () {
    officeScene.hidden = true;
    gardenScene.hidden = false;
    document.getElementById("open-evidence-room").hidden = true;
    updateGardenAccess();
    returnToOfficeButton.focus();
});

returnToOfficeButton.addEventListener("click", function () {
    gardenScene.hidden = true;
    document.getElementById("open-evidence-room").hidden = false;
    officeScene.hidden = false;
    updateGardenAccess();
    visitGardenButton.focus();
});

updateGardenAccess();

const notebookTabs =
    document.querySelectorAll(".notebook-tab");

const notebookPages =
    document.querySelectorAll(".notebook-page");

notebookTabs.forEach(function(tab) {
    tab.addEventListener("click", function() {

        const selectedPage = tab.dataset.page;

        notebookPages.forEach(function(page) {
            page.hidden = page.id !== selectedPage;
        });

        notebookTabs.forEach(function(button) {
            button.classList.toggle(
                "active",
                button === tab
            );
        });
    });
});
