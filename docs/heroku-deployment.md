# Despliegue de la Aplicación en Heroku

Este manual proporciona una guía paso a paso para desplegar tu aplicación en Heroku, utilizando los comandos estándar necesarios. Asegúrate de tener una cuenta en Heroku y el [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) instalado en tu máquina.

## 1. Iniciar sesión en Heroku

Primero, debes iniciar sesión en tu cuenta de Heroku utilizando el siguiente comando:

```
heroku login
```

Este comando te pedirá que abras un navegador para autenticarte en Heroku. Una vez autenticado, podrás usar los comandos de Heroku en la terminal.

## 2. Crear una nueva aplicación en Heroku

Crea una nueva aplicación en Heroku con el siguiente comando:

```
heroku create
```

Heroku generará un nombre único para tu aplicación, por ejemplo, `powerful-retreat-17804`.

## 3. Verificar aplicaciones existentes

Para verificar las aplicaciones creadas en tu cuenta de Heroku, utiliza el comando:

```
heroku apps
```

La salida incluirá la aplicación recién creada:

```
powerful-retreat-17804
```

## 4. Configurar el repositorio Git remoto para Heroku

Ahora, configura el repositorio remoto de Heroku en tu proyecto local para que puedas hacer despliegues directamente desde Git:

```
heroku git:remote -a powerful-retreat-17804
```

## 5. Configurar variables de entorno

Configura las variables de entorno necesarias para tu aplicación. Estas variables son esenciales para que tu aplicación funcione correctamente en Heroku.

1. Establece la URL de tu API:

   ```
   heroku config:set REACT_APP_API_URL=https://powerful-retreat-17804-c0d7cc9439cd.herokuapp.com
   ```

2. Establece el token de tu servicio de email (reemplaza `<your-mailtrap-token>` con tu token real):
   ```
   heroku config:set REACT_APP_MAIL_TOKEN=<your-mailtrap-token>
   ```

## 6. Verificar las variables de entorno configuradas

Para verificar las variables de entorno configuradas, utiliza el comando:

```
heroku config
```

La salida debería incluir lo siguiente:

```
REACT_APP_API_URL=https://powerful-retreat-17804-c0d7cc9439cd.herokuapp.com`
REACT_APP_MAIL_TOKEN=<your-mailtrap-token>`
```

## 7. Desplegar la aplicación

Finalmente, para desplegar tu aplicación en Heroku, usa el siguiente comando para hacer push de tu código al repositorio remoto de Heroku:

```
git push heroku master
```

Este comando desplegará tu aplicación y la hará accesible a través de la URL proporcionada por Heroku.

## 8. Ver los logs de la aplicación

Para monitorear los logs de tu aplicación en tiempo real, utiliza el siguiente comando:

```
heroku logs --tail
```

Este comando te permitirá ver cualquier mensaje o error generado por la aplicación en Heroku, ayudándote a diagnosticar y solucionar problemas.

¡Y eso es todo! Ahora tu aplicación debería estar desplegada y funcionando en Heroku.
