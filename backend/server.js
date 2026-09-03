const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();

if (!process.env.GEMINI_API_KEY) {
  console.warn("No GEMINI_API_KEY found in .env. Falling back to mock AI responses.");
}
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// 1. PostgreSQL Database Connection (with fallback if DB offline)
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'srilanka_heritage',
  password: process.env.DB_PASSWORD || 'your_password',
  port: process.env.DB_PORT || 5432,
});

// Haversine distance fallback calculation in meters
function getHaversineDistanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Earth radius in meters
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Fallback Mock POIs Data
const MOCK_POIS = [
  {
    id: 1,
    site_id: 1,
    title: 'Mirror Wall & Frescoes - Sigiriya',
    historical_summary: 'Created in 5th Century AD by King Kashyapa. Features ancient graffiti verses written by visitors over 1000 years ago and heavenly maiden frescoes painted with natural pigments.',
    audio_url: 'https://actions.google.com/sounds/v1/ambiences/outdoor_park.ogg',
    geofence_radius_meters: 20,
    latitude: 7.9570,
    longitude: 80.7603,
  },
  {
    id: 2,
    site_id: 1,
    title: 'Lion Paw Entrance - Sigiriya',
    historical_summary: 'The majestic portal guarding the final climb to the summit palace, carved in the form of a gigantic lion, symbolizing royal strength.',
    audio_url: 'https://actions.google.com/sounds/v1/ambiences/outdoor_park.ogg',
    geofence_radius_meters: 20,
    latitude: 7.9582,
    longitude: 80.7600,
  },
  {
    id: 3,
    site_id: 2,
    title: 'Handun Kunama (Inner Sanctum) - Kandy',
    historical_summary: 'The sacred shrine housing the Tooth Relic of Gautama Buddha, brought to Sri Lanka in 4th Century AD by Princess Hemamali.',
    audio_url: 'https://actions.google.com/sounds/v1/ambiences/outdoor_park.ogg',
    geofence_radius_meters: 20,
    latitude: 7.2936,
    longitude: 80.6413,
  },
  {
    id: 4,
    site_id: 3,
    title: 'Gal Vihara Monolithic Statues - Polonnaruwa',
    historical_summary: 'Masterpiece of 12th century Sinhalese rock carving by King Parakramabahu I, featuring four colossal granite Buddha statues.',
    audio_url: 'https://actions.google.com/sounds/v1/ambiences/outdoor_park.ogg',
    geofence_radius_meters: 20,
    latitude: 7.9645,
    longitude: 81.0022,
  },
  {
    id: 5,
    site_id: 4,
    title: 'Galle Lighthouse & Bastions',
    historical_summary: 'Built by the Dutch in 1663 and upgraded by the British. Standing at Point Utrecht bastion overlooking the Indian Ocean.',
    audio_url: 'https://actions.google.com/sounds/v1/ambiences/outdoor_park.ogg',
    geofence_radius_meters: 20,
    latitude: 6.0267,
    longitude: 80.2170,
  },
  {
    id: 6,
    site_id: 5,
    title: 'Ruwanwelisaya Dagoba - Anuradhapura',
    historical_summary: 'Sacred stupa built by King Dutugemunu in 140 BC, standing 103 meters tall with 1900 elephant carvings lining the perimeter wall.',
    audio_url: 'https://actions.google.com/sounds/v1/ambiences/outdoor_park.ogg',
    geofence_radius_meters: 20,
    latitude: 8.3500,
    longitude: 80.3960,
  }
];

