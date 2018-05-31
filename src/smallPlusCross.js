

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


