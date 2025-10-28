-- Sent Candles - Supabase Database Setup
-- Safe to run multiple times (uses IF NOT EXISTS / DO NOTHING)

-- =========================
-- Extensions
-- =========================
create extension if not exists "pgcrypto";
create extension if not exists "uuid-ossp";

-- =========================
-- Enums
-- =========================
do $$
begin
  if not exists (select 1 from pg_type where typname = 'stock_status_enum') then
    create type stock_status_enum as enum ('in-stock', 'out-of-stock', 'pre-order');
  end if;
end$$;

-- =========================
-- Tables
-- =========================

-- Categories (use slug as PK to match code)
create table if not exists public.categories (
  slug text primary key,
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Products
create table if not exists public.products (
  id integer primary key,
  name text not null,
  scent text,
  description text,
  size text,
  burn_time text,
  category_slug text not null references public.categories(slug) on update cascade on delete restrict,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Product variants
create table if not exists public.product_variants (
  id bigserial primary key,
  product_id integer not null references public.products(id) on update cascade on delete cascade,
  name text not null,
  price numeric(10,2) not null,
  stock_status stock_status_enum not null default 'in-stock',
  created_at timestamptz not null default now(),
  unique (product_id, name)
);

-- Product images
create table if not exists public.product_images (
  id bigserial primary key,
  product_id integer not null references public.products(id) on update cascade on delete cascade,
  url text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (product_id, url)
);

-- Product available scents (list of scent options per product)
create table if not exists public.product_scents (
  id bigserial primary key,
  product_id integer not null references public.products(id) on update cascade on delete cascade,
  scent text not null,
  created_at timestamptz not null default now(),
  unique (product_id, scent)
);

-- Events / News
create table if not exists public.events (
  id integer primary key,
  title text not null,
  event_date date,
  description text,
  category text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.event_images (
  id bigserial primary key,
  event_id integer not null references public.events(id) on update cascade on delete cascade,
  url text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (event_id, url)
);

-- About content (single row)
create table if not exists public.about_content (
  id boolean primary key default true,
  tagline text,
  heading text,
  paragraphs jsonb,
  image_placeholder text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint about_content_singleton check (id = true)
);

-- Features
create table if not exists public.features (
  id bigserial primary key,
  title text not null,
  description text not null,
  icon text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (title)
);

-- Contact info (single row)
create table if not exists public.contact_info (
  id boolean primary key default true,
  email text,
  phone text,
  location text,
  address text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint contact_info_singleton check (id = true)
);

-- Social media (single row)
create table if not exists public.social_media (
  id boolean primary key default true,
  facebook text,
  instagram text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint social_media_singleton check (id = true)
);

-- Site info (single row)
create table if not exists public.site_info (
  id boolean primary key default true,
  name text,
  tagline text,
  description text,
  year integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint site_info_singleton check (id = true)
);

-- Navigation links
create table if not exists public.nav_links (
  id bigserial primary key,
  name text not null,
  href text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (name, href)
);

-- Footer links
create table if not exists public.footer_links (
  id bigserial primary key,
  name text not null,
  href text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (name, href)
);

-- Assets (background images, logos, etc.)
create table if not exists public.assets (
  id bigserial primary key,
  key text not null unique,
  type text not null default 'image',
  url text not null,
  alt_text text,
  description text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Hero content (single row)
create table if not exists public.hero_content (
  id boolean primary key default true,
  badge text,
  heading_line1 text,
  heading_line2 text,
  description text,
  primary_button_text text,
  primary_button_link text,
  secondary_button_text text,
  secondary_button_link text,
  stats jsonb,
  hero_image text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint hero_content_singleton check (id = true)
);

-- =========================
-- Seed Data
-- =========================

-- Categories
insert into public.categories (slug, name)
values
  ('all', 'All Products'),
  ('latte_series', 'Latte Series'),
  ('sweet_series', 'Sweet Series'),
  ('personalized', 'Personalized Labels'),
  ('cement_pot', 'Cement Pot'),
  ('piper_paw', 'Piper Paw Collection'),
  ('roses', 'Roses Collection'),
  ('classic_molded', 'Classic Molded')
on conflict (slug) do nothing;

-- Products
insert into public.products (id, name, scent, description, size, burn_time, category_slug, featured)
values
  (1, 'Molded Candle (Unscented)', 'Unscented', 'A collection of beautifully molded unscented candles in various shapes and sizes.', null, null, 'classic_molded', false),
  (2, 'Molded Candle (Scented)', 'Multiple Scents Available', 'A collection of beautifully molded scented candles in various shapes and sizes.', null, null, 'classic_molded', true),
  (3, 'Roses Collection', 'Multiple Scents Available', 'Perfect for setting a romantic ambiance or adding a touch of elegance to any space.', null, null, 'roses', false),
  (4, 'Piper Paw Collection', 'Multiple Scents Available', 'Get ready to unleash the magic with our newest addition: the three-wick candles in the shape of adorable paw prints, part of our Piper Paw collection!
Available in shades of brown, black, and white, these candles are designed to add a touch of charm and warmth to any space.', '200g', '10-15 hours', 'piper_paw', false),
  (5, 'Cement Pots', 'Multiple Scents Available', 'Enhance your ambiance with our captivating scented candles, elegantly displayed in big round plain cement pots.
Transform your home into a haven of comfort and tranquility with our scented candles in big round plain cement pots. ', '200g', '10-15 hours', 'cement_pot', false),
  (6, 'Personalized Scented Candles', 'Multiple Scents Available', 'Personalized scented candles in tin cans – perfect for weddings, birthdays, and any special occasion. A thoughtful and fragrant souvenir your guests will surely love! Available in multiple scents with customizable packaging. Handcrafted with love.', '100g', '10-15 hours', 'personalized', true),
  (7, 'Strawberry', 'Strawberry', 'Juicy, fruity, and uplifting. Hand-poured soy candle crafted to bring fragrance and warmth into your space. Part of our Sweet Series fruit-inspired collection.', '200g', '10-15 hours', 'sweet_series', true),
  (8, 'Honeydew Melon', 'Honeydew Melon', 'Bright, sweet, and sunny. Hand-poured soy candle crafted to bring fragrance and warmth into your space. Part of our Sweet Series fruit-inspired collection.', '200g', '10-15 hours', 'sweet_series', true),
  (9, 'Sweet Cucumber Melon', 'Cucumber Melon', 'Crisp, refreshing, and light. Hand-poured soy candle crafted to bring fragrance and warmth into your space. Part of our Sweet Series fruit-inspired collection.', '200g', '10-15 hours', 'sweet_series', true),
  (10, 'Iced Coffee Latte Candle', 'Iced Coffee Latte', 'First Collab Drop! Sent Candles × La Farine Cafe. We''re brewing something special — our Iced Coffee Latte Candle looks like your favorite drink, but yes... it''s a candle! Available at La Farine Cafe, Brgy. Tongko, Tayabas City. Open daily from 11AM to 9PM.', 'Standard', '10-15 hours', 'latte_series', true)
on conflict (id) do nothing;

-- Variants
insert into public.product_variants (product_id, name, price, stock_status) values
  -- id 1
  (1, 'Yarn', 35, 'pre-order'),
  (1, 'Pyramid', 35, 'pre-order'),
  (1, 'Small Bubble', 25, 'pre-order'),
  (1, 'Big Bubble', 55, 'pre-order'),
  -- id 2
  (2, 'Yarn', 60, 'pre-order'),
  (2, 'Pyramid', 60, 'pre-order'),
  (2, 'Small Bubble', 45, 'pre-order'),
  (2, 'Big Bubble', 100, 'pre-order'),
  -- id 3
  (3, '200g', 230, 'out-of-stock'),
  -- id 4
  (4, 'Brown', 300, 'out-of-stock'),
  (4, 'White', 300, 'out-of-stock'),
  (4, 'Grey', 300, 'out-of-stock'),
  -- id 5
  (5, '2hr Small Round', 50, 'in-stock'),
  (5, 'Small Round', 80, 'in-stock'),
  (5, 'Small Square', 80, 'in-stock'),
  -- id 6
  (6, '50g Tin Can', 80, 'pre-order'),
  (6, '100g Tin Can', 140, 'pre-order'),
  -- id 7
  (7, 'Regular', 345, 'in-stock'),
  -- id 8
  (8, 'Regular', 345, 'in-stock'),
  -- id 9
  (9, 'Regular', 345, 'in-stock'),
  -- id 10
  (10, 'Regular', 300, 'in-stock')
on conflict do nothing;

-- Product images
insert into public.product_images (product_id, url, sort_order) values
  (1, 'https://scontent.fmnl13-4.fna.fbcdn.net/v/t39.30808-6/470173491_122187492638166976_4991608339360746738_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeGFu968cKEUhmZbuvr9c34fXwzr7kuEqPhfDOvuS4So-Gwp0B0tV-dW3r8Qm85KngHyBjdIehDpQdBgjnm8hfaf&_nc_ohc=aTEGUGYbhQ0Q7kNvwFTdiX1&_nc_oc=AdlunW8vnkn0Ri1fX1UbdwCA6iyxcL-YOKEoWavCAeameDuj0r0wJYHeyVkUNAy4WZI&_nc_zt=23&_nc_ht=scontent.fmnl13-4.fna&_nc_gid=r_xd2WyS4R1RYuMzSxg4kA&oh=00_Aff1DCni2UtBdqUDcO4GUivcAmWl48feSsEuYt0MmUnbbQ&oe=69046E1B', 0),

  (2, 'https://scontent.fmnl13-1.fna.fbcdn.net/v/t39.30808-6/470235225_122187492266166976_4297334660378622238_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeG_3vX78-5ikODYuHb_frj861D6jtJL65nrUPqO0kvrmbEfPOqpRX4-aMpE0m_bJIQxgvH0DFP6snNmGRqT8lVa&_nc_ohc=xZ6pe5Uk1P0Q7kNvwHNbqbY&_nc_oc=AdnBZoRQPG0nwN4Ea51Wsy3QaFgZRBmaNqsHwa5NBhQbn4n2Q8n5zb-1xaWWA8GtOkg&_nc_zt=23&_nc_ht=scontent.fmnl13-1.fna&_nc_gid=iv78XgJt4pw58mlZpfSOFA&oh=00_Afc3dsxDMrexxBgyC-EIFO-bc4OB0daKoLppKyHmpWrrvQ&oe=69047418', 0),
  (2, 'https://scontent.fmnl13-4.fna.fbcdn.net/v/t39.30808-6/470137891_122187492260166976_6232101646261387847_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeEg8yQ_Qq76sIM4GbdDPmfRAA5eTXolyuAADl5NeiXK4MyFPFfd-m6slm3fKBU6YZz5RW4ndiIjwszweh0U0Lmt&_nc_ohc=8KOi_V_m59QQ7kNvwHjoQ_f&_nc_oc=AdkVjj2xj_B7dW0Rk6WXOBaGe8Iz0SjdY7gVrT7mA-YiHWNsOdZhMPsYVm8jkVMunPI&_nc_zt=23&_nc_ht=scontent.fmnl13-4.fna&_nc_gid=hVzyi8cHd_VEJhXHSNFGSA&oh=00_Afe1uXVg__D7_w0PCwd6DjggOTcTvSQVJF27RMRUA1RC9g&oe=69046BCC', 1),

  (3, 'https://scontent.fmnl13-4.fna.fbcdn.net/v/t39.30808-6/470155392_122187826958166976_634594096652352313_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeHncOpE51Ey3M4nuX-Ikp8_7d0fWxzkX53t3R9bHORfnXagiJZ0uelHWfSGMPPwEmTBSfJzghu5pYfndimRfyAi&_nc_ohc=N7Op2G86bvAQ7kNvwGye4iM&_nc_oc=Adk3gFCveWucI9D1oUs2PWRghw5lmV2dxHPvbKwaS_ju6tLPUX2aqn19xYuwzRBJ86E&_nc_zt=23&_nc_ht=scontent.fmnl13-4.fna&_nc_gid=6tj6zN7_t6XOHETtORhr4A&oh=00_Afei3lBcjE_ImTEQEAOt7eNY2jdXtlnvo1BQ1qazwGyIpw&oe=69043063', 0),
  (3, 'https://scontent.fmnl13-4.fna.fbcdn.net/v/t39.30808-6/470226270_122187827054166976_4129326006821618088_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeGO0BZbhl_YMq-Jn3pWocCBjrxQ9WIRgsWOvFD1YhGCxaqVpcPYo_p50pZj8wsKQJ98NXa_Yytc-zJdQem_SWUL&_nc_ohc=fd56MoiNcJcQ7kNvwECxGFP&_nc_oc=Adn94dWhz3bw_qe1BJNj7JkkwMrTbtJYKRIep-9TtFBY3_9bpPDFzSuIBcNUfwloWf8&_nc_zt=23&_nc_ht=scontent.fmnl13-4.fna&_nc_gid=Ore9q-Wb3gb1jRfL0Gq4rw&oh=00_AfcKsMd3zlHLP1EY0IV9nVn6G2aGpguFtilvsMTkJjQE-Q&oe=6904539F', 1),
  (3, 'https://scontent.fmnl13-2.fna.fbcdn.net/v/t39.30808-6/470179698_122187827024166976_1040943124730468388_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeFNJnLN0jCD_gikv65a6EVm66-sDMIURJfrr6wMwhREl-BT8oH0jkA_YUF-apiBm_GW_p8HSyEwUo8EsbiGROG0&_nc_ohc=fap8GlbUZuMQ7kNvwFXg5pN&_nc_oc=Adl1ffZbDxWIUIYijMy-tDFBZU1oQ8z-wVmrlNyZ8f2wQoT3S2_WN3Bz9-fLW0ontP4&_nc_zt=23&_nc_ht=scontent.fmnl13-2.fna&_nc_gid=8Ln5c9xk7aqddAK7Qc7QGA&oh=00_AfdmqSV2JUctaWnrDDioYAISrLiShdy34KJcUEmzLTKeNQ&oe=6904481B', 2),
  (3, 'https://scontent.fmnl13-4.fna.fbcdn.net/v/t39.30808-6/470139057_122187826976166976_1130447709184846103_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeGDIK6OFM7i0hBdC4r6r7xr1S_PPteDTRbVL88-14NNFm8BuFNsSixN-YMrwaauXixS8v1YglzzyC9utl60KSLV&_nc_ohc=dmAOYJRyODoQ7kNvwE1_W8r&_nc_oc=AdlLOXs6eI-HJbcgC6NaI8Vt7wHPFuZgUSSwc9U7Kd0uzo3PP_-d067Z_MMPH-_PSX0&_nc_zt=23&_nc_ht=scontent.fmnl13-4.fna&_nc_gid=jXE5skWcMQRCYt07_RnMIA&oh=00_AfeG6b4MpxFWMkq6PoiB-wQLvHQ5tqK67UlKonYXFYuZkQ&oe=69045209', 3),

  (4, 'https://scontent.fmnl13-1.fna.fbcdn.net/v/t39.30808-6/470471893_122187980540166976_8803057418171129536_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeFKPgJtJ-95Y7UfvGPJ7lVoQuMoWeqa061C4yhZ6prTraHTdaFdlvhSv6FvyhInsMo1sg_cRRx2zTRrl7qaLp5R&_nc_ohc=IaQG1RKx8eIQ7kNvwH39nJZ&_nc_oc=AdlZvG76GYbgY3yNOGST0P3AZNo3InGfk-zmq8A2owB5oZolIQcvvcRiPYKlc3DqFSE&_nc_zt=23&_nc_ht=scontent.fmnl13-1.fna&_nc_gid=wwRdh-qXUQoMWvgXnb4DLA&oh=00_AffEYQHUHRR1AYhJwz1Je_S26H8xb4E44czj1j-oBR_lPQ&oe=690458F6', 0),
  (4, 'https://scontent.fmnl13-3.fna.fbcdn.net/v/t39.30808-6/470136073_122187980606166976_5740907548647079369_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeGlXjUUogE09UFeD6k15B7yRR-LXlaGl9dFH4teVoaX1yfhycrZ08pF_lO0mmwQFg4aGCCcl8uGpn7a77DfNphI&_nc_ohc=cR20mm1Z5dAQ7kNvwEaTSo1&_nc_oc=AdlQzHemotHtnfiMfrx2_J0mPlIAbtE583hpRGZ3N7swfj0mSwragu5vteJpRUuV19s&_nc_zt=23&_nc_ht=scontent.fmnl13-3.fna&_nc_gid=jyFKlTuvVZj4F5l01PIUGg&oh=00_AfetDaSwdAtUDJCQBCI1_Wrr4RAV3Kh-p_HvZ_8_F0z7uQ&oe=69043920', 1),
  (4, 'https://scontent.fmnl13-3.fna.fbcdn.net/v/t39.30808-6/470163291_122187980792166976_532349672506682740_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeHBhFjvdyrUbIJorvlmYlggl0uHza-XXyiXS4fNr5dfKGQNH_nh2SxSi4UkgCQJUCRWAsY2OozMBfyeMMGdLnQF&_nc_ohc=aaAMbFUa_BIQ7kNvwH9aHa3&_nc_oc=AdlDSU_cPSuwcgMPuQF3h5nGmJWZl7ZdciZ15EUcj39sj-ieJ3fWK19nexU7iu558TU&_nc_zt=23&_nc_ht=scontent.fmnl13-3.fna&_nc_gid=1iuxQIc58UckyGVkWQ9Htw&oh=00_AfdKap3ix7bz3XCL2QJCavfLIBcKdI_NuL0F_LyClxV3xA&oe=6904379F', 2),

  (5, 'https://scontent.fmnl13-2.fna.fbcdn.net/v/t39.30808-6/470990985_122188807700166976_4208734311687259488_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeHZSe6HvoLvL1oiTao6hTyBnmh25Iei7N-eaHbkh6Ls38bx4Idqf4OPO5Dt5eI5f3mcA6Gz1Lfwy0lZTRVx1oCX&_nc_ohc=zbO_GAk-9gEQ7kNvwH3pdc7&_nc_oc=AdkGeW2aP2zkITKRnIAGochw97qkGn2hB1YselgoDsCz1Nn8GlGORHgFC0BRbOr8Iw0&_nc_zt=23&_nc_ht=scontent.fmnl13-2.fna&_nc_gid=FJ1lc1vzZes4CzWYdHnODw&oh=00_Afdl-nEKh1n5LMbmGEFGNlK6YIsxuxjJt1Tv8aGHduObuQ&oe=690442DF', 0),
  (5, 'https://scontent.fmnl13-2.fna.fbcdn.net/v/t39.30808-6/471065470_122188807730166976_8668277519536245436_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeET8v6BRnf9gl74t7b24MdtCFsfqFkcGtoIWx-oWRwa2ndJoSbwZr7EmQ0T6Xpo1IpmJOqhHJLgO69B8jskZjLh&_nc_ohc=dVpz3l3zOL0Q7kNvwHUrcR-&_nc_oc=Adkcs2OrA1DLUF62AbbQBng7tV3jh0HwzFPLK17vAtV-TYsHhT9nSaTEX4_UkLtW00Q&_nc_zt=23&_nc_ht=scontent.fmnl13-2.fna&_nc_gid=8JUqXC54byoMAAwxoWdFNg&oh=00_Afd1xYyTmSZMBF7UdGYRSnqbGLibTZAto5mpjHvGkw4XsQ&oe=69044362', 1),
  (5, 'https://scontent.fmnl13-1.fna.fbcdn.net/v/t39.30808-6/470220852_122188808006166976_3757288279058696670_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeH03gfWGfq-u08U1q70S7Ar4OSrsDvcV_ng5KuwO9xX-fYZC--vG68QW2OMvFg6kZK2Hgksum1GAYy8v7eV6zZD&_nc_ohc=dxBslk-OvKUQ7kNvwHKlPxF&_nc_oc=Adl4ppzTwpf5u6-7zHWLNX5Pf4f9dOt8TZZVoFc9satbYUHOos26gZK7xAvql-KMDfQ&_nc_zt=23&_nc_ht=scontent.fmnl13-1.fna&_nc_gid=mTNCyMS5q0znVzgfPVAZXQ&oh=00_Afd0o2wGUBaToDe4YKmOwdK6R9pM9g-uYifmI9G_lpqapg&oe=6904516D', 2),

  (6, 'https://scontent.fmnl13-1.fna.fbcdn.net/v/t39.30808-6/526748683_122228402978166976_6957861607550096628_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeEQqTV9_f3m8va2KdUvQFT2iiHByaN-3y-KIcHJo37fL7gzdRo3eMbVYWkcNDONZTJotl3hJ-PUO9F88l7TZQMj&_nc_ohc=1vB7XXg9wGwQ7kNvwHXUfH0&_nc_oc=AdmdD3_iamBNlEZ8DJuwxigJo-HQ9ZXfx-gxYQUdsvaOLaYw6eSfJuY1z1tU3ShH4ps&_nc_zt=23&_nc_ht=scontent.fmnl13-1.fna&_nc_gid=VQ7lnBYjbS-AMnX5-3Jrhw&oh=00_Afdr2y1hBm4CDgh5pNZKkL8Sz6XaZNMRhkFITmTFbwP1Bw&oe=69044E0A', 0),
  (6, 'https://scontent.fmnl13-1.fna.fbcdn.net/v/t39.30808-6/525993822_122228403044166976_7564563139078237952_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeHI6CyGjo7QqHLbALXDdjdwP6YblTCSvLg_phuVMJK8uHEEXZjVwWngMMjjdneWoj0lkd3_i_dgJwK7sTqYrQV5&_nc_ohc=107ZX5RHSEYQ7kNvwEkO8xq&_nc_oc=Adkadcq79xcqCHytilXAV0jzWISZLqLpPcZjHa0weNDGznFdLxhMDEfjSjVF3aaRHc8&_nc_zt=23&_nc_ht=scontent.fmnl13-1.fna&_nc_gid=uHuEvt663CQU0pHiZOVqKA&oh=00_AfdF4nMADL0CAdAGx4mJcT7buVnoL1__lpc5oWyjxTTBhQ&oe=690441E7', 1),
  (6, 'https://scontent.fmnl13-4.fna.fbcdn.net/v/t39.30808-6/525845796_122228403092166976_5189825871143772859_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeEyogItZZMILC9m8F9X15rLCfE0DxeIK34J8TQPF4grfhVL278-t8vyTlv8_1KD1odcxmWaU7iZ5Bpo0R2w_2tW&_nc_ohc=jWiBuWhqLAkQ7kNvwGXr57P&_nc_oc=AdlJYreGr7clqBWDlJ2OBrkSzEPd9APh_sFcSGwCMrUENJWrrXip63r8f6UbBPD4BDQ&_nc_zt=23&_nc_ht=scontent.fmnl13-4.fna&_nc_gid=DTJNpc6ticExAlJ4IJtcAg&oh=00_AffM4I9rVXeMSQZTVbhFxNmNui25fF_6696TcZHQcNFL1w&oe=69045379', 2),
  (6, 'https://scontent.fmnl13-3.fna.fbcdn.net/v/t39.30808-6/527100104_122228403134166976_6092479012307246142_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeHowls_9eJLU54Z9w3LHDUt_Kw1ra5Wcp78rDWtrlZyntf6KSika3U816f5fnbyY9pBP7NaMdSFNCl93EiQCXVK&_nc_ohc=h6-gXbMQ9T4Q7kNvwEqLmv8&_nc_oc=AdkQvE2zReY5CmFeEKGNav4DTI9ZEysy7iApePTGD_VOM_ERED8wRiFIRbbfTYBcei4&_nc_zt=23&_nc_ht=scontent.fmnl13-3.fna&_nc_gid=4NmLTismGnsJH21x4WDIrg&oh=00_AfcFEhrmLhCrcDKjDLot3igwtdIjqhS01i74t4VgnstNnQ&oe=69044D43', 3),
  (6, 'https://scontent.fmnl13-4.fna.fbcdn.net/v/t39.30808-6/527749545_122228403176166976_2817147658121626726_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeFEaRRQ6wtRKyVuzLUnwx9QDnc4ky-ivlIOdziTL6K-UvU1WvxFB4NK1KjEjJNKaYykeGHB65ynZ4scsK1o3trW&_nc_ohc=FKV8yA_JNpUQ7kNvwGfsWqB&_nc_oc=Adl8904syA7UW8Yg1zko-zMYwrJB7dlABFqOgDVr-zEd64QJQ9Jp1y9UzYYYCnukQEw&_nc_zt=23&_nc_ht=scontent.fmnl13-4.fna&_nc_gid=rDXSi4ebbDZS7d1fzwpsHg&oh=00_Afe2cHQQoqhOEKkY5Tb-uZblL_FVHk8AguHW9hODrqEpRQ&oe=690457D7', 4),

  (7, 'https://scontent.fmnl13-4.fna.fbcdn.net/v/t39.30808-6/533578549_122230614512166976_2107150422168102053_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeGEaV9sJWqAdhkgVwtRlyQcaFt-kjsWF4RoW36SOxYXhMjAUhEClMMyJFkCr_Ol4OZRi27rLWKixDyE4Ut2YlN0&_nc_ohc=S80Na7QPXBYQ7kNvwHgPNU9&_nc_oc=AdkjJzt9ZMvVVDzN4RrGqvKpaqK2eI5qHKeqKnruOI2QVEwIoOFZcjyNMFvEmAHPHCw&_nc_zt=23&_nc_ht=scontent.fmnl13-4.fna&_nc_gid=VkkMC4ue6C4_DC772jCmvg&oh=00_AfeVxQvLfJGUsEnlV-bcmV9f0BbiatroFjF0sGM23iXVOA&oe=690462E3', 0),
  (7, 'https://scontent.fmnl13-3.fna.fbcdn.net/v/t39.30808-6/535322675_122230614566166976_420400448146119682_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeGnEB5ITqV1MiIp1OjOG79bkyFw8bMxI2yTIXDxszEjbBxBvaWzYvfw1unkKAnr0nDJyt8XAg3W9-xu5f3Jvy9t&_nc_ohc=c3sDgz9HqZUQ7kNvwGo_yEC&_nc_oc=AdltLYFblz9AAfq8D_ZiUlDi3u0Wb_VvAWqg_eHbwCMVfeyoK416nWQtsStgwVMqUdI&_nc_zt=23&_nc_ht=scontent.fmnl13-3.fna&_nc_gid=E5afY9yZ6eiewHEfHbagVA&oh=00_AffoLpqXKFWpC0BG5EQ4APk4X6rA99XFgis1BCPFRrUuzQ&oe=6904505F', 1),

  (8, 'https://scontent.fmnl13-1.fna.fbcdn.net/v/t39.30808-6/539746854_122232019304166976_1089105412316707329_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeEmzwZ1lHs3OnxcaNIgoQyM8TLLM9YmppbxMssz1iamliYlhuUUc9pmKezaiZrQtHp0Wu1KMa807Iu6HTP39oYX&_nc_ohc=fkL36HaCzIIQ7kNvwEw4KK4&_nc_oc=AdkBfT3iMtcdqd2zslEgaYzKy_ni8PLWfvKzCZPi2nbbwJJX5uh4hrN4-z4NUwc6FVg&_nc_zt=23&_nc_ht=scontent.fmnl13-1.fna&_nc_gid=-iMJ8GExNeMx0PGfF32ZzA&oh=00_Afc25V1OW846PyXSzv39npihJ4-GC1gyKgEEMlIYpcDehw&oe=69044EC7', 0),
  (8, 'https://scontent.fmnl13-2.fna.fbcdn.net/v/t39.30808-6/540708864_122232019298166976_8338567951277579031_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeE_PKDew8seMBdmgG8ztxhDlDQNLIQQdX6UNA0shBB1fglqn6b_2KJbYKhfnvxiuax0ys4cnL1hOBeAaEyae5xg&_nc_ohc=1ncC4qbNBqcQ7kNvwH_qJ_4&_nc_oc=Adl1woNW7H4rBVyin1Mv0vwHvL1g5_zZDl6ay1SsD5HMxazX8uLproO-ZGIsO8kQ-yg&_nc_zt=23&_nc_ht=scontent.fmnl13-2.fna&_nc_gid=7J_18xUQFoFuDdKNJasO2w&oh=00_AfeTnpectWzReT60b9O8fBX4kTckk7MDa-V4_oOWWdqveQ&oe=69044A29', 1),

  (9, 'https://scontent.fmnl13-1.fna.fbcdn.net/v/t39.30808-6/540677442_122232715550166976_562081278058416896_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeGy34GTn7cLMDtHodDuH3hMnoxWv9AyU2SejFa_0DJTZPDonn_mzEJ5Y-VAbp8_dxvAaNjBtWPLuZxa38cXo9_D&_nc_ohc=w5CTKVgDd4UQ7kNvwHWZLiI&_nc_oc=AdmzApqvGUPYRcZqNuLV2KqZBy7ntgbH6W4VIGCtXLmTg8DhoetUfdQUvMVeoI3RS4I&_nc_zt=23&_nc_ht=scontent.fmnl13-1.fna&_nc_gid=Fa7cewwrDdXSjIjMn2-18g&oh=00_AfeWbIDxosJJP3kpGHuFCTAbDLmkAPAhhwPDdqUo-73mJw&oe=6904378F', 0),
  (9, 'https://scontent.fmnl13-1.fna.fbcdn.net/v/t39.30808-6/540483458_122232715514166976_7110332126951523866_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeE3UvvWVVDkB-uIO_gsLEWOAvPqB3r3PvMC8-oHevc-86WtKDFfEPdjMyPDR7XF88kDyNfPEjORIClX7ly0c_oo&_nc_ohc=JvVjPFnj7GkQ7kNvwGgrGL9&_nc_oc=Adn561BlrL5SYoUm6wAbMLxybQo3f6xEcdmlFZrItojZhbLIp10BFz3RIJMD-vpge74&_nc_zt=23&_nc_ht=scontent.fmnl13-1.fna&_nc_gid=8Sxrpe3PJkKNdcIDIRcdWw&oh=00_Afc0iT0GlOLl4uTqqdzy2aCrWZOTer7rvO55TVGry6JHjQ&oe=69048945', 1),

  (10, 'https://scontent.fmnl13-2.fna.fbcdn.net/v/t39.30808-6/559125174_122238275444166976_5513176457275375892_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=106&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeHx4R1gEISl6eXQJjoQX0fHe6uDiFp4LaN7q4OIWngtowwGjlpkKHH22TIr3nA-1jXkb_7Syk-2ydzUDcalrf_Y&_nc_ohc=ROWah5S9RqEQ7kNvwHt4uBg&_nc_oc=AdmDSsIna2aUQ-6iZEBCpDBxjS2Li0eDj0_zXyJCTu_A70Uv1zQUe8n8FJynnXLFyMk&_nc_zt=23&_nc_ht=scontent.fmnl13-2.fna&_nc_gid=FgmARrVlzld6ptQRSnnZZA&oh=00_AfftfM08QM0ywnXB7Mtcd25HRx9DFTrkanZESETCKSJUJw&oe=6904477C', 0)
on conflict do nothing;

-- Product Available Scents
insert into public.product_scents (product_id, scent) values
  -- id 2
  (2, 'Lavender'), (2, 'Green Tea'), (2, 'French Vanilla'), (2, 'Apple Cinnamon'),
  (2, 'Lemongrass and Ginger'), (2, 'Watermelon'), (2, 'Coffee and Chocolate'),
  (2, 'Lily Flowers'), (2, 'Wassail'), (2, 'Cinnamon'), (2, 'Strawberry'),
  (2, 'Honeydew Melon'), (2, 'Cucumber Melon'), (2, 'Citronella'),
  (2, 'Baby Powder'), (2, 'Coffee'), (2, 'Orange Blossom'),
  -- id 3
  (3, 'Lavender'), (3, 'Green Tea'), (3, 'French Vanilla'), (3, 'Apple Cinnamon'),
  (3, 'Lemongrass and Ginger'), (3, 'Watermelon'), (3, 'Coffee and Chocolate'),
  (3, 'Lily Flowers'), (3, 'Wassail'), (3, 'Cinnamon'), (3, 'Strawberry'),
  (3, 'Honeydew Melon'), (3, 'Cucumber Melon'), (3, 'Citronella'),
  (3, 'Baby Powder'), (3, 'Coffee'), (3, 'Orange Blossom'),
  -- id 4
  (4, 'Lavender'), (4, 'Green Tea'), (4, 'French Vanilla'), (4, 'Apple Cinnamon'),
  (4, 'Lemongrass and Ginger'), (4, 'Watermelon'), (4, 'Coffee and Chocolate'),
  (4, 'Lily Flowers'), (4, 'Wassail'), (4, 'Cinnamon'), (4, 'Strawberry'),
  (4, 'Honeydew Melon'), (4, 'Cucumber Melon'), (4, 'Citronella'),
  (4, 'Baby Powder'), (4, 'Coffee'), (4, 'Orange Blossom'),
  -- id 5
  (5, 'Lavender'), (5, 'Green Tea'), (5, 'French Vanilla'), (5, 'Apple Cinnamon'),
  (5, 'Lemongrass and Ginger'), (5, 'Watermelon'), (5, 'Coffee and Chocolate'),
  (5, 'Lily Flowers'), (5, 'Wassail'), (5, 'Cinnamon'), (5, 'Strawberry'),
  (5, 'Honeydew Melon'), (5, 'Cucumber Melon'), (5, 'Citronella'),
  (5, 'Baby Powder'), (5, 'Coffee'), (5, 'Orange Blossom'),
  -- id 6
  (6, 'Lavender'), (6, 'Green Tea'), (6, 'French Vanilla'), (6, 'Apple Cinnamon'),
  (6, 'Lemongrass and Ginger'), (6, 'Watermelon'), (6, 'Coffee and Chocolate'),
  (6, 'Lily Flowers'), (6, 'Wassail'), (6, 'Cinnamon'), (6, 'Strawberry'),
  (6, 'Honeydew Melon'), (6, 'Cucumber Melon'), (6, 'Citronella'),
  (6, 'Baby Powder'), (6, 'Coffee'), (6, 'Orange Blossom')
on conflict do nothing;

-- Events
insert into public.events (id, title, event_date, description, category) values
  (1, 'Caffeine: A/wake for Another Semester', '2024-04-25', 'Sent Candles is thrilled to be part of the excitement at the Fitness Development Center during the UAPSA BatStateU''s event, "Caffeine: A/wake for Another Semester" event!', 'Event'),
  (2, 'Sent Candles × La Farine Cafe - First Collab Drop!', '2025-10-11', 'We''re brewing something special — introducing our Iced Coffee Latte Candle! It looks like your favorite drink, but yes... these are candles! Drop by La Farine Cafe, Brgy. Tongko, Tayabas City, and while you enjoy your crepes and churros, take home a candle too! Available daily from 11AM to 9PM.', 'Announcement')
on conflict (id) do nothing;

-- Event images
insert into public.event_images (event_id, url, sort_order) values
  (1, 'https://scontent.fmnl13-1.fna.fbcdn.net/v/t39.30808-6/473649444_122193466130166976_7501481507301802654_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeHwlR9Q4eCv69JcHw7QZe_P-IjyfmSUqeb4iPJ-ZJSp5leK4E_QPNM8oLHv5dN4D08klYqvWBfZQjnJoYcMf0it&_nc_ohc=rSIi2zKcGf0Q7kNvwGeSk96&_nc_oc=AdnBnzl5vcXbmVp7iE3xVQDLwRi3hLCZpJtoBs8vF2hg90K6EhbDKXVmrQd2haqu9Yw&_nc_zt=23&_nc_ht=scontent.fmnl13-1.fna&_nc_gid=fIGuAptRxGOE3_aDxAi8ww&oh=00_Aff5AGz3kAFNFU_vfe6ImUHmSh9sBYEYyXm4rEEMHJDJbA&oe=690441DD', 0),
  (1, 'https://scontent.fmnl13-1.fna.fbcdn.net/v/t39.30808-6/473583359_122193466700166976_316297528198930383_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeEOoDfN2ybnslxnlJLitUtTmr65AQcn6zGavrkBByfrMYkiwEBkZznnnGZ2BHLKSZY2dMYvbzy9EGSDKa5L9WNQ&_nc_ohc=Cjti5eVzEMYQ7kNvwG8-azS&_nc_oc=Adl1MIK11GsMDEZz5-Mn8OHrLVmcyQ3VvHcbIO0MbK2PqaV6nXpu4H0DmjD66jRakSo&_nc_zt=23&_nc_ht=scontent.fmnl13-1.fna&_nc_gid=qKnaw_4UQPKPazUEyk5lsw&oh=00_Aff2YG-MzgDmTlNiZAMmFKxC3QHi5a9FiH2JVgjrbA7noQ&oe=69045378', 1),
  (1, 'https://scontent.fmnl13-2.fna.fbcdn.net/v/t39.30808-6/473675064_122193466628166976_418033768673475544_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeFPCZW7aRyOuJTBcHrW_rOUkhXPCRLRAqKSFc8JEtECok3-wgnaQlUQoXwKVoLe9GkjSxbq1ZHcyoY_8nLoNtkr&_nc_ohc=38U3bqqTi2kQ7kNvwE73qBy&_nc_oc=AdknTBho6SHepgnpgct-w7aLEQ0t0UBZOZy-7POV4nfIJEHh_FO-MAR8l6A6SWVPGcM&_nc_zt=23&_nc_ht=scontent.fmnl13-2.fna&_nc_gid=MkINzfI5NkHzYdhvXWprww&oh=00_AfdKtjyPt8P_rvhKi84ihmhySCnR0ynUDCNfVMtkF1a4Pg&oe=69044ECF', 2),
  (1, 'https://scontent.fmnl13-4.fna.fbcdn.net/v/t39.30808-6/473619250_122193466112166976_4315496685311807433_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeFTQxluqXIRR8J_wdxyTD90LEE2gcnAyKcsQTaBycDIp_mfglSLuWUvrscn1WVqiJoicNS-2AZ1J430rKT_jae9&_nc_ohc=dX9jRGNPd30Q7kNvwG0kAc0&_nc_oc=AdliW5a_KEdMioziUOJlHuyRMvkIGViwKJkR-tpVfGbcIO4BwTxN5eA-os-6MaIyJF8&_nc_zt=23&_nc_ht=scontent.fmnl13-4.fna&_nc_gid=UfoCAx7Vq9Jbf7S8R6Dpkg&oh=00_Afde0ATBJmf8Z_9nKoby39ZaLkuQxuYCxI94jb_fKcF4BQ&oe=690444F9', 3),
  (1, 'https://scontent.fmnl13-4.fna.fbcdn.net/v/t39.30808-6/473738318_122193465956166976_68744217515710736_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeFx3BvsOHx9jNBntr2qS91TxPFC-TlZ33LE8UL5OVnfcqAPi213oeb5GBVSeY5C82thCKqJtBx7xVZRxt7fdFXF&_nc_ohc=m6BPpsbgeuEQ7kNvwFS4K5t&_nc_oc=AdnjVMoghnaAQMyETT9252f2MTHNj3FFWwK2j7Yg8ki-xNrot8BTjyFkee6adBXXSyg&_nc_zt=23&_nc_ht=scontent.fmnl13-4.fna&_nc_gid=TI_HvIdzvw-60Tl2M8ypfg&oh=00_AffSeft1nbr1T_vUBOmOrxH5k9InEkUnHVP-SVevUl9GdA&oe=6904503D', 4),
  (1, 'https://scontent.fmnl13-3.fna.fbcdn.net/v/t39.30808-6/473443254_122193466712166976_5093997064222516643_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeGcRzLYsOw_xEOALD6zGIFoWUDo6GiKlAFZQOjoaIqUAQKdWgNeLIZirZzJo_f-ZVhfZEohiMm-DUBEkOEMZfzE&_nc_ohc=Kz4skLyWIakQ7kNvwEd0Q0E&_nc_oc=AdkJydHNw1rpHUVx2RsZThSVM2M3BbHSpSUNJAT2eMUv2dnXAjkmgY9d9UA5THo40KM&_nc_zt=23&_nc_ht=scontent.fmnl13-3.fna&_nc_gid=QGL8gnWyaWjPURr1Unq-wg&oh=00_Afd8pPP9nIu5xnqft1ht9rdElQihTBdHy9azGYJ3gtdeQQ&oe=690450D6', 5),

  (2, 'https://scontent.fmnl13-2.fna.fbcdn.net/v/t39.30808-6/559125174_122238275444166976_5513176457275375892_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=106&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeHx4R1gEISl6eXQJjoQX0fHe6uDiFp4LaN7q4OIWngtowwGjlpkKHH22TIr3nA-1jXkb_7Syk-2ydzUDcalrf_Y&_nc_ohc=ROWah5S9RqEQ7kNvwHt4uBg&_nc_oc=AdmDSsIna2aUQ-6iZEBCpDBxjS2Li0eDj0_zXyJCTu_A70Uv1zQUe8n8FJynnXLFyMk&_nc_zt=23&_nc_ht=scontent.fmnl13-2.fna&_nc_gid=NjCIeiO1VZXfzh3UTuMN0A&oh=00_Afc-tMNLSws9HCTILb1_VtBqAvSpMKKggYF5tkgc4aqdUw&oe=6904477C', 0)
on conflict do nothing;

-- About content
insert into public.about_content (id, tagline, heading, paragraphs, image_placeholder)
values (
  true,
  'Our Story',
  'About Sent. Candles',
  '[
    "Each candle is a carefully crafted vessel, preserving the intangible: a Sentiment. At Sent. Candles, every fragrance tells a story, evokes a memory, and captures a feeling that words alone cannot express.",
    "Using only the finest natural soy wax and premium fragrance oils, we hand-pour each candle with meticulous attention to detail. Our commitment to quality means clean burns, lasting aromas, and authentic scents.",
    "When you light a Sent. candle, you''re not just illuminating a room—you''re rekindling a sentiment, one flicker at a time."
  ]'::jsonb,
  'https://scontent.fmnl13-3.fna.fbcdn.net/v/t39.30808-6/548206200_122234457482166976_2008501914013329243_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeFpZperzqCv4RgSlmpDxPBVFnuMrm1EgNoWe4yubUSA2j_0BK_o7XFaVgePZFRUQMOZV06NYGipa6_EywsjjJD_&_nc_ohc=ltc673VNWK0Q7kNvwHpHwmT&_nc_oc=Admq_HBFJqYt6iQaFgIs8L3eJ-CoqzzzXlz7wwrbXK8SXt4GFU4b7WOmaE3fJhZ9FnI&_nc_zt=23&_nc_ht=scontent.fmnl13-3.fna&_nc_gid=84hM28_EwtmAvLWEggjyDQ&oh=00_Aff4vmQFqDZDDyEt6w_hvYinNR3bGpNSecKtbTimFE41uw&oe=69045A8D'
)
on conflict (id) do update set
  tagline = excluded.tagline,
  heading = excluded.heading,
  paragraphs = excluded.paragraphs,
  image_placeholder = excluded.image_placeholder,
  updated_at = now();

-- Features
insert into public.features (title, description, icon, sort_order) values
  ('Clean Burning', 'Experience pure ambiance with minimal soot and toxins, thanks to our clean-burning soy wax.', 'Sparkles', 0),
  ('Extended Burn Time', 'Enjoy the soothing glow of our candles for longer, as they burn slowly and steadily.', 'Clock', 1),
  ('Renewable and Sustainable', 'Made from soybeans, our candles are an eco-conscious choice for your home.', 'Leaf', 2),
  ('Enhanced Fragrance Throw', 'Immerse yourself in captivating aromas that effortlessly fill your space.', 'Wind', 3)
on conflict (title) do nothing;

-- Contact info
insert into public.contact_info (id, email, phone, location, address)
values (true, 'sent.candles2023@gmail.com', '+63 977 419 0013', 'Tayabas City, Quezon Province, Philippines', 'Complete Address Here')
on conflict (id) do update set
  email = excluded.email,
  phone = excluded.phone,
  location = excluded.location,
  address = excluded.address,
  updated_at = now();

-- Social media
insert into public.social_media (id, facebook, instagram)
values (true, 'https://facebook.com/sentcandles', 'https://instagram.com/sent.candles')
on conflict (id) do update set
  facebook = excluded.facebook,
  instagram = excluded.instagram,
  updated_at = now();

-- Site info
insert into public.site_info (id, name, tagline, description, year)
values (true, 'Sent.', 'Scented Candles', 'Creating warmth and ambiance for your home, one candle at a time.', extract(year from now())::int)
on conflict (id) do update set
  name = excluded.name,
  tagline = excluded.tagline,
  description = excluded.description,
  year = excluded.year,
  updated_at = now();

-- Nav links
insert into public.nav_links (name, href, sort_order) values
  ('Home', '/','0'),
  ('Products', '/products','1'),
  ('About', '/#about','2'),
  ('Events', '/#events','3'),
  ('Contact', '/#contact','4')
on conflict (name, href) do nothing;

-- Footer links
insert into public.footer_links (name, href, sort_order) values
  ('Home', '#home','0'),
  ('Products', '#products','1'),
  ('About Us', '#about','2'),
  ('Events', '#events','3'),
  ('Contact', '#contact','4')
on conflict (name, href) do nothing;

-- Assets (background images and other media)
insert into public.assets (key, type, url, alt_text, description, sort_order) values
  ('homeHero', 'background_image', 'https://scontent.fmnl13-2.fna.fbcdn.net/v/t39.30808-6/469962678_122187651044166976_7954804921486263238_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=86c6b0&_nc_eui2=AeEqHn9yb1LfFK981JY2EaFCS6XtV-KrBIlLpe1X4qsEiZKUyhBHKhfA_69Xoz3mQNQbouTGKUnCaW0r6IW8XSDL&_nc_ohc=1JpyGZAZRdAQ7kNvwGOELLE&_nc_oc=AdnQ08agtQ86p1sEW5y0T-qdZ9d5rSqihWIMchfiW1S9-qYBTmCg0hntlchbzErtAfo&_nc_zt=23&_nc_ht=scontent.fmnl13-2.fna&_nc_gid=8zYDGwOb8d_X9t5bb9ncZg&oh=00_AfcxX2stRHrosJZ8yPLe5xFeNBaE-LhCahXODzwgDx6RQw&oe=69044677', 'Hero Background', 'Background image for the homepage hero section', 0),
  ('productsHero', 'background_image', 'https://scontent.fmnl13-2.fna.fbcdn.net/v/t39.30808-6/469962678_122187651044166976_7954804921486263238_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=86c6b0&_nc_eui2=AeEqHn9yb1LfFK981JY2EaFCS6XtV-KrBIlLpe1X4qsEiZKUyhBHKhfA_69Xoz3mQNQbouTGKUnCaW0r6IW8XSDL&_nc_ohc=1JpyGZAZRdAQ7kNvwGOELLE&_nc_oc=AdnQ08agtQ86p1sEW5y0T-qdZ9d5rSqihWIMchfiW1S9-qYBTmCg0hntlchbzErtAfo&_nc_zt=23&_nc_ht=scontent.fmnl13-2.fna&_nc_gid=8zYDGwOb8d_X9t5bb9ncZg&oh=00_AfcxX2stRHrosJZ8yPLe5xFeNBaE-LhCahXODzwgDx6RQw&oe=69044677', 'Products Background', 'Background image for the products page hero section', 1),
  ('aboutHero', 'background_image', 'https://scontent.fmnl13-2.fna.fbcdn.net/v/t39.30808-6/469962678_122187651044166976_7954804921486263238_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=86c6b0&_nc_eui2=AeEqHn9yb1LfFK981JY2EaFCS6XtV-KrBIlLpe1X4qsEiZKUyhBHKhfA_69Xoz3mQNQbouTGKUnCaW0r6IW8XSDL&_nc_ohc=1JpyGZAZRdAQ7kNvwGOELLE&_nc_oc=AdnQ08agtQ86p1sEW5y0T-qdZ9d5rSqihWIMchfiW1S9-qYBTmCg0hntlchbzErtAfo&_nc_zt=23&_nc_ht=scontent.fmnl13-2.fna&_nc_gid=8zYDGwOb8d_X9t5bb9ncZg&oh=00_AfcxX2stRHrosJZ8yPLe5xFeNBaE-LhCahXODzwgDx6RQw&oe=69044677', 'About Background', 'Background image for the about section', 2)
on conflict (key) do update set
  url = excluded.url,
  alt_text = excluded.alt_text,
  description = excluded.description,
  sort_order = excluded.sort_order,
  updated_at = now();

-- Hero content
insert into public.hero_content (id, badge, heading_line1, heading_line2, description, primary_button_text, primary_button_link, secondary_button_text, secondary_button_link, stats, hero_image)
values (
  true,
  'Handcrafted with Love',
  'Hand-Crafted',
  'Candles',
  'Each candle is a carefully crafted vessel, preserving the intangible: a Sentiment.',
  'View Collection',
  '/products',
  'Our Story',
  '#about',
  '[
    {"value": "100%", "label": "Soy Wax"},
    {"value": "15+", "label": "Hours Burn"},
    {"value": "17+", "label": "Scents"}
  ]'::jsonb,
  'https://scontent.fmnl13-3.fna.fbcdn.net/v/t39.30808-6/415712171_122102582264166976_5690103902187634756_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeFKn5ZpnsIBzukOjCE7w5kagpJUOZcT8iKCklQ5lxPyInre-HGRFPCn5AZkJQHbMskjFAnAqHYlDjQrJtwGo01N&_nc_ohc=0Xesh6RXRYoQ7kNvwGD8EKj&_nc_oc=AdnW-VaLZZlFM7cOguQcPjZE98Ujo8_WCVe6IPmdqPljrpP3nh0Oy5MtWbFaWn8qKKQ&_nc_zt=23&_nc_ht=scontent.fmnl13-3.fna&_nc_gid=FQgjBx19pasD9zfYVUd3aQ&oh=00_AfflB2jsB0yw57Sl5mvLWIqWDQm8ta2p4SOMnTz7NddqRg&oe=69046873'
)
on conflict (id) do update set
  badge = excluded.badge,
  heading_line1 = excluded.heading_line1,
  heading_line2 = excluded.heading_line2,
  description = excluded.description,
  primary_button_text = excluded.primary_button_text,
  primary_button_link = excluded.primary_button_link,
  secondary_button_text = excluded.secondary_button_text,
  secondary_button_link = excluded.secondary_button_link,
  stats = excluded.stats,
  hero_image = excluded.hero_image,
  updated_at = now();

-- =========================
-- RLS and Policies
-- =========================

-- Enable RLS
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.product_images enable row level security;
alter table public.product_scents enable row level security;
alter table public.events enable row level security;
alter table public.event_images enable row level security;
alter table public.about_content enable row level security;
alter table public.features enable row level security;
alter table public.contact_info enable row level security;
alter table public.social_media enable row level security;
alter table public.site_info enable row level security;
alter table public.nav_links enable row level security;
alter table public.footer_links enable row level security;
alter table public.assets enable row level security;
alter table public.hero_content enable row level security;

-- Read-all for anon (public website data)
do $$
declare
  t text;
begin
  for t in
    select unnest(array[
      'categories','products','product_variants','product_images','product_scents',
      'events','event_images','about_content','features','contact_info',
      'social_media','site_info','nav_links','footer_links','assets','hero_content'
    ])
  loop
    execute format($f$
      drop policy if exists %I_select_anon on public.%I;
      create policy %I_select_anon on public.%I
      for select using (true);
    $f$, t, t, t, t);
  end loop;
end$$;

-- Write for authenticated only
do $$
declare
  t text;
begin
  for t in
    select unnest(array[
      'categories','products','product_variants','product_images','product_scents',
      'events','event_images','about_content','features','contact_info',
      'social_media','site_info','nav_links','footer_links','assets','hero_content'
    ])
  loop
    execute format($f$
      drop policy if exists %I_write_auth on public.%I;
      create policy %I_write_auth on public.%I
      for all
      to authenticated
      using (true)
      with check (true);
    $f$, t, t, t, t);
  end loop;
end$$;

-- Helpful indexes
create index if not exists idx_products_category on public.products(category_slug);
create index if not exists idx_variants_product on public.product_variants(product_id);
create index if not exists idx_product_images_product on public.product_images(product_id);
create index if not exists idx_product_scents_product on public.product_scents(product_id);
create index if not exists idx_event_images_event on public.event_images(event_id);
create index if not exists idx_assets_key on public.assets(key);
create index if not exists idx_assets_type on public.assets(type);