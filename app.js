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
      {id: 1, name: 'Steaks', calories: 1200},
      {id: 2, name: 'Eggs', calories: 500},
      {id: 3, name: 'Cake', calories: 600}
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
    itemName: '#item-name',
    itemCalories: '#item-calories'
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

      // Clear input
      UICtrl.clearInput();
      
    }
    e.preventDefault();

  }


  return {
    init: function() {
      // Fetch Items from data structure
      const items = ItemCtrl.getItems();

      // Populate list with items
      UICtrl.populateItemList(items);

      // Load event listeners
      loadEventListeners();
    }
  }  
})(ItemCtrl, UICtrl, StorageCtrl); // Iffy runs immediately

App.init();
