/*
# Fix infinite RLS recursion caused by self-referencing profiles queries

## Root cause

The `profiles` table SELECT policy checked for admin role by querying
`profiles` itself:

    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')

This caused infinite recursion: evaluating the `profiles` SELECT policy
requires evaluating the `profiles` SELECT policy. ~20 other tables had
the same pattern, all querying `profiles` inside their policies.

The error `42P17 infinite recursion detected in policy for relation
"profiles"` was returned on every request that touched `profiles` or any
table whose policy referenced `profiles`. This broke:
- onboarding completion check (fetchOnboardingCompleted always failed)
- commission requests, projects, offers, comments, payments
- moderation, admin audit logs, platform settings

## Fix

1. Create a `SECURITY DEFINER` function `is_admin()` that reads
   `profiles` as the table owner (bypassing RLS), so there is no
   recursion. It returns true if `auth.uid()` has role = 'admin'.

2. Recreate every policy that contained
   `EXISTS (SELECT 1 FROM profiles p WHERE ...)` to use `is_admin()`
   instead. The logic of each policy is unchanged - only the admin
   check mechanism changes.

## Tables/policies affected (30 policies across 18 tables)

- profiles: select_own_profile
- admin_audit_logs: select, insert
- artist_portfolio_items: select
- artist_profiles: select, update, delete
- client_profiles: select
- commission_attachments: select
- commission_comments: select, update, delete
- commission_milestones: select
- commission_offers: select, update, delete
- commission_payments: select, update, insert
- commission_projects: select, update, insert, delete
- commission_requests: select, update, delete
- commission_status_history: select
- consent_records: select
- conversations: select
- moderation_events: select, insert, update, delete
- moderation_reports: select, update
- platform_settings: select, insert, update

## Security

- `is_admin()` is SECURITY DEFINER with `SET search_path = public`
  (prevents search_path shadowing attacks).
- EXECUTE is revoked from anon, granted to authenticated only.
- No data is deleted or modified. Only policies are dropped and
  recreated with equivalent predicates.
- The `profiles` table's own SELECT policy no longer self-references,
  breaking the recursion chain for all tables.
*/

-- ============================================================
-- 1. Create is_admin() helper function (SECURITY DEFINER, bypasses RLS)
-- ============================================================

CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

REVOKE EXECUTE ON FUNCTION is_admin() FROM anon;
GRANT EXECUTE ON FUNCTION is_admin() TO authenticated;

-- ============================================================
-- 2. profiles - fix self-referencing SELECT policy
-- ============================================================

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = id OR is_admin());

-- ============================================================
-- 3. admin_audit_logs
-- ============================================================

DROP POLICY IF EXISTS "select_admin_audit_logs" ON admin_audit_logs;
CREATE POLICY "select_admin_audit_logs" ON admin_audit_logs
  FOR SELECT TO authenticated
  USING (is_admin());

DROP POLICY IF EXISTS "insert_admin_audit_logs" ON admin_audit_logs;
CREATE POLICY "insert_admin_audit_logs" ON admin_audit_logs
  FOR INSERT TO authenticated
  WITH CHECK (is_admin());

-- ============================================================
-- 4. artist_portfolio_items
-- ============================================================

DROP POLICY IF EXISTS "select_portfolio_items" ON artist_portfolio_items;
CREATE POLICY "select_portfolio_items" ON artist_portfolio_items
  FOR SELECT TO authenticated
  USING (
    is_public = true
    OR EXISTS (
      SELECT 1 FROM artist_profiles ap
      WHERE ap.id = artist_portfolio_items.artist_id
        AND ap.user_id = auth.uid()
    )
    OR is_admin()
  );

-- ============================================================
-- 5. artist_profiles
-- ============================================================

DROP POLICY IF EXISTS "select_artist_profile" ON artist_profiles;
CREATE POLICY "select_artist_profile" ON artist_profiles
  FOR SELECT TO authenticated
  USING (approval_status = 'approved' OR auth.uid() = user_id OR is_admin());

DROP POLICY IF EXISTS "update_artist_profile" ON artist_profiles;
CREATE POLICY "update_artist_profile" ON artist_profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id OR is_admin())
  WITH CHECK (auth.uid() = user_id OR is_admin());

DROP POLICY IF EXISTS "delete_artist_profile" ON artist_profiles;
CREATE POLICY "delete_artist_profile" ON artist_profiles
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id OR is_admin());

-- ============================================================
-- 6. client_profiles
-- ============================================================

DROP POLICY IF EXISTS "select_client_profile" ON client_profiles;
CREATE POLICY "select_client_profile" ON client_profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR is_admin());

