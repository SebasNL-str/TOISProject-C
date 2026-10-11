# Para Doc Hudson
1. Instalar nodejs, npm, y git (Aunque git cachy ya lo trae por difaul)

sudo pacman -Syu
sudo pacman -S git nodejs npm

Para verificar que las ondas esten instaladas

git --version
node -v
npm -v

Si se muestran las versiones, todo dabuti entonces (Solo aplicar este paso una sola vez fsdhjfhjk)

2. Clonar el repositorio

git clone [https://github.com/SebasNL-str/TOISProject-C.git]
cd [TOISProject-C]

3. Cambiar a la rama de trabajo

Para trabajar en la doch-hudson:

git fetch origin
git switch doch-hudson


Para comprobar que se esta en la rama que es:

git branch --show-current

4. Instalar las dependencias

Desde la raíz del proyecto ejecutar:

npm ci

Este comando instala las dependencias declaradas en package.json y utiliza package-lock.json para mantener las versiones registradas cuando corresponda

5. Ejecutar la lp

Inicia el servidor de desarrollo con:

npm run dev -- --open /doch.html

Vite mostrará la dirección local para visualizar la página. Si no se abre automáticamente, copia la URL de 
la terminal y ábrela en tu navegador

Para detener el servidor,  Ctrl + C en la terminal

6. Actualizar el proyecto

Si ya clonaste el repositorio y quieres obtener los cambios de tu rama:

git switch doch-hudson
git pull

7. Si se modificaron las dependencias, ejecutar de nuevo:

npm install
