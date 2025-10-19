// .env.local: VITE_PAT, VITE_BASE_ID, VITE_TABLE_NAME

const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
const token = `Bearer ${import.meta.env.VITE_PAT}`;

//
function makeEncodeUrl({ url, sortField, sortDirection, queryString }) {
  return function encodeUrl() {
    const sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;
    let searchQuery = '';
    if (queryString) {
      const formula = `SEARCH("${String(queryString).replace(/"/g, '\\"')}", {Name})`;
      searchQuery = `&filterByFormula=${encodeURIComponent(formula)}`;
    }
    return `${url}?${sortQuery}${searchQuery}`;
  };
}

function jsonHeaders() {
  return {
    Authorization: token,
    'Content-Type': 'application/json',
  };
}

export function makeAirtableClient() {
  const ctx = {
    url: url,
    token: token,
    encodeUrl: null,
    //
    async list(finalUrl) {
      const resp = await fetch(finalUrl, { headers: { Authorization: token } });
      if (!resp.ok) throw new Error(resp.status);
      return resp.json(); // { records: [...] }
    },
    async create(fields) {
      const payload = { records: [{ fields }] };
      const resp = await fetch(url, {
        method: 'POST',
        headers: jsonHeaders(),
        body: JSON.stringify(payload),
      });
      if (!resp.ok) throw new Error(resp.status);
      return resp.json(); // { records: [...] }
    },
    async patch(id, fields) {
      const payload = { records: [{ id, fields }] };
      const resp = await fetch(url, {
        method: 'PATCH',
        headers: jsonHeaders(),
        body: JSON.stringify(payload),
      });
      if (!resp.ok) throw new Error(resp.status);
      return resp.json(); // { records: [...] }
    },
    async remove(id) {
      const resp = await fetch(`${url}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: token },
      });
      if (!resp.ok) throw new Error(resp.status);
      return resp.json();
    },
    // passing parameters from the component
    bindEncodeUrl(params) {
      this.encodeUrl = makeEncodeUrl({ url: this.url, ...params });
      return this.encodeUrl;
    },
  };

  return ctx;
}
