### **Manual de Instalación de Node.js en Ubuntu 20.04**

#### **Paso 1: Instalar NVM (Node Version Manager)**

NVM es una herramienta que permite administrar múltiples versiones de Node.js en un mismo sistema.

1. **Verificar si NVM está instalado:**
   Ejecuta el siguiente comando para verificar si NVM ya está instalado:

   ```bash
   command -v nvm
   ```

   - Si el comando no devuelve nada, NVM no está instalado. Continúa con la instalación en el siguiente paso.
   - Si NVM está instalado, se mostrará su ruta de instalación. Puedes optar por reinstalarlo o continuar con la versión existente.

2. **Instalar NVM 0.39.4:**
   Si NVM no está instalado, o si prefieres reinstalarlo, sigue estos pasos:

   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.4/install.sh | bash
   ```

3. **Cargar NVM en la sesión actual:**
   Después de la instalación, carga NVM en la sesión actual:

   ```bash
   source ~/.nvm/nvm.sh
   ```

4. **Verificar la instalación de NVM:**
   Verifica que NVM se haya instalado correctamente ejecutando:
   ```bash
   nvm --version
   ```
   Deberías ver la versión `0.39.4` u otra versión dependiendo de si ya estaba instalado.

#### **Paso 2: Instalar NPM 10.2.4**

NPM (Node Package Manager) viene incluido con Node.js, pero puedes instalar o reinstalar la versión específica 10.2.4.

1. **Instalar o reinstalar NPM 10.2.4:**
   Primero, asegúrate de tener NVM cargado en tu terminal. Luego, ejecuta:

   ```bash
   nvm install-latest-npm
   ```

2. **Verificar la versión de NPM:**
   ```bash
   npm --version
   ```
   Asegúrate de que la versión instalada sea la `10.2.4`. Si necesitas una versión diferente, puedes actualizarla o reinstalarla con:
   ```bash
   npm install -g npm@10.2.4
   ```

#### **Paso 3: Instalar Node.js 20.11.0**

Node.js es el entorno de ejecución para JavaScript que se ejecuta en el servidor.

1. **Instalar Node.js 20.11.0 con NVM:**

   ```bash
   nvm install 20.11.0
   ```

2. **Establecer Node.js 20.11.0 como la versión predeterminada:**

   ```bash
   nvm alias default 20.11.0
   ```

3. **Verificar la instalación de Node.js:**
   ```bash
   node --version
   ```
   Asegúrate de que la versión instalada sea la `20.11.0`.

#### **Paso 4: Cambiar entre versiones de Node.js**

Si tienes varias versiones de Node.js instaladas, puedes cambiar entre ellas usando NVM.

1. **Ver las versiones de Node.js instaladas:**

   ```bash
   nvm ls
   ```

2. **Cambiar a una versión específica:**
   Por ejemplo, para cambiar a Node.js 20.11.0:

   ```bash
   nvm use 20.11.0
   ```

3. **Verificar que el cambio se haya realizado correctamente:**
   ```bash
   node --version
   ```
   Deberías ver la versión `20.11.0` activa.

#### **Paso 5: Configurar variables de entorno en `.bashrc`**

Para asegurarte de que NVM se carga correctamente en cada sesión de terminal:

1. **Editar el archivo `.bashrc`:**

   ```bash
   nano ~/.bashrc
   ```

2. **Añadir las siguientes líneas al final del archivo:**

   ```bash
   export NVM_DIR="$HOME/.nvm"
   [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # Esto carga NVM
   [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion" # Esto carga bash_completion (opcional)
   ```

3. **Recargar `.bashrc` para aplicar los cambios:**
   ```bash
   source ~/.bashrc
   ```

#### **Paso 6: Seguridad y Buenas Prácticas**

1. **Mantén tus paquetes actualizados:** Revisa regularmente las versiones de Node.js y NPM para garantizar que estás utilizando versiones seguras.
   ```bash
   npm outdated -g
   ```
2. **Monitorea vulnerabilidades de seguridad:** Utiliza herramientas como `npm audit` para detectar vulnerabilidades en tus dependencias:
   ```bash
   npm audit
   ```
