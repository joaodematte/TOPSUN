import { chromium } from "playwright";
import type { Browser } from "playwright";

interface LaunchBrowserOptions {
  headless?: boolean;
}

export function launchBrowser({ headless = true }: LaunchBrowserOptions = {}) {
  return chromium.launch({
    executablePath: process.env.CHROME_PATH,
    headless,
  });
}

export type { Browser };
