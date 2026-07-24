// Add inventory_movement record
query inventory_movement verb=POST {
  api_group = "content"
  auth = "user"

  input {
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

    db.add inventory_movement {
      enforce_hidden_fields = false
      data = {created_at: "now"}
    } as $inventory_movement
  }

  response = $inventory_movement
  guid = "T_Ma0wXR4YsrlroOAizAYMKyvGc"
}