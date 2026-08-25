import { registry } from "@web/core/registry";

registry.category("web_tour.tours").add("product_catalog_list_view_tour", {
    steps: () => [
        {
            content: "Open the product catalog",
            trigger: "button[name=action_add_from_catalog]",
            run: "click",
        },
        {
            content: "The catalog opens in the list view; click the row to add the product",
            trigger: ".o_list_renderer .o_data_row:contains('Catalog List Test Product') td[name=name]",
            run: "click",
        },
        {
            content: "The row is highlighted and shows the quantity controls",
            trigger: ".o_data_row.o_product_added .o_product_catalog_quantity input",
        },
        {
            content: "Increase the quantity",
            trigger: ".o_data_row.o_product_added .o_product_catalog_quantity button:has(.fa-plus)",
            run: "click",
        },
        {
            content: "Wait for the debounced quantity update to be sent",
            trigger: ".o_data_row.o_product_added",
            run: () => new Promise((resolve) => setTimeout(resolve, 700)),
        },
        {
            content: "Remove the product again",
            trigger: ".o_data_row.o_product_added .o_product_catalog_buttons button:has(.fa-trash)",
            run: "click",
        },
        {
            content: "The row is no longer marked as added",
            trigger: ".o_data_row:contains('Catalog List Test Product'):not(.o_product_added) .o_product_catalog_buttons button:has(.fa-shopping-cart)",
        },
        {
            content: "Re-add the product via the Add button",
            trigger: ".o_data_row:contains('Catalog List Test Product') .o_product_catalog_buttons button:has(.fa-shopping-cart)",
            run: "click",
        },
        {
            content: "Increase the quantity again",
            trigger: ".o_data_row.o_product_added .o_product_catalog_quantity button:has(.fa-plus)",
            run: "click",
        },
        {
            content: "Wait for the debounced quantity update to be sent",
            trigger: ".o_data_row.o_product_added",
            run: () => new Promise((resolve) => setTimeout(resolve, 700)),
        },
        {
            content: "Go back to the order",
            trigger: "button.o-kanban-button-back",
            run: "click",
        },
        {
            content: "The order line has been added",
            trigger: ".o_field_widget[name=order_line] .o_data_row:contains('Catalog List Test Product')",
        },
    ],
});
