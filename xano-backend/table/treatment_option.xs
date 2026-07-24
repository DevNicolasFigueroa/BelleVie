table treatment_option {
  auth = false

  schema {
    int id
  
    // References the parent treatment for this option.
    int treatment_id? {
      table = "treatment"
    }
  
    timestamp created_at?=now {
      visibility = "private"
    }
  
    text zone_name? filters=trim
    decimal price?
    int duration_min?
  }

  index = [
    {type: "primary", field: [{name: "id"}]}
    {type: "btree", field: [{name: "created_at", op: "desc"}]}
  ]

  guid = "JhzRciA9OMYtBtOFCLVNtVV20Hk"
}