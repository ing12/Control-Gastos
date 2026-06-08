import React, { useMemo, useReducer, createContext, type Dispatch, type ReactNode } from "react";
import { budgetReducer,initialState, type BudgetActios, type BudgetState } from "../reducers/budget-reducer";

//definir el tipo de contexto que se va a manejar
type BudgetContextProps = {
    state:BudgetState
    dispatch: Dispatch<BudgetActios>
    totalExpenses:number
    remainingBudget: number
}

//definir de que tipo seran los children o los componentes que se les provera el state y el dispatch
type BudgetProviderProp ={
    children: ReactNode
}

export const BudgetContext = createContext<BudgetContextProps>(null!)


//BudgetProvider recibe un componente de tipo nodo read como argumento y el retorna el state y dispatch procesado por el componente recibido
export const BudgetProvider = ({children}: BudgetProviderProp)=>{
    
    const [state,dispatch] = useReducer(budgetReducer,initialState) //obteniendo el state y las acciones del BudgetReducer
  
    const totalExpenses = useMemo( //cero es el valor inicial del acumulador, es decir, total que lo retorna reduce
            ()=>state.expenses.reduce((total,expense)=>expense.amount+total,0)
        ,[state.expenses])
        //budgetdisponible
    const remainingBudget = state.budget - totalExpenses
    
    return(
        //BudgetContext.Provider, rodea toda la app para que el state y dispatch sea global
        <BudgetContext.Provider
            value={{
                state,
                dispatch,
                totalExpenses,
                remainingBudget
            }}
        >
            {children}
        </BudgetContext.Provider>
        //children es un prop especial que hace referencia a los hijos de un componente, para que acepte cualquier componente
    )
}