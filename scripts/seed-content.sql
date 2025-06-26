-- Insert default content for all pages
INSERT INTO content (page, section, key, value) VALUES
-- Home page content
('home', 'hero', 'title', 'Welcome to Bozhiymir Church'),
('home', 'hero', 'subtitle', 'A Community of Faith, Hope, and Love'),
('home', 'hero', 'description', 'Join us as we grow together in faith and fellowship, supporting Ukrainian children with love and hope.'),
('home', 'about', 'title', 'About Our Church'),
('home', 'about', 'description', 'Bozhiymir Church is a welcoming community in Portland where families come together to worship, learn, and serve.'),
('home', 'services', 'title', 'Service Times'),
('home', 'services', 'sunday_service', 'Sunday Worship: 10:00 AM'),
('home', 'services', 'bible_study', 'Bible Study: Wednesday 7:00 PM'),

-- Beliefs page content
('beliefs', 'main', 'title', 'Our Beliefs'),
('beliefs', 'main', 'description', 'We believe in the fundamental truths of Christianity as revealed in the Holy Bible.'),
('beliefs', 'trinity', 'title', 'The Trinity'),
('beliefs', 'trinity', 'description', 'We believe in one God, eternally existing in three persons: Father, Son, and Holy Spirit.'),
('beliefs', 'salvation', 'title', 'Salvation'),
('beliefs', 'salvation', 'description', 'We believe that salvation is by grace through faith in Jesus Christ alone.'),

-- Leadership page content
('leadership', 'main', 'title', 'Our Leadership'),
('leadership', 'main', 'description', 'Meet the dedicated leaders who serve our church community.'),
('leadership', 'pastor', 'name', 'Pastor John Smith'),
('leadership', 'pastor', 'title', 'Senior Pastor'),
('leadership', 'pastor', 'description', 'Pastor John has been serving our community for over 15 years with dedication and love.'),

-- Story page content
('story', 'main', 'title', 'Our Story'),
('story', 'main', 'description', 'Learn about the history and mission of Bozhiymir Church.'),
('story', 'history', 'title', 'Our History'),
('story', 'history', 'description', 'Founded in 1995, Bozhiymir Church has been a beacon of hope in the Portland community.'),

-- Ukrainian Ministry page content
('ukrainian-ministry', 'main', 'title', 'Ukrainian Ministry'),
('ukrainian-ministry', 'main', 'description', 'Supporting Ukrainian families and children in their time of need.'),
('ukrainian-ministry', 'mission', 'title', 'Our Mission'),
('ukrainian-ministry', 'mission', 'description', 'We are committed to providing support, love, and hope to Ukrainian children and families.'),

-- Events page content
('events', 'main', 'title', 'Upcoming Events'),
('events', 'main', 'description', 'Join us for these upcoming events and activities.'),

-- Ministries page content
('ministries', 'main', 'title', 'Our Ministries'),
('ministries', 'main', 'description', 'Discover the various ways you can get involved in our church community.'),
('ministries', 'youth', 'title', 'Youth Ministry'),
('ministries', 'youth', 'description', 'Engaging programs for teenagers and young adults.'),
('ministries', 'children', 'title', 'Children''s Ministry'),
('ministries', 'children', 'description', 'Fun and educational programs for children of all ages.'),

-- Join page content
('join', 'main', 'title', 'Join Our Community'),
('join', 'main', 'description', 'We welcome you to become part of our church family.'),
('join', 'welcome', 'title', 'New Here?'),
('join', 'welcome', 'description', 'We would love to meet you and help you feel at home in our community.')

ON CONFLICT (page, section, key) DO NOTHING;
