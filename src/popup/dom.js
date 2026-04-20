export function getPopupElements() {
  return {
    runButton: document.getElementById('run'),
    status: document.getElementById('status'),
    errorMessage: document.getElementById('error-msg'),
    resultField: document.getElementById('result'),
    count: document.getElementById('count'),
    themeToggle: document.getElementById('theme-toggle'),
  };
}

export function renderExtractionResult(elements, links) {
  elements.resultField.value = links.join('\n');
  elements.count.textContent = String(links.length);
}

export function renderError(elements, message) {
  elements.errorMessage.textContent = message;
  elements.errorMessage.classList.remove('hidden');
}

export function clearError(elements) {
  elements.errorMessage.classList.add('hidden');
}

export function setStatus(elements, text) {
  elements.status.textContent = text;
}

export function disableRunButton(elements) {
  elements.runButton.disabled = true;
}

export function enableRunButton(elements) {
  elements.runButton.disabled = false;
}
