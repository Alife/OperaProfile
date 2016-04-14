// ==UserScript==
// Popup of Judge 設定檔(請勿更改檔名)
// @include *
// ==/UserScript==
//
// 功能說明(給新使用者) : 本JS的功能是,當 "彈出視窗" 的 "網域" 與 "當前瀏覽頁面" 的網域(預設為1級網域)不符合時 , 將此 "彈出視窗" 封鎖
//
//
//---------------------------設定---------------------------

var PoJ_Cfg = (function (){

var whiteList = {
// "彈出視窗"的網址特徵的 白名單 + 強制黑名單 (所有被阻擋的視窗,網址會在錯誤主控台顯示)
//
// 注意,這是過濾"彈出視窗"的網址,不是你當前瀏覽頁面的網址
//
// 格式如下( 注意! 新版更動處 ) : 
//
//
// 第 1 種格式[白名單] : 只接受單純輸入域名(一級二級皆可),不可包含斜線,名稱可自己取(注意,名稱開頭不可為數字 例如:3abc),最後面請加逗號
// 名稱:雙引號 域名(一級或二級) 雙引號 逗號
// 範例:
// 		Google:"www.google.com",
//
//
// 第 2 種格式[白名單] : 可使用萬用字元 * 字來做模糊匹配,可包含斜線(但不可包含其他符號,否則將有機率出錯),其他格式同上
// 範例:
// 		test:"http*://*.google*/*",
//		test:"*.com/*.jpg",
//
//
// 第 3 種格式[強制黑名單] : 名稱開頭加一個金錢符號 $ 字,則為黑名單,其他格式同上 ( 注意! 黑名單影響範圍包括本地JS所觸發的彈窗(window.open) )
//
//							 Q:不是自動判斷阻擋的嗎? 為何需要黑名單? 為什麼叫 "強制黑名單" ? 
//
//							 A:如果 "彈出的廣告視窗" 的網域與 "當前瀏覽頁面" 相同的話
//							   你必須將此廣告視窗的網址"特徵"加入到強制黑名單才有辦法阻擋!
//
//							 Q:黑名單影響範圍包括本地JS的彈窗是什麼意思?
//							 
//							 A:例如你用 Snap-Links 這個 UserJS 去開啟黑名單裡的網站 , 一樣會阻擋下來
//							   (我想你不會這麼做吧?......會的話..........................只好請你修正黑名單,或者先暫時停用這個JS = =" )
//
//								PS.它的判斷模式與 UserJS的exclude 一樣是先判斷黑名單後判斷白名單
//								舉例假設你的黑名單有 *abc*com 白名單有 abc.com
//								這種情況它判斷到黑名單就會直接封鎖,不會再去判斷白名單
// 範例:
//		$xun6:"*xun6.*/pop*",
//
//--------------------------------請輸入到本線以下--------------------------------------
//
//黑名單:

$blank:"about:blank", //  <--- (有些網站會拿來做廣告轉向 , 如果有與你使用的本地JS衝突再把它刪除)
$xun6:"*xun6.*/pop*",


//白名單:

Google:"www.google.com",
HotMail:"*mail.live.com*",




};


var block_ALL = false ;
// 阻擋模式,預設是判斷 "當前瀏覽網站" 與 "彈出視窗" 的網域後阻擋,設為true則全部阻擋(但白名單依然有效) , 
// PS: 一般是當不使用 @include http* 時,再開啟(設為true),並搭配白名單使用

var host_Level = 1 ;
// 要匹配的"當前瀏覽網站"的域名層級設定,預設是一級域名,若設定非1則匹配整個域名,( 如 : www.abc.com 的一級域名為 abc.com )
// ( 無特殊需求不需更動 )

var NoHref_Block = true ;
// 阻擋一些無網址的彈窗(有些網站會開啟一個空白視窗並加以控制轉向到廣告),預設開啟,不影響 BookMarklets 與一些開頭為 "javascript:" 的本地JS
// ( 無特殊需求不需更動 )

var Js_src_wList = 
	new RegExp(("(google(apis|-analytics|syndication)?\.com|gstatic\.com|ext-core|"+
	"mootools|jquery|swfobject|yui(-min)?\.js$|dojo\.xd\.js|prototype\.js$|ajax\.js$|bbcode|"+
	"langconv\.js$|include\/(js|javascript)\/common\.js)"
	).replace(/\./g,"\\."),"i");
//
// 這是用來比對外連的JS Src(為了避免與本地Opera的JS衝突)排除用的白名單
// 如果你知道or你常上的網站有特定JS Src是安全的 (無彈出視窗廣告)
// 你可以把該JS的Src特徵或整個Src加入到此 RegExp (可多少增加一點效能)
// 若這邊講的看不懂或不會RegExp也沒關係 , 只是相對的會稍微多佔一點效能而已
// (除非有JS寫的很變態的網站,否則你可能也沒感覺)
//
//
//
//--------------------以下為提示小圖示設定--------------------

var show_ico = true ;
// 開啟圖示提醒功能

var timeout = 3 ;
// 圖示停留時間(秒)

var i_pos = 1 ;
// 圖示位置 : [1] 左上 , [2] 右上 , [3] 右下 , [4] 左下

var icon =
		"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG	9iZSBJbWFnZVJlYWR5ccllPAAAAlpJREFUeNqkU8tu2lAQHT8wtlEQcUKUIjVVgaiCVkhIlSq1isSKTdRNuu5P8AX5Alb	9g+6zqZR8QNWmC3ZRa1UJIm0hAWpeNthg/OiMechl00UtHXvuvXPOnbn3mPF9H/7n4en1nmGAwy+BAUghTjB8iThY5v1E	fMatzhB3Lg4Ib3FzfkPwdUSSKulCIZs6PFSkeFykCi1dL95dXx81rq7e2JZVxbwPf1WwIkuJxOmL4+Ocz/PSzHHgvtEIF	hRFkfdzOTmZTu/ULi5OJ6MRrERYemFZKU4UK8VyOTcyTWk4HEKr1YLC+XkAimluPJ1Kz0qlHBuNVoizFsB+Tg7y+ezAMK	QRqhuGAaZprkujmOZ0XQcDRfYymay7OKdFCw7Aq61kUtH6/TVpPB5Dp9MJSLfYiue6i555Hna3txXi4PDdSuChx7Kig32	78zkYgwGYkwk0m02IRCLA4jy3Usb1qWmKxAlXAA4u2FQ6VuHjbhGcI3IsFgNh47Q5zHXCtzAH+GV0u0Vf02QpZCy1VAq+	8Y27ntv2lDjrQ0S1T912u7eF/ck4lheGgpKqQrleD2I5BN2y+sQJC5zd9np1YFlLRldSUhQhCEKwYzRE9jzPas9mN8RZC	3hoz4nrVi81TcUFS0KRJM5/yWQCUCwhbCTXxmPV9LwqcYjLkFUZJDzCwXN042OWreQEIftEEJQEx4mUNHTd6Xfb7qu2fd	NAcg1d+IMMSNylAB3mDmIX7bWfBzjaA3iKV/dgabT7LsDXbwAfcVsM4TdCQ66zEmBDbfL/+IPJURMyKHK9PwIMAA7iHkoee771AAAAAElFTkSuQmCC";
		
// base64圖示檔

//--------------------以下為顯示介面設定--------------------

var show_allow = true ; 
// 是否顯示已允許項目

var sort = 1 ; 
// 排序方式 : [0] 新項目向下遞增 , [1] 新項目向上遞增

var top = 25 ;
// 預設位置(top) , (單位px)

var left = 25 ;
// 預設位置(left) , (單位px)

var max_w = 450 ; 
// 最大寬度 (px)

var max_h = 500 ; 
// 最大高度 (px)

//---------------------------設定結束---------------------------

return {
			whiteList:whiteList,
			block_ALL:block_ALL,
			host_Level:host_Level,
			NoHref_Block:NoHref_Block,
			Js_src_wList:Js_src_wList,
			show_ico:show_ico,
			timeout:timeout,
			icon:icon,
			i_pos:i_pos,
			max_w:max_w,
			max_h:max_h,
			show_allow:show_allow,
			sort:sort,
			top:top,
			left:left
		}
})();