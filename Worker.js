export default {
async fetch(request) {
if (request.method === ‘OPTIONS’) {
return new Response(null, {
headers: {
‘Access-Control-Allow-Origin’: ‘*’,
‘Access-Control-Allow-Methods’: ‘POST, OPTIONS’,
‘Access-Control-Allow-Headers’: ‘Content-Type, x-api-key, anthropic-version’,
}
});
}
try {
const body = await request.json();
const apiKey = request.headers.get(‘x-api-key’);
if (!apiKey || !apiKey.startsWith(‘sk-ant’)) {
return new Response(JSON.stringify({error:{message:‘Invalid API key’}}), {
status: 401,
headers: {‘Content-Type’:‘application/json’,‘Access-Control-Allow-Origin’:’*’}
});
}
const response = await fetch(‘https://api.anthropic.com/v1/messages’, {
method: ‘POST’,
headers: {
‘Content-Type’: ‘application/json’,
‘x-api-key’: apiKey,
‘anthropic-version’: ‘2023-06-01’,
},
body: JSON.stringify(body),
});
const data = await response.json();
return new Response(JSON.stringify(data), {
status: response.status,
headers: {
‘Content-Type’: ‘application/json’,
‘Access-Control-Allow-Origin’: ‘*’,
}
});
} catch (err) {
return new Response(JSON.stringify({error:{message:err.message}}), {
status: 500,
headers: {‘Content-Type’:‘application/json’,‘Access-Control-Allow-Origin’:’*’}
});
}
}
};
