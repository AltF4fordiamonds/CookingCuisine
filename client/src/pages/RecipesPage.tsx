import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Clock, Users } from "lucide-react";
import type { Recipe } from "@shared/schema";

export default function RecipesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Fetch recipes with React Query
  const { data: recipes, isLoading } = useQuery<Recipe[]>({
    queryKey: ["recipes", searchTerm, selectedCategory],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchTerm) params.set("search", searchTerm);
      if (selectedCategory && selectedCategory !== "all") params.set("category", selectedCategory);

      const res = await fetch(`/api/recipes?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch recipes");
      return res.json();
    },
  
  });

  const categories = [
    { value: "main", label: "Основни ястия" },
    { value: "salads", label: "Салати" },
    { value: "desserts", label: "Десерти" },
    { value: "soups", label: "Супи" },
    { value: "appetizers", label: "Предястия" },
  ];

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      {/* Заглавие */}
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-playfair font-bold text-gray-800 mb-4">
          Всички рецепти
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Разгледайте нашата богата колекция от рецепти за всеки вкус и повод
        </p>
      </header>

      {/* Търсене и филтри */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Търсене */}
            <div className="md:col-span-2">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Търсене на рецепти
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="search"
                  type="text"
                  placeholder="Търсете по име или съставка..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10"
                  autoComplete="off"
                />
              </div>
            </div>

            {/* Категории */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Категория
              </label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Всички категории" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Всички категории</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Бутона за изчистване на филтрите */}
          {(searchTerm || (selectedCategory !== "all")) && (
            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Изчисти филтрите
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Списък с рецепти */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="overflow-hidden animate-pulse">
              <Skeleton className="w-full h-48" />
              <CardContent className="p-4">
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-3" />
                <div className="flex justify-between mb-3">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-8 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
    ) : recipes && (recipes as Recipe[]).length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {recipes?.map((recipe: Recipe) => (
            <Card
              key={recipe.id}
              className="overflow-hidden hover:shadow-xl transition-transform hover:scale-105 cursor-pointer"
            >
              {recipe.image && (
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
              )}
              <CardContent className="p-4">
                <h3 className="text-lg font-playfair font-semibold mb-2">{recipe.title}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{recipe.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {recipe.cookTime} мин
                  </span>
                  <span className="flex items-center">
                    <Users className="w-3 h-3 mr-1" />
                    {recipe.servings} порции
                  </span>
                </div>
                <Link href={`/recipe/${recipe.id}`}>
                  <Button className="w-full bg-warm-orange hover:bg-deep-amber" size="sm">
                    Виж рецептата
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Няма намерени рецепти</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || selectedCategory !== "all"
              ? "Опитайте с различни критерии за търсене или изчистете филтрите."
              : "Все още няма добавени рецепти. Бъдете първите, които ще споделят своите кулинарни творения!"}
          </p>
          {!searchTerm && selectedCategory === "all" && (
            <Button
              className="bg-warm-orange hover:bg-deep-amber"
              onClick={() => (window.location.href = "/add-recipe")}
            >
              Добави първата рецепта
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
