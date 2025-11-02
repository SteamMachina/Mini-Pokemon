import { pool } from "../config/database";
import { Trainer } from "../services/Trainer";

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

  async findAll(): Promise<Trainer[]> {
    const query = `
        select * from trainers
    `;
    const result = await pool.query(query);
    return result.rows.map(
      (row) => new Trainer(row.name, row.level, row.experience)
    );
  }

  async findById(id: number): Promise<Trainer> {
    const query = `
      select * from trainers 
      where trainer_id = $1
    `;
    const result = await pool.query(query, [id]);
    const row = result.rows[0];
    return new Trainer(row.name, row.level, row.experience);
  }

  async update(id: number, trainer: Trainer): Promise<Trainer> {
    const query = `
      update trainers
      set name = $1, level = $2, experience = $3
      where trainer_id = $4
    `;
    const values = [trainer.getName(), trainer.getLevel(), trainer.getXP(), id];
    const result = await pool.query(query, values);
    const row = result.rows[0];
    return new Trainer(row.name, row.level, row.experience);
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
