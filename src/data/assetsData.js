// Centralized assets and media configuration
// This file now provides a hook-based approach to fetch assets from Supabase

import { useAssets, useAssetByKey } from '../hooks/useSupabaseData.js';

// Hook to get all assets
export const useAssetsData = () => {
  return useAssets();
};

// Hook to get a specific asset by key
export const useAssetData = (key) => {
  return useAssetByKey(key);
};

// Helper function to get background images (for backward compatibility)
export const useBackgroundImages = () => {
  const { data: assets, loading, error } = useAssets();
  
  if (loading || error || !assets) {
    return {
      homeHero: '',
      productsHero: '',
      aboutHero: ''
    };
  }

  const backgroundImages = {};
  assets.forEach(asset => {
    if (asset.type === 'background_image') {
      backgroundImages[asset.key] = asset.url;
    }
  });

  return backgroundImages;
};

// Fallback static data (used when Supabase is not available)
export const fallbackBackgroundImages = {
  homeHero: 'https://scontent.fmnl13-2.fna.fbcdn.net/v/t39.30808-6/469962678_122187651044166976_7954804921486263238_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=86c6b0&_nc_eui2=AeEqHn9yb1LfFK981JY2EaFCS6XtV-KrBIlLpe1X4qsEiZKUyhBHKhfA_69Xoz3mQNQbouTGKUnCaW0r6IW8XSDL&_nc_ohc=1JpyGZAZRdAQ7kNvwGOELLE&_nc_oc=AdnQ08agtQ86p1sEW5y0T-qdZ9d5rSqihWIMchfiW1S9-qYBTmCg0hntlchbzErtAfo&_nc_zt=23&_nc_ht=scontent.fmnl13-2.fna&_nc_gid=8zYDGwOb8d_X9t5bb9ncZg&oh=00_AfcxX2stRHrosJZ8yPLe5xFeNBaE-LhCahXODzwgDx6RQw&oe=69044677',
  productsHero: 'https://scontent.fmnl13-2.fna.fbcdn.net/v/t39.30808-6/469962678_122187651044166976_7954804921486263238_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=86c6b0&_nc_eui2=AeEqHn9yb1LfFK981JY2EaFCS6XtV-KrBIlLpe1X4qsEiZKUyhBHKhfA_69Xoz3mQNQbouTGKUnCaW0r6IW8XSDL&_nc_ohc=1JpyGZAZRdAQ7kNvwGOELLE&_nc_oc=AdnQ08agtQ86p1sEW5y0T-qdZ9d5rSqihWIMchfiW1S9-qYBTmCg0hntlchbzErtAfo&_nc_zt=23&_nc_ht=scontent.fmnl13-2.fna&_nc_gid=8zYDGwOb8d_X9t5bb9ncZg&oh=00_AfcxX2stRHrosJZ8yPLe5xFeNBaE-LhCahXODzwgDx6RQw&oe=69044677',
  aboutHero: 'https://scontent.fmnl13-2.fna.fbcdn.net/v/t39.30808-6/469962678_122187651044166976_7954804921486263238_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=86c6b0&_nc_eui2=AeEqHn9yb1LfFK981JY2EaFCS6XtV-KrBIlLpe1X4qsEiZKUyhBHKhfA_69Xoz3mQNQbouTGKUnCaW0r6IW8XSDL&_nc_ohc=1JpyGZAZRdAQ7kNvwGOELLE&_nc_oc=AdnQ08agtQ86p1sEW5y0T-qdZ9d5rSqihWIMchfiW1S9-qYBTmCg0hntlchbzErtAfo&_nc_zt=23&_nc_ht=scontent.fmnl13-2.fna&_nc_gid=8zYDGwOb8d_X9t5bb9ncZg&oh=00_AfcxX2stRHrosJZ8yPLe5xFeNBaE-LhCahXODzwgDx6RQw&oe=69044677'
};
