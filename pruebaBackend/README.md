
# Prueba Técnica para la Posición de Ingeniero Backend

## Introducción

**Contexto:**

Para esta prueba técnica, se requiere construir el backend para una aplicación que pretende monitorear el comportamiento de los usuarios en una plataforma.  Todo esto se llevará a cabo a través de un servidor GraphQL utilizando Node.js y una base 
de datos Postgres.

**Requisitos del Servidor GraphQL:**

Autenticación basada en Tokens:
Cada Query a tu servidor GraphQL debe incluir un token en los headers. El token debe validarse contra la 
tabla Session en la base de datos para recuperar el user asociado y determinar su role. Para efectos de 
esta prueba técnica, estos tokens no tienen vencimiento y puedes usar cualquiera de los tokens que ya 
tenemos creados para que hagas pruebas. No debes crear nuevos tokens.
Control por roles:
 -   Un User solo puede ver sus propios datos, incluidos sus Country asociados y UserMonitoring.
-   Un Manager puede ver todos los users de todos los countries, pero no puede acceder a 
UserMonitoring.
-   Un Admin puede acceder a todos los datos


## Queries desde apollo server:

  
 
- Ver todos los usuarios: **allUsers** 
- Ver usuario por parametro: **userByEmail**.  
 (Parametros : Variable : {
  "email": "correo.@correo.com",
}
)
 
- Ver todas las ciudades, sólo si los usuarios tiene rol de  (Admin o Manager): **allCountriesForAdminAndManager**

- Ver todos los UserMonitoring de un usuario en un rango de tiempo: **userMonitoringsByEmailAndTimeRange**.  
(Parametros : Variable :{
  "email": "correo.@correo.com",
  "startTime": "2023-01-01T00:00:00.000Z",
  "endTime": "2023-12-31T23:59:59.999Z"
}
)
- Ver los tres usuarios con más registros en la tabla UserMonitoring en un rango de tiempo determinado
: **getTopUsersInTimeRange**.  
(Parametros : Variable :{
  "startTime": "2023-01-01T00:00:00.000Z",
  "endTime": "2023-12-31T23:59:59.999Z"
})
- Ver los tres usuarios principales por un tipo específico de uso, en 
un Country específico y dentro de un rango de tiempo
: **getTopUsersByTypeAndCountry**.  
(Parametros : Variable :{
   "type": "share",
  "countryId": "cl8x4en5h005elk553gl0mq0q",
  "startTime": "2023-01-01T00:00:00.000Z",
  "endTime": "2023-12-31T23:59:59.999Z",
})

-  Otros :Manejo de Errores, Paginación, Consulta con raw SQL.



## Objetivos cumplidos

-   Todos los queries.
-   Tecnologías aplicadas : NodeJS, Apollo server, Prisma como ORM, Prisma client, Base de datos en Postgres.
- Configuración GraphQ.
- Manejo de prisma y apollo server.
-   Conexión a base de datos PostgreSQL



## Dificultades

No logré aplicar las pruebas unitarias debido a conflictos de módulos de TS.

Además, por temas de tiempo y desconocimiento no pude realizar la funcionalidad de autenticación lo cual entra en mis siguientes metas.

Y por último, los temas de despliegue AWS y Docker lo desconozco y no alcance a entenderlo en el tiempo de la prueba.  


## Logros

Construir el backend para una aplicación que pretende monitorear
el comportamiento de los usuarios en una plataforma, registrar sus interacciones y asociarlos a diferentes 
países. Además, en función del rol de cada usuario, se determinarán diferentes niveles de acceso a la 
información. Todo esto se llevará a cabo a través de un servidor GraphQL utilizando Node.js y una base 
de datos Postgres

## Logros técnicos


-   Aprender apollo server y consultas con prisma.
-   Usa Prisma para ejecutar un introspect al esquema de la base de 
datos.
-   Bucar mejorar tecnicas de código limpio.
- Intruduccion a TYpescript.

## Instrucciones para la ejecusion

-   descargar el repositorio.
-   Restaura los módulos de node Js : **npm i**
-   Para ejecutar desde la terminal usa : **npm start**.
- Cuando el servidor este corriendo, ve al navegador y usa : http://localhost:4000  para entrar en la interfase de apollo server.
- Una vez allí en operation usando (Ctrl barra) puedes buscar  la consulta que necesitas anteriormente mencionadas.

- Si necesitas parámetros en los ejemplos mencionados tendrás la guía según la necesidad.


Infraestructura:

-   NodeJS.
-   Apollo server
-   Prisma como ORM
-   Prisma client
-   Base de datos en Postgres
-   TypeScript.



## Autor
Carlos Alfredo montoya - [Github](https://github.com/CarlosAlfredo4200). 
