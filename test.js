<!doctype html>
<html lang="zh-CN">
	<head>
	<meta charset="UTF-8">
	<title>华天旅游网：用户注册</title>
<!--http://www.htyou.com/common/temp/temp.html-->
<script src="http://www.htyou.com/common/jquery-1.11.0.min.js" charset="utf-8"></script>
	<script>
	//点击发送短信验证码的处理
	(function($) {
		var status = false;
		$(document).delegate('#sendSms', 'click', function (result) {
			//如果电话号码栏目不合规范则不发送
			if ($('#phone').val() != $('#phone').val().match(/^1[0-9]{10}$/)) {
				alert('手机号码错误，请修改后重新发送');
				return false;
			}
			var intervalid = null;
			if ($('#sendSms').val() != '发送验证码') {
				return false;
			}
			$('#sendSms').val('60');//设置60秒间隔
			intervalid = setInterval(function () {
				if (parseInt($('#sendSms').val()) > 0) {
					$('#sendSms').val(parseInt($('#sendSms').val()) - 1);
				} else {
					$('#sendSms').val('发送验证码');
					clearInterval(intervalid);
				}
			}, 1000);
			$.getJSON('http://www.htyou.com/user/htuser_sendSmsConfirm.action?phone=13762338415',function(result){
				if (result.status=='false'){
					alert('验证码发送失败，请稍后尝试');
				}
			});

		});
	})($);
//注册流程
//点击注册按钮执行的操作
(function ($) {
	$(document).delegate('#regBtn', 'click', function () {
		//先检查用户表单是否完整
		if ( $('#username').val()=='' || $('#password').val()=='' || $('#repassword').val()=='' || $('#phone').val()=='' || $('#checkcode').val()=='' || $('#idcard').val()==''){
			alert('您的资料填写不完整，请补充完整后重新提交');
			return false;
		}
		if ($('#username').val().length<5){
			alert('用户帐号太短，请至少有5个字符长');
			return false;
		}
		if ($('#password').val().length<6){
			alert('密码太短，请至少有6个字符长');
			return false;
		}
		if ($('#password').val()!=$('#repassword').val()){
			alert('两次密码输入不一致，请检查');
			return false;
		}


		//验证用户验证码是否正确
		//alert('/user/htuser_getSmsConfirm.action?phone=' + $('#phone').val() + '&vaildcode=' + $('#checkcode').val());
		$.getJSON('/user/htuser_getSmsConfirm.action?phone=' + $('#phone').val() + '&vaildcode=' + $('#checkcode').val(), function (result) {
			if (result.status == 1) {
				//验证用户两次密码是否一致
				if ($('#password').val() != $('#repassword').val()) {
					$('#password').val('');
					$('#repassword').val('');
					alert('您两次输入的密码不一致，请重新填写再提交');
					return false;
				}
				//验证用户输入的account：5～32个字符长度，不能是中文
				if ($('#username').val().match(/^[a-zA-Z]{1}[a-zA-Z0-9]{4,31}$/)==null){
					alert('您的帐户名称必须用英文字母开头，并且只使用英文字符和数字，长度应该在5～32个字符之间');
					return false;
				}

				//提交用户注册信息到注册接口
				//20160316 曹熙要求把username参数改成account提交
				//PC端注册的info_type是info_type=120605
				var regPort =	'/user/htuser_register.action?info_type=120605'
								+'&identifyId=' + $('#idcard').val()+
								+'&phone=' + $('#phone').val()+
								+'&account=' + $('#username').val()+
								+'&password=' + $('#password').val()+
								+'&openid=' + $('#openid').val()+
								+'&accesstoken=' + $('#accesstoken').val();
				//alert(regPort);
				$.getJSON(regPort, function(result){
					if (result.status==0){
						alert('注册异常失败');
						return false;
					}
					if (result.status==-1){
						alert('用户填写手机信息不正确或者已存在，请重新填写！');
						return false;
					}
					if (result.status==-2){
						alert('用户身份证信息不规范或者已存在，请重新填写！');
						return false;
					}
					if (result.status==1){
						alert('注册成功！系统将自动跳转到首页！');
						window.localStorage.setItem('USER_DATA', JSON.stringify(result.guestVO));
						window.location.href = 'index.html';
					}
				});

			}
			if (result.status == 0) {
				alert('您的验证码错误，请重新获取验证码后再尝试。')
			}
		});
		//验证码正确后在提交注册
		//验证码不正确则
		return false;
	});
})($);
</script>
</head>
<body>
<form action="">
	用户帐号：<input type="text" name="username" id="username" placeholder="请输入您的账号"><br>
	用户密码：<input type="text" name="password" id="password" placeholder="请输入对应的密码"><br>
	密码验证：<input type="text" name="repassword" id="repassword" placeholder="再次输入密码"><br>
	手机号码：<input type="text" name="phone" id="phone" placeholder="请输入您的手机号码"><input type="button" value="发送验证码" id="sendSms"><br>
	验证短信：<input type="text" name="checkcode" id="checkcode" placeholder="请输入验证码"><br>
	身份证号：<input type="text" name="idcard" id="idcard" placeholder="请输入您的身份证号码"><br>
	<input type="button" value="注册" id="regBtn">
	</form>
	</body>
	</html>