table conversation {
  auth = false

  schema {
    int id
    timestamp created_at?=now {
      visibility = "private"
    }
  
    int user_id? {
      table = "user"
    }
  
    enum bot_role? {
      values = ["client", "admin"]
    }
  
    json messages?
  }

  index = [
    {type: "primary", field: [{name: "id"}]}
    {type: "btree", field: [{name: "created_at", op: "desc"}]}
  ]

  guid = "jfBO6biwp7NWHG1Bo19mYR8XpA4"
}