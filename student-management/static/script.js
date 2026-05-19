const API = "http://127.0.0.1:5000/api/student";

const table = document.getElementById("table");
const total = document.getElementById("total");

const form = document.getElementById("form");
const search = document.getElementById("search");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const courseInput = document.getElementById("course");

let editId = null;

// Load Students
async function loadStudents(url = API){

    const res = await fetch(url);

    const data = await res.json();

    table.innerHTML = "";

    data.forEach(student => {

        table.innerHTML += `
        <tr>

            <td>${student.full_name}</td>
            <td>${student.email}</td>
            <td>${student.phone}</td>
            <td>${student.course}</td>
            <td>${new Date(student.enrolled_on).toLocaleDateString('en-IN')}</td>

            <td>

                <button class="edit-btn"
                onclick="editStudent(${student.id})">
                Edit
                </button>

                <button class="delete-btn"
                onclick="deleteStudent(${student.id})">
                Delete
                </button>

            </td>

        </tr>
        `;
    });

    total.innerText = data.length;
}

// Add / Update Student
form.addEventListener("submit", async function(e){

    e.preventDefault();

    const student = {

        full_name: nameInput.value,
        email: emailInput.value,
        phone: phoneInput.value,
        course: courseInput.value
    };

    if(editId){

        await fetch(API + "/" + editId, {

            method:"PUT",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify(student)
        });

        editId = null;

    }else{

        await fetch(API, {

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify(student)
        });
    }

    form.reset();

    loadStudents();
});

// Edit Student
async function editStudent(id){

    const res = await fetch(API);

    const data = await res.json();

    const student = data.find(s => s.id == id);

    nameInput.value = student.full_name;
    emailInput.value = student.email;
    phoneInput.value = student.phone;
    courseInput.value = student.course;

    editId = id;
}

// Delete Student
async function deleteStudent(id){

    const ok = confirm("Delete Student?");

    if(ok){

        await fetch(API + "/" + id, {

            method:"DELETE"
        });

        loadStudents();
    }
}

// Search Student
search.addEventListener("keyup", function(){

    const q = search.value;

    if(q === ""){

        loadStudents();

    }else{

        loadStudents(API + "/search?q=" + q);
    }
});

// Initial Load
loadStudents();