import { TestBed } from '@angular/core/testing';

import { CardUtils } from '../utils/card-utils';
import { PlayerUtils } from '../utils/player.utils';
import { IPlayer, Card, GameOptions, IGameInitData } from '../models';
import { GameService } from '../services/game.service';
import { GamePodcastService } from '../services/game-podcast.service';

const createPlayer = (id: string, isCreator: boolean): IPlayer => {
  return { id, name: id, hand: [], pointCards: [], isCreator };
};

describe('Bura game service', () => {
  let cardUtils: CardUtils;
  let playerUtils: PlayerUtils;
  let gameService: GameService;

  let roomId = 'room';
  let options = new GameOptions();
  let player1: IPlayer;
  let player2: IPlayer;
  let player3: IPlayer;
  let gameInit: IGameInitData;

  beforeEach(() => {
    const podcast = {
      register: async () => Promise.resolve(true),
      notifyChanges: () => {},
    };

    TestBed.configureTestingModule({
      providers: [{ provide: GamePodcastService, useValue: podcast }],
    });
    cardUtils = TestBed.inject(CardUtils);
    playerUtils = TestBed.inject(PlayerUtils);
    gameService = TestBed.inject(GameService);
  });

  beforeEach(() => {
    player1 = createPlayer('player1', true);
    player2 = createPlayer('player2', false);
    player3 = createPlayer('player3', true);

    gameInit = {
      roomId,
      options,
      playerId: player1.id,
      isCreator: player1.isCreator,
    };
  });

  it('should be created', () => {
    expect(cardUtils).toBeTruthy();
    expect(gameService).toBeTruthy();
    expect(playerUtils).toBeTruthy();
  });

  it('should be game created', async () => {
    await gameService.init(gameInit);
    const game = gameService.game$.value;

    expect(game).toBeTruthy();
    expect(game.state).toEqual('new');
    // expect(game.creatorId).toEqual(player1.id);
    // expect(game.players.length).toEqual(0);
  });

  it('should be able to join', () => {
    gameService.init(gameInit);
    const game = gameService.game$.value;

    gameService.join(player2);
    expect(game.creatorId).toEqual(player1.id);
    expect(game.players.length).toEqual(1);

    gameService.join(player3);
    expect(game.creatorId).toEqual(player1.id);
    expect(game.players.length).toEqual(2);
  });

  it('should be started', () => {
    gameService.init(gameInit);
    const game = gameService.game$.value;
    gameService.join(player1);
    gameService.join(player2);
    gameService.join(player3);

    gameService.start();
    expect(game.state).toEqual('move');
    expect(game.deck).toBeTruthy();
    expect(game.trump).toBeTruthy();
    expect(game.beater).toBeTruthy();
    expect(game.current).toBeTruthy();
    expect(game.current).toEqual(game.beater);
  });

  it('should  fill hands of all players', () => {
    gameService.init(gameInit);
    const game = gameService.game$.value;
    gameService.join(player1);
    gameService.join(player2);
    gameService.join(player3);
    gameService.start();

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
    gameService.init(gameInit);
    const game = gameService.game$.value;
    gameService.join(player1);
    gameService.join(player2);
    gameService.join(player3);
    gameService.start();

    // Before select
    mover = gameService.getPlayer(player1);
    expect(mover).toBeTruthy();
    selectedCards = playerUtils.selectedCards(mover);
    expect(selectedCards.length).toEqual(0);

    // Select
    gameService.selectCard(mover, mover.hand[0]);
    expect(mover.hand.length).toEqual(4);
    mover = gameService.getPlayer(mover);
    expect(mover.hand.length).toEqual(4);

    // After select
    selectedCards = playerUtils.selectedCards(mover);
    expect(selectedCards.length).toEqual(1);
    mover = gameService.getPlayer(mover);
    expect(mover.hand.length).toEqual(4);
    expect(selectedCards.length).toEqual(1);
  });

  it('should move cards', () => {
    let selectedCards: Card[];
    let mover: IPlayer;
    gameService.init(gameInit);
    const game = gameService.game$.value;
    gameService.join(player1);
    gameService.join(player2);
    gameService.join(player3);
    gameService.start();

    // Select
    mover = gameService.getPlayer(player1);
    gameService.selectCard(mover, mover.hand[0]);
    mover = gameService.getPlayer(mover);
    selectedCards = playerUtils.selectedCards(mover);
    expect(selectedCards.length).toEqual(1);
    expect(mover.hand.length).toEqual(4);

    // Move
    gameService.move(mover);
    mover = gameService.getPlayer(mover);
    selectedCards = playerUtils.selectedCards(mover);
    expect(selectedCards.length).toEqual(0);
    expect(mover.hand.length).toEqual(3);
  });

  it('should baet cards', () => {
    let selectedCards: Card[];
    let mover: IPlayer;
    let beater: IPlayer;
    gameService.init(gameInit);
    const game = gameService.game$.value;
    gameService.join(player1);
    gameService.join(player2);
    gameService.join(player3);
    gameService.start();

    // Select
    mover = gameService.getPlayer(player1);
    gameService.selectCard(mover, mover.hand[0]);
    mover = gameService.getPlayer(mover);
    selectedCards = playerUtils.selectedCards(mover);
    // Move
    gameService.move(mover);

    // Beat
    beater = gameService.getPlayer(player2);
    gameService.selectCard(beater, beater.hand[0]);
    beater = gameService.getPlayer(beater);
    gameService.beat(beater);
    beater = gameService.getPlayer(beater);
    selectedCards = playerUtils.selectedCards(beater);
    expect(selectedCards.length).toEqual(0);
    expect(beater.hand.length).toEqual(3);
  });
});
