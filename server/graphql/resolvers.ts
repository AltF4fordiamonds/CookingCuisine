
import axios from 'axios';

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
    searchSpoonacularRecipes: async (_: any, { query, number }: { query: string; number: number }) => {
      try {
        const response = await axios.get(`${SPOONACULAR_BASE_URL}/complexSearch`, {
          params: {
            apiKey: SPOONACULAR_API_KEY,
            query,
            number,
            addRecipeInformation: true,
            fillIngredients: true,
          },
        });

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
};
