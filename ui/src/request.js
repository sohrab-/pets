export default async function request(
  path,
  {
    headers = {},
    params = {},
    body = undefined,
    ...options
  } = {}
) {
  const url = new URL(`${process.env.REACT_APP_API_BASE_URL}/${path}`);
  url.search = new URLSearchParams(params).toString();

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      // I prefer this over sending it in the body.
      // Can handle it consistently across requests without bodies...
      'X-Session': process.env.REACT_APP_DEMO_SESSION,
      ...headers
    },
    body: JSON.stringify(body),
    ...options
  });

  return response.json();
}