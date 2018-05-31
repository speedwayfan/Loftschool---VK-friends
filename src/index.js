VK.init({
    apiId: 6490487
});

const template =    `<div class="friend" draggable="true" data-id="{{id}}">
                        <img draggable="false" src="{{photo_50}}"/>
                        <span>{{first_name}} {{last_name}}</span>
                        {{#if selected}}            
                            <span class="smallCross" data-id="{{id}}">&#10006</span>
                        {{else}}      
                            <span class="plus" data-id="{{id}}">&#10010;</span>
                        {{/if}}
                    </div>`

const renderFriends = Handlebars.compile(template);
let friends = [];
const friendList1 = document.querySelector('.friend__list1');
const friendList2 = document.querySelector('.friend__list2');
const filterInput1 = document.querySelector('.input__search1');
const filterInput2 = document.querySelector('.input__search2');
const buttonSave = document.querySelector('.button__save');
        
function auth() {
    return new Promise((resolve, reject) => {
        VK.Auth.login(data => {
            if (data.session) {
                resolve();
            } else {
                reject(new Error('Не удалось авторизоваться'));
            }
        }, 2);
        // 2 - доступ к друзьям, номер списка прав
    });
}

function callAPI(method, params) {
    params.v = '5.78';

    return new Promise((resolve, reject) => {
        VK.api(method, params, (data) => {
            if (data.error) {
                reject(data.error);
            } else {
                resolve(data.response);
            }
        });
    })
}

function createFriends(friends){
    let friendsHtml1 = '';
    let friendsHtml2 = '';

    friendList1.innerHTML = "";
    friendList2.innerHTML = "";
    // в item хранится объект с инфой о каждом друге
    friends.forEach(item => {
    const fullName = `${item.first_name} ${item.last_name}`;

        if (item.selected == true) {
            if (fullName.toLowerCase().includes(filterInput2.value)) {
                friendsHtml2 += renderFriends(item);
            } 
        } else if (fullName.toLowerCase().includes(filterInput1.value)) {
                friendsHtml1 += renderFriends(item);
            }
    })

    friendList1.innerHTML = friendsHtml1;
    friendList2.innerHTML = friendsHtml2;
}

// проверяем есть ли в localStorage данные, если нет - грузим из vk
if (localStorage.data) {
    friends = JSON.parse(localStorage.data);
    createFriends(friends);
} else {
    auth()
        .then(() => {
            // вызываем ФИ юзера и делаем ее в родительнском падеже - name_case: 'gen'
            return callAPI('users.get', { name_case: 'gen' });
        })
        .then(([me]) => {
            const headerInfo = document.querySelector('.friend__title');
            headerInfo.textContent = `Друзья на странице ${me.first_name} ${me.last_name}`;
            // здесь возвращается promise, который в resolve передаст масив с друзьями
            return callAPI('friends.get', { fields: 'photo_50' });  
        })
        .then(res => {
            // тут мы получаем массив с друзьями из предыдущего then и он передается в функцию create первым аргументом res
            // res.items - это массив с объектами, который мы получаем из api vk
            // с помощью map добавляем каждому элементу selected
            friends = res.items.map(item => {
                return Object.assign(item, {selected: false})
            });
            // friends - json из vk
            createFriends(friends);
        });
    }


///////////////////////////// ФУНКЦИЯ LOCALSTORAGE /////////////////////////////

// в глобальном объекте localStorage можно сохранить только строку, поэтому с помощью json нужно перевести объект с инфо
buttonSave.addEventListener('click', function() {
    localStorage.data = JSON.stringify(friends);
})


///////////////////////// ФУНКЦИЯ КРЕСТИК И ПЛЮСИК /////////////////////////////

friendList1.addEventListener('click', function(e) {

    if (e.target.classList.contains('plus')) {
        const id = e.target.closest('.friend').dataset.id;

        // обращаемся к дата-атрибуту
        friends = friends.map(item => {
            if (item.id == id) {
                return Object.assign(item, {selected: true});
            }

            return item;
        })
        createFriends(friends);
    }
});

friendList2.addEventListener('click', function(e) {

    if (e.target.classList.contains('smallCross')) {
        const id = e.target.closest('.friend').dataset.id;

        friends = friends.map(item => {
            if (item.id == id) {
                return Object.assign(item, {selected: false});
            }
            return item;
        })
        createFriends(friends);
    }
});


///////////////////////// ФУНКЦИЯ DnD /////////////////////////////

let currentDrag;

document.addEventListener('dragstart', (e) => {
    const zone = getCurrentZone(e.target);
    var hel = e.target;

    if (zone) {
        currentDrag = { startZone: zone, node: e.target };
    }
});

document.addEventListener('dragover', (e) => {
    const zone = getCurrentZone(e.target);

    if (zone) {
        e.preventDefault();
    }
});

document.addEventListener('drop', (e) => {
    // e.target - здесь зона над которой отпускаем элемент
    // currentDrag - объект с значениями старт-зона + взятый элемент
    if (currentDrag) {
        const zone = getCurrentZone(e.target);
        // zone - это ul с текущим списком друзей, e.target - перетаскиваемый div
        e.preventDefault();
        // if (zone && currentDrag.zone !== zone) {
            if (e.target.closest('.friend__list2') && !e.target.closest('.friend__list1')) {
                console.log(currentDrag.node)
                const id = currentDrag.node.closest('.friend').dataset.id;
                // обращаемся к дата-атрибуту
                friends = friends.map(item => {
                    if (item.id == id) {
                        return Object.assign(item, {selected: true});
                    }
                    
                    return item;
                })

                createFriends(friends);
            } else if (!e.target.closest('.friend__list1')) {
                const id = currentDrag.node.closest('.friend').dataset.id;
                // обращаемся к дата-атрибуту
                friends = friends.map(item => {
                    if (item.id == id) {
                        return Object.assign(item, {selected: true});
                    }
                    
                    return item;
                })

                createFriends(friends);
            }
        // }
        currentDrag = null;
    }
});

function getCurrentZone(from) {
    do {
        if (from.classList.contains('friend__list1') || from.classList.contains('friend__list2')) {
            // проверяем, если у нажатого элемента родительский элемент с классом ul списка, то возвращаем его
            return from;
        }
    } while (from = from.parentElement);

    return null;
};


///////////////////////////// ФУНКЦИЯ FILTER /////////////////////////////


filterInput1.addEventListener('input', () => {
    const { value } = filterInput1;

    const filtered = friends.filter(item => {
        const fullName = `${item.first_name} ${item.last_name}`;

        if (item.selected == true) {
            return item
        }

        return fullName.toLowerCase().includes(value);
    })
    // filtered - получается массив с объектами отфильтрованных друзей
    createFriends(filtered);
})


filterInput2.addEventListener('input', () => {
    const { value } = filterInput2;

    const filtered = friends.filter(item => {
        const fullName = `${item.first_name} ${item.last_name}`;

        if (item.selected == false) {
            return item
        }

        return fullName.toLowerCase().includes(value);
    })
    createFriends(filtered);
})


// full-значение, chunk - то что вводим в инпут
// function isMatching(full, chunk) {
// // includes() определяет, содержит ли массив определённый элемент, возвращая true или false
//     return full.toLowerCase().includes(chunk.toLowerCase());
// }