table order {
  auth = false

  schema {
    int id
    timestamp created_at?=now {
      visibility = "private"
    }
  
    int client_id? {
      table = "user"
    }
  
    enum type? {
      values = ["product", "appointment_deposit"]
    }
  
    json items?
    decimal total?
    enum payment_status? {
      values = ["pending", "paid", "failed", "refunded"]
    }
  }

  index = [
    {type: "primary", field: [{name: "id"}]}
    {type: "btree", field: [{name: "created_at", op: "desc"}]}
  ]

  guid = "kHBMWM0v6iYPOBCj1DnFFZihKNY"
}