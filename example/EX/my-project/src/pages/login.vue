<template>
  <view class="container">
    <view class="mobile-mockup">
      <view class="login-card">
        <view class="login-title">欢迎回来</view>
        <view class="login-desc">请登录您的账号</view>
        <view class="input-group">
          <text class="input-label">用户名</text>
          <view class="input-wrapper">
            <text class="iconfont icon-user input-icon"></text>
            <input class="input" type="text" v-model="username" placeholder="请输入用户名" placeholder-class="input-placeholder" />
          </view>
        </view>
        <view class="input-group">
          <text class="input-label">密码</text>
          <view class="input-wrapper">
            <text class="iconfont icon-lock input-icon"></text>
            <input :type="showPw ? 'text' : 'password'" class="input" v-model="password" placeholder="请输入密码" placeholder-class="input-placeholder" />
            <text class="iconfont" :class="showPw ? 'icon-eye' : 'icon-eye-off'" @tap="showPw = !showPw"></text>
          </view>
        </view>
        <view class="options-row">
          <label class="remember-me">
            <checkbox :checked="remember" @change="remember = !remember" color="#ff671f" style="transform:scale(0.8)" />
            <text>记住我</text>
          </label>
          <navigator url="/pages/forget/index" class="forgot-link">忘记密码?</navigator>
        </view>
        <button class="login-btn" @tap="onLogin">登 录</button>
        <view class="register-row">
          还没有账号？<navigator url="/pages/register/index" class="register-link">立即注册</navigator>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: '',
      showPw: false,
      remember: false
    }
  },
  methods: {
    onLogin() {
      if (!this.username || !this.password) {
        uni.showToast({ title: '请填写完整的登录信息', icon: 'none' })
        return
      }
      uni.showToast({ title: '登录成功！', icon: 'success' })
      setTimeout(() => {
        uni.reLaunch({ url: '/pages/index/index' })
      }, 500)
      // 这里可补充实际登录逻辑
    }
  }
}
</script>

<style  scoped> 
.container {
  min-height: 100vh;
  background: linear-gradient(135deg, #ffd6b0 0%, #ffb88c 50%, #ff671f 100%);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 40rpx 0;
}
.mobile-mockup {
  width: 90vw;
  max-width: 700rpx;
  min-width: 320rpx;
  height: 1100rpx;
  background: #222;
  border-radius: 48rpx;
  box-shadow: 0 16rpx 64rpx rgba(0,0,0,0.18);
  display: flex;
  align-items: center;
  justify-content: center;
}
.login-card {
  width: 90%;
  padding: 72rpx 36rpx 36rpx 36rpx;
  border-radius: 36rpx;
  background: rgba(255,255,255,0.55);
  box-shadow: 0 16rpx 64rpx rgba(0,0,0,0.10);
  backdrop-filter: blur(24rpx);
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.login-title {
  font-size: 44rpx;
  font-weight: bold;
  color: #222;
  text-align: center;
  margin-bottom: 16rpx;
}
.login-desc {
  color: #666;
  font-size: 28rpx;
  text-align: center;
  margin-bottom: 56rpx;
}
.input-group {
  margin-bottom: 36rpx;
}
.input-label {
  font-size: 26rpx;
  color: #333;
  margin-bottom: 10rpx;
  display: block;
}
.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background: rgba(255,255,255,0.85);
  border-radius: 20rpx;
  box-shadow: 0 4rpx 16rpx rgba(255,103,31,0.06);
}
.input {
  flex: 1;
  padding: 24rpx 60rpx 24rpx 56rpx;
  border: none;
  border-radius: 20rpx;
  background: transparent;
  font-size: 28rpx;
  color: #222;
}
.input-placeholder {
  color: #bbb;
  font-size: 28rpx;
}
.input-icon {
  position: absolute;
  left: 20rpx;
  font-size: 36rpx;
  color: #ff671f;
}
.input-wrapper .iconfont {
  position: absolute;
  right: 20rpx;
  font-size: 36rpx;
  color: #bbb;
}
.input-wrapper .icon-eye {
  color: #ff671f;
}
.options-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 36rpx;
}
.remember-me {
  display: flex;
  align-items: center;
  font-size: 24rpx;
  color: #666;
}
.forgot-link {
  font-size: 24rpx;
  color: #ff671f;
  text-decoration: underline;
}
.login-btn {
  width: 100%;
  padding: 28rpx 0;
  background: linear-gradient(90deg, #ffb88c 0%, #ff671f 100%);
  color: #fff;
  border: none;
  border-radius: 20rpx;
  font-size: 32rpx;
  font-weight: 600;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 16rpx rgba(255,103,31,0.10);
}
.login-btn:active {
  opacity: 0.85;
}
.register-row {
  text-align: center;
  font-size: 24rpx;
  color: #888;
  margin-top: 12rpx;
}
.register-link {
  color: #ff671f;
  margin-left: 8rpx;
  text-decoration: underline;
}
</style> 