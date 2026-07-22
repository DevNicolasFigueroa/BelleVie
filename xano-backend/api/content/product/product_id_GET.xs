// Get product record
query "product/{product_id}" verb=GET {
  api_group = "content"

  input {
    int product_id? filters=min:1
  }

  stack {
    db.get product {
      field_name = "id"
      field_value = $input.product_id
    } as $product
  
    precondition ($product != null) {
      error_type = "notfound"
      error = "Not Found."
    }
  }

  response = $product
  guid = "z2R57FzRjwFQkBqbB7qt2keSogU"
}