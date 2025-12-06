-- =====================================================
-- 08. POPULATE EXPERTTAGS TABLE
-- =====================================================
-- ExpertTags store skills, specializations, and areas of expertise
-- for each expert. These tags enable expert discovery and matching.
-- Must be inserted AFTER Experts table is populated
-- =====================================================

INSERT INTO "ExpertTags" (expert_id, tag, tag_type, proficiency_level) VALUES
-- EXP-001: Rachel Thompson - Enterprise Implementation & Healthcare
('EXP-001', 'Enterprise Workflows', 'skill', 'expert'),
('EXP-001', 'Healthcare Compliance', 'skill', 'expert'),
('EXP-001', 'Implementation Best Practices', 'skill', 'expert'),
('EXP-001', 'Change Management', 'skill', 'expert'),
('EXP-001', 'Healthcare', 'industry', 'expert'),
('EXP-001', 'Life Sciences', 'industry', 'expert'),

-- EXP-002: Michael Chen - Financial Services & Compliance
('EXP-002', 'Financial Services', 'industry', 'expert'),
('EXP-002', 'Compliance Frameworks', 'skill', 'expert'),
('EXP-002', 'Risk Management', 'skill', 'expert'),
('EXP-002', 'Executive Stakeholder Management', 'skill', 'expert'),
('EXP-002', 'Banking', 'industry', 'expert'),
('EXP-002', 'Regulatory Compliance', 'skill', 'expert'),

-- EXP-003: Sarah Martinez - Training & Education
('EXP-003', 'Customer Training', 'skill', 'expert'),
('EXP-003', 'Certification Programs', 'skill', 'expert'),
('EXP-003', 'Adoption Strategies', 'skill', 'expert'),
('EXP-003', 'Learning Management Systems', 'skill', 'expert'),
('EXP-003', 'Mid-Market', 'segment', 'expert'),

-- EXP-004: David Kim - Manufacturing & IoT
('EXP-004', 'Manufacturing Operations', 'skill', 'expert'),
('EXP-004', 'Supply Chain Optimization', 'skill', 'expert'),
('EXP-004', 'IoT Integrations', 'skill', 'expert'),
('EXP-004', 'Operational Excellence', 'skill', 'expert'),
('EXP-004', 'Manufacturing', 'industry', 'expert'),

-- EXP-005: Jennifer Walsh - SMB & Automation
('EXP-005', 'SMB Success', 'skill', 'expert'),
('EXP-005', 'Automation Workflows', 'skill', 'expert'),
('EXP-005', 'Self-Service Optimization', 'skill', 'expert'),
('EXP-005', 'Digital Customer Experience', 'skill', 'expert'),
('EXP-005', 'SMB', 'segment', 'expert'),

-- EXP-006: Alex Rodriguez - AI & Machine Learning
('EXP-006', 'AI/ML Algorithms', 'skill', 'expert'),
('EXP-006', 'Predictive Analytics', 'skill', 'expert'),
('EXP-006', 'FUSE Health Model', 'skill', 'expert'),
('EXP-006', 'Product Strategy', 'skill', 'expert'),
('EXP-006', 'Machine Learning', 'skill', 'expert'),

-- EXP-007: Maria Gonzalez - API & Integrations
('EXP-007', 'API Architecture', 'skill', 'expert'),
('EXP-007', 'Third-Party Integrations', 'skill', 'expert'),
('EXP-007', 'Webhook Management', 'skill', 'expert'),
('EXP-007', 'Enterprise Connectors', 'skill', 'expert'),

-- EXP-008: Robert Johnson - Business Intelligence
('EXP-008', 'Business Intelligence', 'skill', 'expert'),
('EXP-008', 'Executive Dashboards', 'skill', 'expert'),
('EXP-008', 'Data Visualization', 'skill', 'expert'),
('EXP-008', 'Customer Analytics', 'skill', 'expert'),

-- EXP-009: Lisa Park - Mobile & UX
('EXP-009', 'Mobile UX', 'skill', 'expert'),
('EXP-009', 'User Experience Design', 'skill', 'expert'),
('EXP-009', 'Accessibility', 'skill', 'expert'),
('EXP-009', 'User Research', 'skill', 'expert'),

-- EXP-010: James Wilson - Security & Compliance
('EXP-010', 'Enterprise Security', 'skill', 'expert'),
('EXP-010', 'Data Privacy', 'skill', 'expert'),
('EXP-010', 'Compliance Frameworks', 'skill', 'expert'),
('EXP-010', 'Risk Assessment', 'skill', 'expert'),
('EXP-010', 'GDPR', 'skill', 'expert'),
('EXP-010', 'SOC 2', 'skill', 'expert'),
('EXP-010', 'HIPAA', 'skill', 'expert'),

