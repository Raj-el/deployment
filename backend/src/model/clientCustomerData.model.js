export default class ClientCustomerDataModel {
    constructor(fields = {}) {
        // Account Basic Info
        this.accountId = fields.account_id ?? null;
        this.clientId = fields.client_id ?? null;
        this.accountName = fields.account_name ?? null;
        this.accountType = fields.account_type ?? null;
        this.industry = fields.industry ?? null;
        this.region = fields.region ?? null;
        this.country = fields.country ?? null;
        this.assignedCsmId = fields.assigned_csm_id ?? null;
        this.accountOwnerId = fields.account_owner_id ?? null;
        this.accountCreatedDate = fields.account_created_date ?? null;
        this.accountStatus = fields.account_status ?? null;
        
        // Financial Metrics
        this.arr = fields.arr ?? null;
        this.mrr = fields.mrr ?? null;
        this.contractValue = fields.contract_value ?? null;
        this.contractStartDate = fields.contract_start_date ?? null;
        this.contractEndDate = fields.contract_end_date ?? null;
        this.renewalDate = fields.renewal_date ?? null;
        this.contractTermMonths = fields.contract_term_months ?? null;
        this.paymentTerms = fields.payment_terms ?? null;
        this.paymentMethod = fields.payment_method ?? null;
        this.paymentStatus = fields.payment_status ?? null;
        this.daysPastDue = fields.days_past_due ?? null;
        this.lifetimeValue = fields.lifetime_value ?? null;
        this.expansionRevenueYtd = fields.expansion_revenue_ytd ?? null;
        this.contractionRevenueYtd = fields.contraction_revenue_ytd ?? null;
        this.netRevenueRetention = fields.net_revenue_retention ?? null;
        this.grossRevenueRetention = fields.gross_revenue_retention ?? null;
        this.renewalProbability = fields.renewal_probability ?? null;
        this.churnRiskScore = fields.churn_risk_score ?? null;
        this.currency = fields.currency ?? null;
        
        // License & Usage Metrics
        this.licenseCount = fields.license_count ?? null;
        this.activeLicenseCount = fields.active_license_count ?? null;
        this.licenseUtilizationRate = fields.license_utilization_rate ?? null;
        this.totalUsers = fields.total_users ?? null;
        this.activeUsersDaily = fields.active_users_daily ?? null;
        this.activeUsersWeekly = fields.active_users_weekly ?? null;
        this.activeUsersMonthly = fields.active_users_monthly ?? null;
        this.dauMauRatio = fields.dau_mau_ratio ?? null;
        this.loginFrequencyAvg = fields.login_frequency_avg ?? null;
        this.sessionDurationAvgMinutes = fields.session_duration_avg_minutes ?? null;
        this.featureAdoptionScore = fields.feature_adoption_score ?? null;
        this.featuresUsedCount = fields.features_used_count ?? null;
        this.featuresAvailableCount = fields.features_available_count ?? null;
        this.integrationCount = fields.integration_count ?? null;
        this.apiCallsLast30d = fields.api_calls_last_30d ?? null;
        this.dataUploadVolumeGb = fields.data_upload_volume_gb ?? null;
        this.workflowCompletionRate = fields.workflow_completion_rate ?? null;
        this.platformVersion = fields.platform_version ?? null;
        this.lastLoginDate = fields.last_login_date ?? null;
        
        // Customer Satisfaction & Support
        this.npsScore = fields.nps_score ?? null;
        this.npsLastSurveyDate = fields.nps_last_survey_date ?? null;
        this.csatScore = fields.csat_score ?? null;
        this.customerEffortScore = fields.customer_effort_score ?? null;
        this.supportTicketCount30d = fields.support_ticket_count_30d ?? null;
        this.supportTicketCountTotal = fields.support_ticket_count_total ?? null;
        this.p1TicketCount = fields.p1_ticket_count ?? null;
        this.escalationCount = fields.escalation_count ?? null;
        this.openSupportTickets = fields.open_support_tickets ?? null;
        this.avgResolutionTimeHours = fields.avg_resolution_time_hours ?? null;
        this.slaComplianceRate = fields.sla_compliance_rate ?? null;
        this.firstResponseTimeAvgHours = fields.first_response_time_avg_hours ?? null;
        
        // Stakeholder & Advocacy
        this.championIdentified = fields.champion_identified ?? null;
        this.championName = fields.champion_name ?? null;
        this.championEmail = fields.champion_email ?? null;
        this.executiveSponsorIdentified = fields.executive_sponsor_identified ?? null;
        this.executiveSponsorName = fields.executive_sponsor_name ?? null;
        this.referenceWillingness = fields.reference_willingness ?? null;
        this.caseStudyParticipation = fields.case_study_participation ?? null;
        this.testimonialProvided = fields.testimonial_provided ?? null;
        
        // Engagement & Training
        this.trainingSessionsCompleted = fields.training_sessions_completed ?? null;
        this.trainingCompletionRate = fields.training_completion_rate ?? null;
        this.certificationCount = fields.certification_count ?? null;
        this.communityEngagementScore = fields.community_engagement_score ?? null;
        this.webinarAttendanceCount = fields.webinar_attendance_count ?? null;
        this.productFeedbackCount = fields.product_feedback_count ?? null;
        this.featureRequestCount = fields.feature_request_count ?? null;
        this.betaParticipation = fields.beta_participation ?? null;
        this.qbrCount = fields.qbr_count ?? null;
        this.qbrLastDate = fields.qbr_last_date ?? null;
        this.qbrNextDate = fields.qbr_next_date ?? null;
        this.executiveMeetingCount = fields.executive_meeting_count ?? null;
        this.lastTouchpointDate = fields.last_touchpoint_date ?? null;
        this.lastTouchpointType = fields.last_touchpoint_type ?? null;
        
        // Health Scores
        this.overallHealthScore = fields.overall_health_score ?? null;
        this.financialHealthScore = fields.financial_health_score ?? null;
        this.usageHealthScore = fields.usage_health_score ?? null;
        this.sentimentHealthScore = fields.sentiment_health_score ?? null;
        this.engagementHealthScore = fields.engagement_health_score ?? null;
        this.healthScoreTrend = fields.health_score_trend ?? null;
        this.healthScoreLastUpdated = fields.health_score_last_updated ?? null;
        
        // Risk & Expansion
        this.riskLevel = fields.risk_level ?? null;
        this.riskReasons = fields.risk_reasons ?? null;
        this.churnProbability = fields.churn_probability ?? null;
        this.expansionPotentialScore = fields.expansion_potential_score ?? null;
        this.idealCustomerProfileFit = fields.ideal_customer_profile_fit ?? null;
        this.expansionValueProjected = fields.expansion_value_projected ?? null;
        this.usageGrowthRate30d = fields.usage_growth_rate_30d ?? null;
        
        // Onboarding & Lifecycle
        this.onboardingStatus = fields.onboarding_status ?? null;
        this.onboardingCompletedDate = fields.onboarding_completed_date ?? null;
        this.timeToValueDays = fields.time_to_value_days ?? null;
        this.timeToFirstValueDays = fields.time_to_first_value_days ?? null;
        this.timeToFirstLoginDays = fields.time_to_first_login_days ?? null;
        this.adoptionPhase = fields.adoption_phase ?? null;
        this.customerMaturityLevel = fields.customer_maturity_level ?? null;
        this.lifecycleStage = fields.lifecycle_stage ?? null;
        
        // Communication
        this.communicationFrequency = fields.communication_frequency ?? null;
        this.preferredCommunicationChannel = fields.preferred_communication_channel ?? null;
        this.meetingCadence = fields.meeting_cadence ?? null;
        this.meetingAttendanceRate = fields.meeting_attendance_rate ?? null;
        this.emailResponseRate = fields.email_response_rate ?? null;
        this.avgResponseTimeHours = fields.avg_response_time_hours ?? null;
        this.lastEmailSentDate = fields.last_email_sent_date ?? null;
        this.lastMeetingDate = fields.last_meeting_date ?? null;
        this.nextMeetingDate = fields.next_meeting_date ?? null;
        
        // Contact Information
        this.primaryContactName = fields.primary_contact_name ?? null;
        this.primaryContactEmail = fields.primary_contact_email ?? null;
        this.primaryContactPhone = fields.primary_contact_phone ?? null;
        this.decisionMakerName = fields.decision_maker_name ?? null;
        
        // Company Information
        this.companySize = fields.company_size ?? null;
        this.employeeCount = fields.employee_count ?? null;
        this.website = fields.website ?? null;
        this.linkedinUrl = fields.linkedin_url ?? null;
        this.timezone = fields.timezone ?? null;
        this.budgetCycle = fields.budget_cycle ?? null;
        this.fiscalYearEnd = fields.fiscal_year_end ?? null;
        
        // Additional Context
        this.useCase = fields.use_case ?? null;
        this.goals = fields.goals ?? null;
        this.painPoints = fields.pain_points ?? null;
        this.successCriteria = fields.success_criteria ?? null;
        this.notes = fields.notes ?? null;
        this.tags = fields.tags ?? null;
        
        // Metadata
        this.createdAt = fields.created_at ?? null;
        this.updatedAt = fields.updated_at ?? null;
        this.createdBy = fields.created_by ?? null;
        this.lastModifiedBy = fields.last_modified_by ?? null;
    }

    static fromRow(row) {
        return row ? new ClientCustomerDataModel(row) : null;
    }

    toJSON() {
        return { ...this };
    }
}