/**
 * Shape of a product photo.
 *
 * Photos travel with their product in lib/data/catalogData.json, which is generated from the
 * Google Sheet (see docs/catalog-sheet.md). No product carries one today: the sheet's
 * "Reference Image URL" column holds research links to Pexels/Wikimedia article pages rather
 * than licensed image files, and the sheet's own notes say not to publish them without checking
 * each licence first. Products render their category icon until a photo is cleared.
 *
 * To give a product a real photo: commit the file to public/products/, add an "Image File"
 * column to the sheet with the filename, and fill in Image Alt / Image Credit / Image Source.
 * The sync script picks all four up automatically.
 */
export type ProductImage = {
  src: string;
  alt: string;
  credit: string;
  source: string;
};
