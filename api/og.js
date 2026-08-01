// Vercel Serverless Function - Preview dinamica por noticia
// URL: grupoandreiamendes.com.br/api/og?id=ID_DA_NOTICIA

const SUPABASE_URL = "https://lmmtnhuvmttmzddasahy.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxtbXRuaHV2bXR0bXpkZGFzYWh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUxODExMjcsImV4cCI6MjEwMDc1NzEyN30.b2Ry1qgQLNaT2oUlOjOiOH7293V7Ur7rBsaxlucbSjQ";
const SITE_URL = "https://grupoandreiamendes.com.br";
const DEFAULT_IMG = "https://lmmtnhuvmttmzddasahy.supabase.co/storage/v1/object/public/noticias/capa-1785202430213.jpg";

export default async function handler(req, res) {
  const { id } = req.query;

  let titulo = "Grupo de Dança Andreia Mendes";
  let descricao = "+28 anos formando artistas em Timbó, SC. Campeões mundiais de Hip Hop.";
  let imagem = DEFAULT_IMG;
  let url = SITE_URL;

  if (id) {
    try {
      const r = await fetch(
        `${SUPABASE_URL}/rest/v1/noticias?id=eq.${id}&publicado=eq.true&select=titulo,subtitulo,imagem_url`,
        { headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` } }
      );
      const data = await r.json();
      if (data && data[0]) {
        titulo = data[0].titulo + " — Grupo AM";
        descricao = data[0].subtitulo || descricao;
        imagem = data[0].imagem_url || DEFAULT_IMG;
        url = `${SITE_URL}?noticia=${id}`;
      }
    } catch(e) {
      console.error("Erro ao buscar noticia:", e);
    }
  }

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta property="og:type" content="article">
  <meta property="og:url" content="${url}">
  <meta property="og:title" content="${titulo}">
  <meta property="og:description" content="${descricao}">
  <meta property="og:image" content="${imagem}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:site_name" content="Grupo AM">
  <meta property="og:locale" content="pt_BR">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${titulo}">
  <meta name="twitter:description" content="${descricao}">
  <meta name="twitter:image" content="${imagem}">
  <meta itemprop="name" content="${titulo}">
  <meta itemprop="description" content="${descricao}">
  <meta itemprop="image" content="${imagem}">
  <script>window.location.href = "${url}";</script>
</head>
<body>
  <p>Redirecionando... <a href="${url}">Clique aqui</a></p>
</body>
</html>`;

  res.setHeader("Content-Type", "text/html");
  res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");
  res.status(200).send(html);
}
