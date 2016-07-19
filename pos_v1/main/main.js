'use strict';
function printReceipt(tags) {
  let allItems = loadAllItems();
  let promotions=loadPromotions();
  let cartItems = buildItemsCount(tags,allItems);
  let receiptItems=buildReceiptItems(cartItems,promotions);
  let receipts=buildItemsReceipt(receiptItems);
  let printReceipt=printItemsReceipt(receipts);
  console.log(printReceipt);
}

function buildItemsCount(tags,allItems) {
  let cartItems = [];

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

let buildReceiptItems=(cartItems,promotions) =>{
  return cartItems.map(cartItem =>{
    let promotionType = getPromotionType(cartItem.item.barcode,promotions);
    let {subtotal, saved}=discount(cartItem,promotionType);
    return  {cartItem,subtotal,saved};
  });
};

let getPromotionType=(barcode,promotions)=>{
  let promotion=promotions.find(promotion => promotion.barcodes.includes(barcode));
  return promotion ? promotion.type : '';
};

let discount=(cartItem,promotionType)=>{
  let freeItemCount=0;
  if(promotionType==='BUY_TWO_GET_ONE_FREE'){
    freeItemCount=parseInt(cartItem.count/3);
  }

  let saved=freeItemCount*cartItem.item.price;
  let subtotal= cartItem.count*cartItem.item.price-saved;

  return {saved,subtotal};
};

let buildItemsReceipt=(receiptItems)=> {
  let receipts;

  let total = 0, saved = 0;
  for (let receiptItem of receiptItems) {
    total += receiptItem.subtotal;
    saved += receiptItem.saved;
  }
  receipts = {receiptItems, total, saved};

  return receipts;
};

let printItemsReceipt=(itemReceipts) =>{
  let details = '';

  for (let itemReceipt of itemReceipts.receiptItems) {
    details += `名称：${itemReceipt.cartItem.item.name}，数量：${itemReceipt.cartItem.count}${itemReceipt.cartItem.item.unit}，单价：${itemReceipt.cartItem.item.price.toFixed(2)}(元)，小计：${itemReceipt.subtotal.toFixed(2)}(元)
`;
  }

  let printreceipts = `***<没钱赚商店>收据***
${details}----------------------
总计：${itemReceipts.total.toFixed(2)}(元)
节省：${itemReceipts.saved.toFixed(2)}(元)
**********************`;

  return printreceipts;
};
