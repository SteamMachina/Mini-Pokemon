import { Trainer } from "./Trainer";
import { Pokemon } from "./Pokemon";

export class Combat {
  public runBattle(trainers: Trainer[], isRandom: boolean): Trainer[] {
    // choose random starter
    let trainer1: Trainer;
    let trainer2: Trainer;
    if (Math.floor(Math.random() * 2) === 0) {
      trainer1 = trainers[0];
      trainer2 = trainers[1];
    } else {
      trainer1 = trainers[1];
      trainer2 = trainers[0];
    }
    console.log(`${trainer1.getName()} starts.`);

    if (isRandom) {
      // heal all pokemons
      trainer1.healAllPokemons();
      trainer2.healAllPokemons();
      console.log(`All pokemons healed.`);

      // select pokemons
      var pokemon1 = trainer1.chooseRandomPokemon();
      if (pokemon1 === null) {
        return [trainer1, trainer2];
      }
      var pokemon2 = trainer2.chooseRandomPokemon();
      if (pokemon2 === null) {
        return [trainer1, trainer2];
      }
    } else {
      // select pokemons
      var pokemon1 = trainer1.chooseBestPokemon();
      if (pokemon1 === null) {
        return [trainer1, trainer2];
      }
      var pokemon2 = trainer2.chooseBestPokemon();
      if (pokemon2 === null) {
        return [trainer1, trainer2];
      }
    }

    // battle until a pokemon dies
    let round = 0;
    while (pokemon1.getLifePoints() > 0 && pokemon2.getLifePoints() > 0) {
      round++;
      console.log(`Round ${round}:`);

      // Pokemon 1 attacks
      let attack1 = pokemon1.selectRandomAttack();
      if (attack1 === null) {
        console.log(`${pokemon1.getName()} has no usable attacks.`);
        break;
      }
      console.log(`${pokemon1.getName()} used ${attack1.getName()}.`);
      pokemon1.attack(attack1, pokemon2);
      pokemon1.dispLifePoints();
      pokemon2.dispLifePoints();

      // Check if pokemon2 is dead
      if (pokemon2.getLifePoints() <= 0) {
        break;
      }

      // Pokemon 2 attacks
      let attack2 = pokemon2.selectRandomAttack();
      if (attack2 === null) {
        console.log(`${pokemon2.getName()} has no usable attacks.`);
        break;
      }
      console.log(`${pokemon2.getName()} used ${attack2.getName()}.`);
      pokemon2.attack(attack2, pokemon1);
      pokemon1.dispLifePoints();
      pokemon2.dispLifePoints();
    }

    // check who won
    if (pokemon1.getLifePoints() > 0) {
      trainer1.gainXP();
      console.log(
        `${trainer1.getName()} with ${pokemon1.getName()} won the rounds.`
      );
      trainer1.dispScore();
      trainer2.dispScore();
    } else {
      trainer2.gainXP();
      console.log(
        `${trainer2.getName()} with ${pokemon2.getName()} won the rounds.`
      );
      trainer1.dispScore();
      trainer2.dispScore();
    }
    return [trainer1, trainer2];
  }

  public runGym(trainers: Trainer[], isRandom: boolean): Trainer[] {
    // battle 100 times
    // heal all pokemons
    let battle = 1;
    if (isRandom) {
      trainers[0].healAllPokemons();
      trainers[1].healAllPokemons();
      while (battle <= 100) {
        console.log(`battle ${battle} : `);
        this.runBattle(trainers, isRandom);
        battle++;
      }
    } else {
      while (
        battle <= 100 &&
        trainers[0].livePokemons().length != 0 &&
        trainers[1].livePokemons().length != 0
      ) {
        console.log(`battle ${battle} : `);
        this.runBattle(trainers, isRandom);
        battle++;
      }
    }

    // check who won
    const trainer1 = trainers[0];
    const trainer2 = trainers[1];
    const trainer1Level = trainer1.getLevel();
    const trainer2Level = trainer2.getLevel();
    const trainer1XP = trainer1.getXP();
    const trainer2XP = trainer2.getXP();

    trainer1.dispScore();
    trainer2.dispScore();

    if (trainer1Level > trainer2Level) {
      console.log(`${trainer1.getName()} won the battles.`);
    } else if (trainer2Level > trainer1Level) {
      console.log(`${trainer2.getName()} won the battles.`);
    } else {
      if (trainer1XP > trainer2XP) {
        console.log(`${trainer1.getName()} won the battles.`);
      } else if (trainer2XP > trainer1XP) {
        console.log(`${trainer2.getName()} won the battles.`);
      } else {
        console.log(`It's a draw.`);
      }
    }
    return [trainer1, trainer2];
  }

  public randomBattle(inputTrainers: Trainer[]): Trainer[] {
    const trainers = this.runBattle(inputTrainers, true);
    return trainers;
  }
  public randomGym(inputTrainers: Trainer[]): Trainer[] {
    const trainers = this.runGym(inputTrainers, true);
    return trainers;
  }
  public deterministBattle(inputTrainers: Trainer[]): Trainer[] {
    const trainers = this.runBattle(inputTrainers, false);
    return trainers;
  }
  public deterministGym(inputTrainers: Trainer[]): Trainer[] {
    const trainers = this.runGym(inputTrainers, false);
    return trainers;
  }
}
