import type { Browser, Locator, Page } from "playwright";

import type { RequestProtocolProject as Project } from "../db/queries";
import type { AutomationProgressEvent } from "../types";

type ProjectFieldKey = keyof Project | `env.${string}`;

interface FieldQuestion {
  key: ProjectFieldKey;
  questionId: string;
  type: "text" | "date" | "textarea";
}

interface RadioQuestion {
  questionId: string;
  type: "radio";
  valueToCheck: string;
}

type FormQuestion = FieldQuestion | RadioQuestion;

const DEFAULT_TIMEOUT_MS = 5000;
const QUESTION_FILL_DELAY_MS = 1000;

const SELECTORS = {
  questionItem: 'div[data-automation-id="questionItem"]',
  textInput: 'input[data-automation-id="textInput"]',
} as const;

// Converte data ISO (YYYY-MM-DD) para o formato aceito pelo formulário (MM/DD/YYYY)
function formatIsoDateToUsDate(value: string | null | undefined) {
  if (!value) {
    return "";
  }

  const [year, month, day] = value.split("-");

  if (!(year && month && day)) {
    return value;
  }

  return `${month}/${day}/${year}`;
}

// Primeira etapa: unidade consumidora e tipo de responsável
const FIRST_STEP_QUESTIONS: FormQuestion[] = [
  {
    key: "unidadeConsumidora",
    questionId: "QuestionId_r67877d4ef9764ed2b3b5815347f034fb",
    type: "text",
  },
  {
    questionId: "QuestionId_r71274cfc077645c893dd82fbdfb421ed",
    type: "radio",
    valueToCheck: "Projetista Responsável",
  },
];

// Segunda etapa: dados do cliente e do projetista
const SECOND_STEP_QUESTIONS: FormQuestion[] = [
  {
    key: "cliente",
    questionId: "QuestionId_r79df165e08654fc880b4b49b4b0a7566",
    type: "textarea",
  },
  {
    key: "cpfCnpj",
    questionId: "QuestionId_r0d8767e570174f57a96b8e9121b88be2",
    type: "text",
  },
  {
    key: "nascAberturaCliente",
    questionId: "QuestionId_r12606fe8cebc4aa6adb47724eaaebe01",
    type: "date",
  },
  {
    key: "emailCliente",
    questionId: "QuestionId_rd6c66661af634182b13e3b765aa1e8dc",
    type: "text",
  },
  {
    key: "env.DESIGNER_NAME",
    questionId: "QuestionId_r56f6b8a3d3a240c8a20f1063317647bd",
    type: "textarea",
  },
  {
    key: "env.DESIGNER_CPF",
    questionId: "QuestionId_r4276294d47a54d9386cf436f6e140681",
    type: "text",
  },
  {
    key: "env.DESIGNER_EMAIL",
    questionId: "QuestionId_rea0b4c8134c14600a4e7958e8b36825b",
    type: "text",
  },
  {
    key: "env.DESIGNER_PHONE",
    questionId: "QuestionId_rfc87ed4b05034e20b918ba75284c6688",
    type: "text",
  },
];

// Terceira etapa: confirmações finais via radio
const THIRD_STEP_QUESTIONS: FormQuestion[] = [
  {
    questionId: "QuestionId_r3bbd2a6fa5834cbfa963bf2cd41bede7",
    type: "radio",
    valueToCheck: "Não",
  },
  {
    questionId: "QuestionId_r74f8f8b1ab1c4858918014779c042b73",
    type: "radio",
    valueToCheck:
      "Declaro que as informações prestadas neste formulários são verdadeiras. Nada mais a declarar, e ciente das responsabilidades pelas declarações prestadas.",
  },
];

async function waitForAnyInputToBeVisible(page: Page) {
  await page.locator(SELECTORS.textInput).waitFor();
}

async function clickNextButton(page: Page) {
  await page.getByRole("button", { name: "Next" }).click();
}

async function clickSubmitButton(page: Page) {
  await page.getByRole("button", { name: "Submit" }).click();
}

function isEnvFieldKey(key: ProjectFieldKey): key is `env.${string}` {
  return key.startsWith("env.");
}