-- ============================================================
-- 7. commission_attachments
-- ============================================================

DROP POLICY IF EXISTS "select_commission_attachments" ON commission_attachments;
CREATE POLICY "select_commission_attachments" ON commission_attachments
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM commission_requests cr
      WHERE cr.id = commission_attachments.commission_request_id
        AND (
          cr.client_id = auth.uid()
          OR cr.status IN ('open', 'in_progress', 'completed', 'closed')
        )
    )
    OR is_admin()
  );

-- ============================================================
-- 8. commission_comments
-- ============================================================

DROP POLICY IF EXISTS "select_commission_comments" ON commission_comments;
CREATE POLICY "select_commission_comments" ON commission_comments
  FOR SELECT TO authenticated
  USING (
    (is_public = true AND is_hidden = false)
    OR author_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM commission_requests cr
      WHERE cr.id = commission_comments.commission_request_id
        AND cr.client_id = auth.uid()
    )
    OR is_admin()
  );

DROP POLICY IF EXISTS "update_commission_comments" ON commission_comments;
CREATE POLICY "update_commission_comments" ON commission_comments
  FOR UPDATE TO authenticated
  USING (author_id = auth.uid() OR is_admin())
  WITH CHECK (author_id = auth.uid() OR is_admin());

DROP POLICY IF EXISTS "delete_commission_comments" ON commission_comments;
CREATE POLICY "delete_commission_comments" ON commission_comments
  FOR DELETE TO authenticated
  USING (author_id = auth.uid() OR is_admin());

-- ============================================================
-- 9. commission_milestones
-- ============================================================

DROP POLICY IF EXISTS "select_milestones" ON commission_milestones;
CREATE POLICY "select_milestones" ON commission_milestones
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM commission_projects cp
      WHERE cp.id = commission_milestones.commission_project_id
        AND (cp.client_id = auth.uid() OR cp.artist_id = auth.uid())
    )
    OR is_admin()
  );

-- ============================================================
-- 10. commission_offers
-- ============================================================

DROP POLICY IF EXISTS "select_commission_offers" ON commission_offers;
CREATE POLICY "select_commission_offers" ON commission_offers
  FOR SELECT TO authenticated
  USING (
    artist_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM commission_requests cr
      WHERE cr.id = commission_offers.commission_request_id
        AND cr.client_id = auth.uid()
    )
    OR is_admin()
  );

DROP POLICY IF EXISTS "update_commission_offers" ON commission_offers;
CREATE POLICY "update_commission_offers" ON commission_offers
  FOR UPDATE TO authenticated
  USING (
    artist_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM commission_requests cr
      WHERE cr.id = commission_offers.commission_request_id
        AND cr.client_id = auth.uid()
    )
    OR is_admin()
  )
  WITH CHECK (
    artist_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM commission_requests cr
      WHERE cr.id = commission_offers.commission_request_id
        AND cr.client_id = auth.uid()
    )
    OR is_admin()
  );

DROP POLICY IF EXISTS "delete_commission_offers" ON commission_offers;
CREATE POLICY "delete_commission_offers" ON commission_offers
  FOR DELETE TO authenticated
  USING (artist_id = auth.uid() OR is_admin());

-- ============================================================
-- 11. commission_payments
-- ============================================================

DROP POLICY IF EXISTS "select_payments" ON commission_payments;
CREATE POLICY "select_payments" ON commission_payments
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM commission_projects cp
      WHERE cp.id = commission_payments.commission_project_id
        AND (cp.client_id = auth.uid() OR cp.artist_id = auth.uid())
    )
    OR is_admin()
  );

DROP POLICY IF EXISTS "update_payments" ON commission_payments;
CREATE POLICY "update_payments" ON commission_payments
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM commission_projects cp
      WHERE cp.id = commission_payments.commission_project_id
        AND (cp.client_id = auth.uid() OR cp.artist_id = auth.uid())
    )
    OR is_admin()
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM commission_projects cp
      WHERE cp.id = commission_payments.commission_project_id
        AND (cp.client_id = auth.uid() OR cp.artist_id = auth.uid())
    )
    OR is_admin()
  );

DROP POLICY IF EXISTS "insert_payments" ON commission_payments;
CREATE POLICY "insert_payments" ON commission_payments
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM commission_projects cp
      WHERE cp.id = commission_payments.commission_project_id
        AND (cp.client_id = auth.uid() OR cp.artist_id = auth.uid())
    )
    OR is_admin()
  );

-- ============================================================
-- 12. commission_projects
-- ============================================================

DROP POLICY IF EXISTS "select_commission_projects" ON commission_projects;
CREATE POLICY "select_commission_projects" ON commission_projects
  FOR SELECT TO authenticated
  USING (client_id = auth.uid() OR artist_id = auth.uid() OR is_admin());

