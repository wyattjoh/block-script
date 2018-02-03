// *://c.go-mpulse.net/boomerang/*

const blockRequests = (requestDetails) => {
  console.log(`Blocking: ${requestDetails.url}`);
  return {
    cancel: true
  };
}

// update the proxy whenever stored settings change
browser.storage.onChanged.addListener((newSettings) => {
  if (newSettings.blockedPatterns) {
    const patterns = newSettings.blockedPatterns.newValue;
    console.log("patterns updated", patterns);

    updateBlockedPatterns(patterns);
  }
});

function updateBlockedPatterns(patterns) {
  // Filter out disabled rules.
  patterns = patterns.filter((pattern) => pattern[0] !== '#');

  // Remove old listener.
  if (browser.webRequest.onBeforeRequest.hasListener(blockRequests)) {
    browser.webRequest.onBeforeRequest.removeListener(blockRequests);
  }

  // Create the new listener.
  browser.webRequest.onBeforeRequest.addListener(
    blockRequests,
    {urls: patterns},
    ["blocking"]
  );
}

// get the current settings, then...
browser.storage.local.get()
  .then((storedSettings) => {
    if (storedSettings.blockedPatterns) {
      const patterns = storedSettings.blockedPatterns;
      console.log("patterns loaded", patterns);
      updateBlockedPatterns(patterns);
    }
  })
  .catch((err) => {
    console.error(err);
  });

function openOptionsPage() {
  browser.tabs.create({
    "url": "/options/options.html"
  });
}

browser.browserAction.onClicked.addListener(openOptionsPage);