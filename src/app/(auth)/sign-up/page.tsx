"use client"
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import {useDebounceCallback} from "usehooks-ts"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { SignUpSchema } from '@/schemas/SignUpSchema'
import axios,{AxiosError} from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import {z} from 'zod'
import { Button } from '@/components/ui/button'
import { FormField, FormItem, FormLabel, FormMessage,Form } from '@/components/ui/form'
import { Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'

const SignUp = () => {
    const { toast } = useToast()
    const [username, setUsername] = useState('');
    const [usernameMessage, setUsernameMessage] = useState('');
    const [isSearchingUsername, setIsSearchingUsername] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const debounced = useDebounceCallback(setUsername,300)
    const router = useRouter();

    const form = useForm<z.infer<typeof SignUpSchema>>({
        resolver:zodResolver(SignUpSchema),
        defaultValues:{
            username:'',
            email:'',
            password:''
        }
    })

    //checking the username
    useEffect(()=>{
        const checkUsernameUnique = async () =>{
            if(username){
                setIsSearchingUsername(true);
                setUsernameMessage('');
                try{
                    const response = await axios.get(`/api/check-user-unique?username=${username}`);
                    setUsernameMessage(response.data.message);
                }catch(error){
                    const axiosError = error as AxiosError<ApiResponse>;
                    setUsernameMessage(axiosError.response?.data.message ?? "Error in checking username")
                }finally{
                    setIsSearchingUsername(false);
                }

            }
            
        }
        checkUsernameUnique();
    },[username])

    const onSubmit = async (data : z.infer<typeof SignUpSchema>)=>{
        setIsSubmitting(true);
        try{
          const response = await axios.post<ApiResponse>('/api/sign-up',data);
            toast({
                title:"Success",
                description:response.data.message,
            })
            router.replace(`/verify/${username}`);
        }catch(error){
            console.log("Error in submitting message",error);
            const axiosError  = error as AxiosError<ApiResponse>;
            const errorMessage = axiosError.response?.data.message;
            toast({
                title:"Error",
                description:errorMessage,
                variant:"destructive"
            },)
        }finally{
            setIsSubmitting(false);
        }
    }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
          Join IncogNote
        </h1>
        <p className="mb-4">Sign up to start your anonymous adventure</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            name="username"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <Input
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    debounced(e.target.value);
                  }}
                />
                {isSearchingUsername && <Loader2 className="animate-spin" />}
                {!isSearchingUsername && usernameMessage && (
                  <p
                    className={`text-sm ${
                      usernameMessage === 'Username is available'
                        ? 'text-green-500'
                        : 'text-red-500'
                    }`}
                  >
                    {usernameMessage}
                  </p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <Input {...field} name="email" />
                <p className='text-muted text-gray-800 text-sm'>*We will send you a verification code</p>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="password"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <Input type="password" {...field} name="password" />
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className='w-full' disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              'Sign Up'
            )}
          </Button>
        </form>
      </Form>
      <div className="text-center mt-4">
        <p>
          Already a member?{' '}
          <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  </div>
  )
}

export default SignUp