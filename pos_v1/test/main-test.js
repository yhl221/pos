'use strict';

describe('pos', () => {
         let inputs;
         let itemCounts;
         let itemSubtotals;
        beforeEach(() => {
            inputs = [
                'ITEM000001',
                'ITEM000001',
                'ITEM000001',
                'ITEM000001',
                'ITEM000001',
                'ITEM000003-2',
                'ITEM000005',
                'ITEM000005',
                'ITEM000005'
            ];
        });

  beforeEach(() => {
    itemCounts = [
      {
        item: {
          barcode: 'ITEM000001',
          name: '雪碧',
          unit: '瓶',
          price: 3.00
        },
        count: 5
      },
      {
        item: {
          barcode: 'ITEM000003',
          name: '荔枝',
          unit: '斤',
          price: 15.00
        },
        count: 2
      },
      {
        item: {
          barcode: 'ITEM000005',
          name: '方便面',
          unit: '袋',
          price: 4.50
        },
        count: 3
      }
    ];
  });

  beforeEach(() => {
    itemSubtotals = [
      {
        itemCount: {
          item: {
            barcode: 'ITEM000001',
            name: '雪碧',
            unit: '瓶',
            price: 3.00
          },
          count: 5
        },
        subtotal: 12.00,
        save:3.00
      },
      {
        itemCount: {
          item: {
            barcode: 'ITEM000003',
            name: '荔枝',
            unit: '斤',
            price: 15.00
          },
          count: 2
        },
        subtotal: 30.00,
        save:0.00
      },
      {
        itemCount: {
          item: {
            barcode: 'ITEM000005',
            name: '方便面',
            unit: '袋',
            price: 4.50
          },
          count: 3
        },
        subtotal: 9.00,
        save:4.50
      }
    ];
  });

        it(' print receipts', () => {

            spyOn(console, 'log');

            printReceipt(inputs);

            const expectReceipts = `***<没钱赚商店>收据***
名称：雪碧，数量：5瓶，单价：3.00(元)，小计：12.00(元)
名称：荔枝，数量：2斤，单价：15.00(元)，小计：30.00(元)
名称：方便面，数量：3袋，单价：4.50(元)，小计：9.00(元)
----------------------
总计：51.00(元)
节省：7.50(元)
**********************`;

            expect(console.log).toHaveBeenCalledWith(expectReceipts);
        });

    it(' print correct itemsCounts', () => {

        let itemCounts;

        itemCounts = buildItemsCount(inputs);

        const expectitemCounts = [
            {
                item: {
                    barcode: 'ITEM000001',
                    name: '雪碧',
                    unit: '瓶',
                    price: 3.00
                },
                count: 5
            },
            {
                item: {
                    barcode: 'ITEM000003',
                    name: '荔枝',
                    unit: '斤',
                    price: 15.00
                },
                count: 2
            },
            {
                item: {
                    barcode: 'ITEM000005',
                    name: '方便面',
                    unit: '袋',
                    price: 4.50
                },
                count: 3
            }
        ];

        expect(itemCounts).toEqual(expectitemCounts);
    });

  it(' print correct itemSubtotals', () => {

    let itemSubtotals = buildItemsSubtotal(itemCounts);
    const expectText = [
      {
        cartItem: {
          item: {
            barcode: 'ITEM000001',
            name: '雪碧',
            unit: '瓶',
            price: 3.00
          },
          count: 5
      },
        subtotal: 12.00,
        save:3.00
      },
      {
        cartItem: {
          item: {
            barcode: 'ITEM000003',
            name: '荔枝',
            unit: '斤',
            price: 15.00
          },
          count: 2
        },
        subtotal: 30.00,
        save:0.00
      },
      {
        cartItem: {
          item: {
            barcode: 'ITEM000005',
            name: '方便面',
            unit: '袋',
            price: 4.50
          },
          count: 3
        },
        subtotal: 9.00,
        save:4.50
      }
    ];

    expect(itemSubtotals).toEqual(expectText);
  });

  it(' print correct itemReceipts', ()=> {

    let itemReceipts = buildItemsReceipt(itemSubtotals);
    const expectText = {
      itemReceipt: [
        {
          itemCount: {
            item: {
              barcode: 'ITEM000001',
              name: '雪碧',
              unit: '瓶',
              price: 3.00
            },
            count: 5
          },
          subtotal: 12.00,
          save:3.00
        },
        {
          itemCount: {
            item: {
              barcode: 'ITEM000003',
              name: '荔枝',
              unit: '斤',
              price: 15.00
            },
            count: 2
          },
          subtotal: 30.00,
          save:0.00
        },
        {
          itemCount: {
            item: {
              barcode: 'ITEM000005',
              name: '方便面',
              unit: '袋',
              price: 4.50
            },
            count: 3
          },
          subtotal: 9.00,
          save:4.50
        }
      ],
      total: 51.00,
      save:7.50
    };
    expect(itemReceipts).toEqual(expectText);
  });
});






