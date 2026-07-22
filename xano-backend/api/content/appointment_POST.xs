// Create a new appointment with price validation and deposit calculation
// Return the created appointment
query appointment verb=POST {
  api_group = "content"
  auth = "user"

  input {
    // Required treatment ID
    int treatment_id
  
    // Optional treatment option ID
    int option_id?
  
    // Appointment date
    date date
  
    // Appointment time
    text time
  }

  stack {
    // 1. Fetch the treatment record
    db.get treatment {
      field_name = "id"
      field_value = $input.treatment_id
    } as $treatment
  
    // 2. Validate treatment exists
    precondition ($treatment != null) {
      error_type = "notfound"
      error = "treatment not found"
    }
  
    // 3. Set the base price
    var $price {
      value = $treatment.base_price
    }
  
    // 4. Handle optional treatment option
    conditional {
      if ($input.option_id != null) {
        // Fetch the option record
        db.get treatment_option {
          field_name = "id"
          field_value = $input.option_id
        } as $option
      
        // Validate option exists
        precondition ($option != null) {
          error_type = "notfound"
          error = "treatment option not found"
        }
      
        // Update price with option price
        var.update $price {
          value = $option.price
        }
      }
    }
  
    // 5. Calculate deposit (50% of price)
    var $deposit {
      value = $price / 2
    }
  
    // 6. Create the appointment record
    db.add appointment {
      data = {
        client_id     : $auth.id
        treatment_id  : $input.treatment_id
        option_id     : $input.option_id
        date          : $input.date
        time          : $input.time
        status        : "pending"
        total_price   : $price
        deposit_amount: $deposit
        deposit_status: "pending"
        created_at    : now
      }
    } as $appointment
  }

  response = $appointment
  guid = "ssUKy8CxVT_uQ129Nwkv-YYvq4I"
}