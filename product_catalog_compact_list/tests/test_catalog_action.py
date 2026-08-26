from odoo.tests import TransactionCase, tagged


@tagged("post_install", "-at_install")
class TestCatalogAction(TransactionCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.partner = cls.env["res.partner"].create({"name": "Catalog Test Partner"})
        cls.order = cls.env["sale.order"].create({"partner_id": cls.partner.id})
        cls.list_view = cls.env.ref(
            "product_catalog_compact_list.product_view_list_catalog"
        )

    def test_catalog_action_contains_list_view(self):
        action = self.order.action_add_from_catalog()
        self.assertIn(
            (self.list_view.id, "list"),
            action["views"],
            "The catalog action must propose the catalog list view.",
        )

    def test_list_view_is_default_for_sale_order(self):
        action = self.order.action_add_from_catalog()
        self.assertEqual(
            action["views"][0],
            (self.list_view.id, "list"),
            "The catalog must open in the list view for sale orders.",
        )
        view_types = [view[1] for view in action["views"]]
        self.assertIn("kanban", view_types, "The kanban view must remain available.")
