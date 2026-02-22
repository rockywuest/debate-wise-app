export interface ArgumentAnalysis {
  relevanz: { score: number; begruendung: string };
  substantiierung: { status: string; begruendung: string };
  spezifitaet: { status: string; begruendung: string };
  fehlschluss: { status: string; begruendung: string };
}
