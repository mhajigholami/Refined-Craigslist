export interface City {
  name: string;
  slug: string;
}

export interface SubRegion {
  name: string;
  cities: City[];
}

export interface Region {
  name: string;
  slug: string; // e.g., 'US', 'EU', 'ASIA'
  coordinates: [number, number]; // [lat, lng]
  defaultCitySlug: string;
  subregions: SubRegion[];
}

export const GLOBAL_SITES: Region[] = [
  {
    name: "United States",
    slug: "US",
    coordinates: [37.7749, -122.4194],
    defaultCitySlug: "sfbay",
    subregions: [
      {
        name: "California",
        cities: [
          { name: "SF Bay Area", slug: "sfbay" },
          { name: "Los Angeles", slug: "losangeles" },
          { name: "San Diego", slug: "sandiego" },
          { name: "Sacramento", slug: "sacramento" },
          { name: "Orange County", slug: "orangecounty" }
        ]
      },
      {
        name: "New York",
        cities: [
          { name: "New York City", slug: "newyork" },
          { name: "Buffalo", slug: "buffalo" },
          { name: "Albany", slug: "albany" }
        ]
      },
      {
        name: "Illinois & Midwest",
        cities: [
          { name: "Chicago", slug: "chicago" }
        ]
      },
      {
        name: "Washington",
        cities: [
          { name: "Seattle", slug: "seattle" }
        ]
      }
    ]
  },
  {
    name: "Canada",
    slug: "CA",
    coordinates: [45.4215, -75.6972],
    defaultCitySlug: "toronto",
    subregions: [
      {
        name: "Ontario",
        cities: [
          { name: "Toronto", slug: "toronto" },
          { name: "Ottawa", slug: "ottawa" }
        ]
      },
      {
        name: "British Columbia",
        cities: [
          { name: "Vancouver", slug: "vancouver" }
        ]
      },
      {
        name: "Quebec",
        cities: [
          { name: "Montreal", slug: "montreal" }
        ]
      }
    ]
  },
  {
    name: "Europe",
    slug: "EU",
    coordinates: [48.8566, 2.3522],
    defaultCitySlug: "london",
    subregions: [
      {
        name: "United Kingdom",
        cities: [
          { name: "London", slug: "london" },
          { name: "Manchester", slug: "manchester" },
          { name: "Edinburgh", slug: "edinburgh" }
        ]
      },
      {
        name: "France",
        cities: [
          { name: "Paris", slug: "paris" },
          { name: "Lyon", slug: "lyon" }
        ]
      },
      {
        name: "Germany",
        cities: [
          { name: "Berlin", slug: "berlin" },
          { name: "Munich", slug: "munich" }
        ]
      }
    ]
  },
  {
    name: "Asia",
    slug: "ASIA",
    coordinates: [35.6762, 139.6503],
    defaultCitySlug: "tokyo",
    subregions: [
      {
        name: "Japan",
        cities: [
          { name: "Tokyo", slug: "tokyo" },
          { name: "Osaka", slug: "osaka" }
        ]
      },
      {
        name: "Singapore",
        cities: [
          { name: "Singapore", slug: "singapore" }
        ]
      },
      {
        name: "South Korea",
        cities: [
          { name: "Seoul", slug: "seoul" }
        ]
      }
    ]
  },
  {
    name: "Oceania",
    slug: "OCEANIA",
    coordinates: [-33.8688, 151.2093],
    defaultCitySlug: "sydney",
    subregions: [
      {
        name: "Australia",
        cities: [
          { name: "Sydney", slug: "sydney" },
          { name: "Melbourne", slug: "melbourne" },
          { name: "Brisbane", slug: "brisbane" }
        ]
      },
      {
        name: "New Zealand",
        cities: [
          { name: "Auckland", slug: "auckland" }
        ]
      }
    ]
  },
  {
    name: "Latin America",
    slug: "LATAM",
    coordinates: [19.4326, -99.1332],
    defaultCitySlug: "mexicocity",
    subregions: [
      {
        name: "Mexico",
        cities: [
          { name: "Mexico City", slug: "mexicocity" }
        ]
      },
      {
        name: "Brazil",
        cities: [
          { name: "Sao Paulo", slug: "saopaulo" }
        ]
      },
      {
        name: "Argentina",
        cities: [
          { name: "Buenos Aires", slug: "buenosaires" }
        ]
      }
    ]
  },
  {
    name: "Africa",
    slug: "AF",
    coordinates: [-33.9249, 18.4241],
    defaultCitySlug: "capetown",
    subregions: [
      {
        name: "South Africa",
        cities: [
          { name: "Cape Town", slug: "capetown" },
          { name: "Johannesburg", slug: "johannesburg" }
        ]
      },
      {
        name: "Egypt",
        cities: [
          { name: "Cairo", slug: "cairo" }
        ]
      }
    ]
  }
];
