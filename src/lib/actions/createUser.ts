'use server'
import { registerSchema } from '@/validations/user'
import bcryptjs from 'bcryptjs';
import {prisma} from "@/lib/prisma"
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { ZodError } from 'zod'

//ActionStateの型定義
type ActionState = {success: boolean; errors: Record<string,string[]>;}

//バリデーションエラー処理
function handleValidationError(error: ZodError): ActionState {
  const {fieldErrors, formErrors} = error.flatten();

  const errors = Object.fromEntries(
    Object.entries(fieldErrors).map(([k, v]) => [k, v ?? []])
  ) as Record<string, string[]>;

  if (formErrors.length > 0) {
    return {success: false, errors: {...errors, confirmPassword: formErrors}};
  }
  return {success: false, errors};
}
//カスタムエラー処理
function handleError(customErrors: Record<string,string[]>): ActionState {
  return {success: false, errors: customErrors};
}

export async function createUser(
  prevState: ActionState,
  formData: FormData
):Promise<ActionState>

{
  const rawFormData = Object.fromEntries(
    ["name", "email", "password", "confirmPassword"].map((field) => [
      field,
      formData.get(field) as string,
    ])
  ) as Record<string,string>

  //バリデーションエラー処理
  const validationResult = registerSchema.safeParse(rawFormData);
  if (!validationResult.success) {
    return handleValidationError(validationResult.error)
  }

  //DBにメールアドレスが存在しているかの確認
  const existingUser = await prisma.user.findUnique({
    where:{ email: rawFormData.email}
  })
  if (existingUser) {
    return handleError({email:['このメールアドレスは既に登録されています']})
  }
  //DBに登録
  const hashedPassword = await bcryptjs.hash(rawFormData.password,12)
  await prisma.user.create({
    data: {
      name: rawFormData.name,
      email: rawFormData.email,
      password: hashedPassword,
    }
  })
  //dashboardにリダイレクト
  await signIn('credentials', {
    ...Object.fromEntries(formData),
    redirect:false
  })

  redirect('/dashboard')
}




