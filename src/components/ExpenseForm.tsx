import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import type { DraftExpense, Value } from "../types";
import { useBudget } from "../hooks/useBudget";

//utileria , impotar un calendar
import { categories } from "../data/categories"
import DatePicker from "react-datepicker";
import "react-calendar/dist/calendar.css";
import "react-datepicker/dist/react-datepicker.css";
import { ErrorMessage } from "./ErrorMessage";

export const ExpenseForm = ()=>{

    //State local(expense)  = información temporal del formulario
    const [expense, setExpense] = useState<DraftExpense>({ 
        amount:0,
        expenseName: '',
        category: '',
        date: new Date()
    })

    const [error, setError] = useState('')
    const [previousAmount, setPreviousAmount] = useState(0)
    //State global = información oficial de la aplicación
    const { dispatch, state, remainingBudget } = useBudget()

    useEffect(()=>{
        if (state.editingId) {
            const editingExpense = state.expenses.filter( currentExpense => currentExpense.id === state.editingId )[0]
            setExpense(editingExpense)
            setPreviousAmount(editingExpense.amount)//obtener la cantidad editada, para el state previusAmount
        }
    },[state.editingId])

    const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement> )=>{
        const {name, value} = e.target //detecta el evento del input que lo detono
        const isAmountValue = ['amount'].includes(name)
        setExpense({
            ...expense,
            [name] : isAmountValue ? +value : value //el + vuelve la cadena a numero
        })
        
    }

    const handleChangeDate = (value: Value)=>{
        setExpense({
            ...expense,
            date:value
        })        
    }


    const handleSubmit = (e: FormEvent<HTMLFormElement>) =>{
        e.preventDefault()
        //el state mediante Object.values se convierte en objeto y entonces el includes puede iterar las claves
        if (Object.values(expense).includes('')) {
            setError('Todos los campos son obligatorios')
            return
        }

        //no pasarte del limite del presupuesto
        if ((expense.amount - previousAmount )> remainingBudget) {
            setError('El gasto superó el presupuesto')
            return
        }

        //agregar o actualizar
        if(state.editingId){
            dispatch({type:'update-expense', payload:{expense:{id: state.editingId, ...expense}}})
        }else{
            //                                    expense es el state de este form
            dispatch({type:'add-expense', payload:{ expense }})//dispatch pertenece al reducer
        }
        
        //reiniciar el state del form o expense una vez que se agrego el gasto
        setExpense({
            amount:0,
            expenseName: '',
            category: '',
            date: new Date()
        })
        
    }

    return(
        <form className="space-y-5" onSubmit={handleSubmit}>
            <legend
                className="uppercase text-center text-2xl font-black border-b-4 border-blue-500 p-2"
            >
               {state.editingId ? 'Guardar Cambios' : 'Nuevo Gasto'}
            </legend>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            <div className="flex flex-col gap-2">
                <label htmlFor="expenseName"
                       className="text-xl"
                >Nombre gasto</label>
                <input 
                    type="text" 
                    id="expenseName" 
                    placeholder="Agrega el nombre del gasto"
                    className="bg-slate-100 p-2"
                    name="expenseName"
                    value={expense.expenseName} 
                    onChange={handleChange} />
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="amount"
                       className="text-xl"
                >Cantidad </label>
                <input 
                    type="number" 
                    id="amount" 
                    placeholder="Agrega la cantidad del gasto. Ej.300"
                    className="bg-slate-100 p-2"
                    name="amount"
                    value={expense.amount} 
                    onChange={handleChange}
                    />
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="category"
                       className="text-xl"
                >Categoria </label>
                <select 
                    id="category" 
                    className="bg-slate-100 p-2"
                    name="category"
                    value={expense.category}
                    onChange={handleChange}
                >
                    <option value="">-- Seleccione --</option> 
                    {categories.map( category =>(
                        <option 
                            key={category.id}
                            value={category.id}
                        >
                            {category.name}
                        </option>
                    ))}   
                </select>
            </div>
            <div className="flex flex-col gap-2">
                <label className="text-xl">Fecha</label>
            <DatePicker
                selected={expense.date}
                onChange={handleChangeDate}
                className="bg-slate-100 p-2 border-0 w-full"
                wrapperClassName="w-full"
            />
            </div>
            <input type="submit"
                className="bg-blue-600 cursor-pointer w-full p-2 text-white uppercase font-bold rounded-lg"
                value={state.editingId ? 'Guardar Cambios' : 'Registrar Gasto'}
            />
        </form>
    )
}