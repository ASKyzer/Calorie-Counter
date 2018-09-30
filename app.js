// Storage Controller
const StorageCtrl = (function() {
  
  
})(); // Iffy runs immediately


// Item Controller //////////////////////////////////////
const ItemCtrl = (function() {
  // Item constructor
  const Item = function(id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  }

  //Data Structure / State
  const data = {
    items: [
      // {id: 1, name: 'Steaks', calories: 1200},
      // {id: 2, name: 'Eggs', calories: 500},
      // {id: 3, name: 'Cake', calories: 600}
    ],
    currentItem: null, // The item to be updated
    totalCalories: 0
  }

  // Public Methods
  return {
    getItems: function() {
      return data.items;
    },
    addItem: function(name, calories) {
      let ID;
      // create ID
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id +1;
      } else {
        ID = 0;
      }   
      
      // Calories to number
      calories = parseInt(calories);

      // Create new item
      newItem = new Item(ID, name, calories);
      // Add to items array
      data.items.push(newItem);

      return newItem;
    },
    getItemById: function(id){
      let found = null
      // loop through the items for the current id
      data.items.forEach(function(item){
        if(item.id === id) {
          found = item;
        }
      })

      return found;
    },
    setCurrentItem: function(item){
      data.currentItem = item;
      console.log(item);
      
    },
    getCurrentItem: function(){
      return data.currentItem;
    },
    getTotalCalories: function(calories){
      let total = 0;

      // loop through items and add calories
      data.items.forEach(function(item){
        total += item.calories;
      })
      
      // Set total calories to data structure
      data.totalCalories = total;

      // Return Total
      return data.totalCalories;     
    },
    logData: function() {
      return data;
    }
  }
})(); // Iffy runs immediately


// UI Controller /////////////////////////////////////
const UICtrl = (function() {
  // Creat UI Selectors
  const UISelectors = {
    itemList: '#item-list',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    itemName: '#item-name',
    itemCalories: '#item-calories',
    totalCalories: '.total-calories',
    editItem: '.edit-item'
  }

  // Public Methods 
  return {
    populateItemList: function(items) {
      html = '';

      items.forEach(function(item){
        html += `
        <li class="collection-item" id="item-${item.id}">
        <strong>${item.name}: </strong> <em>${item.calories}</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>
      </li>
        `;
      })
      // Insert list to UI
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    // Get item input
    getItemInput: function(){
      return {
        name: document.querySelector(UISelectors.itemName).value,
        calories: document.querySelector(UISelectors.itemCalories).value
      }
    },
    addListItem: function(item){
      // Show list items
      document.querySelector(UISelectors.itemList).style.display = 'block';
      // Create li element
      const li = document.createElement('li');
      // add class
      li.className = 'collection-item';
      // Add ID
      li.id = `item-${item.id}`;
      // Add html
      li.innerHTML = `
        <strong>${item.name}: </strong> <em>${item.calories}</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>
      `;
      // Insert item
      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
    },
    // Clear input fields
    clearInput: function(){
      document.querySelector(UISelectors.itemName).value = '';
      document.querySelector(UISelectors.itemCalories).value = '';
    },
    addItemToForm: function(){
      document.querySelector(UISelectors.itemName).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCalories).value = ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },
    // hide List when the document loads
    hideList: function(){
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },
    displayTotalCalories: function(totalCalories){
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
    },
    // make sure the edit state is clear
    clearEditState: function(){
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
      document.querySelector(UISelectors.addBtn).style.display = 'inline';
    },
    showEditState: function(item){
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
      document.querySelector(UISelectors.addBtn).style.display = 'none';
    },
    // get UISelectors
    getSelectors: function(){
      return UISelectors;
    }
  }
})(); // Iffy runs immediately


// App Controller ////////////////////////////////////
const App = (function(ItemCtrl, UICtrl, StorageCtrl) {
  // Load Event Listeners function
  const loadEventListeners = function(){
    // get UI Selectors
    const UISelectors = UICtrl.getSelectors();
    // Add item event
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);
    // Edit icon click event
    document.querySelector(UISelectors.itemList).addEventListener('click', itemUpdateSubmit)
  }

  // Add item submit
  const itemAddSubmit = function(e){
    // Get form input from UI Controller
    const input = UICtrl.getItemInput();

    // Make sure the name and calories are entered
    if (input.name !== '' && input.calories !== '') {
      // Add item
      const newItem = ItemCtrl.addItem(input.name, input.calories)

      // Add item to UI list
      UICtrl.addListItem(newItem);

      // Get total callories
      const totalCalories = ItemCtrl.getTotalCalories();

      // Add total calories to UI
      UICtrl.displayTotalCalories(totalCalories);

      // Clear input
      UICtrl.clearInput();
    }

    e.preventDefault();
  }

  // Update item submit
  const itemUpdateSubmit = function(e){
    if(e.target.classList.contains('edit-item')){
      // Get list item id
      const listId = e.target.parentNode.parentNode.id;
      // Get the actual id
      // Break into an array and split at the dash
      const listIdArr = listId.split('-');
      // id is in the 1 index
      const id = parseInt(listIdArr[1]);
      // Add to current item
      const itemToEdit = ItemCtrl.getItemById(id);
      // Show edit state
      ItemCtrl.setCurrentItem(itemToEdit);
      // Add items to form
      UICtrl.addItemToForm();
    }
    e.preventDefault();
  }


  return {
    init: function() {
      // Set initial state
      UICtrl.clearEditState();
      // Fetch Items from data structure
      const items = ItemCtrl.getItems();

      // Check to see if there are any items
      if (items.length === 0) {
        UICtrl.hideList();
      } else {
        // Populate list with items
        UICtrl.populateItemList(items);
      }

      // Get total callories
      const totalCalories = ItemCtrl.getTotalCalories();

      // Add total calories to UI
      UICtrl.displayTotalCalories(totalCalories);

      // Load event listeners
      loadEventListeners();
    }
  }  
})(ItemCtrl, UICtrl, StorageCtrl); // Iffy runs immediately

App.init();
