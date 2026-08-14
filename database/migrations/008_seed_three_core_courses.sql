-- Migration: 008_seed_three_core_courses.sql
-- Safely cleans old program entries and seeds the 3 official courses:
-- 1. Full Stack Development
-- 2. Generative AI
-- 3. Data Engineering

BEGIN;

-- Ensure experience_years column exists on faculty table
ALTER TABLE faculty ADD COLUMN IF NOT EXISTS experience_years INT;

-- 1. Safely delete existing program entries (cascades to program child tables)
DELETE FROM programs;

-- 2. Ensure existing faculty entries have complete professional profiles
UPDATE faculty
SET
  name = 'Aravind Menon',
  role = 'Lead Architect & Senior Full-Stack Engineer',
  institution = 'Ex-Engineering Lead at Swiggy',
  bio = '12+ years of experience building high-scale web platforms, microservices, and distributed cloud applications.',
  avatar_url = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  linkedin_url = 'https://linkedin.com',
  experience_years = 12
WHERE id = '7fafdbad-d1a2-4952-9619-2b8823b453e3';

UPDATE faculty
SET
  name = 'Dr. Sneha Rao',
  role = 'Principal AI Researcher & Data Architect',
  institution = 'PhD in Machine Learning (IISc Bengaluru)',
  bio = 'Specializes in Large Language Models, Generative AI pipeline optimization, and large-scale data engineering.',
  avatar_url = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
  linkedin_url = 'https://linkedin.com',
  experience_years = 10
WHERE id = 'e8969208-80cd-4991-b879-96f6c368a9db';

