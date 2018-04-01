/**
 * See: https://stackoverflow.com/questions/42118296/dynamically-import-images-from-a-directory-using-webpack
 *
 * @param {Object} context
 *        The context to grab images from
 *        See: https://webpack.js.org/guides/dependency-management/#require-context
 *
 * @returns {Object} images
 *          The images from that context
 */
export default function importImageFolder (context) {
  let images = {}
  context.keys().map((image, index) => {
    images[image.replace('./', '')] = context(image)
  })
  return images
}
