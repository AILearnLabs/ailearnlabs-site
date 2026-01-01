export function isValidEmail(email: string): boolean {
  if (!email) return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  return re.test(email.trim());
}

export function validateMessage(s: string, min = 10, max = 2000): boolean {
  if (!s) return false;
  const len = s.trim().length;
  return len >= min && len <= max;
}

export function hashIP(ip: string): string {
  // Lightweight, non-cryptographic hash for rate limiting
  let h = 0;
  for (let i = 0; i < ip.length; i++) {
    h = (h << 5) - h + ip.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h).toString(36);
}

