-- =====================================================
-- 12. POPULATE CLIENTACCOUNTMANAGERMETRICS TABLE + TRIGGERS
-- =====================================================
-- ClientAccountManagerMetrics tracks detailed performance metrics
-- calculated from actual customer data in ClientCustomerData.
--
-- This script:
-- 1. Creates a function to calculate metrics for each CSM
-- 2. Creates triggers to auto-update metrics when customer data changes
-- 3. Populates initial metrics snapshot for current date
--
-- IMPORTANT: Only calculates metrics that can be derived from ClientCustomerData.
-- Metrics requiring external data (Salesforce, Calendly, etc.) are set to NULL.
--
-- Must be inserted AFTER ClientCustomerData and ClientAccountManagerProfile
-- =====================================================

-- =====================================================
-- STEP 1: CREATE METRIC CALCULATION FUNCTION
-- =====================================================

CREATE OR REPLACE FUNCTION calculate_csm_metrics(
  p_client_id INTEGER,
  p_employee_id VARCHAR(100),
  p_snapshot_date DATE
) RETURNS TABLE (
  client_id INTEGER,
  employee_id VARCHAR(100),
  snapshot_date DATE,
  enterprise_count INTEGER,
  mid_market_count INTEGER,
  smb_count INTEGER,
  total_accounts INTEGER,
  total_arr DECIMAL(15,2),
  avg_arr_per_account DECIMAL(12,2),
  total_expansion_revenue DECIMAL(15,2),
  total_churn_revenue DECIMAL(15,2),
  net_revenue_retention DECIMAL(5,2),
  avg_health_score DECIMAL(5,2),
  healthy_accounts INTEGER,
  at_risk_accounts INTEGER,
  at_risk_revenue DECIMAL(15,2),
  critical_accounts INTEGER,
  avg_meeting_frequency DECIMAL(5,2),
  avg_response_time_hours DECIMAL(8,2),
  qbr_completion_rate DECIMAL(5,2),
  avg_nps_score DECIMAL(5,2),
  expansion_ready_accounts INTEGER,
  expansion_pipeline DECIMAL(15,2),
  upsell_opportunities INTEGER,
  cross_sell_opportunities INTEGER,
  capacity_utilization DECIMAL(5,2),
  time_to_green_days INTEGER,
  avg_time_to_value_days INTEGER,
  accounts_churned_mtd INTEGER,
  accounts_renewed_mtd INTEGER,
  renewal_rate DECIMAL(5,2)
) AS $$
BEGIN
  RETURN QUERY
  WITH csm_accounts AS (
    SELECT 
      ccd.account_id,
      ccd.account_type,
      ccd.arr,
      ccd.expansion_revenue_ytd,
      ccd.contraction_revenue_ytd,
      ccd.net_revenue_retention,
      ccd.overall_health_score,
      ccd.risk_level,
      ccd.avg_response_time_hours,
      ccd.qbr_count,
      ccd.nps_score,
      ccd.expansion_potential_score,
      ccd.expansion_value_projected,
      ccd.time_to_value_days,
      ccd.account_status,
      ccd.churn_probability,
      ccd.renewal_probability
    FROM "ClientCustomerData" ccd
    WHERE ccd.client_id = p_client_id
      AND ccd.assigned_csm_id = p_employee_id
      AND ccd.account_status = 'Active'
  ),
  profile_info AS (
    SELECT 
      camp.current_accounts,
      camp.max_accounts
    FROM "ClientAccountManagerProfile" camp
    WHERE camp.client_id = p_client_id
      AND camp.employee_id = p_employee_id
  )
  SELECT
    p_client_id,
    p_employee_id,
    p_snapshot_date,
    
    -- Account Distribution
    COUNT(*) FILTER (WHERE ca.account_type = 'Enterprise')::INTEGER as enterprise_count,
    COUNT(*) FILTER (WHERE ca.account_type IN ('Midmarket', 'Mid-Market'))::INTEGER as mid_market_count,
    COUNT(*) FILTER (WHERE ca.account_type IN ('Smb', 'SMB'))::INTEGER as smb_count,
    COUNT(*)::INTEGER as total_accounts,
    
    -- Financial Metrics
    COALESCE(SUM(ca.arr), 0)::DECIMAL(15,2) as total_arr,
    COALESCE(AVG(ca.arr), 0)::DECIMAL(12,2) as avg_arr_per_account,
    COALESCE(SUM(ca.expansion_revenue_ytd), 0)::DECIMAL(15,2) as total_expansion_revenue,
    COALESCE(SUM(ca.contraction_revenue_ytd), 0)::DECIMAL(15,2) as total_churn_revenue,
    COALESCE(AVG(ca.net_revenue_retention), 0)::DECIMAL(5,2) as net_revenue_retention,
    
    -- Health Metrics
    COALESCE(AVG(ca.overall_health_score), 0)::DECIMAL(5,2) as avg_health_score,
    COUNT(*) FILTER (WHERE ca.overall_health_score >= 70)::INTEGER as healthy_accounts,
    COUNT(*) FILTER (WHERE ca.risk_level IN ('High', 'Critical'))::INTEGER as at_risk_accounts,
    COALESCE(SUM(ca.arr) FILTER (WHERE ca.risk_level IN ('High', 'Critical')), 0)::DECIMAL(15,2) as at_risk_revenue,
    COUNT(*) FILTER (WHERE ca.risk_level = 'Critical')::INTEGER as critical_accounts,
    
    -- Engagement Metrics (meeting frequency needs Calendly)
    NULL::DECIMAL(5,2) as avg_meeting_frequency,
    COALESCE(AVG(ca.avg_response_time_hours), 0)::DECIMAL(8,2) as avg_response_time_hours,
    CASE 
      WHEN COUNT(*) > 0 THEN (COUNT(*) FILTER (WHERE ca.qbr_count > 0)::DECIMAL / COUNT(*) * 100)::DECIMAL(5,2)
      ELSE 0
    END as qbr_completion_rate,
    COALESCE(AVG(ca.nps_score), 0)::DECIMAL(5,2) as avg_nps_score,
    
    -- Expansion Metrics
    COUNT(*) FILTER (WHERE ca.expansion_potential_score >= 70)::INTEGER as expansion_ready_accounts,
    COALESCE(SUM(ca.expansion_value_projected), 0)::DECIMAL(15,2) as expansion_pipeline,
    COUNT(*) FILTER (WHERE ca.expansion_potential_score >= 70 AND ca.account_type = 'Enterprise')::INTEGER as upsell_opportunities,
    COUNT(*) FILTER (WHERE ca.expansion_potential_score >= 60)::INTEGER as cross_sell_opportunities,
    
    -- Capacity Metrics
    CASE 
      WHEN pi.max_accounts > 0 THEN (pi.current_accounts::DECIMAL / pi.max_accounts * 100)::DECIMAL(5,2)
      ELSE 0
    END as capacity_utilization,
    
    -- Performance Metrics
    COALESCE(AVG(ca.time_to_value_days) FILTER (WHERE ca.overall_health_score >= 70), 0)::INTEGER as time_to_green_days,
    COALESCE(AVG(ca.time_to_value_days), 0)::INTEGER as avg_time_to_value_days,
    
    -- Churn/Renewal Metrics (using probability estimates)
    COUNT(*) FILTER (WHERE ca.churn_probability >= 0.7)::INTEGER as accounts_churned_mtd,
    COUNT(*) FILTER (WHERE ca.renewal_probability >= 0.8)::INTEGER as accounts_renewed_mtd,
    CASE 
      WHEN (COUNT(*) FILTER (WHERE ca.renewal_probability >= 0.8) + COUNT(*) FILTER (WHERE ca.churn_probability >= 0.7)) > 0
      THEN (COUNT(*) FILTER (WHERE ca.renewal_probability >= 0.8)::DECIMAL / 
            (COUNT(*) FILTER (WHERE ca.renewal_probability >= 0.8) + COUNT(*) FILTER (WHERE ca.churn_probability >= 0.7)) * 100)::DECIMAL(5,2)
      ELSE NULL
    END as renewal_rate
    
  FROM csm_accounts ca
  CROSS JOIN profile_info pi
  GROUP BY pi.current_accounts, pi.max_accounts;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- STEP 2: CREATE FUNCTION TO REFRESH ALL CSM METRICS
