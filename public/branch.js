let httpRequest;
let testName;

function accept(branch, name) {
    console.log({branch}, {name});
    let formData = new FormData();
    testName = name;
    formData.append('branch', branch);
    formData.append('name', name);
    httpRequest = new XMLHttpRequest();

    if (!httpRequest) {
        alert('Giving up :( Cannot create an XMLHTTP instance');
        return false;
    }
    httpRequest.onreadystatechange = handleResponse;
    httpRequest.open('POST', '/api/accept');
    httpRequest.send(formData);
}

function handleResponse() {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.status >= 200 && httpRequest.status < 300) {
            setToSuccess(testName);
        } else {
            alert(httpRequest.response);
        }
    }
}

function setToSuccess(name) {
    let elem = document.getElementById('tr-' + name);
    elem.classList.remove('table-danger');
    elem.classList.add('table-success');

    elem = document.getElementById('td-' + name);
    elem.innerText = 'success';

    elem = document.getElementById('a-' + name);
    elem.classList.remove('fa-check');
}
