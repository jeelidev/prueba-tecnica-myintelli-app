# Prueba Técnica MyIntelli - My Intelli App 🚀

¡Hola, equipo de MyIntelli! 👋

Aquí está mi solución para la prueba técnica. La he pasado bien construyendo esta aplicación desde cero, usado React Native y, por supuesto, ¡haciendo que todo se vea genial!

El objetivo era crear una aplicación funcional con autenticacion y varias vistas segun el PDF que se entrego para la prueba y con una experiencia de usuario fluida, y creo que el resultado es una base sólida y escalable. ¡A continuacion vamos a conocer sobre ella!

## El Arsenal Tecnológico 🛠️

Para construir esta app, seleccioné un conjunto con el que estoy familiarizado y cumplirian los objetivos, cada una con una misión específica:

* **React Native & Expo (SDK 54):** ¡La base de todo! Expo permite escribir en React Native pero sin el dolor de cabeza de configurar Xcode y Android Studio manualmente. Maneja las builds hasta en la nuve si quieres, y si no tambien localmente, cero complique, y nos da acceso a APIs nativas de forma sencilla.

* **TypeScript:** Para mi un orden claro es importante, por eso TypeScript no es opcional. Me ayudado a evitar errores tontos, a tener un autocompletado increíble especifico por tipos y estructuras de datos y a que el código sea auto-documentado.

* **Expo Router:** Mi forma preferida de crear navegacion en las App moviles, En lugar de complicadas configuraciones de navegación, use el enrutamiento basado en archivos de Expo. La estructura de carpetas `app/` define las rutas, y **SUEPER IMPOERTANTE** implemente la protección de rutas de forma súper elegante y declarativa.

* **NativeWind:** Y cuando no?, Tailwind siempre es **UTIL** ¿Quién no ama Tailwind CSS? (**SI DICES QUE NO TE MATO**) NativeWind permite usar toda la potencia y velocidad de las clases para ccs de Tailwind directamente en nuestros componentes de React Native, creando UIs de manera mas simple que son Stylesheets.

* **React Native Reanimated:** **TENIA QUE PONERLE ALEGRIA A LA VIDA** Y para eso estan todas las animaciones,  (el sidebar, los títulos del header, los acordeones) están hechas con Reanimated. Esto garantiza que se ejecuten en el hilo de UI nativo, logrando un rendimiento de 60 FPS XD.

* **expo-secure-store:** Obvio se necesitaba una manera de mantener el TOKEN resguardado de froma segura para mantener las sessiones del usuario, guarde el token de autenticación de forma segura y encriptada en el dispositivo del usuario.

* **react-native-svg & expo-linear-gradient:** ¡Los Artistas como yo! Usamos estas librerías para replicar los diseños complejos como los `shape dividers` faciles en CSS de navegador, tambien aqui en movil y los fondos con gradientes que el CSS normal de React Native no puede manejar.

## ¿Qué hace  este circo? ✨

La aplicación tiene varios flujo interesante, desde el login hasta la visualización de datos de APIs.

#### 1. **Flujo de Autenticación 🔐**

* **Pantalla de Login (`/`):** Una bienvenida con un diseño lindo, inspirado en la marca de la empresa Myintelli, validación de email en tiempo real y un botón para mostrar/ocultar la contraseña.
* **Gestión de Sesión:** Al hacer login, se obtiene un token que se guarda de forma segura.
* **Rutas Protegidas:** La app está dividida en dos "universos". No puedes acceder a las pantallas internas sin un token válido. ¡esto gracias a los stack Guard de Expo Router!

#### 2. **Layout Principal y Sidebar Animado 🎨**

* Una vez dentro, te recibe un layout con un header y un sidebar.
* El **sidebar es un drawer animado** que se superpone al contenido, con un rendimiento espectacular gracias a que no se reconstruye en cada apertura (**GRACIAS AL USE MEMO DE REACT**).
* Muestra la información del usuario y los módulos a los que tiene acceso ese usuario desde el inicio de sesion, que se despliegan en un elegante menú de acordeón.

#### 3. **Pantallas Internas**

* **Dashboard (`/home`):** Una pantalla de bienvenida simple que muestra un resumen de la sesión.
* **API de Dispositivos (`/protectedApi`):**
  * Consume una API protegida con el token de sesión.
  * Muestra los datos en un **grid de tarjetas** con un diseño consistente.
  * Incluye un **buscador con *debounce*** para no sobrecargar la API mientras el usuario escribe.
  * Implementa la función de **"Cargar Más"** para la paginación infinita.
  * ¡Muestra **"Skeletons" de carga** para una experiencia de usuario mucho más agradable!
* **API de Rick y Morty (`/publicApi`):**
  * Consume la API pública de Rick y Morty.
  * Muestra los personajes en un grid similar.
  * Implementa un sistema de **paginación por páginas** (Anterior/Siguiente).
  * Al hacer clic en un personaje, navega a una **pantalla de detalles** de pantalla completa con su propia animación de transición y header nativo.

## ¿Como corro las pruebas en local? 🏁

¿Para probarla en tu máquina? ¡Es simple!

#### Prerrequisitos

* Node.js (LTS recomendado)
* Git
* `pnpm` como gestor de paquetes (`npm install -g pnpm`)
* Un emulador de Android o un dispositivo físico.

#### 1. Clona el Repositorio

```bash
git clone [[URL_DE_TU_REPOSITORIO](https://github.com/jeelidev/prueba-tecnica-myintelli-app)]
cd prueba-tecnica-myintelli-app```

#### 2. Instala las Dependencias
```bash
pnpm install
```

#### 3. ¡Hacer run! (con Expo Go)

La forma más rápida de empezar es usando la app Expo Go en tu teléfono o emulador.

```bash
pnpm expo start
```

Se abrirá una pestaña en tu navegador con un código QR o en la terminal si no lo tienes configurado en el navegador. Escanéalo con la cámara de tu teléfono (si tienes Expo Go instalado, SI NO QUE ESPERAS, instalalo) o presiona `a` en la terminal para abrirlo en tu emulador de Android.

## COMPILA LA APK (Compilación Local) 🏗️

Si quieres probar la versión de producción sin pasar por la nube de EAS, puedes compilarla localmente.

#### Prerrequisitos Nativos

* Tener **Android Studio** instalado y configurado.
* Tener el **JDK 17** instalado.
* Asegúrate de tener las variables de entorno `JAVA_HOME` y `ANDROID_HOME` configuradas en tu sistema.

#### Pasos para la Compilación

1. **Genera la carpeta de Android:** Este comando convierte tu proyecto Expo en un proyecto nativo estándar.

    ```bash
    npx expo prebuild --platform android --clean
    ```

2. **Entra a la carpeta de Android:**

    ```bash
    cd android
    ```

3. **Inicia la compilación con Gradle:** (¡Ten paciencia, la primera vez puede tardar un poco!)

    ```bash
    ./gradlew assembleRelease
    ```

4. **¡Encuentra tu APK!** Una vez que termine, tu APK firmada para producción estará en:
    `android/app/build/outputs/apk/release/app-release.apk`

¡Puedes instalar este archivo directamente en tu dispositivo!

---

¡Gracias por revisar mi trabajo! Ha sido un desafío muy entretenido.

¡Saludos!
**CON ❤️ Jeelidev Gracias**
