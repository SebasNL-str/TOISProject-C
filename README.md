
# TOIS Says Kachow

Tutorial para instalar, configurar y ejecutar el proyecto en **CachyOS** y **Ubuntu Server**, utilizando Docker y Docker Compose.

## 1. Introducción

Este proyecto consiste en una landing page desarrollada con ASP.NET Core. La aplicación se ejecuta dentro de un contenedor Docker basado en la imagen oficial `mcr.microsoft.com/dotnet/sdk:9.0`.

Docker permite utilizar el entorno de .NET dentro de un contenedor, sin necesidad de instalar el SDK directamente en el sistema operativo.

### Tecnologías utilizadas

- **ASP.NET Core:** framework utilizado para desarrollar la aplicación web.
- **Docker Engine:** ejecuta y administra los contenedores.
- **Docker Compose v2:** permite iniciar y detener el proyecto mediante `compose.yaml`.
- **Git:** permite descargar y actualizar el código fuente.

### Requisitos previos

- Un equipo con CachyOS o Ubuntu Server.
- Acceso a una terminal.
- Conexión a Internet para instalar herramientas y descargar la imagen de Docker.
- Acceso al repositorio Git del proyecto.
- Permisos para ejecutar comandos de Docker.

No es necesario instalar .NET en el sistema anfitrión.

> **Nota sobre la versión:** .NET 9 terminó su soporte el 12 de mayo de 2026. Este tutorial conserva la versión utilizada por el proyecto. Se recomienda evaluar una futura actualización a .NET 10 LTS, sin realizarla como parte de estos pasos.

## 2. Instalación y configuración en CachyOS

CachyOS está basado en Arch Linux, por lo que se utiliza `pacman` para instalar Docker, Compose y Git.

### Paso 1. Actualizar el sistema

Abre una terminal y ejecuta:

```bash
sudo pacman -Syu
```

Este comando actualiza los paquetes del sistema. Es recomendable completar la actualización antes de instalar nuevas herramientas.

### Paso 2. Instalar Git, Docker y Docker Compose

Ejecuta:

```bash
sudo pacman -S git docker docker-compose
```

Los paquetes instalados son:

- `git`: permite clonar y actualizar el repositorio.
- `docker`: proporciona Docker Engine y su cliente.
- `docker-compose`: proporciona Docker Compose.

Si `pacman` pregunta si deseas continuar, confirma la instalación.

### Paso 3. Habilitar e iniciar Docker

Ejecuta:

```bash
sudo systemctl enable --now docker.service
```

Este comando inicia Docker inmediatamente y configura su inicio automático cuando arranque el sistema.

Comprueba el estado del servicio:

```bash
systemctl status docker
```

Busca el estado `active (running)`.

Para salir de la pantalla de estado, pulsa `q`.

### Paso 4. Verificar Docker y Docker Compose

Comprueba la versión de Docker:

```bash
docker --version
```

Comprueba que el daemon responde:

```bash
sudo docker info
```

Verifica Docker Compose v2:

```bash
docker compose version
```

La última orden debe mostrar una versión de Compose. Se utiliza `docker compose`, con un espacio, no el comando antiguo `docker-compose`.

También puedes ejecutar una prueba:

```bash
sudo docker run --rm hello-world
```

Docker descargará la imagen de prueba si no está disponible y mostrará un mensaje de confirmación.

### Paso 5. Configurar los permisos de Docker

Existen dos alternativas para utilizar Docker.

**Opción A: utilizar `sudo`**

Es la alternativa inicial más sencilla. Por ejemplo:

```bash
sudo docker compose up
```

En este caso, utiliza `sudo` también en los demás comandos de Docker Compose.

**Opción B: utilizar Docker sin `sudo`**

Si deseas trabajar sin escribir `sudo` constantemente, agrega tu usuario al grupo `docker`:

```bash
sudo usermod -aG docker "$USER"
```

Cierra la sesión y vuelve a iniciarla para aplicar el cambio. También puedes abrir una nueva sesión de inicio de sesión.

Comprueba que perteneces al grupo:

```bash
id -nG
```

Después, verifica que Docker responde sin privilegios adicionales:

```bash
docker info
```

> **Advertencia de seguridad:** pertenecer al grupo `docker` concede privilegios equivalentes, en la práctica, a los de administrador del sistema. Utiliza esta alternativa únicamente si confías en el usuario y comprendes sus implicaciones.

### Paso 6. Clonar el repositorio

Dirígete al directorio donde guardas tus proyectos. Por ejemplo:

```bash
mkdir -p ~/Proyectos
cd ~/Proyectos
```

Clona el repositorio:

