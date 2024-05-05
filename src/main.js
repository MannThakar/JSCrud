var stateObject = {
    "India": {
        "Delhi": ["New Delhi", "North Delhi"],
        "Gujrat": ["Ahemdabad", "Rajkot", "Vadodra"],
        "Goa": ["North Goa", "South Goa"],
    },
    "Australia": {
        "South Australia": ["Dunstan", "Mitchell"],
        "Victoria": ["Altona", "Euroa"],
    },
    "Canada": {
        "Alberta": ["Acadia", "Bighorn"],
        "Columbia": ["Washington", "orinato"],
    },
};

window.onload = function () {
    var countrySelect = document.getElementById("country"),
        stateSelect = document.getElementById("State"),
        citySelect = document.getElementById("City");


    for (var country in stateObject) {
        countrySelect.options[countrySelect.options.length] = new Option(country, country);
    }

    countrySelect.onchange = function () {
        stateSelect.length = 1;
        citySelect.length = 1;

        if (this.selectedIndex < 1) return;

        for (var state in stateObject[this.value]) {
            stateSelect.options[stateSelect.options.length] = new Option(state, state);
        }
        stateSelect.onchange();
    };

    stateSelect.onchange = function () {
        citySelect.length = 1;


        if (this.selectedIndex < 1) return;


        var cities = stateObject[countrySelect.value][this.value];
        for (var i = 0; i < cities.length; i++) {
            citySelect.options[citySelect.options.length] = new Option(cities[i], cities[i]);
        }
    };
};

var employees = [];
function curd() {
    var formData = {
        _id: document.getElementById("_id").value,
        fullName: document.getElementById("fullName").value,
        email: document.getElementById("email").value,
        phoneNumber: document.getElementById("phoneNumber").value,
        gender: document.querySelector('input[name="gender"]:checked') ? document.querySelector('input[name="gender"]:checked').value : "",
        Country: document.getElementById("country").value,
        State: document.getElementById("State").value,
        City: document.getElementById("City").value,
        Pincode: document.getElementById("PinCode").value,
    };

    switch (true) {
        case formData.fullName === '':
        case formData.email === '':
        case formData.Number === '':
        case formData.gender === '':
        case formData.country === '':
        case formData.State === '':
        case formData.City === '':
        case formData.Pincode === '':
            alert("Please Enter all fields");
            return;
        default:
            break;
    }
    console.log('formdata', formData)

    var existingIndex = employees.findIndex(emp => emp._id === formData._id);

    if (existingIndex !== -1) {

        employees[existingIndex] = formData;
    } else {
        formData._id = Date.now().toString(12)

        employees.push(formData);
    }
    display();
    savedata()

}
function deleteEmployee(index) {
    employees.splice(index, 1);
    display();
    savedata();
}

function editEmployee(index) {
    var employee = employees[index];
    document.getElementById("_id").value = employee._id
    document.getElementById("fullName").value = employee.fullName;
    document.getElementById("email").value = employee.email;
    document.getElementById("phoneNumber").value = employee.phoneNumber;
    if (employee.gender === "male") {
        document.getElementById("male").checked = true;
    } else if (employee.gender === "female") {
        document.getElementById("female").checked = true;
    }
    document.getElementById('country').value = employee.Country;
    document.getElementById('State').value = employee.State;
    document.getElementById('City').value = employee.City;
    document.getElementById('PinCode').value = employee.Pincode;
}

function display() {
    var tableBody = document.getElementById("employeeList");
    tableBody.innerHTML = "";
    employees.filter((e, i) => i < currentPage * limit && i >= (currentPage - 1) * limit).forEach((employee, index) => {
        var row = tableBody.insertRow();
        row.insertCell(0).innerHTML = employee.fullName;
        row.insertCell(1).innerHTML = employee.email;
        row.insertCell(2).innerHTML = employee.phoneNumber;
        row.insertCell(3).innerHTML = employee.gender;
        row.insertCell(4).innerHTML = employee.Country;
        row.insertCell(5).innerHTML = employee.State;
        row.insertCell(6).innerHTML = employee.City;
        row.insertCell(7).innerHTML = employee.Pincode;


        var actionsCell = row.insertCell(8);
        actionsCell.innerHTML = `<button class="bg-blue-500 p-2 text-white rounded-md" onclick="editEmployee(${index})">Edit</button>
                                 <button class="bg-red-500 p-2 text-white rounded-md" onclick="deleteEmployee(${index})">delete</button> `
    });
}



let currentPage = 1;
let limit = 10;

const pageIndex = document.getElementById("pages");
const prev = document.getElementById("prev");
const next = document.getElementById("next");

prev.addEventListener("click", function () {
    console.log("111111", prev);
    if (currentPage > 1) {
        currentPage--;
        updatePagination();
        savedata()
    }
});

next.addEventListener("click", function () {
    console.log(currentPage)
    let pages = Math.ceil(employees.length / limit);
    console.log(pages);
    if (currentPage < pages) {
        currentPage++;
        updatePagination();
        savedata()
    }
});

function search(temp) {
    const data = JSON.parse(localStorage.getItem("employees"));
    console.log(data);

    const res = data.filter((e) => {
        return e.fullName.toLowerCase().includes(temp.toLowerCase());
    });
    display(res);
    // this code is not slow in log slow in disply
}


function updatePagination() {
    let pages = Math.ceil(employees.length / limit);

    pageIndex.textContent = currentPage + "-" + pages;

    if (currentPage <= 1) {
        prev.classList.add("opacity-50");
        prev.setAttribute("disabled", "");
    } else {
        document.body.style.backgroundColor = "white";
        prev.classList.remove("opacity-50");
        prev.removeAttribute("disabled");
    }

    if (currentPage >= pages) {
        next.classList.add("opacity-50");
        next.setAttribute("disabled", "");
    } else {
        next.classList.remove("opacity-50");
        next.removeAttribute("disabled");
    }
    display();
    savedata()
}
function savedata() {
    localStorage.setItem("employees", JSON.stringify(employees));
}

function showTask() {
    var storedEmployees = localStorage.getItem("employees");
    if (storedEmployees) {
        employees = JSON.parse(storedEmployees);
        display();
    }
}
showTask();
