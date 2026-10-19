const ALARM_NAME = "sweaKeepAlive";
const DEFAULT_INTERVAL = 5;

async function getSettings() {
  return await chrome.storage.local.get({
    enabled: true,
    intervalMinutes: DEFAULT_INTERVAL,
    lastRequestAt: null,
    lastResult: "대기 중"
  });
}

async function createOrUpdateAlarm() {
  const { enabled, intervalMinutes } = await getSettings();
  await chrome.alarms.clear(ALARM_NAME);

  if (!enabled) return;

  const minutes = Math.max(1, Number(intervalMinutes) || DEFAULT_INTERVAL);
  chrome.alarms.create(ALARM_NAME, {
    delayInMinutes: minutes,
    periodInMinutes: minutes
  });
}

async function pingSweaTabs() {
  const { enabled } = await getSettings();
  if (!enabled) return;

  let detail;

  try {
    const res = await fetch(
      `https://swexpertacademy.com/main/main.do?_swea_keep_alive=${Date.now()}`,
      { credentials: "include", cache: "no-store" }
    );
    const body = await res.text();

    if (
      res.url.toLowerCase().includes("login") ||
      /<input\b[^>]*\btype\s*=\s*["']password["']/i.test(body)
    ) {
      detail = "세션 만료 또는 로그인 필요";
    } else if (res.ok) {
      detail = `요청 성공 (${res.status})`;
    } else {
      detail = `요청 실패 (${res.status})`;
    }
  } catch (e) {
    detail = `요청 오류: ${e.message || String(e)}`;
  }

  await chrome.storage.local.set({
    lastRequestAt: new Date().toISOString(),
    lastResult: detail
  });
}

chrome.runtime.onInstalled.addListener(async () => {
  const current = await chrome.storage.local.get([
    "enabled",
    "intervalMinutes"
  ]);

  const defaults = {};
  if (current.enabled === undefined) defaults.enabled = true;
  if (current.intervalMinutes === undefined) defaults.intervalMinutes = DEFAULT_INTERVAL;

  if (Object.keys(defaults).length) {
    await chrome.storage.local.set(defaults);
  }

  await createOrUpdateAlarm();
});

chrome.runtime.onStartup.addListener(createOrUpdateAlarm);

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === ALARM_NAME) {
    pingSweaTabs();
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === "SETTINGS_UPDATED") {
    createOrUpdateAlarm().then(() => sendResponse({ ok: true }));
    return true;
  }

  if (message?.type === "PING_NOW") {
    pingSweaTabs().then(() => sendResponse({ ok: true }));
    return true;
  }
});

chrome.idle.onStateChanged.addListener((state) => {
  if (state === "active") {
    pingSweaTabs();
  }
});
