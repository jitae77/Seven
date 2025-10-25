import React from 'react';
import './MenuBurger.css';

interface MenuBurgerProps {
  toggle: boolean;
  handleToggle: () => void;
}

const MenuBurger: React.FC<MenuBurgerProps> = ({ toggle, handleToggle }) => {
  return (
    <button
      aria-label="Menu"
      className={`MenuBurgerButton ${toggle ? 'active' : ''}`}
      onClick={handleToggle}
    >
      <span className="line top" />
      <span className="line middle" />
      <span className="line bottom" />
    </button>
  );
};

export default MenuBurger;
