import { ListRenderer } from "@web/views/list/list_renderer";

export class ProductCatalogListRenderer extends ListRenderer {
    /**
     * Highlight the rows of products that are already in the order, like the
     * kanban catalog does with its cards.
     *
     * @override
     */
    getRowClass(record) {
        let classes = super.getRowClass(record);
        if (record.productCatalogData?.quantity) {
            classes += " o_product_added";
        }
        return classes;
    }
}
