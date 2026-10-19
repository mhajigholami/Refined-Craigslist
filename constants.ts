import { Section, Listing } from './types';

export const SECTIONS: Section[] = [
  {
    id: 'community',
    title: 'community',
    categories: [
      { id: 'act', name: 'activities', slug: 'activities' },
      { id: 'artists', name: 'artists', slug: 'artists' },
      { id: 'childcare', name: 'childcare', slug: 'childcare' },
      { id: 'classes', name: 'classes', slug: 'classes' },
      { id: 'events', name: 'events', slug: 'events' },
      { id: 'general', name: 'general', slug: 'general' },
      { id: 'groups', name: 'groups', slug: 'groups' },
      { id: 'local-news', name: 'local news', slug: 'local-news' },
      { id: 'lost-found', name: 'lost+found', slug: 'lost-found' },
      { id: 'missed-connections', name: 'missed connections', slug: 'missed-connections' },
      { id: 'musicians', name: 'musicians', slug: 'musicians' },
      { id: 'pets', name: 'pets', slug: 'pets' },
      { id: 'politics', name: 'politics', slug: 'politics' },
      { id: 'volunteers', name: 'volunteers', slug: 'volunteers' }
    ]
  },
  {
    id: 'housing',
    title: 'housing',
    categories: [
      { id: 'apts-housing', name: 'apts / housing', slug: 'apts-housing' },
      { id: 'housing-swap', name: 'housing swap', slug: 'housing-swap' },
      { id: 'housing-wanted', name: 'housing wanted', slug: 'housing-wanted' },
      { id: 'office-commercial', name: 'office / commercial', slug: 'office-commercial' },
      { id: 'parking-storage', name: 'parking / storage', slug: 'parking-storage' },
      { id: 'real-estate-for-sale', name: 'real estate for sale', slug: 'real-estate' },
      { id: 'rooms-shared', name: 'rooms / shared', slug: 'rooms-shared' },
      { id: 'rooms-wanted', name: 'rooms wanted', slug: 'rooms-wanted' },
      { id: 'sublets-temporary', name: 'sublets / temporary', slug: 'sublets' },
      { id: 'vacation-rentals', name: 'vacation rentals', slug: 'vacation-rentals' }
    ]
  },
  {
    id: 'jobs',
    title: 'jobs',
    categories: [
      { id: 'accounting-finance', name: 'accounting+finance', slug: 'accounting' },
      { id: 'admin-office', name: 'admin / office', slug: 'admin' },
      { id: 'arch-engineering', name: 'arch / engineering', slug: 'engineering' },
      { id: 'art-media-design', name: 'art / media / design', slug: 'design' },
      { id: 'biotech-science', name: 'biotech / science', slug: 'science' },
      { id: 'business-mgmt', name: 'business / mgmt', slug: 'management' },
      { id: 'customer-service', name: 'customer service', slug: 'customer-service' },
      { id: 'education', name: 'education', slug: 'education' },
      { id: 'etc-misc', name: 'etc / misc', slug: 'misc' },
      { id: 'food-bev-hosp', name: 'food / bev / hosp', slug: 'food-hospitality' },
      { id: 'general-labor', name: 'general labor', slug: 'labor' },
      { id: 'government', name: 'government', slug: 'government' },
      { id: 'human-resources', name: 'human resources', slug: 'hr' },
      { id: 'legal-paralegal', name: 'legal / paralegal', slug: 'legal' },
      { id: 'manufacturing', name: 'manufacturing', slug: 'manufacturing' },
      { id: 'marketing-pr-ad', name: 'marketing / pr / ad', slug: 'marketing' },
      { id: 'medical-health', name: 'medical / health', slug: 'medical' },
      { id: 'nonprofit-sector', name: 'nonprofit sector', slug: 'nonprofit' },
      { id: 'real-estate', name: 'real estate', slug: 'real-estate-jobs' },
      { id: 'retail-wholesale', name: 'retail / wholesale', slug: 'retail' },
      { id: 'sales-biz-dev', name: 'sales / biz dev', slug: 'sales' },
      { id: 'salon-spa-fitness', name: 'salon / spa / fitness', slug: 'fitness' },
      { id: 'security', name: 'security', slug: 'security' },
      { id: 'skilled-trades-artisan', name: 'skilled trades / artisan', slug: 'trades' },
      { id: 'software-qa-dba', name: 'software / qa / dba', slug: 'software' },
      { id: 'systems-network', name: 'systems / network', slug: 'networking' },
      { id: 'technical-support', name: 'technical support', slug: 'tech-support' },
      { id: 'transport', name: 'transport', slug: 'transport' },
      { id: 'tv-film-video', name: 'tv / film / video', slug: 'film-video' },
      { id: 'web-info-design', name: 'web / info design', slug: 'web-design' },
      { id: 'writing-editing', name: 'writing / editing', slug: 'writing' }
    ]
  },
  {
    id: 'services',
    title: 'services',
    categories: [
      { id: 'automotive', name: 'automotive', slug: 'automotive' },
      { id: 'beauty', name: 'beauty', slug: 'beauty' },
      { id: 'cell-mobile', name: 'cell/mobile', slug: 'cell-mobile' },
      { id: 'computer', name: 'computer', slug: 'computer-services' },
      { id: 'creative', name: 'creative', slug: 'creative' },
      { id: 'cycle', name: 'cycle', slug: 'cycle' },
      { id: 'event', name: 'event', slug: 'event' },
      { id: 'farm-garden', name: 'farm+garden', slug: 'farm-garden' },
      { id: 'financial', name: 'financial', slug: 'financial' },
      { id: 'household', name: 'household', slug: 'household' },
      { id: 'labor-move', name: 'labor / move', slug: 'moving' },
      { id: 'legal-services', name: 'legal', slug: 'legal-services' },
      { id: 'lessons', name: 'lessons', slug: 'lessons' },
      { id: 'marine', name: 'marine', slug: 'marine' },
      { id: 'pet', name: 'pet', slug: 'pet-services' },
      { id: 'real-estate-services', name: 'real estate', slug: 'real-estate-services' },
      { id: 'skilled-trade', name: 'skilled trade', slug: 'skilled-trade' },
      { id: 'sm-biz-ads', name: 'sm biz ads', slug: 'sm-biz-ads' },
      { id: 'travel-vac', name: 'travel/vac', slug: 'travel' },
      { id: 'write-ed-tran', name: 'write / ed / tran', slug: 'translation' }
    ]
  },
  {
    id: 'for-sale',
    title: 'for sale',
    categories: [
      { id: 'antiques', name: 'antiques', slug: 'antiques' },
      { id: 'appliances', name: 'appliances', slug: 'appliances' },
      { id: 'arts-crafts', name: 'arts+crafts', slug: 'arts-crafts' },
      { id: 'atvs-utvs-snow', name: 'atvs/utvs/snow', slug: 'atvs' },
      { id: 'auto-parts', name: 'auto parts', slug: 'auto-parts' },
      { id: 'aviation', name: 'aviation', slug: 'aviation' },
      { id: 'baby-kid', name: 'baby+kid', slug: 'baby-kid' },
      { id: 'barter', name: 'barter', slug: 'barter' },
      { id: 'beauty-hlth', name: 'beauty+hlth', slug: 'beauty-health' },
      { id: 'bike-parts', name: 'bike parts', slug: 'bike-parts' },
      { id: 'bikes', name: 'bikes', slug: 'bikes' },
      { id: 'boat-parts', name: 'boat parts', slug: 'boat-parts' },
      { id: 'boats', name: 'boats', slug: 'boats' },
      { id: 'books', name: 'books', slug: 'books' },
      { id: 'business', name: 'business', slug: 'business' },
      { id: 'cars-trucks', name: 'cars+trucks', slug: 'cars-trucks' },
      { id: 'cds-dvd-vhs', name: 'cds/dvd/vhs', slug: 'media' },
      { id: 'cell-phones', name: 'cell phones', slug: 'cell-phones' },
      { id: 'clothes-acc', name: 'clothes+acc', slug: 'clothes' },
      { id: 'collectibles', name: 'collectibles', slug: 'collectibles' },
      { id: 'computer-parts', name: 'computer parts', slug: 'computer-parts' },
      { id: 'computers', name: 'computers', slug: 'computers' },
      { id: 'electronics', name: 'electronics', slug: 'electronics' },
      { id: 'farm-garden-sale', name: 'farm+garden', slug: 'farm-garden-sale' },
      { id: 'free', name: 'free', slug: 'free' },
      { id: 'furniture', name: 'furniture', slug: 'furniture' },
      { id: 'garage-sale', name: 'garage sale', slug: 'garage-sale' },
      { id: 'general-sale', name: 'general', slug: 'general-sale' },
      { id: 'heavy-equip', name: 'heavy equip', slug: 'heavy-equipment' },
      { id: 'household-items', name: 'household', slug: 'household-items' },
      { id: 'jewelry', name: 'jewelry', slug: 'jewelry' },
      { id: 'materials', name: 'materials', slug: 'materials' },
      { id: 'motorcycle-parts', name: 'motorcycle parts', slug: 'motorcycle-parts' },
      { id: 'motorcycles', name: 'motorcycles', slug: 'motorcycles' },
      { id: 'music-instr', name: 'music instr', slug: 'instruments' },
      { id: 'photo-video', name: 'photo/video', slug: 'photo-video' },
      { id: 'rvs-camp', name: 'rvs+camp', slug: 'rvs' },
      { id: 'sporting', name: 'sporting', slug: 'sporting' },
      { id: 'tickets', name: 'tickets', slug: 'tickets' },
      { id: 'tools', name: 'tools', slug: 'tools' },
      { id: 'toys-games', name: 'toys+games', slug: 'toys-games' },
      { id: 'trailers', name: 'trailers', slug: 'trailers' },
      { id: 'video-gaming', name: 'video gaming', slug: 'video-gaming' },
      { id: 'wanted', name: 'wanted', slug: 'wanted' }
    ]
  },
  {
    id: 'gigs',
    title: 'gigs',
    categories: [
      { id: 'computer-gigs', name: 'computer', slug: 'computer-gigs' },
      { id: 'creative-gigs', name: 'creative', slug: 'creative-gigs' },
      { id: 'crew-gigs', name: 'crew', slug: 'crew-gigs' },
      { id: 'domestic-gigs', name: 'domestic', slug: 'domestic-gigs' },
      { id: 'event-gigs', name: 'event', slug: 'event-gigs' },
      { id: 'labor-gigs', name: 'labor', slug: 'labor-gigs' },
      { id: 'talent-gigs', name: 'talent', slug: 'talent-gigs' },
      { id: 'writing-gigs', name: 'writing', slug: 'writing-gigs' }
    ]
  }
];

