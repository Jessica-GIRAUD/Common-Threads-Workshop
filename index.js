const connection = require('./src/config');
const express = require('express');
const app = express();
const port = 3000;

connection.connect(function(err) {
  if (err) {
    console.err('error connecting' + err.stack);
    return;
  }
  console.log('connected as id ' + connection.threadId);
});

app.use(express.json());

app.get('/', (req, res) => {
  res.send("Welcome on board")
})


// GET METHOD : retrieve all of the data from the table :

app.get('/students', (req, res) => {
  connection.query("SELECT * FROM student", (err, results) => {
    if(err){
      res.status(500).send("Error retriving data")
    } else {
      res.status(200).json(results)
    }
  })
});

// GET METHOD : Retrieve specific field => id :

app.get('/student/:id', (req, res) => {
  connection.query("SELECT * FROM student WHERE id= ?", [req.params.id], (err, results) => {
    if(err){
      res.status(500).send("Error retriving data")
    } else {
      res.status(200).json(results)
    }
  })
});

// GET METHOD : Retrieve a data set with a filter "contain" :

app.get('/students/search', (req, res) => {
  connection.query("SELECT * FROM student WHERE age <= ?", [req.query.age], (err, results) => {
    if (err) {
      res.status(500).send("Error retrieving data");
    } else {
      const matchingStudent = results.filter((student) => student.age <= req.query.age)
      if (matchingStudent.length > 0) {
        res.status(200).json(matchingStudent);
      } else {
        res.status(404).send('No student found with this age');
      }
    }
  })
});

// GET METHOD : Retrieve a data set with a filter "start with" :

app.get('/students/firstname/j', (req, res) => {
  connection.query("SELECT * FROM student WHERE firstname LIKE 'J%' ", 
  [req.params.firstname], 
  (err, results) => {
    if (err) {
      res.status(500).send("Error retrieving data");
    } else {
        res.status(200).json(results);
      }
    }
  )
});

// GET METHOD : Retrieve a data set with a filter "greater than" :

app.get('/dateofbirth', (req, res) => {
  connection.query("SELECT * from student WHERE date_of_birth <= '2010-01-01'", [req.params.birth], (err, results) => {
    if (err) {
      res.status(500).send("Error retrieving data");
    } else {
        res.status(200).json(results);
    }
  })
});

// GET METHOD : retrieve all of the data order by asc :

app.get('/students/ascending', (req, res) => {
  connection.query("SELECT * FROM student ORDER BY firstname ASC", (err, results) => {
    if(err){
      res.status(500).send("Error retriving data")
    } else {
      res.status(200).json(results)
    }
  })
});

// POST - Insertion of a new entity

app.post("/newstudent", (req, res) => {
  const { firstname, lastname, age, date_of_birth, bilingual } = req.body;
  connection.query(
    "INSERT INTO student(firstname, lastname, age, date_of_birth, bilingual) VALUES(?, ?, ?, ?, ?)",
    [firstname, lastname, age, date_of_birth, bilingual],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error saving the student");
      } else {
        res.status(200).send("Successfully saved");
      }
    }
  );
});

// PUT - Modification of an entity

app.put("/student/:id", (req, res) => {
  const studentId = req.params.id;
  const newDataStudent = req.body;
  connection.query(
    "UPDATE student SET ? WHERE id = ?",
    [newDataStudent, studentId],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error updating the student");
      } else {
        res.status(200).send("Student updated successfully 🎉");
      }
    }
  );
});

// PUT - Toggle a Boolean value

app.put("/student/:id/bilingual", (req, res) => {
  const studentId = req.params.id;
  connection.query(
    "UPDATE student SET bilingual = !bilingual WHERE id = ?",
    [studentId],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error updating the student");
      } else {
        res.status(200).send("Student Bilingual updated successfully 🎉");
      }
    }
  );
});

// DELETE - Delete an entity

app.delete("student/:id", (req, res) => {
  const studentId = req.params.id;
  connection.query(
    "DELETE FROM student WHERE id = ?",
    [studentId],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("😱 Error deleting the student");
      } else {
        res.status(200).send("🎉 Student deleted!");
      }
    }
  );
});

// DELETE - Delete all entities where boolean value is false

app.delete("/students/not_bilingual", (req, res) => {
  connection.query(
    "DELETE FROM student WHERE bilingual = 0", (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("😱 Error deleting the non bilingual student");
      } else {
        res.status(200).send("🎉 Non bilingual student deleted!");
      }
    }
  );
});

app.listen(port, () => {
  console.log('server is running');
});