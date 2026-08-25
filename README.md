# Product Catalog List View

Adds a compact list view to the product catalog (the "Catalog" screen used to
add products to sale orders, purchase orders, invoices, ...).

You might also want to have a look at, which solve the same problem slighly differently.
[[https://github.com/derico-de/product_catalog_list_view](https://github.com/derico-de/invoice_product_multi_add)](https://github.com/derico-de/invoice_product_multi_add)
They can be installed together.

## Why

The default catalog only offers a kanban view whose cards show a product image
and take a lot of space. 

<img width="1787" height="371" alt="grafik" src="https://github.com/user-attachments/assets/bba9f442-474b-45b0-9117-19841c659f60" />

With a large product range the list view fits many
more products on one screen while keeping the full catalog behavior:

- clicking a row adds the product to the order,
- the quantity can be changed directly in the row (+/-, direct input),
- price display and the *Back to Quotation/Order* button work exactly like in
  the kanban catalog.

For sale orders the catalog opens in the list view by default; the kanban view
stays available through the view switcher. On other documents (purchase
orders, invoices, ...) the catalog still opens in kanban and the list view is
offered in the view switcher.

<img width="1780" height="344" alt="grafik" src="https://github.com/user-attachments/assets/e096e32e-99db-447f-a62f-af6dcd2b988b" />


## Usage

1. Open a sale order and click *Catalog* above the order lines.
2. Click a row (or the *Add* button) to add the product to the order.
3. Adjust the quantity with *+* / *-* or by typing into the quantity field.
4. Click *Back to Quotation* to return to the order.

## Technical notes

- The list view reuses the catalog kanban machinery (`ProductCatalogKanbanModel`,
  `ProductCatalogKanbanRecord`, `ProductCatalogKanbanController`) through
  call-time delegation, so core and third-party patches (purchase, account,
  mrp, ...) keep working in the list view.
- To make the list view the default on another model, override
  `action_add_from_catalog` on that model (after `super()`) and move the
  `list` entry of `action["views"]` to the front — see `models/sale_order.py`.

## Known limitations

- Section handling (invoices/purchase orders with sections) follows the
  currently selected section only for the quantity widget, not for the
  row-click shortcut.

## Authors

- derico

## Contributors

- Maik Derstappen \<md@derico.de\>
