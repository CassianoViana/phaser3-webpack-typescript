import Matrix, { MatrixMode } from '../geom/Matrix';
import IsometricPoint from '../geom/IsometricPoint';
import Command from '../program/Command';
import CommandAction from '../program/CommandAction';
import Dude from './Dude';
import { Branch } from "./Branch";
import { Logger } from '../main';

const TIME_CALL_BRANCH = 200

export class DudeMove {

  name: string;
  dude: Dude;
  action: CommandAction;
  point: IsometricPoint;
  x: number;
  y: number;
  next?: DudeMove;
  executing: boolean = false;
  couldExecute: boolean;
  command: Command;
  branch: Branch;
  onTryExecuteConsumeEnergy: () => boolean = () => true;

  constructor(dude: Dude, command: Command) {
    this.dude = dude;
    this.command = command;
    this.action = command?.getAction();
  }

  setNext(move: DudeMove) {
    this.next = move;
  }

  prepareMove(x: number, y: number, commandAction: CommandAction, currentFace: string): { newX: number; newY: number; newFace: string; animation: string; } {
    let newFace = currentFace;
    let newX = x;
    let newY = y;
    let move = commandAction.action;

    if (move == 'down') {
      if (currentFace == 'up') { newY++; }
      if (currentFace == 'down') { newY--; }
      if (currentFace == 'left') { newX++; }
      if (currentFace == 'right') { newX--; }
    }

    if (move == 'up') {
      if (currentFace == 'up') { newY--; }
      if (currentFace == 'down') { newY++; }
      if (currentFace == 'left') { newX--; }
      if (currentFace == 'right') { newX++; }
    }

    if (move == 'right') {
      if (currentFace == 'up') { newFace = 'right'; }
      if (currentFace == 'down') { newFace = 'left'; }
      if (currentFace == 'left') { newFace = 'up'; }
      if (currentFace == 'right') { newFace = 'down'; }
    }

    if (move == 'left') {
      if (currentFace == 'up') { newFace = 'left'; }
      if (currentFace == 'down') { newFace = 'right'; }
      if (currentFace == 'left') { newFace = 'down'; }
      if (currentFace == 'right') { newFace = 'up'; }
    }
    let animation = newFace;
    if (this.dude.matrix.mode == MatrixMode.ISOMETRIC) {
      animation = currentFace + "-" + newFace;
    }

    return { newX, newY, newFace, animation };
  }


  update() {
    if (this.executing) {
      if (this.point) {
        if (this.dude.achieved(this.point)) {
          Logger.log("MOVE_ACHIEVED [x,y,couldExecute,name]", this.x, this.y, this.couldExecute, this.command.name);
          this.onCompleteMove();
        }
      }
    }
  }

  animate() {
    this.command.animateSprite(this.couldExecute);
  }

  disanimate() {
    this.command.disanimateSprite();
  }

  onCompleteMove(moveToComplete: DudeMove = null) {
    this.dude.onCompleteMove(moveToComplete || this);
  }

  onBranchMove() {
    let onCompleteBranch = () => {
      Logger.log('BRANCH_ON_COMPLETE [prog.name]', this.branch?.program?.name);
      this.disanimate();
    };
    const moveToContinueWhenBackToThisBranch = this.next;
    const progToCall = this.action;
    this.branch = new Branch(moveToContinueWhenBackToThisBranch, onCompleteBranch);
    this.dude.setTimeout(() => {
      this.dude.onBranch(progToCall.action, this.branch);
    }, TIME_CALL_BRANCH)

  }

  execute(previousMove: DudeMove = null) {

    this.dude.branchStack = this.dude.branchStack.filter(branch => {
      return branch?.dudeMove?.command != this.command
    })

    Logger.log("DUDE_MOVE", this.action);

    this.executing = true;
    let branched = this.isProgMove();
    let turnMove = this.action.isTurnMove();
    let isCondition = this.action.isCondition();
    let hasEnergy = isCondition || branched || this.onTryExecuteConsumeEnergy();

    if (previousMove == null) {
      this.x = this.dude.x;
      this.y = this.dude.y;
    } else {
      this.x = previousMove.x;
      this.y = previousMove.y;
    }

    let isConditionValid = this.dude?.isConditionValid(this.action.action, this);

    let { newX, newY, newFace, animation } = this.prepareMove(this.x, this.y, this.action, this.dude.currentFace);
    Logger.log("PREPARE_MOVE [prev xy] [next xy]", this.x, this.y, newX, newY);
    this.dude.currentFace = newFace;
    this.couldExecute = this.dude.canMoveTo(newX, newY) && isConditionValid && hasEnergy;

    this.animate();

    if (isCondition) {
      if (isConditionValid) {
        this.command.highlightTrueState();
      } else {
        this.command.highlightFalseState();
      }
    }

    if (this.couldExecute) {
      this.x = newX;
      this.y = newY;
    }

    if (branched) {
      this.onBranchMove();
    }

    if (turnMove) {
      this.dude.setTimeout(() => { this.onCompleteMove(); }, 800);
      if (this.couldExecute)
        this.dude.playAnimation(animation);
    }

    if (!branched && !turnMove) {
      Logger.log('MOVE [x,y]', this.x, this.y);
      if (this.couldExecute) {
        this.point = this.dude.matrix.getPoint(this.y, this.x);
        this.dude.moveTo(this);
      } else {
        if (!isCondition) {
          this.dude.warmBlocked();
        }
        this.dude.setTimeout(() => {
          let moveToContinue: DudeMove = this;
          if (isCondition) {
            moveToContinue = this.next;
            moveToContinue.x = this.x;
            moveToContinue.y = this.y;
          }
          this.onCompleteMove(moveToContinue);
        }, 800);
      }
    }
  }

  isProgMove() {
    return this.command.isProgCommand();
  }

  getAheadPosition(): { x: number, y: number } {
    let x = this.x;
    let y = this.y;
    if (this.dude.currentFace == "down") {
      y++;
    }
    if (this.dude.currentFace == "up") {
      y--;
    }
    if (this.dude.currentFace == "left") {
      x--;
    }
    if (this.dude.currentFace == "right") {
      x++;
    }
    return { x, y }
  }
}
