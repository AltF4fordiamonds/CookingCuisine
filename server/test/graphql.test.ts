
import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { resolvers } from '../graphql/resolvers';

// Mock axios
vi.mock('axios');
const mockedAxios = vi.mocked(axios);

describe('GraphQL Resolvers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('searchSpoonacularRecipes', () => {
    it('should fetch and translate recipes', async () => {
      const mockSpoonacularResponse = {
        data: {
          results: [
            {
              id: 1,
              title: 'Test Recipe',
              image: 'https://example.com/image.jpg',
              summary: 'Test summary',
              instructions: 'Test instructions',
              readyInMinutes: 30,
              servings: 4,
              extendedIngredients: [
                {
                  id: 1,
                  name: 'test ingredient',
                  amount: 100,
                  unit: 'grams',
                },
              ],
            },
          ],
        },
      };

      const mockTranslationResponse = {
        data: {
          responseData: {
            translatedText: 'Тестов превод',
          },
        },
      };

      mockedAxios.get
        .mockResolvedValueOnce(mockSpoonacularResponse) // Spoonacular API call
        .mockResolvedValue(mockTranslationResponse); // Translation API calls

      const result = await resolvers.Query.searchSpoonacularRecipes(
        {},
        { query: 'pasta', number: 1 }
      );

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
      expect(result[0].title).toBe('Тестов превод');
    });

    it('should handle API errors gracefully', async () => {
      mockedAxios.get.mockRejectedValue(new Error('API Error'));

      await expect(
        resolvers.Query.searchSpoonacularRecipes({}, { query: 'pasta', number: 1 })
      ).rejects.toThrow('Failed to fetch recipes from Spoonacular');
    });
  });
});
