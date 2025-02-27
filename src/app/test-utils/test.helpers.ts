import { HttpErrorResponse, HttpRequest } from '@angular/common/http';

/**
 * Helper function to check if an error matches expected HTTP error criteria
 */
export function verifyHttpError(
  error: unknown,
  expectedStatus = 500,
  expectedText = 'Server Error'
): error is HttpErrorResponse {
  if (!(error instanceof HttpErrorResponse)) {
    return false;
  }

  expect(error.status).toBe(expectedStatus);
  expect(error.statusText).toBe(expectedText);
  return true;
}

/**
 * Helper function to verify common HTTP request properties
 */
export function verifyHttpRequest(
  req: HttpRequest<unknown>,
  expectedMethod: string,
  expectedUrl: string,
  expectedBody?: Record<string, unknown>
): void {
  expect(req.method).toBe(expectedMethod);
  expect(req.url).toBe(expectedUrl);

  if (expectedBody && req.body) {
    // Type guard to ensure req.body is an object we can safely access
    if (typeof req.body === 'object' && req.body !== null) {
      Object.entries(expectedBody).forEach(([key, value]) => {
        expect((req.body as Record<string, unknown>)[key]).toBe(value);
      });
    } else {
      fail('Expected request body to be an object but was: ' + typeof req.body);
    }
  }
}