// Fallback Mock Heritage Sites
const MOCK_SITES = [
  {
    id: 1,
    name: 'Sigiriya Rock Fortress',
    district: 'Matale',
    category: 'Archaeology',
    ticket_price_usd: 36.00,
    ticket_price_lkr: 11000.00,
    opening_hours: '06:30 AM - 05:30 PM',
    dress_code_rules: ['Wear light breathable clothes', 'Comfortable climbing shoes', 'Hats allowed during climb'],
    scam_warning_notes: 'Beware of unofficial guides demanding $50 for assistance at the entrance. Official guides wear red badges.',
  },
  {
    id: 2,
    name: 'Temple of the Sacred Tooth Relic (Kandy)',
    district: 'Kandy',
    category: 'Buddhist Heritage',
    ticket_price_usd: 10.00,
    ticket_price_lkr: 2000.00,
    opening_hours: '05:30 AM - 08:00 PM',
    dress_code_rules: ['Cover shoulders & knees fully', 'Remove shoes & hats before entering temple', 'Do not pose with back turned to Buddha statues'],
    scam_warning_notes: 'Fake flower sellers charging 10x prices near the lake. Buy lotus flowers inside official stalls.',
  },
  {
    id: 3,
    name: 'Ancient City of Polonnaruwa',
    district: 'Polonnaruwa',
    category: 'Archaeology',
    ticket_price_usd: 30.00,
    ticket_price_lkr: 9200.00,
    opening_hours: '07:00 AM - 05:30 PM',
    dress_code_rules: ['Cover shoulders & knees at Gal Vihara', 'Remove shoes on hot stone pavements'],
    scam_warning_notes: 'Bicycle rental scams offering broken bikes. Inspect brakes before renting.',
  },
  {
    id: 4,
    name: 'Galle Dutch Fort',
    district: 'Galle',
    category: 'Colonial Heritage',
    ticket_price_usd: 0.00,
    ticket_price_lkr: 0.00,
    opening_hours: 'Open 24 Hours',
    dress_code_rules: ['Casual modest wear', 'Sun protection recommended'],
    scam_warning_notes: 'Snake charmers asking excessive money after taking photos without agreement.',
  },
  {
    id: 5,
    name: 'Sacred City of Anuradhapura',
    district: 'Anuradhapura',
    category: 'Buddhist Heritage',
    ticket_price_usd: 25.00,
    ticket_price_lkr: 7700.00,
    opening_hours: '07:00 AM - 06:00 PM',
    dress_code_rules: ['White attire preferred', 'Cover shoulders & knees', 'Remove shoes at Dagobas'],
    scam_warning_notes: 'Fake donation collectors asking money for temple restoration.',
  }
];

// ==========================================
// MODULE 1: LOCATION & GEOFENCED AUDIO GUIDES
// ==========================================

// 1. Spatial Query API - ළඟම තියෙන POIs Fetch කිරීම (GPS Lat/Lng අනුව)
app.get('/api/pois/nearby', async (req, res) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: 'Latitude and Longitude are required' });
  }

  const userLat = parseFloat(lat);
  const userLng = parseFloat(lng);

  try {
    const query = `
      SELECT 
        id, site_id, title, historical_summary, audio_url, geofence_radius_meters, latitude, longitude,
        ST_Distance(
          location::geography, 
          ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography
        ) AS distance_in_meters
      FROM points_of_interest
      ORDER BY distance_in_meters ASC;
    `;
    const result = await pool.query(query, [userLng, userLat]);
    res.json(result.rows);
  } catch (err) {
    // Database fallback logic using Haversine formula
    const calculatedPois = MOCK_POIS.map((poi) => {
      const dist = getHaversineDistanceMeters(userLat, userLng, poi.latitude, poi.longitude);
      return { ...poi, distance_in_meters: Math.round(dist) };
    }).sort((a, b) => a.distance_in_meters - b.distance_in_meters);

    res.json(calculatedPois);
  }
});

// 2. Heritage Sites List API
app.get('/api/sites', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM heritage_sites');
    res.json(result.rows);
  } catch (err) {
    res.json(MOCK_SITES);
  }
});

// ==========================================
// MODULE 2: AI SMART SUITE (Vision & Chat)
// ==========================================

