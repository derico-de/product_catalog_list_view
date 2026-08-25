from odoo import models


class ProductCatalogMixin(models.AbstractModel):
    _inherit = "product.catalog.mixin"

    def action_add_from_catalog(self):
        action = super().action_add_from_catalog()
        list_view_id = self.env.ref(
            "product_catalog_list_view.product_view_list_catalog"
        ).id
        views = action.get("views") or []
        # Insert the list view right after the kanban entry. Never insert it
        # at index 0 here: some overrides (e.g. purchase) replace views[0]
        # assuming it holds the kanban view.
        kanban_index = next(
            (index for index, view in enumerate(views) if view[1] == "kanban"), 0
        )
        views.insert(kanban_index + 1, (list_view_id, "list"))
        action["views"] = views
        return action
