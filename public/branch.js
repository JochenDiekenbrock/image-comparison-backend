let httpRequest;
let testName;

function accept(branchDir, name) {
    sendRequest('/api/accept', branchDir, name, setToSuccess);
}

function deleteTest(branchDir, name) {
    sendRequest('/api/delete', branchDir, name, deleteRow);
}

function sendRequest(action, branchDir, name, onSuccess) {
    let formData = new FormData();
    testName = name;
    formData.append('branchDir', branchDir);
    formData.append('name', name);
    httpRequest = new XMLHttpRequest();

    if (!httpRequest) {
        alert('Giving up :( Cannot create an XMLHTTP instance');
        return false;
    }
    httpRequest.onreadystatechange = handleResponseFunc(onSuccess);
    httpRequest.open('POST', action);
    httpRequest.send(formData);
}

function handleResponseFunc(onSuccess) {
    return function handleResponse() {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status >= 200 && httpRequest.status < 300) {
                if (onSuccess) {
                    onSuccess(testName);
                }
            } else {
                alert(httpRequest.response);
            }
        }
    };
}

function deleteRow(name) {
    let row = document.getElementById('tr-' + name);
    if (row) {
        row.parentNode.removeChild(row);
    }
}

function setToSuccess(name) {
    let elem = document.getElementById('td-' + name);
    elem.innerHTML = '<i class="fas fa-check fa-lg"></i>';
    elem.classList.remove('table-danger');
    elem.classList.add('table-success');

    elem = document.getElementById('btn-' + name);
    if (elem) {
        elem.parentNode.removeChild(elem);
    }
}

function dateSorter(a, b, rowA, rowB) {

    const dateA = rowA._date_data.date;
    const dateB = rowB._date_data.date;

    return dateB - dateA;
}
