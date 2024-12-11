export interface ControlPlanInfoResponse {
  total: number; // Ukupan broj redova
  data: ControlPlanInfoResponse[]; // Niz objekata sa podacima
}

export interface ControlPlanInfoResponse {
  id: number;
  control_plan_baseline_id: number;
  risk_measurement_id: number;
  process_number: string;
  process_name: string;
  resource: string;
  characteristic_number: string;
  characteristic_product: string;
  characteristic_process: string;
  classification: string;
  specification: string;
  evaluation: string;
  sample_size: string;
  sample_frequency: string;
  control_method: string;
  reaction_plan: string;
  created_at: string;
  updated_at: string;
  measurement: Measurement;
}

export interface Measurement {
  id: number;
  risk_id: number;
  type: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  risk: Risk;
}

export interface Risk {
  id: number;
  cause: string;
}
