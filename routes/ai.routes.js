const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Market = require('../models/Market.model');
const Town = require('../models/Town.model');

// Configurar Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Cache simple
const responseCache = new Map();

// Endpoint para el asistente virtual
router.post('/assistant', async (req, res) => {
  try {
    const { query, marketId, townId } = req.body;
    
    // Verificar si tenemos la respuesta en caché
    const cacheKey = `${query}-${marketId || ''}-${townId || ''}`;
    if (responseCache.has(cacheKey)) {
      return res.json({ response: responseCache.get(cacheKey) });
    }
    
    // Obtener datos relevantes de la base de datos
    let contextData = '';
    let allMarketsData = '';
    
    // Si se especifica un mercado concreto
    if (marketId) {
      const market = await Market.findById(marketId).populate('town');
      contextData = `
        Información del mercado: ${market.name} ubicado en ${market.location}, ${market.town.name}. 
        Horario: ${market.schedule.map(s => `${s.days.join(', ')} de ${s.hours}`).join(' y ')}. 
        Descripción completa: ${market.description}
      `;
    } 
    // Si se especifica un municipio
    else if (townId) {
      const markets = await Market.find({ town: townId }).populate('town');
      contextData = `
        Mercados en el municipio de ${markets[0]?.town.name || 'este municipio'}:
        ${markets.map(m => `- ${m.name}: ${m.description} Ubicado en ${m.location}.`).join('\n')}
      `;
    } 
    // Si necesitamos información general de todos los mercados
    else {
      // Buscar si la consulta es sobre características específicas
      const isSpecificQuery = /parque|gastronom|cultur|music|niñ|ocio|event/i.test(query);
      
      if (isSpecificQuery) {
        const allMarkets = await Market.find().populate('town');
        allMarketsData = `
          Datos completos de todos los mercados para analizar:
          ${allMarkets.map(m => 
            `MERCADO: ${m.name}
             MUNICIPIO: ${m.town.name}
             UBICACIÓN: ${m.location}
             HORARIO: ${m.schedule.map(s => `${s.days.join(', ')} de ${s.hours}`).join(' y ')}
             DESCRIPCIÓN COMPLETA: ${m.description}
             ---`
          ).join('\n')}
        `;
      }
    }
    
    // Crear prompt para Gemini
    const prompt = `
    Eres un asistente especializado en mercados locales de Gran Canaria.
    
    ${contextData}
    
    ${allMarketsData ? 
      `La consulta del usuario parece buscar características específicas en los mercados. 
      Analiza cuidadosamente las descripciones de todos los mercados para identificar los que 
      coinciden con la consulta. Presta especial atención a menciones de parques infantiles, 
      oferta gastronómica, actividades culturales, música y otros servicios especiales.
      
      Datos completos para análisis:
      ${allMarketsData}` 
      : ''}
    
    Responde a la siguiente consulta de manera informativa y amigable: ${query}
    
    Si la consulta es sobre características específicas (como parques infantiles, oferta gastronómica, 
    actividades culturales, etc.), revisa las descripciones para encontrar los mercados que las ofrecen
    y recomienda los más adecuados, mencionando esas características específicas.
    `;
    
    // Llamar a Gemini API
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    // Guardar en caché (solo respuestas menores a cierto tamaño para no saturar memoria)
    if (response.length < 5000) {
      responseCache.set(cacheKey, response);
    }
    
    res.json({ response });
  } catch (error) {
    console.error('Error al procesar consulta con Gemini:', error);
    res.status(500).json({ error: 'Error al procesar la consulta' });
  }
});

module.exports = router;