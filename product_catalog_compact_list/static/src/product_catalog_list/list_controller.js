import { onWillStart } from "@odoo/owl";
import { rpc } from "@web/core/network/rpc";
import { useDebounced } from "@web/core/utils/timing";
import { ListController } from "@web/views/list/list_controller";
import { ProductCatalogKanbanController } from "@product/product_catalog/kanban_controller";

export class ProductCatalogListController extends ListController {
    static template = "product_catalog_compact_list.ProductCatalogListController";

    setup() {
        super.setup();
        this.orderId = this.props.context.order_id;
        this.orderResModel = this.props.context.product_catalog_order_model;
        this.backToQuotationDebounced = useDebounced(this.backToQuotation, 500);
        this._pendingUpdate = Promise.resolve();

        onWillStart(async () => {
            await this.setOrderStateInfo();
            this._defineButtonContent();
        });
    }

    /**
     * Mimic the kanban catalog behavior: clicking a row adds the product to
     * the order (or increases its quantity) instead of opening the form view.
     *
     * @override
     */
    async openRecord(record) {
        const catalogData = record.productCatalogData;
        if (!catalogData || catalogData.readOnly) {
            return;
        }
        catalogData.quantity = (catalogData.quantity || 0) + 1;
        const price = await this._updateOrderLineInfo(record);
        catalogData.price = parseFloat(price);
    }

    _updateOrderLineInfo(record) {
        // Chain the RPC calls so the server processes updates sequentially,
        // like ProductCatalogKanbanRecord does.
        this._pendingUpdate = this._pendingUpdate.then(() =>
            rpc("/product/catalog/update_order_line_info", {
                order_id: this.orderId,
                product_id: record.resId,
                quantity: record.productCatalogData.quantity,
                res_model: this.orderResModel,
                child_field: this.props.context.child_field,
            })
        );
        return this._pendingUpdate;
    }
}

// Delegate the catalog specific behavior (order state, "Back to ..." button)
// to ProductCatalogKanbanController. The prototype lookup happens at call
// time on purpose, so that core and third-party patches of that controller
// (account, mrp, ...) apply to the list view as well.
for (const method of ["setOrderStateInfo", "_defineButtonContent", "backToQuotation"]) {
    ProductCatalogListController.prototype[method] = function (...args) {
        return ProductCatalogKanbanController.prototype[method].apply(this, args);
    };
}
Object.defineProperty(ProductCatalogListController.prototype, "stateFiels", {
    get() {
        return Object.getOwnPropertyDescriptor(
            ProductCatalogKanbanController.prototype,
            "stateFiels"
        ).get.call(this);
    },
});
