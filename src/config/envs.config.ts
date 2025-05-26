import * as dotenv from 'dotenv';
import { z } from 'zod';
dotenv.config();



const envSchema = z.object({
    PORT: z.coerce.number({message:'El puerto es obligatorio y debe ser un número'})
})


const envs = envSchema.safeParse(process.env)


if(!envs.success) throw new Error('Error con las variables de entorno')


export const envsConfig={

    PORT: envs.data.PORT

}