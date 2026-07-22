// Edit inventory_movement record
query "inventory_movement/{inventory_movement_id}" verb=PATCH {
  api_group = "content"
  auth = "user"

  input {
    int inventory_movement_id? filters=min:1
    dblink {
      table = "inventory_movement"
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
  
    db.patch inventory_movement {
      field_name = "id"
      field_value = $input.inventory_movement_id
      data = `$input|pick:($raw_input|keys)`|filter_null|filter_empty_text
    } as $inventory_movement
  }

  response = $inventory_movement
  guid = "Yq0jSi91yu4F6LqHqR84utIW8Y8"
}