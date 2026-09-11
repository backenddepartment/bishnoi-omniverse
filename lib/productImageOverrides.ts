import type { ProductImage } from '@/lib/catalogImages';
import nitrileFront from '@/app/productimages/nitrilefront.png';
import nitrileBack from '@/app/productimages/nitrileback.png';
import nitrileSide from '@/app/productimages/nitrileside.png';

/**
 * Product photo galleries committed to app/productimages/, keyed by product id. The first photo
 * is the product's main image; the rest fill the gallery rail in order. These sit on top of the
 * synced catalog data (see lib/catalogImages.ts), so the next sheet sync does not wipe them.
 */
export const PRODUCT_GALLERIES: Record<string, ProductImage[]> = {
  'nitrile-examination-gloves': [
    {
      src: nitrileFront.src,
      alt: 'Box of 100 medium powder-free nitrile examination gloves beside a pair of blue nitrile gloves',
      credit: '',
      source: '',
    },
    {
      src: nitrileBack.src,
      alt: 'Back of the nitrile examination gloves box, listing product features, intended use, donning instructions and cautions',
      credit: '',
      source: '',
    },
    {
      src: nitrileSide.src,
      alt: 'Side panel of the nitrile examination gloves box, marked powder-free, non-sterile, single use, size M',
      credit: '',
      source: '',
    },
  ],
};
