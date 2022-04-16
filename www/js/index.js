

document.addEventListener("deviceready", onDeviceReady, false);
var token;

function onDeviceReady() {
    console.log("Running cordova-" + cordova.platformId + "@" + cordova.version);
    console.log("received deviceready");
    document.getElementById("deviceready").classList.add("ready");
    showlogin();
    $("#tableData").hide();
    $("#allButtons").hide();
    $("#fxData").hide();
    

    // document.getElementById("loginbutton").addEventListener("click", loginOBP);
    document.getElementById("databutton").addEventListener("click", queryMyAccounts);
    document.getElementById("bankData").addEventListener("click", getBanks);

    document.getElementById("fxBtn").addEventListener("click",getFx);
    document.getElementById("getRate").addEventListener("click",getRate);
}
const showlogin = () => {
    $("#loginbutton").append(
        "<a href=#><button class='btn btn-outline-dark' id='liveToastBtn' onClick= loginOBP()>Log In</button></a>"
    )
}
const loginSuccess = () => {
    $("body").append(
        "<div class='position-fixed bottom-0 end-0 p-3' style='z-index: 11'><div id='liveToast' class='toast hide' role='alert' aria-live='assertive' aria-atomic='true'><div class='toast-header'><img src='...' class='rounded me-2' alt='...'><strong class='me-auto'>Bootstrap</strong><small>11 mins ago</small><button type='button' class='btn-close' data-bs-dismiss='toast' aria-label='Close'></button></div><div class='toast-body'>Login Successfull </div> </div></div>"
    )
}
const showlogout = () => {
    $("#logoutBtn").append(
        "<button class='btn btn-outline-dark' id='liveToastBtn' onClick= logOut()>Log Out</button>"
    )
}
const logOut = () => {
    token = null;
    $("logoutBtn").empty();
    window.location.assign("/");
}
/**
 * @dev Provide consumer key for appropriate credentials.
 * @Note : Function to perform login authentication
 */
const loginOBP = () => {
    username = document.getElementById("username").value;
    password = document.getElementById("password").value;
    console.log("in login");
    $.ajax({
        url: "https://apisandbox.openbankproject.com/my/logins/direct",
        type: "POST",
        dataType: "json",
        crossDomain: true,
        cache: false,
        contentType: "application/json; charset=utf-8",
        xhrFields: {
            withCredentials: true,
        },
//anil.be.29@example.com
//9404f4
        beforeSend: function (xhr) {
        
            xhr.setRequestHeader("Authorization",
            'DirectLogin username="' + username + '\",password="' + password + '\", consumer_key="w5bgxjhphtve0f3kr0oip0z3grrcxgtcnxjepv5x"');
        },
        success: function (data, textStatus, jQxhr) {
            console.log("in success");
            // document.getElementById("loginp").innerHTML =
            //     "Successful Login. Token=" + data.token;
            token = data.token;
            // url = "../banks.html"
            // location.href = url ;
            $("#loginbutton").empty();


            // $("#loginbutton").append(
            //     "<a href='../banks.html'><button class='btn btn-outline-dark' onClick = logOut()>Log Out</button></a>"
            // );
            $("#allButtons").show();
            $("#loginData").hide();
            showlogout();
            loginSuccess();

        },
        error: function (jqXhr, textStatus, errorThrown) {
            console.log("in error");
            document.getElementById("loginp").innerHTML = "Login unsuccessfull";
        },
    });
}
/**
 * @dev Function to perform request to get data from Open Bank 
 * @Note : Lists out all the bank in a table
 */
const getBanks = () => {
    console.log("Performing GetBank()");
    $.ajax({
        url: "https://apisandbox.openbankproject.com/obp/v4.0.0/banks",
        type: "GET",
        dataType: "json",
        crossDomain: true,
        cache: false,
        contentType: "application/json; charset=utf-8",

        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "DirectLogin token=" + token);
        },

        success: function (data, textStatus, jQxhr) {
            console.log("in query success");
            console.log(data);
            $("#tablebody").empty();
            $("#tableData").show();

            $("#tablebody").append(
                "<tr><td>Full Name</td><td>Short Name</td><td>Id</td></tr>"
            );

            data.banks.forEach(showBanks);
        },

        error: function (jqXhr, textStatus, errorThrown) {
            console.log("in query error");
        },
    });
}
/**
 * @dev Appends the table data as required
 * @param bank contains the data of all banks.
 * @Note : lists out all the banks and its details in the table.
 */
const showBanks = (bank) => {
    // $("#tablebody").empty();
    $("#tablebody").append(
        "<tr><td><button onclick=showAccounts('" +
        bank.id +
        "')>" +
        bank.full_name +
        "</button></td><td>" +
        bank.short_name +
        "</td><td>" +
        bank.id +
        "</td></tr>"
    );
};
/**
 * @dev fetches account data as required
 * @Note : lists out all the  accounts and its details in the table.
 */
const queryMyAccounts = () => {
    console.log("in query");
    $.ajax({
        url: "https://apisandbox.openbankproject.com/obp/v4.0.0/my/accounts",
        type: "GET",
        dataType: "json",
        crossDomain: true,
        cache: false,
        contentType: "application/json; charset=utf-8",

        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "DirectLogin token=" + token);
        },

        success: function (data, textStatus, jQxhr) {
            console.log("in query success");
            console.log(data);
            $("#tablebody").empty();
            $("#tableData").show();
            $("#tablebody").append(
                "<tr><td>Full Name</td><td>Short Name</td><td>Id</td></tr>"
            );
            data.accounts.forEach(getMyBanks);
        },
        error: function (jqXhr, textStatus, errorThrown) {
            console.log("in query error");
        },
    });
}
/**
 * @dev Appends the table data as required
 * @param accounts contains the data of all bank's id.
 * @Note : lists out the banks and its details in the table.
 */
