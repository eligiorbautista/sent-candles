// Hero section content
// This file now provides a hook-based approach to fetch hero content from Supabase

import { useHeroContent } from '../hooks/useSupabaseData.js';

// Hook to get hero content
export const useHeroData = () => {
  return useHeroContent();
};

// Fallback static data (used when Supabase is not available)
export const fallbackHeroContent = {
  badge: 'Handcrafted with Love',
  heading: {
    line1: 'Hand-Crafted',
    line2: 'Candles',
  },
  description:
    'Each candle is a carefully crafted vessel, preserving the intangible: a Sentiment.',
  buttons: {
    primary: {
      text: 'View Collection',
      link: '/products',
    },
    secondary: {
      text: 'Our Story',
      link: '#about',
    },
  },
  stats: [
    {
      value: '100%',
      label: 'Soy Wax',
    },
    {
      value: '15+',
      label: 'Hours Burn',
    },
    {
      value: '17+',
      label: 'Scents',
    },
  ],
  heroImage:
    'https://scontent.fmnl13-3.fna.fbcdn.net/v/t39.30808-6/415712171_122102582264166976_5690103902187634756_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeFKn5ZpnsIBzukOjCE7w5kagpJUOZcT8iKCklQ5lxPyInre-HGRFPCn5AZkJQHbMskjFAnAqHYlDjQrJtwGo01N&_nc_ohc=0Xesh6RXRYoQ7kNvwGD8EKj&_nc_oc=AdnW-VaLZZlFM7cOguQcPjZE98Ujo8_WCVe6IPmdqPljrpP3nh0Oy5MtWbFaWn8qKKQ&_nc_zt=23&_nc_ht=scontent.fmnl13-3.fna&_nc_gid=FQgjBx19pasD9zfYVUd3aQ&oh=00_AfflB2jsB0yw57Sl5mvLWIqWDQm8ta2p4SOMnTz7NddqRg&oe=69046873',
};
