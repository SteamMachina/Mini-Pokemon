export class Attack {
  private name: string;
  private damage: number;
  private usageLimit: number;
  private usageCounter: number;
  private id: number;

  public constructor(
    name: string = "Wait",
    damage: number = 0,
    usageLimit: number = 100,
    usageCounter: number = 0,
    id: number = 0
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
    this.id = id;
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
  public getId(): number {
    return this.id;
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

  public setId(id: number): number {
    if (id === undefined || id === null || id < 0) {
      throw new Error("ID must be a non-negative number");
    }
    this.id = id;
    return this.id;
  }

  // usage helpers
  public canUse(): boolean {
    return this.usageCounter < this.usageLimit;
  }

  public useOnce(): number {
    if (!this.canUse()) {
      throw new Error("Attack usage limit reached");
    }
    this.usageCounter += 1;
    return this.usageCounter;
  }

  public resetUsage(): void {
    this.usageCounter = 0;
  }

  public displayAttack(): string {
    return `name : ${this.name}\n;
    damage : ${this.damage}\n;
    usage limit : ${this.usageLimit}\n;
    usage counter : ${this.usageCounter}\n`;
  }
}
