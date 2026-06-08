import { useMemo } from "react"
import { useBudget } from "../hooks/useBudget"
import { ExpenseDetail } from "." //como tenemos un archivo de barril, solo colocamos un .

export const ExpenseList = ()=>{
    const { state } = useBudget()

    const filteredExpenses = state.currentCategory ? state.expenses.filter( expense => expense.category===state.currentCategory): state.expenses
    const isEmpty = useMemo( ()=> filteredExpenses.length === 0 , [filteredExpenses])

    return (
        <div className="bg-white shadow-lg p-5">
            {isEmpty ? <p className="text-gray-600 text-2xl font-bold">No hay gastos</p> : (
                <>
                    <p className="text-gray-600 text-2xl font-bold my-5">Listado de gastos</p>
                    {filteredExpenses.map( expense => (
                        <ExpenseDetail
                            key={expense.id}
                            expense={expense}
                        />
                    ))}
                </>
            )}
        </div>
    ) 
}