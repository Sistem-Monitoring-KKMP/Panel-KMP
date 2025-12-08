export interface Responden {
  id: number;
  responden: string;
  kontak_responden: string;
  enumerator: string;
  kontak_enumerator: string;
  created_at?: string;
  updated_at?: string;
}

export interface RespondenFormInput {
  responden: string;
  kontak_responden: string;
  enumerator: string;
  kontak_enumerator: string;
}
