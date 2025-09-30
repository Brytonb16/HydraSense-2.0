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
        recommendation: 'Maintain irrigation schedule at 0.8"',
        droneImagery: {
          status: 'Ready',
          image: '/drone-almond-north.svg',
          summary: 'Canopy vigor trending high along the northwest rows.',
          recommendation: 'Hold irrigation reductions at 5% to balance canopy growth.'
        }
      },
      {
        id: 'zone-2',
        name: 'Central Block',
        moisture: 'Low',
        fertility: 'Low Nitrogen',
        recommendation: 'Irrigate 1.2" and supplement nitrogen',
        droneImagery: {
          status: 'Ready',
          image: '/drone-almond-central.svg',
          summary: 'Thermal map highlights dry streaks along the center pivot.',
          recommendation: 'Run targeted irrigation on rows 6-12 and apply foliar nitrogen after sunset.'
        }
      },
      {
        id: 'zone-3',
        name: 'South Block',
        moisture: 'Critical',
        fertility: 'Very Low Potassium',
        recommendation: 'Irrigate 1.5" and apply potassium foliar feed',
        droneImagery: {
          status: 'Ready',
          image: '/drone-almond-south.svg',
          summary: 'Heat stress concentrated near the southern ridge.',
          recommendation: 'Deploy shade cloth mid-day and schedule 1.5" irrigation overnight.'
        }
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
        recommendation: 'Monitor soil tension; no action required',
        droneImagery: {
          status: 'Ready',
          image: '/drone-valley-cabernet.svg',
          summary: 'NDVI uniformity shows consistent berry set across canopy.',
          recommendation: 'Continue standard canopy management schedule.'
        }
      },
      {
        id: 'zone-2',
        name: 'Merlot Block',
        moisture: 'Low',
        fertility: 'Low Magnesium',
        recommendation: 'Initiate drip cycle and apply Mg foliar spray',
        droneImagery: {
          status: 'Ready',
          image: '/drone-valley-merlot.svg',
          summary: 'Low vigor lanes detected on the east-facing slope.',
          recommendation: 'Spot fertigation rows 4-7 on the east slope and boost irrigation by 0.3".'
        }
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
        recommendation: 'Pause irrigation for 24h',
        droneImagery: {
          status: 'Ready',
          image: '/drone-sunrise-honeycrisp.svg',
          summary: 'Dense canopy indicates strong fruit set with minor shading.',
          recommendation: 'Delay irrigation for 24 hours and thin clusters along rows 2-3.'
        }
      },
      {
        id: 'zone-2',
        name: 'Gala Section',
        moisture: 'Optimal',
        fertility: 'Low Phosphorus',
        recommendation: 'Apply phosphorus-rich fertigation',
        droneImagery: {
          status: 'Ready',
          image: '/drone-sunrise-gala.svg',
          summary: 'Balanced canopy with light nutrient shading near the northeast lane.',
          recommendation: 'Apply phosphorus-rich fertigation this week to maintain canopy balance.'
        }
      },
      {
        id: 'zone-3',
        name: 'Fuji Section',
        moisture: 'Moderate',
        fertility: 'Balanced',
        recommendation: 'Maintain current irrigation pattern',
        droneImagery: {
          status: 'Ready',
          image: '/drone-sunrise-fuji.svg',
          summary: 'Moisture gradients improving near the drainage channel.',
          recommendation: 'Maintain irrigation schedule and monitor low spots after rainfall.'
        }
      }
    ]
  }
];
