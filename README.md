# Photo Gallery (Ionic + Angular + Capacitor)

Aplicación móvil y web basada en Ionic + Angular que implementa una galería de fotos. Usa Capacitor para acceso nativo (Cámara, Filesystem, etc.).

## Requisitos

- Node.js 18+ y npm
- Ionic CLI (opcional pero recomendado): `npm i -g @ionic/cli`
- Capacitor 7 (incluido como dev dep)
- Xcode (para iOS, solo macOS)
- Android Studio (para Android)

## Instalación

```bash
npm install
```

## Desarrollo Web

```bash
ionic serve
```

Abre `http://localhost:8100/tabs/tab1`.

## Build Mobile

```bash
ionic build
```

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

- iOS: desde Xcode, selecciona un simulador/dispositivo y Run.
- Android: desde Android Studio, elige un AVD/dispositivo y Run.

> Nota: la primera vez que agregas plataformas:

```bash
npx cap add ios
npx cap add android
```

## Plugins usados (selección)

- `@capacitor/camera`
- `@capacitor/filesystem`
- `@capacitor/preferences`
- `@capacitor/status-bar`, `@capacitor/keyboard`, `@capacitor/haptics`
- `@ionic/pwa-elements` (para web)

## Permisos

- iOS: agrega descripciones en `Info.plist` (p. ej. `NSCameraUsageDescription`, `NSPhotoLibraryAddUsageDescription`).
- Android: Capacitor inyecta permisos en `AndroidManifest.xml` según plugins. Verifica cámara/almacenamiento según tu caso.

## Estructura del proyecto (resumen)

- `src/app/`: código Angular/Ionic
- `src/assets/`: recursos estáticos
- `www/`: salida de build web consumida por Capacitor
- `ios/`, `android/`: proyectos nativos

## Recursos

- Documentación Ionic: https://ionicframework.com/docs
- Angular: https://angular.dev
- Capacitor: https://capacitorjs.com/docs

## Licencia

MIT (o la que corresponda).
