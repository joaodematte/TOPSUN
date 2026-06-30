import { chromium } from "playwright";
import type { Browser } from "playwright";

interface LaunchBrowserOptions {
  headless?: boolean;
}

const CONTAINER_CHROMIUM_ARGS = [
  "--no-sandbox",
  "--disable-setuid-sandbox",
  "--disable-dev-shm-usage",
];

function getExecutablePath() {
  const configuredPath = process.env.CHROME_PATH?.trim();
  return configuredPath || undefined;
}

export function launchBrowser({ headless = true }: LaunchBrowserOptions = {}) {
  return chromium.launch({
    args: CONTAINER_CHROMIUM_ARGS,
    executablePath: getExecutablePath(),
    headless,
  });
}

export type { Browser };
