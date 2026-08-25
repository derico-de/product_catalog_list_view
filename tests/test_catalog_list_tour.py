from odoo.tests import HttpCase, tagged


@tagged("post_install", "-at_install")
class TestCatalogListTour(HttpCase):
    def test_catalog_list_view_tour(self):
        self.env["product.product"].create(
            {
                "name": "Catalog List Test Product",
                "default_code": "CLTP-001",
                "list_price": 10.0,
                "sale_ok": True,
            }
        )
        partner = self.env["res.partner"].create({"name": "Catalog List Partner"})
        order = self.env["sale.order"].create({"partner_id": partner.id})

        self.start_tour(
            f"/odoo/sales/{order.id}",
            "product_catalog_list_view_tour",
            login="admin",
        )

        order.invalidate_recordset()
        self.assertEqual(len(order.order_line), 1)
        self.assertEqual(
            order.order_line.product_id.default_code,
            "CLTP-001",
            "The product added from the catalog list must be on the order.",
        )
        self.assertEqual(
            order.order_line.product_uom_qty,
            2,
            "One row click plus one '+' click must result in quantity 2.",
        )