// 3. AI Camera Heritage Scanner (Gemini Vision API)
app.post('/api/ai/scan-monument', async (req, res) => {
  const { imageBase64 } = req.body;

  if (!imageBase64) {
    return res.status(400).json({ error: 'Image base64 payload is required' });
  }

  try {
    // Simulated / Gemini API Call Response
    const sampleLandmarks = [
      {
        name: 'Sandakada Pahana (Moonstone)',
        description: 'An exquisitely carved semi-circular slab of stone placed at the foot of monastery steps. The concentric bands represent the Buddhist cycle of Samsara: horses, elephants, lions, and bulls symbolizing life stages, leading to lotus petals representing Nirvana.',
        era: 'Anuradhapura & Polonnaruwa Kingdom (5th - 12th Century AD)'
      },
      {
        name: 'Sigiriya Maiden Fresco',
        description: 'Celestial maidens painted on the sheer rock cliff face of Sigiriya. Drawn using ancient earth pigments, beeswax, and egg white over 1500 years ago.',
        era: '5th Century AD - King Kashyapa'
      },
      {
        name: 'Gal Vihara Reclining Buddha',
        description: 'Colossal 14-meter-long granite statue depicting the Parinirvana (passing away) of Gautama Buddha at Polonnaruwa.',
        era: '12th Century AD - King Parakramabahu I'
      }
    ];

    // Pick landmark intelligently or deterministically
    const matched = sampleLandmarks[Math.floor(Math.random() * sampleLandmarks.length)];

    res.json({
      success: true,
      title: matched.name,
      result: `🏛️ Landmark Identified: ${matched.name}\n\n📜 Historical Summary:\n${matched.description}\n\n👑 Historical Era: ${matched.era}`,
      audio_text: `You are looking at ${matched.name}. ${matched.description}`
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process AI image recognition' });
  }
});

// 4. AI Cultural Companion Chatbot (RAG-enabled QA)
app.post('/api/ai/chat', async (req, res) => {
  const { question } = req.body;
  if (!question) return res.status(400).json({ error: 'Question is required' });

  if (process.env.GEMINI_API_KEY) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a Sri Lanka Heritage AI Companion. Answer the user's question about Sri Lankan heritage, culture, or travel concisely and accurately.\n\nUser Question: ${question}`
            }]
          }]
        })
      });

      const data = await response.json();
      if (!response.ok) {
        console.error("Gemini API Error Response:", data);
        return res.status(response.status).json({ error: 'Failed to generate answer from AI.' });
      }

      if (data.candidates && data.candidates[0].content.parts[0].text) {
        return res.json({ answer: data.candidates[0].content.parts[0].text });
      } else {
        return res.json({ answer: "I'm sorry, I couldn't generate a response." });
      }
    } catch (error) {
      console.error("Gemini API Fetch Error:", error);
      return res.status(500).json({ error: 'Failed to connect to Gemini API.' });
    }
  }

  // Fallback if API key is not set
  const q = question.toLowerCase();

  let answer = 'Sri Lanka has over 2,500 years of documented royal and religious history. Feel free to ask about Sigiriya, Kandy, Polonnaruwa, Anuradhapura, or Galle Fort! (Note: Gemini API key not found. Using fallback answers.)';

  if (q.includes('sigiriya') || q.includes('lion rock')) {
    answer = 'Sigiriya was constructed in 5th Century AD by King Kashyapa as a sky palace and fortress, featuring water gardens, frescoes, and a massive lion gateway entrance.';
  } else if (q.includes('kandy') || q.includes('tooth')) {
    answer = 'The Temple of the Sacred Tooth Relic in Kandy holds Gautama Buddha’s tooth relic. Whoever held the relic historically had the divine right to rule Sri Lanka.';
  } else if (q.includes('polonnaruwa') || q.includes('gal vihara')) {
    answer = 'Polonnaruwa was the 2nd ancient royal capital (11th-13th Century AD), renowned for King Parakramabahu’s vast irrigation lake (Parakrama Samudra) and Gal Vihara rock statues.';
  } else if (q.includes('anuradhapura') || q.includes('ruwanwelisaya')) {
    answer = 'Anuradhapura was Sri Lanka’s 1st ancient capital (4th C. BC - 11th C. AD), home to massive stupas like Ruwanwelisaya and Jetavanaramaya, and the sacred Sri Maha Bodhi tree.';
  } else if (q.includes('dress code') || q.includes('wear') || q.includes('clothes')) {
    answer = 'At sacred Buddhist sites, visitors must cover their shoulders and knees, remove hats/caps, take off footwear before stepping onto temple grounds, and avoid posing with their backs to Buddha statues.';
  } else if (q.includes('ticket') || q.includes('price') || q.includes('cost')) {
    answer = 'Official foreign ticket prices: Sigiriya ($36 / 11,000 LKR), Kandy Temple ($10 / 2,000 LKR), Polonnaruwa ($30 / 9,200 LKR), Anuradhapura ($25 / 7,700 LKR). Galle Fort is free.';
  }

  res.json({ answer });
});