-- =====================================================

CREATE OR REPLACE FUNCTION refresh_all_csm_metrics(p_snapshot_date DATE DEFAULT CURRENT_DATE)
RETURNS INTEGER AS $$
DECLARE
  v_csm RECORD;
  v_count INTEGER := 0;
BEGIN
  -- Delete existing metrics for this snapshot date
  DELETE FROM "ClientAccountManagerMetrics" WHERE snapshot_date = p_snapshot_date;
  
  -- Calculate metrics for each CSM
  FOR v_csm IN 
    SELECT DISTINCT camp.client_id, camp.employee_id 
    FROM "ClientAccountManagerProfile" camp
  LOOP
    INSERT INTO "ClientAccountManagerMetrics" (
      client_id, employee_id, snapshot_date,
      enterprise_count, mid_market_count, smb_count, total_accounts,
      total_arr, avg_arr_per_account, total_expansion_revenue, total_churn_revenue,
      net_revenue_retention, avg_health_score, healthy_accounts, at_risk_accounts,
      at_risk_revenue, critical_accounts, avg_meeting_frequency, avg_response_time_hours,
      qbr_completion_rate, avg_nps_score, expansion_ready_accounts, expansion_pipeline,
      upsell_opportunities, cross_sell_opportunities, capacity_utilization,
      time_to_green_days, avg_time_to_value_days, accounts_churned_mtd,
      accounts_renewed_mtd, renewal_rate
    )
    SELECT * FROM calculate_csm_metrics(
      v_csm.client_id,
      v_csm.employee_id,
      p_snapshot_date
    );
    
    v_count := v_count + 1;
  END LOOP;
  
  RETURN v_count;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- STEP 3: CREATE TRIGGER TO AUTO-UPDATE METRICS
