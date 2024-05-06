import {z} from 'zod'

export const SignInSchema = z.object({
    identifyer:z.string(),
    password:z.string()
})