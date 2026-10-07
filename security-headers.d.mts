export function securityHeaders(opts: {
  secure: boolean;
  dev?: boolean;
}): { key: string; value: string }[];
