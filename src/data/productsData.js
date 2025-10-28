// Product categories and series
export const categories = [
  { id: 'all', name: 'All Products', slug: 'all' },
  { id: 'latte_series', name: 'Latte Series', slug: 'latte_series' },
  { id: 'sweet_series', name: 'Sweet Series', slug: 'sweet_series' },
  { id: 'personalized', name: 'Personalized Labels', slug: 'personalized' },
  { id: 'cement_pot', name: 'Cement Pot', slug: 'cement_pot' },
  { id: 'piper_paw', name: 'Piper Paw Collection', slug: 'piper_paw' },
  { id: 'roses', name: 'Roses Collection', slug: 'roses' },
  { id: 'classic_molded', name: 'Classic Molded', slug: 'classic_molded' },
];

// Products data with categories
export const productsData = [
  {
    id: 1,
    name: 'Molded Candle (Unscented)',
    scent: 'Unscented',
    description:
      'A collection of beautifully molded unscented candles in various shapes and sizes.',
    category: 'classic_molded',
    featured: false,
    variants: [
      {
        name: 'Yarn',
        price: 35,
        stockStatus: 'pre-order',
      },
      {
        name: 'Pyramid',
        price: 35,
        stockStatus: 'pre-order',
      },
      {
        name: 'Small Bubble',
        price: 25,
        stockStatus: 'pre-order',
      },
      {
        name: 'Big Bubble',
        price: 55,
        stockStatus: 'pre-order',
      },
    ],
    imageUrls: [
      'https://scontent.fmnl13-4.fna.fbcdn.net/v/t39.30808-6/470173491_122187492638166976_4991608339360746738_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeGFu968cKEUhmZbuvr9c34fXwzr7kuEqPhfDOvuS4So-Gwp0B0tV-dW3r8Qm85KngHyBjdIehDpQdBgjnm8hfaf&_nc_ohc=aTEGUGYbhQ0Q7kNvwFTdiX1&_nc_oc=AdlunW8vnkn0Ri1fX1UbdwCA6iyxcL-YOKEoWavCAeameDuj0r0wJYHeyVkUNAy4WZI&_nc_zt=23&_nc_ht=scontent.fmnl13-4.fna&_nc_gid=r_xd2WyS4R1RYuMzSxg4kA&oh=00_Aff1DCni2UtBdqUDcO4GUivcAmWl48feSsEuYt0MmUnbbQ&oe=69046E1B',
    ],
    availableScents: [],
    
  },
  {
    id: 2,
    name: 'Molded Candle (Scented)',
    scent: 'Multiple Scents Available',
    description:
      'A collection of beautifully molded scented candles in various shapes and sizes.',
    category: 'classic_molded',
    featured: true,
    variants: [
      {
        name: 'Yarn',
        price: 60,
        stockStatus: 'pre-order',
      },
      {
        name: 'Pyramid',
        price: 60,
        stockStatus: 'pre-order',
      },
      {
        name: 'Small Bubble',
        price: 45,
        stockStatus: 'pre-order',
      },
      {
        name: 'Big Bubble',
        price: 100,
        stockStatus: 'pre-order',
      },
    ],
    imageUrls: [
      'https://scontent.fmnl13-1.fna.fbcdn.net/v/t39.30808-6/470235225_122187492266166976_4297334660378622238_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeG_3vX78-5ikODYuHb_frj861D6jtJL65nrUPqO0kvrmbEfPOqpRX4-aMpE0m_bJIQxgvH0DFP6snNmGRqT8lVa&_nc_ohc=xZ6pe5Uk1P0Q7kNvwHNbqbY&_nc_oc=AdnBZoRQPG0nwN4Ea51Wsy3QaFgZRBmaNqsHwa5NBhQbn4n2Q8n5zb-1xaWWA8GtOkg&_nc_zt=23&_nc_ht=scontent.fmnl13-1.fna&_nc_gid=iv78XgJt4pw58mlZpfSOFA&oh=00_Afc3dsxDMrexxBgyC-EIFO-bc4OB0daKoLppKyHmpWrrvQ&oe=69047418',
      'https://scontent.fmnl13-4.fna.fbcdn.net/v/t39.30808-6/470137891_122187492260166976_6232101646261387847_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeEg8yQ_Qq76sIM4GbdDPmfRAA5eTXolyuAADl5NeiXK4MyFPFfd-m6slm3fKBU6YZz5RW4ndiIjwszweh0U0Lmt&_nc_ohc=8KOi_V_m59QQ7kNvwHjoQ_f&_nc_oc=AdkVjj2xj_B7dW0Rk6WXOBaGe8Iz0SjdY7gVrT7mA-YiHWNsOdZhMPsYVm8jkVMunPI&_nc_zt=23&_nc_ht=scontent.fmnl13-4.fna&_nc_gid=hVzyi8cHd_VEJhXHSNFGSA&oh=00_Afe1uXVg__D7_w0PCwd6DjggOTcTvSQVJF27RMRUA1RC9g&oe=69046BCC',
    ],
    availableScents: [
      'Lavender',
      'Green Tea',
      'French Vanilla',
      'Apple Cinnamon',
      'Lemongrass and Ginger',
      'Watermelon',
      'Coffee and Chocolate',
      'Lily Flowers',
      'Wassail',
      'Cinnamon',
      'Strawberry',
      'Honeydew Melon',
      'Cucumber Melon',
      'Citronella',
      'Baby Powder',
      'Coffee',
      'Orange Blossom',
    ],
    
  },

  {
    id: 3,
    name: 'Roses Collection',
    scent: 'Multiple Scents Available',
    description:
      'Perfect for setting a romantic ambiance or adding a touch of elegance to any space.',
    category: 'roses',
    featured: false,
    variants: [
      {
        name: '200g',
        price: 230,
        stockStatus: 'out-of-stock',
      },
    ],
    imageUrls: [
      'https://scontent.fmnl13-4.fna.fbcdn.net/v/t39.30808-6/470155392_122187826958166976_634594096652352313_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeHncOpE51Ey3M4nuX-Ikp8_7d0fWxzkX53t3R9bHORfnXagiJZ0uelHWfSGMPPwEmTBSfJzghu5pYfndimRfyAi&_nc_ohc=N7Op2G86bvAQ7kNvwGye4iM&_nc_oc=Adk3gFCveWucI9D1oUs2PWRghw5lmV2dxHPvbKwaS_ju6tLPUX2aqn19xYuwzRBJ86E&_nc_zt=23&_nc_ht=scontent.fmnl13-4.fna&_nc_gid=6tj6zN7_t6XOHETtORhr4A&oh=00_Afei3lBcjE_ImTEQEAOt7eNY2jdXtlnvo1BQ1qazwGyIpw&oe=69043063',
      'https://scontent.fmnl13-4.fna.fbcdn.net/v/t39.30808-6/470226270_122187827054166976_4129326006821618088_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeGO0BZbhl_YMq-Jn3pWocCBjrxQ9WIRgsWOvFD1YhGCxaqVpcPYo_p50pZj8wsKQJ98NXa_Yytc-zJdQem_SWUL&_nc_ohc=fd56MoiNcJcQ7kNvwECxGFP&_nc_oc=Adn94dWhz3bw_qe1BJNj7JkkwMrTbtJYKRIep-9TtFBY3_9bpPDFzSuIBcNUfwloWf8&_nc_zt=23&_nc_ht=scontent.fmnl13-4.fna&_nc_gid=Ore9q-Wb3gb1jRfL0Gq4rw&oh=00_AfcKsMd3zlHLP1EY0IV9nVn6G2aGpguFtilvsMTkJjQE-Q&oe=6904539F',
      'https://scontent.fmnl13-2.fna.fbcdn.net/v/t39.30808-6/470179698_122187827024166976_1040943124730468388_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeFNJnLN0jCD_gikv65a6EVm66-sDMIURJfrr6wMwhREl-BT8oH0jkA_YUF-apiBm_GW_p8HSyEwUo8EsbiGROG0&_nc_ohc=fap8GlbUZuMQ7kNvwFXg5pN&_nc_oc=Adl1ffZbDxWIUIYijMy-tDFBZU1oQ8z-wVmrlNyZ8f2wQoT3S2_WN3Bz9-fLW0ontP4&_nc_zt=23&_nc_ht=scontent.fmnl13-2.fna&_nc_gid=8Ln5c9xk7aqddAK7Qc7QGA&oh=00_AfdmqSV2JUctaWnrDDioYAISrLiShdy34KJcUEmzLTKeNQ&oe=6904481B',
      'https://scontent.fmnl13-4.fna.fbcdn.net/v/t39.30808-6/470139057_122187826976166976_1130447709184846103_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeGDIK6OFM7i0hBdC4r6r7xr1S_PPteDTRbVL88-14NNFm8BuFNsSixN-YMrwaauXixS8v1YglzzyC9utl60KSLV&_nc_ohc=dmAOYJRyODoQ7kNvwE1_W8r&_nc_oc=AdlLOXs6eI-HJbcgC6NaI8Vt7wHPFuZgUSSwc9U7Kd0uzo3PP_-d067Z_MMPH-_PSX0&_nc_zt=23&_nc_ht=scontent.fmnl13-4.fna&_nc_gid=jXE5skWcMQRCYt07_RnMIA&oh=00_AfeG6b4MpxFWMkq6PoiB-wQLvHQ5tqK67UlKonYXFYuZkQ&oe=69045209',
    ],
    availableScents: [
      'Lavender',
      'Green Tea',
      'French Vanilla',
      'Apple Cinnamon',
      'Lemongrass and Ginger',
      'Watermelon',
      'Coffee and Chocolate',
      'Lily Flowers',
      'Wassail',
      'Cinnamon',
      'Strawberry',
      'Honeydew Melon',
      'Cucumber Melon',
      'Citronella',
      'Baby Powder',
      'Coffee',
      'Orange Blossom',
    ],
    
  },
  {
    id: 4,
    name: 'Piper Paw Collection',
    scent: 'Multiple Scents Available',
    variants: [
      { name: 'Brown', price: 300, stockStatus: 'out-of-stock' },
      { name: 'White', price: 300, stockStatus: 'out-of-stock' },
      { name: 'Grey', price: 300, stockStatus: 'out-of-stock' },
    ],
    description:
      'Get ready to unleash the magic with our newest addition: the three-wick candles in the shape of adorable paw prints, part of our Piper Paw collection!\nAvailable in shades of brown, black, and white, these candles are designed to add a touch of charm and warmth to any space.',
    size: '200g',
    burnTime: '10-15 hours',
    category: 'piper_paw',
    featured: false,
    imageUrls: [
      'https://scontent.fmnl13-1.fna.fbcdn.net/v/t39.30808-6/470471893_122187980540166976_8803057418171129536_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeFKPgJtJ-95Y7UfvGPJ7lVoQuMoWeqa061C4yhZ6prTraHTdaFdlvhSv6FvyhInsMo1sg_cRRx2zTRrl7qaLp5R&_nc_ohc=IaQG1RKx8eIQ7kNvwH39nJZ&_nc_oc=AdlZvG76GYbgY3yNOGST0P3AZNo3InGfk-zmq8A2owB5oZolIQcvvcRiPYKlc3DqFSE&_nc_zt=23&_nc_ht=scontent.fmnl13-1.fna&_nc_gid=wwRdh-qXUQoMWvgXnb4DLA&oh=00_AffEYQHUHRR1AYhJwz1Je_S26H8xb4E44czj1j-oBR_lPQ&oe=690458F6',
      'https://scontent.fmnl13-3.fna.fbcdn.net/v/t39.30808-6/470136073_122187980606166976_5740907548647079369_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeGlXjUUogE09UFeD6k15B7yRR-LXlaGl9dFH4teVoaX1yfhycrZ08pF_lO0mmwQFg4aGCCcl8uGpn7a77DfNphI&_nc_ohc=cR20mm1Z5dAQ7kNvwEaTSo1&_nc_oc=AdlQzHemotHtnfiMfrx2_J0mPlIAbtE583hpRGZ3N7swfj0mSwragu5vteJpRUuV19s&_nc_zt=23&_nc_ht=scontent.fmnl13-3.fna&_nc_gid=jyFKlTuvVZj4F5l01PIUGg&oh=00_AfetDaSwdAtUDJCQBCI1_Wrr4RAV3Kh-p_HvZ_8_F0z7uQ&oe=69043920',
      'https://scontent.fmnl13-3.fna.fbcdn.net/v/t39.30808-6/470163291_122187980792166976_532349672506682740_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeHBhFjvdyrUbIJorvlmYlggl0uHza-XXyiXS4fNr5dfKGQNH_nh2SxSi4UkgCQJUCRWAsY2OozMBfyeMMGdLnQF&_nc_ohc=aaAMbFUa_BIQ7kNvwH9aHa3&_nc_oc=AdlDSU_cPSuwcgMPuQF3h5nGmJWZl7ZdciZ15EUcj39sj-ieJ3fWK19nexU7iu558TU&_nc_zt=23&_nc_ht=scontent.fmnl13-3.fna&_nc_gid=1iuxQIc58UckyGVkWQ9Htw&oh=00_AfdKap3ix7bz3XCL2QJCavfLIBcKdI_NuL0F_LyClxV3xA&oe=6904379F',
    ],
    availableScents: [
      'Lavender',
      'Green Tea',
      'French Vanilla',
      'Apple Cinnamon',
      'Lemongrass and Ginger',
      'Watermelon',
      'Coffee and Chocolate',
      'Lily Flowers',
      'Wassail',
      'Cinnamon',
      'Strawberry',
      'Honeydew Melon',
      'Cucumber Melon',
      'Citronella',
      'Baby Powder',
      'Coffee',
      'Orange Blossom',
    ],
    
  },
  {
    id: 5,
    name: 'Cement Pots',
    scent: 'Multiple Scents Available',
    variants: [
      { name: '2hr Small Round', price: 50, stockStatus: 'in-stock' },
      { name: 'Small Round', price: 80, stockStatus: 'in-stock' },
      { name: 'Small Square', price: 80, stockStatus: 'in-stock' },
    ],
    description:
      'Enhance your ambiance with our captivating scented candles, elegantly displayed in big round plain cement pots.\nTransform your home into a haven of comfort and tranquility with our scented candles in big round plain cement pots. ',
    size: '200g',
    burnTime: '10-15 hours',
    category: 'cement_pot',
    featured: false,
    imageUrls: [
      'https://scontent.fmnl13-2.fna.fbcdn.net/v/t39.30808-6/470990985_122188807700166976_4208734311687259488_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeHZSe6HvoLvL1oiTao6hTyBnmh25Iei7N-eaHbkh6Ls38bx4Idqf4OPO5Dt5eI5f3mcA6Gz1Lfwy0lZTRVx1oCX&_nc_ohc=zbO_GAk-9gEQ7kNvwH3pdc7&_nc_oc=AdkGeW2aP2zkITKRnIAGochw97qkGn2hB1YselgoDsCz1Nn8GlGORHgFC0BRbOr8Iw0&_nc_zt=23&_nc_ht=scontent.fmnl13-2.fna&_nc_gid=FJ1lc1vzZes4CzWYdHnODw&oh=00_Afdl-nEKh1n5LMbmGEFGNlK6YIsxuxjJt1Tv8aGHduObuQ&oe=690442DF',
      'https://scontent.fmnl13-2.fna.fbcdn.net/v/t39.30808-6/471065470_122188807730166976_8668277519536245436_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeET8v6BRnf9gl74t7b24MdtCFsfqFkcGtoIWx-oWRwa2ndJoSbwZr7EmQ0T6Xpo1IpmJOqhHJLgO69B8jskZjLh&_nc_ohc=dVpz3l3zOL0Q7kNvwHUrcR-&_nc_oc=Adkcs2OrA1DLUF62AbbQBng7tV3jh0HwzFPLK17vAtV-TYsHhT9nSaTEX4_UkLtW00Q&_nc_zt=23&_nc_ht=scontent.fmnl13-2.fna&_nc_gid=8JUqXC54byoMAAwxoWdFNg&oh=00_Afd1xYyTmSZMBF7UdGYRSnqbGLibTZAto5mpjHvGkw4XsQ&oe=69044362',
      'https://scontent.fmnl13-1.fna.fbcdn.net/v/t39.30808-6/470220852_122188808006166976_3757288279058696670_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeH03gfWGfq-u08U1q70S7Ar4OSrsDvcV_ng5KuwO9xX-fYZC--vG68QW2OMvFg6kZK2Hgksum1GAYy8v7eV6zZD&_nc_ohc=dxBslk-OvKUQ7kNvwHKlPxF&_nc_oc=Adl4ppzTwpf5u6-7zHWLNX5Pf4f9dOt8TZZVoFc9satbYUHOos26gZK7xAvql-KMDfQ&_nc_zt=23&_nc_ht=scontent.fmnl13-1.fna&_nc_gid=mTNCyMS5q0znVzgfPVAZXQ&oh=00_Afd0o2wGUBaToDe4YKmOwdK6R9pM9g-uYifmI9G_lpqapg&oe=6904516D',
    ],
    availableScents: [
      'Lavender',
      'Green Tea',
      'French Vanilla',
      'Apple Cinnamon',
      'Lemongrass and Ginger',
      'Watermelon',
      'Coffee and Chocolate',
      'Lily Flowers',
      'Wassail',
      'Cinnamon',
      'Strawberry',
      'Honeydew Melon',
      'Cucumber Melon',
      'Citronella',
      'Baby Powder',
      'Coffee',
      'Orange Blossom',
    ],
    
  },
  {
    id: 6,
    name: 'Personalized Scented Candles',
    scent: 'Multiple Scents Available',
    variants: [
      { name: '50g Tin Can', price: 80, stockStatus: 'pre-order' },
      { name: '100g Tin Can', price: 140, stockStatus: 'pre-order' },
    ],
    description:
      'Personalized scented candles in tin cans – perfect for weddings, birthdays, and any special occasion. A thoughtful and fragrant souvenir your guests will surely love! Available in multiple scents with customizable packaging. Handcrafted with love.',
    size: '100g',
    burnTime: '10-15 hours',
    category: 'personalized',
    featured: true,
    imageUrls: [
      'https://scontent.fmnl13-1.fna.fbcdn.net/v/t39.30808-6/526748683_122228402978166976_6957861607550096628_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeEQqTV9_f3m8va2KdUvQFT2iiHByaN-3y-KIcHJo37fL7gzdRo3eMbVYWkcNDONZTJotl3hJ-PUO9F88l7TZQMj&_nc_ohc=1vB7XXg9wGwQ7kNvwHXUfH0&_nc_oc=AdmdD3_iamBNlEZ8DJuwxigJo-HQ9ZXfx-gxYQUdsvaOLaYw6eSfJuY1z1tU3ShH4ps&_nc_zt=23&_nc_ht=scontent.fmnl13-1.fna&_nc_gid=VQ7lnBYjbS-AMnX5-3Jrhw&oh=00_Afdr2y1hBm4CDgh5pNZKkL8Sz6XaZNMRhkFITmTFbwP1Bw&oe=69044E0A',
      'https://scontent.fmnl13-1.fna.fbcdn.net/v/t39.30808-6/525993822_122228403044166976_7564563139078237952_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeHI6CyGjo7QqHLbALXDdjdwP6YblTCSvLg_phuVMJK8uHEEXZjVwWngMMjjdneWoj0lkd3_i_dgJwK7sTqYrQV5&_nc_ohc=107ZX5RHSEYQ7kNvwEkO8xq&_nc_oc=Adkadcq79xcqCHytilXAV0jzWISZLqLpPcZjHa0weNDGznFdLxhMDEfjSjVF3aaRHc8&_nc_zt=23&_nc_ht=scontent.fmnl13-1.fna&_nc_gid=uHuEvt663CQU0pHiZOVqKA&oh=00_AfdF4nMADL0CAdAGx4mJcT7buVnoL1__lpc5oWyjxTTBhQ&oe=690441E7',
      'https://scontent.fmnl13-4.fna.fbcdn.net/v/t39.30808-6/525845796_122228403092166976_5189825871143772859_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeEyogItZZMILC9m8F9X15rLCfE0DxeIK34J8TQPF4grfhVL278-t8vyTlv8_1KD1odcxmWaU7iZ5Bpo0R2w_2tW&_nc_ohc=jWiBuWhqLAkQ7kNvwGXr57P&_nc_oc=AdlJYreGr7clqBWDlJ2OBrkSzEPd9APh_sFcSGwCMrUENJWrrXip63r8f6UbBPD4BDQ&_nc_zt=23&_nc_ht=scontent.fmnl13-4.fna&_nc_gid=DTJNpc6ticExAlJ4IJtcAg&oh=00_AffM4I9rVXeMSQZTVbhFxNmNui25fF_6696TcZHQcNFL1w&oe=69045379',
      'https://scontent.fmnl13-3.fna.fbcdn.net/v/t39.30808-6/527100104_122228403134166976_6092479012307246142_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeHowls_9eJLU54Z9w3LHDUt_Kw1ra5Wcp78rDWtrlZyntf6KSika3U816f5fnbyY9pBP7NaMdSFNCl93EiQCXVK&_nc_ohc=h6-gXbMQ9T4Q7kNvwEqLmv8&_nc_oc=AdkQvE2zReY5CmFeEKGNav4DTI9ZEysy7iApePTGD_VOM_ERED8wRiFIRbbfTYBcei4&_nc_zt=23&_nc_ht=scontent.fmnl13-3.fna&_nc_gid=4NmLTismGnsJH21x4WDIrg&oh=00_AfcFEhrmLhCrcDKjDLot3igwtdIjqhS01i74t4VgnstNnQ&oe=69044D43',
      'https://scontent.fmnl13-4.fna.fbcdn.net/v/t39.30808-6/527749545_122228403176166976_2817147658121626726_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeFEaRRQ6wtRKyVuzLUnwx9QDnc4ky-ivlIOdziTL6K-UvU1WvxFB4NK1KjEjJNKaYykeGHB65ynZ4scsK1o3trW&_nc_ohc=FKV8yA_JNpUQ7kNvwGfsWqB&_nc_oc=Adl8904syA7UW8Yg1zko-zMYwrJB7dlABFqOgDVr-zEd64QJQ9Jp1y9UzYYYCnukQEw&_nc_zt=23&_nc_ht=scontent.fmnl13-4.fna&_nc_gid=rDXSi4ebbDZS7d1fzwpsHg&oh=00_Afe2cHQQoqhOEKkY5Tb-uZblL_FVHk8AguHW9hODrqEpRQ&oe=690457D7',
    ],
    availableScents: [
      'Lavender',
      'Green Tea',
      'French Vanilla',
      'Apple Cinnamon',
      'Lemongrass and Ginger',
      'Watermelon',
      'Coffee and Chocolate',
      'Lily Flowers',
      'Wassail',
      'Cinnamon',
      'Strawberry',
      'Honeydew Melon',
      'Cucumber Melon',
      'Citronella',
      'Baby Powder',
      'Coffee',
      'Orange Blossom',
    ],
    
  },
  {
    id: 7,
    name: 'Strawberry',
    scent: 'Strawberry',
    variants: [{ name: 'Regular', price: 345, stockStatus: 'in-stock' }],
    description:
      'Juicy, fruity, and uplifting. Hand-poured soy candle crafted to bring fragrance and warmth into your space. Part of our Sweet Series fruit-inspired collection.',
    size: '200g',
    burnTime: '10-15 hours',
    category: 'sweet_series',
    featured: true,
    imageUrls: [
      'https://scontent.fmnl13-4.fna.fbcdn.net/v/t39.30808-6/533578549_122230614512166976_2107150422168102053_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeGEaV9sJWqAdhkgVwtRlyQcaFt-kjsWF4RoW36SOxYXhMjAUhEClMMyJFkCr_Ol4OZRi27rLWKixDyE4Ut2YlN0&_nc_ohc=S80Na7QPXBYQ7kNvwHgPNU9&_nc_oc=AdkjJzt9ZMvVVDzN4RrGqvKpaqK2eI5qHKeqKnruOI2QVEwIoOFZcjyNMFvEmAHPHCw&_nc_zt=23&_nc_ht=scontent.fmnl13-4.fna&_nc_gid=VkkMC4ue6C4_DC772jCmvg&oh=00_AfeVxQvLfJGUsEnlV-bcmV9f0BbiatroFjF0sGM23iXVOA&oe=690462E3',
      'https://scontent.fmnl13-3.fna.fbcdn.net/v/t39.30808-6/535322675_122230614566166976_420400448146119682_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeGnEB5ITqV1MiIp1OjOG79bkyFw8bMxI2yTIXDxszEjbBxBvaWzYvfw1unkKAnr0nDJyt8XAg3W9-xu5f3Jvy9t&_nc_ohc=c3sDgz9HqZUQ7kNvwGo_yEC&_nc_oc=AdltLYFblz9AAfq8D_ZiUlDi3u0Wb_VvAWqg_eHbwCMVfeyoK416nWQtsStgwVMqUdI&_nc_zt=23&_nc_ht=scontent.fmnl13-3.fna&_nc_gid=E5afY9yZ6eiewHEfHbagVA&oh=00_AffoLpqXKFWpC0BG5EQ4APk4X6rA99XFgis1BCPFRrUuzQ&oe=6904505F',
    ],
    
  },
  {
    id: 8,
    name: 'Honeydew Melon',
    scent: 'Honeydew Melon',
    variants: [{ name: 'Regular', price: 345, stockStatus: 'in-stock' }],
    description:
      'Bright, sweet, and sunny. Hand-poured soy candle crafted to bring fragrance and warmth into your space. Part of our Sweet Series fruit-inspired collection.',
    size: '200g',
    burnTime: '10-15 hours',
    category: 'sweet_series',
    featured: true,
    imageUrls: [
      'https://scontent.fmnl13-1.fna.fbcdn.net/v/t39.30808-6/539746854_122232019304166976_1089105412316707329_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeEmzwZ1lHs3OnxcaNIgoQyM8TLLM9YmppbxMssz1iamliYlhuUUc9pmKezaiZrQtHp0Wu1KMa807Iu6HTP39oYX&_nc_ohc=fkL36HaCzIIQ7kNvwEw4KK4&_nc_oc=AdkBfT3iMtcdqd2zslEgaYzKy_ni8PLWfvKzCZPi2nbbwJJX5uh4hrN4-z4NUwc6FVg&_nc_zt=23&_nc_ht=scontent.fmnl13-1.fna&_nc_gid=-iMJ8GExNeMx0PGfF32ZzA&oh=00_Afc25V1OW846PyXSzv39npihJ4-GC1gyKgEEMlIYpcDehw&oe=69044EC7',
      'https://scontent.fmnl13-2.fna.fbcdn.net/v/t39.30808-6/540708864_122232019298166976_8338567951277579031_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeE_PKDew8seMBdmgG8ztxhDlDQNLIQQdX6UNA0shBB1fglqn6b_2KJbYKhfnvxiuax0ys4cnL1hOBeAaEyae5xg&_nc_ohc=1ncC4qbNBqcQ7kNvwH_qJ_4&_nc_oc=Adl1woNW7H4rBVyin1Mv0vwHvL1g5_zZDl6ay1SsD5HMxazX8uLproO-ZGIsO8kQ-yg&_nc_zt=23&_nc_ht=scontent.fmnl13-2.fna&_nc_gid=7J_18xUQFoFuDdKNJasO2w&oh=00_AfeTnpectWzReT60b9O8fBX4kTckk7MDa-V4_oOWWdqveQ&oe=69044A29',
    ],
    
  },
  {
    id: 9,
    name: 'Sweet Cucumber Melon',
    scent: 'Cucumber Melon',
    variants: [{ name: 'Regular', price: 345, stockStatus: 'in-stock' }],
    description:
      'Crisp, refreshing, and light. Hand-poured soy candle crafted to bring fragrance and warmth into your space. Part of our Sweet Series fruit-inspired collection.',
    size: '200g',
    burnTime: '10-15 hours',
    category: 'sweet_series',
    featured: true,
    imageUrls: [
      'https://scontent.fmnl13-1.fna.fbcdn.net/v/t39.30808-6/540677442_122232715550166976_562081278058416896_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeGy34GTn7cLMDtHodDuH3hMnoxWv9AyU2SejFa_0DJTZPDonn_mzEJ5Y-VAbp8_dxvAaNjBtWPLuZxa38cXo9_D&_nc_ohc=w5CTKVgDd4UQ7kNvwHWZLiI&_nc_oc=AdmzApqvGUPYRcZqNuLV2KqZBy7ntgbH6W4VIGCtXLmTg8DhoetUfdQUvMVeoI3RS4I&_nc_zt=23&_nc_ht=scontent.fmnl13-1.fna&_nc_gid=Fa7cewwrDdXSjIjMn2-18g&oh=00_AfeWbIDxosJJP3kpGHuFCTAbDLmkAPAhhwPDdqUo-73mJw&oe=6904378F',
      'https://scontent.fmnl13-1.fna.fbcdn.net/v/t39.30808-6/540483458_122232715514166976_7110332126951523866_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeE3UvvWVVDkB-uIO_gsLEWOAvPqB3r3PvMC8-oHevc-86WtKDFfEPdjMyPDR7XF88kDyNfPEjORIClX7ly0c_oo&_nc_ohc=JvVjPFnj7GkQ7kNvwGgrGL9&_nc_oc=Adn561BlrL5SYoUm6wAbMLxybQo3f6xEcdmlFZrItojZhbLIp10BFz3RIJMD-vpge74&_nc_zt=23&_nc_ht=scontent.fmnl13-1.fna&_nc_gid=8Sxrpe3PJkKNdcIDIRcdWw&oh=00_Afc0iT0GlOLl4uTqqdzy2aCrWZOTer7rvO55TVGry6JHjQ&oe=69048945',
    ],
    
  },
  {
    id: 10,
    name: 'Iced Coffee Latte Candle',
    scent: 'Iced Coffee Latte',
    description:
      "First Collab Drop! Sent Candles × La Farine Cafe. We're brewing something special — our Iced Coffee Latte Candle looks like your favorite drink, but yes... it's a candle! Available at La Farine Cafe, Brgy. Tongko, Tayabas City. Open daily from 11AM to 9PM.",
    size: 'Standard',
    burnTime: '10-15 hours',
    category: 'latte_series',
    featured: true,
    variants: [{ name: 'Regular', price: 300, stockStatus: 'in-stock' }],
    imageUrls: [
      'https://scontent.fmnl13-2.fna.fbcdn.net/v/t39.30808-6/559125174_122238275444166976_5513176457275375892_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=106&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeHx4R1gEISl6eXQJjoQX0fHe6uDiFp4LaN7q4OIWngtowwGjlpkKHH22TIr3nA-1jXkb_7Syk-2ydzUDcalrf_Y&_nc_ohc=ROWah5S9RqEQ7kNvwHt4uBg&_nc_oc=AdmDSsIna2aUQ-6iZEBCpDBxjS2Li0eDj0_zXyJCTu_A70Uv1zQUe8n8FJynnXLFyMk&_nc_zt=23&_nc_ht=scontent.fmnl13-2.fna&_nc_gid=FgmARrVlzld6ptQRSnnZZA&oh=00_AfftfM08QM0ywnXB7Mtcd25HRx9DFTrkanZESETCKSJUJw&oe=6904477C',
    ],
    
  },
];
