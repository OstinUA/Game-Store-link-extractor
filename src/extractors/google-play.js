function isVisibleElement(element) {
  return Boolean(element) && element.offsetParent !== null;
}

function getGooglePlayCanonicalUrl(anchorHref) {
  try {
    const url = new URL(anchorHref, window.location.origin);
    const appId = url.searchParams.get('id');

    if (!appId || !appId.trim()) {
      return null;
    }

    return `https://play.google.com/store/apps/details?id=${appId.trim()}`;
  } catch {
    return null;
  }
}

export function extractGooglePlayLinks() {
  const anchors = document.querySelectorAll('a[href*="/store/apps/details"], a[href*="details?id="]');
  const uniqueLinks = new Set();

  for (const anchor of anchors) {
    if (!isVisibleElement(anchor)) {
      continue;
    }

    if (anchor.closest('footer')) {
      continue;
    }

    const canonicalUrl = getGooglePlayCanonicalUrl(anchor.href);

    if (canonicalUrl) {
      uniqueLinks.add(canonicalUrl);
    }
  }

  return Array.from(uniqueLinks);
}
