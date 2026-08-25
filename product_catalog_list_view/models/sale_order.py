from odoo import models


class SaleOrder(models.Model):
    _inherit = "sale.order"

    def action_add_from_catalog(self):
        # Open the catalog in the list view by default for sale orders. This
        # runs after all other overrides in the chain, so moving the list
        # entry to the front is safe here (unlike in the mixin).
        action = super().action_add_from_catalog()
        views = action.get("views") or []
        list_view = next((view for view in views if view[1] == "list"), None)
        if list_view:
            views.remove(list_view)
            views.insert(0, list_view)
        return action
