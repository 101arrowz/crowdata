const BASE = process.env.BASE_URL || '/api';
const api = (url: string, options?: RequestInit) => fetch(BASE + url, options);
type Uploadable = string | Blob;
const makeBody = (params: {
  [k: string]: Uploadable | Uploadable[] | { [k: string]: Uploadable };
}): FormData => {
  const body = new FormData();
  for (const k in params) {
    const val = params[k];
    if (typeof val === 'string' || val instanceof Blob) body.append(k, val);
    else if (val instanceof Array) for (const v of val) body.append(k + '[]', v);
    else for (const key in val) body.append(k + '[' + key + ']', val[key]);
  }
  return body;
};
export default api;
export { makeBody, BASE as baseURL };
