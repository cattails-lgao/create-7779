import { ref } from 'vue';
import { SMS_CODE_TMPL } from '@/constants';
import { isMobile } from '@/utils/index';
import { loginGetCode, sendIdentitySms, bindPhoneSendSms, registerGetCode } from '@/api';

// 获取验证码
export function useVerifyCode(tmpl: SMS_CODE_TMPL) {
	const codeDisabled = ref<boolean>(false);
	const codeText = ref<string>('获取验证码');
	const maxTime = 60;
	let s = maxTime;
	let timer: NodeJS.Timeout | number = 0;

	const runCountDown = () => {
		codeText.value = s + '秒';
		function loop() {
			if (s <= 0) {
				clearCountDownTimer();
				return;
			}

			s -= 1;
			codeText.value = s + '秒';

			timer = setTimeout(loop, 1000);
		}
		timer = setTimeout(loop, 1000);
	};

	function clearCountDownTimer() {
		codeDisabled.value = false;
		codeText.value = '获取验证码';
		s = maxTime;
		clearTimeout(Number(timer));
	}

	const sendCode = (phone: string) => {
		if (!phone.trim().length) {
			uni.showToast({ title: '请输入手机号', icon: 'none' });
			return;
		}

		if (!isMobile(phone.trim())) {
			uni.showToast({ title: '请输入正确的手机号', icon: 'none' });
			return;
		}

		codeDisabled.value = true;
		runCountDown();

		let sendRetPromise: Promise<ResponseNameSpace.ResponsDataType<null | boolean>> | undefined;

		switch (tmpl) {
			case SMS_CODE_TMPL.Login:
				sendRetPromise = loginGetCode(phone);
				break;
			case SMS_CODE_TMPL.CheckCode:
				sendRetPromise = sendIdentitySms();
				break;
			case SMS_CODE_TMPL.BindPhone:
				sendRetPromise = bindPhoneSendSms(phone);
				break;
			case SMS_CODE_TMPL.Register:
				sendRetPromise = registerGetCode(phone);
				break;
		}

		if (!sendRetPromise) return;

		sendRetPromise.then(rsp => {
			if (!rsp.data) {
				uni.showToast({ title: rsp.msg, icon: 'none' });
				return;
			}
		});
	};

	return {
		codeDisabled,
		codeText,
		sendCode
	};
}
