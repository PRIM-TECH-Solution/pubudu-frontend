import axios from "axios";

const USER_API_BASE_URL1="https://easyticket-event-user.azurewebsites.net/contact/add"
class ContactService{
    saveContact(contact){
        return axios.post(
            USER_API_BASE_URL1, contact
        );
        
    }

}


export default new ContactService();