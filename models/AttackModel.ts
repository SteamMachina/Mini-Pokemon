import { pool } from "../config/database";
import { Attack } from "../services/Attack";

export class AttackModel {
  async create(attack: Attack): Promise<number> {
    const query = `
            insert into attacks (name, damage, usage_limit, usageCounter)
            values ($1, $2, $3, $4)
            returning attack_id
        `;
    const values = [
      attack.getName(),
      attack.getDamage(),
      attack.getUsageLimit(),
      attack.getUsageCounter(),
    ];
    const result = await pool.query(query, values);
    return result.rows[0].attack_id;
  }

  async findAll(): Promise<Attack[]> {
    const query = `
        select * from attacks
    `;
    const result = await pool.query(query);
    return result.rows.map(
      (row) =>
        new Attack(row.name, row.damage, row.usage_limit, row.usage_counter)
    );
  }

  async findById(id: number): Promise<Attack> {
    const query = `
      select * from attacks 
      where attack_id = $1
    `;
    const result = await pool.query(query, [id]);
    const row = result.rows[0];
    return new Attack(row.name, row.damage, row.usage_limit, row.usage_counter);
  }

  async update(id: number, attack: Attack): Promise<Attack> {
    const query = `
      update attacks
      set name = $1, damage = $2, usage_limit = $3, usage_counter = $4
      where attack_id = $5
    `;
    const values = [
      attack.getName(),
      attack.getDamage(),
      attack.getUsageLimit(),
      attack.getUsageCounter(),
      id,
    ];
    const result = await pool.query(query, values);
    const row = result.rows[0];
    return new Attack(row.name, row.damage, row.usage_limit, row.usage_counter);
  }

  async delete(id: number): Promise<void> {
    const query = `
      delete from attacks 
      where attack_id = $1
    `;
    const result = await pool.query(query, [id]);
  }
}
