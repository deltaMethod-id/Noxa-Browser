module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  const { q, type } = req.query;
  if (!q) return res.status(400).json({ error: 'Parameter query "q" wajib diisi.' });
  const EXA_API_KEY = process.env.EXA_API_KEY;
  if (!EXA_API_KEY) return res.status(500).json({ error: 'EXA_API_KEY belum dikonfigurasi di environment variables.' });
  try {
    if (type === 'image') return res.status(200).json({ results: [] });
    const exaResponse = await fetch('https://api.exa.ai/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': EXA_API_KEY },
      body: JSON.stringify({ query: q, type: 'auto', numResults: 10, contents: { text: { maxCharacters: 250 } } })
    });
    if (!exaResponse.ok) return res.status(exaResponse.status).json({ error: `Exa API Error: ${await exaResponse.text()}` });
    const data = await exaResponse.json();
    return res.status(200).json({ web: { results: (data.results || []).map(item => ({ title: item.title || 'Tanpa Judul', url: item.url, description: item.text || item.highlights || 'Tidak ada deskripsi tersedia.' })) } });
  } catch (error) {
    return res.status(500).json({ error: `Terjadi kesalahan internal: ${error.message}` });
  }
};
