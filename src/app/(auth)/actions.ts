'use server'
// https://supabase.com/docs/guides/auth/server-side/nextjs
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import { SignUpWithPasswordCredentials } from '@supabase/supabase-js'

export async function login(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data: SignUpWithPasswordCredentials = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      data: {
        full_name: `${formData.get('first-name')} ${formData.get('last-name')}`
      }
    }
  }
  console.log(data)
  const { error } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export const signout = async () => {
  const supabase = createClient()

  const { error } = await supabase.auth.signOut()
  if (error) redirect('/error')
  revalidatePath('/', 'layout') //새로고침
  redirect('/auth/login')
}
