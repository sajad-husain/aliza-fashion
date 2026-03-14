-- Seed data generated from src/data.js
-- Safe to run multiple times (uses ON CONFLICT upsert)

begin;

insert into products (
  id,
  name,
  price,
  image,
  category,
  fabric,
  length,
  care,
  description,
  in_stock
) values
  (
    1,
    'Embroidered Royal Blue Lawn Suit',
    4500,
    'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80',
    'Women',
    'Pure Cotton Lawn',
    '6 meters',
    'Hand wash recommended',
    'Beautiful embroidered lawn suit with intricate thread work. Perfect for summer occasions and casual gatherings. Features a coordinated dupatta and shirt.',
    true
  ),
  (
    2,
    'Classic White Cotton Shalwar Kameez',
    3200,
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    'Men',
    '100% Premium Cotton',
    '5.5 meters',
    'Machine washable',
    'Timeless white shalwar kameez crafted from premium quality cotton. Regular fit design suitable for both formal and casual occasions.',
    true
  ),
  (
    3,
    'Floral Pink Chiffon Dress',
    5800,
    'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80',
    'Women',
    'Premium Chiffon',
    '4 meters',
    'Dry clean only',
    'Elegant floral chiffon dress with beautiful prints. Lightweight and perfect for weddings and formal events. Comes with lining.',
    true
  ),
  (
    4,
    'Kids Colorful Frock Set',
    2500,
    'https://images.unsplash.com/photo-1519235106638-35e35556b40d?auto=format&fit=crop&w=800&q=80',
    'Kids',
    'Soft Cotton Blend',
    '2.5 meters',
    'Machine washable',
    'Adorable colorful frock set for kids. Made from soft, skin-friendly fabric. Available in multiple vibrant colors.',
    true
  ),
  (
    5,
    'Luxury Gold Silk Ensemble',
    12500,
    'https://images.unsplash.com/photo-1569407228235-9a744849a066?auto=format&fit=ccrop&w=800&q=80',
    'Women',
    'Pure Silk',
    '6.5 meters',
    'Professional dry clean',
    'Exquisite gold silk ensemble with heavy embellishments. Perfect for weddings and grand celebrations. Includes heavy dupatta with border work.',
    true
  ),
  (
    6,
    'Traditional Black Sherwani',
    8500,
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
    'Men',
    'Silk Blend',
    '4 meters',
    'Dry clean recommended',
    'Classic black sherwani with elegant embroidery. Perfect for groom and wedding guests. Features traditional cut with modern styling.',
    true
  ),
  (
    7,
    'Pastel Green Cambric Suit',
    3800,
    'https://images.unsplash.com/photo-1618932260643-2b6726551715?auto=format&fit=crop&w=800&q=80',
    'Women',
    'Premium Cambric',
    '5.5 meters',
    'Hand wash recommended',
    'Fresh pastel green cambric suit with minimalistic prints. Ideal for office wear and daytime events. Breathable fabric for all-day comfort.',
    true
  ),
  (
    8,
    'Festive Ready-to-Wear Dress',
    6200,
    'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
    'Women',
    'Jacquard Blend',
    '4.5 meters',
    'Dry clean only',
    'Beautiful festive dress ready to wear. Features intricate embellishments and premium quality fabric. Perfect for Eid and celebrations.',
    true
  )
on conflict (id) do update set
  name = excluded.name,
  price = excluded.price,
  image = excluded.image,
  category = excluded.category,
  fabric = excluded.fabric,
  length = excluded.length,
  care = excluded.care,
  description = excluded.description,
  in_stock = excluded.in_stock;

-- keep identity sequence aligned after explicit IDs
select setval(
  pg_get_serial_sequence('products', 'id'),
  coalesce((select max(id) from products), 1),
  true
);

commit;
