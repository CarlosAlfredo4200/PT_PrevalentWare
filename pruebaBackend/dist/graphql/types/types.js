const TypeDef = `
 
  type User {
    id: ID!
    name: String!
    email: String!
     
  }

  
  type Country {
    id: ID!
    name: String!
  }

  type UserMonitoring {
    id: ID!
    usage: Int!
    description: String!
    userId: ID!
    createdAt: String! # Assuming createdAt will be returned as a string
  }

  type CountUserTop {
    id: ID!
    userId: ID!
    userName: String! # Nueva propiedad para almacenar el nombre del usuario
    description: String!
    numberRecords: String!
  }

  type TopUser {
    id: ID!
    userId: ID!
  }
`;
export { TypeDef };
