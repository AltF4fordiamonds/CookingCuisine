import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Clock, Users, ArrowLeft, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import type { Recipe } from "@shared/schema";

const categoryLabels: Record<string, string> = {
  main: "Основни ястия",
  salads: "Салати",
  desserts: "Десерти",
  soups: "Супи",
  appetizers: "Предястия",
};

export default function RecipeDetailPage() {
  const [, params] = useRoute("/recipe/:id");
  const recipeId = params?.id ? parseInt(params.id) : null;

  const { data: recipe, isLoading, error } = useQuery<Recipe>({
    queryKey: ["/api/recipes", recipeId],
    queryFn: async () => {
      if (!recipeId) throw new Error("No recipe ID provided");
      const res = await fetch(`/api/recipes/${recipeId}`);
      if (!res.ok) throw new Error("Failed to fetch recipe");
      return res.json();
    },
    enabled: !!recipeId,
  });

  if (isLoading) return <LoadingSkeleton />;

  if (error || !recipe) return <NotFound />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <BackButton />
      <RecipeHeader recipe={recipe} />
      <div className="grid lg:grid-cols-3 gap-8">
        <MainContent recipe={recipe} />
        <Sidebar recipe={recipe} />
      </div>
    </div>
  );
}

function LoadingSkeleton() {
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

function NotFound() {
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

function BackButton() {
  return (
    <div className="mb-8">
      <Link href="/recipes">
        <Button variant="ghost" className="text-warm-orange hover:text-deep-amber">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Обратно към рецептите
        </Button>
      </Link>
    </div>
  );
}

function RecipeHeader({ recipe }: { recipe: Recipe }) {
  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-2 mb-4">
        <Badge variant="secondary" className="bg-warm-orange text-white">
          {categoryLabels[recipe.category] || recipe.category}
        </Badge>
      </div>
      <h1 className="text-4xl md:text-5xl font-playfair font-bold text-gray-800 mb-4">
        {recipe.title}
      </h1>
      <p className="text-lg text-gray-600 mb-6">{recipe.description}</p>
      <div className="flex items-center gap-6 text-gray-600">
        {recipe.prepTime && (
          <TimeInfo icon={<Clock className="w-5 h-5 mr-2" />} label={`Подготовка: ${recipe.prepTime} мин`} />
        )}
        <TimeInfo icon={<Clock className="w-5 h-5 mr-2" />} label={`Готвене: ${recipe.cookTime} мин`} />
        <TimeInfo icon={<Users className="w-5 h-5 mr-2" />} label={`${recipe.servings} порции`} />
      </div>
    </div>
  );
}

function TimeInfo({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center">
      {icon}
      <span>{label}</span>
    </div>
  );
}

function MainContent({ recipe }: { recipe: Recipe }) {
  return (
    <>
      {recipe.image && (
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg mb-8"
        />
      )}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-6">Стъпки за приготвяне</h2>
          <div className="space-y-6">
            {recipe.instructions.map((step, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-warm-orange text-white rounded-full flex items-center justify-center font-semibold text-sm">
                  {i + 1}
                </div>
                <p className="text-gray-700 leading-relaxed pt-1">{step.text}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

function Sidebar({ recipe }: { recipe: Recipe }) {
  const totalTime = (recipe.prepTime || 0) + recipe.cookTime;

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-playfair font-bold text-gray-800 mb-4">Съставки</h2>
          <ul className="space-y-3">
            {recipe.ingredients.map((ing, i) => (
              <li
                key={i}
                className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
              >
                <span className="text-gray-700">{ing.name}</span>
                <span className="text-warm-orange font-medium">
                  {ing.amount} {ing.unit}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="bg-warm-gray">
        <CardContent className="p-6">
          <h3 className="text-lg font-playfair font-bold text-gray-800 mb-4">Информация за рецептата</h3>
          <InfoRow label="Категория:" value={categoryLabels[recipe.category] || recipe.category} />
          {recipe.prepTime && <InfoRow label="Подготовка:" value={`${recipe.prepTime} мин`} />}
          <InfoRow label="Готвене:" value={`${recipe.cookTime} мин`} />
          <InfoRow label="Порции:" value={`${recipe.servings}`} />
          <InfoRow label="Общо време:" value={`${totalTime} мин`} />
        </CardContent>
      </Card>

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
            // Може да добавиш toast нотификация тук
          }
        }}
      >
        <Share2 className="w-4 h-4 mr-2" />
        Сподели рецептата
      </Button>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
