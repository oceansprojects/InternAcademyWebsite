-- Migration: 009_replace_ai_with_data_analyst.sql
-- Reconfigure the two non-data-engineering courses without changing course 3.

BEGIN;

-- Remove dependent content for courses 1 and 2 only.
DELETE FROM program_faq_assignments
WHERE program_id IN (
  '10000000-0000-0000-0000-000000000001',
  '20000000-0000-0000-0000-000000000002'
);
DELETE FROM testimonials
WHERE program_id IN (
  '10000000-0000-0000-0000-000000000001',
  '20000000-0000-0000-0000-000000000002'
);
DELETE FROM program_faculty
WHERE program_id IN (
  '10000000-0000-0000-0000-000000000001',
  '20000000-0000-0000-0000-000000000002'
);
DELETE FROM program_project_tags
WHERE project_id IN (
  SELECT id FROM program_projects
  WHERE program_id IN (
    '10000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000002'
  )
);
DELETE FROM program_projects
WHERE program_id IN (
  '10000000-0000-0000-0000-000000000001',
  '20000000-0000-0000-0000-000000000002'
);
DELETE FROM curriculum_topics
WHERE module_id IN (
  SELECT id FROM curriculum_modules
  WHERE program_id IN (
    '10000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000002'
  )
);
DELETE FROM curriculum_modules
WHERE program_id IN (
  '10000000-0000-0000-0000-000000000001',
  '20000000-0000-0000-0000-000000000002'
);
DELETE FROM program_technologies
WHERE program_id IN (
  '10000000-0000-0000-0000-000000000001',
  '20000000-0000-0000-0000-000000000002'
);
DELETE FROM program_summary_cards
WHERE program_id IN (
  '10000000-0000-0000-0000-000000000001',
  '20000000-0000-0000-0000-000000000002'
);
DELETE FROM program_overview
WHERE program_id IN (
  '10000000-0000-0000-0000-000000000001',
  '20000000-0000-0000-0000-000000000002'
);

-- Course 1: Python Full Stack Development.
UPDATE programs
SET
  slug = 'python-full-stack-development',
  title = 'Python Full Stack Development',
  subtitle = 'Python Web Applications, APIs & Modern Frontends',
  category = 'Engineering',
  duration_weeks = 16,
  schedule = 'Mon-Fri (In-person Cohort Labs)',
  base_price = 49999,
  discounted_price = 34999,
  card_image_url = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
  meta_title = 'Python Full Stack Development Cohort | InternAcademy Bengaluru',
  meta_description = 'Become a job-ready Python full-stack developer. Master Python, Django, FastAPI, React, PostgreSQL, and production deployment with hands-on training.'
WHERE id = '10000000-0000-0000-0000-000000000001';

INSERT INTO program_overview (program_id, intro_text) VALUES (
  '10000000-0000-0000-0000-000000000001',
  '{"bold_intro":"Become an industry-ready Python full-stack developer equipped to design, build, and deploy production software.","paragraphs":["Our 16-week intensive cohort takes you from Python foundations to production web applications using Django, Django REST Framework, FastAPI, React, and PostgreSQL.","You will work on real client briefs alongside senior engineering mentors and ship tested, containerized applications."],"master_points":["Build maintainable Python applications with typing, testing, and reusable modules","Develop secure Django and FastAPI services with REST APIs and authentication","Create responsive React frontends that consume production Python APIs","Deploy PostgreSQL-backed applications with Docker, CI/CD, and cloud hosting"]}'
);

INSERT INTO program_summary_cards (program_id, label, value, icon, sort_order) VALUES
  ('10000000-0000-0000-0000-000000000001', 'DURATION', '16 Weeks (4 Months)', 'clock', 1),
  ('10000000-0000-0000-0000-000000000001', 'ELIGIBILITY', 'Final Year / Grads / Developers', 'users', 2),
  ('10000000-0000-0000-0000-000000000001', 'MODE', 'Offline in Bengaluru', 'map-pin', 3),
  ('10000000-0000-0000-0000-000000000001', 'CERTIFICATION', 'QR Verifiable Credential', 'award', 4),
  ('10000000-0000-0000-0000-000000000001', 'INTERNSHIP', 'Guaranteed 8-wk Guild Placement', 'briefcase', 5),
  ('10000000-0000-0000-0000-000000000001', 'PLACEMENT', 'Python Developer Interview Track', 'trending-up', 6),
  ('10000000-0000-0000-0000-000000000001', 'STACK', 'Python, Django, FastAPI, React', 'sparkles', 7),
  ('10000000-0000-0000-0000-000000000001', 'START DATE', 'Upcoming Monday', 'calendar', 8);

