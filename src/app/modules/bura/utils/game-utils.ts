import { Injectable } from '@angular/core';
import { PlayerUtils } from './player.utils';
import { DeckService } from '../services/deck.service';
import { IGame, IPlayer, GameStats, Card, IGameInitData } from '../models';

@Injectable({ providedIn: 'root' })
export class GameUtils {
  constructor(
    private deckUtils: DeckService,
    private playerService: PlayerUtils
  ) {}

  public stateEmpty = (game: IGame) => ({ ...game, state: 'empty' });
  public stateNew = (game: IGame) => ({ ...game, state: 'new' });
  public stateMove = (game: IGame) => ({ ...game, state: 'move' });
  public stateBeat = (game: IGame) => ({ ...game, state: 'beat' });
  public stateTake = (game: IGame) => ({ ...game, state: 'take' });
  public stateEnd = (game: IGame) => ({ ...game, state: 'end' });

  public create(gameInitData: IGameInitData): IGame {
    let game: IGame = {
      state: gameInitData.state || 'new',
      roomId: gameInitData.roomId,
      options: gameInitData.options,
      players: [],
      deck: [],
      table: [],
      beatingCards: [],
      moves: 0,
      stats: new GameStats(),
    };

    if (gameInitData.isCreator) {
      game.creatorId = gameInitData.playerId;
    }

    return game;
  }

  public setCreatorId(game: IGame, creatorId: string): IGame {
    return { ...game, creatorId };
  }

  public hasJoined(game: IGame, player: IPlayer): boolean {
    return (
      game.players && game.players.find((item) => item.id === player.id) != null
    );
  }

  public join(game: IGame, player: IPlayer): IGame {
    if (this.hasJoined(game, player)) {
      return game;
    }

    return { ...game, players: [...(game.players || []), player] };
  }

  public start(game: IGame): IGame {
    const cards = this.deckUtils.generate();
    const lastCard = cards[cards.length - 1];
    const players = game.players;

    game = { ...game, deck: cards };
    game = { ...game, trump: lastCard };
    game = { ...game, beater: players[0] };
    game = { ...game, current: players[0] };

    game = this.fillHands(game);
    game = this.stateMove(game);

    return game;
  }

  public end(game: IGame): IGame {
    const stats = game.stats || new GameStats();
    stats.points = stats.points || {};
    stats.players = stats.players || [];
    stats.round = stats.round || 0;

    const options = game.options;
    options.pivots = options.pivots || {};

    const players = game.players;
    const pivots = options.pivots;

    const maxPoint = Math.max(
      ...players.map((player) => this.playerService.points(player))
    );

    const winners = players
      .filter((player) => this.playerService.points(player) == maxPoint)
      .map((player) => player.name);

    for (const player of players) {
      Object.keys(pivots).forEach((pivot) => {
        if (this.playerService.points(player) > +pivot) {
          stats.points[player.name] = pivots[pivot];
        }
      });
    }

    stats.lastWinners = winners;
    stats.round++;

    return { ...game, stats };
  }

  public getPlayer(game: IGame, player: IPlayer): IPlayer {
    return game.players.find((p) => p.id === player.id);
  }

  public selectCard(game: IGame, player: IPlayer, card: Card): IGame {
    let found = this.getPlayer(game, player);

    // update player's hand
    let updated = this.playerService.select(found, card, game.state);

    return this.updatePlayers(game, updated);
  }

  public updatePlayers(game: IGame, updated: IPlayer) {
    if (game.current.id === updated.id) {
      game = { ...game, current: updated };
    }

    if (game.beater.id === updated.id) {
      game = { ...game, beater: updated };
    }

    const players = game.players.map((player) =>
      player.id === updated.id ? updated : player
    );

    return { ...game, players };
  }

  public move(game: IGame, player: IPlayer): IGame {
    const selected = this.playerService.selectedCards(player);
    const updated = this.playerService.move(player);
    game = this.updatePlayers(game, updated);

    game = { ...game, beatingCards: selected };
    game = { ...game, beater: player };

    game = this.putOnTable(game, selected);
    game = this.nextPlayer(game);
    game = this.stateBeat(game);

    return game;
  }

  public beat(game: IGame, player: IPlayer): IGame {
    const beatingCards = game.beatingCards;
    const selected = this.playerService.selectedCards(player);
    const updated = this.playerService.move(player);
    game = this.updatePlayers(game, updated);

    if (this.canBeat(game, selected, beatingCards)) {
      game = { ...game, beatingCards: selected };
      game = { ...game, beater: updated };
    }

    game = this.putOnTable(game, selected);
    game = this.nextPlayer(game);

    return game;
  }

  public give(game: IGame, player: IPlayer): IGame {
    const selected = this.playerService.selectedCards(player);
    const updated = this.playerService.move(player);
    game = this.updatePlayers(game, updated);

    game = this.putOnTable(game, selected);
    game = this.nextPlayer(game);

    return game;
  }

  public endCirlce(game: IGame): IGame {
    let { beater, table } = game;

    let updated = this.playerService.collect(beater, table);
    updated = this.playerService.enableAll(updated);
    updated = this.playerService.deselectAll(updated);
    game = this.updatePlayers(game, updated);

    game = { ...game, beater: updated };
    game = { ...game, current: updated };
    game = { ...game, beatingCards: [] };
    game = { ...game, table: [] };

    game = this.stateMove(game);
    game = this.fillHands(game);

    const hasDeck = game.deck && game.deck.length;
    const hasHand = beater.hand && beater.hand.length;
    if (!hasDeck && !hasHand) {
      game = this.stateEnd(game);
      game = this.end(game);
    }

    return game;
  }

  public fillHands(game: IGame): IGame {
    if (!game.deck) return game;
    if (!game.deck.length) return game;

    let { deck, players } = game;

    for (let index = 0; index < 4; index++) {
      players = players.map((player) => {
        if (this.playerService.canTake(player)) {
          const hand = deck.splice(0, 1);
          player = this.playerService.take(player, hand);
        }

        return player;
      });
    }

    return { ...game, deck, players };
  }

  public nextPlayer(game: IGame): IGame {
    const players = game.players;
    const current = game.current;
    const moves = game.moves + 1;

    if (moves === players.length) {
      game = { ...game, moves: 0 };
      game = this.endCirlce(game);
      return game;
    }

    const index = players.findIndex((player) => player.id === current.id);
    const nextPlayer = players[(index + 1) % players.length];

    game = { ...game, current: nextPlayer };
    game = { ...game, moves: moves };

    return game;
  }

  public canBeat(game: IGame, current: Card[], target: Card[]): boolean {
    return this.deckUtils.canBeat(current, target, game.trump.suit);
  }

  public putOnTable(game: IGame, cards: Card[]): IGame {
    return { ...game, table: [...(game.table || []), ...cards] };
  }
}
