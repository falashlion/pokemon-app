import React from "react";
import { Link } from "react-router-dom";

const Card = ({ pokemon, loading }) => {
  return (
    <>
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        pokemon.map((item) => (
          <Link 
            to={`/pokemon/${item.id}`} 
            key={item.id} 
            state={{ pokemon: item }}
          >
            <div className="card">
              <img 
                src={item.sprites.other['official-artwork'].front_default} 
                alt={item.name} 
              />
              <h3>#{item.id}</h3>
              <h2>{item.name}</h2>
            </div>
          </Link>
        ))
      )}
    </>
  );
};

export default Card;
