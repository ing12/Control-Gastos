export type Expense = {
    id: string
    expenseName: string
    amount:number
    category:string
    date:Value
}

//omit permite que se pase todo el type de la linea uno a excepccion de la clave id
export type DraftExpense = Omit<Expense, 'id'>

type ValuePiece = Date | null

export type Value  = ValuePiece | [ValuePiece, ValuePiece]

export type Category = {
    id: string;
    name: string;
    icon: string;
}