function getFieldValue(project: Project, key: ProjectFieldKey): string {
  if (isEnvFieldKey(key)) {
    const envKey = key.slice("env.".length);
    return String(process.env[envKey] ?? "");
  }

  return String(project[key] ?? "");
}

// Localiza o container da pergunta pelo ID interno do formulário
function getQuestionItemLocator(page: Page, questionId: string): Locator {
  return page.locator(`${SELECTORS.questionItem}:has(#${questionId})`);
}

async function fillTextQuestion(page: Page, questionId: string, value: string) {
  await getQuestionItemLocator(page, questionId)
    .locator(SELECTORS.textInput)
    .fill(value);
}

async function fillTextareaQuestion(
  page: Page,
  questionId: string,
  value: string
) {
  await getQuestionItemLocator(page, questionId)
    .locator('textarea[data-automation-id="textInput"]')
    .fill(value);
}

async function fillDateQuestion(page: Page, questionId: string, value: string) {
  const input = getQuestionItemLocator(page, questionId)
    .locator("input")
    .first();

  await input.fill(formatIsoDateToUsDate(value));
}

async function checkRadioQuestion(page: Page, valueToCheck: string) {
  await page.getByRole("radio", { name: valueToCheck }).check();
}

async function fillFieldQuestion(
  page: Page,
  project: Project,
  question: FieldQuestion
) {
  const value = getFieldValue(project, question.key);

  switch (question.type) {
    case "text": {
      await fillTextQuestion(page, question.questionId, value);
      break;
    }
    case "textarea": {
      await fillTextareaQuestion(page, question.questionId, value);
      break;
    }
    case "date": {
      await fillDateQuestion(page, question.questionId, value);
      break;
    }
    default: {
      const unhandledType: never = question.type;
      throw new Error(`Tipo de campo não suportado: ${unhandledType}`);
    }
  }
}

async function fillFormQuestion(
  page: Page,
  project: Project,
  question: FormQuestion
) {
  switch (question.type) {
    case "text":
    case "textarea":
    case "date": {
      await fillFieldQuestion(page, project, question);
      break;
    }
    case "radio": {
      await checkRadioQuestion(page, question.valueToCheck);
      break;
    }
    default: {
      const unhandledQuestion: never = question;
      throw new Error(`Tipo de pergunta não suportado: ${unhandledQuestion}`);
    }
  }

  await page.waitForTimeout(QUESTION_FILL_DELAY_MS);
}

// Preenche as perguntas de uma etapa em ordem, aguardando entre cada uma
async function fillQuestions(
  page: Page,
  project: Project,
  questions: FormQuestion[]
) {
  /* oxlint-disable no-await-in-loop -- o formulário exige preenchimento sequencial */
  for (const question of questions) {
    await fillFormQuestion(page, project, question);
  }
  /* oxlint-enable no-await-in-loop */
}

async function waitForSuccessMessage(page: Page) {
  await page.getByText("Sua resposta foi enviada").waitFor();
}

export async function requestProtocolOnNewCelesc(
  browser: Browser,
  project: Project,
  onProgress?: (event: AutomationProgressEvent) => void | Promise<void>
) {
  const context = await browser.newContext();

  try {
    const page = await context.newPage();

    page.setDefaultTimeout(DEFAULT_TIMEOUT_MS);

    await page.goto(process.env.REQUEST_PROTOCOL_URL ?? "");
    await waitForAnyInputToBeVisible(page);

    await fillQuestions(page, project, FIRST_STEP_QUESTIONS);
    await clickNextButton(page);

    await fillQuestions(page, project, SECOND_STEP_QUESTIONS);
    await clickNextButton(page);

    await fillQuestions(page, project, THIRD_STEP_QUESTIONS);

    await clickSubmitButton(page);

    await waitForSuccessMessage(page);

    await onProgress?.({
      level: "success",
      message: `Protocolo solicitado na CELESC: ${project.projeto} - ${project.cliente}`,
    });

    return true;
  } catch (error) {
    await onProgress?.({
      level: "error",
      message: `Erro ao solicitar protocolo na CELESC: ${project.projeto} - ${project.cliente}${error instanceof Error ? `: ${error.message}` : ""}`,
    });

    return false;
  } finally {
    await context.close();
  }
}
