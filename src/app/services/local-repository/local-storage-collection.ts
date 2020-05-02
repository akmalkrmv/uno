import { Observable, of } from 'rxjs';
import { IBaseEntity } from '@models/base-entity';

export class LocalStorageDocument<T extends IBaseEntity> {
  constructor(public path: string) {}

  public get item(): T {
    if (!localStorage.getItem(this.path)) this.item = null;
    return JSON.parse(localStorage.getItem(this.path)) as T;
  }

  public set item(value: T) {
    localStorage.setItem(this.path, JSON.stringify(value));
  }

  public collection<TC extends IBaseEntity>(
    path: string
  ): LocalStorageCollection<TC> {
    return new LocalStorageCollection<TC>(`${this.path}/${path}`);
  }

  public exists() {
    return this.item != null;
  }
}

export class LocalStorageCollection<T extends IBaseEntity> {
  constructor(public path: string) {}

  public get items(): T[] {
    if (!localStorage.getItem(this.path)) this.items = [];
    return JSON.parse(localStorage.getItem(this.path)) as T[];
  }

  public set items(value: T[]) {
    localStorage.setItem(this.path, JSON.stringify(value));
  }

  public doc(id: string): T {
    return this.findById(id);
  }

  public findById(id: string): T {
    return this.items.find((item) => item.id === id) as T;
  }

  public add(payload: T): Observable<string> {
    const id = this.createId();
    this.items.push({ id, created: Date.now(), ...payload });
    return of(id);
  }

  public update(id: string, data: T): Promise<void> {
    const oldData = this.findById(id);
    this.replace(id, { ...oldData, ...data });
    return new Promise(() => {});
  }

  public remove(id: string): Promise<void> {
    const items = this.items;
    const index = items.findIndex((item) => item.id === id);
    this.items = items.splice(index, 1);
    return new Promise(() => {});
  }

  public removeAll(): Promise<void> {
    this.items = [];
    return new Promise(() => {});
  }

  private createId(): string {
    const shift = 1000000;
    const random = Math.floor(Math.random() * shift + shift);
    return `uno-${random.toString(16)}`;
  }

  private replace(id: string, data: T) {
    const items = this.items;
    const index = items.findIndex((item) => item.id === id);
    items[index] = data;
    this.items = items;
  }
}
