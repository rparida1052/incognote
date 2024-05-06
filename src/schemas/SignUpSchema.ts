import {z} from 'zod'


export const usernameValdation = z.string().min(2,{message:"username must be at least 2 characters"}).max(20,{message:"username must not be greater than 20 characters"}).regex(/^[a-zA-Z0-9]+$/,{message:"Username must not contain special characters"})


export const SignUpSchema = z.object({
    username:usernameValdation,
    email:z.string().email({message:"Invalid email address"}),
    passord:z.string().min(6,{message:"Password must be atlest 6 characters"})
})