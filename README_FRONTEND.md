# Frontend README

## Setup Local
1. `npm install`
2. Configurar `.env.local` usando `.env.local.example`

## Correr Servidor
`npm run dev`

## Build para Producción
`npm run build`
`npm start`

## Despliegue en Producción
Para apuntar al backend de producción, el archivo `.env.production` está configurado para apuntar a `https://prediccionmundial2026-backend.onrender.com`. Al compilar (`npm run build`), Next.js inyectará automáticamente esta dirección.


## Estructura
- `app/`: Next.js App Router
- `components/`: Componentes UI reutilizables
- `services/`: Integración con API FastAPI
- `lib/`: Utils y clientes (Supabase, Axios)
