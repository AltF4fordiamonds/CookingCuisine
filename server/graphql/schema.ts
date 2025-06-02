
import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type SpoonacularRecipe {
    id: Int!
    title: String!
    image: String
    summary: String
    instructions: String
    readyInMinutes: Int
    servings: Int
    ingredients: [SpoonacularIngredient!]!
  }

  type SpoonacularIngredient {
    id: Int!
    name: String!
    amount: Float!
    unit: String!
  }

  type Query {
    searchSpoonacularRecipes(query: String!, number: Int = 12): [SpoonacularRecipe!]!
    getSpoonacularRecipe(id: Int!): SpoonacularRecipe
  }

  type Mutation {
    saveSpoonacularRecipe(spoonacularId: Int!): String!
  }
`;
