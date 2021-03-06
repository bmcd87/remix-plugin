// import { Api, ModuleProfile, ApiEventEmitter } from 'src/types'


// // BASE
// class StateManagement<S> {
//   state: S
//   initialState: S
//   /**
//    * Update one field of the state
//    * @param state The part of the state updated
//    */
//   public updateState(state: Partial<S>) {
//     this.state = { ...this.state, ...state }
//   }

//   /** Get the state or a part of it */
//   public getState(): S
//   public getState<K extends keyof S>(key: K): S[K]
//   public getState<R>(query: (store: S) => R): R
//   public getState<K extends keyof S, R>(
//     query?: ((state: S) => R) | K,
//   ): R | S | S[K] {
//     switch (typeof query) {
//       case 'function': return query(this.state)
//       case 'string': return this.state[query]
//       default: return this.state
//     }
//   }

//   /** Reset the state its initial value */
//   public resetState() {
//     this.state = this.initialState
//   }
// }












// // API
// export interface EntityApi<T> {
//   name: 'entity',
//   events: {
//     add: [T],
//     remove: [string],
//     update: [T],
//     clear: [],
//     activate: [string | string[]],
//     deactivate: []
//   }
// }

// // STATE
// export interface EntityState<T> {
//   entities: {
//     [key: string]: T
//   }
//   ids: string[]
//   actives: string[]
// }

// /** Create an empty state */
// function EntityState<T>(): EntityState<T> {
//   return {
//     ids: [],
//     actives: [],
//     entities: {},
//   }
// }

// // PROFILE
// export const entityStoreProfile: Partial<ModuleProfile<EntityApi<Api>>> = {
//   // events: ['add', 'remove', 'clear', 'update', 'activate', 'deactivate'],
//   // methods: ['addEntity', 'removeEntity', 'updateEntity', 'setActive', 'getMany', 'getAll', 'getActives', 'hasEntity', 'isEmpty']
// }


// // MIXIN
// export class EntityMixinApi<T, U extends Api> {
//   protected readonly keyId: string = 'id'
//   public state: EntityState<T>
//   public events: ApiEventEmitter<U>

//   /** The entities as a Map */
//   get entities() {
//     return this.state.entities
//   }

//   /** List of all the ids */
//   get ids() {
//     return this.state.ids
//   }

//   /** List of all active ID */
//   get actives() {
//     return this.state.actives
//   }

//   /** Return the length of the entity collection */
//   get length() {
//     return this.state.ids.length
//   }

//   /** Add a new entity to the state */
//   addEntity(entity: T) {
//     const id = entity[this.keyId]
//     this.state.entities[id] = entity
//     this.state.ids.push(id)
//     this.events.emit('add', entity)
//   }

//   /** Add entities to the state */
//   addEntities(entities: T[]) {
//     entities.forEach(entity => {
//       if (!entity[this.keyId])
//         throw new Error(`Key ${this.keyId} doesn't exist in ${entity}`)
//       this.addEntity(entity)
//     })
//     this.events.emit('add', entities)
//   }

//   /**
//    * Remove an entity from the state
//    * @param id The id of the entity to remove
//    */
//   removeEntity(id: string) {
//     if (!this.state.entities[id])
//       throw new Error(`No entity with key ${id} found`)
//     delete this.state.entities[id]
//     this.state.ids.splice(this.state.ids.indexOf(id), 1)
//     this.state.actives.splice(this.state.ids.indexOf(id), 1)
//     this.events.emit('remove', id)
//   }

//   /** Remove all entity from the state and reset actives and ids to empty */
//   clearState() {
//     this.state = EntityState()
//     this.events.emit('clear')
//   }

//   /**
//    * Update one entity of the state
//    * @param id The id of the entity to update
//    * @param update The fields to update in the entity
//    */
//   updateEntity(id: string, update: Partial<T>) {
//     if (!this.state.entities[id])
//       throw new Error(`No entity with key ${id} found`)
//     this.state.entities[id] = {
//       ...this.state.entities[id],
//       ...update,
//     }
//     this.events.emit('update', this.state.entities[id])
//   }

//   /**
//    * Activate one or several entity from the state
//    * @param ids An id or a list of id to activate
//    */
//   setActive(ids: string | string[]) {
//     Array.isArray(ids)
//       ? this.state.actives.concat(ids)
//       : this.state.actives.push(ids)
//     this.events.emit('activate', ids)
//   }

//   /**
//    * Deactivate one or several entity from the state
//    * @param ids An id or a list of id to deactivate
//    */
//   removeActive(ids: string | string[]) {
//     if (!Array.isArray(ids)) ids = [ids]
//     ids.forEach(id => {
//       const index = this.state.actives.indexOf(id)
//       this.state.actives.splice(index, 1)
//     })
//     this.events.emit('deactivate', ids)
//   }

//   ///////////
//   // QUERY //
//   ///////////

//   /**
//    * Get one entity
//    * @param id The id of the entity to get
//    */
//   getOne(id: string) {
//     return this.state.entities[id]
//   }

//   /**
//    * Get many entities as an array
//    * @param ids An array of id of entity to get
//    */
//   getMany(ids: string[]) {
//     return ids.map(id => this.state.entities[id])
//   }

//   /**
//    * Get all the entities as an array
//    */
//   getAll(): T[] {
//     return this.state.ids.map(id => this.state.entities[id])
//   }

//   /** Get all active entities */
//   getActives() {
//     return this.state.actives.map(id => this.state.entities[id])
//   }

//   /**
//    * Is the entity active
//    * @param id The id of the entity to check
//    */
//   isActive(id: string) {
//     return this.state.actives.includes(id)
//   }

//   /**
//    * Is this id inside the store
//    * @param id The id of the entity to check
//    */
//   hasEntity(id: string) {
//     return this.state.ids.includes(id)
//   }

//   /** Is the state empty */
//   isEmpty() {
//     return this.state.ids.length === 0
//   }
// }