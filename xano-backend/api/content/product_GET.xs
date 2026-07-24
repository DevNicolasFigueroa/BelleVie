// Query all product records
query product verb=GET {
  api_group = "content"

  input {
  }

  stack {
    db.query product {
      return = {type: "list"}
    } as $product
  }

  response = $product
  guid = "bkUSgUCA8msRTRg9oBpuP0A8MV4"
}