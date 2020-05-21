import { TestBed } from '@angular/core/testing';

import { CardUtils } from './card-utils';
import { GameUtils } from './game-utils';
import { PlayerUtils } from './player.utils';
import { IPlayer, Card, GameOptions, IGameInitData } from '../models';

const createPlayer = (id: string, isCreator: boolean): IPlayer => {
  return { id, name: id, hand: [], pointCards: [], isCreator };
};

describe('Bura game', () => {
  let cardService: CardUtils;
  let gameService: GameUtils;
  let playerService: PlayerUtils;

  let roomId = 'room';
  let options = new GameOptions();
  let player1: IPlayer;
  let player2: IPlayer;
  let player3: IPlayer;
  let gameInit: IGameInitData;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    cardService = TestBed.inject(CardUtils);
    gameService = TestBed.inject(GameUtils);
    playerService = TestBed.inject(PlayerUtils);
  });

  beforeEach(() => {
    player1 = createPlayer('player1', true);
    player2 = createPlayer('player2', false);
    player3 = createPlayer('player3', false);

    gameInit = {
      roomId,
      options,
      playerId: player1.id,
      isCreator: player1.isCreator,
    };
  });

  it('should be created', () => {
    expect(cardService).toBeTruthy();
    expect(gameService).toBeTruthy();
    expect(playerService).toBeTruthy();
  });

  it('should be game created', () => {
    const game = gameService.create(gameInit);

    expect(game).toBeTruthy();
    expect(game.state).toEqual('new');
    expect(game.creatorId).toEqual(player1.id);
    expect(game.players.length).toEqual(1);
  });

  it('should be able to join', () => {
    let game = gameService.create(gameInit);

    game = gameService.join(game, player2);
    expect(game.creatorId).toEqual(player1.id);
    expect(game.players.length).toEqual(2);

    game = gameService.join(game, player3);
    expect(game.creatorId).toEqual(player1.id);
    expect(game.players.length).toEqual(3);
  });

  it('should be started', () => {
    let game = gameService.create(gameInit);
    game = gameService.join(game, player2);
    game = gameService.join(game, player3);

    game = gameService.start(game);
    expect(game.state).toEqual('move');
    expect(game.deck).toBeTruthy();
    expect(game.trump).toBeTruthy();
    expect(game.beater).toBeTruthy();
    expect(game.current).toBeTruthy();
    expect(game.current).toEqual(game.beater);
  });

  it('should  fill hands of all players', () => {
    let game = gameService.create(gameInit);
    game = gameService.join(game, player2);
    game = gameService.join(game, player3);
    game = gameService.start(game);

    // game.players.forEach((player) => {
    //   expect(player.hand.length).toEqual(4);
    // });

    expect(game.players[0].hand.length).toEqual(4);
    expect(game.players[1].hand.length).toEqual(4);
    expect(game.players[2].hand.length).toEqual(4);

    expect(player1.hand.length).toEqual(0);
    expect(player2.hand.length).toEqual(0);
    expect(player3.hand.length).toEqual(0);
  });

  it('should select cards', () => {
    let selectedCards: Card[];
    let mover: IPlayer;
    let game = gameService.create(gameInit);
    game = gameService.join(game, player2);
    game = gameService.join(game, player3);
    game = gameService.start(game);

    // Before select
    mover = gameService.getPlayer(game, player1);
    selectedCards = playerService.selectedCards(mover);
    expect(selectedCards.length).toEqual(0);

    // Select
    game = gameService.selectCard(game, mover, mover.hand[0]);
    expect(mover.hand.length).toEqual(4);
    mover = gameService.getPlayer(game, mover);
    expect(mover.hand.length).toEqual(4);

    // After select
    selectedCards = playerService.selectedCards(mover);
    expect(selectedCards.length).toEqual(1);
    mover = gameService.getPlayer(game, mover);
    expect(mover.hand.length).toEqual(4);
    expect(selectedCards.length).toEqual(1);
  });

  it('should move cards', () => {
    let selectedCards: Card[];
    let mover: IPlayer;
    let game = gameService.create(gameInit);
    game = gameService.join(game, player2);
    game = gameService.join(game, player3);
    game = gameService.start(game);

    // Select
    mover = gameService.getPlayer(game, player1);
    game = gameService.selectCard(game, mover, mover.hand[0]);
    mover = gameService.getPlayer(game, mover);
    selectedCards = playerService.selectedCards(mover);
    expect(selectedCards.length).toEqual(1);
    expect(mover.hand.length).toEqual(4);

    // Move
    game = gameService.move(game, mover);
    mover = gameService.getPlayer(game, mover);
    selectedCards = playerService.selectedCards(mover);
    expect(selectedCards.length).toEqual(0);
    expect(mover.hand.length).toEqual(3);
  });
});
