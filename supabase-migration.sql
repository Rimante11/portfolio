-- Create the projects table
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT,
  modal_content TEXT,
  modal_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE
    ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert your existing project data
INSERT INTO projects (id, name, category, description, image, modal_content, modal_type) VALUES
  ('e-shop', 'Artlister E-shop', 'Web Development', 'A full-stack e-commerce web application currently under development. The frontend is built with React, React Router, Redux, Bootstrap, and Material UI, providing a responsive and dynamic user interface. The backend is powered by Node.js and Express, with MongoDB as the database and Cookie Parser for session management. GitHub Actions are integrated for continuous integration and deployment. Live demo: https://ecomerce-with-ai-search.vercel.app/', '/artlist.jpg', '/artlist.jpg', 'image'),
  
  ('dynamic-form', 'Dynamic Form', 'Web Development', 'An Angular application featuring a dynamic form with conditional fields, validation, and multi-step workflow. Built with Angular Material for modern UI components, responsive design and some custom styling. Check it out: https://dynamic-form-angular-livid.vercel.app/', '/angularForm.jpg', '/angularForm.jpg', 'image'),
  
  ('dashboard', 'Dashboard For Phone Calls', 'Web Development', 'Created a simple dashboard that visualizes data from a JSON object. The goal was to display the total calls per employee per day using several graphs and tables. A modern full-stack web application built with .NET 9.0 and ASP.NET Core MVC, following the MVC and Service Layer patterns with dependency injection. The frontend uses Razor Views, Bootstrap, jQuery, and Chart.js for responsive UI and data visualization. Features include runtime Razor compilation, JSON-based configuration, and hot reload for streamlined development. Take a look at the code: https://github.com/Rimante11/dashboard_for_phone_calls', '/dashboard.png', '/dashboard.png', 'image'),
  
  ('coffee-shop', 'Coffee Shop', 'UX/UI Design', 'A modern coffee shop application designed with user experience in mind. Features intuitive navigation, beautiful visual design, and seamless ordering process. The app focuses on creating a warm, inviting atmosphere that reflects the cozy nature of coffee shops.', '/coffe_in.png', '/coffe_in.png', 'image'),
  
  ('salushi', 'Salushi', 'Web Development', 'One page application for sushi express. Features modern design, responsive layout, and seamless user experience for ordering delicious sushi.', '/salushi.png', '/one_page_sushi.pdf', 'pdf'),
  
  ('charge-home', 'Charge Home', 'Web Development', 'Webshop for electric cars charger shop and integration of electric chargers. Features comprehensive product catalog, secure payment processing, and detailed charger specifications for electric vehicle owners. The application used Shopify CMS, which allowed easy content management, product catalog updates, and e-commerce functionality.', '/charge_home.png', '/Chargehome_prototype.pdf', 'pdf'),
  
  ('personal-card', 'Personal card', 'UX/UI Design', 'A personal card for developers. A modern digital business card application designed specifically for developers and tech professionals. Features clean, minimalist design with easy sharing capabilities, contact information display, and professional portfolio showcase. Perfect for networking and making lasting impressions in the tech community.', '/personal_card.png', '/personal_card.png', 'image');

-- Enable Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows everyone to read projects
CREATE POLICY "Everyone can view projects" ON projects
  FOR SELECT USING (true);

-- If you want to add admin functionality later, you can create policies like:
-- CREATE POLICY "Only authenticated users can insert" ON projects
--   FOR INSERT WITH CHECK (auth.role() = 'authenticated');
-- CREATE POLICY "Only authenticated users can update" ON projects
--   FOR UPDATE USING (auth.role() = 'authenticated');
-- CREATE POLICY "Only authenticated users can delete" ON projects
--   FOR DELETE USING (auth.role() = 'authenticated');