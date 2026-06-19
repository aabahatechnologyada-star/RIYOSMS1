'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { toast } from '@/hooks/use-toast'
import httpBrowserClient from '@/lib/httpBrowserClient'
import { ApiEndpoints } from '@/config/api'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

const requestResetSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
})

type RequestResetValues = z.infer<typeof requestResetSchema>

export default function RequestPasswordResetForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<RequestResetValues>({
    resolver: zodResolver(requestResetSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (data: RequestResetValues) => {
    setIsSubmitting(true)
    setError(null)

    try {
      await httpBrowserClient.post(ApiEndpoints.auth.requestPasswordReset(), {
        email: data.email,
      })
      setIsSubmitted(true)
      toast({
        title: 'Reset link sent',
        description: 'If an account exists with this email, you will receive a reset link.',
      })
    } catch (err: any) {
      console.error('request reset error:', err)
      setError(err.response?.data?.message || 'An unexpected error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <Alert className='bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-900/20'>
        <CheckCircle2 className='h-4 w-4 text-green-600 dark:text-green-400' />
        <AlertTitle className='text-green-800 dark:text-green-300'>Check your email</AlertTitle>
        <AlertDescription className='text-green-700 dark:text-green-400'>
          We have sent a password reset link to <strong>{form.getValues('email')}</strong>.
          Please check your inbox and follow the instructions.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        {error && (
          <Alert variant='destructive'>
            <AlertCircle className='h-4 w-4' />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input
                  placeholder='name@example.com'
                  {...field}
                  className='dark:text-white dark:bg-gray-800'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className='w-full'
          type='submit'
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Sending Link...' : 'Send Reset Link'}
        </Button>
      </form>
    </Form>
  )
}
