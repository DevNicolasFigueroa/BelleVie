table client_file {
  auth = false

  schema {
    int id
    timestamp created_at?=now {
      visibility = "private"
    }
  
    int user_id? {
      table = "user"
    }
  
    text allergies? filters=trim
    text history? filters=trim
    text clinical_notes? filters=trim
  }

  index = [
    {type: "primary", field: [{name: "id"}]}
    {type: "btree", field: [{name: "created_at", op: "desc"}]}
  ]

  guid = "aXcXRHCbn5EQA_eiTl2WCZZJX18"
}