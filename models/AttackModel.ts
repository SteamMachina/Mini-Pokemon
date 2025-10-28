import { pool } from "../config/database";
import { Attack } from "../services/Attack";

export class attackModel {
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
}
