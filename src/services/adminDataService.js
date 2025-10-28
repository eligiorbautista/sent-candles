import { databaseService } from '../config/supabase.js';
import { Sparkles, Clock, Leaf, Wind } from 'lucide-react';

// Icon mapping for features
const iconMap = {
  'Sparkles': Sparkles,
  'Clock': Clock,
  'Leaf': Leaf,
  'Wind': Wind,
};

// Admin data service with CRUD operations
export const adminDataService = {
  // =========================
  // PRODUCTS ADMIN
  // =========================
  
  async getProducts() {
    try {
      const products = await databaseService.getProducts();
      return (products || []).map(transformProduct).filter(Boolean);
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  },

  async createProduct(productData) {
    try {
      const { variants, imageUrls, availableScents, ...mainProduct } = productData;
      
      // Create main product
      const product = await databaseService.createProduct({
        name: mainProduct.name,
        scent: mainProduct.scent,
        description: mainProduct.description,
        size: mainProduct.size,
        burn_time: mainProduct.burnTime,
        category_slug: mainProduct.category,
        featured: mainProduct.featured || false
      });

      // Create variants
      if (variants && variants.length > 0) {
        console.log('Creating variants:', variants);
        for (const variant of variants) {
          const variantData = {
            product_id: product.id,
            name: variant.name,
            price: Number(variant.price) || 0,
            stock_status: variant.stockStatus || variant.stock_status || 'in-stock'
          };
          console.log('Creating variant with data:', variantData);
          await databaseService.createProductVariant(variantData);
        }
      }

      // Create images
      if (imageUrls && imageUrls.length > 0) {
        for (let i = 0; i < imageUrls.length; i++) {
          await databaseService.createProductImage({
            product_id: product.id,
            url: imageUrls[i],
            sort_order: i
          });
        }
      }

      // Create scents
      if (availableScents && availableScents.length > 0) {
        for (const scent of availableScents) {
          await databaseService.createProductScent({
            product_id: product.id,
            scent: scent
          });
        }
      }

      return product;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  async updateProduct(id, productData) {
    try {
      const { variants, imageUrls, availableScents, ...mainProduct } = productData;
      
      // Update main product
      const product = await databaseService.updateProduct(id, {
        name: mainProduct.name,
        scent: mainProduct.scent,
        description: mainProduct.description,
        size: mainProduct.size,
        burn_time: mainProduct.burnTime,
        category_slug: mainProduct.category,
        featured: mainProduct.featured || false
      });

      // Delete existing variants, images, and scents
      await databaseService.deleteProductVariantsByProductId(id);
      await databaseService.deleteProductImagesByProductId(id);
      await databaseService.deleteProductScentsByProductId(id);

      // Create new variants
      if (variants && variants.length > 0) {
        console.log('Updating variants:', variants);
        for (const variant of variants) {
          const variantData = {
            product_id: id,
            name: variant.name,
            price: Number(variant.price) || 0,
            stock_status: variant.stockStatus || variant.stock_status || 'in-stock'
          };
          console.log('Creating variant with data:', variantData);
          await databaseService.createProductVariant(variantData);
        }
      }

      // Create new images
      if (imageUrls && imageUrls.length > 0) {
        for (let i = 0; i < imageUrls.length; i++) {
          await databaseService.createProductImage({
            product_id: id,
            url: imageUrls[i],
            sort_order: i
          });
        }
      }

      // Create new scents
      if (availableScents && availableScents.length > 0) {
        for (const scent of availableScents) {
          await databaseService.createProductScent({
            product_id: id,
            scent: scent
          });
        }
      }
      
      return product;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  async deleteProduct(id) {
    try {
      await databaseService.deleteProduct(id);
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  // =========================
  // EVENTS ADMIN
  // =========================
  
  async getEvents() {
    try {
      const events = await databaseService.getEvents();
      return (events || []).map(transformEvent).filter(Boolean);
    } catch (error) {
      console.error('Error fetching events:', error);
      return [];
    }
  },

  async createEvent(eventData) {
    try {
      const { imageUrls, ...mainEvent } = eventData;
      
      // Create main event
      const event = await databaseService.createEvent({
        title: mainEvent.title,
        event_date: mainEvent.eventDate ? new Date(mainEvent.eventDate).toISOString().split('T')[0] : null,
        description: mainEvent.description,
        category: mainEvent.category
      });

      // Create images
      if (imageUrls && imageUrls.length > 0) {
        for (let i = 0; i < imageUrls.length; i++) {
          await databaseService.createEventImage({
            event_id: event.id,
            url: imageUrls[i],
            sort_order: i
          });
        }
      }

      return event;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  },

  async updateEvent(id, eventData) {
    try {
      const { imageUrls, ...mainEvent } = eventData;
      
      // Update main event
      const event = await databaseService.updateEvent(id, {
        title: mainEvent.title,
        event_date: mainEvent.eventDate ? new Date(mainEvent.eventDate).toISOString().split('T')[0] : null,
        description: mainEvent.description,
        category: mainEvent.category
      });

      return event;
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  },

  async deleteEvent(id) {
    try {
      await databaseService.deleteEvent(id);
      return true;
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  },

  // =========================
  // CATEGORIES ADMIN
  // =========================
  
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

  async createCategory(categoryData) {
    try {
      const category = await databaseService.createCategory({
        slug: categoryData.slug,
        name: categoryData.name
      });
      return {
        id: category.slug,
        name: category.name,
        slug: category.slug
      };
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },

  async updateCategory(slug, categoryData) {
    try {
      const category = await databaseService.updateCategory(slug, {
        name: categoryData.name
      });
      return {
        id: category.slug,
        name: category.name,
        slug: category.slug
      };
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  },

  async deleteCategory(slug) {
    try {
      await databaseService.deleteCategory(slug);
      return true;
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  },

  // =========================
  // CONTENT ADMIN
  // =========================
  
  async getAboutContent() {
    try {
      const about = await databaseService.getAboutContent();
      return {
        tagline: about.tagline,
        heading: about.heading,
        paragraphs: about.paragraphs,
        imagePlaceholder: about.image_placeholder
      };
    } catch (error) {
      console.error('Error fetching about content:', error);
      return null;
    }
  },

  async updateAboutContent(contentData) {
    try {
      const about = await databaseService.updateAboutContent({
        tagline: contentData.tagline,
        heading: contentData.heading,
        paragraphs: contentData.paragraphs,
        image_placeholder: contentData.imagePlaceholder
      });
      return about;
    } catch (error) {
      console.error('Error updating about content:', error);
      throw error;
    }
  },

  async getFeatures() {
    try {
      const features = await databaseService.getFeatures();
      return (features || []).map(feature => ({
        id: feature.id,
        title: feature.title,
        description: feature.description,
        icon: iconMap[feature.icon] || Sparkles,
        sort_order: feature.sort_order
      }));
    } catch (error) {
      console.error('Error fetching features:', error);
      return [];
    }
  },

  async createFeature(featureData) {
    try {
      const feature = await databaseService.createFeature({
        title: featureData.title,
        description: featureData.description,
        icon: featureData.icon.name || 'Sparkles',
        sort_order: featureData.sort_order || 0
      });
      return {
        id: feature.id,
        title: feature.title,
        description: feature.description,
        icon: iconMap[feature.icon] || Sparkles,
        sort_order: feature.sort_order
      };
    } catch (error) {
      console.error('Error creating feature:', error);
      throw error;
    }
  },

  async updateFeature(id, featureData) {
    try {
      const feature = await databaseService.updateFeature(id, {
        title: featureData.title,
        description: featureData.description,
        icon: featureData.icon.name || 'Sparkles',
        sort_order: featureData.sort_order || 0
      });
      return {
        id: feature.id,
        title: feature.title,
        description: feature.description,
        icon: iconMap[feature.icon] || Sparkles,
        sort_order: feature.sort_order
      };
    } catch (error) {
      console.error('Error updating feature:', error);
      throw error;
    }
  },

  async deleteFeature(id) {
    try {
      await databaseService.deleteFeature(id);
      return true;
    } catch (error) {
      console.error('Error deleting feature:', error);
      throw error;
    }
  },

  // =========================
  // SITE SETTINGS ADMIN
  // =========================
  
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
      return null;
    }
  },

  async updateContactInfo(contactData) {
    try {
      const contact = await databaseService.updateContactInfo({
        email: contactData.email,
        phone: contactData.phone,
        location: contactData.location,
        address: contactData.address
      });
      return contact;
    } catch (error) {
      console.error('Error updating contact info:', error);
      throw error;
    }
  },

  async getSocialMedia() {
    try {
      const social = await databaseService.getSocialMedia();
      return {
        facebook: social.facebook,
        instagram: social.instagram
      };
    } catch (error) {
      console.error('Error fetching social media:', error);
      return null;
    }
  },

  async updateSocialMedia(socialData) {
    try {
      const social = await databaseService.updateSocialMedia({
        facebook: socialData.facebook,
        instagram: socialData.instagram
      });
      return social;
    } catch (error) {
      console.error('Error updating social media:', error);
      throw error;
    }
  },

  async getSiteInfo() {
    try {
      const site = await databaseService.getSiteInfo();
      return {
        name: site.name,
        tagline: site.tagline,
        description: site.description,
        year: site.year
      };
    } catch (error) { 
      return null;
    }
  },

  async updateSiteInfo(siteData) {
    try {
      const site = await databaseService.updateSiteInfo({
        name: siteData.name,
        tagline: siteData.tagline,
        description: siteData.description,
        year: siteData.year
      });
      return site;
    } catch (error) { 
      throw error;
    }
  }
};

// Helper functions to transform database data
function transformProduct(product) {
  if (!product) return null;
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
      id: variant.id,
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
