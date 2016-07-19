'use strict';
function printReceipt(tags) {
  let itemCounts = buildItemsCount(tags);
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
      itemSubtotals.push({cartItem: cartItem,
        subtotal:(cartItem.count- parseInt(cartItem.count / 3)) * cartItem.item.price,
        save:parseInt(cartItem.count / 3) * cartItem.item.price});
    } else {
      itemSubtotals.push({cartItem: cartItem, subtotal: cartItem.count * cartItem.item.price,save:0});
    }
  }

  return itemSubtotals;
}

function buildItemsReceipt(itemSubtotals){
  let itemReceipts;
  let total=0,save=0;
  for(let itemSubtotal of itemSubtotals) {
    total+=itemSubtotal.subtotal;
    save+=itemSubtotal.save;
  }
    itemReceipts={itemReceipt:itemSubtotals,total:total,save:save};
  return itemReceipts;
}

