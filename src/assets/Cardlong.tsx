import React from "react";
import "./CardLong.css";

interface Item {
  id: number;
  titre: string;
  auteur: string;
  description: string;
  description_longue?: string;
  image: string;
  lien: string;
  date: string;
  statut: string;
  genre: string[];
}

interface CardLongProps {
  item: Item;
}

const CardLong: React.FC<CardLongProps> = ({ item }) => {
  return (
    <div className="CardLong">
      <a href={item.lien} target="_blank" rel="noopener noreferrer">
        <img src={item.image} alt={item.titre} />
      </a>

      {/* Infos affichées uniquement au hover */}
      <div className="CardOverlay">
        <h3 className="CardTitle">{item.titre}</h3>
        <p className="CardInfo">✍️ {item.auteur}</p>
        <div className="CardGenres">
          {item.genre.slice(0, 3).map((g, i) => (
            <span key={i} className="GenreTag">
              {g}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardLong;
