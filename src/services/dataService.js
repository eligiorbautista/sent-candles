import { databaseService } from '../config/supabase.js';
import { Sparkles, Clock, Leaf, Wind } from 'lucide-react';

// Icon mapping for features
const iconMap = {
  'Sparkles': Sparkles,
  'Clock': Clock,
  'Leaf': Leaf,
  'Wind': Wind,
};

// Transform database data to match component expectations
export const dataService = {
  // Products
  async getProducts() {
    try {
      const products = await databaseService.getProducts();
      const transformed = (products || []).map(transformProduct);
      return transformed;
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  },

  async getProductById(id) {
    try {
      const product = await databaseService.getProductById(id);
      return transformProduct(product);
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  },

  async getProductsByCategory(categorySlug) {
    try {
      const products = await databaseService.getProductsByCategory(categorySlug);
      return (products || []).map(transformProduct);
    } catch (error) {
      console.error('Error fetching products by category:', error);
      return [];
    }
  },

  async getFeaturedProducts() {
    try {
      const products = await databaseService.getFeaturedProducts();
      return (products || []).map(transformProduct);
    } catch (error) {
      console.error('Error fetching featured products:', error);
      return [];
    }
  },

  // Categories
  async getCategories() {
    try {
      const categories = await databaseService.getCategories();
      return (categories || []).map(cat => ({
        id: cat.slug,
        name: cat.name,
        slug: cat.slug
      }));
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  },

  // Events
  async getEvents() {
    try {
      const events = await databaseService.getEvents();
      
      if (!events || !Array.isArray(events)) {
        return [];
      }
      
      const transformed = events.map(transformEvent).filter(Boolean);
      return transformed;
    } catch (error) {
      console.error('Error fetching events:', error);
      return [];
    }
  },

  // About content
  async getAboutContent() {
    try {
      const about = await databaseService.getAboutContent();
      return {
        tagline: about?.tagline,
        heading: about?.heading,
        paragraphs: about?.paragraphs,
        imagePlaceholder: about?.image_placeholder
      };
    } catch (error) {
      console.error('Error fetching about content:', error);
      return {
        tagline: 'Our Story',
        heading: 'About Sent. Candles',
        paragraphs: ['Default content'],
        imagePlaceholder: ''
      };
    }
  },

  // Features
  async getFeatures() {
    try {
      const features = await databaseService.getFeatures();
      
      if (!features || !Array.isArray(features)) {
        return [];
      }
      
      const transformed = features.map(feature => ({
        title: feature.title,
        description: feature.description,
        icon: iconMap[feature.icon] || Sparkles
      }));
      
      return transformed;
    } catch (error) {
      console.error('Error fetching features:', error);
      return [];
    }
  },

  // Contact info
  async getContactInfo() {
    try {
      const contact = await databaseService.getContactInfo();
      return {
        email: contact.email,
        phone: contact.phone,
        location: contact.location,
        address: contact.address
      };
    } catch (error) {
      console.error('Error fetching contact info:', error);
      return {
        email: '',
        phone: '',
        location: '',
        address: ''
      };
    }
  },

  // Social media
  async getSocialMedia() {
    try {
      const social = await databaseService.getSocialMedia();
      return {
        facebook: social.facebook,
        instagram: social.instagram
      };
    } catch (error) {
      console.error('Error fetching social media:', error);
      return {
        facebook: '',
        instagram: ''
      };
    }
  },

  // Site info
  async getSiteInfo() {
    try {
      const site = await databaseService.getSiteInfo();
      
      const transformed = {
        name: site?.name,
        tagline: site?.tagline,
        description: site?.description,
        year: site?.year
      };
      
      return transformed;
    } catch (error) {
      console.error('Error fetching site info:', error);
      return {
        name: 'Sent.',
        tagline: 'Scented Candles',
        description: 'Creating warmth and ambiance for your home, one candle at a time.',
        year: new Date().getFullYear()
      };
    }
  },

  // Navigation links
  async getNavLinks() {
    try {
      const links = await databaseService.getNavLinks();
      return links.map(link => ({
        name: link.name,
        href: link.href
      }));
    } catch (error) {
      console.error('Error fetching nav links:', error);
      return [];
    }
  },

  // Footer links
  async getFooterLinks() {
    try {
      const links = await databaseService.getFooterLinks();
      return links.map(link => ({
        name: link.name,
        href: link.href
      }));
    } catch (error) {
      console.error('Error fetching footer links:', error);
      return [];
    }
  },

  // Assets
  async getAssets() {
    try {
      const assets = await databaseService.getAssets();
      return (assets || []).map(asset => ({
        id: asset.id,
        key: asset.key,
        type: asset.type,
        url: asset.url,
        altText: asset.alt_text,
        description: asset.description,
        sortOrder: asset.sort_order
      }));
    } catch (error) {
      console.error('Error fetching assets:', error);
      return [];
    }
  },

  async getAssetByKey(key) {
    try {
      const asset = await databaseService.getAssetByKey(key);
      if (!asset) return null;
      return {
        id: asset.id,
        key: asset.key,
        type: asset.type,
        url: asset.url,
        altText: asset.alt_text,
        description: asset.description,
        sortOrder: asset.sort_order
      };
    } catch (error) {
      console.error('Error fetching asset by key:', error);
      return null;
    }
  },

  // Hero content
  async getHeroContent() {
    try {
      const hero = await databaseService.getHeroContent();
      return {
        badge: hero?.badge,
        heading: {
          line1: hero?.heading_line1,
          line2: hero?.heading_line2
        },
        description: hero?.description,
        buttons: {
          primary: {
            text: hero?.primary_button_text,
            link: hero?.primary_button_link
          },
          secondary: {
            text: hero?.secondary_button_text,
            link: hero?.secondary_button_link
          }
        },
        stats: hero?.stats || [],
        heroImage: hero?.hero_image
      };
    } catch (error) {
      console.error('Error fetching hero content:', error);
      return {
        badge: 'Handcrafted with Love',
        heading: {
          line1: 'Hand-Crafted',
          line2: 'Candles'
        },
        description: 'Each candle is a carefully crafted vessel, preserving the intangible: a Sentiment.',
        buttons: {
          primary: {
            text: 'View Collection',
            link: '/products'
          },
          secondary: {
            text: 'Our Story',
            link: '#about'
          }
        },
        stats: [
          { value: '100%', label: 'Soy Wax' },
          { value: '15+', label: 'Hours Burn' },
          { value: '17+', label: 'Scents' }
        ],
        heroImage: ''
      };
    }
  }
};

// Helper functions to transform database data
function transformProduct(product) {
  return {
    id: product.id,
    name: product.name,
    scent: product.scent,
    description: product.description,
    size: product.size,
    burnTime: product.burn_time,
    category: product.category_slug,
    featured: product.featured,
    variants: product.product_variants?.map(variant => ({
      name: variant.name,
      price: variant.price,
      stockStatus: variant.stock_status
    })) || [],
    imageUrls: product.product_images?.sort((a, b) => a.sort_order - b.sort_order).map(img => img.url) || [],
    availableScents: product.product_scents?.map(scent => scent.scent) || []
  };
}

function transformEvent(event) {
  if (!event) return null;
  return {
    id: event.id,
    title: event.title,
    eventDate: event.event_date,
    description: event.description,
    category: event.category,
    imageUrls: event.event_images?.sort((a, b) => a.sort_order - b.sort_order).map(img => img.url) || []
  };
}
