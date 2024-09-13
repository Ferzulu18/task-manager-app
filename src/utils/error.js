import { message } from 'antd';

// Diccionario de mensajes relacionados con excepciones específicas del sistema.
// Las claves son códigos de error que representan problemas al interactuar con tareas, usuarios, y otros procesos.
const exceptMessages = {
  EXC001: 'Error consultando las tareas',
  EXC002: 'Error creando la tarea',
  EXC003: 'Error modificando la tarea',
  EXC004: 'Error eliminando la tarea',
  EXC005: 'Error modificando estado de la tarea',
  EXC006: 'Error al verificar el límite de tareas',
  EXC007: 'Error consultando los usuarios',
  EXC008: 'Error consultando el usuario',
  EXC009: 'Error creando el usuario',
  EXC010: 'Error modificando el usuario',
  EXC011: 'Error eliminando el usuario',
  EXC012: 'Error modificando password del usuario',
  EXC013: 'Error al enviar el correo de recuperación',
  EXC014: 'Error creando token de recuperación',
};

// Diccionario de mensajes de error que se muestran en la interfaz cuando ocurren fallos comunes.
// Estos errores están relacionados con el envío de formularios, autenticación y operaciones con tareas y usuarios.
const errorMessages = {
  ERR001:
    'Hubo un error al enviar tu mensaje. Por favor, intenta de nuevo más tarde.',
  ERR002: 'Error en el registro',
  ERR003: 'Credenciales inválidas',
  ERR004: 'Error al iniciar sesión',
  ERR005: 'Error al enviar el correo de recuperación',
  ERR006: 'Error al restablecer la contraseña',
  ERR007: 'No se pudieron obtener las tareas',
  ERR008: 'No se pudieron obtener los usuarios',
  ERR009: 'No se pudieron refrescar las tareas',
  ERR010: 'El título es obligatorio',
  ERR011: 'No se pudo crear o modificar la tarea',
  ERR012: 'No se pudo eliminar la tarea',
  ERR013: 'Has alcanzado el límite máximo de tareas',
  ERR014: 'No se pudo actualizar el estado de la tarea',
};

// Diccionario de mensajes de notificación para acciones exitosas.
// Se muestran cuando alguna operación como crear, modificar o eliminar datos se realiza correctamente.
const notificationMessages = {
  INF001: 'Tu mensaje ha sido enviado con éxito. ¡Gracias por contactarnos!',
  INF002: 'Registro exitoso',
  INF003: 'Inicio de sesión exitoso',
  INF004: 'Correo de recuperación enviado, revisa tu bandeja de entrada',
  INF005: 'Contraseña restablecida con éxito',
  INF006: 'Tarea modificada con éxito',
  INF007: 'Tarea creada con éxito',
  INF008: 'Tarea eliminada con éxito',
  INF009: 'Estado de la tarea actualizado con éxito',
};

// Función que obtiene un mensaje en base al tipo (except, error, notification) y un código.
// Si el código no existe, retorna un mensaje genérico.
function getMessage(type, code) {
  if (type === 'except') {
    return exceptMessages[code] || 'Se ha producido un error inesperado.';
  } else if (type === 'error') {
    return errorMessages[code] || 'Se ha producido un error inesperado.';
  } else if (type === 'notification') {
    return notificationMessages[code] || 'Se ha producido una notificación.';
  } else {
    return 'Tipo de mensaje desconocido.';
  }
}

// Maneja las excepciones lanzando un error con el mensaje correspondiente.
// Si no se proporciona un código de excepción, se lanza el error original.
export const handleExcept = (exceptCode, error) => {
  if (!exceptCode) {
    throw error;
  }
  const messageValue = getMessage('except', exceptCode);
  console.error(`${messageValue}:`, error); // Muestra el error en consola
  throw new Error(messageValue); // Lanza un nuevo error con el mensaje adecuado
};

// Maneja errores comunes mostrando un mensaje de error en la interfaz.
export const handleError = (errorCode) => {
  const messageValue = getMessage('error', errorCode);
  message.error(messageValue); // Usa la librería 'antd' para mostrar el mensaje de error
};

// Maneja notificaciones de éxito mostrando un mensaje de confirmación en la interfaz.
export const handleSuccess = (infoCode) => {
  const messageValue = getMessage('notification', infoCode);
  message.success(messageValue); // Usa 'antd' para mostrar el mensaje de éxito
};
