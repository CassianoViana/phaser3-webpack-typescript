import { Scene } from "phaser";
import CodeEditor from "../../controls/CodeEditor";
import { MecanicaRope } from "../../ct-platform-classes/MecanicaRope";
import Matrix, { MatrixMode } from "../../geom/Matrix";
import MazePhase from "../MazePhase";
import MazePhasesLoader from "../MazePhasesLoader";
import TutorialHelper from "../tutorial/TutorialHelper";

export default class HardcodedPhasesCreator {
  scene: Scene;
  codeEditor: CodeEditor;
  matrixMode: MatrixMode = MatrixMode.ISOMETRIC;
  gridCenterX: number;
  gridCenterY: number;
  gridCellWidth: number;
  tutorial: TutorialHelper

  constructor(scene: Scene, codeEditor: CodeEditor, gridCenterX: number, gridCenterY: number, gridCellWidth: number) {
    this.scene = scene;
    this.codeEditor = codeEditor;
    this.gridCenterX = gridCenterX;
    this.gridCenterY = gridCenterY;
    this.gridCellWidth = gridCellWidth;
    this.tutorial = new TutorialHelper(scene, codeEditor)
  }

  createHardCodedPhases(isTesting: boolean): Array<MazePhase> {
    let phases = new Array<MazePhase>();

    if (isTesting) {
      let phase = this.createEasyPhaseArrowUp()
      phase.commands = [
        ['arrow-up']
      ]
      phases.push(phase);

      phase = this.createEasyPhaseArrowUpAndRightIf()
      phase.commands = [
        ['arrow-up', 'prog_1:if_block', 'prog_0'],
        ['arrow-right', 'arrow-up']
      ]
      phases.push(phase);

      phase = this.createEasyPhaseArrowUp()
      phase.commands = [
        ['arrow-down', 'prog_1', 'arrow-up', 'arrow-up']
      ]
      phases.push(phase);

      phase = this.createEasyPhaseCallRecursiveFunction();
      phase.commands = [
        ['arrow-up', 'prog_0']
      ]
      phases.push(phase);

      phase = this.createDemoPhase();
      phase.commands = [
        ['arrow-right', 'prog_1'],
        ['arrow-up', 'prog_1']
      ]
      phases.push(phase);

      phase = this.createEasyPhaseArrowUpTwoTimes()
      phase.commands = [
        ['arrow-up', 'arrow-up']
      ]
      phases.push(phase);

      phase = this.createEasyPhaseArrowUpAndRight()
      phase.commands = [
        ['arrow-up', 'arrow-up', 'arrow-right', 'arrow-up']
      ]
      phases.push(phase);

      phase = this.createEasyPhaseWithMessages()
      phase.commands = [
        ['arrow-up', 'arrow-up', 'arrow-right', 'arrow-up']
      ]
      phases.push(phase);
    }

    if (!isTesting) {
      let showTutorial = true;
      phases.push(this.createPhaseToWalkThroughTheEdge())
      phases.push(this.createPhaseToAvoidBarriers(showTutorial))
      phases.push(this.createPhaseWithIfTutorial())
      phases.push(this.createEasyPhaseArrowUp(showTutorial));
      phases.push(this.createEasyPhaseArrowUpTwoTimes(showTutorial));
      phases.push(this.createEasyPhaseArrowUpAndRight(showTutorial));
      phases.push(this.createEasyPhaseCallRecursiveFunction(showTutorial));
      phases.push(this.createEasyPhaseArrowUp());
      phases.push(this.createEasyPhaseArrowUpTwoTimes());
      phases.push(this.createEasyPhaseCallRecursiveFunction());
      phases.push(this.createDemoPhase());
    }

    return phases;
  }

  private createDemoPhase(showTutorial: boolean = false) {
    const phase = new MazePhase(this.scene, this.codeEditor);
    phase.dudeFacedTo = 'right'
    phase.dudeStartPosition = { col: 1, row: 1 }

    let baseMatrix = [
      ['tile', 'tile', 'tile'],
      ['tile', 'tile', 'tile'],
      ['tile', 'tile', 'tile'],
      ['tile', 'tile', 'tile'],
      ['tile', 'tile', 'tile'],
    ];


    let obstaclesMatrix = [
      ['block', 'block', 'block'],
      ['block', 'null', 'blocknull'],
      ['block', 'block', 'block'],
      ['null', 'battery', 'null'],
      ['null', 'coin', 'null'],
    ];

    phase.setupTutorialsAndObjectsPositions = () => {
      phase.obstacles = new Matrix(
        this.scene,
        this.matrixMode,
        obstaclesMatrix,
        this.gridCenterX, this.gridCenterY, this.gridCellWidth
      );

      phase.ground = new Matrix(
        this.scene,
        this.matrixMode,
        baseMatrix,
        this.gridCenterX, this.gridCenterY, this.gridCellWidth
      );

      if (showTutorial) {
        this.tutorial.buildTutorial(phase,
          [
            'drag arrow-up say drag-up-to-program',
            'click btn-play say click-get-coin'
          ]
        )
      }
    }

    return phase;
  }

