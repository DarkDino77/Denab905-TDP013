async function fetchUser(id) {
    const path = `http://localhost:8080/users/${id}`;

    const response = await fetch(path, {
        method: 'GET',
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        credentials: 'include',
    });

    if (response.status === 200) {
        return await response.json();
    } else {
        return undefined;
    }
}

async function getFriends() {
    const response = await fetch('http://localhost:8080/friends', {
        method: 'GET',
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        credentials: 'include',
    });

    if (response.status === 200) {
        return await response.json();
    } else {
        return undefined;
    }
}

export { fetchUser, getFriends };