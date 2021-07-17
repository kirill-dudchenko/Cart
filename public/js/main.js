const EE = function() {
  const list = {};
  this.on = (eventName, cb) => {
    if(!list[eventName]) {
      list[eventName] = [];
    }

    list[eventName].push(cb);
  }

  this.emit = (eventName, data) => {
    if(!list[eventName]) {
      return;
    }

    list[eventName].forEach(cb => {
      cb(data);
    });
  }
}


// Model
const saveCartToStore = (data) => {
  const json = JSON.stringify(data);
  localStorage.setItem('cart', json);
}

const getCartInStore = () => {
  const json = localStorage.getItem('cart') || '[]';
  const data = JSON.parse(json);
  return data;
  
}

// Ctrls
const getProducts = async () => {
  const { data } = await axios.get('/product/list');
  return data;
}

const cart = new EE();
cart.on('change', () => {
  console.log('change');
})

const addToCart = (data) => {
  const cartData = getCartInStore();
  const { id } = data;

  const itemIdx = cartData.findIndex(val => val.id === id);
  
  if( itemIdx === -1 ) {
    cartData.push({ ...data, count: 1 })
  } else {
    cartData[itemIdx].count+=1;
  }

  saveCartToStore(cartData);
  cart.emit('change');
}

const renderProducts = async () => {
  const items = await getProducts();
  const html = items.reduce((acc, item) => {
    acc = `${acc}<div>
      <h2>${item.name}</h2>
      <div>Price: ${item.price}</div>
      <button type="button" class="buy-btn"
        data-id="${item.id}"
        data-name="${item.name}"
        data-price="${item.price}"
      >
        BUY
      </button>
    </div>`;
    return acc;
  }, '');

  const rootEl = document.querySelector('.items');
  rootEl.innerHTML = html;

  rootEl.querySelectorAll('.buy-btn').forEach((el) => {
    el.addEventListener('click', (ev) => {
      const { dataset } = ev.target;
      const data = { ...dataset };
      addToCart(data);
    })
  })
}

const renderCart = () => {
  const items = getCartInStore();
  let summ = 0; 
  const htmlDity = items.reduce((acc, item) => {
    acc.itemsHtml.push(`<div>
      <h2>${item.name}</h2>
      <div>Price: ${item.price}</div>
      <div>Count: ${item.count}</div>
    </div>`);

    acc.amount+= item.price * item.count;

    return acc;
  }, { itemsHtml: [], amount: 0 });

  const html = `
    ${htmlDity.itemsHtml.join('')}
    <hr>
    <div> Amount: ${htmlDity.amount}</div>
  `

  const rootEl = document.querySelector('.cart');
  rootEl.innerHTML = html;
}


const init = () => {
  renderProducts();
  renderCart();

  cart.on('change', renderCart);
}

init();

const renderOrderForm = () => {
  const orderFormEl = document.querySelector('.orderForm');

  const orderHtmlForm = 
  `
  <br>
  <form method=POST action=/order>
      <label for="name">Имя:</label><br>
      <input type="text" name="name" id="name"><br>
      <label for="lastname">Фамилия:</label><br>
      <input type="text" name="lastname" id="lastname"><br>
      <label for="address">Адрес</label><br>
      <input type="text" name="address" id="address"><br><br>
      <button class=finishOrderButton>Завершить оформление заказа</button>
   </form>`

  orderFormEl.innerHTML = orderHtmlForm;
}

// const sendCart = async () => {
//   await axios.post('/order', getCartInStore(), {headers: {'content-type': 'application/json'}});
// }

const orderButton = document.querySelector('.orderButton')
// const finishOrderButton = document.querySelector('.orderButton')

orderButton.addEventListener('click', () => renderOrderForm())
