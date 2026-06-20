# Proyecto-React-Typescript_FrontEnd

*Contexto para la tercera etapa (Intranet React + TypeScript)*
Frenesí Papelería necesita una herramienta de gestión interna que permita a la dueña administrar el inventario, procesar pedidos, atender consultas y gestionar usuarios de forma centralizada y ágil. Actualmente, estas tareas se realizan manualmente (revisión de mensajes, actualización de stock en archivos externos), lo que genera demoras, errores y sobrecarga de trabajo. La intranet propuesta automatizará estos procesos y dará trazabilidad a las operaciones del negocio, conectando directamente con los datos generados por el sitio web público (carrito de compras y formulario de contacto).

Necesidad digital identificada
--------
La dueña necesita una plataforma que le permita:

-Gestionar el catálogo de productos (crear, editar, eliminar y buscar) en tiempo real.

-Visualizar y actualizar el estado de los pedidos realizados por los clientes (pendiente, enviado, entregado).

-Revisar y eliminar las consultas del formulario de contacto.

-Administrar los usuarios internos que tendrán acceso al sistema.

-Tener un dashboard con indicadores clave (productos totales, pedidos pendientes, consultas no leídas).

-Todo esto en una interfaz protegida por login, con persistencia de datos y navegación fluida.


Cambios y mejoras respecto a la segunda etapa
----
-Migración a React + TypeScript: Se reemplaza el HTML/CSS/JS estático por una SPA con componentes modulares, tipado fuerte y estado controlado.

-Rutas protegidas y autenticación: Se implementa login simulado con credenciales predefinidas, contexto global para el usuario (useContext) y redirección automática al login si no hay sesión activa.

-Módulos funcionales (CRUD): Se desarrollan cuatro módulos clave (Productos, Pedidos, Consultas, Usuarios), cada uno con listado, búsqueda, creación, edición y eliminación. Al menos una ruta dinámica (useParams) muestra el detalle de un registro.

-Persistencia con localStorage: Se mantiene el uso de localStorage para guardar datos (como en la ES2), pero ahora con funciones tipadas y reutilizables, asegurando que la información persista entre recargas.

-Filtros en tiempo real: Cada listado incluye un campo de búsqueda que filtra los registros mientras el usuario escribe, sin recargar la página, replicando la experiencia del filtro de novedades de la ES2.

-Dashboard y estadísticas: Se añade una página de inicio con resumen de métricas (productos, pedidos, consultas, usuarios) para una visión rápida del negocio.

-Diseño consistente y modo oscuro: Se conserva la identidad visual de Frenesí (colores, iconos) y el modo oscuro/claro implementado en la ES2, ahora gestionado desde React con localStorage.

Inicializar el proyecto
----------
En CMD, la carpeta del proyecto raiz:
-npm install / yarn install
-npm run dev / yarn dev

Listado de secciones que tendrá el sitio web.
--------------------------
-Inicio
-Nosotros
-Novedades
-Carrito
-Correo ayuda
-Panel de administrador

Integrantes del grupo con sus respectivos roles.
------------------------------------
-Nayaret Larrondo
-Fram Salinas
-Nilson Oyarce
