import { ItemsList } from './itemlist';

export function GetItemById(id: number) {
    return ItemsList.find(item => item.id === id);
}

export function GetItemByName(name: string) {
    return ItemsList.find(item => item.name === name);
}

export class Inventory {
    private items: { id: number, name: string, description: string, quantity: number }[] = [];

    addItem(itemId: number, quantity: number = 1) {
        const item = GetItemById(itemId);
        if (item) {
            const existingItem = this.items.find(i => i.id === itemId);
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                this.items.push({ ...item, quantity });
            }
            console.log(`Adding item: ${item.name} (x${quantity})`);
            console.log(`Current inventory:`, this.items);
            updateInventoryList();
        } else {
            console.log(`Item with id ${itemId} not found`);
        }
    }

    removeItem(itemId: number, quantity: number = 1) {
        const itemIndex = this.items.findIndex(i => i.id === itemId);
        if (itemIndex !== -1) {
            if (this.items[itemIndex].quantity > quantity) {
                this.items[itemIndex].quantity -= quantity;
            } else {
                this.items.splice(itemIndex, 1);
            }
            console.log(`Removing item: ${itemId} (x${quantity})`);
            updateInventoryList();
        } else {
            console.log(`Item with id ${itemId} not found in inventory`);
        }
    }

    getItems() {
        return this.items;
    }
}

let inventoryUI: HTMLDivElement | null = null;
let isOpen = false;

export function InventoryUI() {
    if (!isOpen) {
        inventoryUI = document.createElement('div');
        inventoryUI.style.position = 'fixed';
        inventoryUI.style.top = '10px';
        inventoryUI.style.left = '50%';
        inventoryUI.style.transform = 'translateX(-50%)';
        inventoryUI.style.width = '300px';
        inventoryUI.style.padding = '10px';
        inventoryUI.style.border = '1px solid #ccc';
        inventoryUI.style.borderRadius = '5px';
        inventoryUI.style.backgroundColor = '#fff';
        inventoryUI.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        inventoryUI.style.fontSize = '14px';

        const title = document.createElement('h2');
        title.innerText = 'Inventory';
        title.style.textAlign = 'center';
        inventoryUI.appendChild(title);

        const inventoryList = document.createElement('ul');
        inventoryList.id = 'inventory-list';
        inventoryUI.appendChild(inventoryList);

        document.body.appendChild(inventoryUI);
        updateInventoryList();
    } else {
        if (inventoryUI) {
            document.body.removeChild(inventoryUI);
            inventoryUI = null;
        }
    }
    isOpen = !isOpen;
}

export const inventory = new Inventory();

function updateInventoryList() {
    const inventoryList = document.getElementById('inventory-list');
    if (inventoryList) {
        inventoryList.innerHTML = '';
        inventory.getItems().forEach(item => {
            const li = document.createElement('li');
            li.innerText = `${item.name} - ${item.description} (x${item.quantity})`;
            inventoryList.appendChild(li);
        });
    }
}