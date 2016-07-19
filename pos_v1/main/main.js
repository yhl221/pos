'use strict';
function printReceipt(tags) {
  let cartItems = buildItemsCount(tags);
  let itemSubtotals = buildItemsSubtotal(cartItems);
  let itemReceipts = buildItemsReceipt(itemSubtotals);
  let receipts = printItemsReceipt(itemReceipts);
  console.log(receipts);
}

function buildItemsCount(tags) {
  let cartItems = [];
  let allItems = loadAllItems();

  for (let tag of tags) {
    let splitedTag = tag.split('-');
    let barcode = splitedTag[0];
    let count = parseFloat(splitedTag[1] || 1);

    let cartItem = cartItems.find(cartItem => cartItem.item.barcode === barcode);
    if (cartItem) {
      cartItem.count++;
    } else {
      let item = allItems.find(item => item.barcode === barcode);
      cartItems.push({item: item, count: count});
    }
  }
  
  return cartItems;
}


function buildItemsSubtotal(cartItems) {
  let itemSubtotals = [];
  let allPromotions = loadPromotions();

  for (let cartItem of cartItems) {
    let itemPromotion = allPromotions[0].barcodes.find((itemPromotion) => {

      return itemPromotion === cartItem.item.barcode
    });
    if (itemPromotion) {
      itemSubtotals.push({
        cartItem: cartItem,
        subtotal: (cartItem.count - parseInt(cartItem.count / 3)) * cartItem.item.price,
        save: parseInt(cartItem.count / 3) * cartItem.item.price
      });
    } else {
      itemSubtotals.push({cartItem: cartItem, subtotal: cartItem.count * cartItem.item.price, save: 0});
    }
  }

  return itemSubtotals;
}

function buildItemsReceipt(itemSubtotals) {
  let itemReceipts;

  let total = 0, save = 0;
  for (let itemSubtotal of itemSubtotals) {
    total += itemSubtotal.subtotal;
    save += itemSubtotal.save;
  }
  itemReceipts = {itemReceipt: itemSubtotals, total: total, save: save};

  return itemReceipts;
}

function printItemsReceipt(itemReceipts) {
  let details = '';

  for (let itemReceipt of itemReceipts.itemReceipt) {
    details += `名称：${itemReceipt.cartItem.item.name}，数量：${itemReceipt.cartItem.count}${itemReceipt.cartItem.item.unit}，单价：${itemReceipt.cartItem.item.price.toFixed(2)}(元)，小计：${itemReceipt.subtotal.toFixed(2)}(元)
`;
  }

  let receipts = `***<没钱赚商店>收据***
${details}----------------------
总计：${itemReceipts.total.toFixed(2)}(元)
节省：${itemReceipts.save.toFixed(2)}(元)
**********************`;

  return receipts;
}
