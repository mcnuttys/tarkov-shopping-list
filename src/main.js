let shopping_list_holder, selected_upgrade_list_holder, upgrade_list_holder

let shoppingList = []
let shoppingListItems = []
let upgradeList = []

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
}

const loadLocalStorage = () => {
    shoppingList = JSON.parse(localStorage.getItem('shoppingList'))
    shoppingListItems = JSON.parse(localStorage.getItem('shoppingListItems'))

    if (!shoppingList)
        shoppingList = []
    if (!shoppingListItems)
        shoppingListItems = []

    console.dir(shoppingList)
    console.dir(shoppingListItems)
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
    console.dir('test')
    shoppingList = []
    shoppingListItems = []

    refreshUpgradeList()
    refreshShoppingList()

    localStorage.clear()
}

const sortShoppingList = () => {
    shoppingListItems = shoppingListItems.sort((a, b) => b.total - a.total)
}

const refreshShoppingList = () => {
    displayShoppingList(shoppingListItems)
}

const displayShoppingList = (shoppingList) => {
    clearChildElements(shopping_list_holder)
    clearChildElements(selected_upgrade_list_holder)

    if (!shoppingList || shoppingList.length <= 0) {
        let element = document.createElement('tr')
        element.innerHTML = '<td></td><td>There are no items in your shopping list!</td><td></td><td></td>'
        shopping_list_holder.appendChild(element)
        return
    }

    shoppingListItems.forEach(item => {
        let element = createItemElement(item.id, item.amt, item.total)
        shopping_list_holder.appendChild(element)
    })

    let upgrades = document.createElement('p')
    upgrades.innerText = 'Selected Upgrades: ' + shoppingList.map(upgrade => upgrade.name).join(', ')
    selected_upgrade_list_holder.appendChild(upgrades)
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
    displayShoppingList(shoppingList)
}

const createItemElement = (item, amt, total) => {
    let element = document.createElement('tr')
    element.className = 'item_element'

    let itemData = upgrade_items.find(i => i.id === item)

    if (!itemData) {
        element.innerHTML = `
        <td>${item}</td>
        <td class="item_category">unset</td>
        <td class="item_amt" onClick="modifyItem('${item}')">
            <div>${amt}/${total}</div>
        </td>
        `

        return element
    }

    element.innerHTML = `
        <td><a href="${itemData.wiki_url}" alt="${itemData.display_name} Icon"><img class="item_image" src="${itemData.item_icon}"></img></a></td>
        <td><a href="${itemData.wiki_url}">${itemData.display_name}</a></td>
        <td class="item_category">${itemData.category}</td>
        <td class="item_amt" onClick="modifyItem('${item}')">
            <div>${amt} (${total})</div>
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
    let button = `<button class="button-primary" onclick="addToCart_button('${upgrade.id}')">Add to Cart</button>`

    if (shoppingList.find(u => u.id === upgrade.id)) {
        button = `<button onclick="removeFromCart_button('${upgrade.id}')">Remove from Cart</button>`
    }

    let element = document.createElement('tr')
    element.className = 'upgrade_element'
    element.innerHTML = `
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
            }

            shoppingListItems.push(item)
        }

        let amt = material.amt
        item.amt += amt
        item.total += amt
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
    })

    let index = shoppingList.indexOf(upgrade)
    shoppingList.splice(index, 1)

    saveLocalStorage()
    displayShoppingList(shoppingList)

    refreshUpgradeList()
}