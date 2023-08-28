import { Entity, EntityBase, Fields } from '../../core/src/remult3'

@Entity('tasks', { allowApiCrud: true })
export class tasks extends EntityBase {
  @Fields.integer()
  id: number
  @Fields.string()
  name: string
  @Fields.boolean()
  completed: boolean = false
}