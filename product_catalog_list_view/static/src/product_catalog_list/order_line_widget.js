import { Component, useSubEnv } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { useDebounced } from "@web/core/utils/timing";
import { ProductCatalogKanbanRecord } from "@product/product_catalog/kanban_record";

/**
 * List view widget rendering the catalog order line component (price, add /
 * remove buttons and quantity input) in a list cell.
 *
 * The quantity handling is not reimplemented: the widget inherits from
 * ProductCatalogKanbanRecord's prototype (see bottom of this file), so it
 * only has to mirror the instance attributes and the sub-environment that
 * the inherited methods rely on.
 */
export class ProductCatalogOrderLineWidget extends Component {
    static template = "product_catalog_list_view.ProductCatalogOrderLineWidget";
    static props = {
        record: Object,
        readonly: { type: Boolean, optional: true },
        "*": true,
    };

    setup() {
        this.debouncedUpdateQuantity = useDebounced(this._updateQuantity, 500, {
            execBeforeUnmount: true,
        });
        this._pendingUpdate = Promise.resolve();

        const context = this.props.record.context;
        const subEnv = {
            currencyId: context.product_catalog_currency_id,
            orderId: context.product_catalog_order_id,
            orderResModel: context.product_catalog_order_model,
            digits: context.product_catalog_digits,
            displayUoM: context.display_uom,
            precision: context.precision,
            productId: this.props.record.resId,
            addProduct: this.addProduct.bind(this),
            removeProduct: this.removeProduct.bind(this),
            increaseQuantity: this.increaseQuantity.bind(this),
            setQuantity: this.setQuantity.bind(this),
            decreaseQuantity: this.decreaseQuantity.bind(this),
            childField: context.child_field,
        };
        if (this.env.searchModel?.selectedSection) {
            // account/purchase add sections support to the catalog and read
            // the selected section from the sub-environment.
            subEnv.selectedSectionId = this.env.searchModel.selectedSection.sectionId;
        }
        useSubEnv(subEnv);
    }

}

// Reuse the quantity handling, the order line sub-component selection and any
// helper methods of the catalog kanban record by inserting its prototype into
// the widget's prototype chain. Method lookup thus happens at call time, so
// core and third-party patches of ProductCatalogKanbanRecord (purchase,
// account, sale_stock, ...) — including methods they add, such as account's
// notifyLineCountChange() — apply to the list view as well. The kanban
// record's setup() is intentionally never called (it requires kanban view
// props); this widget's setup() mirrors the parts it needs instead.
Object.setPrototypeOf(
    ProductCatalogOrderLineWidget.prototype,
    ProductCatalogKanbanRecord.prototype
);

export const productCatalogOrderLineWidget = {
    component: ProductCatalogOrderLineWidget,
    listViewWidth: 330,
};

registry
    .category("view_widgets")
    .add("product_catalog_order_line", productCatalogOrderLineWidget);
