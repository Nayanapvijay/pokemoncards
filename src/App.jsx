import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [search, setSearch] = useState("");

  
  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const response = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=50");
        const pokemonData = await Promise.all(
          response.data.results.map(async (pokemon) => {
            const details = await axios.get(pokemon.url);
            return { id: details.data.id, name: pokemon.name, image: details.data.sprites.front_default };
          })
        );
        setPokemons(pokemonData);
      } catch (error) {
        console.error("Error fetching Pokémon data:", error);
      }
    };
    fetchPokemons();
  }, []);

  // Filter Pokémon based on search input
  const filteredPokemons = pokemons.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">Pokémon Search</h1>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search Pokémon..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 rounded w-64 mb-4"
      />

      {/* Pokémon Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {filteredPokemons.length > 0 ? (
          filteredPokemons.map((pokemon) => (
            <div key={pokemon.id} className="bg-white shadow-lg rounded-lg p-4 flex flex-col items-center">
              <img src={pokemon.image} alt={pokemon.name} className="w-24 h-24" />
              <h2 className="text-lg font-bold capitalize mt-2">{pokemon.name}</h2>
            </div>
          ))
        ) : (
          <p className="col-span-full text-gray-500">No Pokémon found.</p>
        )}
      </div>
    </div>
  );
}

export default App;
