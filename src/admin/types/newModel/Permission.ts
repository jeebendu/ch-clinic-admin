export interface Permission{
    id: number
    module: Module
    read: boolean
    write: boolean
    upload: boolean
    print: boolean
    approve:boolean
  
  }
  
  export class Module{
    id!:number
    name!:string
  }
  