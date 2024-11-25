const url = 'https://docs.google.com/document/d/e/2PACX-1vQGUck9HIFCyezsrBSnmENk5ieJuYwpt7YHYEzeNJkIb9OSDdx-ov2nRNReKQyey-cwJOoEKUhLmN9z/pub';

async function getFile() {
  return fetch(url)
  .then(response => {
    return response.text();
  })
  .then(data => {
    const parser = new DOMParser();
    return parser.parseFromString(data, "text/html");
  })
  .catch(error => {
    console.error('Failed to fetch url: ', error);
  })
}

async function processHtml() {
  await getFile()
  .then(document => {
    let data = [];
    const rows = document.getElementsByTagName('tr');
    for (let i = 1; i < rows.length; i++) {
      let cols = rows[i].querySelectorAll('td, th');
      let rowsArray = [];
      for (let j = 0; j < cols.length; j++) {
        rowsArray.push(cols[j].innerText);
      }
      data.push(rowsArray);
    }
    return data;
  })
  .then(data => displayData(data));
};

function displayData(data) {
  const container = document.createElement('div');
  container.setAttribute("style", "width: 100vw; height: 50vh; position: relative;")
  for (let i = 0; i < data.length; i++) {
    const div = document.createElement('div');
    div.setAttribute("style", `width: min-content; height: min-content; position: absolute; bottom: ${data[i][2]*20}px; left: ${data[i][0]*13}px;`)
    div.innerText = data[i][1];
    container.appendChild(div);
  }
  document.body.appendChild(container);
}

processHtml();