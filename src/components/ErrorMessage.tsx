import type { PropsWithChildren, ReactNode } from "react"
//este type tambien funciona o directmanete el PropsWithChildren para rederizar nodos
type ErrorMessageProps ={
    children: ReactNode
}

export const ErrorMessage = ({children}:PropsWithChildren)=>{
    return( 
        <p className="bg-red-600 p-2 text-white font-bold text-sm text-center">
            {children}</p> 
    )
}