addon _product {
  input {
    int product_id? {
      table = "product"
    }
  }

  stack {
    db.query product {
      where = $db.product.id == $input.product_id
      sort = {
        product.name     : "asc"
        product.price    : "asc"
        product.image_url: "asc"
      }
    
      return = {type: "single"}
    }
  }

  guid = "u2varKAN9S4LtK9CaOVQJtA9gOs"
}