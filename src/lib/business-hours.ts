// Horário comercial da especialista (fuso de Maceió, UTC-3, sem horário de verão).
// Seg–Sex 08h–18h · Sáb 08h–12h · Dom fechado.
export const BUSINESS_HOURS_LABEL = "Seg a Sex, 8h às 18h · Sáb, 8h às 12h";

export function isSpecialistOnline(now: Date = new Date()): boolean {
  const local = new Date(now.getTime() - 3 * 60 * 60 * 1000);
  const day = local.getUTCDay();
  const minutes = local.getUTCHours() * 60 + local.getUTCMinutes();
  if (day >= 1 && day <= 5) return minutes >= 8 * 60 && minutes < 18 * 60;
  if (day === 6) return minutes >= 8 * 60 && minutes < 12 * 60;
  return false;
}
