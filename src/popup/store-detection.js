import { STORE_TYPES } from './constants.js';

export function detectStoreType(urlString) {
  if (!urlString || typeof urlString !== 'string') {
    return null;
  }

  let parsedUrl;

  try {
    parsedUrl = new URL(urlString);
  } catch {
    return null;
  }

  const host = parsedUrl.hostname.toLowerCase();

  if (host === 'play.google.com' || host.endsWith('.play.google.com')) {
    return STORE_TYPES.GOOGLE_PLAY;
  }

  if (host === 'apps.apple.com' || host.endsWith('.apps.apple.com')) {
    return STORE_TYPES.APPLE_APP_STORE;
  }

  return null;
}
