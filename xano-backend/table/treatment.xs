table treatment {
  auth = false

  schema {
    int id
    timestamp created_at?=now {
      visibility = "private"
    }
  
    text name? filters=trim
    text description? filters=trim
    decimal base_price?
    int duration_min?
  }

  index = [
    {type: "primary", field: [{name: "id"}]}
    {type: "btree", field: [{name: "created_at", op: "desc"}]}
  ]

  guid = "K8I7i6yhdE1UBc6TpDrJymGNMfs"
}