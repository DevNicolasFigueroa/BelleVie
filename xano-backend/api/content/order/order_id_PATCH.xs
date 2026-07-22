// Edit order record
query "order/{order_id}" verb=PATCH {
  api_group = "content"
  auth = "user"

  input {
    int order_id? filters=min:1
    dblink {
      table = "order"
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
  
    db.patch order {
      field_name = "id"
      field_value = $input.order_id
      data = `$input|pick:($raw_input|keys)`|filter_null|filter_empty_text
    } as $order
  }

  response = $order
  guid = "xaN2Mh8yIy18Era2y6WoVh6435M"
}