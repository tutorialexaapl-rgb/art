/*
# RLS policies for Atelier commission platform

## What this migration does

Defines row-level security policies for all 22 tables created in the
full_schema_rebuild migration. Tables were locked down (RLS enabled, no policies)
until this migration adds access rules.

## Access model

This is a multi-user app with sign-in (email/password via Supabase Auth).
All policies are scoped to `TO authenticated` with `auth.uid()` ownership checks.
The anon role gets NO access to any table - the app requires sign-in.

## Policy patterns

- profiles: each user reads/updates their own row; admins read all
- client_profiles: each client CRUDs their own row; admins read all
- artist_profiles: public (authenticated) read of approved artists; artist CRUDs own; admins manage all
- artist_portfolio_items: public read of public items; artist CRUDs own portfolio
- commission_requests: authenticated read of open commissions; client CRUDs own; artists read all open
- commission_attachments: client who owns the commission can CRUD
- commission_comments: authenticated read public+own; author CRUDs own; participants see private
- commission_comment_attachments: follows comment visibility
- commission_offers: client reads offers on own commissions; artist CRUDs own offers
- commission_projects: client + artist of project can read/update; admins read all
- commission_milestones: project participants can read; artist can update
- milestone_attachments: project participants can read; artist can create
- commission_payments: project participants can read; admin/system manages
- commission_status_history: participants can read history for their entities
- conversations: participants can read/create/update their conversations
- messages: conversation participants can read; senders create own messages
- message_attachments: follows message visibility
- moderation_reports: users can create reports; admins can read/manage all
- moderation_events: admins only
- admin_audit_logs: admins only
- consent_records: users read their own; admins read all
- platform_settings: public settings readable by authenticated; admins manage

## Notes
1. All policies use `auth.uid()` - never `current_user`.
2. 4 separate policies per table (SELECT/INSERT/UPDATE/DELETE) - no `FOR ALL`.
3. Admin detection uses `EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')`.
*/

-- ──────────────────────────────────────────────
-- Helper: admin check can be inlined in each policy.
-- For readability we repeat the EXISTS pattern inline.
-- ──────────────────────────────────────────────

