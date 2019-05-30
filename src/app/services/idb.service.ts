import { Injectable } from '@angular/core';
import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Observable, Subject } from 'rxjs';
import { ParametrosConsulta } from '../entities/parametrosConsulta';

@Injectable({ providedIn: 'root' })
export class IdbService {
  private parametrosConsultaStorage: Subject<ParametrosConsulta>;
  private db: Promise<IDBPDatabase>;

  constructor() {}

  connectToIDB() {
    this.db = openDB('meu-ipva', 1, {
      upgrade(db) {
        db.createObjectStore('parametros-consulta');
      }
    });
  }

  get(target: string, key: string): any {
    return this.db.then((db: any) => {
      const tx = db.transaction(target, 'readonly');
      const store = tx.objectStore(target);
      return store.get(key);
    });
  }

  put(target: string, value: any, key: string) {
    this.db.then((db: any) => {
      // const tx = db.transaction(target, 'readwrite');
      // const store = tx.objectStore(target);
      db.put(target, value, key);
    });
  }

  delete(target: string, value: ParametrosConsulta) {
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
