

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