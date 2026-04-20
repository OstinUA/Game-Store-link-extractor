export async function getActiveTab() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  return tabs[0] ?? null;
}

export async function executeInTab(tabId, injectedFunction) {
  const results = await chrome.scripting.executeScript({
    target: { tabId },
    func: injectedFunction,
  });

  if (!Array.isArray(results) || results.length === 0) {
    return [];
  }

  return Array.isArray(results[0].result) ? results[0].result : [];
}
