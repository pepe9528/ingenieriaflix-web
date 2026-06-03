export default async function handler(req, res) {
  // 1. Permitir que cualquier página web consulte este puente (Evitar CORS)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 2. Obtener el tema que envió el usuario (por defecto: technology)
  const { tema } = req.query;
  const queryTema = tema || 'technology';
  
  const API_KEY = "966f7eba813e474fbf6f34e5815638ae";
  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(queryTema)}&language=es&sortBy=publishedAt&pageSize=12&apiKey=${API_KEY}`;

  try {
    // 3. El servidor de Vercel hace la petición (A él NewsAPI no lo bloquea)
    const response = await fetch(url);
    const data = await response.json();
    
    // 4. Le devolvemos los datos limpios a tu HTML
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error al conectar con NewsAPI' });
  }
}