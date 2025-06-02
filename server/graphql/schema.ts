
import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type Recipe {
    id: ID!
    title: String!
    description: String!
    category: String!
    prepTime: Int!
    cookTime: Int!
    servings: Int!
    image: String
    ingredients: [Ingredient!]!
    instructions: [Instruction!]!
  }

  type Ingredient {
    name: String!
    amount: String!
    unit: String!
  }

  type Instruction {
    text: String!
  }

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
    recipes: [Recipe!]!
    recipe(id: ID!): Recipe
    searchSpoonacularRecipes(query: String!, number: Int = 12): [SpoonacularRecipe!]!
    getSpoonacularRecipe(id: Int!): SpoonacularRecipe
  }

  type Mutation {
    createRecipe(
      title: String!
      description: String!
      category: String!
      prepTime: Int!
      cookTime: Int!
      servings: Int!
      image: String
      ingredients: [IngredientInput!]!
      instructions: [InstructionInput!]!
    ): Recipe!
    updateRecipe(
      id: ID!
      title: String
      description: String
      category: String
      prepTime: Int
      cookTime: Int
      servings: Int
      image: String
      ingredients: [IngredientInput!]
      instructions: [InstructionInput!]
    ): Recipe!
    deleteRecipe(id: ID!): Recipe!
    saveSpoonacularRecipe(spoonacularId: Int!): String!
  }

  input IngredientInput {
    name: String!
    amount: String!
    unit: String!
  }

  input InstructionInput {
    text: String!
  }
`;
