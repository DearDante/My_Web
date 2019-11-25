

function add_task() {
    var form = document.getElementById('main_form');
    var task_nums_label = document.getElementById('task_nums');
    var task_nums = parseInt(task_nums_label.innerText) + 1;

    var task_id = document.createElement('label');
    task_id.id = 'task_' + task_nums;
    task_id.innerText = task_nums;
    task_nums_label.innerText = task_nums;

    var task_content = document.createElement('input');
    task_content.id = 'task_name_' + task_nums;
    task_content.type = 'text';

    var task_complete = document.createElement('input');
    task_complete.id = 'task_complete_' + task_nums;
    task_complete.type = 'checkbox';
    var completed = document.createElement('label');
    completed.innerText = 'Completed';

    var task_skip = document.createElement('input');
    task_skip.id = 'task_skip_' + task_nums;
    task_skip.type = 'checkbox';
    var skip = document.createElement('label');
    skip.innerText = 'Skip';

    var div = document.createElement('div');
    form.append(div);
    div.appendChild(task_id);
    div.appendChild(task_content);
    div.appendChild(task_complete);
    div.appendChild(completed);
    div.appendChild(task_skip);
    div.appendChild(skip);
}

function submit_daily(){
    var xhr = new XMLHttpRequest();
    var data = new FormData();
    var info_str = '';
    var user = document.getElementById('username');
    var nums = document.getElementById('task_nums');
    nums = parseInt(nums.innerText);

    data.append("name", user.innerText);
    console.log(user.innerText);
    for(var i=1;i<nums+1;i++){
        task_id = 'task_' + i;
        task_content = 'task_name_' + i;
        task_complete = 'task_complete_' + i;
        task_skip = 'task_skip_' + i;

        var tc = document.getElementById(task_content);
        var tcc = document.getElementById(task_complete);
        var ts = document.getElementById(task_skip);

        tc_value = tc.value;
        tcc_value = tcc.checked;
        ts_value = ts.checked;

        info_str = info_str+tc_value + ',' + tcc_value + ',' + ts_value +';'
    }
    data.append("info", info_str);
    xhr.open("POST", "/daily", true);
    xhr.send(data);

    alert("Submitted!");
}