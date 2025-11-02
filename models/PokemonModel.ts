import { pool } from "../config/database";
import { Pokemon } from "../services/Pokemon";
import { Attack } from "../services/Attack";

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

  //function to load attacks for a pokemon
  private async loadAttacksForPokemon(pokemonId: number): Promise<Attack[]> {
    const query = `
      SELECT a.attack_id, a.name, a.damage, a.usage_limit, COALESCE(pa.usage_count, 0) as usage_counter
      FROM pokemon_attacks pa
      JOIN attacks a ON pa.attack_id = a.attack_id
      WHERE pa.pokemon_id = $1
    `;
    const result = await pool.query(query, [pokemonId]);
    return result.rows.map(
      (row) =>
        new Attack(
          row.name,
          row.damage,
          row.usage_limit,
          row.usage_counter,
          row.attack_id
        )
    );
  }

  async findAll(): Promise<Pokemon[]> {
    const query = `
        select * from pokemons
    `;
    const result = await pool.query(query);
    const pokemons = await Promise.all(
      result.rows.map(async (row) => {
        const attacks = await this.loadAttacksForPokemon(row.pokemon_id);
        return new Pokemon(
          row.name,
          row.life_points,
          row.max_life_points,
          attacks,
          row.pokemon_id
        );
      })
    );
    return pokemons;
  }

  async findById(id: number): Promise<Pokemon> {
    const query = `
      select * from pokemons 
      where pokemon_id = $1
    `;
    const result = await pool.query(query, [id]);
    const row = result.rows[0];
    const attacks = await this.loadAttacksForPokemon(id);
    return new Pokemon(
      row.name,
      row.life_points,
      row.max_life_points,
      attacks,
      row.pokemon_id
    );
  }

  async update(id: number, pokemon: Pokemon): Promise<Pokemon> {
    const query = `
      update pokemons
      set name = $1, life_points = $2, max_life_points = $3
      where pokemon_id = $4
      returning pokemon_id, name, life_points, max_life_points
    `;
    const values = [
      pokemon.getName(),
      pokemon.getLifePoints(),
      pokemon.getMaxLifePoints(),
      id,
    ];
    const result = await pool.query(query, values);
    const row = result.rows[0];
    const attacks = await this.loadAttacksForPokemon(id);
    return new Pokemon(
      row.name,
      row.life_points,
      row.max_life_points,
      attacks,
      row.pokemon_id
    );
  }

  async addAttack(pokemonId: number, attackId: number): Promise<void> {
    const query = `
      insert into pokemon_attacks (pokemon_id, attack_id)
      values ($1, $2)
    `;
    const result = await pool.query(query, [pokemonId, attackId]);
  }

  async delete(id: number): Promise<void> {
    const query = `
      delete from pokemons 
      where pokemon_id = $1
    `;
    const result = await pool.query(query, [id]);
  }
}
