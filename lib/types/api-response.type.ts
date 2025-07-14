/**
 * Standard API response wrapper type
 *
 * This type ensures consistent API response format across the application
 */
export type ApiResponse<T = unknown> = {
  success: boolean;
  data: T;
  error?: string;
  message?: string;
  timestamp?: string;
  requestId?: string;
};
