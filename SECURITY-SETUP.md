# 🔐 Configuración de Seguridad - Firebase

## ⚠️ IMPORTANTE: Configuración de Variables de Entorno

Este proyecto utiliza variables de entorno para proteger información sensible de Firebase.

### 📋 Configuración Requerida

1. **Copia el archivo de ejemplo:**
   ```bash
   cp src/environments/environment.example.ts src/environments/environment.local.ts
   ```

2. **Copia el archivo .env de ejemplo:**
   ```bash
   cp .env.example .env
   ```

3. **Completa los valores reales en `.env`:**
   ```
   NG_APP_FIREBASE_API_KEY=tu_api_key_aqui
   NG_APP_FIREBASE_AUTH_DOMAIN=tu_dominio_aqui
   NG_APP_FIREBASE_PROJECT_ID=tu_project_id_aqui
   NG_APP_FIREBASE_STORAGE_BUCKET=tu_storage_bucket_aqui
   NG_APP_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id_aqui
   NG_APP_FIREBASE_APP_ID=tu_app_id_aqui
   NG_APP_FIREBASE_MEASUREMENT_ID=tu_measurement_id_aqui
   ```

### 🚨 NUNCA hagas esto:
- ❌ NO subas archivos `.env` a Git
- ❌ NO hardcodees API keys en el código
- ❌ NO compartas configuraciones de Firebase públicamente

### ✅ Mejores Prácticas:
- ✅ Usa variables de entorno para todos los secretos
- ✅ Mantén `.env` en `.gitignore`
- ✅ Regenera API keys si se exponen
- ✅ Usa diferentes proyectos Firebase para dev/prod

### 🔄 Si una API key se expone:
1. Ve a Firebase Console
2. Regenera la API key
3. Actualiza tus variables de entorno
4. Revoca la clave antigua