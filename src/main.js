let shopping_list_holder, upgrade_list_holder

let shoppingList = []
let shoppingListItems = []
let upgradeList = []

window.onload = () => {
    console.dir('setup')

    // Display shopping list
    shopping_list_holder = document.querySelector('#shopping_list')
    displayShoppingList(shoppingList)

    // Display upgrade list
    upgrade_list_holder = document.querySelector('#upgrade_list')
    displayUpgradeList(hideout_upgrades)

    document.querySelector('#upgrade_search_bar').addEventListener('input', onUpgradeSearchChanged)
}

const clearChildElements = (element) => {
    while (element.firstChild) {
        element.removeChild(element.lastChild)
    }
}

const sortShoppingList = () => {
    shoppingListItems = shoppingListItems.sort((a, b) => b.total - a.total)
}

const displayShoppingList = (shoppingList) => {
    clearChildElements(shopping_list_holder)

    console.dir(shoppingList)

    if (!shoppingList || shoppingList.length <= 0) {
        let element = document.createElement('tr')
        element.innerHTML = '<td>There are no items in your shopping list!</td><td></td><td></td>'
        shopping_list_holder.appendChild(element)
        return
    }

    // items = {}
    // 
    // itemKeys = Object.keys(items)
    // itemKeys = itemKeys.sort((a, b) => items[b] - items[a])
    // 
    // itemKeys.forEach(item => {
    //     let i = items[item]
    //     let element = createItemElement(item, i.amt, i.total)
    //     shopping_list_holder.appendChild(element)
    // })

    shoppingListItems.forEach(item => {
        let element = createItemElement(item.id, item.amt, item.total)
        shopping_list_holder.appendChild(element)
    })

    // let upgrades = document.createElement('p')
    // upgrades.innerText = 'Upgrades: ' + shoppingList.map(upgrade => upgrade.name).join(', ')
    // shopping_list_holder.appendChild(upgrades)
}

const modifyItem = (itemId) => {
    let item = shoppingListItems.find(i => i.id === itemId)

    if (!item) {
        console.error("Could not find item")
        return
    }

    let amt = parseInt(prompt(`${itemId} Collected`))

    if (!amt) {
        return
    }

    item.amt -= amt
    item.amt = Math.max(Math.min(item.amt, item.total), 0)

    displayShoppingList(shoppingList)
}

const createItemElement = (item, amt, total) => {
    let element = document.createElement('tr')
    element.className = 'item_element'

    let itemData = upgrade_items.find(i => i.id === item)

    if (!itemData) {
        console.dir(item)

        element.innerHTML = `
        <td>${item}</td>
        <td class="item_catagory">unset</td>
        <td class="item_amt" onClick="modifyItem('${item}')">
            <div>${amt}/${total}</div>
        </td>
        `

        return element
    }

    /*
        <div class="modifier" onClick="modifyItem('${item}', -1)">-</div>
        <div>${amt}/${total}</div>
        <div class="modifier" onClick="modifyItem('${item}', 1)">+</div>
    */
    element.innerHTML = `
        <td>${itemData.display_name}</td>
        <td class="item_catagory">${itemData.catagory}</td>
        <td class="item_amt" onClick="modifyItem('${item}')">
            <div>${amt}/${total}</div>
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

    list.forEach(upgrade => {
        let element = createUpgradeElement(upgrade)
        upgrade_list_holder.appendChild(element)
    })
}

const createUpgradeElement = (upgrade) => {
    let button = `<button onclick="addToCart_button('${upgrade.id}')">Add to Cart</button>`

    if (shoppingList.find(u => u.id === upgrade.id)) {
        button = `<button onclick="removeFromCart_button('${upgrade.id}')">Remove from Cart</button>`
    }

    let element = document.createElement('div')
    element.className = 'upgrade_element'
    element.innerHTML = `
    <div class="row">
        <p class="six columns">${upgrade.name}</p>
        <div class="four columns">
            ${Object.keys(upgrade.materials).map(material => `<p>${material} x${upgrade.materials[material]}</p>`).join('')}
        </div>
        <div class="two columns cart_button">
            ${button}
        </div>
    </div>
    `

    return element
}

const addToCart_button = (upgradeId) => {
    let upgrade = hideout_upgrades.find(u => u.id === upgradeId)


    Object.keys(upgrade.materials).forEach(material => {
        let item = shoppingListItems.find(i => i.id === material)
        if (!item) {
            item = {
                id: material,
                amt: 0,
                total: 0,
            }

            shoppingListItems.push(item)
        }

        let amt = upgrade.materials[material]
        item.amt += amt
        item.total += amt
    })

    shoppingList.push(upgrade)
    sortShoppingList()
    displayShoppingList(shoppingList)

    refreshUpgradeList()
}

const removeFromCart_button = (upgradeId) => {
    let upgrade = shoppingList.find(u => u.id === upgradeId)

    Object.keys(upgrade.materials).forEach(material => {
        let item = shoppingListItems.find(i => i.id === material)

        if (!item) {
            console.error("Item is not on the shopping list for some reason!?!")
            return
        }

        // Trying to decide on the logic...
        let amt = upgrade.materials[material]
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
    displayShoppingList(shoppingList)

    refreshUpgradeList()
}