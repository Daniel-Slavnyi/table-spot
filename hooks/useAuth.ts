import axios from "axios"

const useAuth =  () => {
    const  signin = async ({email, password}: {email: string; password: string}) => { 
        try {
            const res = await axios.post("http://localhost:3000/api/auth/signin", {
                email,
                password
            })
            console.log(res);
        } catch (error) {
            console.log(error);
        }
    }
    const signup = () => { }

    return {
        signin,
        signup
    }
}

export default useAuth;