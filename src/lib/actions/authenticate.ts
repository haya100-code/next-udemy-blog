'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { redirect } from 'next/navigation';

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', {
      ...Object.fromEntries(formData),
      redirect: false
    })

    redirect('/dashboard')
  } catch (error) {
    if ((error as { type?: string })?.type === 'CredentialsSignin') {
      return 'メールアドレスまたはパスワードが正しくありません。';
    }
    if (error instanceof AuthError) {
      return 'エラーが発生しました。';
    }
    throw error;
  }
}