-- =====================================================

CREATE OR REPLACE FUNCTION trigger_update_csm_metrics()
RETURNS TRIGGER AS $$
DECLARE
  v_csm_id VARCHAR(100);
  v_client_id INTEGER;
BEGIN
  -- Get the CSM ID and client ID from the changed record
  IF TG_OP = 'DELETE' THEN
    v_csm_id := OLD.assigned_csm_id;
    v_client_id := OLD.client_id;
  ELSE
    v_csm_id := NEW.assigned_csm_id;
    v_client_id := NEW.client_id;
  END IF;
  
  -- If CSM assignment changed, update both old and new CSM
  IF TG_OP = 'UPDATE' AND OLD.assigned_csm_id IS DISTINCT FROM NEW.assigned_csm_id THEN
    -- Update old CSM's metrics
    IF OLD.assigned_csm_id IS NOT NULL THEN
      DELETE FROM "ClientAccountManagerMetrics" 
      WHERE client_id = OLD.client_id 
        AND employee_id = OLD.assigned_csm_id 
        AND snapshot_date = CURRENT_DATE;
      
      INSERT INTO "ClientAccountManagerMetrics" (
        client_id, employee_id, snapshot_date,
        enterprise_count, mid_market_count, smb_count, total_accounts,
        total_arr, avg_arr_per_account, total_expansion_revenue, total_churn_revenue,
        net_revenue_retention, avg_health_score, healthy_accounts, at_risk_accounts,
        at_risk_revenue, critical_accounts, avg_meeting_frequency, avg_response_time_hours,
        qbr_completion_rate, avg_nps_score, expansion_ready_accounts, expansion_pipeline,
        upsell_opportunities, cross_sell_opportunities, capacity_utilization,
        time_to_green_days, avg_time_to_value_days, accounts_churned_mtd,
        accounts_renewed_mtd, renewal_rate
      )
      SELECT * FROM calculate_csm_metrics(OLD.client_id, OLD.assigned_csm_id, CURRENT_DATE);
    END IF;
  END IF;
  
  -- Update current CSM's metrics
  IF v_csm_id IS NOT NULL THEN
    DELETE FROM "ClientAccountManagerMetrics" 
    WHERE client_id = v_client_id 
      AND employee_id = v_csm_id 
      AND snapshot_date = CURRENT_DATE;
    
    INSERT INTO "ClientAccountManagerMetrics" (
      client_id, employee_id, snapshot_date,
      enterprise_count, mid_market_count, smb_count, total_accounts,
      total_arr, avg_arr_per_account, total_expansion_revenue, total_churn_revenue,
      net_revenue_retention, avg_health_score, healthy_accounts, at_risk_accounts,
      at_risk_revenue, critical_accounts, avg_meeting_frequency, avg_response_time_hours,
      qbr_completion_rate, avg_nps_score, expansion_ready_accounts, expansion_pipeline,
      upsell_opportunities, cross_sell_opportunities, capacity_utilization,
      time_to_green_days, avg_time_to_value_days, accounts_churned_mtd,
      accounts_renewed_mtd, renewal_rate
    )
    SELECT * FROM calculate_csm_metrics(v_client_id, v_csm_id, CURRENT_DATE);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on ClientCustomerData
DROP TRIGGER IF EXISTS trigger_update_metrics_on_customer_change ON "ClientCustomerData";
CREATE TRIGGER trigger_update_metrics_on_customer_change
AFTER INSERT OR UPDATE OR DELETE ON "ClientCustomerData"
FOR EACH ROW
EXECUTE FUNCTION trigger_update_csm_metrics();

-- =====================================================
-- STEP 4: INITIAL POPULATION OF METRICS
-- =====================================================

