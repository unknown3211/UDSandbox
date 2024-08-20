import { ItemsList } from './itemlist';
import { currentUserId } from '../../main';

export function GetItemById(id: number) {
    return ItemsList.find(item => item.id === id);
}

export function GetItemByName(name: string) {
    return ItemsList.find(item => item.name === name);
}

export class Inventory {
    private items: { id: number, name: string, description: string, quantity: number }[] = [];

    async fetchInventory(userId: number) {
        try {
            const response = await fetch(`http://localhost:3000/inventory/${userId}`);
            if (response.ok) {
                const inventoryItems = await response.json();
                this.items = inventoryItems.map((item: { item_id: number, quantity: number }) => {
                    const itemDetails = GetItemById(item.item_id);
                    return { ...itemDetails, quantity: item.quantity };
                });
                this.updateInventoryList();
            } else {
                console.error('Failed to fetch inventory. Status:', response.status);
            }
        } catch (error) {
            console.error('Error fetching inventory:', error);
        }
    }

    async addItem(itemId: number, quantity: number = 1, userId: number) {
        const item = GetItemById(itemId);
        if (item) {
            const existingItem = this.items.find(i => i.id === itemId);
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                this.items.push({ ...item, quantity });
            }
            console.log(`Adding item: ${item.name} (x${quantity})`);
            await this.updateInventoryDatabase(itemId, quantity, 'add', userId);
            this.updateInventoryList();
        } else {
            console.log(`Item with id ${itemId} not found`);
        }
    }

    async removeItem(itemId: number, quantity: number = 1, userId: number) {
        const itemIndex = this.items.findIndex(i => i.id === itemId);
        if (itemIndex !== -1) {
            if (this.items[itemIndex].quantity > quantity) {
                this.items[itemIndex].quantity -= quantity;
            } else {
                this.items.splice(itemIndex, 1);
            }
            console.log(`Removing item: ${itemId} (x${quantity})`);
            await this.updateInventoryDatabase(itemId, quantity, 'remove', userId);
            this.updateInventoryList();
        } else {
            console.log(`Item with id ${itemId} not found in inventory`);
        }
    }

    async HasItem(itemId: number, quantity: number) {
        const item = this.items.find(i => i.id === itemId);
        if (item) {
            return item.quantity >= quantity;
        }
        return false;
    }

    getItems() {
        return this.items;
    }

    private async updateInventoryDatabase(itemId: number, quantity: number, action: 'add' | 'remove', userId: number) {
        const url = action === 'add' ? 'http://localhost:3000/inventory/add' : 'http://localhost:3000/inventory/remove';
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId, itemId, quantity })
        });

        if (!response.ok) {
            console.error('Error updating inventory in database. Status:', response.status);
        } else {
            console.log('Inventory updated');
        }
    }

    private updateInventoryList() {
        const inventoryList = document.getElementById('inventory-list');
        if (inventoryList) {
            inventoryList.innerHTML = '';
            this.getItems().forEach(item => {
                const li = document.createElement('li');
                li.innerText = `${item.name} - ${item.description} (x${item.quantity})`;
                inventoryList.appendChild(li);
            });
        } else {
            console.error('Element with id "inventory-list" not found');
        }
    }

    public refreshUI() {
        this.updateInventoryList();
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

        const fetchButton = document.createElement('button');
        fetchButton.innerText = 'Fetch Inventory';
        fetchButton.style.display = 'block';
        fetchButton.style.margin = '10px auto';
        fetchButton.addEventListener('click', async () => {
            if (currentUserId) {
            await inventory.fetchInventory(currentUserId);
            }
        });

        inventoryUI.appendChild(fetchButton);

        document.body.appendChild(inventoryUI);
        inventory.refreshUI();
    } else {
        if (inventoryUI) {
            document.body.removeChild(inventoryUI);
            inventoryUI = null;
        }
    }
    isOpen = !isOpen;
}

export const inventory = new Inventory();
