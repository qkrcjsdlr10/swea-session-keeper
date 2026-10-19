const enabledEl = document.getElementById("enabled");
const intervalEl = document.getElementById("interval");
const lastRequestEl = document.getElementById("lastRequest");
const lastResultEl = document.getElementById("lastResult");
const pingNowEl = document.getElementById("pingNow");

async function load() {
  const data = await chrome.storage.local.get({
    enabled: true,
    intervalMinutes: 5,
    lastRequestAt: null,
    lastResult: "대기 중"
  });

  enabledEl.checked = data.enabled;
  intervalEl.value = String(data.intervalMinutes);
  lastResultEl.textContent = data.lastResult;

  if (data.lastRequestAt) {
    const d = new Date(data.lastRequestAt);
    lastRequestEl.textContent = d.toLocaleTimeString("ko-KR");
  } else {
    lastRequestEl.textContent = "없음";
  }
}

async function saveSettings() {
  await chrome.storage.local.set({
    enabled: enabledEl.checked,
    intervalMinutes: Number(intervalEl.value)
  });

  await chrome.runtime.sendMessage({
    type: "SETTINGS_UPDATED"
  });
}

enabledEl.addEventListener("change", saveSettings);
intervalEl.addEventListener("change", saveSettings);

pingNowEl.addEventListener("click", async () => {
  pingNowEl.disabled = true;
  pingNowEl.textContent = "요청 중...";

  await chrome.runtime.sendMessage({
    type: "PING_NOW"
  });

  setTimeout(async () => {
    await load();
    pingNowEl.disabled = false;
    pingNowEl.textContent = "지금 요청 보내기";
  }, 400);
});

load();
