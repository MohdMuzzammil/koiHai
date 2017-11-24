function fillProfile(formId, id) {
    var url = '/profile/'+id;
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if(this.readyState==4 && this.status==200){
            var data = JSON.parse(xhr.responseText);
            data = data.data;
            var form = document.getElementById(formId).getElementsByTagName('form')[0];
            var input = form.getElementsByTagName('input');
            console.log(input);
            input[0].value = data[0].name;
            input[1].value = data[0].profession;
            input[2].value = data[0].city;
            input[3].value = data[0].mobNo;
            form.getElementsByTagName('textarea')[0].value = data[0].address;
        }
    };
    xhr.open("GET",url);
    xhr.send();
}

function validateEditProfile() {
    var form = document.getElementById("id01").getElementsByTagName('form')[0];
    var input = form.getElementsByTagName('input');
    if(input[0].value==''||input[1].value==''||input[2].value==''||input[3].value==''){
        alert("Fields can't be empty");
        return false;
    }
    return true;
}


function getJobs() {
    var form = document.getElementById("searchJob");
    var select = form.getElementsByTagName('select')[0];
    var option = select.options[select.selectedIndex].value;
    var value = form.getElementsByTagName('input')[0].value;
    var url = "/getJobs?"+option+"="+value;
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var data = JSON.parse(xhr.responseText);
            var block = document.getElementById("jobList");
            data = data.data;
            document.getElementById("jobList").innerHTML = "";
            for(i=0;i<data.length;i++){
                var parser = new DOMParser();
                var id = "\'"+data[i]._id+"\'";
                var byProfileId = "\'"+data[i].byProfileId+"\'";
                var str =
                    '<div class="w3-container">'+
                    '<div class="w3-container navbar">'+
                    '<a onclick="document.getElementById(\'id02\').style.display=\'block\';fillProfile(\'id02\','+byProfileId+')"><h4 class="w3-opacity navbar-header"><b>'+data[i].profession+'</b></h4></a>'+
                    '</div><div class="w3-container">'+
                    '<p><i class="fa fa-calendar fa-fw w3-margin-right  w3-large w3-text-teal"></i>'+data[i].date+'</p>'+
                    '<p><i class="fa fa-home fa-fw w3-margin-right w3-large w3-text-teal"></i>'+data[i].city+'</p>'+
                    '<p><i class="fa fa-file-text fa-fw w3-margin-right w3-large w3-text-teal"></i>'+data[i].description+'</p>';
                if(data[i].koiHai==true)
                    str = str + '<p><i class="fa fa-credit-card fa-fw w3-margin-right w3-large w3-text-teal"></i>'+data[i].cost+'</p>';
                    str = str + '<input value="Bid" class="w3-button w3-light-grey w3-border w3-round" onclick="requestJobs('+id+')"/>'+
                    '</div><hr></div>';
                var dom = parser.parseFromString(str, 'text/html');
                document.getElementById("jobList").appendChild(dom.getElementsByTagName('div')[0]);
            }
        }
    }
    xhr.open("GET",url);
    xhr.send();
}

function myJobs() {
    var url = '/myJobs';
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var data = JSON.parse(xhr.responseText);
            var block = document.getElementById("jobList");
            data = data.data;
            document.getElementById("jobList").innerHTML = "";
            console.log(data);
            for(i=0;i<data.length;i++){
                var parser = new DOMParser();
                var id = "\'"+data[i]._id+"\'";
                var str = '<div class="w3-container">'+
                    '<div class="w3-container navbar">';
                if(data[i].koiHai==true)
                    str = str + '<a onclick="document.getElementById(\'id02\').style.display=\'block\';fillProfile(\'id02\','+byProfileId+')"><h4 class="w3-opacity navbar-header"><b>'+data[i].profession+'</b></h4></a>';
                else
                    str = str + '<h4 class="w3-opacity navbar-header"><b>'+data[i].profession+'</b></h4>';
                str = str +
                    '<a onclick="deleteJobs('+id+')"><i class="glyphicon glyphicon-remove w3-margin-right w3-xxlarge navbar-right"></i></a>'+
                    '</div><div class="w3-container">'+
                    '<p><i class="fa fa-calendar fa-fw w3-margin-right  w3-large w3-text-teal"></i>'+data[i].date+'</p>'+
                    '<p><i class="fa fa-home fa-fw w3-margin-right w3-large w3-text-teal"></i>'+data[i].city+'</p>'+
                    '<p><i class="fa fa-file-text fa-fw w3-margin-right w3-large w3-text-teal"></i>'+data[i].description+'</p>';
                if(data[i].koiHai==true){
                    str = str + '<p><i class="fa fa-credit-card fa-fw w3-margin-right w3-large w3-text-teal"></i>'+data[i].cost+'</p>';
                    if(data[i].taken==false)
                        str = str + '<input onclick="acceptedJobs('+id+')" value="Accept bid" class="w3-button w3-light-grey w3-border w3-round-large"/>';
                    if(data[i].taken==true)
                        str = str + '<input value="Bid Accepted" class="w3-button w3-light-grey w3-border w3-round-large"/>';
                }
                   str = str + '</div><hr></div>';
                var dom = parser.parseFromString(
                    str , 'text/html');
                document.getElementById("jobList").appendChild(dom.getElementsByTagName('div')[0]);
            }
        }
    }
    xhr.open("GET",url);
    xhr.send();
}

function deleteJobs(jobId) {
    var url = '/deleteJobs?jobId='+jobId;
    console.log(url);
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if(xhr.responseText == "success")location.reload();
            else alert("Job not deleted... There might be some problem");
        }
    }
    xhr.open("GET",url);
    xhr.send();
}


//after wards
function requestJobs(id) {
    var cost = prompt("Enter the bidding amount");
    if(cost<0){
        alert("Invalid amount");
        return;
    }
    var url = '/requestJobs?jobId='+id+'&cost='+cost;
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if(this.readyState==4 && this.status==200){
            var data = xhr.responseText;
            if(data==='success'){alert("Bid successfull!!");}
            else alert(data);
        }
    }
    xhr.open('GET',url);
    xhr.send();
}

function acceptedJobs(jobId) {
    var url = '/acceptedJobs?jobId='+jobId;
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var data = xhr.responseText;
            if(data==='success'){
                location.reload();
            }
            else alert("Something went wrong..!!!!");
        }
    }
    xhr.open("GET",url);
    xhr.send();
}
