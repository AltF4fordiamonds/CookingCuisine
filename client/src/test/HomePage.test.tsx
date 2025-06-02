
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MockedProvider } from '@apollo/client/testing';
import HomePage from '../pages/HomePage';

// Mock wouter
vi.mock('wouter', () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <MockedProvider mocks={[]} addTypename={false}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </MockedProvider>
  );
};

describe('HomePage', () => {
  it('renders hero section with correct title', () => {
    render(<HomePage />, { wrapper: createWrapper() });
    
    expect(screen.getByText(/Добре дошли в/)).toBeInTheDocument();
    expect(screen.getByText(/ЖиГулИ рецепти/)).toBeInTheDocument();
  });

  it('renders Spoonacular section', () => {
    render(<HomePage />, { wrapper: createWrapper() });
    
    expect(screen.getByText(/Международни рецепти от Spoonacular/)).toBeInTheDocument();
  });

  it('renders search and add recipe buttons', () => {
    render(<HomePage />, { wrapper: createWrapper() });
    
    expect(screen.getByText(/Разгледай рецепти/)).toBeInTheDocument();
    expect(screen.getByText(/Добави рецепта/)).toBeInTheDocument();
  });
});
