-- Initialize the database with default content and admin user
-- Run this after setting up your PostgreSQL database

-- Insert default content items
INSERT INTO content_items (id, key, value, type, category, description, created_at, updated_at) VALUES
('hero_title', 'hero.title', 'Welcome to', 'TEXT', 'hero', 'Main hero title', NOW(), NOW()),
('hero_subtitle', 'hero.subtitle', 'Bozhiymir Church', 'TEXT', 'hero', 'Hero subtitle', NOW(), NOW()),
('hero_service_times', 'hero.serviceTimes', '9:00AM (TRADITIONAL), 10:30AM, OR 12:00PM', 'TEXT', 'hero', 'Service times display', NOW(), NOW()),
('hero_description', 'hero.description', '🇺🇦 A loving community in Portland where Ukrainian children find hope and healing', 'TEXTAREA', 'hero', 'Hero description in English', NOW(), NOW()),
('hero_description_ua', 'hero.descriptionUkrainian', 'Любляча спільнота в Портленді, де українські діти знаходять надію', 'TEXTAREA', 'hero', 'Hero description in Ukrainian', NOW(), NOW()),
('hero_cta', 'hero.callToAction', 'Join our church family this Sunday', 'TEXT', 'hero', 'Call to action text', NOW(), NOW()),
('hero_scripture', 'hero.scripture', '"He defends the cause of the fatherless and the widow, and loves the foreigner residing among you" - Deuteronomy 10:18', 'TEXTAREA', 'hero', 'Hero scripture verse', NOW(), NOW()),

('beliefs_title', 'beliefs.title', 'Our Beliefs', 'TEXT', 'beliefs', 'Beliefs page title', NOW(), NOW()),
('beliefs_subtitle', 'beliefs.subtitle', 'At Bozhiymir Church, our faith is built on the solid foundation of God''s Word. These core beliefs guide everything we do as a church family.', 'TEXTAREA', 'beliefs', 'Beliefs page subtitle', NOW(), NOW()),

('footer_church_name', 'footer.churchName', 'Bozhiymir Church', 'TEXT', 'footer', 'Church name in footer', NOW(), NOW()),
('footer_description', 'footer.description', 'A welcoming community where families grow together in faith and fellowship.', 'TEXTAREA', 'footer', 'Footer description', NOW(), NOW()),
('footer_phone', 'footer.contact.phone', '(503) 555-0123', 'TEXT', 'footer', 'Church phone number', NOW(), NOW()),
('footer_email', 'footer.contact.email', 'info@bozhiymirchurch.com', 'TEXT', 'footer', 'Church email address', NOW(), NOW()),
('footer_address_street', 'footer.contact.address.street', '123 Community Street', 'TEXT', 'footer', 'Church street address', NOW(), NOW()),
('footer_address_city', 'footer.contact.address.city', 'Portland, OR 97201', 'TEXT', 'footer', 'Church city and state', NOW(), NOW());

-- Insert demo admin user (password: admin123)
INSERT INTO users (id, email, username, password, first_name, last_name, position, is_active, created_at, updated_at) VALUES
('admin_user_id', 'admin@bozhiymirchurch.com', 'admin', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3bp.Gm.F5W', 'Church', 'Administrator', 'ADMINISTRATOR', true, NOW(), NOW());

-- Insert demo member user (password: member123)
INSERT INTO users (id, email, username, password, first_name, last_name, position, is_active, created_at, updated_at) VALUES
('member_user_id', 'member@bozhiymirchurch.com', 'member', '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'John', 'Member', 'MEMBER', true, NOW(), NOW());
