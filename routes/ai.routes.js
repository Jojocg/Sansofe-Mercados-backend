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
    let availableMarkets = [];

    // Si se especifica un mercado concreto
    if (marketId) {
      const market = await Market.findById(marketId).populate('town');
      if (!market) {
        return res.json({ response: "Lo siento, no puedo encontrar información sobre ese mercado específico en nuestra base de datos." });
      }
      contextData = `
        Información del mercado: ${market.name} ubicado en ${market.location}, ${market.town.name}. 
        Horario: ${market.schedule.map(s => `${s.days.join(', ')} de ${s.hours}`).join(' y ')}. 
        Descripción completa: ${market.description}
      `;
      availableMarkets = [market.name];
    }
    // Si se especifica un municipio
    else if (townId) {
      const markets = await Market.find({ town: townId }).populate('town');
      if (markets.length === 0) {
        return res.json({ response: "Lo siento, no tenemos información sobre mercados en ese municipio en nuestra base de datos." });
      }
      contextData = `
        Mercados en el municipio de ${markets[0]?.town.name || 'este municipio'}:
        ${markets.map(m => `- ${m.name}: ${m.description} Ubicado en ${m.location}.`).join('\n')}
      `;
      availableMarkets = markets.map(m => m.name);
    }
    // Si necesitamos información general de todos los mercados
    else {
      // Buscar si la consulta es sobre características específicas
      const isSpecificQuery = /parque|gastronom|cultur|music|niñ|ocio|event|organ|eco/i.test(query);

      // Obtener todos los mercados para cualquier consulta
      const allMarkets = await Market.find().populate('town');

      if (allMarkets.length === 0) {
        return res.json({ response: "Lo siento, no tenemos información sobre mercados en nuestra base de datos en este momento." });
      }

      availableMarkets = allMarkets.map(m => m.name);

      allMarketsData = `
        Datos completos de todos los mercados disponibles en la base de datos:
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

    // Crear prompt para Gemini con instrucciones claras sobre limitaciones
    const prompt = `
    Eres un asistente especializado en mercados locales de Gran Canaria.

    IMPORTANTE: SOLO proporciona información que esté explícitamente mencionada en los datos a continuación. NO inventes información que no esté directamente en estos datos.

    ${contextData}

    ${allMarketsData ? `Datos completos para análisis:\n${allMarketsData}` : ''}

    MERCADOS DISPONIBLES EN LA BASE DE DATOS: ${availableMarkets.join(', ')}

    Responde a la siguiente consulta de manera amigable e informativa, usando ÚNICAMENTE la información proporcionada arriba: ${query}

    Para cada mercado que menciones, incluye SIEMPRE:
    1. Nombre del mercado
    2. Ubicación exacta
    3. Horario de apertura
    4. Una breve descripción de lo más relevante según la consulta
    5. Si está mencionado en los datos, destaca brevemente qué hace especial o único a este mercado (su atractivo principal, producto destacado o experiencia distintiva)

    Organiza la información de manera clara y fácil de leer. Si hay varios mercados que coinciden con la consulta, preséntales en formato de lista.

    Si la consulta es sobre un mercado que NO está en la lista de MERCADOS DISPONIBLES, indica claramente que no tienes información sobre ese mercado en particular.

    Si no hay suficiente información en los datos proporcionados, responde: "Lo siento, no tengo esa información específica en mi base de datos."
    `;

    /* console.log('Prompt enviado a Gemini:', prompt); */ // Log para depuración

    // Llamar a Gemini API
    const result = await model.generateContent(prompt);
    const response = result.response.text();

    /* console.log('Respuesta de Gemini:', response); */ // Log para depuración

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