-- EXP-011: Thomas Anderson - Enterprise Sales
('EXP-011', 'Enterprise Sales', 'skill', 'expert'),
('EXP-011', 'C-Level Selling', 'skill', 'expert'),
('EXP-011', 'Strategic Account Planning', 'skill', 'expert'),
('EXP-011', 'Complex Deal Management', 'skill', 'expert'),

-- EXP-012: Amanda Foster - Technology Sales
('EXP-012', 'Technology Sales', 'skill', 'expert'),
('EXP-012', 'Competitive Analysis', 'skill', 'expert'),
('EXP-012', 'ROI Justification', 'skill', 'expert'),
('EXP-012', 'Market Intelligence', 'skill', 'expert'),

-- EXP-013: Kevin Martinez - Manufacturing Sales
('EXP-013', 'Manufacturing Sales', 'skill', 'expert'),
('EXP-013', 'Industrial Operations', 'skill', 'expert'),
('EXP-013', 'Value-Based Selling', 'skill', 'expert'),
('EXP-013', 'Operational ROI', 'skill', 'expert'),
('EXP-013', 'Manufacturing', 'industry', 'expert'),

-- EXP-014: Rachel Brown - Mid-Market Sales
('EXP-014', 'Mid-Market Sales', 'skill', 'expert'),
('EXP-014', 'SaaS Metrics', 'skill', 'expert'),
('EXP-014', 'Customer Success ROI', 'skill', 'expert'),
('EXP-014', 'Sales Acceleration', 'skill', 'expert'),

-- EXP-015: Daniel Lee - SMB Sales
('EXP-015', 'SMB Sales', 'skill', 'specialist'),
('EXP-015', 'High-Velocity Sales', 'skill', 'specialist'),
('EXP-015', 'Sales Automation', 'skill', 'specialist'),
('EXP-015', 'Lead Qualification', 'skill', 'specialist'),

-- EXP-016: Brian Thompson - Solutions Architecture
('EXP-016', 'Enterprise Architecture', 'skill', 'expert'),
('EXP-016', 'Cloud Infrastructure', 'skill', 'expert'),
('EXP-016', 'API Integration', 'skill', 'expert'),
('EXP-016', 'Technical Implementation', 'skill', 'expert'),

-- EXP-017: Carol Davis - Healthcare IT
('EXP-017', 'Healthcare IT', 'skill', 'expert'),
('EXP-017', 'HIPAA Compliance', 'skill', 'expert'),
('EXP-017', 'Medical Data Security', 'skill', 'expert'),
('EXP-017', 'Healthcare Integrations', 'skill', 'expert'),
('EXP-017', 'Healthcare', 'industry', 'expert'),

-- EXP-018: Steven Garcia - Financial Technology
('EXP-018', 'Financial Technology', 'skill', 'expert'),
('EXP-018', 'Banking APIs', 'skill', 'expert'),
('EXP-018', 'Regulatory Technology', 'skill', 'expert'),
('EXP-018', 'Data Governance', 'skill', 'expert'),
('EXP-018', 'Financial Services', 'industry', 'expert'),

-- EXP-019: Michelle Rodriguez - CRM Integrations
('EXP-019', 'CRM Integrations', 'skill', 'expert'),
('EXP-019', 'Marketing Automation', 'skill', 'expert'),
('EXP-019', 'Data Migration', 'skill', 'expert'),
('EXP-019', 'ETL Processes', 'skill', 'expert'),

-- EXP-020: Christopher Lee - Self-Service Implementation
('EXP-020', 'Self-Service Implementation', 'skill', 'specialist'),
('EXP-020', 'SMB Technical Solutions', 'skill', 'specialist'),
('EXP-020', 'Automated Onboarding', 'skill', 'specialist'),
('EXP-020', 'Implementation Automation', 'skill', 'specialist'),

-- EXP-021: Jessica Wilson - Thought Leadership
('EXP-021', 'CS Industry Expertise', 'skill', 'expert'),
('EXP-021', 'Thought Leadership', 'skill', 'expert'),
('EXP-021', 'Competitive Intelligence', 'skill', 'expert'),
('EXP-021', 'Market Positioning', 'skill', 'expert'),

-- EXP-022: Mark Johnson - Content Marketing
('EXP-022', 'CS Content Creation', 'skill', 'expert'),
('EXP-022', 'Best Practices', 'skill', 'expert'),
('EXP-022', 'Educational Resources', 'skill', 'expert'),
('EXP-022', 'Methodology Frameworks', 'skill', 'expert'),

