export interface ContactFormData {
  name: string;
  phone: string;
  email: string;
  comment: string;
}

export type FormField = keyof ContactFormData;

export interface ApiErrorBody {
  success: false;
  message: string;
  errors?: Partial<Record<FormField, string>>;
}

export interface ApiSuccessBody {
  success: true;
  message: string;
}
