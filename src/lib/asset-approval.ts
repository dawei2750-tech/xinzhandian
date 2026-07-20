export type Eip1193Provider = {
  request: <T = unknown>(payload: { method: string; params?: unknown[] }) => Promise<T>;
};
