import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Clock, Users, ArrowLeft, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import type { Recipe } from "@shared/schema";

export default function RecipeDetailPage() {
  const [, params] = useRoute("/recipe/:id");
  const recipeId = params?.id ? parseInt(params.id) : null;

  const { data: recipe, isLoading, error } = useQuery<Recipe>({
    queryKey: ["/api/recipes", recipeId],
    queryFn: async () => {
      if (!recipeId) throw new Error("No recipe ID provided");
      const response = await fetch(`/api/recipes/${recipeId}`);
      if (!response.ok) throw new Error("Failed to fetch recipe");
      return response.json();
    },
    enabled: !!recipeId,
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Skeleton className="h-8 w-32 mb-4" />
          <Skeleton className="h-12 w-3/4 mb-2" />
          <Skeleton className="h-6 w-full mb-6" />
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <Skeleton className="w-full h-64 rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-28" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center">
        <h1 className="text-2xl font-playfair font-bold text-gray-800 mb-4">
          Рецептата не е намерена
        </h1>
        <p className="text-gray-600 mb-6">
          Съжаляваме, но тази рецепта не съществува или е била премахната.
        </p>
        <Link href="/recipes">
          <Button className="bg-warm-orange hover:bg-deep-amber">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Обратно към рецептите
          </Button>
        </Link>
      </div>
    );
  }

  const categoryLabels: Record<string, string> = {
    main: "Основни ястия",
    salads: "Салати", 
    desserts: "Десерти",
    soups: "Супи",
    appetizers: "Предястия",
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      {/* Back Button */}
      <div className="mb-8">
        <Link href="/recipes">
          <Button variant="ghost" className="text-warm-orange hover:text-deep-amber">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Обратно към рецептите
          </Button>
        </Link>
      </div>

      {/* Recipe Header */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="secondary" className="bg-warm-orange text-white">
            {categoryLabels[recipe.category] || recipe.category}
          </Badge>
        </div>
        <h1 className="text-4xl md:text-5xl font-playfair font-bold text-gray-800 mb-4">
          {recipe.title}
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          {recipe.description}
        </p>
        <div className="flex items-center gap-6 text-gray-600">
          {recipe.prepTime && (
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              <span>Подготовка: {recipe.prepTime} мин</span>
            </div>
          )}
          <div className="flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            <span>Готвене: {recipe.cookTime} мин</span>
          </div>
          <div className="flex items-center">
            <Users className="w-5 h-5 mr-2" />
            <span>{recipe.servings} порции</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recipe Image */}
        <div className="lg:col-span-2">
          {recipe.image && (
            <img 
              src={recipe.image} 
              alt={recipe.title}
              className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg mb-8"
            />
          )}
          
          {/* Instructions */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-6">
                Стъпки за приготвяне
              </h2>
              <div className="space-y-6">
                {recipe.instructions.map((instruction, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-warm-orange text-white rounded-full flex items-center justify-center font-semibold text-sm">
                      {index + 1}
                    </div>
                    <p className="text-gray-700 leading-relaxed pt-1">
                      {instruction.text}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Ingredients */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-playfair font-bold text-gray-800 mb-4">
                Съставки
              </h2>
              <ul className="space-y-3">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                    <span className="text-gray-700">{ingredient.name}</span>
                    <span className="text-warm-orange font-medium">
                      {ingredient.amount} {ingredient.unit}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Recipe Info */}
          <Card className="bg-warm-gray">
            <CardContent className="p-6">
              <h3 className="text-lg font-playfair font-bold text-gray-800 mb-4">
                Информация за рецептата
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Категория:</span>
                  <span className="font-medium">{categoryLabels[recipe.category] || recipe.category}</span>
                </div>
                {recipe.prepTime && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Подготовка:</span>
                    <span className="font-medium">{recipe.prepTime} мин</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Готвене:</span>
                  <span className="font-medium">{recipe.cookTime} мин</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Порции:</span>
                  <span className="font-medium">{recipe.servings}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Общо време:</span>
                  <span className="font-medium">
                    {(recipe.prepTime || 0) + recipe.cookTime} мин
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Share Button */}
          <Button 
            className="w-full bg-warm-orange hover:bg-deep-amber"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: recipe.title,
                  text: recipe.description,
                  url: window.location.href,
                });
              } else {
                navigator.clipboard.writeText(window.location.href);
                // You could add a toast notification here
              }
            }}
          >
            <Share2 className="w-4 h-4 mr-2" />
            Сподели рецептата
          </Button>
        </div>
      </div>
    </div>
  );
}