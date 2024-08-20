import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';

import './PokemonDetail.css';

const PokemonDetail = () => {
  const { id } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true); // State for image loading
  const [error, setError] = useState(null);
  const [view, setView] = useState('abilities'); // State to toggle views

  useEffect(() => {
    const fetchPokemonDetail = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
        setPokemon(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching Pokemon details:', error);
        setError('Error fetching Pokemon details. Please try again.');
        setLoading(false);
      }
    };

    fetchPokemonDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="big-spinner"></div> {/* Big spinner */}
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
        <Link to="/">
          <button>Back to Pokemon List</button>
        </Link>
      </div>
    );
  }

  if (!pokemon) {
    return (
      <div>
        <p>Pokemon not found</p>
        <Link to="/">
          <button>Back to Pokemon List</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="overlay">
      <div className="pokemon-detail-container">
        <Link to="/">
          <button className="back-button">Back to Pokemon List</button>
        </Link>
        <div className="pokemon-card">
          {imageLoading && <div className="small-spinner"></div>} 
          <img
            className="pokemon-image"
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemon.id}.svg`}
            alt={pokemon.name}
            onLoad={() => setImageLoading(false)}
            onError={() => setImageLoading(false)}
            style={{ display: imageLoading  }} 
          />
          <div className="pokemon-info">
            <h1 className="pokemon-name">{pokemon.name}</h1>
            <div className="nav-buttons">
              <button
                className={view === 'abilities' ? 'selected' : ''}
                onClick={() => setView('abilities')}
              >
                Abilities
              </button>
              <button
                className={view === 'types' ? 'selected' : ''}
                onClick={() => setView('types')}
              >
                Types
              </button>
              <button
                className={view === 'stats' ? 'selected' : ''}
                onClick={() => setView('stats')}
              >
                Stats
              </button>
              <button
                className={view === 'moves' ? 'selected' : ''}
                onClick={() => setView('moves')}
              >
                Moves
              </button>
            </div>
            <div className="pokemon-details">
              {view === 'abilities' && (
                <div className="pokemon-abilities">
                  <h2>Abilities:</h2>
                  {pokemon.abilities.map((poke) => (
                    <span className="ability-group" key={poke.ability.name}>
                      {poke.ability.name}
                    </span>
                  ))}
                  <p className="weight">Weight: {pokemon.weight} KG</p>
                  <p className="height">Height: {pokemon.height} cm</p>
                </div>
              )}
              {view === 'types' && (
                <div className="pokemon-types">
                  <h2>Types:</h2>
                  {pokemon.types.map((type) => (
                    <span className={`type-badge ${type.type.name}`} key={type.type.name}>
                      {type.type.name}
                    </span>
                  ))}
                </div>
              )}
              {view === 'stats' && (
                <div className="pokemon-stats">
                  <h2>Stats:</h2>
                  {pokemon.stats.map((stat) => (
                    <div key={stat.stat.name} className="stat">
                      <span>{stat.stat.name}: {stat.base_stat} %</span>
                      <div className="progress-bar">
                        <div
                          className="progress-bar-fill"
                          style={{ width: `${stat.base_stat}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {view === 'moves' && (
                <div className="pokemon-moves">
                  <h2>Moves:</h2>
                  {pokemon.moves.map((move) => (
                    <div key={move.move.name} className="move-group">
                      {move.move.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonDetail;
