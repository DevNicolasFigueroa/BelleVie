table cart {
  auth = false

  schema {
    int id
    timestamp created_at?=now {
      visibility = "private"
    }
  
    int client_id? {
      table = "user"
    }
  
    enum item_type? {
      values = ["product", "appointment_deposit"]
    }
  
    int? product_id? {
      table = "product"
    }
  
    int? appointment_id? {
      table = "appointment"
    }
  
    int quantity?
    decimal unit_price?
  }

  index = [
    {type: "primary", field: [{name: "id"}]}
    {type: "btree", field: [{name: "created_at", op: "desc"}]}
  ]

  guid = "wRtOS7DcEuCuOKPvzCw6ANhGfYo"
}