"use client";
import { useState, useEffect } from "react";
import Image from "next/image";


async function getAllPokemonMeta() {
  const res = await fetch("https://pokeapi.co/api/v2/pokemon?offset=0&limit=100000");
  if (!res.ok) throw new Error("Failed to fetch Pokémon");
  const data = await res.json();
  return data.results;
}

async function getPokemonDetails(pokemonMeta: { name: string; url: string }[]) {
  return await Promise.all(
    pokemonMeta.map(async (pokemon) => {
      const detailRes = await fetch(pokemon.url);
      if (!detailRes.ok) return { name: pokemon.name, image: null, height: 0, weight: 0, base_experience: 0, types: [] };
      const detailData = await detailRes.json();
      return {
        name: pokemon.name,
        image:
          detailData.sprites?.other?.["official-artwork"]?.front_default ||
          detailData.sprites?.front_default ||
          null,
        height: detailData.height,
        weight: detailData.weight,
        base_experience: detailData.base_experience,
        types: detailData.types?.map((t: { type: { name: string } }) => t.type.name) || [],
      };
    })
  );
}

export default function Home() {
  type PokemonMeta = { name: string; url: string };
  type PokemonDetails = {
    name: string;
    image: string | null;
    height: number;
    weight: number;
    base_experience: number;
    types: string[];
  };
  const [pokemonMeta, setPokemonMeta] = useState<PokemonMeta[]>([]);
  const [pokemonList, setPokemonList] = useState<PokemonDetails[]>([]);
  const [deck, setDeck] = useState<PokemonDetails[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const pageSize = 52;
  const totalPages = Math.ceil(pokemonMeta.length / pageSize);

  useEffect(() => {
    async function fetchMeta() {
      const meta = await getAllPokemonMeta();
      setPokemonMeta(meta);
    }
    fetchMeta();
  }, []);

  useEffect(() => {
    async function fetchDetails() {
      if (pokemonMeta.length === 0) return;
      setLoading(true);
      const start = page * pageSize;
      const end = start + pageSize;
      const details = await getPokemonDetails(pokemonMeta.slice(start, end));
      setPokemonList(details);
      setLoading(false);
    }
    fetchDetails();
  }, [page, pokemonMeta]);

  // Add to deck
  const addToDeck = (pokemon: PokemonDetails) => {
    if (deck.length < 10 && !deck.some((p) => p.name === pokemon.name)) {
      setDeck([...deck, pokemon]);
    }
  };
  // Remove from deck
  const removeFromDeck = (name: string) => {
    setDeck(deck.filter((p) => p.name !== name));
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold mb-8">Welcome to the Multiverse PokeAPI!</h1>
      <Image
        src="/pokemon-logo.png"
        alt="Pokemon Logo"
        width={300}
        height={100}
        priority
      />
      <p className="mt-8 text-center">
        Explore the vast multiverse of Pokémon data with our comprehensive API.
      </p>
      {/* Deck Section */}
      <div className="w-full max-w-4xl mb-12">
        <h2 className="text-2xl font-semibold mb-4">Your Deck ({deck.length}/10)</h2>
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {deck.map((pokemon, idx) => (
            <li key={idx} className="relative">
              <div className="bg-yellow-100 border border-yellow-400 rounded-lg shadow-md p-4 flex flex-col items-center">
                {pokemon.image ? (
                  <Image
                    src={pokemon.image}
                    alt={pokemon.name}
                    width={80}
                    height={80}
                    className="mb-2"
                  />
                ) : (
                  <div className="w-[80px] h-[80px] flex items-center justify-center bg-gray-100 mb-2 rounded">
                    <span className="text-gray-400">No Image</span>
                  </div>
                )}
                <span className="font-bold text-md mb-1 text-gray-800">{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</span>
                <div className="text-sm text-gray-600 mb-1">Height: {pokemon.height} | Weight: {pokemon.weight}</div>
                <div className="text-sm text-gray-600 mb-1">Base XP: {pokemon.base_experience}</div>
                <div className="text-xs text-gray-500 mb-1">Type: {pokemon.types?.join(", ") ?? "-"}</div>
                <button
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow hover:bg-red-600"
                  onClick={() => removeFromDeck(pokemon.name)}
                  title="Remove from Deck"
                >
                  −
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {/* Gallery Section */}
      <div className="mt-12 w-full max-w-4xl">
        <h2 className="text-2xl font-semibold mb-4">Pokémon Gallery (Page {page + 1} of {totalPages || 1})</h2>
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {pokemonList.map((pokemon, idx) => (
              <li key={idx} className="relative">
                <div className="bg-white border border-gray-300 rounded-lg shadow-md p-4 flex flex-col items-center hover:scale-105 transition-transform duration-150">
                  {pokemon.image ? (
                    <Image
                      src={pokemon.image}
                      alt={pokemon.name}
                      width={120}
                      height={120}
                      className="mb-2"
                    />
                  ) : (
                    <div className="w-[120px] h-[120px] flex items-center justify-center bg-gray-100 mb-2 rounded">
                      <span className="text-gray-400">No Image</span>
                    </div>
                  )}
                  <span className="font-bold text-lg mb-1 text-gray-800">{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</span>
                  <div className="text-sm text-gray-600 mb-1">Height: {pokemon.height} | Weight: {pokemon.weight}</div>
                  <div className="text-sm text-gray-600 mb-1">Base XP: {pokemon.base_experience}</div>
                  <div className="text-xs text-gray-500 mb-1">Type: {pokemon.types?.join(", ") ?? "-"}</div>
                  <button
                    className="absolute top-2 right-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow hover:bg-green-600"
                    onClick={() => addToDeck(pokemon)}
                    disabled={deck.length >= 10 || deck.some((p) => p.name === pokemon.name)}
                    title="Add to Deck"
                  >
                    +
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-8 flex gap-4 justify-center">
          <button
            className="px-6 py-3 bg-blue-600 text-white rounded shadow hover:bg-blue-700 disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={loading || page === 0}
          >
            ← Back
          </button>
          <button
            className="px-6 py-3 bg-blue-600 text-white rounded shadow hover:bg-blue-700 disabled:opacity-50"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={loading || page >= totalPages - 1}
          >
            Next →
          </button>

        </div>
        <p className="mt-6 text-xs text-gray-400">Showing {pageSize} Pokémon per page.</p>
      </div>
    </main>
  );
}
