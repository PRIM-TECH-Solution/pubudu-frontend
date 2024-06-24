import axios from "axios";

const USER_API_BASE_URL="https://easyticket-event-user.azurewebsites.net/auth/login"
class LogService{
    logUser(user){
        return axios.post(
            USER_API_BASE_URL, user
        );
        
    }

}


export default new LogService();