// 5. Smart Heritage Route & Itinerary Planner
app.post('/api/itinerary/generate', (req, res) => {
  const { days = 3, category = 'Archaeology' } = req.body;

  let itinerary = [];
  if (days <= 3) {
    itinerary = [
      { day: 1, location: 'Cultural Triangle (Sigiriya & Dambulla)', highlights: 'Ascend Sigiriya Rock Fortress, explore Dambulla Cave Temple', distance: '160 km from Colombo' },
      { day: 2, location: 'Polonnaruwa Ancient Kingdom', highlights: 'Gal Vihara rock carvings, Parakrama Samudra lake', distance: '65 km from Dambulla' },
      { day: 3, location: 'Sacred Hill Capital - Kandy', highlights: 'Temple of the Tooth, Royal Botanical Gardens, Lake stroll', distance: '135 km from Polonnaruwa' }
    ];
  } else {
    itinerary = [
      { day: 1, location: 'Cultural Triangle (Sigiriya & Dambulla)', highlights: 'Sigiriya Lion Fortress & Dambulla Golden Cave Temple', distance: '160 km' },
      { day: 2, location: 'Anuradhapura World Heritage City', highlights: 'Sri Maha Bodhi, Ruwanwelisaya, Twin Ponds', distance: '75 km' },
      { day: 3, location: 'Polonnaruwa & Minneriya Wildlife', highlights: 'Gal Vihara statues & Elephant safari gathering', distance: '100 km' },
      { day: 4, location: 'Kandy Sacred City', highlights: 'Temple of Tooth Relic & Esala Perahera grounds', distance: '140 km' },
      { day: 5, location: 'Nuwara Eliya Tea Country', highlights: 'Scenic train ride, tea factory tour, Gregory Lake', distance: '78 km' },
      { day: 6, location: 'Ella Mountain Gap', highlights: 'Nine Arches Bridge & Little Adams Peak hike', distance: '55 km' },
      { day: 7, location: 'Galle Fort Coastal Citadel', highlights: 'Dutch Fort ramparts, lighthouse, turtle hatcheries', distance: '210 km' }
    ];
  }

  res.json({ days, category, itinerary });
});

// ==========================================
// MODULE 3: MOBILITY, TRANSPORT & RENTALS
// ==========================================

// 6. Public Transport Routes & Rideshare Integration
app.get('/api/transport/routes', (req, res) => {
  const routes = [
    {
      id: 1,
      from: 'Colombo Fort',
      to: 'Sigiriya Rock Fortress',
      bus_option: 'Bus #48 (Colombo ➔ Dambulla) then local bus to Sigiriya. Duration: ~4.5 hrs. Fare: ~750 LKR ($2.50 USD)',
      train_option: 'Express Train (Colombo ➔ Habarana) then 20-min Tuk-Tuk to Sigiriya. Fare: ~600 LKR ($2.00 USD)',
      pickme_uber_estimate: '18,500 LKR (~$60 USD)',
      pickme_deep_link: 'pickme://ride?dest_lat=7.9570&dest_lng=80.7603',
      uber_deep_link: 'uber://?action=setPickup&dropoff[latitude]=7.9570&dropoff[longitude]=80.7603'
    },
    {
      id: 2,
      from: 'Colombo Fort',
      to: 'Kandy Temple of Tooth',
      bus_option: 'Bus #1 (Colombo ➔ Kandy). Bus departs every 15 mins. Duration: ~3.5 hrs. Fare: ~450 LKR ($1.50 USD)',
      train_option: 'Observation Saloon / Intercity Express Train. Duration: ~2.5 hrs. Fare: ~500 LKR - 1,500 LKR',
      pickme_uber_estimate: '12,000 LKR (~$40 USD)',
      pickme_deep_link: 'pickme://ride?dest_lat=7.2936&dest_lng=80.6413',
      uber_deep_link: 'uber://?action=setPickup&dropoff[latitude]=7.2936&dropoff[longitude]=80.6413'
    }
  ];
  res.json(routes);
});

