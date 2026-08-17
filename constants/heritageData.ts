export interface POI {
  id: number;
  site_id: number;
  title: string;
  historical_summary: string;
  audio_url: string;
  video_url?: string;
  geofence_radius_meters: number;
  latitude: number;
  longitude: number;
}

export interface HeritageSite {
  id: number;
  name: string;
  district: string;
  category: string;
  ticket_price_usd: number;
  ticket_price_lkr: number;
  opening_hours: string;
  dress_code_rules: string[];
  scam_warning_notes: string;
  is_unesco: boolean;
  summary_story: string;
  latitude: number;
  longitude: number;
  google_maps_url: string;
}

export const FALLBACK_HERITAGE_SITES: HeritageSite[] = [
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
    is_unesco: true,
    summary_story: 'Built in the 5th Century AD by King Kashyapa as a sky palace and citadel atop a 200m high granite rock. Features water gardens, mirror wall graffiti, and world-famous maiden frescoes.',
    latitude: 7.9570,
    longitude: 80.7603,
    google_maps_url: 'https://www.google.com/maps/search/?api=1&query=7.9570,80.7603',
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
    is_unesco: true,
    summary_story: 'Houses the sacred dental relic of Gautama Buddha, venerated as the supreme symbol of Sri Lankan sovereignty inside the royal palace complex of Kandy.',
    latitude: 7.2936,
    longitude: 80.6413,
    google_maps_url: 'https://www.google.com/maps/search/?api=1&query=7.2936,80.6413',
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
    is_unesco: true,
    summary_story: 'The majestic 12th-century medieval capital of Sri Lanka built by King Parakramabahu I, featuring colossal rock-cut Buddha statues at Gal Vihara and intricate irrigation lakes.',
    latitude: 7.9645,
    longitude: 81.0022,
    google_maps_url: 'https://www.google.com/maps/search/?api=1&query=7.9645,81.0022',
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
    is_unesco: true,
    summary_story: 'A living European fortified citadel built by the Portuguese in 1588 and fortified by the Dutch in 1663. Features cobblestone streets, Dutch ramparts, and Utrecht bastion lighthouse.',
    latitude: 6.0267,
    longitude: 80.2170,
    google_maps_url: 'https://www.google.com/maps/search/?api=1&query=6.0267,80.2170',
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
    is_unesco: true,
    summary_story: 'The first ancient capital of Sri Lanka (4th Century BC), home to the sacred Jaya Sri Maha Bodhi tree and massive stupas like Ruwanwelisaya and Jetavanaramaya.',
    latitude: 8.3500,
    longitude: 80.3960,
    google_maps_url: 'https://www.google.com/maps/search/?api=1&query=8.3500,80.3960',
  },
  {
    id: 6,
    name: 'Dambulla Golden Cave Temple',
    district: 'Matale',
    category: 'Buddhist Heritage',
    ticket_price_usd: 10.00,
    ticket_price_lkr: 3000.00,
    opening_hours: '07:00 AM - 07:00 PM',
    dress_code_rules: ['Cover shoulders and knees fully', 'Remove footwear before climbing steps'],
    scam_warning_notes: 'Sellers of fake temple entry tickets outside the main gate. Purchase tickets only at the official counter at the bottom of the hill.',
    is_unesco: true,
    summary_story: 'Sri Lanka’s largest and best-preserved cave temple complex dating back to 1st Century BC, containing 5 main sanctuary caves with 153 Buddha statues and ancient murals.',
    latitude: 7.8564,
    longitude: 80.6517,
    google_maps_url: 'https://www.google.com/maps/search/?api=1&query=7.8564,80.6517',
  },
  {
    id: 7,
    name: 'Sinharaja Rain Forest Reserve',
    district: 'Ratnapura',
    category: 'Colonial Heritage',
    ticket_price_usd: 20.00,
    ticket_price_lkr: 6000.00,
    opening_hours: '06:00 AM - 06:00 PM',
    dress_code_rules: ['Leech socks recommended', 'Waterproof hiking shoes', 'Rain jackets'],
    scam_warning_notes: 'Guides demanding payment in advance without registering at the forest entrance office.',
    is_unesco: true,
    summary_story: 'A pristine primary tropical rainforest reserve harboring over 60% of Sri Lanka\'s endemic tree species, rare wildlife, and multi-species bird feeding flocks.',
    latitude: 6.3986,
    longitude: 80.4194,
    google_maps_url: 'https://www.google.com/maps/search/?api=1&query=6.3986,80.4194',
  },
  {
    id: 8,
    name: 'Nallur Kandaswamy Kovil (Jaffna)',
    district: 'Jaffna',
    category: 'Colonial Heritage',
    ticket_price_usd: 0.00,
    ticket_price_lkr: 0.00,
    opening_hours: '04:30 AM - 06:30 PM',
    dress_code_rules: ['Men must remove shirts', 'No short skirts/shorts', 'Remove shoes at entrance'],
    scam_warning_notes: 'Be cautious of private parking lot owners nearby charging high fees when free public parking is available.',
    is_unesco: false,
    summary_story: 'Established in 948 AD, this iconic Hindu temple is the cultural heart of Jaffna, renowned for its golden Gopuram tower and vibrant annual 25-day festival.',
    latitude: 9.6744,
    longitude: 80.0309,
    google_maps_url: 'https://www.google.com/maps/search/?api=1&query=9.6744,80.0309',
  },
  {
    id: 9,
    name: 'Yapahuwa Rock Fortress',
    district: 'Kurunegala',
    category: 'Archaeology',
    ticket_price_usd: 5.00,
    ticket_price_lkr: 1500.00,
    opening_hours: '08:00 AM - 05:00 PM',
    dress_code_rules: ['Modest clothing', 'Wear sturdy shoes for steep stone stairs'],
    scam_warning_notes: 'Watch out for local children posing as helpers who later ask for money.',
    is_unesco: false,
    summary_story: 'Built in the 13th Century as a cliff-side fortress capital, famous for its monumental steep stone staircase guarded by carved lions.',
    latitude: 7.8139,
    longitude: 80.2589,
    google_maps_url: 'https://www.google.com/maps/search/?api=1&query=7.8139,80.2589',
  },
  {
    id: 10,
    name: 'Mihintale Sacred Mountain',
    district: 'Anuradhapura',
    category: 'Buddhist Heritage',
    ticket_price_usd: 3.00,
    ticket_price_lkr: 900.00,
    opening_hours: '06:00 AM - 08:00 PM',
    dress_code_rules: ['Cover knees and shoulders', 'Remove shoes at the middle landing terrace'],
    scam_warning_notes: 'Avoid renting cheap torches from vendors that break immediately. Bring your own light source for sunset climb.',
    is_unesco: false,
    summary_story: 'The birthplace of Buddhism in Sri Lanka where monk Mahinda met King Devanampiyatissa in 247 BC. Features 1,840 granite steps, ancient stupas, and Aradhana Gala.',
    latitude: 8.3514,
    longitude: 80.5181,
    google_maps_url: 'https://www.google.com/maps/search/?api=1&query=8.3514,80.5181',
  }
];

