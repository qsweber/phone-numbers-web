/**
 * Minimal client for the phone-numbers API (https://github.com/qsweber/phone-numbers).
 *
 * The base URL (e.g. https://phone-numbers-api.quinnweber.com/v1) comes from
 * NEXT_PUBLIC_API_URL, which CI reads from the CDK stack's ApiUrl output at
 * build time.
 */

export interface MatchResponse {
  input: string;
  match: string;
}

const getBaseUrl = (): string => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) {
    throw new Error(
      "NEXT_PUBLIC_API_URL environment variable is not set. It must be defined to configure the API client base URL.",
    );
  }

  return baseUrl;
};

/**
 * Fire-and-forget request to wake the API before the user submits. This absorbs a Lambda cold
 * start while the user is still typing, and opens the TCP/TLS connection that the browser then
 * reuses for the /match request.
 */
export const warmUp = (): void => {
  fetch(`${getBaseUrl()}/ping`).catch(() => {
    // Best effort: a failed warm-up shouldn't affect the page.
  });
};

export const getMatch = async (phoneNumber: string): Promise<MatchResponse> => {
  const url = `${getBaseUrl()}/match?value=${encodeURIComponent(phoneNumber)}`;
  const response = await fetch(url);

  if (!response.ok) {
    let message = `API request failed: ${response.status} ${response.statusText}`;
    try {
      const body = (await response.json()) as { error?: string };
      if (body.error) {
        message = body.error;
      }
    } catch {
      // Non-JSON error body; keep the status-based message.
    }
    throw new Error(message);
  }

  return response.json();
};