  private createEasyPhaseArrowUp(showTutorial: boolean = false) {
    const phase = new MazePhase(this.scene, this.codeEditor);
    phase.dudeFacedTo = 'down'
    phase.dudeStartPosition = { col: 1, row: 0 }

    let baseMatrix = [
      ['tile', 'tile', 'tile'],
      ['tile', 'tile', 'tile'],
      ['tile', 'tile', 'tile'],
    ];

    let obstaclesMatrix = [
      ['null', 'null', 'null'],
      ['null', 'coin', 'null'],
      ['null', 'null', 'null'],
    ];

    phase.setupTutorialsAndObjectsPositions = () => {
      phase.obstacles = new Matrix(
        this.scene,
        this.matrixMode,
        obstaclesMatrix,
        this.gridCenterX, this.gridCenterY, this.gridCellWidth
      );

      phase.ground = new Matrix(
        this.scene,
        this.matrixMode,
        baseMatrix,
        this.gridCenterX, this.gridCenterY, this.gridCellWidth
      );

      if (showTutorial) {
        this.tutorial.buildTutorial(phase,
          [
            'drag arrow-up say drag-up-to-program',
            'click btn-play say click-get-coin'
          ]
        )
      }
    }

    return phase;
  }

  private createPhaseWithIfTutorial(showTutorial: boolean = false) {
    let item = new MecanicaRope()
    item.x = 1;
    item.y = 0;
    item.face = 'down'

    item.mapa = [
      ['tile', 'tile', 'tile'],
      ['tile', 'tile', 'tile'],
      ['tile', 'tile', 'tile'],
    ];

    item.obstaculos = [
      ['null', 'null', 'null'],
      ['null', 'block', 'null'],
      ['null', 'null', 'null'],
    ];

    item.acoesTutorial = [
      { acao: 'click', elemento: 'arrow-up', frase: 'Clique para frente!' },
      { acao: 'click', elemento: 'arrow-up', frase: 'Clique para frente!' },
      { acao: 'drag', elemento: 'if_block', arrastarSobre: 'if_coin', frase: 'Clique para frente!' },
      { acao: 'click', elemento: 'btn-play', frase: 'Play!' }
    ]

    item.falasAntesDeIniciar = [
      "Testando fala enorme\ncom quebra de linha"
    ]

    let phase = this.mecanicaToPhase(item)
    return phase;
  }

  private createPhaseToAvoidBarriers(showTutorial: boolean = false) {
    let item = new MecanicaRope()
    /* item.falasAntesDeIniciar = [
      'Fase teste 1',
      // 'Mas antes...',
      // '...quase não alcancei a moeda!',
      // 'Temos que aprender ir mais longe!',
      // 'Se não, não vamos resgatar a próxima moeda',
    ] */
    item.comandosEsperados = ['UP', 'LEFT', 'UP', 'UP', 'PROG_1', 'UP', 'UP']
    item.face = "down"
    item.mapa = [
      ['tile', 'tile', 'null', 'null', 'null'],
      ['tile', 'tile', 'tile', 'tile', 'tile'],
      ['tile', 'tile', 'null', 'null', 'null'],
    ]
    item.obstaculos = [
      ['null', 'block', 'null', 'null', 'null'],
      ['null', 'coin', 'null', 'null', 'null'],
      ['block', 'block', 'null', 'null', 'null']
    ]
    if (showTutorial) {
      item.acoesTutorial = [
        { acao: 'click', elemento: 'arrow-up', frase: 'Começar!\nClique para\nfrente!' },
        { acao: 'click', elemento: 'arrow-left', frase: 'Agora para\nesquerda!' },
        { acao: 'click', elemento: 'arrow-up', frase: 'Para\nfrente!' },
        // {acao:'click',elemento:'arrow-up',frase:'Mais uma vez!'},
        // {acao:'click',elemento:'prog_1',frase:'USO MAIS\nUM NÍVEL!!!'},
        // {acao:'click',elemento:'arrow-up',frase:'Agora tenho\nespaço!'},
        // {acao:'click',elemento:'arrow-up',frase:'Bem mais espaço!!'},
        { acao: 'click', elemento: 'btn-play', frase: 'Play!' },
      ]
    }
    item.x = 0
    item.y = 0

    let phase = this.mecanicaToPhase(item)
    return phase;
  }

