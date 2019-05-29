import { Injectable } from '@angular/core';
import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Observable, Subject } from 'rxjs';
import { ParametrosConsulta } from '../entities/parametrosConsulta';

interface MeuIPVADB extends DBSchema {
  'parametros-consulta': {
    key: string;
    value: {
      placa: string;
      renavam: string;
    };
  };
}

@Injectable({ providedIn: 'root' })
export class IdbService {
  private parametrosConsultaStorage: Subject<ParametrosConsulta>;
  private db: Promise<IDBPDatabase<MeuIPVADB>>;

  constructor() {
    this.db = openDB<MeuIPVADB>('my-db', 1, {
      upgrade(db) {
        const parametrosConsultaStorage = db.createObjectStore('parametros-consulta');
      }
    });
  }

  addItems(target: string, value: ParametrosConsulta) {
    this.db.then((db: any) => {
      const tx = db.transaction(target, 'readwrite');
      tx.objectStore(target).put({
        placa: value.placa,
        renavam: value.renavam
      });
      this.getAllData('Items').then((items: ParametrosConsulta) => {
        this.parametrosConsultaStorage.next(items);
      });
      return tx.complete;
    });
  }

  deleteItems(target: string, value: ParametrosConsulta) {
    this.db.then((db: any) => {
      const tx = db.transaction(target, 'readwrite');
      const store = tx.objectStore(target);
      store.delete(value);
      this.getAllData(target).then((items: ParametrosConsulta) => {
        this.parametrosConsultaStorage.next(items);
      });
      return tx.complete;
    });
  }

  getAllData(target: string) {
    return this.db.then((db: any) => {
      const tx = db.transaction(target, 'readonly');
      const store = tx.objectStore(target);
      return store.getAll();
    });
  }

  dataChanged(): Observable<ParametrosConsulta> {
    return this.parametrosConsultaStorage;
  }
}
