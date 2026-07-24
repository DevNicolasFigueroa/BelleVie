// Edit product record
query "product/{product_id}" verb=PATCH {
  api_group = "content"
  auth = "user"

  input {
    int product_id? filters=min:1
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

    util.get_raw_input {
      encoding = "json"
      exclude_middleware = false
    } as $raw_input
  
    db.patch product {
      field_name = "id"
      field_value = $input.product_id
      data = `$input|pick:($raw_input|keys)`|filter_null|filter_empty_text
    } as $product
  }

  response = $product
  guid = "ffz7K9N60J4JRBQY_dh4IHPT8Tw"
}