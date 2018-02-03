const blockedPatternsTextArea = document.querySelector("#blocked-patterns");
const blockedPatternsForm = document.querySelector("form");
const notices = document.querySelector("#notices");

let noticeTimeout;
function notify(notice) {
  if (noticeTimeout) {
    clearTimeout(noticeTimeout);
    notices.style.display = "none";
    notices.style.opacity = "0.0";
  }

  notices.innerText = notice;
  notices.style.display = "inline-block";
  noticeTimeout = setTimeout(() => {
    notices.style.opacity = "1.0";
    noticeTimeout = setTimeout(() => {
      notices.style.opacity = "0.0";
      noticeTimeout = setTimeout(() => {
        notices.innerText = "";
        notices.style.display = "none";
      }, 600);
    }, 2000);
  }, 10);
}

// Store the currently selected settings using browser.storage.local.
function storeSettings(form) {
  let blockedPatterns = form.elements.blockedPatterns.value.split("\n");
  blockedPatterns = blockedPatterns
    .filter((pattern) => pattern)
    .map((pattern) => pattern.trim())
    .filter((pattern) => pattern.length > 0);

  notify("Patterns updated.");

  browser.storage.local.set({
    blockedPatterns
  });
}

// Update the options UI with the settings values retrieved from storage,
// or the default settings if the stored settings are empty.
function updateUI(restoredSettings) {
  if (restoredSettings.blockedPatterns) {
    blockedPatternsTextArea.value = restoredSettings.blockedPatterns.join("\n");
  }
}

function onError(e) {
  console.error(e);
}

function onSubmit(e) {
  e.preventDefault();
  storeSettings(e.target);
}

// On opening the options page, fetch stored settings and update the UI with them.
browser.storage.local.get().then(updateUI, onError);

blockedPatternsForm.addEventListener("submit", onSubmit);