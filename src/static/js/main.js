document.addEventListener("DOMContentLoaded", function (event) {


    const boxTable = document.querySelector(".js-box-table");
    const boxForm = document.querySelector(".js-box-form");

    let hideFormToModify = false;

    function getInputValues(parentElement) {
        const titleField = parentElement.querySelector("#title");
        const locationField = parentElement.querySelector("#location");
        const descriptionField = parentElement.querySelector("#description");
        const userField = parentElement.querySelector("#user");

        const title = titleField.value;
        const location = locationField.value;
        const description = descriptionField.value;
        const user = userField.value;

        return { title, location, description, user };
    }


    function createForm(id, action, method, buttonInnerText) {
        const form = document.createElement("form");
        form.id = id;
        form.action = action;
        form.method = method;

        const fieldSet = document.createElement("fieldset");
        const legend = document.createElement("legend");
        legend.innerText = "Geolocation";


        const inputs = [{
            name: "Title",
            id: "title"
        }, {
            name: "Location",
            id: "location"
        }, {
            name: "Geocache-description",
            id: "description"
        }, {
            name: "Author",
            id: "user"
        }];
        const labelsWithInputs = [];
        inputs.forEach((input) => {
            const label = document.createElement("label");
            const textarea = document.createElement("textarea");
            label.innerText = input.name;

            textarea.id = input.id;
            textarea.name = input.id;
            textarea.required = true;

            label.appendChild(textarea);
            labelsWithInputs.push(label);
        })
        labelsWithInputs.forEach(label => {
            fieldSet.appendChild(label);
        })
        const button = document.createElement("button");
        button.type = "submit";
        button.innerText = buttonInnerText;
        fieldSet.appendChild(button);

        fieldSet.appendChild(legend);
        form.appendChild(fieldSet);

        return form;
    }

    function fetchDataFromDb() {
        return fetch('/geocaching')
            .then(data => data.json())
    }

    function modifyGeoLocation() {

        const boxFormToModify = document.querySelector(".box-form-to-modify");
        const { title, location, description, user } = getInputValues(boxFormToModify);

        const tableHeader = document.querySelector(".active");
        const uuid = tableHeader.getAttribute("data-uuid");

        return fetch(`/geocaching/${uuid}`, {
            method: "PUT",
            body: JSON.stringify({
                title,
                location,
                description,
                user
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        })
    }

    function deleteGeolocation(event) {

        const tableHeader = event.target.parentNode;
        const uuid = tableHeader.getAttribute("data-uuid");

        return fetch(`/geocaching/${uuid}`, {
            method: "DELETE"
        })

    }

    function showOrHideFormToModify(event) {
        event.preventDefault();
        const buttonShowFormToModify = event.target;
        const tableHeader = buttonShowFormToModify.parentNode;

        if (hideFormToModify === false) {
            buttonShowFormToModify.innerText = "X";
            const divWithForm = createFormToModify();
            tableHeader.appendChild(divWithForm);
            tableHeader.setAttribute("class", "active");

            hideFormToModify = true;
        } else {
            buttonShowFormToModify.innerText = "Modify";
            const divWithForm = document.querySelector(".box-form-to-modify");
            tableHeader.removeChild(divWithForm);
            tableHeader.setAttribute("class", "title");

            hideFormToModify = false;
        }
    }



    async function deleteGeolocationAndUpdateTable(event) {
        event.preventDefault();
        if (confirm("Are you sure you want to delete this geocache permanently?")) {
            await deleteGeolocation(event);

            const table = await createTableWithData();
            boxTable.appendChild(table);

            initMap();
        }
    }

    function createButton(modifyBtnText, modifyBtnClass, modifyBtnFn) {
        const buttonShowFormToModify = document.createElement("button");

        buttonShowFormToModify.innerText = modifyBtnText;
        buttonShowFormToModify.setAttribute("class", modifyBtnClass);
        buttonShowFormToModify.addEventListener("click", modifyBtnFn);

        return buttonShowFormToModify;
    }


    function createRowWithTitle(geocache) {
        const tableRow = document.createElement("tr");
        const tableHeader = document.createElement("th");
        tableHeader.setAttribute("data-uuid", geocache.uuid);
        tableHeader.innerText = geocache.title;
        tableHeader.colSpan = 2;
        tableHeader.setAttribute("class", "title");

        const modifyBtnText = "Modify",
            modifyBtnClass = "button--show-form-to-modify",
            modifyBtnFn = showOrHideFormToModify;
        const buttonShowFormToModify = createButton(modifyBtnText, modifyBtnClass, modifyBtnFn);

        const deleteGeoBtnText = "Delete",
            deleteGeoBtnClass = "button--del-geolocation",
            deleteGeoBtnFn = deleteGeolocationAndUpdateTable;
        const buttondeleteGeolocation = createButton(deleteGeoBtnText, deleteGeoBtnClass, deleteGeoBtnFn);

        tableHeader.appendChild(buttondeleteGeolocation);
        tableHeader.appendChild(buttonShowFormToModify);

        return tableHeader;
    }

    function createRowsWithData(geocache, rows) {
        const rowsWithData = [];
        rows.forEach(row => {

            const tableRow = document.createElement("tr");
            const tableHeader = document.createElement("th");
            const tableData = document.createElement("td");

            tableHeader.innerText = row.header;
            tableData.innerText = geocache[row.attribute];

            tableRow.appendChild(tableHeader);
            tableRow.appendChild(tableData);

            rowsWithData.push(tableRow);
        })
        return rowsWithData;
    }

    function createTableContentFromData(geocache) {
        const rows = [
            {
                header: "Location",
                attribute: "location"
            },
            {
                header: "Geocache-description",
                attribute: "description"
            },
            {
                header: "Author",
                attribute: "user"
            }
        ];
        const tableBody = document.createElement("tbody");

        const tableRowWithTitle = createRowWithTitle(geocache);
        const tableRowsWithData = createRowsWithData(geocache, rows);

        tableBody.appendChild(tableRowWithTitle);
        tableRowsWithData.forEach(row => {
            tableBody.appendChild(row);
        })
        return tableBody;

    }

    async function createTableWithData() {
        boxTable.innerText = "";

        const table = document.createElement("table");
        table.setAttribute("class", "table-data");

        const jsonData = await fetchDataFromDb();
        const geocachelocations = jsonData.data.reverse();
        geocachelocations.forEach(geocache => {
            const tableBody = createTableContentFromData(geocache);
            table.appendChild(tableBody);
        })
        return table;
    }

    async function modifyGeolocationAndCreateTableWithData(event) {
        event.preventDefault();

        await modifyGeoLocation();

        hideFormToModify = false;

        const table = await createTableWithData();
        boxTable.appendChild(table);

        initMap();
    }

    function createFormToModify() {
        const divWithForm = document.createElement("div");
        divWithForm.setAttribute("class", "box-form-to-modify");

        const id = "form--modify",
            action = "/geocaching/:id",
            method = "PUT",
            buttonInnerText = "Modify geolocation";
        const form = createForm(id, action, method, buttonInnerText);
        form.addEventListener('submit', modifyGeolocationAndCreateTableWithData);

        divWithForm.appendChild(form);
        return divWithForm;
    }

    function clearInputValues() {

        const title = document.getElementById("title");
        const location = document.getElementById("location");
        const description = document.getElementById("description");
        const user = document.getElementById("user");

        title.value = "";
        location.value = "";
        description.value = "";
        user.value = "";
    }

    function addGeoLocation(event) {
        event.preventDefault();

        const { title, location, description, user } = getInputValues(boxForm);


        fetch('/geocaching', {
            method: "POST",
            body: JSON.stringify({
                title,
                location,
                description,
                user
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(r => r.json())
            .then(data => {
                const tableBody = createTableContentFromData(data.data);
                const table = document.querySelector(".table-data");
                table.appendChild(tableBody);
                initMap();
            });

        clearInputValues();
    }

    async function createTableAndForm() {
        const table = await createTableWithData();

        boxTable.appendChild(table);

        const id = "form--add",
            action = "/geocaching",
            method = "POST",
            buttonInnerText = "Add geolocation";
        const form = createForm(id, action, method, buttonInnerText);
        form.addEventListener('submit', addGeoLocation);

        boxForm.appendChild(form);
    }

    window.addEventListener('load', createTableAndForm);

})

async function getCoordinates(location) {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=AIzaSyCQ1KmHMwenpfYzaBOQ5PPNRCPmiDbQzS4`;

    return fetch(url)
        .then(result => result.json())
        .then(data => {
            const coordinates = data.results[0].geometry.location;
            return coordinates;
        })
        .catch(error => {
            alert(`Wrong location: ${location}! Please modify geocache.`)
            console.error(error);
        });

}

async function fetchGeocaches() {
    const jsonData = await fetch('/geocaching')
        .then(result => result.json());

    return jsonData.data;
}

async function getEnrichedGeocaches() {
    const geocaches = await fetchGeocaches();

    const listOfPromises = geocaches.map(async (geocache) => {
        const coordinates = await getCoordinates(geocache.location)
        return {
            ...geocache,
            coordinates
        }
    });
    return Promise.all(listOfPromises);

}


async function initMap() {
    const enrichedGeocaches = await getEnrichedGeocaches();

    const krakow = { lat: 50.0647, lng: 19.9450 };
    const map = new google.maps.Map(document.querySelector(".map"), {
        zoom: 11,
        center: krakow
    });
    const listOfMarkers = [];

    enrichedGeocaches.forEach(({coordinates, location}) => {
        const marker = new google.maps.Marker({
            position: coordinates,
            map: map,
            title: location
        });
        listOfMarkers.push(marker);
    })
}