```bash
git clone URL_DEL_REPOSITORIO
```

Sustituye `URL_DEL_REPOSITORIO` por la dirección real del repositorio.

Entra en el directorio creado por Git:

```bash
cd NOMBRE_DEL_REPOSITORIO
```

Sustituye `NOMBRE_DEL_REPOSITORIO` por el nombre real del directorio generado al clonar.

### Paso 7. Verificar los archivos del proyecto

Comprueba el directorio actual:

```bash
pwd
```

Lista sus archivos:

```bash
ls -la
```

Verifica que exista `compose.yaml`:

```bash
test -f compose.yaml && echo "compose.yaml encontrado" || echo "No se encontró compose.yaml"
```

Si el archivo no aparece, asegúrate de estar en la raíz correcta del repositorio.

También puedes comprobar la configuración que Docker Compose ha interpretado:

```bash
docker compose config
```

Este comando valida y muestra la configuración efectiva sin iniciar la aplicación.

### Paso 8. Ejecutar la landing page

Desde el directorio donde se encuentra `compose.yaml`, ejecuta:

```bash
docker compose up
```

Docker descargará la imagen del SDK de .NET si es necesario e iniciará el servicio definido en Compose.

El comando muestra los registros en la terminal. La primera ejecución puede tardar más debido a la descarga de la imagen y la restauración de dependencias de .NET.

Cuando la aplicación esté iniciada, abre el navegador y visita:

http://localhost:8080

Para detener la aplicación, pulsa `Ctrl+C`. Si necesitas limpiar los recursos del proyecto, puedes ejecutar después `docker compose down`.

## 3. Instalación y configuración en Ubuntu Server

Los siguientes pasos están diseñados para Ubuntu Server. Utilizan el repositorio oficial de Docker para instalar Docker Engine y el complemento Docker Compose v2.

### Paso 1. Actualizar los índices de paquetes

Ejecuta:

```bash
sudo apt update
```

Para instalar las actualizaciones disponibles del sistema, puedes ejecutar:

```bash
sudo apt upgrade
```

### Paso 2. Instalar Git y las herramientas necesarias

Ejecuta:

```bash
sudo apt install -y git ca-certificates curl
```

Estos paquetes permiten trabajar con Git, verificar certificados HTTPS y descargar los archivos necesarios para configurar el repositorio de Docker.

### Paso 3. Configurar el repositorio oficial de Docker

Primero, crea el directorio destinado a las claves de los repositorios:

```bash
sudo install -m 0755 -d /etc/apt/keyrings
```

Descarga la clave oficial de Docker:

```bash
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
  -o /etc/apt/keyrings/docker.asc
```

Permite que el sistema pueda leer la clave:

```bash
sudo chmod a+r /etc/apt/keyrings/docker.asc
```

Agrega el repositorio oficial mediante el archivo de configuración recomendado por Docker:

```bash
sudo tee /etc/apt/sources.list.d/docker.sources <<EOF
Types: deb
URIs: https://download.docker.com/linux/ubuntu
Suites: $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}")
Components: stable
Architectures: $(dpkg --print-architecture)
Signed-By: /etc/apt/keyrings/docker.asc
EOF
```

Actualiza los índices para incluir los paquetes del nuevo repositorio:

```bash
sudo apt update
```

Este procedimiento utiliza la versión de Ubuntu y la arquitectura detectadas por el sistema. Está destinado a versiones de Ubuntu compatibles con el repositorio oficial de Docker.

### Paso 4. Instalar Docker Engine y Docker Compose v2

Ejecuta:

```bash
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

Se instalan los siguientes componentes:

- `docker-ce`: Docker Engine.
- `docker-ce-cli`: cliente de Docker.
- `containerd.io`: componente de ejecución de contenedores.
- `docker-buildx-plugin`: complemento de construcción de imágenes.
- `docker-compose-plugin`: Docker Compose v2.

No es necesario instalar por separado el paquete antiguo `docker-compose`.

### Paso 5. Iniciar y habilitar Docker

Ejecuta:

```bash
sudo systemctl enable --now docker.service
```

Comprueba el estado:

```bash
sudo systemctl status docker
```

El servicio debe aparecer como `active (running)`.

Verifica la versión:

```bash
sudo docker --version
```

Comprueba que Docker responde:

```bash
sudo docker info
```

Comprueba Docker Compose:

```bash
sudo docker compose version
```

Finalmente, ejecuta una prueba:

```bash
sudo docker run --rm hello-world
```

Si aparece el mensaje de confirmación, Docker puede descargar y ejecutar contenedores correctamente.

### Paso 6. Configurar los permisos

Inicialmente, utiliza `sudo` para ejecutar Docker. Por ejemplo:

```bash
sudo docker compose ps
```

Si deseas ejecutar los comandos sin `sudo`, agrega tu usuario al grupo `docker`:

```bash
sudo usermod -aG docker "$USER"
```

Cierra la sesión SSH y vuelve a conectarte para que se apliquen los cambios.

Comprueba la pertenencia al grupo:

```bash
id -nG
```

Prueba el acceso:

```bash
docker info
```

Si no necesitas este acceso adicional, puedes conservar el uso de `sudo`. Pertenecer al grupo `docker` equivale, en la práctica, a disponer de privilegios de administrador; no lo concedas indiscriminadamente.

### Paso 7. Clonar el repositorio

Crea un directorio para tus proyectos:

```bash
mkdir -p ~/Proyectos
cd ~/Proyectos
```

Clona el repositorio:

```bash
git clone URL_DEL_REPOSITORIO
```

Sustituye el marcador por la dirección real del repositorio.

Entra en su directorio:

```bash
cd NOMBRE_DEL_REPOSITORIO
```

Si el equipo te ha asignado una rama concreta, consulta la sección de Git antes de comenzar a trabajar en ella.

### Paso 8. Comprobar `compose.yaml`

Ejecuta:

```bash
ls -la
```

Comprueba la existencia del archivo:

```bash
test -f compose.yaml && echo "compose.yaml encontrado" || echo "No se encontró compose.yaml"
```

Valida la configuración:

```bash
sudo docker compose config
```

Si configuraste el acceso sin `sudo`, puedes omitirlo en los comandos posteriores.

### Paso 9. Ejecutar la aplicación

Desde el directorio que contiene `compose.yaml`, ejecuta:

```bash
sudo docker compose up -d
```

El parámetro `-d` permite dejar la aplicación ejecutándose en segundo plano.

Consulta el estado:

```bash
sudo docker compose ps
```

Consulta los registros:

```bash
sudo docker compose logs -f
```

Pulsa `Ctrl+C` para salir de los registros sin detener el contenedor.

Para comprobar la aplicación desde el propio servidor, puedes ejecutar:

```bash
curl -I http://localhost:8080
```

La respuesta HTTP dependerá de la ruta solicitada y de la aplicación. Si `curl` no está instalado, puedes instalarlo con `sudo apt install curl`.

## 4. Uso diario del proyecto

Todos los comandos de esta sección deben ejecutarse desde el directorio que contiene `compose.yaml`.

Si configuraste Docker para tu usuario, utiliza los comandos sin `sudo`. En caso contrario, antepón `sudo` a cada comando de Docker Compose.

### Iniciar la aplicación

```bash
docker compose up
```

Inicia el servicio y muestra sus registros en la terminal. Es útil durante el desarrollo porque permite observar los mensajes de la aplicación.

### Iniciar en segundo plano

```bash
docker compose up -d
```

Inicia los servicios en segundo plano y devuelve el control de la terminal.

### Detener el proyecto

```bash
docker compose down
```

Detiene y elimina los contenedores y la red predeterminada creados por Compose para el proyecto actual.

No detiene indiscriminadamente todos los contenedores que se ejecutan en el equipo.

### Consultar el estado

```bash
docker compose ps
```

Muestra el estado de los contenedores asociados al proyecto.

### Consultar los registros

```bash
docker compose logs -f
```

Muestra los registros y continúa mostrando las nuevas entradas.

Para salir, pulsa `Ctrl+C`. Esto no detiene por sí mismo la aplicación.

### Reiniciar el servicio

```bash
docker compose restart
```

Reinicia los contenedores existentes del proyecto sin recrearlos.

Si modificaste la configuración de Compose o necesitas recrear el entorno, evalúa utilizar `docker compose up -d` en lugar de confiar únicamente en `restart`.

### Abrir la aplicación

En el equipo donde se ejecuta Docker, abre:

http://localhost:8080

Si la aplicación no responde, revisa el estado con `docker compose ps` y los registros con `docker compose logs -f`.

## 5. Acceso desde otro equipo a Ubuntu Server

Si deseas acceder a la landing page desde otro equipo conectado a la misma red, sigue estos pasos.

### Paso 1. Identificar la IP del servidor

En Ubuntu Server, ejecuta:

```bash
hostname -I
```

El comando muestra las direcciones IP configuradas. Identifica la dirección correspondiente a la red local.

También puedes consultar las interfaces de red:

```bash
ip -br address
```

### Paso 2. Verificar que la aplicación esté funcionando

Desde el directorio del proyecto, ejecuta:

```bash
sudo docker compose ps
```

Comprueba que el servicio esté en ejecución y que el puerto `8080` esté publicado.

Consulta los registros si hay errores:

```bash
sudo docker compose logs --tail=100
```

### Paso 3. Revisar el firewall

Si no puedes conectarte desde otro equipo, comprueba si UFW está instalado y habilitado:

```bash
sudo ufw status
```

No presupongas que UFW está activo. También puede haber reglas de firewall en el router o en la infraestructura de red.

Si UFW está habilitado y necesitas permitir el acceso desde tu red local, primero identifica el rango de red autorizado. Después, sustituye `SUBRED_LOCAL` por el rango CIDR real:

```bash
sudo ufw allow from SUBRED_LOCAL to any port 8080 proto tcp
```

Por ejemplo, `192.168.1.0/24` solo sería apropiado si ese es realmente el rango de tu red.

No abras el puerto indiscriminadamente ni expongas la aplicación directamente a Internet.

### Paso 4. Acceder desde el otro equipo

En el navegador del equipo cliente, abre:

```text
http://IP_DEL_SERVIDOR:8080
```

Sustituye `IP_DEL_SERVIDOR` por la dirección real de Ubuntu Server.

Por ejemplo, si la dirección local fuera `192.168.1.50`, la URL sería `http://192.168.1.50:8080`.