INSERT INTO curriculum_modules (id, program_id, phase_label, title, objective, sort_order) VALUES
  ('11000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'PHASE 1', 'Python Engineering Foundations', 'Objective: Build reliable Python software with OOP, typing, testing, and package management.', 1),
  ('11000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'PHASE 2', 'Django & REST API Development', 'Objective: Create secure, database-backed applications and APIs with Django and DRF.', 2),
  ('11000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', 'PHASE 3', 'FastAPI & React Integration', 'Objective: Build async Python services and modern React interfaces.', 3),
  ('11000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000001', 'PHASE 4', 'Production Delivery & Guild Internship', 'Objective: Test, containerize, deploy, and present a complete full-stack product.', 4);

INSERT INTO curriculum_topics (module_id, topic, sort_order) VALUES
  ('11000000-0000-0000-0000-000000000001', 'Python Syntax, OOP, Type Hints & Virtual Environments', 1),
  ('11000000-0000-0000-0000-000000000001', 'Pytest, Ruff, Packaging & Clean Architecture', 2),
  ('11000000-0000-0000-0000-000000000002', 'Django Models, ORM, Admin & Authentication', 1),
  ('11000000-0000-0000-0000-000000000002', 'Django REST Framework, Serialization & Permissions', 2),
  ('11000000-0000-0000-0000-000000000003', 'FastAPI, Pydantic, AsyncIO & OpenAPI', 1),
  ('11000000-0000-0000-0000-000000000003', 'React Components, State & API Client Integration', 2),
  ('11000000-0000-0000-0000-000000000004', 'PostgreSQL, SQLAlchemy, Redis & Background Jobs', 1),
  ('11000000-0000-0000-0000-000000000004', 'Docker, GitHub Actions, Cloud Deployment & Monitoring', 2);

INSERT INTO program_technologies (program_id, label, icon_url, sort_order) VALUES
  ('10000000-0000-0000-0000-000000000001', 'Python', '', 1),
  ('10000000-0000-0000-0000-000000000001', 'Django', '', 2),
  ('10000000-0000-0000-0000-000000000001', 'Django REST Framework', '', 3),
  ('10000000-0000-0000-0000-000000000001', 'FastAPI', '', 4),
  ('10000000-0000-0000-0000-000000000001', 'React', '', 5),
  ('10000000-0000-0000-0000-000000000001', 'PostgreSQL', '', 6),
  ('10000000-0000-0000-0000-000000000001', 'SQLAlchemy', '', 7),
  ('10000000-0000-0000-0000-000000000001', 'Docker', '', 8);

INSERT INTO program_projects (id, program_id, title, description, level, image_url, sort_order) VALUES
  ('12000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Django Marketplace Platform', 'Production marketplace with catalog management, authentication, PostgreSQL transactions, and a React storefront.', 'advanced', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80', 1),
  ('12000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'FastAPI Operations Dashboard', 'Async operations dashboard with role-based access, background jobs, analytics APIs, and responsive React views.', 'intermediate', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80', 2);

INSERT INTO program_project_tags (project_id, tag, sort_order) VALUES
  ('12000000-0000-0000-0000-000000000001', 'Django', 1),
  ('12000000-0000-0000-0000-000000000001', 'PostgreSQL', 2),
  ('12000000-0000-0000-0000-000000000001', 'React', 3),
  ('12000000-0000-0000-0000-000000000002', 'FastAPI', 1),
  ('12000000-0000-0000-0000-000000000002', 'Python', 2),
  ('12000000-0000-0000-0000-000000000002', 'Docker', 3);

INSERT INTO program_faculty (program_id, faculty_id, sort_order) VALUES
  ('10000000-0000-0000-0000-000000000001', '7fafdbad-d1a2-4952-9619-2b8823b453e3', 1);

INSERT INTO testimonials (program_id, author_name, company, batch, content, rating, avatar_url, is_published) VALUES
  ('10000000-0000-0000-0000-000000000001', 'Nikhil Sharma', 'Software Engineer at Razorpay', 'Batch 4 - Jan 2026', 'The Python projects were close to real production work. Django and FastAPI practice made my backend interviews much more practical.', 5, 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80', TRUE);

-- Course 2: Data Analyst, replacing Generative AI.
UPDATE programs
SET
  slug = 'data-analyst',
  title = 'Data Analyst',
  subtitle = 'Business Intelligence, Statistics & Data Storytelling',
  category = 'Data',
  duration_weeks = 12,
  schedule = 'Tue-Sat (Analytics Lab Sessions)',
  base_price = 44999,
  discounted_price = 31999,
  card_image_url = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
  meta_title = 'Data Analyst Cohort | InternAcademy Bengaluru',
  meta_description = 'Become a job-ready data analyst with practical training in Python, SQL, Excel, statistics, Power BI, Tableau, and business storytelling.'
WHERE id = '20000000-0000-0000-0000-000000000002';

INSERT INTO program_overview (program_id, intro_text) VALUES (
  '20000000-0000-0000-0000-000000000002',
  '{"bold_intro":"Turn messy business data into reliable insights, clear dashboards, and decisions stakeholders can act on.","paragraphs":["This 12-week analyst cohort builds practical fluency in Python, SQL, spreadsheets, statistics, and visualization through realistic business datasets.","You will create portfolio projects in Power BI and Tableau, explain findings to non-technical audiences, and practice the workflow used by modern analytics teams."],"master_points":["Clean, reshape, and analyze datasets with Python, NumPy, and Pandas","Write production-quality SQL with joins, CTEs, windows, and KPI logic","Apply descriptive statistics and hypothesis testing to business questions","Build decision-ready dashboards and present insights with Power BI and Tableau"]}'
);

INSERT INTO program_summary_cards (program_id, label, value, icon, sort_order) VALUES
  ('20000000-0000-0000-0000-000000000002', 'DURATION', '12 Weeks (3 Months)', 'clock', 1),
  ('20000000-0000-0000-0000-000000000002', 'ELIGIBILITY', 'Graduates & Career Switchers', 'users', 2),
  ('20000000-0000-0000-0000-000000000002', 'MODE', 'Offline in Bengaluru', 'map-pin', 3),
  ('20000000-0000-0000-0000-000000000002', 'CERTIFICATION', 'Data Analyst Credential', 'award', 4),
  ('20000000-0000-0000-0000-000000000002', 'INTERNSHIP', 'Guaranteed Analytics Internship', 'briefcase', 5),
  ('20000000-0000-0000-0000-000000000002', 'PLACEMENT', 'Data Analyst Interview Track', 'trending-up', 6),
  ('20000000-0000-0000-0000-000000000002', 'TOOLS', 'Python, SQL, Power BI, Tableau', 'sparkles', 7),
  ('20000000-0000-0000-0000-000000000002', 'START DATE', 'Upcoming Cohort', 'calendar', 8);

INSERT INTO curriculum_modules (id, program_id, phase_label, title, objective, sort_order) VALUES
  ('21000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002', 'PHASE 1', 'Python for Data Analysis', 'Objective: Load, clean, transform, and explore real-world datasets with Python.', 1),
  ('21000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', 'PHASE 2', 'SQL & Business Metrics', 'Objective: Answer business questions with robust analytical SQL and well-defined KPIs.', 2),
  ('21000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000002', 'PHASE 3', 'Statistics & Visualization', 'Objective: Select appropriate statistical methods and communicate patterns accurately.', 3),
  ('21000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000002', 'PHASE 4', 'Dashboards, Storytelling & Placement', 'Objective: Deliver interactive dashboards and defend recommendations with evidence.', 4);

INSERT INTO curriculum_topics (module_id, topic, sort_order) VALUES
  ('21000000-0000-0000-0000-000000000001', 'Python, Jupyter, NumPy & Pandas DataFrames', 1),
  ('21000000-0000-0000-0000-000000000001', 'Data Cleaning, Missing Values & Feature Preparation', 2),
  ('21000000-0000-0000-0000-000000000002', 'Joins, CTEs, Subqueries & Window Functions', 1),
  ('21000000-0000-0000-0000-000000000002', 'KPI Design, Cohort Analysis & Query Optimization', 2),
  ('21000000-0000-0000-0000-000000000003', 'Descriptive Statistics & Hypothesis Testing', 1),
  ('21000000-0000-0000-0000-000000000003', 'Matplotlib, Seaborn & Choosing Effective Charts', 2),
  ('21000000-0000-0000-0000-000000000004', 'Excel Modeling, Power BI, DAX & Tableau', 1),
  ('21000000-0000-0000-0000-000000000004', 'Stakeholder Presentations, Portfolios & Case Interviews', 2);

INSERT INTO program_technologies (program_id, label, icon_url, sort_order) VALUES
  ('20000000-0000-0000-0000-000000000002', 'Python', '', 1),
  ('20000000-0000-0000-0000-000000000002', 'SQL', '', 2),
  ('20000000-0000-0000-0000-000000000002', 'Excel', '', 3),
  ('20000000-0000-0000-0000-000000000002', 'NumPy', '', 4),
  ('20000000-0000-0000-0000-000000000002', 'Pandas', '', 5),
  ('20000000-0000-0000-0000-000000000002', 'Matplotlib & Seaborn', '', 6),
  ('20000000-0000-0000-0000-000000000002', 'Power BI', '', 7),
  ('20000000-0000-0000-0000-000000000002', 'Tableau', '', 8);

INSERT INTO program_projects (id, program_id, title, description, level, image_url, sort_order) VALUES
  ('22000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002', 'E-Commerce Customer Insights', 'Analyze customer behavior, retention, and revenue drivers with Python and SQL, then present recommendations in a dashboard.', 'intermediate', 'https://images.unsplash.com/photo-1556742049-0a67daf64f42?auto=format&fit=crop&w=800&q=80', 1),
  ('22000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', 'Executive Sales Performance Dashboard', 'Build an interactive Power BI and Tableau dashboard with regional KPIs, drilldowns, forecasts, and a stakeholder narrative.', 'advanced', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80', 2);

INSERT INTO program_project_tags (project_id, tag, sort_order) VALUES
  ('22000000-0000-0000-0000-000000000001', 'Python', 1),
  ('22000000-0000-0000-0000-000000000001', 'SQL', 2),
  ('22000000-0000-0000-0000-000000000001', 'Pandas', 3),
  ('22000000-0000-0000-0000-000000000002', 'Power BI', 1),
  ('22000000-0000-0000-0000-000000000002', 'Tableau', 2),
  ('22000000-0000-0000-0000-000000000002', 'Data Storytelling', 3);

INSERT INTO program_faculty (program_id, faculty_id, sort_order) VALUES
  ('20000000-0000-0000-0000-000000000002', 'e8969208-80cd-4991-b879-96f6c368a9db', 1);

INSERT INTO testimonials (program_id, author_name, company, batch, content, rating, avatar_url, is_published) VALUES
  ('20000000-0000-0000-0000-000000000002', 'Priya Kulkarni', 'Data Analyst at Postman', 'Batch 1 - Feb 2026', 'The SQL case studies and dashboard reviews helped me explain my analysis clearly and move into my first analytics role.', 5, 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80', TRUE);

-- Keep the existing global FAQ pool and assign it to the two reconfigured courses.
INSERT INTO program_faq_assignments (program_id, faq_id, sort_order)
SELECT p.id, f.id, 1
FROM programs p
CROSS JOIN global_faqs f
WHERE p.id IN (
  '10000000-0000-0000-0000-000000000001',
  '20000000-0000-0000-0000-000000000002'
)
ON CONFLICT DO NOTHING;

COMMIT;
