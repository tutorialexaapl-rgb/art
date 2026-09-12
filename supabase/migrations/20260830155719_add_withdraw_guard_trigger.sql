-- Prevent artists from withdrawing offers that are already accepted.
-- Accepted offers represent a binding collaboration — only the client or admin
-- can change that status. Artists can still withdraw offers in submitted/viewed/
-- shortlisted/pending statuses.

CREATE OR REPLACE FUNCTION guard_offer_withdraw()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only restrict when the artist is the one updating (not admin/client).
  -- If OLD.status = 'accepted' and NEW.status = 'withdrawn', block it.
  -- This catches both direct artist updates and race conditions where
  -- the client accepted between the artist's page load and their click.
  IF OLD.status = 'accepted' AND NEW.status = 'withdrawn' THEN
    RAISE EXCEPTION 'Nie można wycofać zaakceptowanej oferty.'
      USING ERRCODE = 'check_violation';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_guard_offer_withdraw ON commission_offers;
CREATE TRIGGER trg_guard_offer_withdraw
  BEFORE UPDATE OF status ON commission_offers
  FOR EACH ROW
  EXECUTE FUNCTION guard_offer_withdraw();
