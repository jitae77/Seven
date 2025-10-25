import React, { useState } from "react";
import MenuBurger from "./MenuBurger";
import MenuListe from "./MenuListe";
import SearchBar from "./SearchBar";
import "./Header.css";

const Header: React.FC = () => {
  const [toggle, setToggle] = useState(false);
  const [searchActive, setSearchActive] = useState(false); // 👈 nouvel état

  const handleToggle = () => {
    setToggle((prev) => !prev);
    document.body.classList.toggle("no-scroll", !toggle);
  };

  return (
    <header className="site-header">
      <div className="header-content">
        {/* ✅ Masquer le MenuBurger quand la recherche est active */}
        {!searchActive && (
          <MenuBurger toggle={toggle} handleToggle={handleToggle} />
        )}
        <MenuListe isOpen={toggle} />
      </div>

      {/* 👇 La SearchBar avertit le Header quand elle est active */}
      <SearchBar onActiveChange={setSearchActive} />
    </header>
  );
};

export default Header;
