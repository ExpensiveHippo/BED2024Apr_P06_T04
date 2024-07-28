document.addEventListener("DOMContentLoaded", () => {
    
    const token = localStorage.getItem("userToken");
    const reportList = [];

    // get all reports
    fetch("/reports", {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(res => res.json())
    .then(data => {
        if (data) {
            data.map(report => reportList.push(report));
            applyFilter(token, reportList);
        } else {
            console.log("No reports");
        }
    })
    .catch(error => console.error(error))

    document.getElementById("btn-apply").addEventListener("click", () => applyFilter(token, reportList));
})

async function addReportContainer(token, report) {
    fetch(`/Posts/${report.contentId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(res => res.json())
    .then(data => {
        const reportContainer = document.createElement("div");
        reportContainer.classList.add("report-container");

        const reportHeader = document.createElement("h2");
        reportHeader.classList.add("report-header")
        reportHeader.textContent = report.reason;

        const reportType = document.createElement("h4");
        reportType.classList.add("report-type");
        reportType.textContent = report.contentType + ": " + report.contentId;  

        const contentTitle = document.createElement("h2");
        contentTitle.classList.add("content-title");
        contentTitle.textContent = data.post.title;

        const content = document.createElement("p");
        content.textContent = data.post.content;

        const btnContainer = document.createElement("div");
        btnContainer.classList.add("btn-container");

        const btnDelete = document.createElement("button");
        btnDelete.classList.add("btn-delete");
        btnDelete.innerText = "Delete";
        btnDelete.addEventListener("click", () => {
            fetch(`/deleteReports/${report.contentType}/${report.contentId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(res => {
                if (res.status === 204) {
                    console.log(`Report under ${report.contentId} removed`);
                    location.reload();
                    deleteContent(token, report.contentType, report.contentId);
                } else {
                    console.log("deleteReports:error");
                }})
            .catch(error => console.error(error))            
        })

        const btnIgnore = document.createElement("button");
        btnIgnore.classList.add("btn-ignore");
        btnIgnore.textContent = "Ignore";
        btnIgnore.addEventListener("click", () => {
            fetch(`/deleteReport/${report.reportId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(res => {
                if (res.status === 204) {
                    console.log(`Report with reportId ${report.reportId}`);
                    reportContainer.remove();
                } else {
                    console.log(`deleteReport:error`);
                }
            })
            .catch(error => console.error(error))
        })

        btnContainer.appendChild(btnDelete);
        btnContainer.appendChild(btnIgnore);

        reportContainer.appendChild(reportHeader);
        reportContainer.appendChild(reportType);
        reportContainer.appendChild(contentTitle);
        reportContainer.appendChild(content);
        reportContainer.appendChild(btnContainer);
        
        document.getElementById("report-box").appendChild(reportContainer);
    })
    .catch(error => console.error(error))
}

function applyFilter(token, reportList) {
    const selectSort = document.getElementById("sort").value;
    const selectContent = document.getElementById("content").value;
    const selectIndustry = document.getElementById("industry").value;

    console.log(selectSort);
    console.log(selectContent);
    console.log(selectIndustry);

    let sortedReports = reportList;

    if (selectContent != "All") {
        sortedReports = sortedReports.filter(report => report.contentType === selectContent);
    }

    if (selectIndustry != "All") {
        sortedReports = sortedReports.filter(report => report.industry === selectIndustry);
    }

    if (selectSort === "Most Recent") {
        sortedReports = sortedReports.sort((a, b) => Date.parse(b.reportDate) - Date.parse(a.reportDate));
    } else {
        sorted = sortedReports.sort((a, b) => Date.parse(a.reportDate) - Date.parse(b.reportDate));
    }

    document.getElementById("report-box").innerHTML = "<h2 class=\"filter-header\">Filter Reports</h2>";
    sortedReports.forEach(report => addReportContainer(token, report))
}

async function deleteContent(token, contentType, contentId) {
    var endpoint;

    if (contentType === "Posts") {
        endpoint = `/deletePost/${contentId}`
    } else {
        // Comment endpoint wouldn't work
        console.log("buh");
        return;
    }

    fetch(endpoint, {
        method: "DELETE",
        headers: {
            'Authorization': `Bearer ${token}` 
        }
    })
    .then(res => {
        if (res.status === 204) {
            console.log(`${contentType} ${contentId} deleted`);
        }
    })
}
