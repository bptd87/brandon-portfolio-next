-- Ensure collaborators identity/serial sequence is aligned with existing max(id)
-- Prevents future inserts from colliding on already-used primary keys.
SELECT setval(
  pg_get_serial_sequence('public.collaborators', 'id'),
  COALESCE((SELECT MAX(id) FROM public.collaborators), 1),
  true
);