-- EXP-023: Laura Martinez - Enterprise Market Research
('EXP-023', 'Enterprise Market Research', 'skill', 'expert'),
('EXP-023', 'Industry Analysis', 'skill', 'expert'),
('EXP-023', 'Buying Pattern Intelligence', 'skill', 'expert'),
('EXP-023', 'Market Trends', 'skill', 'expert'),

-- EXP-024: Ryan Davis - Competitive Intelligence
('EXP-024', 'Competitive Analysis', 'skill', 'expert'),
('EXP-024', 'Feature Differentiation', 'skill', 'expert'),
('EXP-024', 'Pricing Intelligence', 'skill', 'expert'),
('EXP-024', 'Market Positioning', 'skill', 'expert'),

-- EXP-025: Emily Chen - Customer Advocacy
('EXP-025', 'Customer Stories', 'skill', 'specialist'),
('EXP-025', 'Case Study Development', 'skill', 'specialist'),
('EXP-025', 'Reference Programs', 'skill', 'specialist'),
('EXP-025', 'Customer Advocacy', 'skill', 'specialist'),

-- EXP-026: Andrew Miller - Platform Architecture
('EXP-026', 'Platform Architecture', 'skill', 'expert'),
('EXP-026', 'Distributed Systems', 'skill', 'expert'),
('EXP-026', 'Performance Optimization', 'skill', 'expert'),
('EXP-026', 'Scalability Engineering', 'skill', 'expert'),

-- EXP-027: Sarah Kim - Machine Learning
('EXP-027', 'Machine Learning', 'skill', 'expert'),
('EXP-027', 'Predictive Analytics', 'skill', 'expert'),
('EXP-027', 'Natural Language Processing', 'skill', 'expert'),
('EXP-027', 'AI Model Development', 'skill', 'expert'),

-- EXP-028: Michael Wang - Integration Platform
('EXP-028', 'API Architecture', 'skill', 'expert'),
('EXP-028', 'Integration Platforms', 'skill', 'expert'),
('EXP-028', 'Webhook Systems', 'skill', 'expert'),
('EXP-028', 'Real-Time Processing', 'skill', 'expert'),

-- EXP-029: Jennifer Taylor - DevOps & Cloud
('EXP-029', 'Cloud Infrastructure', 'skill', 'expert'),
('EXP-029', 'DevOps Automation', 'skill', 'expert'),
('EXP-029', 'Security Automation', 'skill', 'expert'),
('EXP-029', 'Infrastructure as Code', 'skill', 'expert'),

-- EXP-030: Robert Chen - Frontend Development
('EXP-030', 'Frontend Architecture', 'skill', 'expert'),
('EXP-030', 'User Interface Development', 'skill', 'expert'),
('EXP-030', 'Mobile Development', 'skill', 'expert'),
('EXP-030', 'Progressive Web Apps', 'skill', 'expert');

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Count tags by expert
SELECT 
  e.expert_id,
  e.name,
  COUNT(et.tag_id) as tag_count
FROM "Experts" e
LEFT JOIN "ExpertTags" et ON e.expert_id = et.expert_id
GROUP BY e.expert_id, e.name
ORDER BY tag_count DESC;

-- Tags by type
SELECT 
  tag_type,
  COUNT(*) as tag_count,
  COUNT(DISTINCT expert_id) as expert_count
FROM "ExpertTags"
GROUP BY tag_type
ORDER BY tag_count DESC;

-- Most common skills
SELECT 
  tag,
  tag_type,
  COUNT(*) as expert_count
FROM "ExpertTags"
WHERE tag_type = 'skill'
GROUP BY tag, tag_type
ORDER BY expert_count DESC
LIMIT 20;

-- Experts by industry specialization
SELECT 
  et.tag as industry,
  COUNT(DISTINCT et.expert_id) as expert_count,
  STRING_AGG(e.name, ', ') as experts
FROM "ExpertTags" et
JOIN "Experts" e ON et.expert_id = e.expert_id
WHERE et.tag_type = 'industry'
GROUP BY et.tag
ORDER BY expert_count DESC;

-- =====================================================
-- NOTES
-- =====================================================
-- Tag Types:
-- • 'skill' - Technical or functional expertise
-- • 'industry' - Industry vertical knowledge
-- • 'segment' - Customer segment specialization (Enterprise, Mid-Market, SMB)
--
-- Proficiency Levels:
-- • 'expert' - Deep expertise, can handle most complex scenarios
-- • 'specialist' - Good proficiency, can handle standard scenarios
-- • 'intermediate' - Growing expertise
-- • 'beginner' - Learning/developing expertise
--
-- These tags enable:
-- ✅ Expert search and discovery
-- ✅ Customer-to-expert matching
-- ✅ Skill gap analysis
-- ✅ Expert assignment optimization
-- ✅ Training and development planning
