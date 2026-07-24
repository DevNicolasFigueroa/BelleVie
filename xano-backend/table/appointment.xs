table appointment {
  auth = false

  schema {
    int id
    timestamp created_at?=now {
      visibility = "private"
    }
  
    int client_id? {
      table = "user"
    }
  
    int treatment_id? {
      table = "treatment"
    }
  
    int? option_id? {
      table = "treatment_option"
    }
  
    date? date?
    enum time? {
      values = [
        "9:00"
        "10:00"
        "11:00"
        "12:00"
        "13:00"
        "14:00"
        "15:00"
        "16:00"
        "17:00"
      ]
    }
  
    enum status?=pending {
      values = ["pending", "confirmed", "cancelled", "completed"]
    }
  
    decimal total_price?
    decimal deposit_amount?
    enum deposit_status? {
      values = ["pending", "paid"]
    }
  }

  index = [
    {type: "primary", field: [{name: "id"}]}
    {type: "btree", field: [{name: "created_at", op: "desc"}]}
  ]

  guid = "UVDOQ1s4TkTcvB1qiZ4DdOYS8hk"
}