const getMyBanks = (accounts) => {
    $.ajax({
        url:
            "https://apisandbox.openbankproject.com/obp/v4.0.0/banks/" +
            accounts.bank_id,
        type: "GET",
        dataType: "json",
        crossDomain: true,
        cache: false,
        contentType: "application/json; charset=utf-8",

        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "DirectLogin token=" + token);
        },

        success: function (data, textStatus, jQxhr) {
            console.log("in query success");
            console.log(data);
            console.log(data.id, accounts.bank_id);

            $("#tablebody").append(
                "<tr><td><button onClick=showAccounts('" +
                data.id +
                "')>" +
                data.full_name +
                "</button></td><td>" +
                data.short_name +
                "</td><td>" +
                data.id +
                "</td></tr>"
            );
        },

        error: function (jqXhr, textStatus, errorThrown) {
            console.log("in query error");
        },
    });
}
/**
 * @dev Appends the table data as required
 * @param i contains the data of all bank's id.
 * @Note : lists out all the  accounts and its details in the table.
 */
const showAccounts = (i) => {
    console.log(
        "https://apisandbox.openbankproject.com/obp/v4.0.0/banks/" + i + "/accounts"
    );
    $.ajax({
        url:
            "https://apisandbox.openbankproject.com/obp/v4.0.0/banks/" +
            i +
            "/accounts/private",
        type: "GET",
        dataType: "json",
        crossDomain: true,
        cache: false,
        contentType: "application/json; charset=utf-8",

        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "DirectLogin token=" + token);
        },

        success: function (data, textStatus, jQxhr) {
            console.log("in fetching acounts function");
            console.log(data);
            $("#tablebody").append(
                "<tr><td>User ID</td><td>Account Type</td><td>Action</td></tr>"
            );

            data.accounts.forEach(myAccounts);
        },

        error: function (jqXhr, textStatus, errorThrown) {
            console.log("in query error function on account fetching");
        },
    });
};
/**
 * @dev Function to perform request to get data from Open Bank 
 * @param i contains the data of all bank's id.
 * @Note : lists out all the  accounts and its details in the table.
 */
const myAccounts = (data) => {
    console.log("inside myaccounts", data);
    if (data) {
        $("#tablebody").append(
            "<tr><td>" +
            data.label +
            "</td><td>" +
            data.account_type +
            "</td><td><button onClick=showTransactions('" +
            data.id + "','" + data.bank_id +
            "')>Show Transactions ></button> </td></tr>"
        );
    } else {
        $("#tablebody").append("<tr><td>No Accounts</td></tr>");
    }
};
/**
 * @dev Appends the table data as required
 * @param i contains the data of all bank's id. 
 * @param j contains the data of all account's id. 
 * @Note : lists out all the  accounts and its details in the table.
 */
const showTransactions = (i, j) => {
    console.log(i, j);
    $.ajax({
        url:
            "https://apisandbox.openbankproject.com/obp/v4.0.0/my/banks/" + j + "/accounts/" + i + "/transactions",
        type: "GET",
        dataType: "json",
        crossDomain: true,
        cache: false,
        contentType: "application/json; charset=utf-8",

        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "DirectLogin token=" + token);
        },

        success: function (data, textStatus, jQxhr) {
            console.log("in fetching acounts function");
            console.log(data);
            $("#tablebody").append(
                "<tr><td>Transactions ID</td><td>Details</td><td>More</td></tr>"
            );

            data.transactions.forEach(myTransactions);
        },

        error: function (jqXhr, textStatus, errorThrown) {
            console.log("in query error function on account fetching");
        },
    });
};
/**
 * @dev Function to perform request to get data from Open Bank 
 * @param data contains the data of all account's id.
 * @Note : lists out all the  transactions and its details in the table.
 */
const myTransactions = (data) => {
    console.log("inside myaccounts");

    if (data.transactions != null) {
        $("#tablebody").append(
            "<tr><td><button onClick=showTransactions('" +
            data.id +
            "')>" +
            data.label +
            "</button></td><td>" +
            data.account_type +
            "</td><td>" +
            data.id +
            "</td></tr>"
        );
    } else {
        $("#tablebody").append("<tr><td>No Accounts</td></tr>");
    }
};

const output_bank = (b) => {
    console.log("Bank ID: " + b);
}
const getRate = () => {
    var a = document.getElementById("cur1").value;
    var b = document.getElementById("cur2").value;

    // var cur1 = $("#cur1").val ;
    // var cur2 = $("#cur2").val;
    console.log("Performing get Fx Rates");
    $.ajax({
        url: "https://apisandbox.openbankproject.com/obp/v4.0.0/banks/rbs/fx/"+a+"/"+b,
        type: "GET",
        dataType: "json",
        crossDomain: true,
        cache: false,
        contentType: "application/json; charset=utf-8",

        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "DirectLogin token=" + token);
        },

        success: function (data, textStatus, jQxhr) {
            console.log("in query success");
            console.log(data);
            $("#tablebody").empty();
            $("#tableData").hide();
            $("#displayRate").empty();
            $("#displayRate").append(
                "<p>"+data.conversion_value+"&nbsp"+b+"</p>"
            );

            // data.banks.forEach(showBanks);
        },

        error: function (jqXhr, textStatus, errorThrown) {
            console.log("in query error");
        },
    }); 
}
const getFx = () => {
    $("#tablebody").empty();
            $("tabledata").hide();
            $("#fxData").show();

}
//C:\Users\surya\Downloads\checkpoint8\checkpoint8\www
