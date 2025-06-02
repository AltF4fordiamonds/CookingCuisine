
import { gql } from '@apollo/client';

export const SEARCH_SPOONACULAR_RECIPES = gql`
  query SearchSpoonacularRecipes($query: String!, $number: Int) {
    searchSpoonacularRecipes(query: $query, number: $number) {
      id
      title
      image
      summary
      readyInMinutes
      servings
      ingredients {
        id
        name
        amount
        unit
      }
    }
  }
`;

export const GET_SPOONACULAR_RECIPE = gql`
  query GetSpoonacularRecipe($id: Int!) {
    getSpoonacularRecipe(id: $id) {
      id
      title
      image
      summary
      instructions
      readyInMinutes
      servings
      ingredients {
        id
        name
        amount
        unit
      }
    }
  }
`;

export interface SpoonacularRecipe {
  id: number;
  title: string;
  image?: string;
  summary?: string;
  instructions?: string;
  readyInMinutes?: number;
  servings?: number;
  ingredients: SpoonacularIngredient[];
}

export interface SpoonacularIngredient {
  id: number;
  name: string;
  amount: number;
  unit: string;
}
