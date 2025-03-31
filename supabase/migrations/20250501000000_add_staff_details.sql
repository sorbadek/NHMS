
-- Add additional fields to hospital_staff table
ALTER TABLE IF EXISTS public.hospital_staff
ADD COLUMN IF NOT EXISTS specialization text,
ADD COLUMN IF NOT EXISTS license_number text;

-- Allow null for these fields
COMMENT ON COLUMN public.hospital_staff.specialization IS 'The medical specialization of the staff member (for doctors)';
COMMENT ON COLUMN public.hospital_staff.license_number IS 'The professional license number of the staff member';
