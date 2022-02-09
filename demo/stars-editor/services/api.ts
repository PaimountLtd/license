import { sleep } from '../utils/sleep';
import { ISceneState } from '../interfeaces';

export class ApiService {
  async fetchScenes() {
    await sleep(1000);
    return scenesData;
  }
}

const scenesData: Record<string, ISceneState> = {
  scene1: {
    name: 'Scene 1',
    backgroundColor: 'blue',
    selectedItemId: 'star1',
    items: {
      star1: {
        color: 'yellow',
        angle: 0,
        width: 100,
        height: 100,
        position: {
          x: 0,
          y: 0,
        },
      },
      star2: {
        color: 'yellow',
        angle: 0,
        width: 100,
        height: 100,
        position: {
          x: 100,
          y: 100,
        },
      },
      star3: {
        color: 'yellow',
        angle: 0,
        width: 100,
        height: 100,
        position: {
          x: 200,
          y: 200,
        },
      },
    },
  },

  scene2: {
    name: 'Scene 2',
    backgroundColor: 'black',
    selectedItemId: 'star4',
    items: {
      star4: {
        color: 'yellow',
        angle: 0,
        width: 100,
        height: 100,
        position: {
          x: 0,
          y: 0,
        },
      },
      star5: {
        color: 'yellow',
        angle: 0,
        width: 100,
        height: 100,
        position: {
          x: 100,
          y: 100,
        },
      },
      star6: {
        color: 'yellow',
        angle: 0,
        width: 100,
        height: 100,
        position: {
          x: 200,
          y: 200,
        },
      },
    },
  },

};
