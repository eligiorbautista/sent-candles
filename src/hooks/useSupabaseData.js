import { useState, useEffect, useMemo } from 'react';
import { dataService } from '../services/dataService.js';

// Generic hook for data fetching
export function useSupabaseData(fetchFunction, dependencies = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFunction(); 
      setData(result);
    } catch (err) { 
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, dependencies);

  return { data, loading, error, refetch: fetchData };
}

// Specific hooks for different data types
export function useProducts() {
  const fetchProducts = useMemo(() => () => dataService.getProducts(), []);
  return useSupabaseData(fetchProducts);
}

export function useProduct(id) {
  const fetchProduct = useMemo(() => () => dataService.getProductById(id), [id]);
  return useSupabaseData(fetchProduct);
}

export function useProductsByCategory(categorySlug) {
  const fetchProductsByCategory = useMemo(() => () => dataService.getProductsByCategory(categorySlug), [categorySlug]);
  return useSupabaseData(fetchProductsByCategory);
}

export function useFeaturedProducts() {
  const fetchFeaturedProducts = useMemo(() => () => dataService.getFeaturedProducts(), []);
  return useSupabaseData(fetchFeaturedProducts);
}

export function useCategories() {
  const fetchCategories = useMemo(() => () => dataService.getCategories(), []);
  return useSupabaseData(fetchCategories);
}

export function useEvents() {
  const fetchEvents = useMemo(() => () => dataService.getEvents(), []);
  return useSupabaseData(fetchEvents);
}

export function useAboutContent() {
  const fetchAboutContent = useMemo(() => () => dataService.getAboutContent(), []);
  return useSupabaseData(fetchAboutContent);
}

export function useFeatures() {
  const fetchFeatures = useMemo(() => () => dataService.getFeatures(), []);
  return useSupabaseData(fetchFeatures);
}

export function useContactInfo() {
  const fetchContactInfo = useMemo(() => () => dataService.getContactInfo(), []);
  return useSupabaseData(fetchContactInfo);
}

export function useSocialMedia() {
  const fetchSocialMedia = useMemo(() => () => dataService.getSocialMedia(), []);
  return useSupabaseData(fetchSocialMedia);
}

export function useSiteInfo() {
  const fetchSiteInfo = useMemo(() => () => dataService.getSiteInfo(), []);
  return useSupabaseData(fetchSiteInfo);
}

export function useNavLinks() {
  const fetchNavLinks = useMemo(() => () => dataService.getNavLinks(), []);
  return useSupabaseData(fetchNavLinks);
}

export function useFooterLinks() {
  const fetchFooterLinks = useMemo(() => () => dataService.getFooterLinks(), []);
  return useSupabaseData(fetchFooterLinks);
}

export function useAssets() {
  const fetchAssets = useMemo(() => () => dataService.getAssets(), []);
  return useSupabaseData(fetchAssets);
}

export function useAssetByKey(key) {
  const fetchAssetByKey = useMemo(() => () => dataService.getAssetByKey(key), [key]);
  return useSupabaseData(fetchAssetByKey);
}

export function useHeroContent() {
  const fetchHeroContent = useMemo(() => () => dataService.getHeroContent(), []);
  return useSupabaseData(fetchHeroContent);
}