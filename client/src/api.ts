async function request(method: string, route: string, body?: unknown) {
  const response = await fetch(route, {
    method,
    headers: body === undefined ? undefined : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(`${method} ${route} failed: ${response.status}`);
  }
  return response;
}

export const GET = (route: string) => request("GET", route);
export const DELETE = (route: string) => request("DELETE", route);
export const POST = (route: string, body: unknown) => request("POST", route, body);
export const PATCH = (route: string, body: unknown) => request("PATCH", route, body);