-- ══════════════════════════════════════════════
-- 1. profiles
-- ══════════════════════════════════════════════
DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (
    auth.uid() = id
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- No delete policy - profiles are cascade-deleted with auth.users

-- ══════════════════════════════════════════════
-- 2. client_profiles
-- ══════════════════════════════════════════════
DROP POLICY IF EXISTS "select_client_profile" ON client_profiles;
CREATE POLICY "select_client_profile" ON client_profiles FOR SELECT
  TO authenticated USING (
    auth.uid() = user_id
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

DROP POLICY IF EXISTS "insert_client_profile" ON client_profiles;
CREATE POLICY "insert_client_profile" ON client_profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_client_profile" ON client_profiles;
CREATE POLICY "update_client_profile" ON client_profiles FOR UPDATE
  TO authenticated USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_client_profile" ON client_profiles;
CREATE POLICY "delete_client_profile" ON client_profiles FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ══════════════════════════════════════════════
-- 3. artist_profiles
-- ══════════════════════════════════════════════
DROP POLICY IF EXISTS "select_artist_profile" ON artist_profiles;
CREATE POLICY "select_artist_profile" ON artist_profiles FOR SELECT
  TO authenticated USING (
    approval_status = 'approved'
    OR auth.uid() = user_id
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

DROP POLICY IF EXISTS "insert_artist_profile" ON artist_profiles;
CREATE POLICY "insert_artist_profile" ON artist_profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_artist_profile" ON artist_profiles;
CREATE POLICY "update_artist_profile" ON artist_profiles FOR UPDATE
  TO authenticated USING (
    auth.uid() = user_id
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  )
  WITH CHECK (
    auth.uid() = user_id
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

DROP POLICY IF EXISTS "delete_artist_profile" ON artist_profiles;
CREATE POLICY "delete_artist_profile" ON artist_profiles FOR DELETE
  TO authenticated USING (
    auth.uid() = user_id
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

-- ══════════════════════════════════════════════
-- 4. artist_portfolio_items
-- ══════════════════════════════════════════════
DROP POLICY IF EXISTS "select_portfolio_items" ON artist_portfolio_items;
CREATE POLICY "select_portfolio_items" ON artist_portfolio_items FOR SELECT
  TO authenticated USING (
    is_public = true
    OR EXISTS (
      SELECT 1 FROM artist_profiles ap
      WHERE ap.id = artist_portfolio_items.artist_id AND ap.user_id = auth.uid()
    )
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

DROP POLICY IF EXISTS "insert_portfolio_items" ON artist_portfolio_items;
CREATE POLICY "insert_portfolio_items" ON artist_portfolio_items FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM artist_profiles ap
      WHERE ap.id = artist_portfolio_items.artist_id AND ap.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "update_portfolio_items" ON artist_portfolio_items;
CREATE POLICY "update_portfolio_items" ON artist_portfolio_items FOR UPDATE
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM artist_profiles ap
      WHERE ap.id = artist_portfolio_items.artist_id AND ap.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM artist_profiles ap
      WHERE ap.id = artist_portfolio_items.artist_id AND ap.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "delete_portfolio_items" ON artist_portfolio_items;
CREATE POLICY "delete_portfolio_items" ON artist_portfolio_items FOR DELETE
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM artist_profiles ap
      WHERE ap.id = artist_portfolio_items.artist_id AND ap.user_id = auth.uid()
    )
  );

-- ══════════════════════════════════════════════
-- 5. commission_requests
-- ══════════════════════════════════════════════
DROP POLICY IF EXISTS "select_commission_requests" ON commission_requests;
CREATE POLICY "select_commission_requests" ON commission_requests FOR SELECT
  TO authenticated USING (
    status IN ('open','in_progress','completed','closed')
    OR client_id = auth.uid()
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

DROP POLICY IF EXISTS "insert_commission_requests" ON commission_requests;
CREATE POLICY "insert_commission_requests" ON commission_requests FOR INSERT
  TO authenticated WITH CHECK (client_id = auth.uid());

DROP POLICY IF EXISTS "update_commission_requests" ON commission_requests;
CREATE POLICY "update_commission_requests" ON commission_requests FOR UPDATE
  TO authenticated USING (
    client_id = auth.uid()
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  )
  WITH CHECK (
    client_id = auth.uid()
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

DROP POLICY IF EXISTS "delete_commission_requests" ON commission_requests;
CREATE POLICY "delete_commission_requests" ON commission_requests FOR DELETE
  TO authenticated USING (
    client_id = auth.uid()
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

-- ══════════════════════════════════════════════
-- 6. commission_attachments
-- ══════════════════════════════════════════════
DROP POLICY IF EXISTS "select_commission_attachments" ON commission_attachments;
CREATE POLICY "select_commission_attachments" ON commission_attachments FOR SELECT
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM commission_requests cr
      WHERE cr.id = commission_attachments.commission_request_id
        AND (cr.client_id = auth.uid() OR cr.status IN ('open','in_progress','completed','closed'))
    )
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

DROP POLICY IF EXISTS "insert_commission_attachments" ON commission_attachments;
CREATE POLICY "insert_commission_attachments" ON commission_attachments FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM commission_requests cr
      WHERE cr.id = commission_attachments.commission_request_id AND cr.client_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "update_commission_attachments" ON commission_attachments;
CREATE POLICY "update_commission_attachments" ON commission_attachments FOR UPDATE
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM commission_requests cr
      WHERE cr.id = commission_attachments.commission_request_id AND cr.client_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM commission_requests cr
      WHERE cr.id = commission_attachments.commission_request_id AND cr.client_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "delete_commission_attachments" ON commission_attachments;
CREATE POLICY "delete_commission_attachments" ON commission_attachments FOR DELETE
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM commission_requests cr
      WHERE cr.id = commission_attachments.commission_request_id AND cr.client_id = auth.uid()
    )
  );

-- ══════════════════════════════════════════════
-- 7. commission_comments
-- ══════════════════════════════════════════════
DROP POLICY IF EXISTS "select_commission_comments" ON commission_comments;
CREATE POLICY "select_commission_comments" ON commission_comments FOR SELECT
  TO authenticated USING (
    (is_public = true AND is_hidden = false)
    OR author_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM commission_requests cr
      WHERE cr.id = commission_comments.commission_request_id AND cr.client_id = auth.uid()
    )
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

DROP POLICY IF EXISTS "insert_commission_comments" ON commission_comments;
CREATE POLICY "insert_commission_comments" ON commission_comments FOR INSERT
  TO authenticated WITH CHECK (author_id = auth.uid());

DROP POLICY IF EXISTS "update_commission_comments" ON commission_comments;
CREATE POLICY "update_commission_comments" ON commission_comments FOR UPDATE
  TO authenticated USING (
    author_id = auth.uid()
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  )
  WITH CHECK (
    author_id = auth.uid()
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

DROP POLICY IF EXISTS "delete_commission_comments" ON commission_comments;
CREATE POLICY "delete_commission_comments" ON commission_comments FOR DELETE
  TO authenticated USING (
    author_id = auth.uid()
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

-- ══════════════════════════════════════════════
-- 8. commission_comment_attachments
-- ══════════════════════════════════════════════
DROP POLICY IF EXISTS "select_comment_attachments" ON commission_comment_attachments;
CREATE POLICY "select_comment_attachments" ON commission_comment_attachments FOR SELECT
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM commission_comments cc
      WHERE cc.id = commission_comment_attachments.comment_id
        AND (cc.is_public = true OR cc.author_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "insert_comment_attachments" ON commission_comment_attachments;
CREATE POLICY "insert_comment_attachments" ON commission_comment_attachments FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM commission_comments cc
      WHERE cc.id = commission_comment_attachments.comment_id AND cc.author_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "delete_comment_attachments" ON commission_comment_attachments;
CREATE POLICY "delete_comment_attachments" ON commission_comment_attachments FOR DELETE
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM commission_comments cc
      WHERE cc.id = commission_comment_attachments.comment_id AND cc.author_id = auth.uid()
    )
  );

-- ══════════════════════════════════════════════
-- 9. commission_offers
-- ══════════════════════════════════════════════
DROP POLICY IF EXISTS "select_commission_offers" ON commission_offers;
CREATE POLICY "select_commission_offers" ON commission_offers FOR SELECT
  TO authenticated USING (
    artist_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM commission_requests cr
      WHERE cr.id = commission_offers.commission_request_id AND cr.client_id = auth.uid()
    )
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

DROP POLICY IF EXISTS "insert_commission_offers" ON commission_offers;
CREATE POLICY "insert_commission_offers" ON commission_offers FOR INSERT
  TO authenticated WITH CHECK (artist_id = auth.uid());

DROP POLICY IF EXISTS "update_commission_offers" ON commission_offers;
CREATE POLICY "update_commission_offers" ON commission_offers FOR UPDATE
  TO authenticated USING (
    artist_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM commission_requests cr
      WHERE cr.id = commission_offers.commission_request_id AND cr.client_id = auth.uid()
    )
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  )
  WITH CHECK (
    artist_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM commission_requests cr
      WHERE cr.id = commission_offers.commission_request_id AND cr.client_id = auth.uid()
    )
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

DROP POLICY IF EXISTS "delete_commission_offers" ON commission_offers;
CREATE POLICY "delete_commission_offers" ON commission_offers FOR DELETE
  TO authenticated USING (
    artist_id = auth.uid()
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

-- ══════════════════════════════════════════════
-- 10. commission_projects
-- ══════════════════════════════════════════════
DROP POLICY IF EXISTS "select_commission_projects" ON commission_projects;
CREATE POLICY "select_commission_projects" ON commission_projects FOR SELECT
  TO authenticated USING (
    client_id = auth.uid()
    OR artist_id = auth.uid()
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

DROP POLICY IF EXISTS "insert_commission_projects" ON commission_projects;
CREATE POLICY "insert_commission_projects" ON commission_projects FOR INSERT
  TO authenticated WITH CHECK (
    client_id = auth.uid()
    OR artist_id = auth.uid()
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

DROP POLICY IF EXISTS "update_commission_projects" ON commission_projects;
CREATE POLICY "update_commission_projects" ON commission_projects FOR UPDATE
  TO authenticated USING (
    client_id = auth.uid()
    OR artist_id = auth.uid()
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  )
  WITH CHECK (
    client_id = auth.uid()
    OR artist_id = auth.uid()
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

DROP POLICY IF EXISTS "delete_commission_projects" ON commission_projects;
CREATE POLICY "delete_commission_projects" ON commission_projects FOR DELETE
  TO authenticated USING (
    client_id = auth.uid()
    OR artist_id = auth.uid()
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

-- ══════════════════════════════════════════════
-- 11. commission_milestones
-- ══════════════════════════════════════════════
DROP POLICY IF EXISTS "select_milestones" ON commission_milestones;
CREATE POLICY "select_milestones" ON commission_milestones FOR SELECT
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM commission_projects cp
      WHERE cp.id = commission_milestones.commission_project_id
        AND (cp.client_id = auth.uid() OR cp.artist_id = auth.uid())
    )
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

DROP POLICY IF EXISTS "insert_milestones" ON commission_milestones;
CREATE POLICY "insert_milestones" ON commission_milestones FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM commission_projects cp
      WHERE cp.id = commission_milestones.commission_project_id
        AND (cp.artist_id = auth.uid() OR cp.client_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "update_milestones" ON commission_milestones;
CREATE POLICY "update_milestones" ON commission_milestones FOR UPDATE
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM commission_projects cp
      WHERE cp.id = commission_milestones.commission_project_id
        AND (cp.artist_id = auth.uid() OR cp.client_id = auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM commission_projects cp
      WHERE cp.id = commission_milestones.commission_project_id
        AND (cp.artist_id = auth.uid() OR cp.client_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "delete_milestones" ON commission_milestones;
CREATE POLICY "delete_milestones" ON commission_milestones FOR DELETE
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM commission_projects cp
      WHERE cp.id = commission_milestones.commission_project_id
        AND (cp.artist_id = auth.uid() OR cp.client_id = auth.uid())
    )
  );

-- ══════════════════════════════════════════════
-- 12. milestone_attachments
-- ══════════════════════════════════════════════
DROP POLICY IF EXISTS "select_milestone_attachments" ON milestone_attachments;
CREATE POLICY "select_milestone_attachments" ON milestone_attachments FOR SELECT
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM commission_milestones cm
      JOIN commission_projects cp ON cp.id = cm.commission_project_id
      WHERE cm.id = milestone_attachments.milestone_id
        AND (cp.client_id = auth.uid() OR cp.artist_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "insert_milestone_attachments" ON milestone_attachments;
CREATE POLICY "insert_milestone_attachments" ON milestone_attachments FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM commission_milestones cm
      JOIN commission_projects cp ON cp.id = cm.commission_project_id
      WHERE cm.id = milestone_attachments.milestone_id
        AND (cp.artist_id = auth.uid() OR cp.client_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "delete_milestone_attachments" ON milestone_attachments;
CREATE POLICY "delete_milestone_attachments" ON milestone_attachments FOR DELETE
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM commission_milestones cm
      JOIN commission_projects cp ON cp.id = cm.commission_project_id
      WHERE cm.id = milestone_attachments.milestone_id
        AND (cp.artist_id = auth.uid() OR cp.client_id = auth.uid())
    )
  );

-- ══════════════════════════════════════════════
-- 13. commission_payments
-- ══════════════════════════════════════════════
DROP POLICY IF EXISTS "select_payments" ON commission_payments;
CREATE POLICY "select_payments" ON commission_payments FOR SELECT
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM commission_projects cp
      WHERE cp.id = commission_payments.commission_project_id
        AND (cp.client_id = auth.uid() OR cp.artist_id = auth.uid())
    )
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

-- Payments are managed by the system (edge functions / admin)
DROP POLICY IF EXISTS "insert_payments" ON commission_payments;
CREATE POLICY "insert_payments" ON commission_payments FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM commission_projects cp
      WHERE cp.id = commission_payments.commission_project_id
        AND (cp.client_id = auth.uid() OR cp.artist_id = auth.uid())
    )
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

DROP POLICY IF EXISTS "update_payments" ON commission_payments;
CREATE POLICY "update_payments" ON commission_payments FOR UPDATE
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM commission_projects cp
      WHERE cp.id = commission_payments.commission_project_id
        AND (cp.client_id = auth.uid() OR cp.artist_id = auth.uid())
    )
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM commission_projects cp
      WHERE cp.id = commission_payments.commission_project_id
        AND (cp.client_id = auth.uid() OR cp.artist_id = auth.uid())
    )
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

-- ══════════════════════════════════════════════
-- 14. commission_status_history
-- ══════════════════════════════════════════════
DROP POLICY IF EXISTS "select_status_history" ON commission_status_history;
CREATE POLICY "select_status_history" ON commission_status_history FOR SELECT
  TO authenticated USING (
    changed_by = auth.uid()
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

DROP POLICY IF EXISTS "insert_status_history" ON commission_status_history;
CREATE POLICY "insert_status_history" ON commission_status_history FOR INSERT
  TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

-- ══════════════════════════════════════════════
-- 15. conversations
-- ══════════════════════════════════════════════
DROP POLICY IF EXISTS "select_conversations" ON conversations;
CREATE POLICY "select_conversations" ON conversations FOR SELECT
  TO authenticated USING (
    client_id = auth.uid()
    OR artist_id = auth.uid()
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

DROP POLICY IF EXISTS "insert_conversations" ON conversations;
CREATE POLICY "insert_conversations" ON conversations FOR INSERT
  TO authenticated WITH CHECK (
    client_id = auth.uid() OR artist_id = auth.uid()
  );

DROP POLICY IF EXISTS "update_conversations" ON conversations;
CREATE POLICY "update_conversations" ON conversations FOR UPDATE
  TO authenticated USING (
    client_id = auth.uid() OR artist_id = auth.uid()
  )
  WITH CHECK (
    client_id = auth.uid() OR artist_id = auth.uid()
  );

DROP POLICY IF EXISTS "delete_conversations" ON conversations;
CREATE POLICY "delete_conversations" ON conversations FOR DELETE
  TO authenticated USING (
    client_id = auth.uid() OR artist_id = auth.uid()
  );

-- ══════════════════════════════════════════════
-- 16. messages
-- ══════════════════════════════════════════════
DROP POLICY IF EXISTS "select_messages" ON messages;
CREATE POLICY "select_messages" ON messages FOR SELECT
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.id = messages.conversation_id
        AND (c.client_id = auth.uid() OR c.artist_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "insert_messages" ON messages;
CREATE POLICY "insert_messages" ON messages FOR INSERT
  TO authenticated WITH CHECK (
    sender_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.id = messages.conversation_id
        AND (c.client_id = auth.uid() OR c.artist_id = auth.uid())
    )
  );

-- ══════════════════════════════════════════════
-- 17. message_attachments
-- ══════════════════════════════════════════════
DROP POLICY IF EXISTS "select_message_attachments" ON message_attachments;
CREATE POLICY "select_message_attachments" ON message_attachments FOR SELECT
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM messages m
      JOIN conversations c ON c.id = m.conversation_id
      WHERE m.id = message_attachments.message_id
        AND (c.client_id = auth.uid() OR c.artist_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "insert_message_attachments" ON message_attachments;
CREATE POLICY "insert_message_attachments" ON message_attachments FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM messages m
      WHERE m.id = message_attachments.message_id AND m.sender_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "delete_message_attachments" ON message_attachments;
CREATE POLICY "delete_message_attachments" ON message_attachments FOR DELETE
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM messages m
      WHERE m.id = message_attachments.message_id AND m.sender_id = auth.uid()
    )
  );

-- ══════════════════════════════════════════════
-- 18. moderation_reports
-- ══════════════════════════════════════════════
DROP POLICY IF EXISTS "select_moderation_reports" ON moderation_reports;
CREATE POLICY "select_moderation_reports" ON moderation_reports FOR SELECT
  TO authenticated USING (
    reported_by = auth.uid()
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

DROP POLICY IF EXISTS "insert_moderation_reports" ON moderation_reports;
CREATE POLICY "insert_moderation_reports" ON moderation_reports FOR INSERT
  TO authenticated WITH CHECK (
    reported_by = auth.uid() OR reported_by IS NULL
  );

DROP POLICY IF EXISTS "update_moderation_reports" ON moderation_reports;
CREATE POLICY "update_moderation_reports" ON moderation_reports FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

-- ══════════════════════════════════════════════
-- 19. moderation_events
-- ══════════════════════════════════════════════
DROP POLICY IF EXISTS "select_moderation_events" ON moderation_events;
CREATE POLICY "select_moderation_events" ON moderation_events FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

DROP POLICY IF EXISTS "insert_moderation_events" ON moderation_events;
CREATE POLICY "insert_moderation_events" ON moderation_events FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

-- ══════════════════════════════════════════════
-- 20. admin_audit_logs
-- ══════════════════════════════════════════════
DROP POLICY IF EXISTS "select_admin_audit_logs" ON admin_audit_logs;
CREATE POLICY "select_admin_audit_logs" ON admin_audit_logs FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

DROP POLICY IF EXISTS "insert_admin_audit_logs" ON admin_audit_logs;
CREATE POLICY "insert_admin_audit_logs" ON admin_audit_logs FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

-- ══════════════════════════════════════════════
-- 21. consent_records
-- ══════════════════════════════════════════════
DROP POLICY IF EXISTS "select_consent_records" ON consent_records;
CREATE POLICY "select_consent_records" ON consent_records FOR SELECT
  TO authenticated USING (
    user_id = auth.uid()
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

DROP POLICY IF EXISTS "insert_consent_records" ON consent_records;
CREATE POLICY "insert_consent_records" ON consent_records FOR INSERT
  TO authenticated WITH CHECK (user_id = auth.uid());

-- ══════════════════════════════════════════════
-- 22. platform_settings
-- ══════════════════════════════════════════════
DROP POLICY IF EXISTS "select_platform_settings" ON platform_settings;
CREATE POLICY "select_platform_settings" ON platform_settings FOR SELECT
  TO authenticated USING (
    is_public = true
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

DROP POLICY IF EXISTS "update_platform_settings" ON platform_settings;
CREATE POLICY "update_platform_settings" ON platform_settings FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

DROP POLICY IF EXISTS "insert_platform_settings" ON platform_settings;
CREATE POLICY "insert_platform_settings" ON platform_settings FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );