import axios from "axios";

const USER_API_BASE_URL1="https://easyticket-event-user.azurewebsites.net/auth/addUser"
class UserService{
    saveUser(user){
        return axios.post(
            USER_API_BASE_URL1, user
        );
        
    }

}


export default new UserService();