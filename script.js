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
const mabelDialogue = document.getElementById("mabel-dialogue");

if (begoniaBook && mabelDialogue) {
    begoniaBook.setAttribute("aria-controls", "mabel-dialogue");
    begoniaBook.setAttribute("aria-expanded", "false");
    
    let begoniaClueFound =
    localStorage.getItem("begoniaClueFound") === "true";

    // Saved progress: put Mabel's chaise back where the clue left it.
    if (begoniaClueFound) {
        const savedChaise = document.getElementById("chaise");

        if (savedChaise) {
            savedChaise.classList.add("chaise-shifted");
        }
    }

    begoniaBook.addEventListener("click", function () {
        
        mabelDialogue.hidden = !mabelDialogue.hidden;

        const isOpen = !mabelDialogue.hidden;

        begoniaBook.setAttribute("aria-expanded", String(isOpen));
    
        if (isOpen) {
            mabelDialogue.textContent =
                "The flowers are innocent, Detective. It's what's hiding inside them that confounds me.";
            
                if(!begoniaClueFound) {
                begoniaClueFound = true;
                localStorage.setItem("begoniaClueFound", "true");
                
                const chaise = document.getElementById("chaise");
            
                if (chaise) {
                    chaise.classList.add("chaise-shifted");
                }
            
                 console.log("Clue discovered: Suspicious Begonia");
        } // Closes the first-discovery condition
    }     // Closes if (isOpen)
    });   // Closes the click listener
}         // Closes if (begoniaBook && mabelDialogue)
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

    // Clear notes on purpose
    clearNotesButton.addEventListener("click", function () {
        detectiveNotes.value = "";
        localStorage.removeItem("detectiveNotebookNotes");
        notesStatus.textContent = "Notes cleared.";
        detectiveNotes.focus();
    });
}