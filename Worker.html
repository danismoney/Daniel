export default {
async fetch(request) {
const cors = {
‘Access-Control-Allow-Origin’: ‘*’,
‘Access-Control-Allow-Methods’: ‘POST, GET, OPTIONS’,
‘Access-Control-Allow-Headers’: ’*’,
};

```
if (request.method === 'OPTIONS') {
  return new Response(null, { headers: cors });
}

const url = new URL(request.url);
const json = (data, status=200) => new Response(JSON.stringify(data), {
  status, headers: { ...cors, 'Content-Type': 'application/json' }
});

// ── GET /price?ticker=AAPL ──────────────────────────────
if (request.method === 'GET' && url.searchParams.get('ticker')) {
  const ticker = url.searchParams.get('ticker').toUpperCase();
  try {
    const r = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=1d`,
      { headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'application/json' } }
    );
    if (!r.ok) return json({ error: 'yahoo ' + r.status }, 502);
    const d = await r.json();
    const m = d?.chart?.result?.[0]?.meta;
    if (!m?.regularMarketPrice) return json({ error: 'no data' }, 404);

    const price = m.regularMarketPrice;
    const prev  = m.chartPreviousClose || m.previousClose || price;

    const out = {
      price,
      change:       ((price - prev) / prev) * 100,
      state:        m.marketState || 'REGULAR',
      // pre-market
      prePrice:     m.preMarketPrice    || null,
      preChangePct: m.preMarketPrice    ? ((m.preMarketPrice    - price) / price) * 100 : null,
      // post-market
      postPrice:    m.postMarketPrice   || null,
      postChangePct:m.postMarketPrice   ? ((m.postMarketPrice   - price) / price) * 100 : null,
    };
    // active extended label
    if (out.state === 'PRE' && out.prePrice) {
      out.extPrice = out.prePrice; out.extChange = out.preChangePct; out.extLabel = 'פרה';
    } else if ((out.state === 'POST' || out.state === 'CLOSED') && out.postPrice) {
      out.extPrice = out.postPrice; out.extChange = out.postChangePct; out.extLabel = 'אפטר';
    }
    return json(out);
  } catch (e) { return json({ error: e.message }, 500); }
}

// ── GET /news?ticker=AAPL ───────────────────────────────
if (request.method === 'GET' && url.searchParams.get('news')) {
  const ticker = url.searchParams.get('news').toUpperCase();
  try {
    const r = await fetch(
      `https://query1.finance.yahoo.com/v1/finance/search?q=${ticker}&newsCount=8&quotesCount=0`,
      { headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'application/json' } }
    );
    if (!r.ok) return json({ news: [] });
    const d = await r.json();
    const items = (d.news || []).slice(0, 8).map(n => ({
      title:     n.title,
      publisher: n.publisher,
      link:      n.link,
      time:      n.providerPublishTime,
    }));
    return json({ news: items });
  } catch (e) { return json({ news: [] }); }
}

// ── POST / → Anthropic AI ──────────────────────────────
if (request.method === 'POST') {
  try {
    const body   = await request.json();
    const apiKey = request.headers.get('x-api-key');
    if (!apiKey || !apiKey.startsWith('sk-ant'))
      return json({ error: { message: 'Invalid API key' } }, 401);

    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type':    'application/json',
        'x-api-key':       apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(body),
    });
    const data = await r.json();
    return json(data, r.status);
  } catch (e) { return json({ error: { message: e.message } }, 500); }
}

return new Response('Dani Money Worker v2', { headers: cors });
```

}
};
