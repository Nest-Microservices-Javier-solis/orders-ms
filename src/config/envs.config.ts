import * as dotenv from 'dotenv';
import { z } from 'zod';
dotenv.config();



const envSchema = z.object({
    PORT: z.coerce.number({message:'El puerto es obligatorio y debe ser un número'}),
    NATS_URL: z.array(z.string(), { message: 'La URL de NATS es obligatoria y debe ser una cadena de texto' }).min(1, { message: 'La URL de NATS no puede estar vacía' })
})


const envs = envSchema.parse({...process.env,
    NATS_URL: process.env.NATS_URL?.split(',') 
})


if(!envs) throw new Error('Error con las variables de entorno')


export const envsConfig={

    PORT: envs.PORT,
    NATS_URL: envs.NATS_URL

}