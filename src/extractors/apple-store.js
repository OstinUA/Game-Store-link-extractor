function isVisibleElement(element) {
  return Boolean(element) && element.offsetParent !== null;
}

function getAppleStoreCanonicalUrl(anchorHref) {
  try {
    const url = new URL(anchorHref, window.location.origin);
    const appIdMatch = url.pathname.match(/\/id(\d+)(?:[/?#]|$)/i);

    if (!appIdMatch || !appIdMatch[1]) {
      return null;
    }

    return `https://apps.apple.com/app/id${appIdMatch[1]}`;
  } catch {
    return null;
  }
}

export function extractAppleStoreLinks() {
  const anchors = document.querySelectorAll('a[href*="/app/"], a[href*="/id"]');
  const uniqueLinks = new Set();

  for (const anchor of anchors) {
    if (!isVisibleElement(anchor)) {
      continue;
    }

    if (anchor.closest('footer') || anchor.closest('#globalnav')) {
      continue;
    }

    const canonicalUrl = getAppleStoreCanonicalUrl(anchor.href);

    if (canonicalUrl) {
      uniqueLinks.add(canonicalUrl);
    }
  }

  return Array.from(uniqueLinks);
}
