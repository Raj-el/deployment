
-- Create customer accounts table
CREATE TABLE public.accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    company_size TEXT,
    industry TEXT,
    mrr DECIMAL(10,2),
    contract_value DECIMAL(10,2),
    start_date DATE,
    renewal_date DATE,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create health scores table
CREATE TABLE public.health_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID REFERENCES public.accounts(id) ON DELETE CASCADE,
    overall_score INTEGER NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
    financial_score INTEGER NOT NULL CHECK (financial_score >= 0 AND financial_score <= 100),
    usage_score INTEGER NOT NULL CHECK (usage_score >= 0 AND usage_score <= 100),
    sentiment_score INTEGER NOT NULL CHECK (sentiment_score >= 0 AND sentiment_score <= 100),
    engagement_score INTEGER NOT NULL CHECK (engagement_score >= 0 AND engagement_score <= 100),
    risk_level TEXT NOT NULL DEFAULT 'medium' CHECK (risk_level IN ('low', 'medium', 'high')),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create get-well plans table
CREATE TABLE public.get_well_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID REFERENCES public.accounts(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'completed', 'on-hold')),
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    assignee TEXT NOT NULL,
    start_date DATE,
    due_date DATE,
    target_health_score INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create plan tasks table
CREATE TABLE public.plan_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID REFERENCES public.get_well_plans(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    assignee TEXT,
    due_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create onboarding projects table
CREATE TABLE public.onboarding_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID REFERENCES public.accounts(id) ON DELETE CASCADE,
    project_name TEXT NOT NULL,
    phase TEXT NOT NULL DEFAULT 'kickoff' CHECK (phase IN ('kickoff', 'configuration', 'implementation', 'training', 'go-live', 'completed')),
    status TEXT NOT NULL DEFAULT 'on-track' CHECK (status IN ('on-track', 'at-risk', 'ahead', 'delayed')),
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    csm_assignee TEXT NOT NULL,
    start_date DATE,
    target_completion DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create onboarding milestones table
CREATE TABLE public.onboarding_milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.onboarding_projects(id) ON DELETE CASCADE,
    milestone_name TEXT NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    due_date DATE,
    completion_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'manager', 'csm', 'user')),
    department TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create analytics metrics table
CREATE TABLE public.analytics_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_type TEXT NOT NULL,
    metric_value DECIMAL(10,2) NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.get_well_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plan_tasks ENABLE ROW LEVEL Security;
ALTER TABLE public.onboarding_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_metrics ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (for demo purposes)
CREATE POLICY "Allow all access to accounts" ON public.accounts FOR ALL USING (true);
CREATE POLICY "Allow all access to health_scores" ON public.health_scores FOR ALL USING (true);
CREATE POLICY "Allow all access to get_well_plans" ON public.get_well_plans FOR ALL USING (true);
CREATE POLICY "Allow all access to plan_tasks" ON public.plan_tasks FOR ALL USING (true);
CREATE POLICY "Allow all access to onboarding_projects" ON public.onboarding_projects FOR ALL USING (true);
CREATE POLICY "Allow all access to onboarding_milestones" ON public.onboarding_milestones FOR ALL USING (true);
CREATE POLICY "Allow all access to profiles" ON public.profiles FOR ALL USING (true);
CREATE POLICY "Allow all access to analytics_metrics" ON public.analytics_metrics FOR ALL USING (true);

-- Insert demo data for accounts
INSERT INTO public.accounts (name, company_size, industry, mrr, contract_value, start_date, renewal_date, status) VALUES
('Acme Corporation', 'Enterprise', 'Technology', 24000.00, 288000.00, '2023-01-15', '2024-01-15', 'active'),
('TechStart Inc.', 'SMB', 'SaaS', 8500.00, 102000.00, '2023-06-01', '2024-06-01', 'active'),
('Global Systems', 'Enterprise', 'Manufacturing', 45000.00, 540000.00, '2022-09-15', '2024-09-15', 'active'),
('Innovation Labs', 'Mid-Market', 'Healthcare', 15000.00, 180000.00, '2023-03-01', '2024-03-01', 'active'),
('Enterprise Co', 'Enterprise', 'Finance', 32000.00, 384000.00, '2023-08-15', '2024-08-15', 'at-risk');

-- Insert health scores for the accounts
INSERT INTO public.health_scores (account_id, overall_score, financial_score, usage_score, sentiment_score, engagement_score, risk_level)
SELECT 
    a.id,
    CASE 
        WHEN a.name = 'Acme Corporation' THEN 86
        WHEN a.name = 'TechStart Inc.' THEN 51
        WHEN a.name = 'Global Systems' THEN 91
        WHEN a.name = 'Innovation Labs' THEN 60
        WHEN a.name = 'Enterprise Co' THEN 39
    END,
    CASE 
        WHEN a.name = 'Acme Corporation' THEN 85
        WHEN a.name = 'TechStart Inc.' THEN 45
        WHEN a.name = 'Global Systems' THEN 91
        WHEN a.name = 'Innovation Labs' THEN 72
        WHEN a.name = 'Enterprise Co' THEN 38
    END,
    CASE 
        WHEN a.name = 'Acme Corporation' THEN 92
        WHEN a.name = 'TechStart Inc.' THEN 67
        WHEN a.name = 'Global Systems' THEN 88
        WHEN a.name = 'Innovation Labs' THEN 45
        WHEN a.name = 'Enterprise Co' THEN 42
    END,
    CASE 
        WHEN a.name = 'Acme Corporation' THEN 78
        WHEN a.name = 'TechStart Inc.' THEN 52
        WHEN a.name = 'Global Systems' THEN 95
        WHEN a.name = 'Innovation Labs' THEN 68
        WHEN a.name = 'Enterprise Co' THEN 35
    END,
    CASE 
        WHEN a.name = 'Acme Corporation' THEN 88
        WHEN a.name = 'TechStart Inc.' THEN 41
        WHEN a.name = 'Global Systems' THEN 89
        WHEN a.name = 'Innovation Labs' THEN 55
        WHEN a.name = 'Enterprise Co' THEN 40
    END,
    CASE 
        WHEN a.name = 'Acme Corporation' THEN 'low'
        WHEN a.name = 'TechStart Inc.' THEN 'high'
        WHEN a.name = 'Global Systems' THEN 'low'
        WHEN a.name = 'Innovation Labs' THEN 'medium'
        WHEN a.name = 'Enterprise Co' THEN 'high'
    END
FROM public.accounts a;

-- Insert analytics metrics
INSERT INTO public.analytics_metrics (metric_type, metric_value, period_start, period_end) VALUES
('MRR', 124500.00, '2024-01-01', '2024-01-31'),
('NRR', 108.5, '2024-01-01', '2024-01-31'),
('Churn Rate', 3.2, '2024-01-01', '2024-01-31'),
('Customer Count', 247, '2024-01-01', '2024-01-31');

-- Create trigger to update updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON public.accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_get_well_plans_updated_at BEFORE UPDATE ON public.get_well_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_onboarding_projects_updated_at BEFORE UPDATE ON public.onboarding_projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
