import _ from 'lodash';

class ImageSelectHandler {

    static selectFromProducts(cb, multiple = false) {
        ShopifyApp.Modal.productPicker({
            selectMultiple: multiple
        }, (success, data) => {
            
            if (!success) {
                cb(false);
            }
            let images = [];

            if (_.isArray(data.products)) {
                for (let i = 0; i < data.products.length; i++) {
                    let prodImages = data.products[i].images;
                    if (_.isArray(prodImages)) {
                        for (let k = 0; k < prodImages.length; k++) {
                            images.push(prodImages[k].src);
                        }
                    }
                }
            }

            if (images.length === 0) {
                return cb(false);
            }
            cb(true, images);
        });
    }

    static selectFromCollections(cb, multiple = false) {
        ShopifyApp.Modal.collectionPicker({
            selectMultiple: multiple
        }, (success, data) => {
            
            if (!success) {
                cb(false);
            }
            let images = [];

            if (_.isArray(data.collections)) {
                for (let i = 0; i < data.collections.length; i++) {
                    let colImage = data.collections[i].image;
                    if (!_.isNil(colImage)) {
                        images.push(colImage.src);
                    }
                }
            }

            if (images.length === 0) {
                return cb(false);
            }
            cb(true, images);

        });
    }    
}

export default ImageSelectHandler;
