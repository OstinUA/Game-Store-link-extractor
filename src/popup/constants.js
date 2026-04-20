export const STORE_TYPES = Object.freeze({
  GOOGLE_PLAY: 'google_play',
  APPLE_APP_STORE: 'apple_app_store',
});

export const STORE_LABELS = Object.freeze({
  [STORE_TYPES.GOOGLE_PLAY]: 'Google Play Store',
  [STORE_TYPES.APPLE_APP_STORE]: 'Apple App Store',
  unsupported: 'Unsupported site',
});

export const ERROR_MESSAGES = Object.freeze({
  unsupportedSite: 'Open Google Play or the App Store',
  noTab: 'Could not access active tab',
  extractionFailed: 'Extraction failed. Reload tab and retry.',
});

export const THEME_STORAGE_KEY = 'theme';
