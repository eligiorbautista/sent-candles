import { useState, useEffect } from 'react';
import { adminDataService } from '../services/adminDataService.js';

// Generic hook for admin data fetching with CRUD operations
export function useAdminData(fetchFunction, dependencies = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFunction();
      setData(result);
    } catch (err) {
      setError(err);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, dependencies);

  return { data, loading, error, refetch };
}

// Specific hooks for different admin data types
export function useAdminProducts() {
  return useAdminData(adminDataService.getProducts);
}

export function useAdminEvents() {
  return useAdminData(adminDataService.getEvents);
}

export function useAdminCategories() {
  return useAdminData(adminDataService.getCategories);
}

export function useAdminAboutContent() {
  return useAdminData(adminDataService.getAboutContent);
}

export function useAdminFeatures() {
  return useAdminData(adminDataService.getFeatures);
}

export function useAdminContactInfo() {
  return useAdminData(adminDataService.getContactInfo);
}

export function useAdminSocialMedia() {
  return useAdminData(adminDataService.getSocialMedia);
}

export function useAdminSiteInfo() {
  return useAdminData(adminDataService.getSiteInfo);
}

// Hook for admin operations with loading states
export function useAdminOperations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const executeOperation = async (operation) => {
    try {
      setLoading(true);
      setError(null);
      const result = await operation();
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, executeOperation };
}
