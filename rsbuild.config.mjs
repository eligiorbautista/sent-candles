import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [pluginReact()],
  html: {
    favicon: './public/favicon.jpg',
    title: 'Sent. Candles',
    meta: {
      description:
        'Handcrafted scented candles made with natural soy wax and premium fragrance oils. Each candle tells a story and captures a sentiment.',
      keywords:
        'candles, scented candles, soy candles, handcrafted candles, natural candles, home fragrance',

      // Open Graph (Facebook & Instagram)
      'og:title': 'Sent. Candles - Handcrafted Scented Candles',
      'og:description':
        'Each candle is a carefully crafted vessel, preserving a sentiment through premium fragrances and natural soy wax.',
      'og:type': 'website',
      'og:url': 'https://sentcandles.netlify.app',
      'og:site_name': 'Sent. Candles',
      'og:image':
        'https://scontent.fmnl13-3.fna.fbcdn.net/v/t39.30808-6/469934853_122187473798166976_8143325943151332421_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=86c6b0&_nc_eui2=AeHLEbJ6MPdxxVbQx7KXLIuRJDq94DbqSd8kOr3gNupJ3yc9wuVWdi5nq9xYDgWyxG8qzK3qb15HRD0cxCmZDhPh&_nc_ohc=jpLhNdvBxB4Q7kNvwFG4hE5&_nc_oc=AdlCZ0eNhmGHWJnVQjqowk5fNR3qxONVVURE8gUYNwldkMUnbLB3mHPvCt70sIvDBxo&_nc_zt=23&_nc_ht=scontent.fmnl13-3.fna&_nc_gid=6f2Nf-iK6iPrc0QnURbB9g&oh=00_AfeZIHj4G2jiPoV5eOacBx51tp_MuM8KMcyiko3VWBenJw&oe=69042448',
      'og:image:width': '1200',
      'og:image:height': '630',
      'og:image:alt': 'Sent. Candles - Handcrafted Scented Candles',
      'og:locale': 'en_US',

      // Twitter Card (also shows on other platforms)
      'twitter:card': 'summary_large_image',
      'twitter:title': 'Sent. Candles - Handcrafted Scented Candles',
      'twitter:description':
        'Each candle is a carefully crafted vessel, preserving a sentiment through premium fragrances and natural soy wax.',
      'twitter:image':
        'https://scontent.fmnl13-3.fna.fbcdn.net/v/t39.30808-6/469934853_122187473798166976_8143325943151332421_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=86c6b0&_nc_eui2=AeHLEbJ6MPdxxVbQx7KXLIuRJDq94DbqSd8kOr3gNupJ3yc9wuVWdi5nq9xYDgWyxG8qzK3qb15HRD0cxCmZDhPh&_nc_ohc=jpLhNdvBxB4Q7kNvwFG4hE5&_nc_oc=AdlCZ0eNhmGHWJnVQjqowk5fNR3qxONVVURE8gUYNwldkMUnbLB3mHPvCt70sIvDBxo&_nc_zt=23&_nc_ht=scontent.fmnl13-3.fna&_nc_gid=6f2Nf-iK6iPrc0QnURbB9g&oh=00_AfeZIHj4G2jiPoV5eOacBx51tp_MuM8KMcyiko3VWBenJw&oe=69042448',
    },
  },
});
