import {z} from 'zod'

export const AcceptMessageSchema = z.object({
    isAccepting:z.boolean()
})