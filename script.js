// Define variables
let chatMessagesEl = document.querySelector(".chat__container__messages");
let formEl = document.querySelector(".chat__container__form");
let inputEl = document.querySelector("#user-input");
let sendButton = document.querySelector("#send-button");

/* Define handlers */

// Fetch data
const fetchData = async (request) => {
  //const axios = require("axios");

  const config = {
    headers: {
      "x-api-key": "sec_OrFaC8qrM0CfMytaOYhJNW9eJDAuClcm",
      "Content-Type": "application/json",
    },
  };

  const data = {
    referenceSources: true,
    sourceId: "cha_KkN7C3DFURENjW2O2StPS",
    messages: [
      {
        role: "user",
        content: request,
      },
    ],
  };

  // implement a loader while fecthing the data
  const MessageEl = document.createElement("div");
  let loading = `<img
        class=".loading-image"
        src="img/loading.png"
        width="20px"
        height="20px"
        alt=""
        style="animation: rotate 2s linear infinite; @keyframes rotate{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}"
      />`;
  addMessage(loading, false);

  const response = await axios
    .post("https://api.chatpdf.com/v1/chats/message", data, config)
    .then((response) => {
      console.log("Result:", response);
      return response;
    })
    .catch((error) => {
      console.error("Error:", error.message);
      console.log("Response:", error.response.data);
    });
  console.log("Result:", response.data.content);
  return response.data.content;
};

/* const fetchData = async (request) => {
  const url = "https://api.chatpdf.com/v1/chats/message";

  const headers = {
    "x-api-key": "sec_OrFaC8qrM0CfMytaOYhJNW9eJDAuClcm",
    "Content-Type": "application/json",
  };

  const body = JSON.stringify({
    sourceId: "cha_2XXSxyCRYv8EBlDX3JqlF",
    messages: [
      {
        referenceSources: true,
        role: "user",
        content: request,
      },
    ],
  });

  try {
    const MessageEl = document.createElement("div");
    addMessage("Loading...", false);
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: body,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorData.message}`
      );
    }

    const resp = await response.json();
    console.log(resp.references);
    return resp.content;
  } catch (error) {
    console.error("Error:", error.message);
  }
}; */

const addMessage = (message, isUser) => {
  const MessageEl = document.createElement("div");
  MessageEl.classList.add("message");
  MessageEl.classList.add(isUser ? "message-user" : "message-bot");
  MessageEl.innerHTML = marked.parse(message);
  chatMessagesEl.appendChild(MessageEl);
  chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
};

/* Define event handlers */
sendButton.addEventListener("click", async (e) => {
  e.preventDefault();
  let inputVal = inputEl.value.trim();
  if (!inputVal) return;

  // add user request
  addMessage(inputVal, true);

  /*add bot response*/
  response = await fetchData(inputVal);
  let lastBotEl = document.querySelector(".message-bot:last-child");
  // Track all the Pnumber and replace them with <span class="pnumber">Pnum</span>

  modified_response = response.replace(
    /P\d+/g,
    (match) => `<span class='pnumber'>${match}</span>`
  );

  lastBotEl.innerHTML = marked.parse(modified_response);
  inputEl.value = "";
});

// simulate a click when pressed on Enter
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    sendButton.click();
    inputEl.value = "";
  }
});

/*Reading the PDF */
// Path to your PDF document
const url = "docs/scaling-review.pdf";

// Asynchronously load the PDF
/* const loadingTask = pdfjsLib.getDocument(url);
let pdfDoc = null;

loadingTask.promise
  .then((pdf) => {
    pdfDoc = pdf;
    // Generate navigation links based on the total number of pages
    generatePageLinks(pdf.numPages);
    // Render the first page by default
    renderPage(1);
  })
  .catch((err) => {
    console.error("Error during PDF loading: ", err);
  });

// Function to create clickable page links
function generatePageLinks(totalPages) {
  const navDiv = document.getElementById("navigation");
  for (let i = 1; i <= totalPages; i++) {
    const link = document.createElement("span");
    link.className = "page-link";
    link.textContent = i;
    link.dataset.page = i;
    link.addEventListener("click", (e) => {
      const pageNumber = parseInt(e.target.dataset.page, 10);
      renderPage(pageNumber);
    });
    // Append the link to navigation
    navDiv.appendChild(link);
  }
}

// Function to render a specific page number
function renderPage(num) {
  pdfDoc.getPage(num).then((page) => {
    const scale = 1.5; // Adjust the scale as needed for your layout
    const viewport = page.getViewport({ scale });

    // Prepare canvas using PDF page dimensions
    const canvas = document.querySelector(".pdf__viewer");
    const context = canvas.getContext("2d");
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    // Render the PDF page into the canvas context
    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };
    page.render(renderContext);
  });
} */

WebViewer(
  {
    path: "js-libraries/PDFJSExpress-view-only/lib", // path to the PDF.js Express'lib' folder on your server
    licenseKey: "GwVmd9htZU5wyklA9duH",
    initialDoc: "docs/AICCRA-scaling-weeks-training-material-combined.pdf",
  },
  document.getElementById("viewer")
).then((instance) => {
  const docViewer = instance.docViewer;

  // Set default page number to 1
  const defaultPageNumber = 1;

  // Function to go to a specific page
  function goToPage(pageNumber = defaultPageNumber) {
    const totalPages = docViewer.getPageCount();
    if (pageNumber > 0 && pageNumber <= totalPages) {
      docViewer.setCurrentPage(pageNumber);
    } else {
      console.warn(
        `Page number ${pageNumber} is out of range. Please enter a value between 1 and ${totalPages}.`
      );
    }
  }

  // handle page number
  // Function to handle clicks on .pnumber elements
  function handlePNumberClick(event) {
    if (event.target.classList.contains("pnumber")) {
      let pnumber = event.target.textContent.match(/\d+/);
      console.log(`${pnumber}`);
      goToPage(pnumber);
    }
  }

  // Go to the default page when the document is loaded
  docViewer.on("documentLoaded", () => {
    goToPage(); // Navigate to the default page

    // Add event listener to the document
    document.addEventListener("click", handlePNumberClick);
  });

  // Example of using the function to go to another page
  // goToPage(2); // Uncomment to navigate to page 2
});

// Add event handler for page number
/* let pageNumberElts = document.querySelectorAll(".pnumber");
pageNumberElts.forEach((element) => {
  element.addEventListener("click", () => {
    console.log("test");
    //console.log(`${element.innerHTML}`);
    //renderDocument(pageNumber);
  });
}); */
