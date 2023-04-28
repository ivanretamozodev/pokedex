import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PokemonResponse } from './interfaces/pokemon.response.interface';
import { Pokemon } from '../pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly PokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter,
  ) {}

  public async executeSeed() {
    await this.PokemonModel.deleteMany({});
    const pokemonToInsert: { name: string; no: number }[] = [];
    const data = await this.http.get<PokemonResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=650 ',
    );
    data.results.forEach(({ name, url }) => {
      const segments = url.split('/');
      const no = +segments[segments.length - 2];
      pokemonToInsert.push({ name, no });
    });
    await this.PokemonModel.insertMany(pokemonToInsert);
    return 'SEED EXECUTED';
  }
}
