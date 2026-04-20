import { ERROR_MESSAGES, STORE_LABELS, STORE_TYPES } from './constants.js';
import { executeInTab, getActiveTab } from './chrome-api.js';
import {
  clearError,
  disableRunButton,
  enableRunButton,
  getPopupElements,
  renderError,
  renderExtractionResult,
  setStatus,
} from './dom.js';
import { detectStoreType } from './store-detection.js';
import { initializeThemeToggle } from './theme.js';
import { extractAppleStoreLinks, extractGooglePlayLinks } from '../extractors/index.js';

const extractorByStoreType = Object.freeze({
  [STORE_TYPES.GOOGLE_PLAY]: extractGooglePlayLinks,
  [STORE_TYPES.APPLE_APP_STORE]: extractAppleStoreLinks,
});

async function initializePopup() {
  const elements = getPopupElements();
  initializeThemeToggle(elements.themeToggle);

  const tab = await getActiveTab();

  if (!tab || !tab.id) {
    disableRunButton(elements);
    setStatus(elements, STORE_LABELS.unsupported);
    renderError(elements, ERROR_MESSAGES.noTab);
    return;
  }

  const storeType = detectStoreType(tab.url);

  if (!storeType) {
    disableRunButton(elements);
    setStatus(elements, STORE_LABELS.unsupported);
    renderError(elements, ERROR_MESSAGES.unsupportedSite);
    return;
  }

  setStatus(elements, STORE_LABELS[storeType]);
  clearError(elements);
  enableRunButton(elements);

  elements.runButton.addEventListener('click', async () => {
    disableRunButton(elements);

    try {
      const extractedLinks = await executeInTab(tab.id, extractorByStoreType[storeType]);
      renderExtractionResult(elements, extractedLinks);
      clearError(elements);
    } catch {
      renderError(elements, ERROR_MESSAGES.extractionFailed);
    } finally {
      enableRunButton(elements);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initializePopup().catch(() => {
    const elements = getPopupElements();
    disableRunButton(elements);
    setStatus(elements, STORE_LABELS.unsupported);
    renderError(elements, ERROR_MESSAGES.extractionFailed);
  });
});
