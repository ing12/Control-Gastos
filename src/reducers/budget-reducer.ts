import { v4 as uuidv4 } from "uuid";
import type { Category, DraftExpense, Expense } from "../types"

export type BudgetActios = 
    {type: 'add-budget', payload: {budget: number}} | //definir state
    {type: 'show-modal'} |
    {type: 'close-modal'} |            //Draft: borrador, es decir, gasto sin id
    {type: 'add-expense', payload: {expense:DraftExpense}} |
    {type: 'remove-expense', payload: {id: Expense['id']}} |
    {type: 'get-expense-by-id', payload: {id:Expense['id']}} |
    {type: 'update-expense', payload:{expense: Expense } } |
    {type: 'reset-app'} |
    {type: 'add-filter-category', payload:{id: Category}}

export type BudgetState = {
    budget: number
    modal: boolean
    expenses: Expense[]
    editingId: Expense['id']
    currentCategory: Category['id']
}

const initialBudget = (): number =>{
    const localStorageBudget = localStorage.getItem('budget')
    return localStorageBudget ? +localStorageBudget : 0
}

const localStorageExpenses = (): Expense[] =>{
    const localStorageExpenses = localStorage.getItem('expenses')
    return localStorageExpenses ? JSON.parse(localStorageExpenses) : []
}

export const initialState: BudgetState = {
    budget: initialBudget(),
    modal: false,
    expenses:localStorageExpenses(),
    editingId:'',
    currentCategory:''
}

//asignar id al state
const createExpense = (draftExpense: DraftExpense): Expense=>{
    return {
        ...draftExpense,
        id: uuidv4() //asigna un id random gracias a la libreria uuid4
    }
}

export const budgetReducer =(
        state: BudgetState = initialState,
        action: BudgetActios
    )=>{
        switch (action.type) {
            case 'add-budget':{
                return{
                    ...state,
                    budget: action.payload.budget
                }
            }
            case 'show-modal':{
                return{
                    ...state,
                    modal: true
                }
            }
            case 'close-modal':{
                return{
                    ...state,
                    modal: false,
                    editingId:''
                }
            }
            case 'add-expense':{
             // state con id       ->             state sin id
                const expense = createExpense(action.payload.expense)
                return{
                    ...state,
                    expenses: [...state.expenses, expense],
                    modal:false
                }
            }
            case 'remove-expense':{
                return{
                    ...state,
                    expenses: state.expenses.filter(expense => expense.id !== action.payload.id)
                }
            }
            case 'get-expense-by-id':{
                return{
                    ...state,
                    editingId: action.payload.id,
                    modal:true
                }
            }
            case 'update-expense':{
                return{
                    ...state,                                     //si es igual,                 retorna el gasto editado  si no, retorna el estado anterior
                    expenses: state.expenses.map(expense => expense.id === action.payload.expense.id ? action.payload.expense : expense),
                    modal:false,
                    editingId: ''
                }
            }
            case 'reset-app':{
                localStorage.removeItem('budget')
                localStorage.removeItem('expenses')
                return initialState;
            }
            case 'add-filter-category':{
                return {
                    ...state,
                    currentCategory: action.payload.id
                };
            }
            default:
                break;
        }
        return state
}