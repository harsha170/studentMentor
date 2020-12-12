var url = "https://student-mentor-assign.herokuapp.com";

function getMentors() {
  fetch(url+'/mentors')
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      document.getElementById("tbody").innerHTML = "";
      data.forEach((x) => {
        if (!x.students) {
          CreateRow(x.name, x.sub, "No Students Assigned", "tbody");
        } else {
          CreateRow(x.name, x.sub, x.students, "tbody");
        }
      });
    });
}
function CreateRow(name, sub, students, id) {
  var tr = document.createElement("tr");
  var td1 = document.createElement("td");
  var td2 = document.createElement("td");
  var td3 = document.createElement("td");
  td1.innerHTML = name;
  td2.innerHTML = sub;
  td3.innerHTML = students;
  tr.append(td1, td2, td3);
  document.getElementById(id).append(tr);
  // getMentors();
}
getMentors();

function postMentor() {
  // var url = "http://localhost:3000/mentor";
  var createMentor = document.getElementById("createMentor");
  var name = document.getElementById("name").value;
  var sub = document.getElementById("subject").value;
  fetch(url + "/mentor", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ name, sub }),
  }).then((res) => {
    getMentors();
  });
}
createMentor.setAttribute("onclick", "postMentor()");

function mentorSelect() {
  fetch(url + "/mentors")
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      document.getElementById("mentorSelect").innerHTML = "";
      data.forEach((x) => {
        var option = document.createElement("option");
        option.innerHTML = x.name;
        document.getElementById("mentorSelect").append(option);
      });
    });

  fetch(url + "/students")
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      document.getElementById("studentSelect").innerHTML = "";
      data.forEach((x) => {
        if (!x.mentor) {
          var option = document.createElement("option");
          option.innerHTML = x.name;
          document.getElementById("studentSelect").append(option);
        }
      });
    });
}

function assignStudent() {
  var mentor = document.getElementById("mentorSelect").value;
  var student = document.getElementById("studentSelect").value;
  fetch(url + "/assign-student", {
    method: "PUT",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ mentor, student }),
  }).then((res) => {
    getMentors();
  });

  fetch(url + "/student", {
    method: "PUT",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ mentor, student }),
  }).then((res) => {
    getStudents();
  });
}

function getStudents() {
  fetch(url + "/students")
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      document.getElementById("tbody2").innerHTML = "";
      data.forEach((x) => {
        if (!x.mentor) {
          CreateRow(x.name, x.course, "No Mentor Assigned", "tbody2");
        } else {
          CreateRow(x.name, x.course, x.mentor, "tbody2");
        }
      });
    });
}
getStudents();
function postStudent() {
  var name = document.getElementById("studentName").value;
  var course = document.getElementById("courseSelect").value;
  fetch(url + "/student", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ name, course }),
  }).then((res) => {
    getStudents();
  });
}

function studentSelect() {
  fetch(url + "/mentors")
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      document.getElementById("mentorSelect2").innerHTML = "";
      data.forEach((x) => {
        var option = document.createElement("option");
        option.innerHTML = x.name;
        document.getElementById("mentorSelect2").append(option);
      });
    });

  fetch(url + "/students")
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      document.getElementById("studentSelect2").innerHTML =
        "<option>Select</option";
      data.forEach((x) => {
        var option = document.createElement("option");
        option.innerHTML = x.name;
        document.getElementById("studentSelect2").append(option);
      });
    });
}
function assignMentor() {
  var mentor = document.getElementById("mentorSelect2").value;
  var student = document.getElementById("studentSelect2").value;
  fetch(url + "/student", {
    method: "PUT",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ mentor, student }),
  }).then((res) => {
    getStudents();
    let student = document.getElementById("studentSelect2").value;
    fetch(url + "/mentor/" + prevMent, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ student }),
    }).then((res) => {
      getStudents();
    });
    var mentor = document.getElementById("mentorSelect2").value;
    fetch(url+"/assign-student", {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ mentor, student }),
    }).then((res) => {
      getMentors();
    });
  });
}

var prevMent;

document
  .getElementById("studentSelect2")
  .setAttribute("onchange", "prevMentor()");
function prevMentor() {
  var name = document.getElementById("studentSelect2").value;
  fetch(url+"/student/" + name)
    .then((res) => {
      return res.json();
    })
    .then((result) => {
      console.log(result);
      document.getElementById("mentorSelect2").value = result.mentor;
      prevMent = result.mentor;
    });
}