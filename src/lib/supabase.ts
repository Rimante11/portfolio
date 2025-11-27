import { createClient } from '@supabase/supabase-js'
import projectsData from '../data/projects.json'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Check if Supabase is configured with valid URLs
const isSupabaseConfigured = supabaseUrl && 
  supabaseAnonKey && 
  (supabaseUrl.startsWith('http://') || supabaseUrl.startsWith('https://'))

if (!isSupabaseConfigured) {
  console.warn('Supabase environment variables not configured! Using fallback JSON data.')
} else {
  console.log('Supabase client initialized successfully!')
}

// Create supabase client only if environment variables are available and valid
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null

// Fallback JSON data import
let fallbackProjects: Project[] = []
try {
  fallbackProjects = projectsData.map((project: any) => ({
    id: project.id,
    name: project.name,
    category: project.category,
    description: project.description,
    image: project.image,
    modal_content: project.modalContent,
    modal_type: project.modalType,
  }))
} catch (error) {
  console.error('Failed to load fallback JSON data:', error)
}

// Types for your projects
export interface Project {
  id: string
  name: string
  category: string
  description: string
  image: string | null
  modal_content: string | null
  modal_type: string
  created_at?: string
  updated_at?: string
}

// Fetch all projects
export async function getProjects(): Promise<Project[]> {
  // Use fallback JSON data if Supabase is not configured
  if (!supabase) {
    console.log('FALLBACK: Loading projects from JSON file (Supabase not configured)')
    return Promise.resolve(fallbackProjects)
  }
  
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) {
    console.error('SUPABASE ERROR: Failed to fetch projects:', error)
    console.log('FALLBACK: Switching to JSON data due to error')
    return fallbackProjects // Return fallback on error
  }

  return data || []
}

// Add a new project
export async function addProject(project: Omit<Project, 'created_at' | 'updated_at'>): Promise<Project | null> {
  if (!supabase) {
    console.warn('Supabase not configured. Cannot add project.')
    return null
  }

  const { data, error } = await supabase
    .from('projects')
    .insert([project])
    .select()
    .single()

  if (error) {
    console.error('Error adding project:', error)
    return null
  }

  return data
}

// Update a project
export async function updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
  if (!supabase) {
    console.warn('Supabase not configured. Cannot update project.')
    return null
  }

  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating project:', error)
    return null
  }

  return data
}

// Delete a project
export async function deleteProject(id: string): Promise<boolean> {
  if (!supabase) {
    console.warn('Supabase not configured. Cannot delete project.')
    return false
  }

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting project:', error)
    return false
  }

  return true
}