import { clerkClient } from "./client";

function formatClerkUserName(user: {
  emailAddresses: { emailAddress: string }[];
  firstName: string | null;
  lastName: string | null;
  username: string | null;
}) {
  const fullName = [user.firstName, user.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  if (fullName) {
    return fullName;
  }

  if (user.username) {
    return user.username;
  }

  return user.emailAddresses[0]?.emailAddress ?? "Usuário desconhecido";
}

export async function resolveClerkUserNames(userIds: string[]) {
  const uniqueIds = [...new Set(userIds.filter(Boolean))];
  const nameById = new Map<string, string>();

  if (uniqueIds.length === 0) {
    return nameById;
  }

  const { data: users } = await clerkClient.users.getUserList({
    limit: uniqueIds.length,
    userId: uniqueIds,
  });

  for (const user of users) {
    nameById.set(user.id, formatClerkUserName(user));
  }

  for (const userId of uniqueIds) {
    if (!nameById.has(userId)) {
      nameById.set(userId, "Usuário desconhecido");
    }
  }

  return nameById;
}
