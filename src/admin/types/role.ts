

export interface Plan { 
    features:featureList

}
export interface featureList{
    "id": number
    "module": Module
    "print": boolean
    
}
export interface Module{
    id: number
    name: string
    
}