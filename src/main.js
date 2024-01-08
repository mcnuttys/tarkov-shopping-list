let shopping_list_holder, selected_upgrade_list_holder, upgrade_list_holder

let shoppingList = []
let shoppingListItems = []
let upgradeList = []

let catagoryFilter, amtFilter
let lastFilter

window.onload = async () => {
    // Load the saved shopping list
    loadLocalStorage()

    document.querySelector('#wipe_button').addEventListener('click', wipeShoppingList)

    // Display shopping list
    shopping_list_holder = document.querySelector('#shopping_list')
    selected_upgrade_list_holder = document.querySelector('#selected_upgrade_list')
    displayShoppingList(shoppingList)

    // Display upgrade list
    upgrade_list_holder = document.querySelector('#upgrade_list')
    displayUpgradeList(hideout_upgrades)

    document.querySelector('#upgrade_search_bar').addEventListener('input', onUpgradeSearchChanged)

    let uarr = '▲'
    let darr = '▼'
    catagoryFilter = document.querySelector('#item_category_filter')
    amtFilter = document.querySelector('#item_amt_filter')
    lastFilter = amtFilter

    catagoryFilter.addEventListener('click', () => {
        let arr = catagoryFilter.querySelector('b')
        if (lastFilter && lastFilter != catagoryFilter) {
            lastFilter.querySelector('b').innerHTML = ''
        }

        let current = arr.innerHTML
        let sortDirection = 1
        if (!current) {
            arr.innerHTML = darr
            sortDirection = -1
        } else {
            if (arr.innerHTML === darr) {
                arr.innerHTML = uarr
                sortDirection = 1
            } else {
                arr.innerHTML = darr
                sortDirection = -1
            }
        }

        sortShoppingList((a, b) => {
            a = upgrade_items.find(i => i.id === a.id)
            b = upgrade_items.find(i => i.id === b.id)
            if (a.category < b.category)
                return 1 * sortDirection

            if (a.category > b.category)
                return -1 * sortDirection

            return 0
        })
        refreshShoppingList()

        lastFilter = catagoryFilter
    })

    amtFilter.addEventListener('click', () => {
        let arr = amtFilter.querySelector('b')
        if (lastFilter && lastFilter != amtFilter) {
            lastFilter.querySelector('b').innerHTML = ''
        }

        let current = arr.innerHTML
        let sortDirection = 1
        if (!current) {
            arr.innerHTML = darr
            sortDirection = -1
        } else {
            if (arr.innerHTML === darr) {
                arr.innerHTML = uarr
                sortDirection = 1
            } else {
                arr.innerHTML = darr
                sortDirection = -1
            }
        }

        sortShoppingList((a, b) => {
            if (a.amt < b.amt)
                return -1 * sortDirection

            if (a.amt > b.amt)
                return 1 * sortDirection

            return 0
        })
        refreshShoppingList()

        lastFilter = amtFilter
    })
}

const loadLocalStorage = () => {
    shoppingList = JSON.parse(localStorage.getItem('shoppingList'))
    shoppingListItems = JSON.parse(localStorage.getItem('shoppingListItems'))

    if (!shoppingList)
        shoppingList = []
    if (!shoppingListItems)
        shoppingListItems = []

    sortShoppingList()
}

const saveLocalStorage = () => {
    localStorage.setItem('shoppingList', JSON.stringify(shoppingList))
    localStorage.setItem('shoppingListItems', JSON.stringify(shoppingListItems))
}

const clearChildElements = (element) => {
    while (element.firstChild) {
        element.removeChild(element.lastChild)
    }
}

const wipeShoppingList = () => {
    shoppingList = []
    shoppingListItems = []

    refreshUpgradeList()
    refreshShoppingList()

    localStorage.clear()
}

let lastSortFunction = undefined
const sortShoppingList = (sortFunction) => {
    if (!sortFunction && !lastSortFunction)
        sortFunction = (a, b) => b.amt - a.amt

    if (!sortFunction && lastSortFunction)
        sortFunction = lastSortFunction

    shoppingListItems = shoppingListItems.sort(sortFunction)
    lastSortFunction = sortFunction
}

const refreshShoppingList = () => {
    sortShoppingList()
    displayShoppingList(shoppingListItems)
}

const displayShoppingList = (shoppingList) => {
    clearChildElements(shopping_list_holder)
    // clearChildElements(selected_upgrade_list_holder)

    if (!shoppingList || shoppingList.length <= 0) {
        let element = document.createElement('tr')
        element.innerHTML = '<td></td><td>There are no items in your shopping list!<td></td></td><td></td><td></td>'
        shopping_list_holder.appendChild(element)
        return
    }

    shoppingListItems.forEach(item => {
        let element = createItemElement(item)
        shopping_list_holder.appendChild(element)
    })

    // let upgrades = document.createElement('p')
    // upgrades.innerText = 'Selected Upgrades: ' + shoppingList.map(upgrade => upgrade.name).join(', ')
    // selected_upgrade_list_holder.appendChild(upgrades)
}

