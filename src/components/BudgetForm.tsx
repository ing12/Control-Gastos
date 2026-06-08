import { useMemo, useState, type ChangeEvent, type FormEvent } from "react"
import { useBudget } from "../hooks/useBudget"

export const BudgetForm =()=>{

    const [budget, setBuget] = useState(0)
    const {dispatch} = useBudget()

    const handleChange = (e: ChangeEvent<HTMLInputElement>)=>{
        setBuget(e.target.valueAsNumber)
    }
    //solo se detona si hay un cambio en el state
    const isValid = useMemo(()=>{
        return isNaN(budget) || budget<=0
    }, [budget])//useState es de tipo number por iniciar en cero por ende cualquier otro tipo no sera valido

    const handleSubmit = (e: FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        dispatch({type:'add-budget', payload:{budget}})
        
    }

    return(
        <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="flex flex-col space-y-5">
                <label htmlFor="budget" className="text-4xl text-blue-600 font-bold text-center">
                    Definir presupuesto
                </label>
                <input 
                    id="budget"
                    type="number"
                    className="w-full bg-white border border-gray-200 p-2"
                    placeholder="Define tu presupuesto"
                    name="budget"
                    value={budget}
                    onChange={handleChange}
                />
            </div>
            <input
                type="submit"
                value="Definir presupuesto"
                className="bg-blue-600 hover:bg-blue-700 cursor-pointer w-full p-2 text-white font-black uppercase disabled:opacity-40"
                disabled={isValid}            
            />
        </form>
    )
}