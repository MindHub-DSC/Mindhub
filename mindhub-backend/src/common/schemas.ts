import { z } from 'zod';

export const idSchema = z.uuid();
export const textoSchema = z.string().trim().min(1).max(2000);
export const nomeSchema = z.string().trim().min(1).max(120);
