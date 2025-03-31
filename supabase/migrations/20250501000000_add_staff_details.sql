
-- Add additional fields to hospital_staff table
ALTER TABLE IF EXISTS public.hospital_staff
ADD COLUMN IF NOT EXISTS specialization text,
ADD COLUMN IF NOT EXISTS license_number text,
ADD COLUMN IF NOT EXISTS education text,
ADD COLUMN IF NOT EXISTS years_of_experience integer,
ADD COLUMN IF NOT EXISTS shift_preference text,
ADD COLUMN IF NOT EXISTS registration_date date DEFAULT CURRENT_DATE,
ADD COLUMN IF NOT EXISTS certification text[];

-- Allow null for these fields
COMMENT ON COLUMN public.hospital_staff.specialization IS 'The medical specialization of the staff member (for doctors)';
COMMENT ON COLUMN public.hospital_staff.license_number IS 'The professional license number of the staff member';
COMMENT ON COLUMN public.hospital_staff.education IS 'Educational background of the staff member';
COMMENT ON COLUMN public.hospital_staff.years_of_experience IS 'Years of professional experience';
COMMENT ON COLUMN public.hospital_staff.shift_preference IS 'Preferred shift (morning, evening, night)';
COMMENT ON COLUMN public.hospital_staff.registration_date IS 'Date when the staff member was registered in the system';
COMMENT ON COLUMN public.hospital_staff.certification IS 'Array of certifications held by the staff member';

-- Create or update role_permissions enum if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'staff_role') THEN
        CREATE TYPE public.staff_role AS ENUM (
            'doctor',
            'nurse',
            'receptionist',
            'lab_technician',
            'pharmacist',
            'administrator',
            'radiologist',
            'physiotherapist',
            'nutritionist',
            'security',
            'maintenance',
            'it_support',
            'hospital_admin'
        );
        
        -- Add comment to the type
        COMMENT ON TYPE public.staff_role IS 'Available roles for hospital staff members';
    END IF;
END$$;

-- Add column for specific enum type if current role column is text
ALTER TABLE IF EXISTS public.hospital_staff
ADD COLUMN IF NOT EXISTS role_specific public.staff_role;

COMMENT ON COLUMN public.hospital_staff.role_specific IS 'Specific standardized role of the staff member';

