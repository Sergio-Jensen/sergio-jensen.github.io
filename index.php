
<!DOCTYPE html>
<html lang="en">

<head>
    <!-- <meta name="author" content="中国企业互联网思维传递者-东方网景 http://www.east.com.cn/">
    <meta name="version" content="Touch Site V4.0.1(R2) (2018.4.25) ">
    <meta name="copyright" content="copyright© 1996-2024 east.net(china)co.,ltd.all rights reserved."> -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0">
    <meta name="keywords" content="刘宏松,刘宏松课题组,Hongsong Liu,Hongsong Liu Research Group" />
    <meta name="description" content="刘宏松,刘宏松课题组" />
    <title>Hongsong Liu Research Group</title>
    <link rel="stylesheet" href="./css/base.css">
    <link rel="stylesheet" href="./css/swiper.css">
    <link rel="stylesheet" href="./css/common.css">
    <link rel="stylesheet" href="./css/index.css">
    <link rel="stylesheet" href="./css/fullPage.css">
    <script src="./js/jquery.js"></script>
    <script src="./js/swiper.js"></script>
    <script src="./js/common.js"></script>

    <style>
        #box {
            transition: all 1000ms cubic-bezier(0.86, 0, 0.07, 1);
            -webkit-transition: all 1000ms cubic-bezier(0.86, 0, 0.07, 1);
        }

        @media only screen and (min-width: 1350px) and (max-width: 1921px) {
            #box.bottom {
                transform: translate3d(0px, -228px, 0px);
                -webkit-transform: translate3d(0px, -228px, 0px);
            }
        }
    </style>

</head>

<body>
    <div class="body" id="box">
        <div id="fullPage" class="fullpage-wrapper">
            <div class="Ban section">
                <!--PCbanner-->
                <div class="bannerImg1"><img src="./assets/background.jpg" alt="" /></div>
                <!--手机banner-->
                <div class="bannerImg2"><img src="./assets/background2.jpg" alt="" /></div>
                <div class="banWord">
                    <h1><span style="font-family: 'enAD';">HONGSONG LIU<br>RESEARCH GROUP</span></h1>
                    <p>
<br />
<span style="font-weight: lighter; font-size: 16px;">刘宏松课题组<br>
<strong>@ Shanghai Jiao Tong University</strong></span> <br /><br/>
<span style="font-weight: bold;color: rgb(100, 100,100);font-size: 16px;">International Organization<br />
Global Governance<br />
China's Diplomacy</strong></span><br />
</p></div>

<div class="banWord2">
    <h1><span style="font-family: 'enAD';">HONGSONG<br>LIU<br>RESEARCH<br>GROUP</span></h1>
    <p>
<br />
<span style="font-weight: lighter; font-size: 14px;color: rgb(150, 150,150);">刘宏松课题组<br>
<strong>@ Shanghai Jiao Tong University</strong></span> <br /><br/>
<span style="font-weight: bold;color: rgb(150, 150,150);font-size: 14px;">International Organization<br />
Global Governance<br />
China's Diplomacy</strong></span><br />
</p></div>
                <a href="javascript:;" class="icon"></a>
            </div>
            
            <div class="LunBo section section2">
                <div class="header">
                    <span class="classname">Homepage</span>
                    <ul class="clear">
                        <li class="active"><a href="index.html">Homepage</a></li>
                        
                        <li><a href="cv.html">Curriculum Vitae</a></li>
                        
                        <!-- <li><a href="http://www.zxx-lab.com/class/2">Research</a></li> -->
                        
                        <li><a href="publications.html">Publications</a></li>
                        
                        <li><a href="people.html">Staff</a></li>
                        
                        <!-- <li><a href="http://www.zxx-lab.com/class/5">News</a></li>
                        
                        <li><a href="http://www.zxx-lab.com/class/6">Pictures</a></li> -->
                        
                        <li><a href="job.html">Recruitment</a></li>
                        
                    </ul>
                    <a href="javascript:;" class="open"></a>
                </div>
                <div class="swiper-container">
                    <div class="swiper-wrapper">
                        
                        <div class="swiper-slide"><img src="./assets/cover_ael.jpg" alt="刘宏松课题组网站" title="刘宏松课题组网站"></div>
                        
                        <div class="swiper-slide"><img src="./assets/cover_esg.jpg" alt="刘宏松课题组网站" title="刘宏松课题组网站"></div>
                        
                        <div class="swiper-slide"><img src="./assets/cover_ins.jpg" alt="刘宏松课题组网站" title="刘宏松课题组网站"></div>
                        
                        
                    </div>
                    <div class="swiper-button-prev"><</div>
                    <div class="swiper-button-next">></div>
                </div>
                <div class="footer">
                    <ul id="myParagraph"></ul>
                <p class="Visits">Visits</p>
                <div class="copyright">All rights reserved by Hongsong Liu<a style="color:#171717;"> </a></div>
            </div>
            </div>
           

        </div>
    </div>
</body>
<script src="./js/index.js"></script>
<script type="text/javascript" src="./js/fullPage.js"></script>

<script>
    var n = <?php $servername = "127.0.0.1";$username = "root";
        $password = "KaenPhi...54";$dbname = "website_stats";
// 创建连接
        $conn = new mysqli($servername, $username, $password, $dbname);
// 检查连接
        if ($conn->connect_error) {die("连接失败: " . $conn->connect_error);}
// 更新浏览次数
        $sql = "UPDATE page_views SET views = views + 1 WHERE id = 1";$conn->query($sql);
// 获取当前浏览次数
        $sql = "SELECT views FROM page_views WHERE id = 1";$result = $conn->query($sql);
        $row = $result->fetch_assoc();echo $row["views"];$conn->close();?>;
    var relations = ("" + n).split("");
    var temp = "";
        if (relations != "") {
            for (var i = 0; i < relations.length; i++) {
                temp += '<li class="number-add">' + relations[i] + '</li>';
            }}
    document.getElementById("myParagraph").innerHTML = temp

    var swiper = new Swiper('.swiper-container', {
        spaceBetween: 30,
        centeredSlides: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });

    var height = $(window).height();
    var width = $(window).width();
    $(".Ban .icon").click(function() {
        $("html,body").animate({
            scrollTop: 0
        }, 1000);
        window.location.href="index.html/#page2";
    });


    $(function() {
        var timer;
        var flag = true;

        function lock() {
            clearTimeout(timer);
            flag = false;
            timer = setTimeout(function() {
                flag = true;
            }, 200);
        }

        function auto1() {
            $('#fullPage').fullpage({
                anchors: ['page1', 'page2'],
                normalScrollElements: '.scrollable-element',
                //loopBottom: true,
                //loopTop: true,
                onLeave: function(index, nextIndex, direction) {
                    var box = $("#box");
                    console.log(nextIndex);
                    // 底部
                    if (index === 2 && nextIndex === 1) {
                        //box.addClass("bottom");
                        //return false;
                    }else if(index===2 && nextIndex===1 && box.hasClass("bottom")){
                        //box.removeClass("bottom");
                        //lock();
                        //return false;
                    }
                    // 返回事件阻塞
                    return flag
                }
            });
        }

        auto1();
    })
</script>

</html>
