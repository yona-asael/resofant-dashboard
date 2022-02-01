import { Injectable } from '@angular/core';

import { IpcRenderer} from 'electron';

@Injectable({
  providedIn: 'root'
})
export class ElectronIpcService {
  private ipc: IpcRenderer;

  constructor() { 
    if ((<any>window).require) {
      try {
        this.ipc = (<any>window).require('electron').ipcRenderer
      } catch (error) {
        throw error;
      }
    } else {
      console.warn('Could not load electron ipc');
    }
  }

  send() {
    this.ipc.send('wrote-pdf');
  }
}
