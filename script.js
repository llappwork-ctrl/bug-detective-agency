// Find the two things we need on the page, using their id names from index.html.
const caseButton = document.getElementById("case-file-button");
const casePanel = document.getElementById("case-panel");

// Only runs if both were found, so a typo in an id can't break the page.
if (caseButton && casePanel) {
  // JavaScript is running, so it is safe to hide the panel at the start.
  casePanel.hidden = true;
  caseButton.setAttribute("aria-controls", "case-panel");
  caseButton.setAttribute("aria-expanded", "false");
  caseButton.textContent = "Look at the Case File";

  // Each click flips the panel between hidden and shown.
  caseButton.addEventListener("click", function () {
    casePanel.hidden = !casePanel.hidden;

    const isOpen = !casePanel.hidden;
    caseButton.setAttribute("aria-expanded", String(isOpen));
    caseButton.textContent = isOpen ? "Close Case File" : "Look at the Case File";
  });
}
const begoniaBook = document.getElementById("begonia-book");
const mabelDialogue = document.getElementById("mabel-dialogue");

if (begoniaBook && mabelDialogue) {
    begoniaBook.setAttribute("aria-controls", "mabel-dialogue");
    begoniaBook.setAttribute("aria-expanded", "false");

    begoniaBook.addEventListener("click", function () {
        mabelDialogue.hidden = !mabelDialogue.hidden;

        const isOpen = !mabelDialogue.hidden;

        begoniaBook.setAttribute("aria-expanded", String(isOpen));

        if (isOpen) {
            mabelDialogue.textContent =
                "The flowers are innocent, Detective. It's what's hiding inside them that confounds me.";
        }
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