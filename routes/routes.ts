import { TrainerModel } from "../models/TrainerModel";
import { PokemonModel } from "../models/PokemonModel";
import { AttackModel } from "../models/AttackModel";
import { Attack } from "../services/Attack";
import { Pokemon } from "../services/Pokemon";
import { Trainer } from "../services/Trainer";
import { Router } from "express";

const router = Router();

const trainerModel = new TrainerModel();
const pokemonModel = new PokemonModel();
const attackModel = new AttackModel();

function serializeTrainer(trainer: Trainer) {
  return {
    name: trainer.getName(),
    level: trainer.getLevel(),
    experience: trainer.getXP(),
  };
}

function serializePokemon(pokemon: Pokemon) {
  return {
    name: pokemon.getName(),
    lifePoints: pokemon.getLifePoints(),
    maxLifePoints: pokemon.getMaxLifePoints(),
  };
}

function serializeAttack(attack: Attack) {
  return {
    name: attack.getName(),
    damage: attack.getDamage(),
    usageLimit: attack.getUsageLimit(),
    usageCounter: attack.getUsageCounter(),
  };
}

router.get("/trainers", async (req, res) => {
  try {
    const trainers = await trainerModel.findAll();
    res.json(trainers.map(serializeTrainer));
  } catch (err) {
    console.error("Failed to list trainers", err);
    res.status(500).json({ error: "Failed to list trainers" });
  }
});

export default router;
