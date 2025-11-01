import { Trainer } from "./Trainer";
import { Pokemon } from "./Pokemon";

export class Combat {
  randomBattle(trainers: Trainer[]): void {
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
    console.log(`${trainer1.getName} starts.`);

    // heal all pokemons
    trainer1.healAllPokemons();
    trainer2.healAllPokemons();
    console.log(`All pokemons healed.`);

    // select pokemons
    const pokemon1 = trainer1.chooseRandomPokemon();
    if (pokemon1 === null) {
      return;
    }
    const pokemon2 = trainer2.chooseRandomPokemon();
    if (pokemon2 === null) {
      return;
    }

    // battle until a pokemon dies
    let round = 0;
    while (pokemon1.getLifePoints() > 0 && pokemon2.getLifePoints() > 0) {
      round++;
      console.log(`Round ${round}:`);
      let attack1 = pokemon1.selectRandomAttack();
      console.log(`${pokemon1.getName} used ${attack1}.`);
      pokemon1.dispLifePoints();
      pokemon2.dispLifePoints();
      let attack2 = pokemon2.selectRandomAttack();
      console.log(`${pokemon2.getName} used ${attack2}.`);
      pokemon1.dispLifePoints();
      pokemon2.dispLifePoints();
    }

    // check who won
    if (pokemon1.getLifePoints() > 0) {
      trainer1.gainXP();
      console.log(`${trainer1} with ${pokemon1} won the rounds.`);
      trainer1.dispScore();
      trainer2.dispScore();
    } else {
      trainer2.gainXP();
      console.log(`${trainer2} with ${pokemon2} won the rounds.`);
      trainer1.dispScore();
      trainer2.dispScore();
    }
    return;
  }

  randomGym(trainers: Trainer[]): void {
    // battle 100 times
    let battle = 1;
    while (
      battle <= 100 &&
      trainers[0].livePokemons().length != 0 &&
      trainers[0].livePokemons().length != 0
    ) {
      console.log(`battle ${battle} : `);
      this.randomBattle(trainers);
      battle++;
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
  }
}