**Importante:** `localhost` siempre se refiere al propio equipo desde el que se abre el navegador. Para acceder al servidor desde otro dispositivo, debes utilizar la IP del servidor.

## 6. Actualizar el proyecto mediante Git

Antes de actualizar el código, comprueba en qué rama estás trabajando y si existen cambios locales.

### Paso 1. Revisar el estado del repositorio

Desde la raíz del proyecto, ejecuta:

```bash
git status
```

Consulta la rama actual:

```bash
git branch --show-current
```

Si tienes cambios sin guardar, decide cómo conservarlos antes de actualizar. Puedes realizar un commit o utilizar `git stash` si necesitas apartarlos temporalmente.

No ejecutes comandos que descarten cambios locales sin comprender sus consecuencias.

### Paso 2. Descargar los cambios remotos

```bash
git fetch
```

Este comando actualiza las referencias de las ramas remotas sin modificar directamente tus archivos de trabajo.

Consulta las ramas disponibles:

```bash
git branch -a
```

Si necesitas cambiar a una rama asignada por el equipo, asegúrate primero de conservar los cambios locales y utiliza el nombre real de esa rama.

### Paso 3. Actualizar la rama actual

Una vez que hayas comprobado que estás en la rama correcta y que tus cambios locales están protegidos, puedes actualizarla con:

```bash
git pull --ff-only
```

Este comando intenta avanzar la rama mediante una actualización de tipo *fast-forward*. Si las ramas han divergido, se detendrá en lugar de crear automáticamente un commit de fusión.

En ese caso, revisa la situación con el equipo antes de decidir cómo integrar los cambios.

### Paso 4. Ejecutar la versión actualizada

Después de actualizar el código, inicia o recrea el servicio mediante:

```bash
docker compose up -d
```

Consulta el estado y los registros:

```bash
docker compose ps
docker compose logs -f
```

La configuración actual utiliza un montaje del directorio del proyecto dentro del contenedor. Por eso, los cambios en los archivos se reflejan en el directorio montado, pero la aplicación no necesariamente se reinicia automáticamente cuando cambias el código.

Si necesitas reiniciar la aplicación, ejecuta:

```bash
docker compose restart
```

Si el cambio requiere una recreación del contenedor o una nueva configuración, consulta los registros y vuelve a ejecutar `docker compose up -d` después de revisar los cambios.

## 7. Solución de problemas frecuentes

### 7.1. Docker no está iniciado

**Síntoma:** aparece un error indicando que no es posible conectarse al daemon de Docker.

Comprueba el estado:

```bash
sudo systemctl status docker
```

Inicia el servicio:

```bash
sudo systemctl start docker
```

Si deseas habilitar también el inicio automático:

```bash
sudo systemctl enable docker
```

Si el servicio no puede iniciarse, consulta sus registros:

```bash
sudo journalctl -u docker -n 100 --no-pager
```

### 7.2. Permisos denegados

**Síntoma:** Docker informa que no puede acceder al socket del daemon.

Prueba con `sudo`:

```bash
sudo docker info
```

Si funciona, el problema probablemente esté relacionado con los permisos. Puedes continuar usando `sudo` o configurar el grupo `docker`, teniendo en cuenta sus implicaciones de seguridad.

