const CELESC_LOGIN_URL = "https://conecte.celesc.com.br/auth/login";

export type CelescAccount = "gabriel" | "luiz";

interface CelescLoginResponse {
  data?: {
    authenticate?: {
      login?: {
        accessToken?: string;
      };
      sapAccess?: {
        accessId?: string;
      };
    };
  };
}

export interface CelescAuthSession {
  accessId: string;
  accessToken: string;
}

const CELESC_ACCOUNT_ENV: Record<
  CelescAccount,
  { email: string; password: string }
> = {
  gabriel: {
    email: "CELESC_GABRIEL_EMAIL",
    password: "CELESC_GABRIEL_PASSWORD",
  },
  luiz: {
    email: "CELESC_LUIZ_EMAIL",
    password: "CELESC_LUIZ_PASSWORD",
  },
};

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Variável de ambiente obrigatória não definida: ${name}`);
  }

  return value;
}

export async function authenticateOnCelesc(
  account: CelescAccount
): Promise<CelescAuthSession> {
  const envKeys = CELESC_ACCOUNT_ENV[account];
  const username = getRequiredEnv(envKeys.email);
  const password = getRequiredEnv(envKeys.password);

  const response = await fetch(CELESC_LOGIN_URL, {
    body: JSON.stringify({
      accessIp: "",
      channel: "ZAW",
      deviceId: "Mac Chrome Macintosh",
      firebaseToken: "",
      password,
      socialCode: "",
      socialRedirectUri: "",
      username,
    }),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(
      `Falha na autenticação CELESC (${account}): HTTP ${response.status} ${response.statusText}`
    );
  }

  const body = (await response.json()) as CelescLoginResponse;
  const accessToken = body.data?.authenticate?.login?.accessToken;
  const accessId = body.data?.authenticate?.sapAccess?.accessId;

  if (!accessToken) {
    throw new Error(`Resposta CELESC (${account}) não contém accessToken.`);
  }

  if (!accessId) {
    throw new Error(`Resposta CELESC (${account}) não contém accessId.`);
  }

  return { accessId, accessToken };
}
