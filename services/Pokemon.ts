import { Attack } from "./Attack";

export class Pokemon {
  private name: string;
  private lifePoints: number;
  private maxLifePoints: number;
  private attacks: Attack[];

  public constructor(
    name: string = "Pikachu",
    lifePoints: number = 100,
    maxLifePoints: number = 100,
    attacks: Attack[] = []
  ) {
    if (!name || name.trim() === "") {
      throw new Error("Name cannot be empty");
    }
    if (
      lifePoints === undefined ||
      maxLifePoints === null ||
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
    this.lifePoints = lifePoints;
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
      maxLifePoints < 0
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
    // reset usage counters of all attacks upon heal (taverne)
    this.attacks.forEach((atk) => atk.resetUsage());
    return this.lifePoints;
  }

  public attack(attack: Attack, victim: Pokemon): void {
    if (!attack.canUse()) {
      throw new Error("Selected attack cannot be used anymore");
    }
    attack.useOnce();
    const remaining = Math.max(0, victim.getLifePoints() - attack.getDamage());
    victim.setLifePoints(remaining);
  }

  public selectRandomAttack(): Attack | null {
    const useableAttacks: Attack[] = [];
    this.attacks.forEach((attack) => {
      if (attack.canUse()) {
        useableAttacks.push(attack);
      }
    });
    if (useableAttacks.length === 0) {
      return null;
    }
    const index = Math.floor(Math.random() * useableAttacks.length);
    return useableAttacks[index] || null;
  }

  public dispLifePoints(): void {
    console.log(`${this.getName()} has ${this.getLifePoints()} life points.`);
  }
}
