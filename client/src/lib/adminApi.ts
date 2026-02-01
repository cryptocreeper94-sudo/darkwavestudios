const ADMIN_API_KEY = "0424";

export async function adminRequest(
  method: string,
  url: string,
  body?: unknown
): Promise<Response> {
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      "X-Admin-Key": ADMIN_API_KEY,
    },
    credentials: "include",
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);
  return response;
}

export function getAdminQueryOptions(queryKey: string[]) {
  return {
    queryKey,
    queryFn: async () => {
      const response = await fetch(queryKey[0], {
        headers: {
          "X-Admin-Key": ADMIN_API_KEY,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch");
      }
      return response.json();
    },
  };
}
