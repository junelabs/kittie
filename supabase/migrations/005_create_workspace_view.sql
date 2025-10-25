-- =====================================================
-- Migration: Create Workspace View for Easier Queries
-- =====================================================

-- Create view for user workspaces (combines organizations + members)
CREATE OR REPLACE VIEW v_user_workspaces AS
SELECT
  m.user_id,
  o.id AS workspace_id,
  o.name AS workspace_name,
  o.slug AS workspace_slug,
  o.logo_url AS workspace_logo_url,
  m.role,
  o.created_at,
  o.updated_at
FROM organization_members m
JOIN organizations o ON o.id = m.org_id;

COMMENT ON VIEW v_user_workspaces IS 'User workspaces with membership details';

-- =====================================================
-- MIGRATION COMPLETE! ✓
-- =====================================================

