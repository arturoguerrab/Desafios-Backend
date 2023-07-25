export default class CustomError {
    static createError({ name="Error", cause, message, code }) {
        // try{

            const error = new Error(message)
            error.name = name
            error.code = code
            throw error
        // }catch(err){
        //     console.log(err);
        // }
    }
}