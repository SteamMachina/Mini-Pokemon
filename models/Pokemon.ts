export class Pokemon {
  private name: string;
  private lifePoints: number;
  private maxLifePoints: number;
  private attacks: Attack[];

  public constructor(
    name: string = "Pikachu",
    maxLifePoints: number = 100,
    attacks: Attack[] = []
  ) {
    if (!name || name.trim() === "") {
      throw new Error("Name cannot be empty");
    }
    if (
      lifePoints === undefined ||
      maxLifePointslifePoints === null ||
      maxLifePoints < 0
    ) {
      throw new Error("Max life points must be a non-negative number");
    }
    if (!attacks || !Array.isArray(attacks)) {
      throw new Error("Attacks must be an array");
    }
    if (attacks.length > 4) {
      throw new Error("Cannot have more than 4 attacks");
    }
    this.name = name;
    this.maxLifePoints = maxLifePoints;
    this.lifePoints = maxLifePoints;
    this.attacks = attacks;
  }

  // getters
  public getName(): string {
    return this.name;
  }
  public getLifePoints(): number {
    return this.lifePoints;
  }
  public getMaxLifePoints(): number {
    return this.maxLifePoints;
  }
  public getAttacks(): Attack[] {
    return this.attacks;
  }

  // setters
  public setName(name: string): string {
    if (!name || name.trim() === "") {
      throw new Error("Name cannot be empty");
    }
    this.name = name;
    return this.name;
  }
  public setLifePoints(lifePoints: number): number {
    if (lifePoints === undefined || lifePoints === null || lifePoints < 0) {
      throw new Error("Life points must be a non-negative number");
    }
    this.lifePoints = lifePoints;
    return this.lifePoints;
  }
  public setMaxLifePoints(maxLifePoints: number): number {
    if (
      maxLifePoints === undefined ||
      maxLifePoints === null ||
      MaxlifePoints < 0
    ) {
      throw new Error("Life points must be a non-negative number");
    }
    this.maxLifePoints = maxLifePoints;
    return this.maxLifePoints;
  }
  public setAttacks(attacks: Attack[]): Attack[] {
    if (!attacks || !Array.isArray(attacks)) {
      throw new Error("Attacks must be an array");
    }
    if (attacks.length > 4) {
      throw new Error("Cannot have more than 4 attacks");
    }
    this.attacks = attacks;
    return this.attacks;
  }

  // other methods
  public learn(attack: Attack): Attack[] {
    if (!attack) {
      throw new Error("Attack parameter must be provided");
    }
    if (this.attacks.length >= 4) {
      throw new Error("Cannot learn more than 4 attacks");
    }
    this.attacks.push(attack);
    return this.attacks;
  }

  public heal(): number {
    this.lifePoints = this.maxLifePoints;
    return this.lifePoints;
  }

  public attack(attackIndex: number, victim: Pokemon): void {
    if (attackIndex === undefined || attackIndex === null || attackIndex < 0) {
      throw new Error("Attack index must be a non-negative number");
    }
    if (attackIndex >= this.attacks.length) {
      throw new Error("Attack index out of range");
    }
    const selectedAttack = this.attacks[attackIndex];
    victim.setLifePoints(victim.getLifePoints() - selectedAttack.getDamage());
  }
}
