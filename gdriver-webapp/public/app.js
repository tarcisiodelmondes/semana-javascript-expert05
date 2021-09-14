import AppController from './src/appController.js';
import ConnectionManager from './src/connectionManager.js';
import DragAndDropManager from './src/dragAndDropManager.js';
import ViewManager from './src/viewManager.js';

// Mude o valor da API_URL para https://0.0.0.0:3000/
// se estiver em ambiente de desenvolvimento
const API_URL = 'https://gdriver-js.herokuapp.com/';

const appController = new AppController({
  viewManager: new ViewManager(),
  dragAndDropManager: new DragAndDropManager(),
  connectionManager: new ConnectionManager({ apiUrl: API_URL }),
});

try {
  appController.initialize();
} catch (error) {
  console.error('error on initializing', error);
}