### 7.3. Docker Compose no está disponible

Comprueba si Compose v2 está instalado:

```bash
docker compose version
```

En CachyOS, instala o revisa el paquete:

```bash
sudo pacman -S docker-compose
```

En Ubuntu Server, instala el complemento oficial:

```bash
sudo apt update
sudo apt install docker-compose-plugin
```

Después, vuelve a ejecutar `docker compose version`.

### 7.4. El puerto 8080 está ocupado

Comprueba qué proceso escucha en el puerto:

```bash
sudo ss -ltnp 'sport = :8080'
```

Si otro servicio utiliza el puerto, identifica qué proceso es antes de detenerlo.

La configuración actual publica el puerto `8080` del anfitrión. Si necesitas cambiarlo, debes revisar el mapeo de puertos en `compose.yaml` y coordinar el cambio con el equipo. No modifiques la configuración silenciosamente.

### 7.5. La aplicación no responde en el navegador

Comprueba el estado:

```bash
docker compose ps
```

Consulta los registros:

```bash
docker compose logs --tail=100
```

Prueba desde el propio equipo:

```bash
curl -v http://localhost:8080
```

Verifica que la aplicación esté escuchando en `0.0.0.0:8080` dentro del contenedor, tal como establece el comando de ejecución de la configuración descrita.

### 7.6. El contenedor se detiene al iniciar

Consulta los registros:

```bash
docker compose logs --tail=200
```

Comprueba también el estado:

```bash
docker compose ps -a
```

Revisa los mensajes de error, la existencia de los archivos del proyecto y la configuración de Compose. Si el problema persiste, comparte el mensaje de error con el equipo.

### 7.7. Errores al restaurar dependencias de .NET

La primera ejecución de `dotnet run` puede restaurar dependencias automáticamente. Los errores pueden deberse a problemas de red, paquetes inaccesibles, configuración del proyecto o archivos de dependencias inconsistentes.

Consulta los registros:

```bash
docker compose logs --tail=200
```

Comprueba que el contenedor tenga acceso a Internet y que el proyecto incluya sus archivos de configuración y dependencias necesarios.

Para observar la restauración de forma explícita, puedes ejecutar temporalmente el siguiente comando:

```bash
docker compose run --rm landing dotnet restore
```

Este comando crea un contenedor temporal para ejecutar la restauración. No reemplaza la configuración habitual de inicio.

Si continúa el error, revisa el mensaje completo y consulta al equipo antes de modificar archivos de dependencias o versiones.

### 7.8. Ubuntu Server no permite conexiones desde otros equipos

Comprueba primero el servicio:

```bash
sudo docker compose ps
```

Revisa el mapeo de puertos:

```bash
sudo docker port "$(sudo docker compose ps -q landing)"
```

Si el servicio está funcionando, verifica la IP del servidor:

```bash
ip -br address
```

Comprueba el firewall:

```bash
sudo ufw status
```

También debes revisar las reglas de la red local, del router y de cualquier firewall externo.

Recuerda que la publicación del puerto en Compose no garantiza por sí sola que la red permita el acceso.

## 8. Resumen de comandos

Ejecuta los siguientes comandos desde el directorio donde se encuentra `compose.yaml`.

| Acción | Comando |
|---|---|
| Iniciar y mostrar registros | `docker compose up` |
| Iniciar en segundo plano | `docker compose up -d` |
| Detener y eliminar los recursos del proyecto | `docker compose down` |
| Consultar el estado | `docker compose ps` |
| Ver registros en tiempo real | `docker compose logs -f` |
| Reiniciar el servicio | `docker compose restart` |
| Validar la configuración | `docker compose config` |

Para utilizar los comandos sin `sudo`, debes haber configurado previamente los permisos de Docker.

## 9. Referencias oficiales

Consulta la documentación oficial para obtener instrucciones actualizadas y resolver problemas específicos de tu sistema:

- [Docker Engine en Ubuntu](https://docs.docker.com/engine/install/ubuntu/)
- [Instalación de Docker Engine](https://docs.docker.com/engine/install/)
- [Instalación de Docker Compose](https://docs.docker.com/compose/install/)
- [Docker en Arch Linux Wiki](https://wiki.archlinux.org/title/Docker)
- [Política de soporte de .NET](https://dotnet.microsoft.com/en-us/platform/support/policy/dotnet-core)
- [Documentación de ASP.NET Core](https://learn.microsoft.com/aspnet/core/)

---

**Fin del tutorial.** El proyecto puede ejecutarse en CachyOS y Ubuntu Server utilizando Docker, sin instalar el SDK de .NET directamente en el sistema anfitrión.

