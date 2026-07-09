// Mock service-station data for Melbourne, used while the real Servo Saver
// (Service Victoria) API is being wired up. The shape here is intentionally
// close to what we expect the normalised API result to look like, so swapping
// in live data is a matter of mapping the API response into this same shape.
//
// price = 91 unleaded (U91) price in cents per litre.
// updatedAt = when Service Victoria last refreshed this price (data is ~24h delayed).

const UPDATED = '2026-07-08T06:00:00+10:00'

export const mockStations = [
  { id: '1', name: 'Shell Coles Express', brand: 'Shell', address: '424 Elizabeth St', suburb: 'Melbourne', postcode: '3000', latitude: -37.8075, longitude: 144.9628, price: 189.9, updatedAt: UPDATED },
  { id: '2', name: '7-Eleven Carlton', brand: '7-Eleven', address: '360 Lygon St', suburb: 'Carlton', postcode: '3053', latitude: -37.8001, longitude: 144.9674, price: 179.5, updatedAt: UPDATED },
  { id: '3', name: 'BP Fitzroy', brand: 'BP', address: '244 Alexandra Pde', suburb: 'Fitzroy', postcode: '3065', latitude: -37.7981, longitude: 144.9782, price: 192.7, updatedAt: UPDATED },
  { id: '4', name: 'United Petroleum Richmond', brand: 'United', address: '505 Church St', suburb: 'Richmond', postcode: '3121', latitude: -37.8230, longitude: 144.9980, price: 174.9, updatedAt: UPDATED },
  { id: '5', name: 'Ampol South Yarra', brand: 'Ampol', address: '620 Chapel St', suburb: 'South Yarra', postcode: '3141', latitude: -37.8385, longitude: 144.9925, price: 198.3, updatedAt: UPDATED },
  { id: '6', name: 'Liberty St Kilda', brand: 'Liberty', address: '112 Barkly St', suburb: 'St Kilda', postcode: '3182', latitude: -37.8677, longitude: 144.9811, price: 181.9, updatedAt: UPDATED },
  { id: '7', name: 'Metro Brunswick', brand: 'Metro', address: '780 Sydney Rd', suburb: 'Brunswick', postcode: '3056', latitude: -37.7670, longitude: 144.9600, price: 176.7, updatedAt: UPDATED },
  { id: '8', name: 'Shell Footscray', brand: 'Shell', address: '155 Barkly St', suburb: 'Footscray', postcode: '3011', latitude: -37.8000, longitude: 144.9000, price: 185.5, updatedAt: UPDATED },
  { id: '9', name: 'BP Docklands', brand: 'BP', address: '2 Footscray Rd', suburb: 'Docklands', postcode: '3008', latitude: -37.8149, longitude: 144.9464, price: 194.9, updatedAt: UPDATED },
  { id: '10', name: '7-Eleven Prahran', brand: '7-Eleven', address: '311 High St', suburb: 'Prahran', postcode: '3181', latitude: -37.8515, longitude: 144.9930, price: 183.3, updatedAt: UPDATED },
  { id: '11', name: 'Caltex Hawthorn', brand: 'Ampol', address: '789 Burwood Rd', suburb: 'Hawthorn', postcode: '3122', latitude: -37.8220, longitude: 145.0350, price: 187.1, updatedAt: UPDATED },
  { id: '12', name: 'United Kew', brand: 'United', address: '244 High St', suburb: 'Kew', postcode: '3101', latitude: -37.8060, longitude: 145.0300, price: 172.5, updatedAt: UPDATED },
  { id: '13', name: 'Shell Northcote', brand: 'Shell', address: '330 High St', suburb: 'Northcote', postcode: '3070', latitude: -37.7700, longitude: 144.9990, price: 190.4, updatedAt: UPDATED },
  { id: '14', name: 'Liberty Preston', brand: 'Liberty', address: '415 Bell St', suburb: 'Preston', postcode: '3072', latitude: -37.7400, longitude: 145.0000, price: 178.8, updatedAt: UPDATED },
  { id: '15', name: 'BP Essendon', brand: 'BP', address: '901 Mt Alexander Rd', suburb: 'Essendon', postcode: '3040', latitude: -37.7500, longitude: 144.9200, price: 193.6, updatedAt: UPDATED },
  { id: '16', name: '7-Eleven Moonee Ponds', brand: '7-Eleven', address: '12 Puckle St', suburb: 'Moonee Ponds', postcode: '3039', latitude: -37.7660, longitude: 144.9200, price: 184.2, updatedAt: UPDATED },
  { id: '17', name: 'Metro Coburg', brand: 'Metro', address: '450 Sydney Rd', suburb: 'Coburg', postcode: '3058', latitude: -37.7440, longitude: 144.9660, price: 175.9, updatedAt: UPDATED },
  { id: '18', name: 'Ampol Collingwood', brand: 'Ampol', address: '99 Hoddle St', suburb: 'Collingwood', postcode: '3066', latitude: -37.8000, longitude: 144.9840, price: 196.5, updatedAt: UPDATED },
  { id: '19', name: 'United Port Melbourne', brand: 'United', address: '210 Williamstown Rd', suburb: 'Port Melbourne', postcode: '3207', latitude: -37.8400, longitude: 144.9400, price: 173.7, updatedAt: UPDATED },
  { id: '20', name: 'Shell Williamstown', brand: 'Shell', address: '1 Melbourne Rd', suburb: 'Williamstown', postcode: '3016', latitude: -37.8580, longitude: 144.8970, price: 188.0, updatedAt: UPDATED },
]

export default mockStations
