import { AxiosError } from 'axios';

export interface NormalizedApiError {
  code: string;
  message: string;
  statusCode?: number;
  details?: string[];
}

/**
 * Parses any error (AxiosError, Error, string, object) into a standardized NormalizedApiError structure.
 */
export function parseApiError(error: unknown): NormalizedApiError {
  if (!error) {
    return {
      code: 'UNKNOWN_ERROR',
      message: 'An unexpected error occurred.',
    };
  }

  // Handle Axios Error
  if (isAxiosError(error)) {
    const response = error.response;

    // Server responded with a status code outside of 2xx range
    if (response) {
      const data = response.data as Record<string, any> | undefined;
      const status = response.status;

      if (data) {
        // Backend returns custom error format: { code: string, message: string }
        // Or NestJS ValidationPipe format: { statusCode: number, message: string | string[], error: string }
        let message = 'An error occurred on the server.';
        let details: string[] | undefined;

        if (Array.isArray(data.message)) {
          message = data.message.join(', ');
          details = data.message;
        } else if (typeof data.message === 'string') {
          message = data.message;
        } else if (data.error && typeof data.error === 'string') {
          message = data.error;
        }

        const code = data.code || `HTTP_${status}`;

        return {
          code,
          message,
          statusCode: status,
          details,
        };
      }

      // Default HTTP status messages if no body returned
      return {
        code: `HTTP_${status}`,
        message: getHttpStatusMessage(status),
        statusCode: status,
      };
    }

    // Request was made but no response was received (Network error / server down)
    if (error.request) {
      return {
        code: 'NETWORK_ERROR',
        message: 'Unable to reach the server. Please check your internet connection or try again later.',
      };
    }
  }

  // Standard JS Error instance
  if (error instanceof Error) {
    return {
      code: 'APP_ERROR',
      message: error.message,
    };
  }

  // String error
  if (typeof error === 'string') {
    return {
      code: 'APP_ERROR',
      message: error,
    };
  }

  return {
    code: 'UNKNOWN_ERROR',
    message: 'An unknown error occurred.',
  };
}

/**
 * Helper to get a human-readable message string directly from any error.
 */
export function getErrorMessage(error: unknown): string {
  return parseApiError(error).message;
}

function isAxiosError(error: unknown): error is AxiosError {
  return typeof error === 'object' && error !== null && 'isAxiosError' in error;
}

function getHttpStatusMessage(status: number): string {
  switch (status) {
    case 400:
      return 'Bad request. Please verify your input.';
    case 401:
      return 'Unauthorized. Please log in.';
    case 403:
      return 'Access forbidden.';
    case 404:
      return 'Resource not found.';
    case 409:
      return 'Conflict. Record already exists.';
    case 429:
      return 'Too many requests. Please slow down.';
    case 500:
      return 'Internal server error. Please try again later.';
    default:
      return `Server returned status code ${status}.`;
  }
}