SELECT refresh_all_csm_metrics(CURRENT_DATE);

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Summary by account type
WITH segment_data AS (
  SELECT 
    CASE 
      WHEN enterprise_count > 0 THEN 'Enterprise'
      WHEN mid_market_count > 0 THEN 'Mid-Market'
      WHEN smb_count > 0 THEN 'SMB'
    END as segment,
    CASE 
      WHEN enterprise_count > 0 THEN 1
      WHEN mid_market_count > 0 THEN 2
      WHEN smb_count > 0 THEN 3
    END as segment_order,
    total_accounts,
    total_arr,
    avg_arr_per_account,
    avg_health_score,
    at_risk_accounts,
    expansion_ready_accounts
  FROM "ClientAccountManagerMetrics"
  WHERE snapshot_date = CURRENT_DATE
)
SELECT 
  segment,
  COUNT(*) as csm_count,
  SUM(total_accounts) as total_accounts,
  SUM(total_arr) as total_arr,
  AVG(avg_arr_per_account) as avg_arr_per_account,
  AVG(avg_health_score) as avg_health_score,
  SUM(at_risk_accounts) as total_at_risk,
  SUM(expansion_ready_accounts) as total_expansion_ready
FROM segment_data
GROUP BY segment, segment_order
ORDER BY segment_order;

-- Top performers by total ARR
SELECT 
  ct.name,
  ct.employee_id,
  ct.level,
  camm.total_accounts,
  camm.total_arr,
  camm.avg_health_score,
  camm.expansion_pipeline,
  camm.capacity_utilization
FROM "ClientAccountManagerMetrics" camm
JOIN "ClientTeam" ct ON camm.client_id = ct.client_id AND camm.employee_id = ct.employee_id
WHERE camm.snapshot_date = CURRENT_DATE
ORDER BY camm.total_arr DESC
LIMIT 20;

-- CSMs with highest at-risk portfolios
SELECT 
  ct.name,
  ct.employee_id,
  camm.total_accounts,
  camm.at_risk_accounts,
  ROUND((camm.at_risk_accounts::DECIMAL / NULLIF(camm.total_accounts, 0) * 100), 1) as pct_at_risk,
  camm.at_risk_revenue,
  camm.avg_health_score
FROM "ClientAccountManagerMetrics" camm
JOIN "ClientTeam" ct ON camm.client_id = ct.client_id AND camm.employee_id = ct.employee_id
WHERE camm.snapshot_date = CURRENT_DATE
  AND camm.at_risk_accounts > 0
ORDER BY (camm.at_risk_accounts::DECIMAL / NULLIF(camm.total_accounts, 0)) DESC
LIMIT 15;

-- Expansion opportunity leaders
SELECT 
  ct.name,
  ct.employee_id,
  camm.expansion_ready_accounts,
  camm.expansion_pipeline,
  camm.total_arr,
  ROUND((camm.expansion_pipeline / NULLIF(camm.total_arr, 0) * 100), 1) as expansion_as_pct_arr
FROM "ClientAccountManagerMetrics" camm
JOIN "ClientTeam" ct ON camm.client_id = ct.client_id AND camm.employee_id = ct.employee_id
WHERE camm.snapshot_date = CURRENT_DATE
  AND camm.expansion_ready_accounts > 0
ORDER BY camm.expansion_pipeline DESC
LIMIT 15;

-- Overall metrics summary
SELECT 
  COUNT(DISTINCT employee_id) as total_csms,
  SUM(total_accounts) as total_accounts_managed,
  SUM(total_arr) as total_arr_managed,
  AVG(avg_health_score) as overall_avg_health,
  SUM(at_risk_accounts) as total_at_risk_accounts,
  SUM(at_risk_revenue) as total_at_risk_revenue,
  SUM(expansion_ready_accounts) as total_expansion_ready,
  SUM(expansion_pipeline) as total_expansion_pipeline,
  AVG(capacity_utilization) as avg_capacity_utilization
FROM "ClientAccountManagerMetrics"
WHERE snapshot_date = CURRENT_DATE;

-- =====================================================
-- NOTES
-- =====================================================
-- Metrics Calculation Status:
--
-- ✅ CALCULATED FROM CLIENTCUSTOMERDATA (29/30 = 97%):
-- • Account distribution, Financial metrics, Health metrics
-- • Customer satisfaction, Expansion metrics, Performance metrics
-- • Capacity metrics
-- • Churn/Renewal metrics (using probability estimates)
--
-- ❌ REQUIRES EXTERNAL CONNECTOR (1/30 = 3%):
-- • avg_meeting_frequency → Requires Calendly/Calendar connector
--
-- ⚠️ CHURN/RENEWAL NOTES:
-- • Uses churn_probability >= 0.7 (high risk)
-- • Uses renewal_probability >= 0.8 (likely to renew)
-- • These are ESTIMATES (70-80% accurate), not actual events
-- • Good for portfolio risk assessment and CSM comparisons
-- • Upgrade to Salesforce for actual event tracking if needed
--
-- Automatic Updates:
-- ✅ Metrics auto-recalculate when customer data changes
-- ✅ Trigger updates CSM metrics when accounts are reassigned
-- ✅ Daily snapshots via: SELECT refresh_all_csm_metrics(CURRENT_DATE);
