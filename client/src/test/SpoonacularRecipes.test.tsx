
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MockedProvider } from '@apollo/client/testing';
import SpoonacularRecipes from '../components/SpoonacularRecipes';
import { SEARCH_SPOONACULAR_RECIPES } from '../lib/graphqlClient';

const mockRecipes = [
  {
    id: 1,
    title: 'Тестова рецепта',
    image: 'https://example.com/image.jpg',
    summary: 'Тестово описание',
    readyInMinutes: 30,
    servings: 4,
    ingredients: [
      {
        id: 1,
        name: 'Тестова съставка',
        amount: 100,
        unit: 'грама',
      },
    ],
  },
];

const mocks = [
  {
    request: {
      query: SEARCH_SPOONACULAR_RECIPES,
      variables: {
        query: 'pasta',
        number: 12,
      },
    },
    result: {
      data: {
        searchSpoonacularRecipes: mockRecipes,
      },
    },
  },
];

describe('SpoonacularRecipes', () => {
  it('renders search form', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <SpoonacularRecipes />
      </MockedProvider>
    );

    expect(screen.getByPlaceholderText(/Търсете международни рецепти/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Търси/ })).toBeInTheDocument();
  });

  it('performs search and displays results', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <SpoonacularRecipes />
      </MockedProvider>
    );

    const searchInput = screen.getByPlaceholderText(/Търсете международни рецепти/);
    const searchButton = screen.getByRole('button', { name: /Търси/ });

    fireEvent.change(searchInput, { target: { value: 'pasta' } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText('Тестова рецепта')).toBeInTheDocument();
    });
  });
});
