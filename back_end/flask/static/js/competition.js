var user_dict = new Array();
user_dict["user_1"] = "God doG";
user_dict["user_2"] = "兵弟弟";
user_dict["user_3"] = "雷弟弟";
user_dict["user_4"] = "枣子哥";
user_dict["user_5"] = "力哥哥";
user_dict["user_6"] = "毒哥";
user_dict["user_7"] = "大叔";
user_dict["user_8"] = "羊总";
user_dict["user_9"] = "小帅哥";
user_dict["user_10"] = "篮子哥";
user_dict["user_11"] = "阿伦";
user_dict["user_12"] = "王律师";
user_dict["user_13"] = "阿达";
user_dict["user_101"] = "路人甲";
user_dict["user_102"] = "路人乙";
user_dict["user_103"] = "路人丙";
user_dict["user_104"] = "路人丁";
var who = ["路人甲", "路人乙", "路人丙", "路人丁", "雷弟弟"];

function getUsers() {
        var Users = document.getElementsByName('competitor');
        var str = "参赛选手有:";
        var competitors = new Array()
        for (var i=0; i<Users.length; i++)
        {
            var box = Users[i];
            if(box.checked)
            {
                var name = box.value;
                str = str + name + ",";
                competitors.push(name)
            }
        }
        console.log(str);
        var count = 1;
        while(true){
            if(competitors.length>=5){
                break;
            }
            competitors.push('user_'+(100+count));
            count += 1;
        }
        create_form(competitors);
    }

    function show(str){
        document.getElementById('show').innerText=str;
    }

    function create_form(competitors){
        var len = competitors.length;
        var first_form = document.getElementById('first_form');
        var form = document.createElement('form');
        first_form.append(form);

        //创建五个参赛者标签
        for(var count=0; count<5;count++){
            var user_name = document.createElement('label');
            user_name.id = 'competitor_'+ (count+1);
            user_name.innerHTML = user_dict[competitors[count]];

            //创建五个绑定者标签
            var bind_name = document.createElement('select');
            bind_name.id = 'binder_'+ (count+1);
            //bind_name.innerHTML = user_dict[competitors[count]];
            for(var i=0; i<len; i++){
                var option = document.createElement('option');
                option.value = 'selector_' + i;
                option.innerHTML = user_dict[competitors[i]];
                if(i==count){option.selected='selected'}
                bind_name.appendChild(option);
            }

            //创建五个分数输入栏
            var pt_input = document.createElement('input');
            pt_input.id = 'point_'+(count+1);
            pt_input.type = 'text';
            pt_input.value = 0;

            var div = document.createElement('div');
            form.appendChild(div);
            div.appendChild(user_name);
            div.appendChild(bind_name);
            div.appendChild(pt_input);

        }

        var btn_figure = document.createElement('input');
        btn_figure.type = "button";
        btn_figure.value = "计算";
        btn_figure.addEventListener('click', figure, true);
        form.appendChild(btn_figure);
    }

    //寻找是否存在同分
    function find_equal(pts){}
    function figure() {
        var competitors = new Array();
        var ori_pts = new Array();
        var binders = new Array();
        var aft_pts = new Array();

        for(var i=1;i<6;i++){
            name_id = 'competitor_' + i;
            bind_id = 'binder_' + i;
            pts_id = 'point_' + i;

            var ni = document.getElementById(name_id);
            var bi = document.getElementById(bind_id);
            var pi = document.getElementById(pts_id);

            //获取绑定者姓名
            var bi_index = bi.selectedIndex;
            var bi_name = bi.options[bi_index].text;

            competitors.push(ni.innerText);
            ori_pts[ni.innerText] = parseFloat(pi.value);
            binders[ni.innerText] = bi_name;
        }
        console.log("原始分数:", ori_pts);

        //获取绑定结算后的分数
        for(var j=0; j<competitors.length; j++){
            n = competitors[j];
            ori_pt = parseFloat(ori_pts[n]);
            bind_pt = parseFloat(ori_pts[binders[n]]);
            aft_pt = (ori_pt + bind_pt) / 2.0;
            aft_pts[n] = aft_pt;
        }
        console.log("平均后分数:", aft_pts);

        var boss = calculation(ori_pts, aft_pts);

        //向后端传参
        var xhr = new XMLHttpRequest();
        var data = new FormData();
        data.append("boss", boss);
        counting = 1;
        for(var key in ori_pts){
            to_str = key + ";" + ori_pts[key];
            data.append("user_"+counting, to_str);
            counting = counting+1;
        }
        xhr.open("POST", "/competition", true);
        xhr.send(data);

        alert(boss)
    }

    function calculation(ori, aft) {
        /*优先计算同分情况，按照如下顺序计算同分，只触发一次
        1. 计算羁绊前是否存在同分
        2. 计算羁绊后的分数中是否存在同分
        3. 羁绊计算后的分数中，是否存在和计算前的同分
         */
        var boss = equal_1(ori);
        if(boss.length>0){console.log("同分老板", boss);return boss}
        else{
            boss = equal_1(aft);
            if(boss.length>0){console.log("同分老板", boss);return boss}
            else{
                boss = equal_2(ori, aft);
                if(boss.length>0){console.log("同分老板", boss);return boss}
                else{
                    var suspect_before = catch_the_boss(ori);
                    console.log("羁绊前分数最低者:", suspect_before);

                    var suspect_after = catch_the_boss(aft);
                    console.log("羁绊后分数最低者:", suspect_after);

                    //计算羁绊前，分数最低者高于10分，则不存在老板
                    if(ori[suspect_before]>=10){return "没有老板"}

                    //计算羁绊后，分最低且低于10分
                    if(aft[suspect_after]<10){
                        boss = suspect_after;
                    }
                    //计算羁绊后，分最低但不低于10分
                    else{
                        //如果羁绊前时最低，则当选老板
                        if(suspect_after == suspect_before){
                            boss = suspect_after;
                        }
                        //如果羁绊前并非最低，则无老板
                        else{boss = "没有老板"}
                    }
                    return boss
                }
            }
        }
    }

    //单组判断是否存在同分
    function equal_1(dict) {
        var boss = new Array();
        //此处存在一个深浅拷贝的解决方式，不想写深拷贝代码，故简化。
        var used = new Array();
        for(var key in dict){
            var value = dict[key];
            used.push(key);
            for(var key_2 in dict){
                if(used.indexOf(key_2)>=0){continue}

                if(dict[key_2]==value){
                    if(boss.indexOf(key)<0){boss.push(key)};
                    if(boss.indexOf(key_2)<0){boss.push(key_2)};
                }
            }
        }
        return boss;
    }

    //计算的前后是否存在同分
    function  equal_2(dict_1, dict_2) {
        var boss = new Array();
        for(var key in dict_1){
            var value = dict_1[key];
            for(var key_2 in dict_2){
                if(key == key_2){continue}
                else{
                    if(dict_2[key_2] == value){
                        if(boss.indexOf(key)<0){boss.push(key)}
                        if(boss.indexOf(key_2)<0){boss.push(key_2)}
                      }
                    }
                }
            }
        return boss;
        }

    //获取分数最低者的名称
    function  catch_the_boss(dict) {
        var lowest = 999;
        var boss = "";
        console.log(dict);
        for(var key in dict){
            console.log(dict[key]);
            if(dict[key] < lowest){
                //排除路人和破产选手
                if(who.indexOf(key)<0){
                    boss = key;
                    lowest = dict[key];
                }
            }
        }
        return boss
    }