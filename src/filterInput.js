

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