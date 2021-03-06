import { Scene } from "phaser";
import Command from "./Command";

export default class CommandIntent {
    commandIntent: Command;

    constructor(scene: Scene, commandHovered: Command) {
        let scale = commandHovered.program.grid.scale;
        this.commandIntent = new Command(
            scene,
            scene.add.sprite(commandHovered.sprite.x,
                commandHovered.sprite.y,
                'intention_comamnd'),
        );
        this.commandIntent.sprite.scale = scale;
        this.commandIntent.isIntent = true;
        this.commandIntent.tileDropZone = commandHovered.tileDropZone;
        this.commandIntent.sprite.setDepth(1);
        let program = commandHovered.program;
        program.addCommand(this.commandIntent, commandHovered.index())
        this.commandIntent.setProgram(program);
    }

    consolidateIntentionToDrop(newCommand: Command) {
        let index = this.commandIntent.index();
        let program = this.commandIntent.program;
        this.commandIntent.removeSelf();
        newCommand.setProgram(program, index);
    }

}
