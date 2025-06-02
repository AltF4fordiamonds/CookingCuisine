
import { useState } from "react";
import { useQuery } from "@apollo/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Clock, Users } from "lucide-react";
import { SEARCH_SPOONACULAR_RECIPES, type SpoonacularRecipe } from "@/lib/graphqlClient";

export default function SpoonacularRecipes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const { data, loading, error } = useQuery(SEARCH_SPOONACULAR_RECIPES, {
    variables: { query: searchTerm, number: 12 },
    skip: !submitted || !searchTerm,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <header className="text-center mb-8">
        <h2 className="text-3xl font-playfair font-bold text-gray-800 mb-4">
          Международни рецепти от Spoonacular
        </h2>
        <p className="text-lg text-gray-600">
          Открийте хиляди рецепти от цял свят, преведени на български
        </p>
      </header>

      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-2 max-w-md mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Търсете международни рецепти..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="submit" className="bg-warm-orange hover:bg-deep-amber">
            Търси
          </Button>
        </div>
      </form>

      {error && (
        <div className="text-center py-8">
          <p className="text-red-600">Грешка при зареждане на рецептите: {error.message}</p>
        </div>
      )}

      {loading ? (
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
              </CardContent>
            </Card>
          ))}
        </div>
      ) : data?.searchSpoonacularRecipes?.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {data.searchSpoonacularRecipes.map((recipe: SpoonacularRecipe) => (
            <Card
              key={recipe.id}
              className="overflow-hidden hover:shadow-xl transition-transform hover:scale-105"
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
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{recipe.summary}</p>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  {recipe.readyInMinutes && (
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {recipe.readyInMinutes} мин
                    </span>
                  )}
                  {recipe.servings && (
                    <span className="flex items-center">
                      <Users className="w-3 h-3 mr-1" />
                      {recipe.servings} порции
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    Spoonacular
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : submitted && (
        <div className="text-center py-12">
          <p className="text-gray-500">Няма намерени рецепти за "{searchTerm}"</p>
        </div>
      )}
    </div>
  );
}