export const FALLBACK_POIS: POI[] = [
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
    video_url: require('../assets/lions_paw.mp4'),
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
  },
  {
    id: 7,
    site_id: 6,
    title: 'Golden Buddha & Rock Caves - Dambulla',
    historical_summary: 'Dating back to the 1st Century BC, this temple complex consists of five major caves filled with exquisite murals and 153 Buddha statues.',
    audio_url: 'https://actions.google.com/sounds/v1/ambiences/outdoor_park.ogg',
    geofence_radius_meters: 20,
    latitude: 7.8564,
    longitude: 80.6517,
  },
  {
    id: 8,
    site_id: 7,
    title: 'Sinharaja Rainforest Canopy',
    historical_summary: 'A pristine primary tropical rainforest reserve harboring over 60% of Sri Lanka\'s endemic tree species and rare bird waves.',
    audio_url: 'https://actions.google.com/sounds/v1/ambiences/outdoor_park.ogg',
    geofence_radius_meters: 20,
    latitude: 6.3986,
    longitude: 80.4194,
  },
  {
    id: 9,
    site_id: 8,
    title: 'Golden Gopuram Sanctum - Nallur Kovil',
    historical_summary: 'Originally established in 948 AD, this iconic Hindu temple represents Jaffna Dravidian style architecture and is dedicated to Lord Murugan.',
    audio_url: 'https://actions.google.com/sounds/v1/ambiences/outdoor_park.ogg',
    geofence_radius_meters: 20,
    latitude: 9.6744,
    longitude: 80.0309,
  },
  {
    id: 10,
    site_id: 9,
    title: 'Yapahuwa Ornamental Lion Staircase',
    historical_summary: 'Built in the 13th Century, the monumental stone staircase rises steeply up the rock face, once guarding the Sacred Tooth Relic.',
    audio_url: 'https://actions.google.com/sounds/v1/ambiences/outdoor_park.ogg',
    geofence_radius_meters: 20,
    latitude: 7.8139,
    longitude: 80.2589,
  },
  {
    id: 11,
    site_id: 10,
    title: 'Aradhana Gala (Rock of Convocation) - Mihintale',
    historical_summary: 'The sacred mountain peak where Buddhist monk Mahinda met King Devanampiyatissa in 247 BC, introducing Buddhism to Sri Lanka.',
    audio_url: 'https://actions.google.com/sounds/v1/ambiences/outdoor_park.ogg',
    geofence_radius_meters: 20,
    latitude: 8.3514,
    longitude: 80.5181,
  }
];

