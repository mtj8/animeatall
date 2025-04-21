import { createClient } from '@supabase/supabase-js'

const URL = 'https://xmlgjqsyxvyuwdyynteh.supabase.co'
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtbGdqcXN5eHZ5dXdkeXludGVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxNzg0NDgsImV4cCI6MjA2MDc1NDQ0OH0.T97b2_aorFVVkhOwHTTFS7vnPRpvAzCUHtkuHRcRYao'

export const supabase = createClient(URL, KEY);