import {supabase} from "./supabase";
import {useState, useEffect, useContext, createContext } from "react";

const authContext = createContext()

export const AuthProvider = ({children}) => {
   
    const auth = useProviderAuth()
    return <authContext.Provider value={auth}>{children}</authContext.Provider>
}

export const useAuth = () => {
    return useContext(authContext)
}

function useProviderAuth() {
    const [user, setUser] = useState(null)


    const login = async(email, user) => {
        const {error} = await supabase.auth.signIn({email})

        if(error) {
          console.log(error)
        }
        return(email, user)
    }


    const logout = async() => {
        const {error} = await supabase.auth.signOut()

        if(error) {
            console.log(error)
          }

        setUser(null)
    }

    useEffect( () => {
        const user = supabase.auth.user()
        setUser(user)

        const auth = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN') {
                setUser(session.user)
            }

            if (event === 'SIGNED_OUT') {
                setUser(null)
            }
        })
        return () => auth.unsubscribe()

    }, [])

return {
        user,
        login,
        logout
    }
}