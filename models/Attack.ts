export class Attack {
  private name: string;
  private damage: number;
  private usageLimit: number;
  private usageCounter: number;

  public constructor(
    name: string = "Wait",
    damage: number = 0,
    usageLimit: number = 100,
    usageCounter: number = 0
  ) {
    if (!name || name.trim() === "") {
      throw new Error("Name cannot be empty");
    }
    if (damage === undefined || damage === null || damage < 0) {
      throw new Error("Damage must be a non-negative number");
    }
    if (usageLimit === undefined || usageLimit === null || usageLimit < 0) {
      throw new Error("Usage limit must be a non-negative number");
    }
    if (
      usageCounter === undefined ||
      usageCounter === null ||
      usageCounter < 0
    ) {
      throw new Error("Usage counter must be a non-negative number");
    }
    this.name = name;
    this.damage = damage;
    this.usageLimit = usageLimit;
    this.usageCounter = usageCounter;
  }

  // getters
  public getName(): string {
    return this.name;
  }
  public getDamage(): number {
    return this.damage;
  }
  public getUsageLimit(): number {
    return this.usageLimit;
  }
  public getUsageCounter(): number {
    return this.usageCounter;
  }

  // setters
  public setName(name: string): string {
    if (!name || name.trim() === "") {
      throw new Error("Name cannot be empty");
    }
    this.name = name;
    return this.name;
  }
  public setDamage(damage: number): number {
    if (damage === undefined || damage === null || damage < 0) {
      throw new Error("Damage must be a non-negative number");
    }
    this.damage = damage;
    return this.damage;
  }
  public setUsageLimit(usageLimit: number): number {
    if (usageLimit === undefined || usageLimit === null || usageLimit < 0) {
      throw new Error("Usage limit must be a non-negative number");
    }
    this.usageLimit = usageLimit;
    return this.usageLimit;
  }
  public setUsageCounter(usageCounter: number): number {
    if (
      usageCounter === undefined ||
      usageCounter === null ||
      usageCounter < 0
    ) {
      throw new Error("Usage counter must be a non-negative number");
    }
    this.usageCounter = usageCounter;
    return this.usageCounter;
  }
}
