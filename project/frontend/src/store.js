import { defineStore } from "pinia";


export const loggedInUserStore = defineStore('loggedInUser', {
    state: () => {
        return { 
            loggedIn: undefined,
            name: undefined
        }
    }, 
    actions: {
        setUser(id, name) {
            this.loggedIn = id;
            this.name = name;
        },
        getId() {
            return this.loggedIn;
        },
        getName() {
            return this.name;
        },
        logout() {
            this.loggedIn = undefined;
            this.name = undefined;
        }
    }
})