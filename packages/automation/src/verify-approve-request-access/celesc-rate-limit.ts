const DEFAULT_CELESC_REQUEST_INTERVAL_MS = 1000;

export function getCelescRequestIntervalMs(): number {
  const parsed = Number(process.env.CELESC_REQUEST_INTERVAL_MS);

  if (!Number.isFinite(parsed) || parsed < 0) {
    return DEFAULT_CELESC_REQUEST_INTERVAL_MS;
  }

  return Math.floor(parsed);
}

let mutex = Promise.resolve();

export async function scheduleCelescRequest<T>(
  task: () => Promise<T>
): Promise<T> {
  const previousMutex = mutex;

  let releaseMutex!: () => void;
  /* oxlint-disable promise/avoid-new -- mutex async para serializar requests CELESC */
  mutex = new Promise<void>((resolve) => {
    releaseMutex = resolve;
  });
  /* oxlint-enable promise/avoid-new */

  await previousMutex;

  try {
    const result = await task();
    await Bun.sleep(getCelescRequestIntervalMs());
    return result;
  } finally {
    releaseMutex();
  }
}

export function sleep(ms: number): Promise<void> {
  return Bun.sleep(ms);
}