-- Ensure both faculty exist if IDs were different in DB
INSERT INTO faculty (id, name, role, institution, bio, avatar_url, linkedin_url, experience_years)
VALUES
  ('7fafdbad-d1a2-4952-9619-2b8823b453e3', 'Aravind Menon', 'Lead Architect & Senior Full-Stack Engineer', 'Ex-Engineering Lead at Swiggy', '12+ years of experience building high-scale web platforms.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80', 'https://linkedin.com', 12),
  ('e8969208-80cd-4991-b879-96f6c368a9db', 'Dr. Sneha Rao', 'Principal AI Researcher & Data Architect', 'PhD in Machine Learning (IISc Bengaluru)', 'Specializes in LLMs, Generative AI pipelines, and data engineering.', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80', 'https://linkedin.com', 10)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  institution = EXCLUDED.institution,
  bio = EXCLUDED.bio,
  avatar_url = EXCLUDED.avatar_url,
  experience_years = EXCLUDED.experience_years;

-- 3. Add Expertise Tags for Instructors
DELETE FROM faculty_expertise WHERE faculty_id IN ('7fafdbad-d1a2-4952-9619-2b8823b453e3', 'e8969208-80cd-4991-b879-96f6c368a9db');

INSERT INTO faculty_expertise (faculty_id, tag, sort_order) VALUES
  ('7fafdbad-d1a2-4952-9619-2b8823b453e3', 'React & Next.js', 1),
  ('7fafdbad-d1a2-4952-9619-2b8823b453e3', 'Node.js & Microservices', 2),
  ('7fafdbad-d1a2-4952-9619-2b8823b453e3', 'PostgreSQL & Prisma', 3),
  ('7fafdbad-d1a2-4952-9619-2b8823b453e3', 'System Design', 4),
  ('e8969208-80cd-4991-b879-96f6c368a9db', 'Generative AI & LLMs', 1),
  ('e8969208-80cd-4991-b879-96f6c368a9db', 'PyTorch & Transformers', 2),
  ('e8969208-80cd-4991-b879-96f6c368a9db', 'Data Engineering & Spark', 3),
  ('e8969208-80cd-4991-b879-96f6c368a9db', 'Snowflake & BigQuery', 4);

-- =============================================================================
-- COURSE 1: Full Stack Development
-- =============================================================================
INSERT INTO programs (
  id, slug, title, subtitle, category, duration_weeks, batch_mode, schedule, location,
  base_price, discounted_price, is_popular, is_published, cohort_start,
  syllabus_url, demo_video_url, demo_video_duration_mins, demo_video_description,
  card_image_url, meta_title, meta_description
) VALUES (
  '10000000-0000-0000-0000-000000000001',
  'full-stack-development',
  'Full Stack Development',
  'Mastery of Modern Web Architecture',
  'Engineering',
  16,
  'offline',
  'Mon-Fri (In-person Cohort Labs)',
  'Koramangala, Bengaluru',
  49999,
  34999,
  TRUE,
  TRUE,
  NOW() + INTERVAL '14 days',
  '#',
  'https://www.youtube.com/embed/dQw4w9WgXcQ',
  5,
  'Watch the 5-minute induction preview of our full-stack engineering guild.',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
  'Full Stack Development Cohort | InternAcademy Bengaluru',
  'Become a job-ready full-stack software engineer. Master React, Node.js, Next.js, and PostgreSQL with guaranteed internship placement.'
);

-- Section Config for Course 1
INSERT INTO program_section_config (program_id, section, is_enabled, sort_order) VALUES
  ('10000000-0000-0000-0000-000000000001', 'overview', TRUE, 1),
  ('10000000-0000-0000-0000-000000000001', 'program_summary', TRUE, 2),
  ('10000000-0000-0000-0000-000000000001', 'demo_video', TRUE, 3),
  ('10000000-0000-0000-0000-000000000001', 'curriculum', TRUE, 4),
  ('10000000-0000-0000-0000-000000000001', 'technologies', TRUE, 5),
  ('10000000-0000-0000-0000-000000000001', 'projects', TRUE, 6),
  ('10000000-0000-0000-0000-000000000001', 'internship_details', TRUE, 7),
  ('10000000-0000-0000-0000-000000000001', 'faculty', TRUE, 8),
  ('10000000-0000-0000-0000-000000000001', 'career_opportunities', TRUE, 9),
  ('10000000-0000-0000-0000-000000000001', 'testimonials', TRUE, 10),
  ('10000000-0000-0000-0000-000000000001', 'certification', TRUE, 11),
  ('10000000-0000-0000-0000-000000000001', 'faqs', TRUE, 12);

-- Overview for Course 1
INSERT INTO program_overview (program_id, intro_text) VALUES (
  '10000000-0000-0000-0000-000000000001',
  '{"bold_intro":"Become an industry-ready Full Stack Engineer equipped to design, build, and deploy production software.","paragraphs":["Our 16-week intensive cohort takes you from core web protocols to advanced full-stack application development using React, Next.js 16, Node.js, and PostgreSQL.","You will work directly in our Koramangala design studio on real client briefs alongside senior engineering mentors."],"master_points":["Build high-throughput REST & GraphQL APIs with Express and Node.js","Master Next.js App Router, SSR, Server Components, and Tailwind CSS","Design robust PostgreSQL databases with Prisma ORM and raw SQL query tuning","Deploy containerized apps using Docker, CI/CD pipelines, and Vercel/AWS"]}'
);

-- Summary Cards for Course 1
INSERT INTO program_summary_cards (program_id, label, value, icon, sort_order) VALUES
  ('10000000-0000-0000-0000-000000000001', 'DURATION', '16 Weeks (4 Months)', 'clock', 1),
  ('10000000-0000-0000-0000-000000000001', 'ELIGIBILITY', 'Final Year / Grads / Devs', 'users', 2),
  ('10000000-0000-0000-0000-000000000001', 'MODE', 'Offline in Bengaluru', 'map-pin', 3),
  ('10000000-0000-0000-0000-000000000001', 'CERTIFICATION', 'QR Verifiable Credential', 'award', 4),
  ('10000000-0000-0000-0000-000000000001', 'INTERNSHIP', 'Guaranteed 8-wk Guild Placement', 'briefcase', 5),
  ('10000000-0000-0000-0000-000000000001', 'PLACEMENT', '100% Interview Support', 'trending-up', 6),
  ('10000000-0000-0000-0000-000000000001', 'BATCH SIZE', '25 Students Per Cohort', 'users', 7),
  ('10000000-0000-0000-0000-000000000001', 'START DATE', 'Upcoming Monday', 'calendar', 8);

-- Curriculum Modules for Course 1
INSERT INTO curriculum_modules (id, program_id, phase_label, title, objective, sort_order) VALUES
  ('11000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'PHASE 1', 'Frontend Engineering & React', 'Objective: Master modern JavaScript, TypeScript, and component architecture.', 1),
  ('11000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'PHASE 2', 'Backend Services & Database Design', 'Objective: Build scalable Node.js APIs and relational database schemas.', 2),
  ('11000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', 'PHASE 3', 'Full Stack Architecture & Next.js', 'Objective: Integrate frontend and backend into unified serverless/SSR apps.', 3),
  ('11000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000001', 'PHASE 4', 'DevOps, Testing & Guild Internship', 'Objective: Ship real client features with production CI/CD workflows.', 4);

INSERT INTO curriculum_topics (module_id, topic, sort_order) VALUES
  ('11000000-0000-0000-0000-000000000001', 'TypeScript Fundamentals & Type Safety', 1),
  ('11000000-0000-0000-0000-000000000001', 'React 19 Components, State Management & Custom Hooks', 2),
  ('11000000-0000-0000-0000-000000000001', 'Tailwind CSS, Dynamic Layouts & Responsive UI', 3),
  ('11000000-0000-0000-0000-000000000002', 'Node.js, Express & REST API Architecture', 1),
  ('11000000-0000-0000-0000-000000000002', 'PostgreSQL Data Modeling, Indexing & Prisma ORM', 2),
  ('11000000-0000-0000-0000-000000000002', 'JWT Authentication, OAuth & Middleware Protection', 3),
  ('11000000-0000-0000-0000-000000000003', 'Next.js App Router, Server Actions & Server Components', 1),
  ('11000000-0000-0000-0000-000000000003', 'State Synchronization, WebSockets & Real-time Feeds', 2),
  ('11000000-0000-0000-0000-000000000004', 'Docker Containerization & Environment Isolation', 1),
  ('11000000-0000-0000-0000-000000000004', 'GitHub Actions CI/CD & AWS/Vercel Cloud Deployment', 2);

-- Technologies for Course 1
INSERT INTO program_technologies (program_id, label, icon_url, sort_order) VALUES
  ('10000000-0000-0000-0000-000000000001', 'React', '', 1),
  ('10000000-0000-0000-0000-000000000001', 'Next.js 16', '', 2),
  ('10000000-0000-0000-0000-000000000001', 'TypeScript', '', 3),
  ('10000000-0000-0000-0000-000000000001', 'Node.js', '', 4),
  ('10000000-0000-0000-0000-000000000001', 'PostgreSQL', '', 5),
  ('10000000-0000-0000-0000-000000000001', 'Prisma', '', 6),
  ('10000000-0000-0000-0000-000000000001', 'Docker', '', 7),
  ('10000000-0000-0000-0000-000000000001', 'Tailwind CSS', '', 8);

-- Projects for Course 1
INSERT INTO program_projects (id, program_id, title, description, level, image_url, sort_order) VALUES
  ('12000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Enterprise SaaS Workspace', 'Full-stack collaborative project management platform with real-time updates and OAuth role permissions.', 'advanced', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80', 1),
  ('12000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'E-Commerce Engine & Checkout', 'Scalable online store featuring inventory locking, PostgreSQL transaction safety, and payment webhooks.', 'intermediate', 'https://images.unsplash.com/photo-1556742049-0a67daf64f42?auto=format&fit=crop&w=800&q=80', 2);

INSERT INTO program_project_tags (project_id, tag, sort_order) VALUES
  ('12000000-0000-0000-0000-000000000001', 'Next.js 16', 1),
  ('12000000-0000-0000-0000-000000000001', 'PostgreSQL', 2),
  ('12000000-0000-0000-0000-000000000001', 'WebSockets', 3),
  ('12000000-0000-0000-0000-000000000002', 'Node.js', 1),
  ('12000000-0000-0000-0000-000000000002', 'Prisma ORM', 2),
  ('12000000-0000-0000-0000-000000000002', 'Razorpay Webhooks', 3);

-- Faculty Mapping for Course 1
INSERT INTO program_faculty (program_id, faculty_id, sort_order) VALUES
  ('10000000-0000-0000-0000-000000000001', '7fafdbad-d1a2-4952-9619-2b8823b453e3', 1);

-- Testimonials for Course 1
INSERT INTO testimonials (program_id, author_name, company, batch, content, rating, avatar_url, is_published) VALUES
  ('10000000-0000-0000-0000-000000000001', 'Nikhil Sharma', 'Software Engineer at Razorpay', 'Batch 4 · Jan 2026', 'The offline cohort experience at Koramangala was incredible. The hands-on project reviews prepared me directly for technical interviews.', 5, 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80', TRUE);

-- =============================================================================
-- COURSE 2: Generative AI
-- =============================================================================
INSERT INTO programs (
  id, slug, title, subtitle, category, duration_weeks, batch_mode, schedule, location,
  base_price, discounted_price, is_popular, is_published, cohort_start,
  syllabus_url, demo_video_url, demo_video_duration_mins, demo_video_description,
  card_image_url, meta_title, meta_description
) VALUES (
  '20000000-0000-0000-0000-000000000002',
  'generative-ai',
  'Generative AI',
  'LLM Applications & Agentic AI Systems',
  'AI',
  12,
  'offline',
  'Tue-Sat (AI Research Lab Sessions)',
  'Koramangala, Bengaluru',
  59999,
  42999,
  TRUE,
  TRUE,
  NOW() + INTERVAL '21 days',
  '#',
  'https://www.youtube.com/embed/dQw4w9WgXcQ',
  6,
  'Explore how our AI guild builds autonomous RAG agents and fine-tunes open-source models.',
  'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80',
  'Generative AI & Agentic Systems Cohort | InternAcademy Bengaluru',
  'Master Generative AI, LLMs, Retrieval-Augmented Generation (RAG), Fine-Tuning, and AI Agents with Python, LangChain, PyTorch, and Vector DBs.'
);

-- Section Config for Course 2
INSERT INTO program_section_config (program_id, section, is_enabled, sort_order) VALUES
  ('20000000-0000-0000-0000-000000000002', 'overview', TRUE, 1),
  ('20000000-0000-0000-0000-000000000002', 'program_summary', TRUE, 2),
  ('20000000-0000-0000-0000-000000000002', 'demo_video', TRUE, 3),
  ('20000000-0000-0000-0000-000000000002', 'curriculum', TRUE, 4),
  ('20000000-0000-0000-0000-000000000002', 'technologies', TRUE, 5),
  ('20000000-0000-0000-0000-000000000002', 'projects', TRUE, 6),
  ('20000000-0000-0000-0000-000000000002', 'internship_details', TRUE, 7),
  ('20000000-0000-0000-0000-000000000002', 'faculty', TRUE, 8),
  ('20000000-0000-0000-0000-000000000002', 'career_opportunities', TRUE, 9),
  ('20000000-0000-0000-0000-000000000002', 'testimonials', TRUE, 10),
  ('20000000-0000-0000-0000-000000000002', 'certification', TRUE, 11),
  ('20000000-0000-0000-0000-000000000002', 'faqs', TRUE, 12);

-- Overview for Course 2
INSERT INTO program_overview (program_id, intro_text) VALUES (
  '20000000-0000-0000-0000-000000000002',
  '{"bold_intro":"Build next-generation Artificial Intelligence applications using Foundation LLMs, Vector Databases, and Agentic Workflows.","paragraphs":["Generative AI is transforming modern software engineering. This 12-week intensive masterclass equips you to harness transformer architectures, build RAG pipelines, fine-tune open-source models (Llama 3, Mistral), and construct multi-agent systems.","Taught in-person at Bengaluru with access to dedicated GPU compute clusters for model training and deployment."],"master_points":["Master Prompt Engineering, Function Calling, and Structured Outputs","Build advanced RAG pipelines using LangChain, LlamaIndex, and Pinecone/Qdrant","Fine-tune open-source LLMs using LoRA/QLoRA on custom domain datasets","Develop autonomous multi-agent AI systems with Tool Calling and ReAct patterns"]}'
);

-- Summary Cards for Course 2
INSERT INTO program_summary_cards (program_id, label, value, icon, sort_order) VALUES
  ('20000000-0000-0000-0000-000000000002', 'DURATION', '12 Weeks (3 Months)', 'clock', 1),
  ('20000000-0000-0000-0000-000000000002', 'ELIGIBILITY', 'Developers & Data Enthusiasts', 'users', 2),
  ('20000000-0000-0000-0000-000000000002', 'MODE', 'Offline in Bengaluru', 'map-pin', 3),
  ('20000000-0000-0000-0000-000000000002', 'CERTIFICATION', 'Generative AI Specialist Cert', 'award', 4),
  ('20000000-0000-0000-0000-000000000002', 'INTERNSHIP', 'Guaranteed AI Guild Internship', 'briefcase', 5),
  ('20000000-0000-0000-0000-000000000002', 'PLACEMENT', 'AI Engineer Interview Track', 'trending-up', 6),
  ('20000000-0000-0000-0000-000000000002', 'COMPUTE', 'Dedicated GPU Cloud Access', 'sparkles', 7),
  ('20000000-0000-0000-0000-000000000002', 'START DATE', 'Upcoming Cohort', 'calendar', 8);

-- Curriculum Modules for Course 2
INSERT INTO curriculum_modules (id, program_id, phase_label, title, objective, sort_order) VALUES
  ('21000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002', 'PHASE 1', 'Prompt Engineering & Open Router API Integration', 'Objective: Master API-based model interaction, structured JSON parsing, and function calling.', 1),
  ('21000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', 'PHASE 2', 'Retrieval-Augmented Generation (RAG) & Vector DBs', 'Objective: Build context-aware question answering systems over enterprise knowledge bases.', 2),
  ('21000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000002', 'PHASE 3', 'Fine-Tuning Open Source LLMs & Embeddings', 'Objective: Adapt open-weights models to specific domains using PEFT and LoRA.', 3),
  ('21000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000002', 'PHASE 4', 'Autonomous Agentic Systems & Production LLMOps', 'Objective: Construct multi-agent orchestrations and monitor inference latency/token cost.', 4);

INSERT INTO curriculum_topics (module_id, topic, sort_order) VALUES
  ('21000000-0000-0000-0000-000000000001', 'Transformer Architectures, Tokenization & Context Windows', 1),
  ('21000000-0000-0000-0000-000000000001', 'Structured Output Generation & Function Calling Schemas', 2),
  ('21000000-0000-0000-0000-000000000002', 'Embedding Models & Chunking Strategies', 1),
  ('21000000-0000-0000-0000-000000000002', 'Vector Stores: Pinecone, Qdrant & pgvector', 2),
  ('21000000-0000-0000-0000-000000000002', 'Hybrid Search & Re-ranking (BM25 + Cross-Encoders)', 3),
  ('21000000-0000-0000-0000-000000000003', 'Dataset Preparation & Instruction Tuning', 1),
  ('21000000-0000-0000-0000-000000000003', 'LoRA, QLoRA & HuggingFace Transformers', 2),
  ('21000000-0000-0000-0000-000000000004', 'LangGraph & Multi-Agent ReAct Frameworks', 1),
  ('21000000-0000-0000-0000-000000000004', 'LLMOps: Telemetry, Token Cost Optimization & Guardrails', 2);

-- Technologies for Course 2
INSERT INTO program_technologies (program_id, label, icon_url, sort_order) VALUES
  ('20000000-0000-0000-0000-000000000002', 'Python', '', 1),
  ('20000000-0000-0000-0000-000000000002', 'PyTorch', '', 2),
  ('20000000-0000-0000-0000-000000000002', 'LangChain', '', 3),
  ('20000000-0000-0000-0000-000000000002', 'LlamaIndex', '', 4),
  ('20000000-0000-0000-0000-000000000002', 'Pinecone', '', 5),
  ('20000000-0000-0000-0000-000000000002', 'HuggingFace', '', 6),
  ('20000000-0000-0000-0000-000000000002', 'OpenAI / OpenRouter API', '', 7);

-- Projects for Course 2
INSERT INTO program_projects (id, program_id, title, description, level, image_url, sort_order) VALUES
  ('22000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002', 'Autonomous Research Agent', 'Multi-agent assistant that searches web sources, extracts PDF data, synthesizes reports, and cites sources.', 'advanced', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80', 1),
  ('22000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', 'Enterprise PDF Knowledge RAG', 'Production RAG engine with hybrid search, re-ranking, and real-time streaming answers.', 'intermediate', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80', 2);

INSERT INTO program_project_tags (project_id, tag, sort_order) VALUES
  ('22000000-0000-0000-0000-000000000001', 'LangGraph', 1),
  ('22000000-0000-0000-0000-000000000001', 'Python', 2),
  ('22000000-0000-0000-0000-000000000001', 'Tools & Function Calling', 3),
  ('22000000-0000-0000-0000-000000000002', 'Pinecone', 1),
  ('22000000-0000-0000-0000-000000000002', 'LlamaIndex', 2);

-- Faculty Mapping for Course 2
INSERT INTO program_faculty (program_id, faculty_id, sort_order) VALUES
  ('20000000-0000-0000-0000-000000000002', 'e8969208-80cd-4991-b879-96f6c368a9db', 1);

-- Testimonials for Course 2
INSERT INTO testimonials (program_id, author_name, company, batch, content, rating, avatar_url, is_published) VALUES
  ('20000000-0000-0000-0000-000000000002', 'Priya Kulkarni', 'AI Engineer at Postman', 'Batch 1 · Feb 2026', 'Building real RAG agents and fine-tuning models on dedicated GPUs gave me the confidence to transition into AI engineering.', 5, 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80', TRUE);

-- =============================================================================
-- COURSE 3: Data Engineering
-- =============================================================================
INSERT INTO programs (
  id, slug, title, subtitle, category, duration_weeks, batch_mode, schedule, location,
  base_price, discounted_price, is_popular, is_published, cohort_start,
  syllabus_url, demo_video_url, demo_video_duration_mins, demo_video_description,
  card_image_url, meta_title, meta_description
) VALUES (
  '30000000-0000-0000-0000-000000000003',
  'data-engineering',
  'Data Engineering',
  'High-Scale Pipelines & Cloud Analytics',
  'Data',
  14,
  'offline',
  'Mon-Fri (Data Lab Cohort)',
  'Koramangala, Bengaluru',
  54999,
  39999,
  FALSE,
  TRUE,
  NOW() + INTERVAL '28 days',
  '#',
  'https://www.youtube.com/embed/dQw4w9WgXcQ',
  4,
  'Learn how our data engineering cohort handles petabyte-scale data pipelines.',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
  'Data Engineering Masterclass | InternAcademy Bengaluru',
  'Master Big Data Pipelines, Apache Spark, Kafka, Snowflake, dbt, and Cloud Data Warehouses with hands-on offline training in Bengaluru.'
);

-- Section Config for Course 3
INSERT INTO program_section_config (program_id, section, is_enabled, sort_order) VALUES
  ('30000000-0000-0000-0000-000000000003', 'overview', TRUE, 1),
  ('30000000-0000-0000-0000-000000000003', 'program_summary', TRUE, 2),
  ('30000000-0000-0000-0000-000000000003', 'demo_video', TRUE, 3),
  ('30000000-0000-0000-0000-000000000003', 'curriculum', TRUE, 4),
  ('30000000-0000-0000-0000-000000000003', 'technologies', TRUE, 5),
  ('30000000-0000-0000-0000-000000000003', 'projects', TRUE, 6),
  ('30000000-0000-0000-0000-000000000003', 'internship_details', TRUE, 7),
  ('30000000-0000-0000-0000-000000000003', 'faculty', TRUE, 8),
  ('30000000-0000-0000-0000-000000000003', 'career_opportunities', TRUE, 9),
  ('30000000-0000-0000-0000-000000000003', 'testimonials', TRUE, 10),
  ('30000000-0000-0000-0000-000000000003', 'certification', TRUE, 11),
  ('30000000-0000-0000-0000-000000000003', 'faqs', TRUE, 12);

-- Overview for Course 3
INSERT INTO program_overview (program_id, intro_text) VALUES (
  '30000000-0000-0000-0000-000000000003',
  '{"bold_intro":"Architect robust ETL/ELT pipelines, real-time streaming engines, and cloud data warehouses.","paragraphs":["Modern business runs on clean, accessible data. This 14-week program trains you to engineer scalable pipelines using SQL, Python, Apache Spark, Kafka, Snowflake, and dbt.","Graduate with hands-on experience orchestrating workflows with Apache Airflow and managing data lakes on AWS/GCP."],"master_points":["Advanced SQL & Data Modeling (Star/Snowflake Schema & Medallion Architecture)","Distributed Data Processing with PySpark and Delta Lake","Real-Time Event Streaming with Apache Kafka and Flink","Data Warehousing & Transformations with Snowflake, BigQuery, and dbt"]}'
);

-- Summary Cards for Course 3
INSERT INTO program_summary_cards (program_id, label, value, icon, sort_order) VALUES
  ('30000000-0000-0000-0000-000000000003', 'DURATION', '14 Weeks (3.5 Months)', 'clock', 1),
  ('30000000-0000-0000-0000-000000000003', 'ELIGIBILITY', 'Data Analysts & Engineers', 'users', 2),
  ('30000000-0000-0000-0000-000000000003', 'MODE', 'Offline in Bengaluru', 'map-pin', 3),
  ('30000000-0000-0000-0000-000000000003', 'CERTIFICATION', 'Data Architect Credential', 'award', 4),
  ('30000000-0000-0000-0000-000000000003', 'INTERNSHIP', 'Guaranteed Guild Placement', 'briefcase', 5),
  ('30000000-0000-0000-0000-000000000003', 'PLACEMENT', 'Data Engineering Career Track', 'trending-up', 6),
  ('30000000-0000-0000-0000-000000000003', 'STACK', 'Spark, Kafka, Snowflake, dbt', 'sparkles', 7),
  ('30000000-0000-0000-0000-000000000003', 'START DATE', 'Upcoming Cohort', 'calendar', 8);

-- Curriculum Modules for Course 3
INSERT INTO curriculum_modules (id, program_id, phase_label, title, objective, sort_order) VALUES
  ('31000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000003', 'PHASE 1', 'Advanced SQL & Data Modeling', 'Objective: Master analytical SQL queries, dimensional modeling, and schema normalization.', 1),
  ('31000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000003', 'PHASE 2', 'Distributed Computing with Apache Spark', 'Objective: Process large-scale datasets using PySpark and Delta Lake tables.', 2),
  ('31000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000003', 'PHASE 3', 'Real-Time Streaming & Kafka', 'Objective: Ingest continuous event streams and process real-time telemetry data.', 3),
  ('31000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000003', 'PHASE 4', 'Cloud Warehousing, dbt & Airflow', 'Objective: Build production ELT pipelines with automated data quality testing.', 4);

INSERT INTO curriculum_topics (module_id, topic, sort_order) VALUES
  ('31000000-0000-0000-0000-000000000001', 'Complex Window Functions, CTEs & Query Plan Optimization', 1),
  ('31000000-0000-0000-0000-000000000001', 'Dimensional Modeling: Star & Snowflake Schemas', 2),
  ('31000000-0000-0000-0000-000000000002', 'PySpark RDDs, DataFrames & Spark SQL Performance Tuning', 1),
  ('31000000-0000-0000-0000-000000000002', 'Delta Lake ACID Transactions & Time-Travel Queries', 2),
  ('31000000-0000-0000-0000-000000000003', 'Apache Kafka Producers, Consumers & Topic Partitioning', 1),
  ('31000000-0000-0000-0000-000000000003', 'Structured Streaming with Spark & Kafka Integration', 2),
  ('31000000-0000-0000-0000-000000000004', 'Snowflake Architecture, Micro-partitions & Virtual Warehouses', 1),
  ('31000000-0000-0000-0000-000000000004', 'dbt Transformation Models, Testing & Documentation', 2),
  ('31000000-0000-0000-0000-000000000004', 'Apache Airflow DAG Construction & Workflow Scheduling', 3);

-- Technologies for Course 3
INSERT INTO program_technologies (program_id, label, icon_url, sort_order) VALUES
  ('30000000-0000-0000-0000-000000000003', 'Python', '', 1),
  ('30000000-0000-0000-0000-000000000003', 'SQL', '', 2),
  ('30000000-0000-0000-0000-000000000003', 'Apache Spark', '', 3),
  ('30000000-0000-0000-0000-000000000003', 'Apache Kafka', '', 4),
  ('30000000-0000-0000-0000-000000000003', 'Snowflake', '', 5),
  ('30000000-0000-0000-0000-000000000003', 'dbt', '', 6),
  ('30000000-0000-0000-0000-000000000003', 'Apache Airflow', '', 7);

-- Projects for Course 3
INSERT INTO program_projects (id, program_id, title, description, level, image_url, sort_order) VALUES
  ('32000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000003', 'Real-Time E-Commerce Streaming Pipeline', 'Ingest clickstream analytics via Kafka, process with Spark Streaming, and load into Snowflake.', 'advanced', 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=800&q=80', 1),
  ('32000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000003', 'Medallion Architecture Data Lakehouse', 'Build Bronze-Silver-Gold pipeline using PySpark, Delta Lake, and dbt with automated data quality checks.', 'intermediate', 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=800&q=80', 2);

INSERT INTO program_project_tags (project_id, tag, sort_order) VALUES
  ('32000000-0000-0000-0000-000000000001', 'Apache Kafka', 1),
  ('32000000-0000-0000-0000-000000000001', 'PySpark', 2),
  ('32000000-0000-0000-0000-000000000001', 'Snowflake', 3),
  ('32000000-0000-0000-0000-000000000002', 'Delta Lake', 1),
  ('32000000-0000-0000-0000-000000000002', 'dbt', 2);

-- Faculty Mapping for Course 3
INSERT INTO program_faculty (program_id, faculty_id, sort_order) VALUES
  ('30000000-0000-0000-0000-000000000003', 'e8969208-80cd-4991-b879-96f6c368a9db', 1),
  ('30000000-0000-0000-0000-000000000003', '7fafdbad-d1a2-4952-9619-2b8823b453e3', 2);

-- Testimonials for Course 3
INSERT INTO testimonials (program_id, author_name, company, batch, content, rating, avatar_url, is_published) VALUES
  ('30000000-0000-0000-0000-000000000003', 'Rohan Mehta', 'Data Engineer at PhonePe', 'Batch 2 · Feb 2026', 'Learning Spark, Kafka, and dbt with hands-on pipeline debugging transformed my understanding of big data architectures.', 5, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80', TRUE);

-- Map Global FAQs to all 3 courses
INSERT INTO program_faq_assignments (program_id, faq_id, sort_order)
SELECT p.id, f.id, 1
FROM programs p
CROSS JOIN global_faqs f
ON CONFLICT DO NOTHING;

COMMIT;
