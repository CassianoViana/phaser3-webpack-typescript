import Matrix from '../geom/Matrix';
import IsometricPoint from '../geom/IsometricPoint';
import Command from '../program/Command';
import CommandAction from '../program/CommandAction';
import Dude, { Branch } from './Dude';

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
      if (currentFace == 'up') { newX; newY++; }
      if (currentFace == 'down') { newX; newY--; }
      if (currentFace == 'left') { newX++; newY; }
      if (currentFace == 'right') { newX--; newY; }
    }

    if (move == 'up') {
      if (currentFace == 'up') { newX; newY--; }
      if (currentFace == 'down') { newX; newY++; }
      if (currentFace == 'left') { newX--; newY; }
      if (currentFace == 'right') { newX++; newY; }
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
    if (this.dude.matrix.mode == Matrix.ISOMETRIC) {
      animation = currentFace + "-" + newFace;
    }

    return { newX, newY, newFace, animation };
  }


  update() {
    if (this.executing) {
      if (this.point) {
        if (this.dude.achieved(this.point)) {
          console.log("MOVE_ACHIEVED [x,y,couldExecute,name]", this.x, this.y, this.couldExecute, this.command.name);
          this.onCompleteMove();
        }
      }
    }
  }

  animate() {
    this.command.animateSprite();
  }

  disanimate() {
    this.command.disanimateSprite();
  }

  onCompleteMove(moveToComplete: DudeMove = null) {
    this.disanimate();
    this.dude.onCompleteMove(moveToComplete || this);
  }

  onBranchMove() {
    let onCompleteBranch = () => {
      let branch = this.branch;
      console.log('BRANCH_ON_COMPLETE [prog.name]', branch.program.name);
      this.disanimate();
    };
    const moveToContinueWhenBackToThisBranch = this.next;
    const progToCall = this.action;
    this.branch = new Branch(moveToContinueWhenBackToThisBranch, onCompleteBranch);
    this.dude.onBranch(progToCall.action, this.branch);
  }

  execute(previousMove: DudeMove = null) {
    console.log("DUDE_MOVE", this.action);

    this.executing = true;
    let branched = this.isProgMove();
    let turnMove = this.action.isTurnMove();
    let isCondition = this.action.isCondition();

    this.animate();

    this.command.sprite.setTint(0xffff00);
    this.dude.setTimeout(() => {
      this.command.sprite.clearTint();
      //this.disanimate();
    }, 80);

    if (previousMove == null) {
      this.x = this.dude.x;
      this.y = this.dude.y;
    } else {
      this.x = previousMove.x;
      this.y = previousMove.y;
    }

    let { newX, newY, newFace, animation } = this.prepareMove(this.x, this.y, this.action, this.dude.currentFace);
    console.log("PREPARE_MOVE [prev xy] [next xy]", this.x, this.y, newX, newY);
    this.dude.currentFace = newFace;
    this.couldExecute = this.dude.canMoveTo(newX, newY);

    if (this.couldExecute) {
      this.x = newX;
      this.y = newY;
    }

    if (isCondition) {
      const isConditionValid = this.dude?.isConditionValid(this.action.action, this.dude.x, this.dude.y);
      if (!isConditionValid) {
        this.couldExecute = false
      }
    }

    if (branched) {
      this.onBranchMove();
    }

    if (turnMove) {
      this.dude.setTimeout(() => { this.onCompleteMove(); }, 600);
      this.dude.playAnimation(animation);
    }

    if (!branched && !turnMove) {
      console.log('MOVE [x,y]', this.x, this.y);
      if (this.couldExecute) {
        this.point = this.dude.matrix.getPoint(this.y, this.x);
        this.dude.moveTo(this);
      } else {
        if (!isCondition)
          this.dude.warmBlocked();
        this.dude.setTimeout(() => {
          let moveToContinue: DudeMove = this;
          if (isCondition) {
            moveToContinue = this.next;
            moveToContinue.x = this.x;
            moveToContinue.y = this.y;
          }
          this.onCompleteMove(moveToContinue);
        }, 500);
      }
    }
  }

  isProgMove() {
    return this.command.isProgCommand();
  }
}
