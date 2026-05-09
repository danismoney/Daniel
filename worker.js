const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, x-api-key, anthropic-version',
};

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS });
    }

    const url = new URL(request.url);

    if (request.method === 'POST') {
      try {
        const body = await request.json();
        const apiKey = request.headers.get('x-api-key') || body.api_key || '';
        if (!apiKey) return json({ error: 'Missing API key' }, 400);
        const r = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': request.headers.get('anthropic-version') || '2023-06-01',
          },
          body: JSON.stringify({
            model:      body.model      || 'claude-haiku-4-5-20251001',
            max_tokens: body.max_tokens || 700,
            messages:   body.messages   || [],
          }),
        });
        const data = await r.json();
        return json(data, r.status);
      } catch (e) {
        return json({ error: e.message }, 500);
      }
    }

    const news = url.searchParams.get('news');
    if (news) {
      try {
        const r = await fetch(
          `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(news)}&newsCount=15&quotesCount=0`,
          { headers: { 'User-Agent': 'Mozilla/5.0' } }
        );
        const d = await r.json();
        const items = (d.news || []).map(n => ({
          title: n.title, link: n.link, publisher: n.publisher, time: n.providerPublishTime,
        }));
        return json({ news: items });
      } catch (e) {
        return json({ news: [] });
      }
    }

    const ticker = url.searchParams.get('ticker');
    if (ticker) {
      try {
        const r = await fetch(
          `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=1d&range=1d`,
          { headers: { 'User-Agent': 'Mozilla/5.0' } }
        );
        const d = await r.json();
        const meta = d?.chart?.result?.[0]?.meta;
        if (!meta) return json({ error: 'No data' }, 404);
        const price = meta.regularMarketPrice;
        const prevClose = meta.chartPreviousClose || meta.previousClose;
        const changeAbs = price - prevClose;
        const changePct = (changeAbs / prevClose) * 100;
        return json({
          ticker, price,
          change: changePct, changeAbs,
          open: meta.regularMarketOpen,
          high: meta.regularMarketDayHigh,
          low: meta.regularMarketDayLow,
          prevClose, volume: meta.regularMarketVolume,
          prePrice: meta.preMarketPrice || null,
          preMarketChangePercent: meta.preMarketChangePercent || null,
          postPrice: meta.postMarketPrice || null,
          postMarketChangePercent: meta.postMarketChangePercent || null,
          state: meta.marketState,
        });
      } catch (e) {
        return json({ error: e.message }, 500);
      }
    }

    return json({ status: 'Dani Worker OK' });
  },
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });
}
