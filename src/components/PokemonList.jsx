import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import Card from './Card';
import SearchBar from './SearchBar';
import Spinner from './Spinner';  

const PokemonList = () => {
  const [pokeData, setPokeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState('https://pokeapi.co/api/v2/pokemon/');
  const [nextUrl, setNextUrl] = useState();
  const [filteredPokeData, setFilteredPokeData] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false); 
  const [isSearching, setIsSearching] = useState(false); 

  const pokeFun = async () => {
    try {
      setLoading(true);
      const res = await axios.get(url);
      setNextUrl(res.data.next);
      getPokemon(res.data.results);
      setLoading(false);
    } catch (error) {
      setError('Error fetching Pokemon data. Please check your internet connection and try again.');
      setLoading(false);
    }
  };

  const getPokemon = async (res) => {
    const promises = res.map(async (item) => {
      const result = await axios.get(item.url);
      return result.data;
    });

    Promise.all(promises)
      .then((pokemonData) => {
        setPokeData((prevData) => [...prevData, ...pokemonData]);
      })
      .catch((error) => {
        setError('Error fetching Pokemon details. Please try again.');
      });
  };

  useEffect(() => {
    if (pokeData.length === 0) {
      pokeFun();
    }
  }, [pokeData]);

  const handleSearch = (searchTerm) => {
    setIsSearching(true);
    setSearchLoading(true); 
    setFilteredPokeData([]);
    if (searchTerm === '') {
      setFilteredPokeData([]);
      setSearchLoading(false); 
      setIsSearching(false); 
    } else {
      const filteredPokemon = pokeData
        .filter((pokemon) =>
          pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
          const aIndex = a.name.toLowerCase().indexOf(searchTerm.toLowerCase());
          const bIndex = b.name.toLowerCase().indexOf(searchTerm.toLowerCase());
          return aIndex - bIndex;
        });

      const uniquePokemon = Array.from(
        new Map(filteredPokemon.map(pokemon => [pokemon.id, pokemon])).values()
      );

      setTimeout(() => { 
        setFilteredPokeData(uniquePokemon);
        setSearchLoading(false); 
      }, 500);
    }
  };

  const fetchMoreData = async () => {
    if (nextUrl && !isSearching) {  
      try {
        const res = await axios.get(nextUrl);
        setNextUrl(res.data.next);
        getPokemon(res.data.results);
      } catch (error) {
        setError('Error fetching more Pokemon data. Please try again.');
        setHasMore(false);
      }
    } else {
      setHasMore(false);
    }
  };

  return (
    <>
      <SearchBar onSearch={handleSearch} />
      {loading && <Spinner />} 
      {error && <div>Error: {error}</div>}
      {searchLoading ? ( 
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      ) : (
        filteredPokeData.length > 0 ? (
          <div className="container">
            <div className="left-content">
              <Card pokemon={filteredPokeData} loading={loading && <Spinner />} />
            </div>
          </div>
        ) : (
          <InfiniteScroll
            dataLength={pokeData.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={<h4>Loading...</h4>}
            endMessage={<p>No more Pokémon to load!</p>}
          >
            <div className="container">
              <div className="left-content">
                <Card pokemon={pokeData} loading={loading && <Spinner />} />
              </div>
            </div>
          </InfiniteScroll>
        )
      )}
    </>
  );
};

export default PokemonList;
