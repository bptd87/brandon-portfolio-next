type ImportMetaEnvShape = {
  env?: Record<string, string | undefined>;
};

export function readPublicEnv(...keys: string[]) {
  const metaEnv =
    typeof import.meta !== "undefined" ? (import.meta as ImportMetaEnvShape).env : undefined;

  for (const key of keys) {
    const value = metaEnv?.[key] ?? process.env[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return "";
}
