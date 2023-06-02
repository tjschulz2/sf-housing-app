import { createClient } from '@supabase/supabase-js'

export const supabase = createClient('https://jyqnozcjxgbnnauwzavw.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5cW5vemNqeGdibm5hdXd6YXZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODU2ODIyMTEsImV4cCI6MjAwMTI1ODIxMX0.qi8D0UI8NscopKYzWeYRj_-cbXQYiDqtbMSEcywMlq4')