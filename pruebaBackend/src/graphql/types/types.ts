const TypeDef = `
  # Definición del tipo de objeto 'User'
  type User {
    id: ID! # Identificador único del usuario
    name: String! # Nombre del usuario
    email: String! # Correo electrónico del usuario
  }

  # Definición del tipo de objeto 'Country'
  type Country {
    id: ID! # Identificador único del país
    name: String! # Nombre del país
  }

  # Definición del tipo de objeto 'UserMonitoring'
  type UserMonitoring {
    id: ID! # Identificador único del monitoreo de usuario
    usage: Int! # Uso del monitoreo
    description: String! # Descripción del monitoreo
    userId: ID! # Identificador único del usuario asociado al monitoreo
    createdAt: String! # Fecha y hora de creación del monitoreo, devuelta como cadena de texto
  }

  # Definición del tipo de objeto 'CountUserTop'
  type CountUserTop {
    id: ID! # Identificador único del conteo del usuario top
    userId: ID! # Identificador único del usuario
    userName: String! # Nombre del usuario (nueva propiedad para almacenar el nombre del usuario)
    description: String! # Descripción del usuario top
    numberRecords: String! # Número de registros del usuario top, devuelto como cadena de texto
  }

  # Definición del tipo de objeto 'TopUser'
  type TopUser {
    id: ID! # Identificador único del usuario top
    userId: ID! # Identificador único del usuario
  }
`;

export { TypeDef };
