// Adressen waar challenges naartoe verwijzen. Het scherm Bewijs indienen bestaat nog niet:
// spreek met het team af of dit adres blijft.
export function bewijsPad(challengeId: string) {
  return `/challenges/${challengeId}/bewijs`;
}
