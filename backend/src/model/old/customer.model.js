// models/CustomerModel.js
export default class CustomerModel {
  constructor(fields = {}) {
    this.accountId = fields.account_id ?? null;
    this.accountName = fields.account_name ?? null;
    this.accountType = fields.account_type ?? null;

    this.clientCompany = fields.client_company ?? null;

    this.industry = fields.industry ?? null;
    this.region = fields.region ?? null;
    this.assignedCsmId = fields.assigned_csm_id ?? null;
    this.assignedCsmName = fields.assigned_csm_name ?? null;
    this.accountCreatedDate = fields.account_created_date ?? null;
    this.accountStatus = fields.account_status ?? null;
    this.arr = fields.arr ?? null;
    this.mrr = fields.mrr ?? null;
    this.contractValue = fields.contract_value ?? null;
    this.contractStartDate = fields.contract_start_date ?? null;
    this.contractEndDate = fields.contract_end_date ?? null;
    this.contractTermLength = fields.contract_term_length ?? null;
    this.paymentTerms = fields.payment_terms ?? null;
    this.paymentMethod = fields.payment_method ?? null;
    this.paymentStatus = fields.payment_status ?? null;
    this.daysPastDue = fields.days_past_due ?? null;
    this.expansionRevenueYtd = fields.expansion_revenue_ytd ?? null;
    this.netRevenueRetention = fields.net_revenue_retention ?? null;
    this.grossRevenueRetention = fields.gross_revenue_retention ?? null;
    this.budgetCycle = fields.budget_cycle ?? null;
    this.renewalProbability = fields.renewal_probability ?? null;
    this.currency = fields.currency ?? "USD";
    this.licenseCount = fields.license_count ?? null;
    this.activeLicenseCount = fields.active_license_count ?? null;
    this.licenseUtilizationRate = fields.license_utilization_rate ?? null;
    this.totalUsers = fields.total_users ?? null;
    this.activeUsersDaily = fields.active_users_daily ?? null;
    this.activeUsersWeekly = fields.active_users_weekly ?? null;
    this.activeUsersMonthly = fields.active_users_monthly ?? null;
    this.loginFrequencyDaily = fields.login_frequency_daily ?? null;
    this.sessionDurationAvg = fields.session_duration_avg ?? null;
    this.featureAdoptionCount = fields.feature_adoption_count ?? null;
    this.integrationCount = fields.integration_count ?? null;
    this.apiCallVolume = fields.api_call_volume ?? null;
    this.dataUploadVolume = fields.data_upload_volume ?? null;
    this.workflowCompletionRate = fields.workflow_completion_rate ?? null;
    this.platformVersion = fields.platform_version ?? null;
    this.npsScore = fields.nps_score ?? null;
    this.csatScore = fields.csat_score ?? null;
    this.customerEffortScore = fields.customer_effort_score ?? null;
    this.supportTicketCount = fields.support_ticket_count ?? null;
    this.supportTicketSeverityAvg = fields.support_ticket_severity_avg ?? null;
    this.escalationCount = fields.escalation_count ?? null;
    this.championStatus = fields.champion_status ?? null;
    this.executiveSponsorStatus = fields.executive_sponsor_status ?? null;
    this.referenceWillingness = fields.reference_willingness ?? null;
    this.caseStudyParticipation = fields.case_study_participation ?? null;
    this.trainingSessionsCompleted = fields.training_sessions_completed ?? null;
    this.trainingCompletionRate = fields.training_completion_rate ?? null;
    this.certificationCount = fields.certification_count ?? null;
    this.communityPostsCount = fields.community_posts_count ?? null;
    this.communityParticipationLevel = fields.community_participation_level ?? null;
    this.webinarAttendanceCount = fields.webinar_attendance_count ?? null;
    this.productFeedbackCount = fields.product_feedback_count ?? null;
    this.featureRequestCount = fields.feature_request_count ?? null;
    this.betaProgramParticipation = fields.beta_program_participation ?? null;
    this.qbrAttendanceRate = fields.qbr_attendance_rate ?? null;
    this.executiveMeetingCount = fields.executive_meeting_count ?? null;
    this.overallHealthScore = fields.overall_health_score ?? null;
    this.financialHealthScore = fields.financial_health_score ?? null;
    this.usageHealthScore = fields.usage_health_score ?? null;
    this.sentimentHealthScore = fields.sentiment_health_score ?? null;
    this.engagementHealthScore = fields.engagement_health_score ?? null;
    this.healthScoreTrend = fields.health_score_trend ?? null;
    this.riskLevel = fields.risk_level ?? null;
    this.churnProbability = fields.churn_probability ?? null;
    this.expansionPotentialScore = fields.expansion_potential_score ?? null;
    this.csqlStatus = fields.csql_status ?? null;
    this.expansionValueProjected = fields.expansion_value_projected ?? null;
    this.usageGrowthRate = fields.usage_growth_rate ?? null;
    this.supportPlatformType = fields.support_platform_type ?? null;
    this.openSupportTickets = fields.open_support_tickets ?? null;
    this.averageResolutionTime = fields.average_resolution_time ?? null;
    this.slaComplianceRate = fields.sla_compliance_rate ?? null;
    this.firstResponseTimeAvg = fields.first_response_time_avg ?? null;
    this.primaryContactName = fields.primary_contact_name ?? null;
    this.preferredCommunicationMethod = fields.preferred_communication_method ?? null;
    this.timezone = fields.timezone ?? null;
    this.onboardingStatus = fields.onboarding_status ?? null;
    this.timeToValueDays = fields.time_to_value_days ?? null;
    this.timeToFirstLogin = fields.time_to_first_login ?? null;
    this.adoptionPhase = fields.adoption_phase ?? null;
    this.customerMaturityLevel = fields.customer_maturity_level ?? null;
    this.communicationFrequency = fields.communication_frequency ?? null;
    this.meetingAttendanceRate = fields.meeting_attendance_rate ?? null;
    this.responseTimeAvg = fields.response_time_avg ?? null;
    this.customerScenario = fields.customer_scenario ?? null;
    this.createdAt = fields.created_at ?? null;
    this.updatedAt = fields.updated_at ?? null;
  }

  static fromRow(row) {
    return row ? new CustomerModel(row) : null;
  }

  toJSON() {
    return { ...this };
  }
}
