// Add product record
query product verb=POST {
  api_group = "content"
  auth = "user"

  input {
    dblink {
      table = "product"
    }
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

    db.add product {
      enforce_hidden_fields = false
      data = {created_at: "now"}
    } as $product
  }

  response = $product
  guid = "7kI1vbBDqOh2mUH6vxQAdGEgNxk"
}