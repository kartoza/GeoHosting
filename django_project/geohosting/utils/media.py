from geohosting.models.product import ProductMedia
from geohosting.utils.erpnext import download_erp_file


def save_product_image(
        obj, product_desc: dict, title_key, description_key, image_path: str
):
    """Save product image from description of dict."""
    try:
        title = product_desc[title_key]
        description = product_desc[description_key]
        image_file = download_erp_file(image_path)
        if not image_file:
            raise AttributeError()
        print(f'Save {image_file}')
        media, _ = ProductMedia.objects.update_or_create(
            product=obj,
            title=title,
            defaults={
                'image': image_file,
                'description': description
            }
        )
    except (KeyError, AttributeError) as e:
        pass