export const INITIAL_LISTINGS: Listing[] = [
  {
    id: 'cl-101',
    title: '2019 Toyota RAV4 XLE - Clean Title, 42k Miles, AWD',
    price: '$21,500',
    description: 'Selling my 2019 Toyota RAV4 XLE in immaculate condition. Always garage kept, clean California title in hand. Features include Apple CarPlay, blind spot monitoring, power moonroof, and heated seats.',
    category: 'cars-trucks',
    subcategory: 'cars',
    location: 'Mission District, San Francisco',
    citySlug: 'sfbay',
    imageUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
    latitude: 37.7599,
    longitude: -122.4148,
    coordinates: {
      type: 'Point',
      coordinates: [-122.4148, 37.7599]
    },
    timestamp: Date.now() - 3600000 * 2,
    featured: true,
    status: 'active',
    seller: {
      id: 'sel-1',
      name: 'Michael Chen',
      rating: 4.9,
      phoneVerified: true,
      joinedDate: '2021'
    },
    attributes: {
      'Mileage': '42,000 mi',
      'Transmission': 'Automatic',
      'Fuel': 'Gasoline',
      'Condition': 'Excellent'
    }
  },
  {
    id: 'cl-102',
    title: 'Modern Sunny 1BR/1BA Loft Apartment with Bay Views',
    price: '$2,850/mo',
    description: 'Stunning industrial-modern loft in SOMA. High 14ft ceilings, exposed concrete and timber, floor-to-ceiling windows with panoramic city & bridge views. In-unit washer/dryer and secure parking included.',
    category: 'apts-housing',
    subcategory: 'apartments',
    location: 'SOMA, San Francisco',
    citySlug: 'sfbay',
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
    latitude: 37.7785,
    longitude: -122.3998,
    coordinates: {
      type: 'Point',
      coordinates: [-122.3998, 37.7785]
    },
    timestamp: Date.now() - 3600000 * 5,
    featured: true,
    status: 'active',
    seller: {
      id: 'sel-2',
      name: 'Sarah Jenkins',
      rating: 5.0,
      phoneVerified: true,
      joinedDate: '2019'
    },
    attributes: {
      'Bedrooms': '1 BR',
      'Bathrooms': '1 BA',
      'Square Feet': '850 sqft',
      'Parking': 'Included'
    }
  },
  {
    id: 'cl-103',
    title: 'Apple MacBook Pro 16" M3 Pro - 36GB RAM / 1TB SSD Space Black',
    price: '$2,200',
    description: 'Barely used MacBook Pro 16-inch with Apple Silicon M3 Pro, 36GB unified memory, 1TB ultra-fast SSD. Battery cycle count only 14. Comes with original MagSafe 3 charger, box, and AppleCare+ until 2026.',
    category: 'computers',
    subcategory: 'laptops',
    location: 'Palo Alto, CA',
    citySlug: 'sfbay',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    latitude: 37.4419,
    longitude: -122.1430,
    coordinates: {
      type: 'Point',
      coordinates: [-122.1430, 37.4419]
    },
    timestamp: Date.now() - 3600000 * 8,
    status: 'active',
    seller: {
      id: 'sel-3',
      name: 'David Rossi',
      rating: 4.8,
      phoneVerified: true,
      joinedDate: '2022'
    },
    attributes: {
      'Condition': 'Like New',
      'Processor': 'Apple M3 Pro',
      'RAM': '36 GB',
      'Storage': '1 TB SSD'
    }
  },
  {
    id: 'cl-104',
    title: 'Vintage Mid-Century Walnut Credenza / Sideboard - Danish Modern',
    price: '$890',
    description: 'Authentic 1960s Danish teak and walnut sideboard credenza. Features sliding tambour doors with sculpted solid wood pulls and four dovetail drawers. Restored with natural Danish oil finish.',
    category: 'furniture',
    subcategory: 'living-room',
    location: 'Berkeley, CA',
    citySlug: 'sfbay',
    imageUrl: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=800&q=80',
    latitude: 37.8715,
    longitude: -122.2730,
    coordinates: {
      type: 'Point',
      coordinates: [-122.2730, 37.8715]
    },
    timestamp: Date.now() - 3600000 * 12,
    status: 'active',
    seller: {
      id: 'sel-4',
      name: 'Vintage Modern Co.',
      rating: 4.9,
      phoneVerified: true,
      joinedDate: '2020'
    },
    attributes: {
      'Material': 'Solid Walnut & Teak',
      'Dimensions': '66"W x 18"D x 30"H',
      'Era': '1960s'
    }
  },
  {
    id: 'cl-105',
    title: '2023 Specialized Turbo Vado 4.0 Electric Commuter Bike (Size M)',
    price: '$2,750',
    description: 'Like-new electric bike with only 210 total miles. Specialized 2.0 motor with 70Nm torque, 710Wh removable battery delivering up to 90 miles of range. Includes fenders, integrated front/rear lights, and rack.',
    category: 'bikes',
    subcategory: 'electric',
    location: 'Marin County / San Rafael',
    citySlug: 'sfbay',
    imageUrl: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80',
    latitude: 37.9735,
    longitude: -122.5311,
    coordinates: {
      type: 'Point',
      coordinates: [-122.5311, 37.9735]
    },
    timestamp: Date.now() - 3600000 * 18,
    status: 'active',
    seller: {
      id: 'sel-5',
      name: 'Alex Turner',
      rating: 4.7,
      phoneVerified: true,
      joinedDate: '2023'
    },
    attributes: {
      'Frame Size': 'Medium',
      'Motor': 'Specialized 2.0 (70Nm)',
      'Battery': '710 Wh'
    }
  },
  {
    id: 'cl-106',
    title: 'Solid Oak Hardwood Moving Boxes & Packing Material (FREE)',
    price: 'Free',
    description: 'Over 30 heavy-duty moving boxes, wardrobers, bubble wrap, and packing paper from our recent relocation. All clean, dry, flattened and ready for pickup on driveway curb.',
    category: 'free',
    subcategory: 'free-stuff',
    location: 'Sunset District, San Francisco',
    citySlug: 'sfbay',
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
    latitude: 37.7533,
    longitude: -122.4862,
    coordinates: {
      type: 'Point',
      coordinates: [-122.4862, 37.7533]
    },
    timestamp: Date.now() - 3600000 * 24,
    status: 'active',
    seller: {
      id: 'sel-6',
      name: 'Local Resident',
      rating: 5.0,
      phoneVerified: false,
      joinedDate: '2024'
    }
  }
];
