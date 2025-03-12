const API_URL = "https://jsonplaceholder.typicode.com/users";
const STORAGE_KEY = "usersData";
const EXPIRATION_KEY = "usersDataExpiration";
const EXPIRATION_TIME = 24 * 60 * 60 * 1000;

document.addEventListener("DOMContentLoaded", () => {
    getUsers().then(users => {
        document.querySelector(".ins-api-users").innerHTML = users.map(user => `
            <div class="user">
                <span><strong>${user.name}</strong> - ${user.email}</span>
                <button onclick="deleteUser(${user.id})">Sil</button>
            </div>
        `).join('');
    }).catch(error => {
        document.querySelector(".ins-api-users").innerHTML = 
        ` <p style="color: red; font-weight: bold;">Bağlantı hatası! Lütfen internet bağlantınızı kontrol edin.</p>`;
    });
});


function getUsers() {
    return new Promise((resolve, reject) => {
        const storedUsers = localStorage.getItem(STORAGE_KEY);
        const expiration = localStorage.getItem(EXPIRATION_KEY);

        if (storedUsers && expiration && Date.now() - expiration < EXPIRATION_TIME) {
            return resolve(JSON.parse(storedUsers));
        }

        fetch(API_URL)
            .then(response => response.ok ? response.json() : Promise.reject("API'den veri alınamadı!"))
            .then(users => {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
                localStorage.setItem(EXPIRATION_KEY, Date.now());
                resolve(users);
            })
            .catch(error => reject(error));
    });
}

function deleteUser(userId) {
    let users = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    let usersUpdate = users.filter(user => user.id !== userId);

    if (users.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(usersUpdate));
    } else {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(EXPIRATION_KEY);
    }

    document.querySelector(".ins-api-users").innerHTML = usersUpdate.map(user => `
        <div class="user">
            <span><strong>${user.name}</strong> - ${user.email}</span>
            <button onclick="deleteUser(${user.id})">Sil</button>
        </div>
    `).join('');
}