const modifyItem = (itemId) => {
    let item = shoppingListItems.find(i => i.id === itemId)

    if (!item) {
        console.error("Could not find item")
        return
    }

    let amt = 0
    let itemData = upgrade_items.find(i => i.id === itemId)

    if (itemData) {
        amt = parseInt(prompt(`${itemData.display_name} Collected`))
    } else {
        amt = parseInt(prompt(`${itemId} Collected`))
    }

    if (!amt) {
        return
    }

    item.amt -= amt
    item.amt = Math.max(Math.min(item.amt, item.total), 0)

    saveLocalStorage()

    refreshShoppingList()
}

const createItemElement = (item) => {
    let element = document.createElement('tr')
    element.id = item.id
    element.className = 'item_element'

    if (item.amt <= 0)
        element.className += ' completed_item'

    let itemData = upgrade_items.find(i => i.id === item.id)

    if (!itemData) {
        element.innerHTML = `
        <td>${item.id}</td>
        <td class="item_category">unset</td>
        <td></td>
        <td class="item_amt" onClick="modifyItem('${item.id}')">
            <div>${item.amt}/${item.total}</div>
        </td>
        `

        return element
    }

    let upgrade_icons = []
    item.upgrades.forEach(upgrade => {
        let icon_url = hideout_upgrades.find(u => u.id === upgrade).icon_url

        if (icon_url && !upgrade_icons.find(s => s.url === icon_url)) {
            upgrade_icons.push({ id: upgrade, url: icon_url })
        }
    })

    element.innerHTML = `
        <td><a href="${itemData.wiki_url}" alt="${itemData.display_name} Icon"><img class="item_image" src="${itemData.item_icon}"></img></a></td>
        <td><a href="${itemData.wiki_url}">${itemData.display_name}</a></td>
        <td class="upgrade_row">${upgrade_icons.map(url => `<a href="#${url.id}"><img class="upgrade_icon" src=${url.url}/></a>`).join('')}</td>
        <td class="item_category"> ${itemData.category}</td>
        <td class="item_amt" onClick="modifyItem('${item.id}')">
            <div>${item.amt} (${item.total})</div>
        </td>
    `

    return element
}

const refreshUpgradeList = () => {
    displayUpgradeList(upgradeList)
}

const onUpgradeSearchChanged = (search) => {
    search = search.target.value

    let terms = search.split(',')
    let filteredList = []
    terms.forEach(term => {
        if (terms.length > 1 && term === '')
            return

        let filtered = hideout_upgrades.filter(u => u.name.toUpperCase().indexOf(term.trim().toUpperCase()) > -1)
        filteredList.push(...filtered)
    })

    displayUpgradeList(filteredList)
}

const displayUpgradeList = (list) => {
    upgradeList = list

    clearChildElements(upgrade_list_holder)

    list.forEach((upgrade, i) => {
        let element = createUpgradeElement(upgrade, i)
        upgrade_list_holder.appendChild(element)
    })
}

const createUpgradeElement = (upgrade, i) => {
    let button = `<button class="button-primary" onclick = "addToCart_button('${upgrade.id}')">Add to Cart</button> `

    if (shoppingList.find(u => u.id === upgrade.id)) {
        button = `<button onclick = "removeFromCart_button('${upgrade.id}')">Remove from Cart</button> `
    }

    let element = document.createElement('tr')
    element.id = upgrade.id
    element.className = 'upgrade_element'
    element.innerHTML = `
        <td> <img class="upgrade_icon" src="${upgrade.icon_url}" alt="${upgrade.name} Icon" /></td>
        <td>${upgrade.name}</td>
        <td class="cart_button">${button}</td>
    `

    return element
}

const addToCart_button = (upgradeId) => {
    let upgrade = hideout_upgrades.find(u => u.id === upgradeId)

    upgrade.materials.forEach(material => {
        let item = shoppingListItems.find(i => i.id === material.id)
        if (!item) {
            item = {
                id: material.id,
                amt: 0,
                total: 0,
                upgrades: []
            }

            shoppingListItems.push(item)
        }

        let amt = material.amt
        item.amt += amt
        item.total += amt

        item.upgrades.push(upgrade.id)
    })

    shoppingList.push(upgrade)
    sortShoppingList()

    saveLocalStorage()
    displayShoppingList(shoppingList)

    refreshUpgradeList()
}

const removeFromCart_button = (upgradeId) => {
    let upgrade = shoppingList.find(u => u.id === upgradeId)

    upgrade.materials.forEach(material => {
        let item = shoppingListItems.find(i => i.id === material.id)

        if (!item) {
            console.error("Item is not on the shopping list for some reason!?!")
            return
        }

        // Trying to decide on the logic...
        let amt = material.amt
        item.amt += amt
        item.total -= amt

        if (item.amt <= 0)
            item.amt = 0

        if (item.amt > item.total)
            item.amt = item.total


        if (item.total <= 0) {
            let itemIndex = shoppingListItems.indexOf(item)
            shoppingListItems.splice(itemIndex, 1)
        }

        let index = item.upgrades.indexOf(upgrade.id)
        item.upgrades.splice(index, 1)
    })

    let index = shoppingList.indexOf(upgrade)
    shoppingList.splice(index, 1)

    saveLocalStorage()
    displayShoppingList(shoppingList)

    refreshUpgradeList()
}