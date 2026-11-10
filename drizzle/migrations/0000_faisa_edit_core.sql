-- Roles
CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- First account ever created becomes the admin
CREATE OR REPLACE FUNCTION public.assign_first_admin()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created_assign_admin
  AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.assign_first_admin();

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

-- Vendor applications
CREATE TYPE public.application_status AS ENUM ('received','under_review','approved','waitlisted','declined');

CREATE TABLE public.vendor_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference text NOT NULL UNIQUE DEFAULT ('FE-' || upper(substr(md5(random()::text || clock_timestamp()::text), 1, 6))),
  business_name text NOT NULL,
  contact_person text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  instagram text NOT NULL,
  website text,
  city text NOT NULL,
  description text NOT NULL,
  categories text[] NOT NULL DEFAULT '{}',
  other_category text,
  space_type text NOT NULL,
  stall_size text,
  needs_electricity boolean NOT NULL DEFAULT false,
  needs_water boolean NOT NULL DEFAULT false,
  special_setup text,
  equipment text,
  special_requirements text,
  logo_path text,
  product_paths text[] NOT NULL DEFAULT '{}',
  document_paths text[] NOT NULL DEFAULT '{}',
  participated_before boolean NOT NULL DEFAULT false,
  uniqueness text NOT NULL,
  motivation text NOT NULL,
  additional_info text,
  agreed_terms boolean NOT NULL DEFAULT false,
  status public.application_status NOT NULL DEFAULT 'received',
  internal_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE, DELETE ON public.vendor_applications TO authenticated;
GRANT ALL ON public.vendor_applications TO service_role;
ALTER TABLE public.vendor_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read applications" ON public.vendor_applications FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update applications" ON public.vendor_applications FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete applications" ON public.vendor_applications FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER vendor_applications_updated BEFORE UPDATE ON public.vendor_applications FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Newsletter
CREATE TABLE public.newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  email text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, DELETE ON public.newsletter_subscribers TO authenticated;
GRANT ALL ON public.newsletter_subscribers TO service_role;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read subscribers" ON public.newsletter_subscribers FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete subscribers" ON public.newsletter_subscribers FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Contact messages
CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  enquiry_type text NOT NULL,
  message text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE, DELETE ON public.contact_messages TO authenticated;
GRANT ALL ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read messages" ON public.contact_messages FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update messages" ON public.contact_messages FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete messages" ON public.contact_messages FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Media items (gallery)
CREATE TABLE public.media_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  media_type text NOT NULL CHECK (media_type IN ('image','video')),
  url text NOT NULL,
  storage_path text,
  poster_url text,
  caption text,
  category text,
  featured boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.media_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.media_items TO authenticated;
GRANT ALL ON public.media_items TO service_role;
ALTER TABLE public.media_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone views media" ON public.media_items FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins insert media" ON public.media_items FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update media" ON public.media_items FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete media" ON public.media_items FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Vendor spotlights
CREATE TABLE public.vendor_spotlights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_name text NOT NULL,
  description text,
  instagram text,
  logo_url text,
  image_url text,
  published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.vendor_spotlights TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.vendor_spotlights TO authenticated;
GRANT ALL ON public.vendor_spotlights TO service_role;
ALTER TABLE public.vendor_spotlights ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone views published spotlights" ON public.vendor_spotlights FOR SELECT TO anon, authenticated USING (published = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins insert spotlights" ON public.vendor_spotlights FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update spotlights" ON public.vendor_spotlights FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete spotlights" ON public.vendor_spotlights FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Site settings (single row)
CREATE TABLE public.site_settings (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  market_status text NOT NULL DEFAULT 'no_date' CHECK (market_status IN ('no_date','announced','applications_open','applications_closed','completed')),
  announcement_title text,
  announcement_body text,
  event_name text,
  event_date date,
  event_time text,
  event_venue text,
  event_published boolean NOT NULL DEFAULT false,
  contact_email text,
  whatsapp text,
  instagram_url text NOT NULL DEFAULT 'https://www.instagram.com/thefaisaeditx/',
  newsletter_note text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, UPDATE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads settings" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins update settings" ON public.site_settings FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER site_settings_updated BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
INSERT INTO public.site_settings (id) VALUES (1);

-- FAQs
CREATE TABLE public.faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.faqs TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.faqs TO authenticated;
GRANT ALL ON public.faqs TO service_role;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads faqs" ON public.faqs FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins insert faqs" ON public.faqs FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update faqs" ON public.faqs FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete faqs" ON public.faqs FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.faqs (question, answer, sort_order) VALUES
('Who can apply?', 'Independent brands, small businesses, food concepts, creatives and entrepreneurs who would love to be part of a future Faisa Edit. Every application is reviewed by our team.', 1),
('Can food trucks apply?', 'Yes. Choose "Food Truck" as your category and "Food truck space" under space requirements so we know what you need.', 2),
('Can I apply if I am a small business?', 'Absolutely. The Faisa Edit exists to celebrate small and independent businesses.', 3),
('Do I need to have an established business?', 'Not necessarily. Tell us about your brand, what you offer and what makes it special. Every application is considered on its own merit.', 4),
('What stall options are available?', 'You can let us know if you are interested in a standard stall, a larger premium stall, a food truck space, an outdoor activation or a brand experience. Final options depend on each edition''s layout and availability.', 5),
('Is electricity available?', 'Let us know in your application if you will need electricity or water. Details regarding stall fees, availability and event arrangements will be communicated to shortlisted or approved vendors.', 6),
('How much does a stall cost?', 'Details regarding stall fees, availability and event arrangements will be communicated to shortlisted or approved vendors.', 7),
('When will applications close?', 'No upcoming market date has been confirmed yet, so applications are being collected for future editions. Any closing dates will be shared on our website and Instagram.', 8),
('How will I know if I am accepted?', 'Our team reviews every application and will contact shortlisted or approved vendors using the details you provide. Submitting an application does not guarantee a stall.', 9),
('Can I apply for future markets?', 'Yes. All applications are currently being collected for future editions of The Faisa Edit.', 10);
