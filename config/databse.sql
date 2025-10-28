-- PostgreSQL

BEGIN;

-- Drop existing tables if they exist
DROP TABLE IF EXISTS pokemon_attacks CASCADE;
DROP TABLE IF EXISTS trainer_pokemon CASCADE;
DROP TABLE IF EXISTS attacks CASCADE;
DROP TABLE IF EXISTS pokemons CASCADE;
DROP TABLE IF EXISTS trainers CASCADE;

-- Trainers table
CREATE TABLE trainers (
    trainer_id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    level INT DEFAULT 0 CHECK (level >= 0),
    experience INT DEFAULT 0 CHECK (experience >= 0)
);

-- Pokemon table
CREATE TABLE pokemons (
    pokemon_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    life_points INT NOT NULL CHECK (life_points >= 0),
    max_life_points INT NOT NULL CHECK (max_life_points >= 1)
);

-- Attacks table
CREATE TABLE attacks (
    attack_id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    damage INT NOT NULL CHECK (damage >= 0),
    usage_limit INT NOT NULL CHECK (usage_limit >= 0),
    usage_counter INT DEFAULT 0 CHECK (usage_limit >= 0)
);

-- Junction table: Trainer owns Pokemon (one-to-many)
CREATE TABLE trainer_pokemon (
    trainer_id INT NOT NULL,
    pokemon_id INT NOT NULL,
    PRIMARY KEY (trainer_id, pokemon_id),
    FOREIGN KEY (trainer_id) REFERENCES trainers(trainer_id) ON DELETE CASCADE,
    FOREIGN KEY (pokemon_id) REFERENCES pokemons(pokemon_id) ON DELETE CASCADE
);

-- Junction table: Pokemon knows Attacks (many-to-many)
CREATE TABLE pokemon_attacks (
    pokemon_id INT NOT NULL,
    attack_id INT NOT NULL,
    usage_count INT DEFAULT 0 CHECK (usage_count >= 0),
    PRIMARY KEY (pokemon_id, attack_id),
    FOREIGN KEY (pokemon_id) REFERENCES pokemons(pokemon_id) ON DELETE CASCADE,
    FOREIGN KEY (attack_id) REFERENCES attacks(attack_id) ON DELETE CASCADE
);

-- Optional: Seed data
INSERT INTO attacks (name, damage, usage_limit) VALUES
    ('Tackle', 40, 35),
    ('Thunderbolt', 90, 15),
    ('Flamethrower', 90, 15),
    ('Water Gun', 40, 25),
    ('Vine Whip', 45, 25);

INSERT INTO pokemons (name, life_points, max_life_points) VALUES
    ('Pikachu', 100, 100),
    ('Charmander', 100, 100),
    ('Squirtle', 100, 100),
    ('Bulbasaur', 100, 100);

INSERT INTO trainers (name, level, experience) VALUES
    ('Ash', 1, 0),
    ('Misty', 1, 0),
    ('Brock', 1, 0);

-- Assign some pokemon to trainers
INSERT INTO trainer_pokemon (trainer_id, pokemon_id) VALUES
    (1, 1),  -- Ash has Pikachu
    (2, 3),  -- Misty has Squirtle
    (3, 4);  -- Brock has Bulbasaur

-- Teach some attacks to pokemon
INSERT INTO pokemon_attacks (pokemon_id, attack_id) VALUES
    (1, 1),  -- Pikachu knows Tackle
    (1, 2),  -- Pikachu knows Thunderbolt
    (2, 1),  -- Charmander knows Tackle
    (2, 3),  -- Charmander knows Flamethrower
    (3, 1),  -- Squirtle knows Tackle
    (3, 4),  -- Squirtle knows Water Gun
    (4, 1),  -- Bulbasaur knows Tackle
    (4, 5);  -- Bulbasaur knows Vine Whip

COMMIT;