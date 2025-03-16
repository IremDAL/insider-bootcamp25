function loadJQuery(callback) {
    if (typeof jQuery === 'undefined') {
        let script = document.createElement('script');
        script.src = "https://code.jquery.com/jquery-3.7.1.min.js";
        script.onload = callback;
        document.head.appendChild(script);
    } else {
        callback();
    }
}

loadJQuery(function () {
    $(document).ready(function () {
        const API_URL = "https://jsonplaceholder.typicode.com/users";
        const STORAGE_KEY = "usersData";
        const EXPIRATION_KEY = "usersDataExpire";
        const SESSION_KEY = "buttonClicked";
        const EXPIRATION_TIME = 24 * 60 * 60 * 1000;
        let appendLocation = ".ins-api-users"; 

        addStyles();
        getUsers();
        getObserver();

        function addStyles() {
            $("head").append(`
                <style>
                    .user {
                        padding: 10px; 
                        border: 1px solid #ddd; 
                        margin: 5px; 
                        display: flex; 
                        justify-content: space-between; 
                        }
                    .delete-btn, .reload-btn { 
                        background: red; 
                        color: white; 
                        border: none; 
                        padding: 5px 10px; 
                        cursor: pointer; 
                        }
                    .reload-btn { 
                        background: blue; 
                        margin-top: 10px; 
                        display: block; 
                        width: 100%; 
                        text-align: center; 
                        }
                </style>`
            );
        }

        function getUsers() {
            $(".reload-btn").remove();

            const storedUsers = JSON.parse(localStorage.getItem(STORAGE_KEY));
            const lastFetchTime = parseInt(sessionStorage.getItem(EXPIRATION_KEY), 10);

            if (storedUsers && lastFetchTime && Date.now() - lastFetchTime < EXPIRATION_TIME) {
                displayUsers(storedUsers);
            } else {
                fetch(API_URL)
                    .then(response => response.ok ? response.json() : Promise.reject("API hatası"))
                    .then(users => {
                        localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
                        sessionStorage.setItem(EXPIRATION_KEY, Date.now());
                        displayUsers(users);
                    })
                    .catch(() => {
                        $(appendLocation).html("<p style='color: red;'>Bağlantı hatası! Lütfen internet bağlantınızı kontrol edin.</p>");
                    });
            }
        }

        function displayUsers(users) {
            if (!users || users.length === 0) {
                $(appendLocation).html("<p style='color: red;'>Tüm kullanıcılar silindi!</p>");
                addReloadButton();
                return;
            }
            $(appendLocation).html(users.map(user => `
                <div class="user" data-id="${user.id}">
                    <span><strong>${user.name}</strong> - ${user.email}</span>
                    <button class="delete-btn" data-id="${user.id}">Sil</button>
                </div>
            `).join(''));
        }

        function addReloadButton() {
            if (!$(".reload-btn").length && !sessionStorage.getItem(SESSION_KEY)) {
                $(appendLocation).after('<button class="reload-btn">Kullanıcıları Yükle</button>');
            }
        }

        function getObserver() {
            const observer = new MutationObserver(() => {
                if ($(appendLocation).children().length === 0 && $(".reload-btn").length === 0) {
                    addReloadButton();
                }
            });
            observer.observe(document.querySelector(appendLocation), 
            { childList: true, 
              subtree: true 
            });
        }

        $(document).on("click", ".delete-btn", function () {
            const userId = $(this).data("id");
            let users = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
            users = users.filter(user => user.id !== userId);

            if (users.length === 0) {
                localStorage.removeItem(STORAGE_KEY);
                sessionStorage.removeItem(EXPIRATION_KEY);
                addReloadButton();
            } else {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
            }
            displayUsers(users);
        });

        $(document).on("click", ".reload-btn", function () {
            sessionStorage.setItem(SESSION_KEY, "true");
            getUsers();
            $(this).remove();
        });
    });
});
