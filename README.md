# Tienda Online (Ionic + Angular + Firebase + Capacitor)

Aplicación móvil y web con tabs que incluye autenticación con Firebase, catálogo de productos, carrito persistente y perfil de usuario. Mantiene utilidades nativas de Capacitor (Status Bar, Camera/Filesystem/Preferences) para capacidades híbridas.

## Funcionalidades principales

- Autenticación (Firebase Email/Password): registro, login, logout, verificación de email y recarga de datos del usuario.
- Catálogo (Tab 2): productos desde `https://fakestoreapi.com`, filtros por categoría, búsqueda, detalle en modal y agregar al carrito.
- Carrito (Tab 3): actualizar cantidades, quitar productos, vaciar carrito, total en tiempo real, checkout simulado. Persistencia en `localStorage`.
- Perfil (Tab 1): ver nombre, email, UID y estado de verificación; acciones de verificar email, refrescar datos y cerrar sesión.
- Rutas protegidas: `/tabs/**` protegido por guard de autenticación. `login/register` redirigen a `/tabs/tab2` si ya estás autenticado.

## Requisitos

- Node.js 18+ y npm
- Ionic CLI (opcional): `npm i -g @ionic/cli`
- Capacitor 7
- Xcode (iOS, solo macOS) y/o Android Studio (Android)
- Proyecto de Firebase (habilitar Email/Password en Authentication)

## Instalación

```bash
npm install
```

## Configuración de Firebase

Tienes dos alternativas para configurar las credenciales:

- Opción A (recomendado en dev): usa `src/environments/environment.local.ts`.

  - Copia/ajusta valores a partir de `src/environments/environment.example.ts`.
  - Nota: actualmente `AppModule` importa `environment.local` para inicializar Firebase.

- Opción B (variables de entorno en build): define las variables antes de construir/servir:
  - `NG_APP_FIREBASE_API_KEY`
  - `NG_APP_FIREBASE_AUTH_DOMAIN`
  - `NG_APP_FIREBASE_PROJECT_ID`
  - `NG_APP_FIREBASE_STORAGE_BUCKET`
  - `NG_APP_FIREBASE_MESSAGING_SENDER_ID`
  - `NG_APP_FIREBASE_APP_ID`
  - `NG_APP_FIREBASE_MEASUREMENT_ID`

Ejemplo en macOS/Linux para una sola ejecución:

```bash
NG_APP_FIREBASE_API_KEY=... NG_APP_FIREBASE_AUTH_DOMAIN=... ionic serve
```

## Desarrollo Web

```bash
ionic serve
```

Abre `http://localhost:8100/` (la app redirige inicialmente a `/login`).

### Rutas clave

- `/login` y `/register`: acceso público; si ya hay sesión activa, redirige a `/tabs/tab2`.
- `/tabs/tab2`: catálogo y entrada principal de la app autenticada.
- `/tabs/tab3`: carrito.
- `/tabs/tab1`: perfil.

## Scripts útiles

```bash
npm start      # ng serve
npm run build  # ng build (emite en www/)
npm test       # ng test
npm run lint   # ng lint
```

## Build Mobile

```bash
ionic build
```

La salida web queda en `www/` (configurada en `angular.json`).

## Capacitor (iOS/Android)

Config principal en `capacitor.config.ts`:

- `appId`: `io.ionic.starter`
- `appName`: `photo-gallery`
- `webDir`: `www`

### Flujos comunes

1. Preparar la web (si cambiaste código):

```bash
npm run build
```

2. Sincronizar nativo:

```bash
npx cap sync
```

3. Abrir en IDE nativo:

```bash
npx cap open ios
npx cap open android
```

4. Ejecutar:

- iOS: desde Xcode, elige simulador/dispositivo y Run.
- Android: desde Android Studio, elige AVD/dispositivo y Run.

> Primera vez agregando plataformas:

```bash
npx cap add ios
npx cap add android
```

## Plugins y librerías

- `@angular/fire` (Firebase)
- `@capacitor/status-bar`, `@capacitor/keyboard`, `@capacitor/haptics`
- `@capacitor/preferences` (persistencia simple), `@capacitor/filesystem`, `@capacitor/camera` (utilidades disponibles)
- `@ionic/pwa-elements` (soporte de cámara en web, si se usa)

## API de productos

- Fuente: `https://fakestoreapi.com` (sin API key). Requiere conexión a internet.

## Persistencia y estado

- Carrito: almacenado en `localStorage` bajo la llave `shopping_cart`.
- Autenticación: manejada por Firebase; el guard controla acceso a `/tabs/**`.

## Permisos (si usas cámara/galería)

- iOS: agrega descripciones en `Info.plist` (p. ej. `NSCameraUsageDescription`, `NSPhotoLibraryAddUsageDescription`).
- Android: Capacitor agrega permisos en `AndroidManifest.xml` según plugins.

## Estructura del proyecto (resumen)

- `src/app/`: código Angular/Ionic (tabs, páginas de login/register, guards, servicios)
- `src/environments/`: archivos de configuración (`environment.local.ts`, `environment.ts`, `environment.prod.ts`)
- `www/`: salida de build web consumida por Capacitor
- `ios/`, `android/`: proyectos nativos

## Notas

- En `app.component.ts` se configura `StatusBar` solo en plataformas nativas.
- El servicio `PhotoService` está disponible para capturar/guardar fotos localmente, aunque no está integrado en las tabs actuales.

## Recursos

- Documentación Ionic: https://ionicframework.com/docs
- Angular: https://angular.dev
- Capacitor: https://capacitorjs.com/docs
- Firebase (Web): https://firebase.google.com/docs

## Licencia

MIT (o la que corresponda).
