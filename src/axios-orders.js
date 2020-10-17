import axios from "axios";

const instance = axios.create({
    baseURL: "https://react-my-burgur-3f281.firebaseio.com/",
});

export default instance;
