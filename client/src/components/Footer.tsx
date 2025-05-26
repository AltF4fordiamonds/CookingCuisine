import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="font-dancing text-3xl text-warm-orange mb-4">
              ЖиГулИ рецепти
            </h3>
            <p className="text-gray-300 mb-4">
              Вашият най-добър приятел в кухнята. Откриваме, създаваме и споделяме 
              най-вкусните рецепти за всеки ден.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-gray-300 hover:text-warm-orange transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a 
                href="#" 
                className="text-gray-300 hover:text-warm-orange transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C3.85 14.724 3.85 12.78 5.126 11.504c1.276-1.276 3.22-1.276 4.496 0 1.276 1.276 1.276 3.22 0 4.496-.875.807-2.026 1.297-3.323 1.297-.648 0-1.297-.162-1.945-.486zm7.569 0c-1.297 0-2.448-.49-3.323-1.297-1.276-1.276-1.276-3.22 0-4.496 1.276-1.276 3.22-1.276 4.496 0 1.276 1.276 1.276 3.22 0 4.496-.875.807-2.026 1.297-3.323 1.297-.648 0-1.297-.162-1.945-.486z"/>
                </svg>
              </a>
              <a 
                href="#" 
                className="text-gray-300 hover:text-warm-orange transition-colors"
                aria-label="YouTube"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Бързи връзки</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-warm-orange transition-colors">
                  Начало
                </Link>
              </li>
              <li>
                <Link href="/recipes" className="text-gray-300 hover:text-warm-orange transition-colors">
                  Рецепти
                </Link>
              </li>
              <li>
                <Link href="/add-recipe" className="text-gray-300 hover:text-warm-orange transition-colors">
                  Добави рецепта
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-warm-orange transition-colors">
                  Контакти
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Информация</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-warm-orange transition-colors">
                  За нас
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-warm-orange transition-colors">
                  Условия за ползване
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-warm-orange transition-colors">
                  Политика за поверителност
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-warm-orange transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            © 2024 ЖиГулИ рецепти. Всички права запазени.
          </p>
        </div>
      </div>
    </footer>
  );
}