  private createPhaseToWalkThroughTheEdge() {
    let item = new MecanicaRope()
    item.ganhoBateriaAoCapturarPilha = 10
    // item.falasAntesDeIniciar = [
    //     'Fase teste 2',
    //     // 'Para alcançar a moeda...',
    //     // '...preciso pegar umas baterias pelo caminho.',
    //     // 'Vamos tentar?',
    // ],
    item.comandosEsperados = ["UP", "UP", "UP", "UP", "PROG_1", "LEFT", "PROG_0"]
    item.face = "down"
    item.mapa = [
      ['tile', 'null', 'tile', 'tile', 'tile'],
      ['tile', 'null', 'null', 'null', 'tile'],
      ['tile', 'null', 'null', 'null', 'tile'],
      ['tile', 'null', 'null', 'null', 'tile'],
      ['tile', 'tile', 'tile', 'tile', 'tile'],
    ]
    item.obstaculos = [
      ['null', 'null', 'coin', 'null', 'null'],
      ['battery', 'null', 'null', 'null', 'null'],
      ['null', 'null', 'null', 'null', 'null'],
      ['null', 'null', 'null', 'null', 'null'],
      ['null', 'null', 'null', 'null', 'battery']
    ]
    item.x = 0
    item.y = 0

    let phase = this.mecanicaToPhase(item)
    return phase;
  }

  mecanicaToPhase(item: MecanicaRope) {
    return new MazePhasesLoader(this.scene,
      null, this.codeEditor,
      this.matrixMode,
      this.gridCenterX,
      this.gridCenterY,
      this.gridCellWidth)
      .convertMecanicaRopeToPhase(item)
  }


  private createEasyPhaseArrowUpTwoTimes(showTutorial: boolean = false) {
    const phase = new MazePhase(this.scene, this.codeEditor);
    phase.dudeFacedTo = 'right'
    phase.dudeStartPosition = { col: 0, row: 1 }

    let baseMatrix = [
      ['tile', 'tile', 'tile'],
      ['tile', 'tile', 'tile'],
      ['tile', 'tile', 'tile'],
    ];

    let obstaclesMatrix = [
      ['null', 'null', 'null'],
      ['null', 'null', 'coin'],
      ['null', 'null', 'null'],
    ];

    phase.setupTutorialsAndObjectsPositions = () => {

      phase.obstacles = new Matrix(
        this.scene,
        this.matrixMode,
        obstaclesMatrix,
        this.gridCenterX, this.gridCenterY, this.gridCellWidth
      );

      phase.ground = new Matrix(
        this.scene,
        this.matrixMode,
        baseMatrix,
        this.gridCenterX, this.gridCenterY, this.gridCellWidth
      );
      if (showTutorial) {
        this.tutorial.buildTutorial(phase, [
          'drag arrow-up say drag-up',
          'drag arrow-up say drag-up',
          'click btn-step say click-here-i-go-step',
          'click btn-step say again-i-get-coin'
        ])
      }
    }
    return phase;
  }

  private createEasyPhaseArrowUpAndRight(showTutorial: boolean = false) {
    const phase = new MazePhase(this.scene, this.codeEditor);
    phase.dudeFacedTo = 'right'
    phase.dudeStartPosition = { col: 0, row: 0 }

    let baseMatrix = [
      ['tile', 'tile', 'tile'],
      ['null', 'null', 'tile'],
    ];

    let obstaclesMatrix = [
      ['null', 'null', 'null'],
      ['null', 'null', 'coin'],
    ];

    phase.setupTutorialsAndObjectsPositions = () => {

      phase.obstacles = new Matrix(
        this.scene,
        this.matrixMode,
        obstaclesMatrix,
        this.gridCenterX, this.gridCenterY, this.gridCellWidth
      );

      phase.ground = new Matrix(
        this.scene,
        this.matrixMode,
        baseMatrix,
        this.gridCenterX, this.gridCenterY, this.gridCellWidth
      );

      if (showTutorial) {
        this.tutorial.buildTutorial(phase, [
          'drag arrow-up say drag-up',
          'drag arrow-up say drag-up',
          'drag arrow-right say drag-right',
          'drag arrow-up say drag-up',
          'click btn-play say click-play',
        ])
      }
    }
    return phase;
  }

  private createEasyPhaseWithMessages() {
    const phase = new MazePhase(this.scene, this.codeEditor);
    phase.dudeFacedTo = 'right'
    phase.dudeStartPosition = { col: 0, row: 0 }

    let baseMatrix = [
      ['tile', 'tile', 'tile'],
      ['null', 'null', 'tile'],
    ];

    let obstaclesMatrix = [
      ['null', 'null', 'null'],
      ['null', 'null', 'coin'],
    ];

    phase.setupTutorialsAndObjectsPositions = () => {

      phase.obstacles = new Matrix(
        this.scene,
        this.matrixMode,
        obstaclesMatrix,
        this.gridCenterX, this.gridCenterY, this.gridCellWidth
      );

      phase.ground = new Matrix(
        this.scene,
        this.matrixMode,
        baseMatrix,
        this.gridCenterX, this.gridCenterY, this.gridCellWidth
      );

      phase.messagesBeforeStartPlay = ['Testando mensagens', 'Teste 1', 'Teste 2']

    }
    return phase;
  }

