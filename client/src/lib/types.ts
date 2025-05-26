export interface Ingredient {
  amount: string;
  unit: string;
  name: string;
}

export interface Instruction {
  text: string;
}

export interface RecipeFormData {
  title: string;
  description: string;
  category: string;
  prepTime?: number;
  cookTime: number;
  servings: number;
  image?: string;
  ingredients: Ingredient[];
  instructions: Instruction[];
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const RECIPE_CATEGORIES = [
  { value: "main", label: "Основни ястия" },
  { value: "salads", label: "Салати" },
  { value: "desserts", label: "Десерти" },
  { value: "soups", label: "Супи" },
  { value: "appetizers", label: "Предястия" },
] as const;

export const CONTACT_SUBJECTS = [
  { value: "general", label: "Общ въпрос" },
  { value: "recipe", label: "Въпрос за рецепта" },
  { value: "technical", label: "Техническа поддръжка" },
  { value: "suggestion", label: "Предложение" },
  { value: "partnership", label: "Партньорство" },
] as const;
