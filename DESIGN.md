# Polla Mundial - Sistema de Diseño unificado (DESIGN.md)

Este documento define las reglas visuales y arquitectónicas para todo el frontend de la "Polla Mundial", derivado estrictamente de la vista de Inicio (Home), la cual es nuestra fuente de verdad. El objetivo es homologar las pantallas secundarias para que luzcan consistentes, profesionales y atractivas, manteniendo el loop social.

## 1. Principios de Diseño (Inspirados en el Home)
1. **Tema Oscuro Oficial (`wc-*`)**: La app utiliza un modo oscuro profundo basado en `wc-dark` (`#0D1B2A`). Esto debe aplicarse a todas las vistas secundarias. Se rechazan fondos blancos translúcidos o modos claros en modales/tarjetas.
2. **Uso de Acentos (Rojo, Dorado, Celeste, Verde)**: Los colores `wc-red`, `wc-gold`, `wc-sky` y `wc-green` se utilizan con gran contraste, sombras con glow y jerarquía clara.
3. **Escaneabilidad y Claridad Mobile**: Componentes en forma de *Card* compactos, bordes redondeados, íconos de `lucide-react`, y degradados sutiles.
4. **Enfoque Social, no de Apuestas**: Las palabras "Puntos", "Racha", "Pronóstico", "Amigos" y "Liga" deben destacar. Se evitan elementos que parezcan apuestas con dinero real.

## 2. Paleta de Colores (Tokens del Home)

Todo el proyecto debe mapear a los tokens definidos en `tailwind.config.ts`. **Se debe eliminar cualquier uso de `brand-*` o valores Hexadecimales en línea.**

### Superficies y Textos
- **Fondo General**: `bg-wc-dark` (`#0D1B2A`).
- **Cards y Paneles**: `bg-wc-card` (`#132237`) o degradado `bg-card-gradient`.
- **Bordes y Divisores**: `border-wc-border` (`#2A4A68`).
- **Texto Principal**: `text-wc-white` (`#F5F5F5`).
- **Texto Secundario**: `text-wc-white/60` o `text-wc-muted` (No definido aún, pero se usará `text-wc-white` con opacidad).

### Colores de Estado / Feedback / Botones
- **Acción Principal (Jugar, Guardar)**: `bg-wc-red` con `shadow-glow-red` o `bg-wc-sky` para acciones secundarias afirmativas.
- **Destaque/Premios/Líderes**: `text-wc-gold` con degradado `bg-gold-gradient` o sombras `shadow-glow-gold`.
- **Acierto Perfecto (Pleno)**: `text-wc-green` o borde/fondo `wc-green` (`#006847`).
- **Acierto Parcial**: `text-wc-gold` (`#F0A500`).
- **Fallo**: `text-wc-muted` (`#1E3A52`) o `wc-red` opaco.
- **Pendiente**: `border-wc-border` o `text-wc-sky`.

### Tipografía
- **Display / Títulos Grandes**: `font-display` (Barlow Condensed o Inter), pesos pesados (`font-800`).
- **Cuerpo / Textos UI**: `font-sans` (Inter), pesos estándar y legibles.

## 3. Guía de Componentes Secundarios (Rediseño)

### 3.1. Navegación (Navbar y BottomNav)
- **Navbar (Desktop/Tablet)**: Debe integrarse al fondo oscuro. `bg-wc-dark/90 backdrop-blur-md border-b border-wc-border`. Botones de acción usando `wc-red` o `wc-card`.
- **BottomNav (Mobile)**: Bajar al oscuro. `bg-wc-dark/95 backdrop-blur-xl border-t border-wc-border`. Íconos activos en `wc-sky` o `wc-gold`.

### 3.2. Tarjetas (Cards)
- **Base**: `bg-wc-card/60 backdrop-blur-sm border border-wc-border rounded-2xl`.
- **Match Card (Partidos)**: Mostrar escudos/banderas grandes. Estados claros: Si el partido cerró, mostrar un overlay o cambiar borde a verde/rojo/oro según acierto.
- **Ranking Card**: Usar filas con `bg-wc-card` y separadores de `wc-border`. El Top 3 debe usar `wc-gold`, plomo/plata (no definido, usar gris claro), bronce (no definido, usar naranja oscuro).

### 3.3. Formularios, Modales e Inputs
- **Inputs**: `bg-wc-muted/50 border border-wc-border text-wc-white placeholder-wc-white/30 rounded-xl focus:border-wc-sky focus:ring-1 focus:ring-wc-sky`.
- **Modales**: Fondo oscuro `bg-wc-dark/80 backdrop-blur-md`, panel central `bg-wc-card border border-wc-border shadow-card`.

## 4. Mejoras UX/UI Funcionales por Pantalla

### A. Perfil de Usuario (/me)
- **Implementación**: Un panel de dos columnas: una para datos de perfil (alias, correo electrónico) y otra para seguridad (actualizar contraseña).
- **Estilo**: Formulario encapsulado en `Card` (`bg-wc-card/60 backdrop-blur-sm`), inputs consistentes, estados de guardado/error contextuales en verde/rojo, e integración directa con la API de Supabase Auth.
- **Acceso**: Enlace interactivo en la navbar en el texto "Conectado como [Alias]" y un botón con icono de usuario (`UserIcon`) junto al botón de salir.

### B. Mis Picks (Pronósticos)
- **Vista Mobile**: Listado compacto. Tarjetas con banderas y el pronóstico al centro.
- **Feedback Visual**: Si ya guardaste, borde brilla levemente en celeste (`wc-sky`). Si ya cerró, muestra los puntos ganados a un costado en verde (`wc-green`).
- **Funcionalidad**: Filtro rápido "Pendientes", "Hoy", "Finalizados".

### C. Ranking / Tabla de Posiciones
- **Visual**: Iconos estilo "fuego" (🔥) si subió posiciones o tiene racha de plenos.
- **Contexto**: Un banner superior indicando tu diferencia con el líder ("Estás a 5 pts del 1er lugar").

### D. Detalle de Liga (Admin)
- **Claridad**: Dividir en pestañas: "Participantes", "Feed/Actividad", "Ajustes (solo admin)".
- **Estados Vacíos**: "Aún no hay amigos. ¡Copia este enlace (Botón brillante) y armen su grupo!".

### E. Match Center y Carrusel Ticker
- **MatchCarousel**: Ticker superior continuo sin barra de scroll (`[&::-webkit-scrollbar]:hidden`). Cuenta con autodesplazamiento continuo infinito interactivo que se pausa en *hover*. Prioriza partidos EN VIVO.
- **FeaturedMatch**: Panel dinámico destacado superior que resalta el partido más relevante (o en vivo) con banderas grandes, marcador real y acceso directo a picks.
- **Enrutamiento Dinámico**: El logo redirige de forma inteligente a `/leagues` si el usuario está logueado, y a `/` si es un visitante anónimo. Los botones de llamada a la acción (CTA) cambian a "Ir a la Polla" si ya hay una sesión activa.

---
*Este documento es la única referencia válida para rediseñar vistas secundarias (Autenticación, Dashboard interno, Ligas, Ranking y Perfil).*
