import { pool } from "../config/database";
import { Trainer } from "../services/Trainer";
import { Pokemon } from "../services/Pokemon";
import { Attack } from "../services/Attack";

export class TrainerModel {
  async create(trainer: Trainer): Promise<number> {
    const query = `
            insert into trainers (name, level, experience)
            values ($1, $2, $3)
            returning trainer_id
        `;
    const values = [trainer.getName(), trainer.getLevel(), trainer.getXP()];
    const result = await pool.query(query, values);
    return result.rows[0].trainer_id;
  }

  private async loadPokemonsForTrainer(trainerId: number): Promise<Pokemon[]> {
    const query = `
      SELECT p.pokemon_id, p.name, p.life_points, p.max_life_points
      FROM trainer_pokemon tp
      JOIN pokemons p ON tp.pokemon_id = p.pokemon_id
      WHERE tp.trainer_id = $1
    `;
    const result = await pool.query(query, [trainerId]);

    const pokemons = await Promise.all(
      result.rows.map(async (row) => {
        // Load attacks for this pokemon
        const attacksQuery = `
          SELECT a.attack_id, a.name, a.damage, a.usage_limit, COALESCE(pa.usage_count, 0) as usage_counter
          FROM pokemon_attacks pa
          JOIN attacks a ON pa.attack_id = a.attack_id
          WHERE pa.pokemon_id = $1
        `;
        const attacksResult = await pool.query(attacksQuery, [row.pokemon_id]);
        const attacks = attacksResult.rows.map(
          (attackRow) =>
            new Attack(
              attackRow.name,
              attackRow.damage,
              attackRow.usage_limit,
              attackRow.usage_counter,
              attackRow.attack_id
            )
        );

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

  async findAll(): Promise<Trainer[]> {
    const query = `
        select * from trainers
    `;
    const result = await pool.query(query);
    const trainers = await Promise.all(
      result.rows.map(async (row) => {
        const pokemons = await this.loadPokemonsForTrainer(row.trainer_id);
        return new Trainer(
          row.name,
          row.level,
          row.experience,
          pokemons,
          row.trainer_id
        );
      })
    );
    return trainers;
  }

  async findById(id: number): Promise<Trainer> {
    const query = `
      select * from trainers 
      where trainer_id = $1
    `;
    const result = await pool.query(query, [id]);
    const row = result.rows[0];
    const pokemons = await this.loadPokemonsForTrainer(id);
    return new Trainer(
      row.name,
      row.level,
      row.experience,
      pokemons,
      row.trainer_id
    );
  }

  async update(id: number, trainer: Trainer): Promise<Trainer> {
    const query = `
      update trainers
      set level = $1, experience = $2
      where trainer_id = $3
      returning trainer_id, name, level, experience
    `;
    const values = [trainer.getLevel(), trainer.getXP(), id];
    const result = await pool.query(query, values);
    const row = result.rows[0];
    return new Trainer(row.name, row.level, row.experience);
  }

  async healAllPokemons(trainerId: number): Promise<void> {
    // Update pokemons' life_points to max_life_points for all pokemons belonging to this trainer
    const query = `
      UPDATE pokemons
      SET life_points = max_life_points
      WHERE pokemon_id IN (
        SELECT pokemon_id FROM trainer_pokemon WHERE trainer_id = $1
      )
    `;
    await pool.query(query, [trainerId]);

    // Reset usage_count for all attacks of this trainer's pokemons
    const resetAttacksQuery = `
      UPDATE pokemon_attacks
      SET usage_count = 0
      WHERE pokemon_id IN (
        SELECT pokemon_id FROM trainer_pokemon WHERE trainer_id = $1
      )
    `;
    await pool.query(resetAttacksQuery, [trainerId]);
  }

  async addPokemon(trainerId: number, pokemonId: number): Promise<void> {
    await pool.query(
      "INSERT INTO trainer_pokemon (trainer_id, pokemon_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
      [trainerId, pokemonId]
    );
  }

  async delete(id: number): Promise<void> {
    const query = `
      delete from trainers 
      where trainer_id = $1
    `;
    const result = await pool.query(query, [id]);
  }
}
