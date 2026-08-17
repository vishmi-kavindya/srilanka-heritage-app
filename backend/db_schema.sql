-- Database Schema for Sri Lanka Heritage Platform
CREATE EXTENSION IF NOT EXISTS postgis;

-- 1. Heritage Sites Table
CREATE TABLE IF NOT EXISTS heritage_sites (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    district VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL, -- e.g. Archaeological, Sacred, Colonial
    ticket_price_usd NUMERIC(10, 2) NOT NULL,
    ticket_price_lkr NUMERIC(10, 2) NOT NULL,
    opening_hours VARCHAR(100) NOT NULL,
    dress_code_rules TEXT[] NOT NULL,
    scam_warning_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Points of Interest (POIs) Table with Geofencing
CREATE TABLE IF NOT EXISTS points_of_interest (
    id SERIAL PRIMARY KEY,
    site_id INT REFERENCES heritage_sites(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    historical_summary TEXT NOT NULL,
    audio_url VARCHAR(500),
    geofence_radius_meters INT DEFAULT 20,
    location GEOGRAPHY(POINT, 4326),
    latitude NUMERIC(10, 6) NOT NULL,
    longitude NUMERIC(10, 6) NOT NULL
);

-- 3. Public Transport Routes
CREATE TABLE IF NOT EXISTS transport_routes (
    id SERIAL PRIMARY KEY,
    origin VARCHAR(100) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    transport_mode VARCHAR(50) NOT NULL, -- Bus, Train
    route_number VARCHAR(50),
    duration_mins INT NOT NULL,
    estimated_fare_lkr NUMERIC(10, 2) NOT NULL,
    step_by_step_instructions TEXT[] NOT NULL
);

-- 4. Vehicle & Scooter Rentals
CREATE TABLE IF NOT EXISTS vehicle_rentals (
    id SERIAL PRIMARY KEY,
    agency_name VARCHAR(255) NOT NULL,
    district VARCHAR(100) NOT NULL,
    vehicle_type VARCHAR(50) NOT NULL, -- Scooter, Tuk-Tuk, Car
    daily_rate_lkr NUMERIC(10, 2) NOT NULL,
    phone_number VARCHAR(50) NOT NULL,
    whatsapp_number VARCHAR(50) NOT NULL
);

-- 5. Cultural Festivals & Events
CREATE TABLE IF NOT EXISTS cultural_festivals (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    month_celebrated VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true
);

-- SEED INITIAL DATA
INSERT INTO heritage_sites (name, district, category, ticket_price_usd, ticket_price_lkr, opening_hours, dress_code_rules, scam_warning_notes) VALUES
('Sigiriya Rock Fortress', 'Matale', 'Archaeology', 36.00, 11000.00, '06:30 AM - 05:30 PM', ARRAY['Wear light breathable clothes', 'Comfortable climbing shoes', 'Hats allowed during climb'], 'Beware of unofficial guides demanding $50 for assistance at the entrance. Official guides wear red badges.'),
('Temple of the Sacred Tooth Relic (Kandy)', 'Kandy', 'Buddhist Heritage', 10.00, 2000.00, '05:30 AM - 08:00 PM', ARRAY['Cover shoulders & knees fully', 'Remove shoes & hats before entering temple', 'Do not pose with back turned to Buddha statues'], 'Fake flower sellers charging 10x prices near the lake. Buy lotus flowers inside official stalls.'),
('Ancient City of Polonnaruwa', 'Polonnaruwa', 'Archaeology', 30.00, 9200.00, '07:00 AM - 05:30 PM', ARRAY['Cover shoulders & knees at Gal Vihara', 'Remove shoes on hot stone pavements'], 'Bicycle rental scams offering broken bikes. Inspect brakes before renting.'),
('Galle Dutch Fort', 'Galle', 'Colonial Heritage', 0.00, 0.00, 'Open 24 Hours', ARRAY['Casual modest wear', 'Sun protection recommended'], 'Snake charmers asking excessive money after taking photos without agreement.'),
('Sacred City of Anuradhapura', 'Anuradhapura', 'Buddhist Heritage', 25.00, 7700.00, '07:00 AM - 06:00 PM', ARRAY['White attire preferred', 'Cover shoulders & knees', 'Remove shoes at Dagobas'], 'Fake donation collectors asking money for temple restoration.');

-- Insert POIs with Geofence coordinates
INSERT INTO points_of_interest (site_id, title, historical_summary, audio_url, geofence_radius_meters, latitude, longitude) VALUES
(1, 'Mirror Wall & Frescoes - Sigiriya', 'Created in 5th Century AD by King Kashyapa. Features ancient graffiti verses written by visitors over 1000 years ago and heavenly maiden frescoes painted with natural pigments.', 'https://actions.google.com/sounds/v1/ambiences/outdoor_park.ogg', 20, 7.9570, 80.7603),
(1, 'Lion Paw Entrance - Sigiriya', 'The majestic portal guarding the final climb to the summit palace, carved in the form of a gigantic lion, symbolizing royal strength.', 'https://actions.google.com/sounds/v1/ambiences/outdoor_park.ogg', 20, 7.9582, 80.7600),
(2, 'Handun Kunama (Inner Sanctum) - Kandy', 'The sacred shrine housing the Tooth Relic of Gautama Buddha, brought to Sri Lanka in 4th Century AD by Princess Hemamali.', 'https://actions.google.com/sounds/v1/ambiences/outdoor_park.ogg', 20, 7.2936, 80.6413),
(3, 'Gal Vihara Monolithic Statues - Polonnaruwa', 'Masterpiece of 12th century Sinhalese rock carving by King Parakramabahu I, featuring four colossal granite Buddha statues.', 'https://actions.google.com/sounds/v1/ambiences/outdoor_park.ogg', 20, 7.9645, 81.0022),
(4, 'Galle Lighthouse & Bastions', 'Built by the Dutch in 1663 and upgraded by the British. Standing at Point Utrecht bastion overlooking the Indian Ocean.', 'https://actions.google.com/sounds/v1/ambiences/outdoor_park.ogg', 20, 6.0267, 80.2170),
(5, 'Ruwanwelisaya Dagoba - Anuradhapura', 'Sacred stupa built by King Dutugemunu in 140 BC, standing 103 meters tall with 1900 elephant carvings lining the perimeter wall.', 'https://actions.google.com/sounds/v1/ambiences/outdoor_park.ogg', 20, 8.3500, 80.3960);
