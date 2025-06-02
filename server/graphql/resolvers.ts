
import axios from 'axios';
import { storage } from '../storage';
import type { Recipe } from '@shared/schema';

const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;
const SPOONACULAR_BASE_URL = 'https://api.spoonacular.com/recipes';

// Функция за превод на български
async function translateToBulgarian(text: string): Promise<string> {
  try {
    // Използваме Google Translate API или друг преводач
    // За този пример ще използваме MyMemory Translation API (безплатен)
    const response = await axios.get(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|bg`
    );
    
    if (response.data?.responseData?.translatedText) {
      return response.data.responseData.translatedText;
    }
    return text; // Връщаме оригиналния текст ако преводът не е успешен
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
}

export const resolvers = {
  Query: {
    recipes: async () => {
      return await storage.getRecipes();
    },
    recipe: async (_: any, { id }: { id: string }) => {
      return await storage.getRecipe(id);
    },
    searchSpoonacularRecipes: async (_: any, { query, number }: { query: string; number: number }) => {
      try {
        console.log('Searching Spoonacular with:', { query, number, apiKey: SPOONACULAR_API_KEY ? 'present' : 'missing' });
        
        const response = await axios.get(`${SPOONACULAR_BASE_URL}/complexSearch`, {
          params: {
            apiKey: SPOONACULAR_API_KEY,
            query,
            number,
            addRecipeInformation: true,
            fillIngredients: true,
          },
        });

        console.log('Spoonacular response:', response.data);

        const recipes = await Promise.all(
          response.data.results.map(async (recipe: any) => ({
            id: recipe.id,
            title: await translateToBulgarian(recipe.title),
            image: recipe.image,
            summary: await translateToBulgarian(recipe.summary?.replace(/<[^>]*>/g, '') || ''),
            instructions: await translateToBulgarian(recipe.instructions?.replace(/<[^>]*>/g, '') || ''),
            readyInMinutes: recipe.readyInMinutes,
            servings: recipe.servings,
            ingredients: await Promise.all(
              (recipe.extendedIngredients || []).map(async (ing: any) => ({
                id: ing.id,
                name: await translateToBulgarian(ing.name),
                amount: ing.amount,
                unit: await translateToBulgarian(ing.unit || ''),
              }))
            ),
          }))
        );

        return recipes;
      } catch (error) {
        console.error('Spoonacular API error:', error);
        throw new Error('Failed to fetch recipes from Spoonacular');
      }
    },

    getSpoonacularRecipe: async (_: any, { id }: { id: number }) => {
      try {
        const response = await axios.get(`${SPOONACULAR_BASE_URL}/${id}/information`, {
          params: {
            apiKey: SPOONACULAR_API_KEY,
            includeNutrition: false,
          },
        });

        const recipe = response.data;
        return {
          id: recipe.id,
          title: await translateToBulgarian(recipe.title),
          image: recipe.image,
          summary: await translateToBulgarian(recipe.summary?.replace(/<[^>]*>/g, '') || ''),
          instructions: await translateToBulgarian(recipe.instructions?.replace(/<[^>]*>/g, '') || ''),
          readyInMinutes: recipe.readyInMinutes,
          servings: recipe.servings,
          ingredients: await Promise.all(
            (recipe.extendedIngredients || []).map(async (ing: any) => ({
              id: ing.id,
              name: await translateToBulgarian(ing.name),
              amount: ing.amount,
              unit: await translateToBulgarian(ing.unit || ''),
            }))
          ),
        };
      } catch (error) {
        console.error('Spoonacular API error:', error);
        throw new Error('Failed to fetch recipe from Spoonacular');
      }
    },
  },

  Mutation: {
    createRecipe: async (_: any, args: any) => {
      return await storage.createRecipe(args);
    },
    updateRecipe: async (_: any, { id, ...updates }: any) => {
      return await storage.updateRecipe(id, updates);
    },
    deleteRecipe: async (_: any, { id }: { id: string }) => {
      return await storage.deleteRecipe(id);
    },
    saveSpoonacularRecipe: async (_: any, { spoonacularId }: { spoonacularId: number }) => {
      try {
        // Получаваме пълната информация за рецептата от Spoonacular
        const response = await axios.get(`${SPOONACULAR_BASE_URL}/${spoonacularId}/information`, {
          params: {
            apiKey: SPOONACULAR_API_KEY,
            includeNutrition: false,
          },
        });

        const recipe = response.data;
        
        // Преобразуваме съставките в правилния формат
        const ingredients = await Promise.all(
          (recipe.extendedIngredients || []).map(async (ing: any) => ({
            name: await translateToBulgarian(ing.name),
            amount: ing.amount.toString(),
            unit: await translateToBulgarian(ing.unit || ''),
          }))
        );

        // Преобразуваме инструкциите
        const instructions = recipe.analyzedInstructions?.[0]?.steps || [];
        const formattedInstructions = await Promise.all(
          instructions.map(async (step: any) => ({
            text: await translateToBulgarian(step.step),
          }))
        );

        // Определяме категорията на базата на dish types
        let category = 'main';
        if (recipe.dishTypes?.includes('salad')) category = 'salads';
        else if (recipe.dishTypes?.includes('dessert')) category = 'desserts';
        else if (recipe.dishTypes?.includes('soup')) category = 'soups';
        else if (recipe.dishTypes?.includes('appetizer')) category = 'appetizers';

        // Запазваме рецептата в базата данни
        const newRecipe: Omit<Recipe, 'id'> = {
          title: await translateToBulgarian(recipe.title),
          description: await translateToBulgarian(recipe.summary?.replace(/<[^>]*>/g, '') || ''),
          category,
          prepTime: recipe.preparationMinutes || 0,
          cookTime: recipe.readyInMinutes || 30,
          servings: recipe.servings || 4,
          image: recipe.image || '',
          ingredients,
          instructions: formattedInstructions.length > 0 ? formattedInstructions : [
            { text: await translateToBulgarian(recipe.instructions?.replace(/<[^>]*>/g, '') || 'Инструкции не са налични') }
          ],
        };

        await storage.createRecipe(newRecipe);
        return 'Рецептата беше запазена успешно!';
      } catch (error) {
        console.error('Error saving Spoonacular recipe:', error);
        throw new Error('Грешка при запазването на рецептата');
      }
    },
  },
};
