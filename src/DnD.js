

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
    // e.target - здесь зона надо которой отпускаем элемент
    // currentDrag - объект с значениями старт-зона и взятый элемент
    if (currentDrag) {
        const zone = getCurrentZone(e.target);
        // zone - это ul с текущим списком друзей, e.target - перетаскиваемый div
        e.preventDefault();
        if (e.target.closest('.friend__list2')) {
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

