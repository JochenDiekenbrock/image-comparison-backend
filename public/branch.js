let httpRequest;
let testName;

function accept(branchDir, name) {
    let formData = new FormData();
    testName = name;
    formData.append('branchDir', branchDir);
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
    let elem = document.getElementById('td-' + name);
    elem.innerHTML = '<i class="fas fa-check fa-lg"></i>';
    elem.classList.remove('table-danger');
    elem.classList.add('table-success');

    elem = document.getElementById('btn-' + name);
    elem.parentNode.removeChild(elem);
}
