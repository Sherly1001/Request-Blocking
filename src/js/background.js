async function removeRules() {
  const rules = await chrome.declarativeNetRequest.getDynamicRules();
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: rules.map((r) => r.id),
  });
}

async function addRules(urls) {
  if (urls.length) {
    chrome.declarativeNetRequest.updateDynamicRules({
      addRules: urls.map((u, idx) => ({
        id: idx + 1,
        action: { type: "block" },
        condition: {
          urlFilter: u,
          resourceTypes: ["main_frame"],
        },
      })),
    });
  }
}

async function updateRules(urls) {
  await removeRules();
  await addRules(urls);
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get("block-urls", function (o) {
    let urls = Object.keys(o["block-urls"]).filter((u) => o["block-urls"][u]);
    updateRules(urls);
  });
});

chrome.runtime.onMessage.addListener(async function (req, _sender, _sendRes) {
  let urls = Object.keys(req.urls).filter((u) => req.urls[u]);
  updateRules(urls);
});

