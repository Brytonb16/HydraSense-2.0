export const farms = [
  {
    id: 'almond-grove-01',
    name: 'Almond Grove 01',
    location: 'Modesto, CA',
    crop: 'Almonds',
    acreage: 120,
    zones: [
      {
        id: 'zone-1',
        name: 'North Block',
        moisture: 'Optimal',
        fertility: 'Stable',
        recommendation: 'Maintain irrigation schedule at 0.8"'
      },
      {
        id: 'zone-2',
        name: 'Central Block',
        moisture: 'Low',
        fertility: 'Low Nitrogen',
        recommendation: 'Irrigate 1.2" and supplement nitrogen'
      },
      {
        id: 'zone-3',
        name: 'South Block',
        moisture: 'Critical',
        fertility: 'Very Low Potassium',
        recommendation: 'Irrigate 1.5" and apply potassium foliar feed'
      }
    ]
  },
  {
    id: 'valley-vineyards',
    name: 'Valley Vineyards',
    location: 'Napa, CA',
    crop: 'Grapes',
    acreage: 85,
    zones: [
      {
        id: 'zone-1',
        name: 'Cabernet Block',
        moisture: 'Moderate',
        fertility: 'Balanced',
        recommendation: 'Monitor soil tension; no action required'
      },
      {
        id: 'zone-2',
        name: 'Merlot Block',
        moisture: 'Low',
        fertility: 'Low Magnesium',
        recommendation: 'Initiate drip cycle and apply Mg foliar spray'
      }
    ]
  },
  {
    id: 'sunrise-orchards',
    name: 'Sunrise Orchards',
    location: 'Yakima, WA',
    crop: 'Apples',
    acreage: 200,
    zones: [
      {
        id: 'zone-1',
        name: 'Honeycrisp Section',
        moisture: 'High',
        fertility: 'Stable',
        recommendation: 'Pause irrigation for 24h'
      },
      {
        id: 'zone-2',
        name: 'Gala Section',
        moisture: 'Optimal',
        fertility: 'Low Phosphorus',
        recommendation: 'Apply phosphorus-rich fertigation'
      },
      {
        id: 'zone-3',
        name: 'Fuji Section',
        moisture: 'Moderate',
        fertility: 'Balanced',
        recommendation: 'Maintain current irrigation pattern'
      }
    ]
  }
];
