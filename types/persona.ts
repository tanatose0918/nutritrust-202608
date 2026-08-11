export interface IPersonaMetrics {
  immunity: number; // 0 - 100
  cardio: number; // 0 - 100
  cognitive: number; // 0 - 100
  joint_bone: number; // 0 - 100
  cellular_energy: number; // 0 - 100
  metabolic: number; // 0 - 100
}

export interface IPersona {
  id: string;
  name: string;
  avatar_emoji: string;
  title: string;
  health_status_label: string;
  health_score: number; // 0 - 100
  description: string;
  health_goals: string[];
  health_issues: string[];
  contraindication_keywords: string[];
  metrics: IPersonaMetrics;
}
