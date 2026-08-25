import { registry } from "@web/core/registry";
import { listView } from "@web/views/list/list_view";
import { ProductCatalogKanbanModel } from "@product/product_catalog/kanban_model";
import { productCatalogKanbanView } from "@product/product_catalog/kanban_view";

import { ProductCatalogListController } from "./list_controller";
import { ProductCatalogListRenderer } from "./list_renderer";

// The kanban catalog model is reused as-is: despite its name it is a plain
// RelationalModel extension whose only job is to attach the catalog order
// line data (quantity, price, ...) to each record, which is exactly what the
// list view needs as well. Reusing it also keeps third-party patches of that
// model working in the list view.
export const productCatalogListView = {
    ...listView,
    Controller: ProductCatalogListController,
    Model: ProductCatalogKanbanModel,
    Renderer: ProductCatalogListRenderer,
    // account (and possibly others) patch the kanban catalog view object with
    // a custom SearchModel/SearchPanel (sections support) that the patched
    // ProductCatalogKanbanModel relies on. Resolve them lazily so the list
    // view picks those patches up regardless of the module loading order;
    // undefined falls back to the default search model/panel.
    get SearchModel() {
        return productCatalogKanbanView.SearchModel;
    },
    get SearchPanel() {
        return productCatalogKanbanView.SearchPanel;
    },
};

registry.category("views").add("product_list_catalog", productCatalogListView);