export const FALLBACK_RENTALS = [
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

export const FALLBACK_ROUTES = [
  {
    id: 1,
    from: 'Colombo Fort',
    to: 'Sigiriya Rock Fortress',
    bus_option: 'Bus #48 (Colombo ➔ Dambulla) then local bus to Sigiriya. Duration: ~4.5 hrs. Fare: ~750 LKR ($2.50 USD)',
    train_option: 'Express Train (Colombo ➔ Habarana) then 20-min Tuk-Tuk to Sigiriya. Fare: ~600 LKR ($2.00 USD)',
    pickme_uber_estimate: '18,500 LKR (~$60 USD)',
    dest_lat: 7.9570,
    dest_lng: 80.7603
  },
  {
    id: 2,
    from: 'Colombo Fort',
    to: 'Kandy Temple of Tooth',
    bus_option: 'Bus #1 (Colombo ➔ Kandy). Bus departs every 15 mins. Duration: ~3.5 hrs. Fare: ~450 LKR ($1.50 USD)',
    train_option: 'Observation Saloon / Intercity Express Train. Duration: ~2.5 hrs. Fare: ~500 LKR - 1,500 LKR',
    pickme_uber_estimate: '12,000 LKR (~$40 USD)',
    dest_lat: 7.2936,
    dest_lng: 80.6413
  }
];

export const getTranslatedHeritageSites = (lang: string): HeritageSite[] => {
  if (lang === 'si') {
    return FALLBACK_HERITAGE_SITES.map(s => {
      let name = s.name;
      if (s.id === 1) name = 'සීගිරිය පර්වත බලකොටුව';
      else if (s.id === 2) name = 'ශ්‍රී දළදා මාළිගාව (මහනුවර)';
      else if (s.id === 3) name = 'පොළොන්නරුව ඓතිහාසික නගරය';
      else if (s.id === 4) name = 'ගාලු කොටුව';
      else if (s.id === 5) name = 'අනුරාධපුර පූජනීය නගරය';
      else if (s.id === 6) name = 'දඹුල්ල රන්ගිරි ලෙන් විහාරය';
      else if (s.id === 7) name = 'සිංහරාජ වැසි වනාන්තරය';
      else if (s.id === 8) name = 'නල්ලූර් කන්දස්වාමි කෝවිල';
      else if (s.id === 9) name = 'යාපහුව පර්වත බලකොටුව';
      else if (s.id === 10) name = 'මිහින්තලේ පූජනීය කන්ද';

      return {
        ...s,
        name,
        category: s.category === 'Archaeology' ? 'පුරාවිද්‍යා' : s.category === 'Buddhist Heritage' ? 'බෞද්ධ උරුමය' : 'යටත් විජිත උරුමය',
      };
    });
  }
  if (lang === 'ta') {
    return FALLBACK_HERITAGE_SITES.map(s => {
      let name = s.name;
      if (s.id === 1) name = 'சிகிரியா பாறை கோட்டை';
      else if (s.id === 2) name = 'தலதா மாளிகை (கண்டி)';
      else if (s.id === 3) name = 'பழங்கால நகரமான பொலன்னறுவை';
      else if (s.id === 4) name = 'காலி கோட்டை';
      else if (s.id === 5) name = 'அனுராதபுரம் புனித நகரம்';
      else if (s.id === 6) name = 'தம்புள்ளை பொற்கோவில் லென் விஹாரை';
      else if (s.id === 7) name = 'சிங்கராஜ மழைக்காடு';
      else if (s.id === 8) name = 'நல்லூர் கந்தசுவாமி கோவில்';
      else if (s.id === 9) name = 'யாப்பஹுவ பாறைக் கோட்டை';
      else if (s.id === 10) name = 'மிஹிந்தலை புனித மலை';

      return {
        ...s,
        name,
        category: s.category === 'Archaeology' ? 'தொல்லியல்' : s.category === 'Buddhist Heritage' ? 'பௌத்த பாரம்பரியம்' : 'காலனித்துவ பாரம்பரியம்',
      };
    });
  }
  if (lang === 'zh') {
    return FALLBACK_HERITAGE_SITES.map(s => {
      let name = s.name;
      if (s.id === 1) name = '锡吉里耶狮子岩';
      else if (s.id === 2) name = '康提佛牙寺';
      else if (s.id === 3) name = '波隆纳鲁瓦古城';
      else if (s.id === 4) name = '加勒荷兰堡';
      else if (s.id === 5) name = '阿努拉德普勒圣城';
      else if (s.id === 6) name = '丹布勒金寺';
      else if (s.id === 7) name = '辛哈拉贾雨林保护区';
      else if (s.id === 8) name = '纳鲁尔坎达萨米神庙';
      else if (s.id === 9) name = '亚帕胡瓦岩石堡垒';
      else if (s.id === 10) name = '米欣特莱圣山';

      return {
        ...s,
        name,
        category: s.category === 'Archaeology' ? '考古' : s.category === 'Buddhist Heritage' ? '佛教遗产' : '殖民遗产',
      };
    });
  }
  return FALLBACK_HERITAGE_SITES;
};

export const getTranslatedPOIs = (lang: string): POI[] => {
  if (lang === 'si') {
    return FALLBACK_POIS.map(p => {
      let title = p.title;
      if (p.id === 1) title = 'කැඩපත් පවුර සහ බිතුසිතුවම් - සීගිරිය';
      else if (p.id === 2) title = 'සිංහ පාද පිවිසුම - සීගිරිය';
      else if (p.id === 3) title = 'හඳුන් කුණම - මහනුවර';
      else if (p.id === 4) title = 'ගල් විහාරය - පොළොන්නරුව';
      else if (p.id === 5) title = 'ගාලු ප්‍රදීපාගාරය';
      else if (p.id === 6) title = 'රුවන්වැලිසෑය - අනුරාධපුර';
      else if (p.id === 7) title = 'රන්ගිරි දඹුලු ලෙන් විහාරය';
      else if (p.id === 8) title = 'සිංහරාජ වැසි වනාන්තර වියන';
      else if (p.id === 9) title = 'නල්ලූර් කන්දස්වාමි කෝවිල';
      else if (p.id === 10) title = 'යාපහුව සිංහ පියගැට පෙළ';
      else if (p.id === 11) title = 'මිහින්තලා ආරාධනා ගල';
      return { ...p, title };
    });
  }
  if (lang === 'ta') {
    return FALLBACK_POIS.map(p => {
      let title = p.title;
      if (p.id === 1) title = 'கண்ணாடி சுவர் & ஓவியங்கள் - சிகிரியா';
      else if (p.id === 2) title = 'சிங்க பாத நுழைவாயில் - சிகிரியா';
      else if (p.id === 3) title = 'கருவறை - கண்டி';
      else if (p.id === 4) title = 'கல் விகாரை - பொலன்னறுவை';
      else if (p.id === 5) title = 'காலி கலங்கரை விளக்கம்';
      else if (p.id === 6) title = 'ருவன்வெலிசாய - அனுராதபுரம்';
      else if (p.id === 7) title = 'தம்புள்ளை பொற்கோவில் லென் குகைகள்';
      else if (p.id === 8) title = 'சிங்கராஜ மழைக்காடு விதானம்';
      else if (p.id === 9) title = 'நல்லூர் கந்தசுவாமி கோவில்';
      else if (p.id === 10) title = 'யாப்பஹுவ அலங்கார சிங்க படிக்கட்டு';
      else if (p.id === 11) title = 'மிஹிந்தலை ஆராதனா கல்';
      return { ...p, title };
    });
  }
  if (lang === 'zh') {
    return FALLBACK_POIS.map(p => {
      let title = p.title;
      if (p.id === 1) title = '镜墙与壁画 - 锡吉里耶';
      else if (p.id === 2) title = '狮爪入口 - 锡吉里耶';
      else if (p.id === 3) title = '内殿 - 康提';
      else if (p.id === 4) title = '加尔寺 - 波隆纳鲁瓦';
      else if (p.id === 5) title = '加勒灯塔';
      else if (p.id === 6) title = '鲁万韦利萨亚 - 阿努拉德普勒';
      else if (p.id === 7) title = '丹布勒石窟金佛';
      else if (p.id === 8) title = '辛哈拉贾雨林树冠';
      else if (p.id === 9) title = '纳鲁尔坎达萨米神庙内殿';
      else if (p.id === 10) title = '亚帕胡瓦雕刻狮子石阶';
      else if (p.id === 11) title = '米欣特莱召集石';
      return { ...p, title };
    });
  }
  return FALLBACK_POIS;
};
