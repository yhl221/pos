'use strict';
function printReceipt(tags) {
  let allItems = loadAllItems();
  let promotions = loadPromotions();
  let cartItems = buildItemsCount(tags, allItems);
  let receiptItems = buildReceiptItems(cartItems, promotions);
  let receipts = buildItemsReceipt(receiptItems);
  let printReceipt = printItemsReceipt(receipts);
  console.log(printReceipt);
}

function buildItemsCount(tags, allItems) {
  let cartItems = [];

  for (let tag of tags) {
    let splitedTag = tag.split('-');
    let barcode = splitedTag[0];
    let count = parseFloat(splitedTag[1] || 1);

    let cartItem = cartItems.find(cartItem => cartItem.item.barcode === barcode);
    if (cartItem) {
      cartItem.count+=count;
    } else {
      let item = allItems.find(item => item.barcode === barcode);
      cartItems.push({item,count});
    }
  }

  return cartItems;
}

let buildReceiptItems = (cartItems, promotions) => {
  return cartItems.map(cartItem => {
    let promotionType = getPromotionType(cartItem.item.barcode, promotions);
    let {subtotal, saved}=discount(cartItem, promotionType);
    return {cartItem, subtotal, saved};
  });
};

let getPromotionType = (barcode, promotions)=> {
  let promotion = promotions.find(promotion => promotion.barcodes.some(b=>b===barcode));
  return promotion ? promotion.type : undefined;
};

let discount = (cartItem, promotionType)=> {
   let saved=0;
  let subtotal=cartItem.item.price*cartItem.count;
  if (promotionType === 'BUY_TWO_GET_ONE_FREE') {
    saved= parseInt(cartItem.count / 3)*cartItem.item.price;
  }
  subtotal-=saved;
  return {saved, subtotal};
};

let buildItemsReceipt = (receiptItems)=> {

  let total = 0, savedTotal = 0;
  for (let receiptItem of receiptItems) {
    total += receiptItem.subtotal;
    savedTotal += receiptItem.saved;
  }
  return {receiptItems, total, savedTotal};
};

let printItemsReceipt = (itemReceipts) => {

  let details = itemReceipts.receiptItems.map(receiptItem=>{
    let cartItem=receiptItem.cartItem;
      return `名称：${cartItem.item.name}，\
数量：${cartItem.count}${cartItem.item.unit}，\
单价：${cartItem.item.price.toFixed(2)}(元)，\
小计：${receiptItem.subtotal.toFixed(2)}(元)\
`;})
    .join('\n');

  return `***<没钱赚商店>收据***
${details}
----------------------
总计：${itemReceipts.total.toFixed(2)}(元)
节省：${itemReceipts.savedTotal.toFixed(2)}(元)
**********************`;
};


