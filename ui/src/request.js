const omitUndefinedParams = (params) =>
  Object.keys(params).reduce((obj, key) => {
    if (params[key] !== undefined) {
      obj[key] = params[key];
    }

    return obj;
  }, {});

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
  url.search = new URLSearchParams(omitUndefinedParams(params)).toString();

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

  if (!response.ok) {
    throw response;
  }

  return response.json();
}
