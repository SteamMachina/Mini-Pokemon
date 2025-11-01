import { pool } from "../config/database";
import { Pokemon } from "../services/Pokemon";

export class PokemonModel {
  async create(pokemon: Pokemon): Promise<number> {
    const query = `
            insert into pokemons (name, life_points, max_life_points)
            values ($1, $2, $3)
            returning pokemon_id
        `;
    const values = [
      pokemon.getName(),
      pokemon.getLifePoints(),
      pokemon.getMaxLifePoints(),
    ];
    const result = await pool.query(query, values);
    return result.rows[0].pokemon_id;
  }

  async findAll(): Promise<Pokemon[]> {
    const query = `
        select * from pokemons
    `;
    const result = await pool.query(query);
    return result.rows.map(
      (row) => new Pokemon(row.name, row.life_points, row.max_life_points)
    );
  }

  async findById(id: number): Promise<Pokemon> {
    const query = `
      select * from pokemons 
      where pokemon_id = $1
    `;
    const result = await pool.query(query, [id]);
    const row = result.rows[0];
    return new Pokemon(row.name, row.life_points, row.max_life_points);
  }

  async update(id: number, pokemon: Pokemon): Promise<Pokemon> {
    const query = `
      update pokemons
      set name = $1, life_points = $2, max_life_points = $3
      where pokemon_id = $4
    `;
    const values = [
      pokemon.getName(),
      pokemon.getLifePoints(),
      pokemon.getMaxLifePoints(),
      id,
    ];
    const result = await pool.query(query, values);
    const row = result.rows[0];
    return new Pokemon(row.name, row.life_points, row.max_life_points);
  }

  async delete(id: number): Promise<void> {
    const query = `
      delete from pokemons 
      where pokemon_id = $1
    `;
    const result = await pool.query(query, [id]);
  }
}
