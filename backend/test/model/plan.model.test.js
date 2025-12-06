import Plan from '../../src/model/plan.model.js';

describe('Plan Model', () => {
  // ---------- constructor ----------
  test('constructor sets provided fields correctly', () => {
    const now = new Date('2025-01-01T00:00:00Z');
    const fields = {
      id: 1,
      account_id: 101,
      account_name: 'Acme Corp',
      plan_type: 'custom',
      title: 'Growth Strategy',
      summary: 'Expand user base',
      focus_areas: ['Retention', 'Engagement'],
      recommendations: ['Improve UX', 'Add new onboarding'],
      assigned_to: 'CSM_123',
      status: 'active',
      progress: 75,
      success: true,
      due_date: '2025-06-30',
      metric_outcome: 'achieved',
      improvement_notes: 'Needs continuous monitoring',
      created_by: 'User123',
      last_edited_by: 'Admin',
      last_edited_at: now,
      created_at: now,
      updated_at: now,
    };

    const plan = new Plan(fields);

    expect(plan).toMatchObject({
      id: 1,
      accountId: 101,
      accountName: 'Acme Corp',
      planType: 'custom',
      title: 'Growth Strategy',
      summary: 'Expand user base',
      focusAreas: ['Retention', 'Engagement'],
      recommendations: ['Improve UX', 'Add new onboarding'],
      assignedTo: 'CSM_123',
      status: 'active',
      progress: 75,
      success: true,
      dueDate: '2025-06-30',
      metricOutcome: 'achieved',
      improvementNotes: 'Needs continuous monitoring',
      createdBy: 'User123',
      lastEditedBy: 'Admin',
      lastEditedAt: now,
      createdAt: now,
      updatedAt: now,
    });
  });

  test('constructor applies default values when fields are missing', () => {
    const plan = new Plan();

    expect(plan.id).toBeNull();
    expect(plan.accountId).toBeNull();
    expect(plan.planType).toBe('ai'); // default
    expect(plan.status).toBe('pending');
    expect(plan.progress).toBe(0);
    expect(plan.metricOutcome).toBe('pending');
    expect(plan.createdBy).toBe('AI');
    expect(plan.focusAreas).toEqual([]);
    expect(plan.recommendations).toEqual([]);
    expect(plan.createdAt).toBeInstanceOf(Date);
    expect(plan.updatedAt).toBeInstanceOf(Date);
  });

  // ---------- fromRow ----------
  test('fromRow creates a Plan instance from valid row', () => {
    const row = { id: 5, title: 'Retention Boost', status: 'completed' };
    const plan = Plan.fromRow(row);

    expect(plan).toBeInstanceOf(Plan);
    expect(plan.id).toBe(5);
    expect(plan.title).toBe('Retention Boost');
    expect(plan.status).toBe('completed');
  });

  test('fromRow still works when row is empty', () => {
    const plan = Plan.fromRow({});
    expect(plan).toBeInstanceOf(Plan);
    expect(plan.planType).toBe('ai');
  });

  // ---------- toJSON ----------
  test('toJSON returns a plain object copy of plan', () => {
    const fields = {
      id: 9,
      title: 'Retention Plan',
      account_id: 202,
      created_by: 'UserX',
      created_at: new Date('2025-01-02T00:00:00Z'),
    };
    const plan = new Plan(fields);
    const json = plan.toJSON();

    expect(json).toMatchObject({
      id: 9,
      accountId: 202,
      title: 'Retention Plan',
      createdBy: 'UserX',
    });
    expect(json).not.toBe(plan); // ensure plain copy
  });

  test('toJSON includes all key fields (defaults too)', () => {
    const plan = new Plan();
    const json = plan.toJSON();

    expect(json.planType).toBe('ai');
    expect(json.status).toBe('pending');
    expect(json.metricOutcome).toBe('pending');
    expect(json.createdBy).toBe('AI');
    expect(json.focusAreas).toEqual([]);
    expect(json.recommendations).toEqual([]);
  });
});
