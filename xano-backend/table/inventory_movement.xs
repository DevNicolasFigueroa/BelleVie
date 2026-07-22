table inventory_movement {
  auth = false

  schema {
    int id
    timestamp created_at?=now {
      visibility = "private"
    }
  
    int product_id? {
      table = "product"
    }
  
    enum type? {
      values = ["in", "out"]
    }
  
    int quantity?
    timestamp? date?
    text reason? filters=trim
  }

  index = [
    {type: "primary", field: [{name: "id"}]}
    {type: "btree", field: [{name: "created_at", op: "desc"}]}
  ]

  guid = "M8XCRabYfd1J24Ld3pljyA1qHN8"
}