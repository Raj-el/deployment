CREATE TABLE IF NOT EXISTS "Plans" (
  id                 BIGSERIAL PRIMARY KEY,
  account_id         TEXT,
  account_name       TEXT,
  plan_type          TEXT DEFAULT 'ai',
  title              TEXT,
  summary            TEXT,
  focus_areas        JSONB DEFAULT '[]'::jsonb,
  recommendations    JSONB DEFAULT '[]'::jsonb,
  assigned_to        TEXT,
  status             TEXT DEFAULT 'pending',
  progress           INTEGER DEFAULT 0,
  success            BOOLEAN,
  due_date           TIMESTAMPTZ,
  metric_outcome     TEXT DEFAULT 'pending',
  improvement_notes  TEXT,
  author_email       TEXT,
  author_user_id     INTEGER NOT NULL,
  last_edited_by     TEXT,
  last_edited_at     TIMESTAMPTZ,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT plans_account_fk
    FOREIGN KEY (account_id)
    REFERENCES "ClientCustomerData" (account_id)
    ON DELETE CASCADE,
  CONSTRAINT plans_author_fk
    FOREIGN KEY (author_user_id)
    REFERENCES "Users" (user_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT plans_account_required
    CHECK (plan_type = 'template' OR account_id IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS "Plans_account_id_idx"     ON "Plans" (account_id);
CREATE INDEX IF NOT EXISTS "Plans_author_email_idx"   ON "Plans" (author_email);
CREATE INDEX IF NOT EXISTS "Plans_author_user_id_idx" ON "Plans" (author_user_id);
CREATE INDEX IF NOT EXISTS "Plans_type_idx"           ON "Plans" (plan_type);

-- If the table already existed before this migration ran, ensure templates may omit account_id.
ALTER TABLE "Plans"
  ALTER COLUMN account_id DROP NOT NULL;

ALTER TABLE "Plans"
  DROP CONSTRAINT IF EXISTS plans_account_required;

ALTER TABLE "Plans"
  ADD CONSTRAINT plans_account_required
    CHECK (plan_type = 'template' OR account_id IS NOT NULL);
