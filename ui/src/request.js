export default async function request(
  path,
  {
    method = "get",
    headers = {},
    params = {},
    body = undefined,
    ...options
  } = {}
) {
  const url = new URL(`${process.env.REACT_APP_API_BASE_URL}/${path}`);
  url.search = new URLSearchParams(params).toString();

  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      "Demo-Session": process.env.REACT_APP_DEMO_SESSION,
      ...headers,
    },
    body: JSON.stringify(body),
    ...options,
  });

  return response.json();
}
