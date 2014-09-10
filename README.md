CatalogBrowser
==============

Simple js api for getting catalog data on the americommerce platform.


## Usage

```

var browser = new StoreCatalog('Your token here');

browser.Categories(function(data){
  console.log(data);
});

```

Additionally, an object can be passed that allows for filtering.

```

browser.Products({id : [2,6,18], fields : ['id', 'price', 'item_name']}, function(data){
  console.log(data);
  // Will get only the id, price, and item name field on the products with id 2, 6, and 18
});

```

## Response
For listing calls (where no id is supplied), the response from a call will have a `count property` and an entity property. The entity is an array of all the returned results. This property is named after the entity call that was made (i.e. a call to .Products will have a products property whereas a call to .Categories will have a categories property). If an id is provided and a result is found, that entity will be the response.