export default class DragAndDropManager {
  constructor() {
    this.dropArea = document.querySelector('#dropArea');
    this.onDropHandler = () => {};
  }

  initialize({ onDropHandler }) {
    this.onDropHandler = onDropHandler;
    this.disableDragAndDropEvents();
    this.enableHighLightOnDrag();
    this.enableDrop();
  }

  disableDragAndDropEvents() {
    const events = ['dragenter', 'dragover', 'dragleave', 'drop'];

    const preventDefault = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    events.forEach((eventName) => {
      this.dropArea.addEventListener(eventName, preventDefault, false);
      document.body.addEventListener(eventName, preventDefault, false);
    });
  }

  enableHighLightOnDrag() {
    const events = ['dragenter', 'dragover'];

    const hightLight = (e) => {
      this.dropArea.classList.add('highlight');
      this.dropArea.classList.add('drop-area');
    };

    events.forEach((eventName) => {
      this.dropArea.addEventListener(eventName, hightLight, false);
    });
  }

  enableDrop(e) {
    const drop = (e) => {
      this.dropArea.classList.remove('drop-area');

      const files = e.dataTransfer.files;
      return this.onDropHandler(files);
    };

    this.dropArea.addEventListener('drop', drop, false);
  }
}
