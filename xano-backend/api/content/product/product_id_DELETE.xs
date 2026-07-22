// Delete product record.
query "product/{product_id}" verb=DELETE {
  api_group = "content"
  auth = "user"

  input {
    int product_id? filters=min:1
  }

  stack {
    db.get user {
      field_name = "id"
      field_value = $auth.id
    } as $me

    precondition ($me != null && $me.role == "admin") {
      error_type = "accessdenied"
      error = "forbidden"
    }

    db.del product {
      field_name = "id"
      field_value = $input.product_id
    }
  }

  response = null
  guid = "5sfn16YMKdL0uuhWsZifNysIj_U"
}