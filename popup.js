/**
 * Initializes the popup UI after the document finishes loading.
 *
 * Detects the active browser tab, determines whether the current page is a
 * supported app store, and wires the extraction button to the matching
 * scraping function. If the active page is unsupported, the button is disabled
 * and an error message is shown.
 *
 * @async
 * @returns {Promise<void>} A promise that resolves after the popup UI has been
 *     configured for the active tab.
 *
 * @example
 * document.addEventListener('DOMContentLoaded', initializePopup);
 */
async function initializePopup() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const btn = document.getElementById('run');
  const status = document.getElementById('status');
  const errorMsg = document.getElementById('error-msg');

  if (tab.url.includes('play.google.com')) {
    status.innerText = 'Google Play Store';
    btn.onclick = () => runScript(tab.id, extractGooglePlayLinks);
  } else if (tab.url.includes('apps.apple.com')) {
    status.innerText = 'Apple App Store';
    btn.onclick = () => runScript(tab.id, extractAppleStoreLinks);
  } else {
    status.innerText = 'Сайт не поддерживается';
    btn.disabled = true;
    errorMsg.classList.remove('hidden');
  }
}

document.addEventListener('DOMContentLoaded', initializePopup);

/**
 * Executes the provided extraction function in the active tab.
 *
 * Injects a store-specific scraper into the target tab, reads the returned
 * link list, and updates the popup output fields with the normalized URLs and
 * their total count.
 *
 * @param {number} tabId The numeric identifier of the active browser tab where
 *     the extraction function should run.
 * @param {function(): string[]} func The store-specific extraction function to
 *     execute inside the page context.
 * @returns {void} Does not return a value. Results are rendered directly into
 *     the popup UI when the script execution callback completes.
 *
 * @example
 * runScript(123, extractGooglePlayLinks);
 */
function runScript(tabId, func) {
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    function: func,
  }, (results) => {
    if (results && results[0].result) {
      const links = results[0].result;
      document.getElementById('result').value = links.join('\n');
      document.getElementById('count').innerText = links.length;
    }
  });
}

/**
 * Extracts canonical Google Play application links from the current page.
 *
 * Collects visible Google Play app anchors, ignores links inside the footer,
 * parses each link for its application identifier, and returns a deduplicated
 * list of normalized `details?id=` URLs.
 *
 * @returns {string[]} An array of unique, canonical Google Play application
 *     URLs discovered on the current page.
 *
 * @example
 * const links = extractGooglePlayLinks();
 * // ['https://play.google.com/store/apps/details?id=com.example.game']
 */
function extractGooglePlayLinks() {
  const allLinks = Array.from(document.querySelectorAll('a[href*="details?id="]'));
  const uniqueIds = new Set();
  const resultLinks = [];

  allLinks.forEach(link => {
    const isVisible = link.offsetParent !== null;
    const isInsideFooter = link.closest('footer');

    if (isVisible && !isInsideFooter) {
      // Ignore malformed URLs so one bad anchor does not interrupt extraction.
      try {
        const url = new URL(link.href);
        const appId = url.searchParams.get('id');
        if (appId && !uniqueIds.has(appId)) {
          uniqueIds.add(appId);
          resultLinks.push(`https://play.google.com/store/apps/details?id=${appId}`);
        }
      } catch (e) {}
    }
  });
  return resultLinks;
}

/**
 * Extracts canonical Apple App Store application links from the current page.
 *
 * Collects visible Apple App Store app anchors, skips footer and global
 * navigation links, parses each URL path for the `id` token, and returns a
 * deduplicated list of normalized App Store URLs.
 *
 * @returns {string[]} An array of unique, canonical Apple App Store
 *     application URLs discovered on the current page.
 *
 * @example
 * const links = extractAppleStoreLinks();
 * // ['https://apps.apple.com/app/id123456789']
 */
function extractAppleStoreLinks() {
  const allLinks = Array.from(document.querySelectorAll('a[href*="/app/"]'));
  const uniqueIds = new Set();
  const resultLinks = [];

  allLinks.forEach(link => {
    const isVisible = link.offsetParent !== null;
    const isInsideFooter = link.closest('footer') || link.closest('#globalnav');

    if (isVisible && !isInsideFooter) {
      // Ignore malformed URLs so one bad anchor does not interrupt extraction.
      try {
        const url = new URL(link.href);
        const match = url.pathname.match(/id\d+/);

        if (match) {
          const appId = match[0];
          if (!uniqueIds.has(appId)) {
            uniqueIds.add(appId);
            resultLinks.push(`https://apps.apple.com/app/${appId}`);
          }
        }
      } catch (e) {}
    }
  });
  return resultLinks;
}
