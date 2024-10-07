import { defineStore } from "pinia";


export const loggedInUserStore = defineStore('loggedInUser', {
    state: () => {
        return { loggedIn: undefined }
    }, 
    actions: {
        setUser(id) {
            this.loggedIn = id;
        },
        getUser() {
            return this.loggedIn;
        },
        logout() {
            this.loggedIn = undefined;
        }
    }
})