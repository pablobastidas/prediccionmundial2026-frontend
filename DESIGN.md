# Desafío Mundial - Sistema de Diseño unificado (DESIGN.md)

Este documento define las reglas visuales y arquitectónicas para todo el frontend de "Desafío Mundial", derivado estrictamente de la vista de Inicio (Home), la cual es nuestra fuente de verdad. El objetivo es homologar las pantallas secundarias para que luzcan consistentes, profesionales y atractivas, manteniendo el loop social.

## 1. Principios de Diseño (Inspirados en el Home)
1. **Tema Claro Oficial (`wc-*`)**: La app utiliza un modo claro limpio y deportivo basado en `wc-dark` (`#F4F6F9` como fondo general y `#FFFFFF` para tarjetas/superficies). Se rechazan fondos oscuros o translúcidos oscuros de manera general en modales/tarjetas.
2. **Uso de Acentos (Rojo/Naranja, Azul/Púrpura, Dorado, Verde)**: Los colores `wc-red` (Betano style), `wc-blue`/`wc-sky` (Sports Purple/Blue) y `wc-gold` se utilizan con gran contraste, sombras suaves y jerarquía clara.
3. **Escaneabilidad y Claridad Mobile**: Componentes en forma de *Card* compactos, bordes redondeados (`--radius-md: 20px`), íconos de `lucide-react`, y degradados sutiles.
4. **Enfoque Social, no de Apuestas**: Las palabras "Puntos", "Racha", "Pronóstico", "Amigos" y "Liga" deben destacar. Se evitan elementos que parezcan apuestas con dinero real.

## 2. Paleta de Colores (Tokens del Home)

Todo el proyecto debe mapear a los tokens definidos en `tailwind.config.ts`. **Se debe eliminar cualquier uso de `brand-*` o valores Hexadecimales en línea.**

### Superficies y Textos
- **Fondo General**: `bg-wc-dark` (`#F4F6F9` / `--bg`).
- **Cards y Paneles**: `bg-wc-card` (`#FFFFFF` / `--surface`) o degradado `bg-card-gradient`.
- **Bordes y Divisores**: `border-wc-border` (`rgba(0, 0, 0, 0.08)` / `--border`).
- **Texto Principal**: `text-wc-white` o `text-wc-dark-text` (`#12141D` / `--fg`).
- **Texto Secundario**: `text-wc-muted` (`#64748B` / `--fg-muted`).

### Colores de Estado / Feedback / Botones
- **Acción Principal (Jugar, Guardar)**: `bg-wc-red` (`#FF3D00`) o `bg-wc-sky` / `bg-wc-blue` (`#5C45F2`) para acciones secundarias afirmativas.
- **Destaque/Premios/Líderes**: `text-wc-gold` (`#F0A500`) con degradado `bg-gold-gradient` o sombras `shadow-glow-gold`.
- **Acierto Perfecto (Pleno)**: `text-wc-green` / `--success` (`#00D26A`).
- **Acierto Parcial**: `text-wc-gold` (`#F0A500`).
- **Fallo / Peligro**: `text-wc-danger` / `--danger` (`#FF4B55`).
- **Pendiente**: `border-wc-border` o `text-wc-muted`.

### Tipografía
- **Display / Títulos Grandes**: `font-display` (Sora), pesos pesados (`font-800`), itálica en títulos deportivos.
- **Cuerpo / Textos UI**: `font-sans` (Plus Jakarta Sans), pesos estándar y legibles.

## 3. Guía de Componentes Secundarios

### 3.1. Navegación (Navbar y BottomNav)
- **Navbar (Desktop/Tablet)**: Integrada al fondo claro. `bg-wc-card border-b border-wc-border`. Botones de acción usando `wc-red` o `wc-blue`.
- **BottomNav (Mobile)**: Barra clara con desenfoque de fondo. `bg-white/95 backdrop-blur-xl border-t border-wc-border`. Íconos activos en `wc-red` / `wc-blue`.

### 3.2. Tarjetas (Cards)
- **Base**: `bg-wc-card border border-wc-border rounded-[20px] shadow-sm hover:shadow-md transition-all`.
- **Match Card (Partidos)**: Mostrar escudos/banderas grandes. Estados claros: Si el partido cerró, mostrar un overlay o cambiar borde según acierto.
- **Ranking Card**: Usar filas con `bg-wc-card` y separadores de `wc-border`. El Top 3 debe usar `wc-gold` (oro), gris claro (plata) y bronce.

### 3.3. Formularios, Modales e Inputs
- **Inputs**: `bg-wc-dark border border-wc-border text-wc-white placeholder-wc-muted rounded-xl focus:border-wc-blue focus:ring-1 focus:ring-wc-blue`.
- **Modales**: Fondo translúcido `bg-black/50 backdrop-blur-md`, panel central `bg-wc-card border border-wc-border shadow-lg`.

## 4. Mejoras UX/UI Funcionales por Pantalla

### A. Perfil de Usuario (/me)
- **Implementación**: Un panel de dos columnas: una para datos de perfil (alias, correo electrónico) y otra para seguridad (actualizar contraseña).
- **Estilo**: Formulario encapsulado en `Card` (`bg-wc-card border border-wc-border rounded-2xl`), inputs consistentes, estados de guardado/error contextuales en verde/rojo.

### B. Mis Picks (Pronósticos)
- **Vista Mobile**: Listado compacto. Tarjetas con banderas y el pronóstico al centro.
- **Feedback Visual**: Si ya guardaste, borde brilla levemente. Si ya cerró, muestra los puntos ganados.
- **Funcionalidad**: Filtro rápido por fase y estado ("Pendientes", "Hoy", "Finalizados").

### C. Ranking / Tabla de Posiciones
- **Visual**: Iconos estilo "fuego" (🔥) si subió posiciones o tiene racha de plenos.
- **Contexto**: Un banner superior indicando tu diferencia con el líder ("Estás a 5 pts del 1er lugar").

### D. Detalle de Liga (Admin)
- **Claridad**: Dividir en pestañas: "Participantes", "Feed/Actividad", "Ajustes (solo admin)".
- **Estados Vacíos**: "Aún no hay amigos. ¡Copia este enlace y armen su grupo!".

### E. Match Center y Carrusel Ticker
- **MatchCarousel**: Ticker superior continuo sin barra de scroll (`[&::-webkit-scrollbar]:hidden`). Cuenta con autodesplazamiento continuo infinito interactivo que se pausa en *hover*. Prioriza partidos EN VIVO.
- **FeaturedMatch**: Panel dinámico destacado superior que resalta el partido más relevante (o en vivo) con banderas grandes, marcador real y acceso directo a picks.

## 5. Gestión de Horarios y Zona Horaria (Timezone)
- **FormattedDate Component**: Para evitar diferencias horarias y errores de hidratación de Next.js SSR, toda visualización de fecha/hora de partidos debe realizarse a través del componente `FormattedDate` en `components/FormattedDate.tsx`.
- **Formateo**:
  - `full`: Muestra día de la semana, día, mes y hora (ej. `jue, 11 jun, 13:00`). Usado en listado de predicciones.
  - `short`: Muestra fecha corta y hora separadas por punto medio (ej. `11 jun · 13:00`). Usado en el panel de próximos partidos.
  - `time`: Muestra únicamente la hora (ej. `13:00`).