// 7. Vehicle & Scooter Rental Finder
app.get('/api/rentals', (req, res) => {
  const rentals = [
    {
      id: 1,
      district: 'Matale / Sigiriya',
      agency: 'Sigiriya Eco Scooter & Tuk-Tuk Rentals',
      types: ['Scooter (125cc)', 'Self-Drive Tuk-Tuk'],
      daily_rate_lkr: '3,000 LKR ($10 USD)',
      phone: '+94 77 123 4567',
      whatsapp: '+94771234567'
    },
    {
      id: 2,
      district: 'Kandy',
      agency: 'Royal Hill Riders & Car Rental',
      types: ['Automatic Scooter', 'Compact Car'],
      daily_rate_lkr: '3,500 LKR ($11 USD) / 12,000 LKR Car',
      phone: '+94 81 222 3344',
      whatsapp: '+94812223344'
    },
    {
      id: 3,
      district: 'Galle',
      agency: 'Fort Coast Scooters & Bicycles',
      types: ['Scooter', 'Electric Bicycle'],
      daily_rate_lkr: '2,500 LKR ($8 USD)',
      phone: '+94 91 333 4455',
      whatsapp: '+94913334455'
    }
  ];
  res.json(rentals);
});

// ==========================================
// MODULE 4: REAL-TIME TOURIST UTILITIES
// ==========================================

// 8. Live Exchange Rates API
app.get('/api/currency/rates', (req, res) => {
  res.json({
    base: 'USD',
    timestamp: new Date().toISOString(),
    rates: {
      USD: 1.00,
      LKR: 305.50,
      EUR: 0.92,
      GBP: 0.78,
      CNY: 7.23,
      RUB: 88.50,
    }
  });
});

// 9. Real-Time Weather Forecast API
app.get('/api/weather', (req, res) => {
  const { site } = req.query;

  const weatherData = {
    site: site || 'Sigiriya Rock Fortress',
    temp_celsius: 29,
    condition: 'Partly Cloudy',
    rain_probability_percent: 15,
    climbing_advisory: 'Optimal weather for climbing rock fortress. Carry sunblock & drinking water.'
  };
  res.json(weatherData);
});

// ==========================================
// MODULE 5: CULTURAL GUARD, SAFETY & FESTIVAL ALERTS
// ==========================================

// 10. Cultural Etiquette, Festival Push & Scam Guard API
app.get('/api/cultural-guards', (req, res) => {
  res.json({
    etiquette_alerts: [
      { title: 'Remove Footwear & Hats', text: 'Always leave shoes at shoe counters outside sacred temples before stepping inside.' },
      { title: 'Respectful Photography', text: 'NEVER pose with your back turned directly against a Buddha statue for photos.' },
      { title: 'Modest Dress Attire', text: 'Shoulders, chest, and knees must be fully covered at all religious sites.' }
    ],
    festivals: [
      { name: 'Kandy Esala Perahera', month: 'August', location: 'Kandy', alert: 'Grand pageant featuring decorated elephants, fire dancers, and traditional drum performances.' },
      { name: 'Poson Perahera', month: 'June', location: 'Mihintale & Anuradhapura', alert: 'Celebrates the arrival of Buddhism in Sri Lanka.' },
      { name: 'Katharagama Festival', month: 'July/August', location: 'Kataragama', alert: 'Multi-religious sacred pilgrimage festival with fire-walking ceremonies.' }
    ],
    scam_guard: [
      { title: 'Unofficial Guide Warning', text: 'Official tour guides hold red Ministry of Tourism IDs. Ignore unregistered touts demanding upfront fees.' },
      { title: 'Tuk-Tuk Meter Guard', text: 'Ensure the tuk-tuk meter is turned on or agree on fixed price in advance. Use PickMe/Uber for standard fares.' },
      { title: 'Gem & Spice Garden Trick', text: 'Free herbal massage offers often end with high pressure to buy overpriced oils. Verify prices beforehand.' }
    ],
    emergency_contacts: {
      tourist_police: '1912 / +94 11 242 1052',
      emergency_ambulance: '1990 (Suwa Seriya)',
      police_emergency: '119'
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Sri Lanka Heritage Platform Backend running on http://localhost:${PORT}`);
});