{
    "name": "Product Catalog List View",
    "summary": "Add a compact list view to the product catalog",
    "version": "19.0.1.0.0",
    "development_status": "Beta",
    "category": "Sales/Sales",
    "author": "derico",
    "website": "https://derico.de",
    "support": "md@derico.de",
    "license": "AGPL-3",
    "images": [
        "static/description/banner.png",
    ],
    "depends": [
        "product",
        "sale",
    ],
    "data": [
        "views/product_views.xml",
    ],
    "assets": {
        "web.assets_backend": [
            "product_catalog_list_view/static/src/**/*",
        ],
        "web.assets_tests": [
            "product_catalog_list_view/static/tests/tours/**/*",
        ],
    },
    "installable": True,
    "application": False,
    "auto_install": False,
}
