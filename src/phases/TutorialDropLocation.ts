import Command from "../program/Command";
import Program from "../program/Program";

export default class TutorialDropLocation {


    sprite: Phaser.GameObjects.Sprite;
    dropZone: Phaser.GameObjects.Zone;
    program: Program;
    position: { x: number; y: number; } = null;
    command: Command;

    constructor(program: Program, command: Command = null) {
        this.program = program;
        this.command = command;
        if (program) {
            this.sprite = program.sprite;
            this.dropZone = program.dropZone.zone;
        }
        if (command) {
            this.sprite = command.tileDropZone.sprite;
            this.dropZone = command.tileDropZone.zone;
        }
    }

    getXY(sprite: Phaser.GameObjects.Sprite): { x: number, y: number } {
        let position = null;
        if (this.position == null) {
            if (this.program) {
                let fakeCommand = new Command(this.program.scene, sprite)
                position = this.program.getNextFreePosition(fakeCommand)
            }
            if (this.command) {
                position = this.command.getConditionalPosition()
            }
            this.position = position;
        }
        return this.position
    }

    setDepth(depth: number) {
        this.program?.setDepth(depth)
    }

}
