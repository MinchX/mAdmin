layui.config({base:"js/"}).use(['element','jquery'],function(){
    var element = layui.element,$ = layui.$;

    function topNav(){
        $.get("../json/menu.json",function(data){
                genTopNavHtml(data);
                element.render("nav");
		});
    }

    function genTopNavHtml(data){
        var jsonData;
        if(typeof(data)=="string"){
            jsonData = JSON.parse(data);
        }else{
            jsonData = data;
        }
        var ulObj = $('<ul class="layui-nav topNavLeft" lay-filter="topNav"></ul>');
        var wWidth = $(window).width();
        var showNum = Math.floor((wWidth - 230 - 100)/110)-1;//根据浏览器的显示宽度计算能展示的菜单数量,logo宽度200加折叠按钮30加用户信息200;
        var moreItem = $('<li class="layui-nav-item" lay-id="more"><a href="javascript:void(0);">更多</a></li>');
        var moreItemDl = $('<dl class="layui-nav-child"></dl>');
        for(var i=0;i<jsonData.length;i++){
            var liObj = new Object();
            if (i>showNum){
                liObj = $('<dd><a href="javascript:void(0);" lay-id="'+jsonData[i].id+'">'+jsonData[i].name+'</a></dd>');
            }else{
                liObj = $('<li class="layui-nav-item" lay-id="'+jsonData[i].id+'"><a href="javascript:void(0);">'+jsonData[i].name+'</a></li>');
            }
            liObj.click(jsonData[i],function(event){
                var menuData = event.data;
                if(menuData!=null){
                    if(menuData.menu.length>0){
                        $('#leftNav').html('');
                        var leftMenuUlObj = $('<ul class="layui-nav layui-nav-tree"  lay-filter="leftNavUl"></ul>');
                        for(var j=0;j<menuData.menu.length;j++){
                            var leftMenuLiObj = $('<li class="layui-nav-item layui-nav-itemed"><a class="" href="javascript:;">'+menuData.menu[j].text+'</a></li>');
                            var leftMenuDlObj = $('<dl class="layui-nav-child"></dl>');
                            if(menuData.menu[j].items.length>0){
                                for(var k=0;k<menuData.menu[j].items.length;k++){
                                    var leftMenuDdObj=$('<dd><a href="javascript:;">'+menuData.menu[j].items[k].text+'</a></dd>');
                                    leftMenuDdObj.click(menuData.menu[j].items[k],function(event){
                                        var tabData = event.data;
                                        var tabFlag = false;
                                        $('.layui-tab-title li').each(function(){
                                            if($(this).attr('lay-id')==tabData.id){
                                                tabFlag = true;
                                            }
                                        });
                                        if(!tabFlag){
                                            element.tabAdd("system_tab",{title:tabData.text,
                                                content:'<iframe src="/'+tabData.href+'" data-id="'+tabData.id+'"></iframe>',
                                                id:tabData.id
                                            });
                                        }
                                        element.tabChange("system_tab", tabData.id);
                                    });
                                    leftMenuDlObj.append(leftMenuDdObj);
                                }
                            }
                            leftMenuLiObj.append(leftMenuDlObj);
                            leftMenuUlObj.append(leftMenuLiObj);
                        }
                        $('#leftNav').append(leftMenuUlObj);
                        element.render('nav','leftNavUl');
                    }else{
                        $('#leftNav').html('');
                    }
                }else{
                    $('#leftNav').html('');
                }
                $(".layui-layout-admin").removeClass("hideLeft");
            });
            if(i>showNum){
                moreItemDl.append(liObj);
            }else{
                ulObj.append(liObj);
            }
        }
        if (showNum<jsonData.length){
            moreItem.append(moreItemDl);
            ulObj.append(moreItem);
        
        }
        $('#topNav').html('');
        $('#topNav').append(ulObj);
    }

    topNav();

    $('.hideButton').click(function(){
        $(".layui-layout-admin").toggleClass("hideLeft");
    });

    $(window).resize(function(){
        topNav();
    })
});