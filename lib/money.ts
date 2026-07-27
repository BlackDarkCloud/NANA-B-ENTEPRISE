// All amounts are stored in pesewas (1 GHS = 100 pesewas) to avoid floating point issues.

export function toPesewas(ghs: number): number {
  return Math.round(ghs * 100);
}

export function toGHS(pesewas: number): number {
  return pesewas / 100;
}

export function formatGHS(pesewas: number): string {
  return `GH₵${toGHS(pesewas).toLocaleString("en-GH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
