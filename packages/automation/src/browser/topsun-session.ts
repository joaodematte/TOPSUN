import type { BrowserContext, Page } from "playwright";

export const DEFAULT_TIMEOUT_MS = 15_000;
export const BROWSER_CLOSE_TIMEOUT_MS = 5000;
export const MAX_PROJECT_ATTEMPTS = 3;
export const DEFAULT_CONCURRENCY = 3;

export const TOPSUN_SELECTORS = {
  closeModalEtapa: "#fecharModalEtapa",
  coletaFiltro: "#coleta_filtro",
  coletaFiltroLoading: "#div_coleta_filtro_carregando",
  dataEtapa: 'input[name="data"]',
  etapaAnaliseRedeText: "#etapa-16 .etapa-text",
  etapaSolicitacaoProtocoloText: "#etapa-42 .etapa-text",
  etapaSolicitacaoProtocoloVerde: "#etapa-42 .etapa-verde",
  modalEtapa: "#ModalEtapa",
  numeroProtocolo: "input[name='campopadrao']",
  obsAprovacaoEtapa: "textarea#obs_aprovacao_etapa",
  observacao: "textarea[name='observacao']",
  passwordInput: 'input[name="senha"]',
  salvaEtapaButton: "button#salva_etapa",
  swalConfirmButton: "button.swal2-confirm.swal2-styled",
  swalContainer: ".swal2-container",
  usernameInput: 'input[name="usuario"]',
} as const;

export function getTopsunConcurrency() {
  const parsed = Number(process.env.TOPSUN_CONCURRENCY);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return DEFAULT_CONCURRENCY;
  }

  return Math.floor(parsed);
}

export async function closeContextSafely(
  page: Page | undefined,
  context: BrowserContext | undefined
) {
  const closePromise = async () => {
    try {
      await page?.close({ runBeforeUnload: false });
    } catch {
      // Ignora falha ao fechar a página
    }

    try {
      await context?.close();
    } catch {
      // Ignora falha ao fechar o contexto
    }
  };

  await Promise.race([closePromise(), Bun.sleep(BROWSER_CLOSE_TIMEOUT_MS)]);
}

export async function authenticate(page: Page) {
  await page.goto("https://sistematopsun.com.br");

  const usernameInput = page.locator(TOPSUN_SELECTORS.usernameInput);
  const passwordInput = page.locator(TOPSUN_SELECTORS.passwordInput);
  const entrarButton = page.locator("button#btn_entrar");

  await usernameInput.waitFor();
  await passwordInput.waitFor();
  await entrarButton.waitFor();

  await usernameInput.fill(process.env.TOPSUN_USERNAME ?? "");
  await passwordInput.fill(process.env.TOPSUN_PASSWORD ?? "");
  await entrarButton.click();

  await usernameInput.waitFor({ state: "hidden" });
  await page.goto(process.env.TOPSUN_ETAPAS_PAGE ?? "");
}

export async function waitForColetaFiltroToLoad(page: Page) {
  await page
    .locator(TOPSUN_SELECTORS.coletaFiltroLoading)
    .waitFor({ state: "hidden" });
}

export async function setHiddenSelectValue(
  page: Page,
  selector: string,
  value: string
) {
  await page.locator(selector).evaluate((element, selectedValue) => {
    const selectElement = element as unknown as {
      dispatchEvent: (event: Event) => boolean;
      value: string;
    };

    selectElement.value = selectedValue;
    selectElement.dispatchEvent(new Event("change", { bubbles: true }));
  }, value);
}

export async function selectProject(page: Page, projectId: number) {
  await setHiddenSelectValue(
    page,
    TOPSUN_SELECTORS.coletaFiltro,
    String(projectId)
  );

  await page.getByRole("button", { name: "Filtrar" }).click();
}

export async function openRequestProtocolModal(page: Page) {
  const solicitacaoProtocoloEtapa = page.locator(
    TOPSUN_SELECTORS.etapaSolicitacaoProtocoloText
  );

  await solicitacaoProtocoloEtapa.waitFor();
  await solicitacaoProtocoloEtapa.click();

  await page.getByRole("button", { name: "Salvar Registros" }).waitFor();
}
