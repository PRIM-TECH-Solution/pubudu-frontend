import axios from "axios";

const USER_API_BASE_URL="https://user-event.azurewebsites.net/auth/login"
class LogService{
    logUser(user){
        return axios.post(
            USER_API_BASE_URL, user
        );
        
    }

}


export default new LogService();