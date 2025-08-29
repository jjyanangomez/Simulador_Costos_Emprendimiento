export interface BaseResponseApi {
  code?: string;
  success?: string;
  message?: string;
  idMeeting?: string;
  data?: any[];
  errors?: {
    [key: string]: string[];
  };
}