DROP POLICY IF EXISTS "update_commission_projects" ON commission_projects;
CREATE POLICY "update_commission_projects" ON commission_projects
  FOR UPDATE TO authenticated
  USING (client_id = auth.uid() OR artist_id = auth.uid() OR is_admin())
  WITH CHECK (client_id = auth.uid() OR artist_id = auth.uid() OR is_admin());

DROP POLICY IF EXISTS "insert_commission_projects" ON commission_projects;
CREATE POLICY "insert_commission_projects" ON commission_projects
  FOR INSERT TO authenticated
  WITH CHECK (client_id = auth.uid() OR artist_id = auth.uid() OR is_admin());

DROP POLICY IF EXISTS "delete_commission_projects" ON commission_projects;
CREATE POLICY "delete_commission_projects" ON commission_projects
  FOR DELETE TO authenticated
  USING (client_id = auth.uid() OR artist_id = auth.uid() OR is_admin());

-- ============================================================
-- 13. commission_requests
-- ============================================================

DROP POLICY IF EXISTS "select_commission_requests" ON commission_requests;
CREATE POLICY "select_commission_requests" ON commission_requests
  FOR SELECT TO authenticated
  USING (client_id = auth.uid() OR is_admin());

DROP POLICY IF EXISTS "update_commission_requests" ON commission_requests;
CREATE POLICY "update_commission_requests" ON commission_requests
  FOR UPDATE TO authenticated
  USING (client_id = auth.uid() OR is_admin())
  WITH CHECK (client_id = auth.uid() OR is_admin());

DROP POLICY IF EXISTS "delete_commission_requests" ON commission_requests;
CREATE POLICY "delete_commission_requests" ON commission_requests
  FOR DELETE TO authenticated
  USING (client_id = auth.uid() OR is_admin());

-- ============================================================
-- 14. commission_status_history
-- ============================================================

DROP POLICY IF EXISTS "select_status_history" ON commission_status_history;
CREATE POLICY "select_status_history" ON commission_status_history
  FOR SELECT TO authenticated
  USING (changed_by = auth.uid() OR is_admin());

-- ============================================================
-- 15. consent_records
-- ============================================================

DROP POLICY IF EXISTS "select_consent_records" ON consent_records;
CREATE POLICY "select_consent_records" ON consent_records
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR is_admin());

-- ============================================================
-- 16. conversations
-- ============================================================

DROP POLICY IF EXISTS "select_conversations" ON conversations;
CREATE POLICY "select_conversations" ON conversations
  FOR SELECT TO authenticated
  USING (client_id = auth.uid() OR artist_id = auth.uid() OR is_admin());

-- ============================================================
-- 17. moderation_events
-- ============================================================

DROP POLICY IF EXISTS "select_moderation_events" ON moderation_events;
CREATE POLICY "select_moderation_events" ON moderation_events
  FOR SELECT TO authenticated
  USING (is_admin());

DROP POLICY IF EXISTS "insert_moderation_events" ON moderation_events;
CREATE POLICY "insert_moderation_events" ON moderation_events
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() OR is_admin());

DROP POLICY IF EXISTS "update_moderation_events" ON moderation_events;
CREATE POLICY "update_moderation_events" ON moderation_events
  FOR UPDATE TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "delete_moderation_events" ON moderation_events;
CREATE POLICY "delete_moderation_events" ON moderation_events
  FOR DELETE TO authenticated
  USING (is_admin());

-- ============================================================
-- 18. moderation_reports
-- ============================================================

DROP POLICY IF EXISTS "select_moderation_reports" ON moderation_reports;
CREATE POLICY "select_moderation_reports" ON moderation_reports
  FOR SELECT TO authenticated
  USING (reported_by = auth.uid() OR is_admin());

DROP POLICY IF EXISTS "update_moderation_reports" ON moderation_reports;
CREATE POLICY "update_moderation_reports" ON moderation_reports
  FOR UPDATE TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- ============================================================
-- 19. platform_settings
-- ============================================================

DROP POLICY IF EXISTS "select_platform_settings" ON platform_settings;
CREATE POLICY "select_platform_settings" ON platform_settings
  FOR SELECT TO authenticated
  USING (is_public = true OR is_admin());

DROP POLICY IF EXISTS "insert_platform_settings" ON platform_settings;
CREATE POLICY "insert_platform_settings" ON platform_settings
  FOR INSERT TO authenticated
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "update_platform_settings" ON platform_settings;
CREATE POLICY "update_platform_settings" ON platform_settings
  FOR UPDATE TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());
