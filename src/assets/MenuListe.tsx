import React, { useEffect, useState } from "react";
import "./MenuListe.css";

interface MenuListeProps {
  isOpen: boolean;
  onCloseEnd?: () => void;
}

const MenuListe: React.FC<MenuListeProps> = ({ isOpen, onCloseEnd }) => {
  const [state, setState] = useState<"closed" | "active" | "closing">("closed");

  const items = [
    { image: "/accueil.png", label: "Accueil", lien: "/" },
    { image: "/catalogue.png", label: "Catalogue", lien: "/catalogue" },
    { image: "/historique.png", label: "Historique", lien: "/historique" },
    { image: "/liste.png", label: "Liste", lien: "/liste" },
    { image: "/reseau.png", label: "Réseaux", lien: "/reseaux" },
    { image: "/seven.png", label: "Seven", lien: "/seven" },
  ];
  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => setState("active"), 10);
      return () => clearTimeout(t);
    }
    if (state === "active") {
      setState("closing");
      const t = setTimeout(() => {
        setState("closed");
        onCloseEnd?.();
      }, 800);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  if (state === "closed") return null;

  return (
    <nav className={`MenuListe ${state}`}>
      <ul className="MenuListeBox">
        {items.map((item, i) => (
          <MenuItem key={i} item={item} delay={0.1 * (i + 1)} />
        ))}
      </ul>
    </nav>
  );
};

export default MenuListe;

interface MenuItemProps {
  item: { image: string; label: string; lien: string };
  delay: number;
}

const MenuItem: React.FC<MenuItemProps> = ({ item, delay }) => (
  <li
    className="MenuListeItem"
    style={{
      animationDelay: `${delay}s`,
    }}
  >
    <a href={item.lien}>
      <img src={item.image} alt={item.label} />
      <p>{item.label}</p>
    </a>
  </li>
);