  private createEasyPhaseArrowUpAndRightIf() {
    const phase = new MazePhase(this.scene, this.codeEditor);
    phase.dudeFacedTo = 'right'
    phase.dudeStartPosition = { col: 0, row: 0 }

    let baseMatrix = [
      ['tile', 'tile', 'tile', 'tile'],
      ['null', 'null', 'tile', 'null'],
    ];

    let obstaclesMatrix = [
      ['null', 'null', 'null', 'block'],
      ['null', 'null', 'coin', 'null'],
    ];

    phase.setupTutorialsAndObjectsPositions = () => {

      phase.obstacles = new Matrix(
        this.scene,
        this.matrixMode,
        obstaclesMatrix,
        this.gridCenterX, this.gridCenterY, this.gridCellWidth
      );

      phase.ground = new Matrix(
        this.scene,
        this.matrixMode,
        baseMatrix,
        this.gridCenterX, this.gridCenterY, this.gridCellWidth
      );

    }
    return phase;
  }

  private createEasyPhaseCallRecursiveFunction(showTutorial: boolean = false) {
    const phase = new MazePhase(this.scene, this.codeEditor);
    phase.dudeFacedTo = 'right'
    phase.dudeStartPosition = { col: 0, row: 0 }

    let baseMatrix = [
      ['tile', 'tile', 'tile', 'tile', 'tile', 'tile', 'tile'],
    ];

    let obstaclesMatrix = [
      ['null', 'battery', 'null', 'battery', 'null', 'battery', 'coin'],
    ];

    phase.setupTutorialsAndObjectsPositions = () => {
      phase.obstacles = new Matrix(
        this.scene,
        this.matrixMode,
        obstaclesMatrix,
        this.gridCenterX, this.gridCenterY, this.gridCellWidth
      );

      phase.ground = new Matrix(
        this.scene,
        this.matrixMode,
        baseMatrix,
        this.gridCenterX, this.gridCenterY, this.gridCellWidth
      );

      if (showTutorial) {
        this.tutorial.buildTutorial(phase, [
          'drag arrow-up say drag-up',
          'drag prog_0 say drag-prog_0',
          'click btn-step say click-step',
          'click btn-step say click-step',
          'click btn-step say click-step',
          'click btn-step say click-step',
          'click btn-step say click-step',
        ]);
      }
    }

    return phase;
  }


  private createPhaseIfCoin() {
    const phase = new MazePhase(this.scene, this.codeEditor);
    phase.dudeFacedTo = 'down'
    phase.dudeStartPosition = { col: 3, row: 1 }

    let baseMatrix = [
      ['tile', 'tile', 'tile', 'tile', 'tile', 'tile', 'tile'],
      ['tile', 'tile', 'tile', 'tile', 'tile', 'tile', 'tile'],
      ['tile', 'tile', 'tile', 'tile', 'tile', 'tile', 'tile'],
      ['tile', 'tile', 'tile', 'tile', 'tile', 'tile', 'tile'],
      ['tile', 'tile', 'tile', 'tile', 'tile', 'tile', 'tile'],
      ['tile', 'tile', 'tile', 'tile', 'tile', 'tile', 'tile'],
      ['tile', 'tile', 'tile', 'tile', 'tile', 'tile', 'tile'],
    ];

    let obstaclesMatrix = [
      ['null', 'null', 'null', 'null', 'null', 'null', 'null'],
      ['null', 'null', 'null', 'null', 'null', 'null', 'null'],
      ['null', 'null', 'null', 'null', 'null', 'null', 'null'],
      ['null', 'null', 'null', 'null', 'null', 'null', 'null'],
      ['null', 'null', 'coin', 'coin', 'null', 'null', 'null'],
      ['null', 'null', 'null', 'null', 'null', 'null', 'null'],
      ['null', 'null', 'null', 'null', 'null', 'null', 'null'],
    ];

    phase.setupTutorialsAndObjectsPositions = () => {
      phase.obstacles = new Matrix(
        this.scene,
        this.matrixMode,
        obstaclesMatrix,
        this.gridCenterX, this.gridCenterY, this.gridCellWidth
      );

      phase.ground = new Matrix(
        this.scene,
        this.matrixMode,
        baseMatrix,
        this.gridCenterX, this.gridCenterY, this.gridCellWidth
      );

      this.tutorial.buildTutorial(phase, [
        'drag arrow-up',
        'drag arrow-up',
        'click btn-step',
        'click btn-step',
        'click btn-step',
      ])
    }

    return phase;
  }


}
