// Add cart record
query cart verb=POST {
  api_group = "content"
  auth = "user"

  input {
    dblink {
      table = "cart"
      override = {
        client_id     : {hidden: false}
        product_id    : {hidden: false}
        unit_price    : {hidden: false}
        appointment_id: {hidden: false}
      }
    }
  }

  stack {
    db.add cart {
      enforce_hidden_fields = false
      data = {
        created_at    : "now"
        client_id     : $auth.id
        item_type     : $input.item_type
        product_id    : $input.product_id
        appointment_id: $input.appointment_id
        quantity      : $input.quantity
        unit_price    : $input.unit_price
      }
    } as $cart
  }

  response = $cart
  guid = "v0rSQUD7nIXaqzsB9A2zHRzhndQ"
}