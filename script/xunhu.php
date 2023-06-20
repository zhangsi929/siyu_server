
<!-- HASH生成的步骤如下：
第一步，设所有发送或者接收到的数据为集合M，将集合M内非空参数值的参数按照参数名ASCII码从小到大排序（字典序），使用URL键值对的格式（即key1=value1&key2=value2…）拼接成字符串stringA。

特别注意以下重要规则：

◆ 参数名ASCII码从小到大排序（字典序）；
◆ 如果参数的值为空不参与签名；
◆ 参数名区分大小写；
◆ 验证调用返回或微信主动通知签名时，传送的hash参数不参与签名，将生成的签名与该hash值作校验。
◆ 微信接口可能增加字段，验证签名时必须支持增加的扩展字段
第二步，在stringA最后拼接上APPSECRET得到stringSignTemp字符串，并对stringSignTemp进行MD5运算，得到hash值（32位小写）。 -->
<?php
date_default_timezone_set('UTC');
/**
 * 获取精确到秒的时间戳
 */
function getSecondTimestamp($date = null) {
    if ($date == null) {
        $date = time();
    }
    // 获取精确到秒的时间戳
    $timestamp = intval($date);
    return $timestamp;
}

function generate_xh_hash(array $datas,$hashkey){
 
 					ksort($datas);
                    reset($datas);
                    $arg  = '';
                    foreach ($datas as $key=>$val){
                    	if($key=='hash'||is_null($val)||$val===''){continue;}
                   	    if($arg){$arg.='&';}
                        $arg.="$key=$val";
                    }

                    echo "拼接的字符串是: " . $arg . $hashkey . "\n";


                    return md5($arg.$hashkey);
}

// 配置你的APPID
$appid = "201906125482";

// 设置参数
$options = array(
    // 设置版本号
    "version" => "1.1",

    // 设置 appid
    "appid" => $appid,

    // 订单号 具体内容自己控制 长度 32位
    "trade_order_id" => "22",

    // 价格价格 精确到分
    "total_fee" => "0.01",

    // 标题
    "title" => "test",

    // 当前时间戳
    "time" => 1687040805,

    // notify_url 回调地址
    "notify_url" => "https://eozlweyfo3w7zin.m.pipedream.net",

    // nonce_str  随机值 32位内
    "nonce_str" => "740969606"
);

$appsecret = "fdd71ac173dd532750533d4859449d4b";

$hash = generate_xh_hash($options, $appsecret);
$options["hash"] = $hash;

echo "我们生成的Hash 是：", $hash, "\n";
echo "我们生成的time 是:", $options["time"], "\n";

// 创建一个新 cURL 资源
$ch = curl_init();

// $url = ""https://api.xunhupay.com/payment/do.html""
// $url = "https://api.diypc.com.cn/payment/do.html"
// 设置 URL 和相应的选项
curl_setopt($ch, CURLOPT_URL, "https://api.diypc.com.cn/payment/do.html");
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($options));
curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type:application/json'));

// 抓取 URL 并把它传递给浏览器
$response = curl_exec($ch);

// 检查是否有错误发生
if(curl_errno($ch)){
    echo 'Curl error: ' . curl_error($ch);
}

// 关闭 cURL 资源，并且释放系统资源
curl_close($ch);

echo "Response: ", $response;
?>






