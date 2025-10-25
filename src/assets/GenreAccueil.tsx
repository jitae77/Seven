import React, { useEffect, useState } from "react";
import "./GenreAccueil.css";
import { dataSeven } from "./DataSeven";
import CardLong from "./Cardlong";

interface Item {
  id: number;
  titre: string;
  auteur: string;
  description: string;
  description_longue?: string;
  image: string;
  type: string;
  lien: string;
  date: string;
  statut: string;
  genre: string[];
}

const ITEMS_PER_PAGE = 4;

const GenreAccueil: React.FC = () => {
  const [groupedGenres, setGroupedGenres] = useState<Record<string, Item[]>>({});
  const [pageByGenre, setPageByGenre] = useState<Record<string, number>>({});
  const [animationDirection, setAnimationDirection] = useState<Record<string, string>>({});

  // Mélange aléatoire pour éviter la répétition
  const shuffleArray = (array: Item[]) => [...array].sort(() => Math.random() - 0.5);

  useEffect(() => {
    const genresList = [
      "Manhwa", "Manga", "Anime", "Action", "Aventure", "Comédie",
      "Drame", "Romance", "Fantasy", "Surnaturel", "Isekai",
      "Science-Fiction", "Thriller", "Mystère", "Psychologique",
      "Vie scolaire", "Vampire", "Société", "Horreur",
      "Héros", "Vengeance", "Dark Fantasy", "Shōnen"
    ];

    const categories: Record<string, Item[]> = {};
    const pages: Record<string, number> = {};

    genresList.forEach((genre) => {
      const items = dataSeven.filter(
        (item) =>
          item.type.toLowerCase().includes(genre.toLowerCase()) ||
          item.genre?.some((g) => g.toLowerCase().includes(genre.toLowerCase()))
      );
      if (items.length > 0) {
        categories[genre] = shuffleArray(items);
        pages[genre] = 0;
      }
    });

    setGroupedGenres(categories);
    setPageByGenre(pages);
  }, []);

  // 🔥 Gestion du slide directionnel
  const changePage = (genre: string, direction: "next" | "prev") => {
    const outClass = direction === "next" ? "slide-out-left" : "slide-out-right";
    const inClass = direction === "next" ? "slide-in-right" : "slide-in-left";

    // Lance la sortie
    setAnimationDirection((prev) => ({ ...prev, [genre]: outClass }));

    setTimeout(() => {
      setPageByGenre((prev) => {
        const total = Math.ceil(groupedGenres[genre].length / ITEMS_PER_PAGE);
        let newPage =
          direction === "next"
            ? (prev[genre] + 1) % total
            : (prev[genre] - 1 + total) % total;
        return { ...prev, [genre]: newPage };
      });

      // Lance l’entrée après mise à jour
      setAnimationDirection((prev) => ({ ...prev, [genre]: inClass }));

      // Supprime la classe après l’animation
      setTimeout(() => {
        setAnimationDirection((prev) => ({ ...prev, [genre]: "" }));
      }, 600);
    }, 300);
  };

  return (
    <section className="GenreAccueil">
      <h1 className="GenreAccueilTitle">Découvrez selon vos goûts 🎬</h1>

      <div className="GenreContainer">
        {Object.entries(groupedGenres).map(([genre, items]) => {
          const currentPage = pageByGenre[genre] || 0;
          const startIndex = currentPage * ITEMS_PER_PAGE;
          const visibleItems = items.slice(startIndex, startIndex + ITEMS_PER_PAGE);
          const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);

          return (
            <div key={genre} className="GenreBlock">
              <h2 className="GenreTitle">{genre}</h2>

              {/* ✅ Animation directionnelle */}
              <div className={`GenreList ${animationDirection[genre] || ""}`}>
                {visibleItems.map((item) => (
                  <CardLong key={item.id} item={item} />
                ))}
              </div>

              {/* Navigation suivante / précédente */}
              {totalPages > 1 && (
                <div className="GenreNav">
                  <button
                    onClick={() => changePage(genre, "prev")}
                    className="navBtn prevBtn"
                    aria-label={`Voir les précédents ${genre}`}
                  >
                    ❮
                  </button>
                  <button
                    onClick={() => changePage(genre, "next")}
                    className="navBtn nextBtn"
                    aria-label={`Voir les suivants ${genre}`}
                  >
                    ❯
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default GenreAccueil;
