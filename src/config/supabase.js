import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.PUBLIC_SUPABASE_ANON_KEY;

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database service functions
export const databaseService = {
  // Products
  async getProducts() {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        product_variants(*),
        product_images(*),
        product_scents(*)
      `)
      .order('id', { ascending: false });
    if (error) throw error;
    return data;
  },

  async getProductById(id) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        product_variants(*),
        product_images(*),
        product_scents(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async getProductsByCategory(categorySlug) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        product_variants(*),
        product_images(*),
        product_scents(*)
      `)
      .eq('category_slug', categorySlug)
      .order('id', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getFeaturedProducts() {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        product_variants(*),
        product_images(*),
        product_scents(*)
      `)
      .eq('featured', true)
      .order('id', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Categories
  async getCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Events
  async getEvents() {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        event_images(*)
      `)
      .order('event_date', { ascending: false });
    
    if (error) { 
      throw error;
    }
    return data;
  },

  // About content
  async getAboutContent() {
    const { data, error } = await supabase
      .from('about_content')
      .select('*')
      .single();
    
    if (error) { 
      throw error;
    }
    return data;
  },

  // Features
  async getFeatures() {
    const { data, error } = await supabase
      .from('features')
      .select('*')
      .order('sort_order');
    
    if (error) { 
      throw error;
    }
    return data;
  },

  // Contact info
  async getContactInfo() {
    const { data, error } = await supabase
      .from('contact_info')
      .select('*')
      .single();
    
    if (error) throw error;
    return data;
  },

  // Social media
  async getSocialMedia() {
    const { data, error } = await supabase
      .from('social_media')
      .select('*')
      .single();
    
    if (error) throw error;
    return data;
  },

  // Site info
  async getSiteInfo() { 
    const { data, error } = await supabase
      .from('site_info')
      .select('*')
      .single();
     
    if (error) { 
      throw error;
    }
    return data;
  },

  // Navigation links
  async getNavLinks() {
    const { data, error } = await supabase
      .from('nav_links')
      .select('*')
      .order('sort_order');
    
    if (error) throw error;
    return data;
  },

  // Footer links
  async getFooterLinks() {
    const { data, error } = await supabase
      .from('footer_links')
      .select('*')
      .order('sort_order');
    
    if (error) throw error;
    return data;
  },

  // =========================
  // ADMIN CRUD OPERATIONS
  // =========================

  // Products CRUD
  async createProduct(productData) {
    // Ensure a non-null primary key since products.id is not serial in schema
    let nextId = 1;
    try {
      const { data: last, error: lastErr } = await supabase
        .from('products')
        .select('id')
        .order('id', { ascending: false })
        .limit(1);
      if (!lastErr && Array.isArray(last) && last.length > 0) {
        const lastId = Number(last[0].id) || 0;
        nextId = lastId + 1;
      }
    } catch {}

    const payload = { id: nextId, ...productData };

    const { data, error } = await supabase
      .from('products')
      .insert([payload])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateProduct(id, productData) {
    const { data, error } = await supabase
      .from('products')
      .update(productData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteProduct(id) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },

  // Product variants CRUD
  async createProductVariant(variantData) {
    const { data, error } = await supabase
      .from('product_variants')
      .insert([variantData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateProductVariant(id, variantData) {
    const { data, error } = await supabase
      .from('product_variants')
      .update(variantData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteProductVariant(id) {
    const { error } = await supabase
      .from('product_variants')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },

  // Product images CRUD
  async createProductImage(imageData) {
    const { data, error } = await supabase
      .from('product_images')
      .insert([imageData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateProductImage(id, imageData) {
    const { data, error } = await supabase
      .from('product_images')
      .update(imageData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteProductImage(id) {
    const { error } = await supabase
      .from('product_images')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },

  // Product scents CRUD
  async createProductScent(scentData) {
    const { data, error } = await supabase
      .from('product_scents')
      .insert([scentData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteProductScent(id) {
    const { error } = await supabase
      .from('product_scents')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },

  async deleteProductVariantsByProductId(productId) {
    const { error } = await supabase
      .from('product_variants')
      .delete()
      .eq('product_id', productId);
    
    if (error) throw error;
    return true;
  },

  async deleteProductImagesByProductId(productId) {
    const { error } = await supabase
      .from('product_images')
      .delete()
      .eq('product_id', productId);
    
    if (error) throw error;
    return true;
  },

  async deleteProductScentsByProductId(productId) {
    const { error } = await supabase
      .from('product_scents')
      .delete()
      .eq('product_id', productId);
    
    if (error) throw error;
    return true;
  },

  // Events CRUD
  async createEvent(eventData) {
    // Ensure a non-null primary key since events.id is not serial in schema
    let nextId = 1;
    try {
      const { data: last } = await supabase
        .from('events')
        .select('id')
        .order('id', { ascending: false })
        .limit(1);
      if (Array.isArray(last) && last.length > 0) nextId = Number(last[0].id) + 1 || 1;
    } catch {}
    const payload = { id: nextId, ...eventData };
    const { data, error } = await supabase
      .from('events')
      .insert([payload])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateEvent(id, eventData) {
    const { data, error } = await supabase
      .from('events')
      .update(eventData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteEvent(id) {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },

  // Event images CRUD
  async createEventImage(imageData) {
    const { data, error } = await supabase
      .from('event_images')
      .insert([imageData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateEventImage(id, imageData) {
    const { data, error } = await supabase
      .from('event_images')
      .update(imageData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteEventImage(id) {
    const { error } = await supabase
      .from('event_images')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },

  // Categories CRUD
  async createCategory(categoryData) {
    const { data, error } = await supabase
      .from('categories')
      .insert([categoryData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateCategory(slug, categoryData) {
    const { data, error } = await supabase
      .from('categories')
      .update(categoryData)
      .eq('slug', slug)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteCategory(slug) {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('slug', slug);
    
    if (error) throw error;
    return true;
  },

  // About content CRUD
  async updateAboutContent(contentData) {
    const { data, error } = await supabase
      .from('about_content')
      .update(contentData)
      .eq('id', true)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Features CRUD
  async createFeature(featureData) {
    const { data, error } = await supabase
      .from('features')
      .insert([featureData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateFeature(id, featureData) {
    const { data, error } = await supabase
      .from('features')
      .update(featureData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteFeature(id) {
    const { error } = await supabase
      .from('features')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },

  // Contact info CRUD
  async updateContactInfo(contactData) {
    const { data, error } = await supabase
      .from('contact_info')
      .update(contactData)
      .eq('id', true)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Social media CRUD
  async updateSocialMedia(socialData) {
    const { data, error } = await supabase
      .from('social_media')
      .update(socialData)
      .eq('id', true)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Site info CRUD
  async updateSiteInfo(siteData) {
    const { data, error } = await supabase
      .from('site_info')
      .update(siteData)
      .eq('id', true)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Assets CRUD
  async getAssets() {
    const { data, error } = await supabase
      .from('assets')
      .select('*')
      .order('sort_order', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async getAssetByKey(key) {
    const { data, error } = await supabase
      .from('assets')
      .select('*')
      .eq('key', key)
      .single();
    
    if (error) throw error;
    return data;
  },

  async createAsset(assetData) {
    const { data, error } = await supabase
      .from('assets')
      .insert([assetData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateAsset(id, assetData) {
    const { data, error } = await supabase
      .from('assets')
      .update(assetData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteAsset(id) {
    const { error } = await supabase
      .from('assets')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },

  // Hero content CRUD
  async getHeroContent() {
    const { data, error } = await supabase
      .from('hero_content')
      .select('*')
      .eq('id', true)
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateHeroContent(heroData) {
    const { data, error } = await supabase
      .from('hero_content')
      .update(heroData)
      .eq('id', true)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

export default supabase;
