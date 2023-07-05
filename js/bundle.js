! function() {
	"use strict";

	function __awaiter(t, e, i, s) {
		return new(i || (i = Promise))(function(n, a) {
			function fulfilled(t) {
				try {
					step(s.next(t))
				} catch (t) {
					a(t)
				}
			}

			function rejected(t) {
				try {
					step(s.throw(t))
				} catch (t) {
					a(t)
				}
			}

			function step(t) {
				t.done ? n(t.value) : new i(function(e) {
					e(t.value)
				}).then(fulfilled, rejected)
			}
			step((s = s.apply(t, e || [])).next())
		})
	}
	const t = 3,
		e = 3,
		i = 1;
	var s, n;

	function waitTimeSecond(t, e) {
		return __awaiter(this, void 0, void 0, function*() {
			return new Promise((i, s) => {
				setTimeout(() => {
					try {
						e && e(), i()
					} catch (t) {
						s(t)
					}
				}, 1e3 * t)
			})
		})
	}! function(t) {
		t[t.INTERSTITIAL = 0] = "INTERSTITIAL", t[t.REWARDED_VIDEO = 1] = "REWARDED_VIDEO", t[t.BANNER = 2] = "BANNER"
	}(s || (s = {})),
	function(t) {
		t[t.NONE = 0] = "NONE", t[t.NEW = 1] = "NEW", t[t.LOADING = 2] = "LOADING", t[t.LOADED = 3] = "LOADED", t[t.PLAYING = 4] = "PLAYING"
	}(n || (n = {}));
	const a = {
			code: "EXCEED_MAX_AD_INSTANCE",
			message: "Max AD Instance allowed: " + t
		},
		l = {
			code: "NO_READY_AD_INSTANCE",
			message: "AD Instance Not Ready or Played too frequently"
		},
		o = {
			code: "NOT_READY_FOR_LOAD",
			message: "Not Ready for Load"
		},
		h = {
			code: "AD_IS_LOADING",
			message: "AD is Loading"
		},
		r = {
			code: "NOT_READY_FOR_PLAYING",
			message: "Not Ready for Playing"
		},
		_ = {
			code: "AD_IS_PLAYING",
			message: "AD is Playing"
		},
		d = {
			code: "NO_BANNER_AD",
			message: "No Banner Ad Instance"
		},
		c = {
			code: "API_NOT_SUPPORT",
			message: "API Not Support"
		},
		u = {
			code: "TOO_FAST_SHOW",
			message: "Too Fast To Show Ads"
		},
		p = {
			code: "NOT_PLAYING",
			message: "Ads Not Playing"
		},
		g = {
			code: "TOO_MANY_ERRORS",
			message: "Too Many Errors, Stop Next Action"
		},
		m = "loadBannerAdAsync",
		I = "RATE_LIMITED",
		f = "ADS_NO_FILL";

	function getOption(t, e, i) {
		return t && void 0 !== t[e] ? t[e] : i
	}
	class y {
		constructor(t, e) {
			this._lastShowTime = 0, this._refreshInterval = 0, this._refreshInterval = t > 0 ? t : 0, this._lastShowTime = 0, e > 0 && (this._lastShowTime = Date.now() + 1e3 * e - 1e3 * this._refreshInterval)
		}
		isReadyToRefresh() {
			return this.getNextRefreshInterval() <= 0
		}
		getNextRefreshInterval() {
			let t = 0;
			if (this._refreshInterval > 0 && this._lastShowTime > 0) {
				let e = Date.now();
				t = this._refreshInterval - (e - this._lastShowTime) / 1e3
			}
			return t
		}
		updateLastShowTime() {
			this._lastShowTime = Date.now()
		}
	}
	class b {
		constructor(t, e, i, s) {
			this._maxLoadError = 0, this._errorCounter = 0, this._fatalError = !1, this._sharedTimer = null, this._adId = t, this._state = n.NONE, this._type = e, this._sharedTimer = i, this._fatalError = !1, console.assert(!!i, "sharedTimer is invalid", i), this._maxLoadError = getOption(s, "maxLoadError", 0)
		}
		getStateName() {
			return function(t) {
				let e = "NONE";
				switch (t) {
					case n.NEW:
						e = "NEW";
						break;
					case n.LOADING:
						e = "LOADING";
						break;
					case n.LOADED:
						e = "LOADED";
						break;
					case n.PLAYING:
						e = "PLAYING"
				}
				return e
			}(this._state)
		}
		getAdTypeName() {
			return this._type == s.INTERSTITIAL ? "Interstitial" : this._type == s.REWARDED_VIDEO ? "RewardedVideo" : this._type == s.BANNER ? "Banner" : "UNKNOWN"
		}
		getInfo() {
			return `[${this.getAdTypeName()}:${this._adId}:${this.getStateName()}]`
		}
		isReadyToRefresh() {
			return this._sharedTimer.isReadyToRefresh()
		}
		getNextRefreshInterval() {
			return this._sharedTimer.getNextRefreshInterval()
		}
		updateLastShowTime() {
			this._sharedTimer.updateLastShowTime()
		}
		increaseErrorCounter() {
			this._errorCounter++
		}
		resetErrorCounter() {
			this._errorCounter = 0
		}
		setFatalError() {
			this._fatalError = !0
		}
		isErrorTooMany() {
			return this._fatalError || this._maxLoadError > 0 && this._errorCounter >= this._maxLoadError
		}
	}
	class A extends b {
		constructor(t, e, i, s) {
			super(t, e, i, s), this._adInstance = null, this._autoLoadOnPlay = getOption(s, "autoLoadOnPlay", !1)
		}
		loadAsync() {
			return __awaiter(this, void 0, void 0, function*() {
				if (null == this._adInstance) {
					if (this._state != n.NONE) return void console.log("Ad Instance is still creating: " + this.getInfo());
					this._state = n.NEW, console.log("Get Ad Instance: " + this.getInfo()), this._adInstance = yield this.createAdInstanceAsync(this._adId)
				}
				if (this._state != n.NEW) throw console.log("Not ready for preload: " + this.getInfo()), this._state == n.LOADING ? (console.log("Ad is loading, do not reload" + this.getInfo()), h) : o;
				if (this.isErrorTooMany()) throw console.log("Too many errors, stop loading: " + this.getInfo()), g;
				try {
					return this._state = n.LOADING, console.log("Start Loading: " + this.getInfo()), yield this._adInstance.loadAsync(), this._state = n.LOADED, this.resetErrorCounter(), console.log("Loading Success: " + this.getInfo()), !0
				} catch (t) {
					if (console.error("Loading Failed: " + this.getInfo(), t), t.code == f) console.error("Ads Not Fill, stop loading: " + this.getInfo()), this.setFatalError();
					else {
						this.increaseErrorCounter(), this._state = n.NEW;
						let t = 10 * this._errorCounter + i;
						console.log("Reload after " + t + " seconds: " + this.getInfo()), waitTimeSecond(t, this.loadAsync.bind(this)).catch(t => {
							console.info("Reload failed: " + this.getInfo(), t)
						})
					}
					throw t
				}
			})
		}
		isReady() {
			return null != this._adInstance && this._state == n.LOADED
		}
		showAsync() {
			return __awaiter(this, void 0, void 0, function*() {
				if (!this.isReady()) throw console.log("Not Ready for play: " + this.getInfo()), this._state == n.PLAYING ? _ : r;
				if (!this.isReadyToRefresh()) throw console.log("Play too frequently, wait for " + this.getNextRefreshInterval() + " seconds: " + this.getInfo()), u;
				try {
					return this._state = n.PLAYING, console.log("Play Ads: " + this.getInfo()), yield this._adInstance.showAsync(), console.log("Play Success: " + this.getInfo()), this._adInstance = null, this._state = n.NONE, this.updateLastShowTime(), this._autoLoadOnPlay && (console.log("Reload after " + i + " seconds: " + this.getInfo()), waitTimeSecond(i, this.loadAsync.bind(this)).catch(t => {
						console.info("Reload failed: " + this.getInfo(), t)
					})), !0
				} catch (t) {
					throw console.log("Play Failed: " + this.getInfo(), t), t.code == I ? this._state = n.LOADED : (this._adInstance = null, this._state = n.NONE, this._autoLoadOnPlay && (console.log("Reload after " + i + " seconds: " + this.getInfo()), waitTimeSecond(i, this.loadAsync.bind(this)).catch(t => {
						console.info("Reload Failed: " + this.getInfo(), t)
					}))), t
				}
			})
		}
	}
	class S extends A {
		constructor(t, e, i) {
			super(t, s.INTERSTITIAL, e, i)
		}
		createAdInstanceAsync(t) {
			return __awaiter(this, void 0, void 0, function*() {
				return yield FBInstant.getInterstitialAdAsync(this._adId)
			})
		}
	}
	class v extends A {
		constructor(t, e, i) {
			super(t, s.REWARDED_VIDEO, e, i)
		}
		createAdInstanceAsync(t) {
			return __awaiter(this, void 0, void 0, function*() {
				return yield FBInstant.getRewardedVideoAsync(this._adId)
			})
		}
	}
	class T extends b {
		constructor(t, e, i) {
			super(t, s.BANNER, e, i)
		}
		showAsync() {
			return __awaiter(this, void 0, void 0, function*() {
				if (!this.isReadyToRefresh()) throw console.log("Play too frequently, wait for " + this.getNextRefreshInterval() + " seconds: " + this.getInfo()), u;
				if (this.isErrorTooMany()) throw console.log("Too many errors, stop: " + this.getInfo()), g;
				if (this._state == n.LOADING) throw console.info("Banner is loading, wait for it: " + this.getInfo()), h;
				try {
					this._state = n.LOADING, console.log("Show Banner: " + this.getInfo()), yield FBInstant.loadBannerAdAsync(this._adId), this._state = n.PLAYING, console.log("Show Banner Success: " + this.getInfo()), this.updateLastShowTime(), this.resetErrorCounter()
				} catch (t) {
					throw console.error("Show Banner Failed: " + this.getInfo(), t), t.code == I ? this._state = n.NONE : t.code == f ? (console.error("Ads Not Fill, Stop: " + this.getInfo()), this.setFatalError()) : (this.increaseErrorCounter(), this._state = n.NONE), t
				}
			})
		}
		hideAsync() {
			return __awaiter(this, void 0, void 0, function*() {
				if (this._state != n.PLAYING) throw console.log("No Banner Playing: " + this.getInfo()), p;
				try {
					console.log("Hide Banner: " + this.getInfo()), yield FBInstant.hideBannerAdAsync(), this._state = n.NONE
				} catch (t) {
					throw console.error("Hide Banner Failed: " + this.getInfo(), t), t
				}
			})
		}
	}
	class L {
		static getVersion() {
			return "1.0.4"
		}
		static addInterstitial(i, s = e) {
			null == this._interstitialTimer && (this._interstitialTimer = new y(this.defaultInterstitialTimerOption.refreshInterval, this.defaultInterstitialTimerOption.delayForFirstAd));
			for (let e = 0; e < s; e++) {
				if (this._interstitialAds.length >= t) throw console.log("Fail to add interstitial, too many instances: " + this._interstitialAds.length, i), a;
				let e = new S(i, this._interstitialTimer, this.defaultInterstitialOption);
				this._interstitialAds.push(e), console.log("Add Interstitial: " + i, "count: " + this._interstitialAds.length)
			}
			return this._interstitialAds.length
		}
		static addRewardedVideo(i, s = e) {
			null == this._rewardedVideoTimer && (this._rewardedVideoTimer = new y(this.defaultRewardedVideoTimerOption.refreshInterval, this.defaultRewardedVideoTimerOption.delayForFirstAd));
			for (let e = 0; e < s; e++) {
				if (this._rewardedVideos.length >= t) throw console.log("Fail to add RewardedVideo, too many instances: " + this._rewardedVideos.length, i), a;
				let e = new v(i, this._rewardedVideoTimer, this.defaultRewardedVideoOption);
				this._rewardedVideos.push(e), console.log("Add RewardedVideo: " + i, "count: " + this._rewardedVideos.length)
			}
			return this._rewardedVideos.length
		}
		static addBanner(t) {
			null == this._bannerTimer && (this._bannerTimer = new y(this.defaultBannerTimerOption.refreshInterval, this.defaultBannerTimerOption.delayForFirstAd));
			let e = new T(t, this._bannerTimer, this.defaultBannerOption);
			return this._banners.push(e), console.log("Add Banner: " + t, "count: " + this._banners.length), e
		}
		static loadAll() {
			return __awaiter(this, void 0, void 0, function*() {
				return yield this.loadAllAsync()
			})
		}
		static loadAllAsync() {
			return __awaiter(this, void 0, void 0, function*() {
				console.log("FBAdManager Version: " + this.getVersion()), console.log("Init Ads Queue");
				for (let t = 0; t < this._rewardedVideos.length; t++) {
					const e = this._rewardedVideos[t];
					t > 0 && (yield waitTimeSecond(.1));
					try {
						yield e.loadAsync()
					} catch (t) {}
				}
				for (let t = 0; t < this._interstitialAds.length; t++) {
					const e = this._interstitialAds[t];
					t > 0 && (yield waitTimeSecond(.1));
					try {
						yield e.loadAsync()
					} catch (t) {}
				}
			})
		}
		static _isAdReady(t) {
			let e = t == s.INTERSTITIAL ? this._interstitialAds : this._rewardedVideos,
				i = !1;
			for (let t = 0; t < e.length; t++) {
				const s = e[t];
				if (s.isReady() && s.isReadyToRefresh()) {
					i = !0;
					break
				}
			}
			return i
		}
		static _showAsync(t) {
			let e = t == s.INTERSTITIAL ? this._interstitialAds : this._rewardedVideos,
				i = null;
			for (let t = 0; t < e.length; t++) {
				const s = e[t];
				if (s.isReady() && s.isReadyToRefresh()) {
					i = s;
					break
				}
			}
			if (null != i) return i.showAsync();
			throw l
		}
		static _getAdTimer(t) {
			return t == s.INTERSTITIAL ? this._interstitialTimer : t == s.REWARDED_VIDEO ? this._rewardedVideoTimer : this._bannerTimer
		}
		static isInterstitialAdReady() {
			return this._isAdReady(s.INTERSTITIAL)
		}
		static showInterstitialAd() {
			return __awaiter(this, void 0, void 0, function*() {
				return yield this._showAsync(s.INTERSTITIAL)
			})
		}
		static isRewardedVideoReady() {
			return this._isAdReady(s.REWARDED_VIDEO)
		}
		static showRewardedVideo() {
			return __awaiter(this, void 0, void 0, function*() {
				return yield this._showAsync(s.REWARDED_VIDEO)
			})
		}
		static checkApiSupport(t) {
			return FBInstant.getSupportedAPIs().indexOf(t) >= 0
		}
		static isBannerSupport() {
			return void 0 === this._bannerSupport && (this._bannerSupport = this.checkApiSupport(m)), this._bannerSupport
		}
		static isBannerReady() {
			if (this._banners.length <= 0) throw d;
			return this._banners[0].isReadyToRefresh()
		}
		static showBannerAsync() {
			return __awaiter(this, void 0, void 0, function*() {
				if (!this.isBannerSupport()) throw c;
				if (this._banners.length <= 0) throw d;
				let t = this._banners[0];
				return yield t.showAsync()
			})
		}
		static hideBannerAsync() {
			return __awaiter(this, void 0, void 0, function*() {
				if (!this.isBannerSupport()) throw c;
				if (this._banners.length <= 0) throw d;
				let t = this._banners[0];
				return yield t.hideAsync()
			})
		}
	}
	L._interstitialAds = [], L._rewardedVideos = [], L._banners = [], L._interstitialTimer = null, L._rewardedVideoTimer = null, L._bannerTimer = null, L._bannerSupport = void 0, L.defaultInterstitialOption = {
		autoLoadOnPlay: !0,
		maxLoadError: 3
	}, L.defaultRewardedVideoOption = {
		autoLoadOnPlay: !0,
		maxLoadError: 3
	}, L.defaultBannerOption = {
		autoLoadOnPlay: !0,
		maxLoadError: 1
	}, L.defaultInterstitialTimerOption = {
		refreshInterval: 40,
		delayForFirstAd: 30
	}, L.defaultRewardedVideoTimerOption = {
		refreshInterval: 0,
		delayForFirstAd: 0
	}, L.defaultBannerTimerOption = {
		refreshInterval: 40,
		delayForFirstAd: 0
	};
	class E {
		constructor() {
			this.FB_ADS = {
				INTERSTITIAL: "4864743603539728_5070034729677280",
				REWARDED_VIDEO: "4864743603539728_5070034119677341",
				BANNER: "4864743603539728_5082905605056859"
			}, this._initFinish = !1, this._initPromise = null
		}
		static get Instance() {
			return E._ins || (E._ins = new E), E._ins
		}
		init() {
			this._initPromise = new Promise((t, e) => {
				try {
					// if (!window.FBInstant) return this._initFinish = !0, console.info("no FBInstant Success Load Scene"), void t(null);
					// FBInstant.initializeAsync().then(() => {
					// 	FBInstant.setLoadingProgress(100), FBInstant.startGameAsync().then(() => {
					// 		this._initFinish = !0, console.info("have FBInstant Success Load Scene"), t(null)
					// 	}).catch(t => {
					// 		console.error("Start Game Async failed: ", t), e(null)
					// 	})
					// }).catch(t => {
					// 	console.error("Fail to start, Error: ", t), e(null)
					// })
				} catch (t) {
					console.error("Fail to init fb, Error: ", t), e(null)
				}
			}), this._initPromise.then(() => {
				this.initAd()
			})
		}
		get InitPromise() {
			return this._initPromise
		}
		get InitFinish() {
			return this._initFinish
		}
		getID() {
			return __awaiter(this, void 0, void 0, function*() {
				return window.FBInstant ? (this._initFinish || (yield this._initPromise), FBInstant.player.getID()) : "111"
			})
		}
		initAd() {
			if (window.FBInstant) {
				try {
					L.addInterstitial(this.FB_ADS.INTERSTITIAL, 3)
				} catch (t) {
					console.info("添加插屏广告失败，错误: " + t.message)
				}
				try {
					L.addRewardedVideo(this.FB_ADS.REWARDED_VIDEO, 3)
				} catch (t) {
					console.info("添加激励视频广告失败，错误: " + t.message)
				}
				L.addBanner(this.FB_ADS.BANNER), L.loadAll()
			}
		}
		showInterstitial(t) {
			window.FBInstant && (L.isInterstitialAdReady() ? L.showInterstitialAd().then(() => {
				console.log("播放插屏广告成功"), t && t()
			}).catch(t => {
				console.log("播放插屏广告失败", t.message)
			}) : console.log("暂不支持播放插屏广告"))
		}
		showRewardedVideo(t, e) {
			if (!window.FBInstant) return console.log("非FB平台"), void(t && t());
			L.isRewardedVideoReady() ? L.showRewardedVideo().then(() => {
				console.log("播放激励视频成功"), t && t()
			}).catch(t => {
				console.log("播放激励视频失败或取消播放", t.message), e && e()
			}) : console.log("暂不支持播放激励视频")
		}
		showBanner() {
			window.FBInstant && (L.isBannerReady() ? L.showBannerAsync().then(() => {
				console.log("显示banner成功")
			}).catch(t => {
				console.log("显示banner失败", t.message)
			}) : console.log("暂不支持显示banner"))
		}
		hideBanner() {
            this._state = n.NONE;
            
			// window.FBInstant && L.hideBannerAsync().then(() => {}).catch(t => {
			// 	console.log("隐藏banner失败", t.message)
			// })
		}
	}
	E._ins = null;
	class C extends Laya.Script {
		constructor() {
			super(), this.scaleNum = 1, this.scaleMin = .9, this.scaleMax = 1.1, this.scaleTime = 400, this.playTime = 0
		}
		onEnable() {
			this.node = this.owner, this.node.scale(this.scaleNum, this.scaleNum), this.timeLine = new Laya.TimeLine, this.anim()
		}
		anim() {
			this.playTime > 0 ? Laya.timer.once(this.playTime, this, () => {
				this.timeLine.to(this.node, {
					scaleX: this.scaleMin,
					scaleY: this.scaleMin
				}, this.scaleTime), this.timeLine.to(this.node, {
					scaleX: this.scaleMax,
					scaleY: this.scaleMax
				}, 2 * this.scaleTime), this.timeLine.to(this.node, {
					scaleX: this.scaleNum,
					scaleY: this.scaleNum
				}, this.scaleTime), this.timeLine.play(0, !0)
			}) : (this.timeLine.to(this.node, {
				scaleX: this.scaleMin,
				scaleY: this.scaleMin
			}, this.scaleTime), this.timeLine.to(this.node, {
				scaleX: this.scaleMax,
				scaleY: this.scaleMax
			}, 2 * this.scaleTime), this.timeLine.to(this.node, {
				scaleX: this.scaleNum,
				scaleY: this.scaleNum
			}, this.scaleTime), this.timeLine.play(0, !0))
		}
		onDisable() {
			this.timeLine.pause(), this.timeLine.destroy()
		}
	}
	class M {
		constructor() {}
		static load(t) {
			M.item_json = t, M.unlock_lib = M.item_json.unlock_lib, M.user_unlock_box = M.item_json.user_unlock_box
		}
		static geUnlockLibByID(t) {
			return M.unlock_lib[t]
		}
		static geUserUnlockByID(t) {
			return M.user_unlock_box[t]
		}
		static setUserUnlockValueByID(t, e, i) {
			M.user_unlock_box[t][e] = i, G.saveToLocalStorage()
		}
		static isUserUnlockCanTrigger(t) {
			var e = M.geUnlockLibByID(t);
			if (e) {
				var i = e.con;
				return i.length < 1 || M.condition(i)
			}
			return !1
		}
		static condition(t) {
			var e, i, s, n;
			if (t.indexOf(":") > -1) {
				var a = t.split(":"),
					l = a[0].split("==");
				i = l[0], s = l[1], e = a[1]
			} else e = t;
			if (e.indexOf("==") > -1 ? n = "==" : e.indexOf(">=") > -1 && (n = ">="), n) {
				var o = e.split(n),
					h = o[0],
					r = Number(o[1]);
				if (i && s) {
					if ("mid" == i) {
						var _ = M.geUserUnlockByID(Number(s));
						if ("==" == n) {
							if (_[h] == r) return !0
						} else if (">=" == n && _[h] >= r) return !0
					}
				} else {
					var d = G.get(h);
					if ("==" == n) {
						if (d == r) return !0
					} else if (">=" == n && d >= r) return !0
				}
			}
			return !1
		}
		static Update(t) {
			for (var e = 1; e < M.unlock_lib.length; e++) {
				var i = M.geUnlockLibByID(e),
					s = M.geUserUnlockByID(e);
				if (null == s) return;
				var n = M.isUserUnlockCanTrigger(e);
				1 == i.ty ? n && 0 == s.sd && (M.setUserUnlockValueByID(e, "sd", 1), t(i)) : 2 == i.ty && n && 0 == s.sd && (M.setUserUnlockValueByID(e, "sd", 1), t(i))
			}
		}
	}
	class B {
		constructor() {}
		static refresh() {
			var t = B.getLastCheckinDay();
			if (7 == t[1] && !t[0])
				for (var e = 1; e < 8; e++) {
					var i = w.getTaskByProgressType("check_in", e);
					w.user_task_box[i.id].ft = 0
				}
		}
		static getState(t) {
			var e = w.getTaskByProgressType("check_in", t),
				i = w.getTaskState(e);
			return 1 == i ? B.getLastCheckinDay()[0] ? 0 : i : (-1 == i && (i = 0), i)
		}
		static getLastCheckinDay() {
			for (var t = 0, e = 0, i = 1; i < 8; i++) {
				var s = w.getTaskByProgressType("check_in", i),
					n = w.user_task_box[s.id];
				n.prc = Math.round(G.get("check_in") % 7) + 1, n.ft > 0 && (t = n.ft, e = i)
			}
			return [w.timestampToDate(t) == w.timestampToDate((new Date).getTime()), e]
		}
		static completeTask(t) {
			if (1 == B.getState(t)) {
				var e = w.getTaskByProgressType("check_in", t);
				return w.user_task_box[e.id].ft = (new Date).getTime(), G.add("check_in", 1), B.refresh(), !0
			}
			return !1
		}
		static getList() {
			for (var t = new Array, e = 1; e < w.task_lib.length; e++) {
				var i = w.task_lib[e];
				4 == i.ty && t.push(i)
			}
			return t
		}
		static checkTodayBoolCheck() {
			let t = B.getList(),
				e = !0;
			for (let i = 0; i < t.length; i++) {
				let s = t[i];
				1 == B.getState(s.prt) && (e = !1)
			}
			return e
		}
	}
	class k {
		constructor() {}
		static refresh() {
			for (var t = 1; t < w.task_lib.length; t++) {
				var e = w.task_lib[t];
				if ("level" == e.prty) w.getUserTaskByID(e.id).prc = G.get("level")
			}
		}
		static getState(t) {
			this.refresh(), null == t && (t = G.get("level"));
			var e = w.getTaskByProgressType("level", t);
			return e ? w.getTaskState(e) : -1
		}
		static completeTask(t) {
			null == t && (t = G.get("level"));
			var e = w.getTaskByProgressType("level", t);
			return w.completeTask(e)
		}
	}
	class w {
		constructor() {}
		static load(t) {
			w.item_json = t, w.task_lib = w.item_json.task_lib, w.user_task_box = w.item_json.user_task_box, B.refresh(), k.refresh()
		}
		static getTaskState(t) {
			var e = w.getUserTaskByID(t.id);
			if (e) {
				if (e.ft > 0) return 2;
				if (e.prc >= t.prt) return 1;
				var i = w.task_lib[t.pid];
				return 2 == w.getTaskState(i) && (e.vt - (new Date).getTime() > 0 || 0 == e.vt) ? 0 : -1
			}
			return null
		}
		static getUserTaskByID(t) {
			return w.user_task_box[t]
		}
		static completeTask(t) {
			w.getTaskState(t);
			return 1 ? (w.getUserTaskByID(t.id).ft = (new Date).getTime(), t) : null
		}
		static getProgress(t) {
			return [t.prt, w.user_task_box[t.id].prc]
		}
		static incUserTaskProgress(t, e) {
			if (0 == w.getTaskState(t)) {
				var i = w.getUserTaskByID(t.id);
				return i.prc += e, i
			}
			return null
		}
		static getTaskByProgressType(t, e) {
			for (var i = 1; i < w.task_lib.length; i++) {
				var s = w.task_lib[i];
				if (s.prty == t && s.prt == e) return s
			}
			return null
		}
		static findOneTask(t, e, i, s) {
			for (var n = 1; n < w.task_lib.length; n++) {
				var a = w.task_lib[n],
					l = null == t || a.ty == t,
					o = null == e || a.pid == e,
					h = null == i || a.prty == i,
					r = null == s || a.prt == s;
				if (l && o && h && r) return a
			}
		}
		static findOneTargetTask(t, e) {
			for (var i = 1; i < w.task_lib.length; i++) {
				var s = w.task_lib[i],
					n = null == t || s.ty == t,
					a = null == e || s.pid == e;
				if (n && a) return s
			}
		}
		static timestampToDate(t) {
			var e = new Date(t);
			return e.getFullYear() + "-" + ((e.getMonth() + 1 < 10 ? "0" + (e.getMonth() + 1) : e.getMonth() + 1) + "-") + e.getDate()
		}
		static getTodayEndTime() {
			return new Date(new Date((new Date).toLocaleDateString()).getTime() + 864e5 - 1).getTime()
		}
		static isValidTime(t, e) {
			return !!e || !(t.vt - (new Date).getTime() < 0)
		}
	}
	class O {
		constructor(t, e, i, s, n, a) {
			this.state = t, this.item = e, this.price_type_key = i, this.price = s, this.user_has = n, this.task = a
		}
		static itemCondition(t, e) {
			let i, s, n = e.split("="),
				a = n[0],
				l = Number(n[1]),
				o = x.getUserBoxItem(t);
			if (!o) return null;
			if (e.indexOf(x.PRICE_TYPE_TASK) > -1) {
				let e = l,
					n = w.task_lib[e];
				switch (w.getTaskState(n)) {
					case -1:
					case 0:
					case 1:
						s = O.STATE_CONDITION_MET_NOT;
						break;
					case 2:
						s = O.STATE_CONDITION_MET_READY
				}
				s = o.num >= t.mx ? O.STATE_CONDITION_MET_CONFIRM : s;
				let h = n.prt,
					r = w.user_task_box[e].prc;
				i = new O(s, t, a, h, r, n)
			} else if (e.indexOf(x.PRICE_TYPE_CUR) > -1) {
				let e = a.split("_")[0];
				s = l <= G.get(e) ? O.STATE_CONDITION_MET_READY : O.STATE_CONDITION_MET_NOT, s = o.num >= t.mx ? O.STATE_CONDITION_MET_CONFIRM : s, i = new O(s, t, a, l, G.get(e), null)
			} else if (e.indexOf(x.PRICE_TYPE_CHIP) > -1) {
				a.split("_")[0];
				let e = x.user_item_box[t.cid];
				s = l <= e.num ? O.STATE_CONDITION_MET_READY : O.STATE_CONDITION_MET_NOT, s = o.num >= t.mx ? O.STATE_CONDITION_MET_CONFIRM : s, i = new O(s, t, a, l, e.num, null)
			} else i = e.indexOf("init") > -1 ? new O(O.STATE_CONDITION_MET_CONFIRM, t, a, 0, 0, null) : new O(O.STATE_CONDITION_MET_NOT, t, "", 0, 0, null);
			return i
		}
		static conditionMerge(t, e, i) {
			return t == this.STATE_CONDITION_MET_CONFIRM || e == this.STATE_CONDITION_MET_CONFIRM ? this.STATE_CONDITION_MET_CONFIRM : i.indexOf("&") > -1 ? t == this.STATE_CONDITION_MET_NOT || e == this.STATE_CONDITION_MET_NOT ? this.STATE_CONDITION_MET_NOT : this.STATE_CONDITION_MET_READY : t == this.STATE_CONDITION_MET_READY || e == this.STATE_CONDITION_MET_READY ? this.STATE_CONDITION_MET_READY : this.STATE_CONDITION_MET_NOT
		}
		static itemAllConditions(t) {
			for (var e = t.pt.split(/[&|]/), i = t.pt.match(/[&|]/g), s = -1, n = new Array, a = 0; a < e.length; a++) {
				var l = this.itemCondition(t, e[a]);
				n.push(l)
			}
			if (n.length > 1)
				for (a = 1; a < e.length; a++) s = -1 == s ? this.conditionMerge(n[a - 1].state, n[a].state, i[a - 1]) : this.conditionMerge(s, n[a].state, i[a - 1]);
			else s = n[0].state;
			return new P(s, n)
		}
	}
	O.STATE_CONDITION_MET_NOT = 0, O.STATE_CONDITION_MET_READY = 1, O.STATE_CONDITION_MET_CONFIRM = 2;
	class P {
		constructor(t, e) {
			this.state = t, this.conditions = e
		}
	}
	class x {
		constructor() {}
		static load(t) {
			x.item_json = t, x.item_lib = x.item_json.item_lib, x.user_item_box = x.item_json.user_item_box
		}
		static getItemByID(t) {
			return x.item_lib[t]
		}
		static getUserBoxItem(t) {
			return x.user_item_box[t.id]
		}
		static getUserBoxChipItem(t) {
			return x.user_item_box[t.cid]
		}
		static incItem(t, e = 1) {
			var i = x.getUserBoxItem(t);
			return i.num += e, i
		}
		static incItemChip(t, e = 1) {
			if (t.cid > 0) {
				var i = this.getItemByID(t.cid);
				return t.pt.indexOf(this.PRICE_TYPE_SHARE) > -1 ? G.add(this.PRICE_TYPE_SHARE, 1) : t.pt.indexOf(this.PRICE_TYPE_VIDEO) > -1 && G.add(this.PRICE_TYPE_VIDEO, 1), x.incItem(i, e)
			}
			return console.warn("incItemChip->item['cid'] <=0!"), null
		}
		static decItem(t, e = 1) {
			var i = x.getUserBoxItem(t);
			return e <= i.num ? i.num -= e : i.num = 0, i
		}
		static mergeItem(t, e) {
			if (t.state != O.STATE_CONDITION_MET_READY) return !1;
			for (var i = 0; i < t.conditions.length; i++) {
				var s = t.conditions[i];
				if (s.price_type_key.indexOf(e) > -1) {
					if (s.state != O.STATE_CONDITION_MET_READY) return !1;
					var n = s.item;
					if (s.price_type_key.indexOf(this.PRICE_TYPE_CHIP) > -1) {
						var a = x.getUserBoxChipItem(n);
						x.decItem(a, s.price)
					} else s.price_type_key.indexOf(this.PRICE_TYPE_CUR) > -1 ? G.dec(e, s.price) : s.price_type_key.indexOf(this.PRICE_TYPE_TASK);
					return x.incItem(n), !0
				}
			}
			return !1
		}
		static getItemsConditionsByType(t, e) {
			for (var i = new Array, s = 1; s < x.item_lib.length; s++) {
				var n = x.item_lib[s];
				if (n.ty == t && n.sid == e) {
					var a = O.itemAllConditions(n);
					i.push(a)
				}
			}
			return i
		}
		static getItemState(t) {
			var e = this.getItemByID(t);
			return O.itemAllConditions(e)
		}
		static getChipPrice(t) {
			if (t.pt.indexOf("|") > -1) {
				for (var e = t.pt.split("|"), i = 0; i < e.length; i++)
					if (e[i].indexOf("chip") > -1) {
						var s = e[i].split("_");
						return Number(s)
					}
			} else {
				if (!(t.pt.indexOf("&") > -1)) {
					s = t.pt.split("_");
					return Number(s)
				}
				for (e = t.pt.split("&"), i = 0; i < e.length; i++)
					if (e[i].indexOf("chip") > -1) {
						var s = e[i].split("_");
						return Number(s)
					}
			}
		}
		static getCurPrice(t) {
			if (t.pt.indexOf("/") > 0) {
				var e = t.p.split("/");
				return Number(e[0])
			}
			return Number(t.p)
		}
	}
	x.PRICE_TYPE_CHIP = "chip", x.PRICE_TYPE_CUR = "cur", x.PRICE_TYPE_VIDEO = "video", x.PRICE_TYPE_SHARE = "share", x.PRICE_TYPE_TASK = "task";
	class D {
		constructor() {}
		static getIntegerInND(t, e, i, s) {
			var n = D.getNumberInNormalDistribution(t, e);
			return n = (n = n > i ? i : n) < s ? s : n, Math.round(n)
		}
		static getRealInND(t, e, i, s) {
			var n = D.getNumberInNormalDistribution(t, e);
			return n = (n = n > i ? i : n) < s ? s : n
		}
		static getNumberInNormalDistribution(t, e) {
			return t + D.uniform2NormalDistribution() * e
		}
		static uniform2NormalDistribution() {
			for (var t = 0, e = 0; e < 12; e++) t += Math.random();
			return t - 6
		}
		static getIntegerInRandom(t, e) {
			return Math.round(D.getRealInRandom(t, e))
		}
		static getRealInRandom(t, e) {
			var i = t - e;
			return e + Math.random() * i
		}
		static getBoolInRandom(t) {
			return t > Math.random()
		}
	}
	class U {
		constructor() {}
		static load(t) {
			U.item_json = t, U.user_equip_box = U.item_json.user_equip_box
		}
		static setFuncList(t) {
			this.func_list = t
		}
		static getEquipByID(t) {
			let e = U.user_equip_box;
			for (let i = 0; i < e.length; i++) {
				let s = e[i];
				if (s.id == t) return s
			}
			return null
		}
		static getEquipNewId() {
			let t = -1;
			return this.user_equip_box.forEach(e => {
				let i = e.id;
				i > t && (t = i)
			}), t + 1
		}
		static createEquip(t, e, i = [], s = 0, n = 0) {
			return new R(-1, t, e, i, s, n)
		}
		static putEquipInBox(t) {
			let e = this.getEquipNewId();
			t.id = e;
			let i = t.toJson();
			return U.user_equip_box.push(i), this.SAVE_AUTO && G.saveToLocalStorage(), e
		}
		static decEquip(t) {
			let e = U.user_equip_box,
				i = this.getEquipByID(t);
			if (!i) return !1;
			let s = e.indexOf(i);
			return e.splice(s, 1), this.SAVE_AUTO && G.saveToLocalStorage(), !0
		}
		static addEquipLevel(t, e = 1) {
			let i = this.getEquipByID(t);
			i.lv += e;
			let s = i.iid,
				n = this.getEquipParaTemp(s, 0),
				a = this.getMainParaIndex(n);
			if (a > -1) {
				let t = n[a],
					e = this.getOneParaByTemp(s, t, i.lv),
					l = i.bp;
				for (let i = 0; i < l.length; i++) {
					let s = l[i];
					if (s.k == t.k) return s.v = e.v, void(this.SAVE_AUTO && G.saveToLocalStorage())
				}
			}
		}
		static changeEquipState(t, e, i = !1) {
			this.getEquipByID(t).st = e, this.SAVE_AUTO && i && G.saveToLocalStorage()
		}
		static getOneParaByTemp(t, e, i) {
			let s, n = e.m;
			return n ? n.indexOf("rely") > -1 && n.indexOf("equip_level") > -1 && (s = this.computOnePara(t, e, e.f1, i), e.f1 && null == s && (s = this.computOnePara(t, e, e.f2, i))) : s = D.getRealInRandom(e.u, e.d), new N(e.k, e.main, s)
		}
		static computOnePara(t, e, i, s) {
			let n = i.split(":"),
				a = n[0],
				l = n[1];
			if ("xls" == a) {
				let t = x.item_json[l];
				for (var o = 0; o < t.length; o++)
					if (t[o].in == s) return t[o].out
			} else if ("js" == a) {
				if (!this.func_list) return void console.warn(l + " 公式未定义！");
				for (let t = 0; t < this.func_list.length; t++) {
					let e = this.func_list[t];
					if (e.name == l) return e(s)
				}
			}
			return null
		}
		static getMainParaIndex(t) {
			for (let e = 0; e < t.length; e++) {
				if (t[e].main) return e
			}
			return -1
		}
		static getEquipParaTemp(t, e) {
			let i = 0 == e ? "f1" : "f2",
				s = new Array;
			return this.paraTempHasClone(t, i, s), s
		}
		static paraTempHasClone(t, e, i) {
			let s = x.getItemByID(t)[e],
				n = JSON.parse(s),
				a = -1;
			for (var l = 0; l < n.length; l++) {
				var o = n[l];
				if ("clone" == o.k) {
					a = o.u;
					break
				}
			}
			a > -1 && this.paraTempHasClone(a, e, i);
			for (l = 0; l < n.length; l++) {
				let t = n[l];
				if ("clone" == t.k) continue;
				let e = -1;
				for (let s = 0; s < i.length; s++) {
					if (i[s].k == t.k) {
						e = s;
						break
					}
				}
				if (-1 == e) {
					let e = N.createByJson(t);
					i.push(e)
				} else {
					let s = N.createByJson(t);
					i[e] = s
				}
			}
		}
		static getEquipPara(t, e) {
			let i = 0 == e ? "bp" : "sp";
			return this.getEquipByID(t)[i]
		}
		getMainParaValueByEquipLevel(t, e) {
			let i = U.getEquipParaTemp(t, 0),
				s = U.getMainParaIndex(i);
			return U.getOneParaByTemp(t, i[s], e).v
		}
		static createParaList(t, e, i, s, n, a, l, o, h) {
			for (; n > 0;) {
				let r = D.getIntegerInRandom(a.length + o.length - 1, 0),
					_ = r - a.length;
				if (r != l && _ != h) {
					if (r < a.length) {
						let e = U.getOneParaByTemp(i, a[r], s);
						t.push(e)
					} else {
						r -= a.length;
						let t = U.getOneParaByTemp(i, o[r], s);
						e.push(t)
					}
					n--
				}
			}
		}
		static getNewEquipByRandomPara(t, e) {
			let i = x.getItemByID(t).f3,
				s = U.getEquipParaTemp(t, 0),
				n = U.getEquipParaTemp(t, 1),
				a = new Array,
				l = U.getMainParaIndex(s);
			if (l > -1) {
				let i = U.getOneParaByTemp(t, s[l], e);
				a.push(i)
			}
			let o = new Array,
				h = U.getMainParaIndex(n);
			if (h > -1) {
				let i = U.getOneParaByTemp(t, n[h], e);
				o.push(i)
			}
			let r = i - a.length - o.length;
			return this.createParaList(a, o, t, e, r, s, l, n, h), U.createEquip(t, a, o, e, 0)
		}
		static resetParaByRandom(t) {
			let e = U.getEquipByID(t),
				i = e.bp,
				s = e.sp,
				n = 0;
			i.forEach(t => {
				if (!t.main) {
					let e = i.indexOf(t);
					i.splice(e, 1), n++
				}
			}), s.forEach(t => {
				if (!t.main) {
					let e = s.indexOf(t);
					s.splice(e, 1), n++
				}
			});
			let a = e.iid,
				l = e.lv,
				o = new Array,
				h = new Array,
				r = U.getEquipParaTemp(a, 0),
				_ = U.getEquipParaTemp(a, 1),
				d = U.getMainParaIndex(r),
				c = U.getMainParaIndex(_);
			this.createParaList(o, h, a, l, n, r, d, _, c), o.forEach(t => {
				i.push(t.toJson())
			}), h.forEach(t => {
				s.push(t.toJson())
			}), this.SAVE_AUTO && G.saveToLocalStorage()
		}
	}
	U.SAVE_AUTO = !0;
	class R {
		constructor(t, e, i, s, n, a) {
			this.id = t, this.iid = e, this.bp = i, this.sp = s, this.lv = n, this.st = a
		}
		toJson() {
			let t = JSON.stringify(this);
			return JSON.parse(t)
		}
	}
	class N {
		constructor(t, e = !1, i, s, n, a, l, o) {
			this.k = t, this.main = e, null != i && (this.v = i), null != s && (this.m = s), null != n && (this.u = n), null != a && (this.d = a), null != l && (this.f1 = l), null != o && (this.f2 = o)
		}
		static createByJson(t) {
			return new N(t.k, t.main, t.v, t.m, t.u, t.d, t.f1, t.f2)
		}
		toJson() {
			let t = JSON.stringify(this);
			return JSON.parse(t)
		}
	}
	class G {
		constructor(t) {
			t && G.setLibName(t)
		}
		static setLibName(t) {
			this.DB_FILE = t
		}
		static getPath() {
			return G.DB_MODULE_PATH + G.DB_FILE
		}
		static load(t) {
			Laya.loader.create(this.getPath(), Laya.Handler.create(this, function() {
				G.item_json = Laya.loader.getRes(this.getPath());
				let e, i, s, n, a, l, o = Laya.LocalStorage.getJSON("user_json");
				if (o)
					if (e = o.version, i = o.total_type, s = o.user_item_box, n = o.user_task_box, a = o.user_unlock_box, l = o.user_equip_box, G.item_json.version != e) {
						for (var h in G.item_json.total_type) null == i[h] && null == i[h] && (i[h] = G.item_json.total_type[h]);
						G.dataVersionUpdate(G.item_json.user_item_box, s), G.dataVersionUpdate(G.item_json.user_task_box, n), a && G.dataVersionUpdate(G.item_json.user_unlock_box, a), l && G.dataVersionUpdate(G.item_json.user_equip_box, l), G.item_json.total_type = i, G.item_json.user_item_box = s, G.item_json.user_task_box = n, a && (G.item_json.user_unlock_box = a), l && (G.item_json.user_equip_box = l), G.saveToLocalStorage()
					} else G.item_json.total_type = i, G.item_json.user_item_box = s, G.item_json.user_task_box = n, a && (G.item_json.user_unlock_box = a), l && (G.item_json.user_equip_box = l);
				else G.saveToLocalStorage();
				G.total_type = G.item_json.total_type, x.load(G.item_json), U.load(G.item_json), w.load(G.item_json), M.load(G.item_json), t()
			}))
		}
		static dataVersionUpdate(t, e) {
			for (var i in t[0])
				if (null == e[0][i] || null == e[0][i])
					for (var s = 0; s < e.length; s++) {
						var n = t[s][i];
						e[s][i] = n
					}
			for (s = 0; s < t.length; s++)
				if (null == e[s] || null == e[s]) {
					n = t[s];
					e[s] = n
				}
		}
		static versionCheck() {}
		static saveToLocalStorage() {
			if (G.item_json) {
				var t = JSON.parse("{}");
				t.version = G.item_json.version, t.total_type = G.item_json.total_type, t.user_item_box = G.item_json.user_item_box, t.user_task_box = G.item_json.user_task_box, t.user_unlock_box = G.item_json.user_unlock_box, t.user_equip_box = G.item_json.user_equip_box, Laya.LocalStorage.setJSON("user_json", t)
			}
		}
		static get(t) {
			return G.total_type ? G.total_type[t] : null
		}
		static set(t, e) {
			G.total_type && (G.total_type[t] = e)
		}
		static add(t, e) {
			G.total_type && (G.total_type[t] += e)
		}
		static dec(t, e) {
			G.total_type[t] -= e
		}
	}
	G.DB_MODULE_PATH = "res/atlas/dbmodule/", G.DB_FILE = "item_lib.json";
	class H {
		static getAgree() {
			return G.get("agree")
		}
		static setAgree(t) {
			G.set("agree", t)
		}
		static saveData() {
			G.saveToLocalStorage()
		}
		static setLoginTime() {
			G.set("login_time", Laya.Browser.now())
		}
		static getLoginTime() {
			return G.get("login_time")
		}
		static checkIsNewDay() {
			let t = this.getLoginTime();
			return new Date(t).toDateString() !== (new Date).toDateString()
		}
		static getLastLeavlTime() {
			return G.get("last_leave_time")
		}
		static setLastLeavlTime() {
			G.set("last_leave_time", Laya.Browser.now())
		}
		static getTurnNum() {
			return G.get("turn_num")
		}
		static setTurnNum(t) {
			return G.set("turn_num", t)
		}
		static addTurnNum(t) {
			return G.add("turn_num", t)
		}
		static getFreeTurn() {
			return G.get("free_turn")
		}
		static setFreeTurn(t) {
			return G.set("free_turn", t)
		}
		static getShowCheckin() {
			return G.get("show_checkin")
		}
		static addShowCheckin(t = 1) {
			G.add("show_checkin", t)
		}
		static setShowCheckin(t) {
			G.set("show_checkin", t)
		}
		static setTrollTimes(t) {
			G.set("troll_times", t)
		}
		static getTrollTimes() {
			let t = G.get("troll_times");
			return null == t && (t = 0), t
		}
	}
	class F {}
	F.shake_switch = 1, F.sound_switch = 1, F.moudle_navigate = !0, F.swtich_mistouch = !1, F.is_game_back = !1, F.go_game_time = 0, F.startTryItem = null, F.is_try = !1, F.start_try_open = !1, F.game_num = 0, F.try_index = -1, F.close_to_native_num = 0, F.click_num = 0, F.gold_mul = 1, F.show_home_music = !1;
	class V {}
	V.systemInfo = null, V.appName = "", V.screenWidth = Laya.Browser.clientWidth, V.screenHeight = Laya.Browser.clientHeight, V.launchOption = null, V.sourceScene = null, V.sourceAppId = null, V.videoEnable = !1;
	class Y {
		constructor(t) {
			this.ch = null, this.loadingTimeoutId = null, this.ch = t
		}
		login(t = null) {
			this.ch && this.ch.login({
				success: e => {
					t && t(!0, e), console.log("登录成功", e)
				},
				fail: e => {
					t && t(!1, e), console.log("登录失败", e)
				}
			})
		}
		getSystem() {
			if (this.ch) {
				let t = V.systemInfo = this.ch.getSystemInfoSync();
				V.platform = t.platform, V.appName = V.systemInfo.appName, V.screenWidth = t.screenWidth, V.screenHeight = t.screenHeight, console.log("系统参数：", t)
			}
		}
		getLaunchOptions() {
			if (this.ch) {
				let t = V.launchOption = this.ch.getLaunchOptionsSync();
				console.log("启动参数：", t), t && (t.referrerInfo || (t.referrerInfo = {}), V.sourceScene = V.launchOption.scene, V.sourceAppId = V.launchOption.query.source_appid ? V.launchOption.query.source_appid : V.launchOption.referrerInfo.appId)
			}
		}
		onShowAlways() {
			if (this.ch) {
				let t = t => {
					console.log("监听回到前台事件 总是:", t)
				};
				this.ch.onShow(t)
			}
		}
		onShow(t = null) {
			if (this.ch) {
				let e = i => {
					console.log("监听回到前台事件 单次:", i), this.ch.offShow(e), t && t()
				};
				this.ch.offShow(e), this.ch.onShow(e)
			}
		}
		onHide(t = null) {
			this.ch && this.ch.onHide(() => {
				console.log("监听退出事件"), H.setLastLeavlTime(), H.saveData(), t && t()
			})
		}
		showLoading(t = 3e3, e = null) {
			this.ch && this.ch.showLoading({
				title: "加载中...",
				success(i) {
					this.loadTimeoutId = setTimeout(() => {
						this.hideLoading(), e && e()
					}, t)
				}
			})
		}
		hideLoading() {
			this.ch && this.ch.hideLoading({
				success(t) {
					this.loadingTimeoutId && (clearTimeout(this.loadingTimeoutId), this.loadingTimeoutId = null)
				}
			})
		}
		showToast(t, e = "none", i = 1e3) {
			this.ch && this.ch.showToast({
				title: t,
				icon: e,
				duration: i
			})
		}
		showModal(t, e, i = !0, s = null) {
			this.ch && this.ch.showModal({
				title: t,
				content: e,
				showCancel: i,
				success(t) {
					t.confirm ? (console.log("玩家点击确定"), s && s(!0)) : t.cancel && (console.log("玩家点击取消"), s && s(!1))
				}
			})
		}
		vibrateShort() {
			this.ch && F.shake_switch && this.ch.vibrateShort({
				success() {},
				fail() {},
				complete() {}
			})
		}
		vibrateLong() {
			this.ch && F.shake_switch && this.ch.vibrateLong({
				success() {},
				fail() {},
				complete() {}
			})
		}
	}
	class X {
		static initData(t) {
			console.info(t);
			for (var e = 0; e < t.length; e++) {
				var i = t[e];
				this.setValue(i, i.name)
			}
		}
		static setValue(t, e) {
			this[e] = Number(t.value), console.log("开关信息：" + e + ": " + this[e])
		}
		static showStartTry() {
			return F.game_num++, F.game_num >= this.start_try_grade && (F.game_num - this.start_try_grade) % this.start_try_grade_level == 0
		}
		static closeToNative() {
			return F.close_to_native_num++, !(!this.close_to_native || !st.mainCH.adContent || F.close_to_native_num % this.close_to_native != 0)
		}
		static showNative() {
			return !1
		}
		static showAd() {
			return !!(Laya.Browser.now() - F.go_game_time >= 6e4 || this.show_ad_promptly)
		}
	}
	X.game_banner = 1, X.show_grid = 0, X.show_custom = 0, X.advertisement = 0, X.advertisement_game = 0, X.advertisement_game1 = 0, X.ad_game_show_time = 5e3, X.ad_game_hide_time = 5e3, X.normal_screen = 1, X.normal_screen_other = 0, X.fist_screen_time = 1e4, X.interval_screen_time = 6e5, X.insertAd_level = 1, X.delay_screen_time = 700, X.is_turn_video = 0, X.start_try_grade = 1, X.start_try_grade_level = 1, X.show_shortcut = 1, X.game_custom = 0, X.show_ad_promptly = 0, X.close_to_native = 0, X.game_portal_ad = 0, X.click_num = 0, X.show_ad_prob = 0, X.interstitial_time = 0;
	class K {
		constructor() {}
		static shareDataLoad(t) {
			this.shareData && t && t()
		}
		static getOneShareData() {
			return null
		}
		static isCanShareToday() {
			if (G.item_json) {
				var t = G.get(this.KEY_SHARE_LAST_TIME);
				return 0 == t || null == t || (this.isToday(t) ? G.get(this.KEY_SHARE_NUM_TODAY) < this.LIMIT_SHARE_PRE_DAY : (G.set(this.KEY_SHARE_NUM_TODAY, 0), !0))
			}
			return console.warn("TotalType 未初始化"), !1
		}
		static addShareToday() {
			if (G.item_json) {
				var t = G.get(this.KEY_SHARE_NUM_TODAY);
				console.warn("addShareToday:" + t), null == t ? G.set(this.KEY_SHARE_NUM_TODAY, 1) : G.add(this.KEY_SHARE_NUM_TODAY, 1), G.set(this.KEY_SHARE_LAST_TIME, (new Date).getTime())
			} else console.warn("TotalType 未初始化")
		}
		static isToday(t) {
			return new Date(t).toDateString() === (new Date).toDateString()
		}
	}
	K.DB_PATH = "res/share/", K.KEY_SHARE_NUM_TODAY = "share_num_today", K.KEY_SHARE_LAST_TIME = "share_last_time", K.LIMIT_SHARE_PRE_DAY = 5;
	class z extends Y {
		constructor(t) {
			super(t), this.videoAd = null, this.videoId = "adunit-de779ebec99dd6d6", this.bannerAd = null, this.banIndex = 0, this.bannerId = ["adunit-98f48e2b2e568d65", "adunit-96e4d8d38fc3c1cc", "adunit-9a089675fb996c18"], this.insertAd = null, this.insertId = "adunit-b385256b000318f5", this.customAds = [], this.customId = ["adunit-fb977ea4595169ed", "adunit-31179f06c4d0aaba", "adunit-754c33c32b1724e9", "adunit-754c33c32b1724e9"], this.gridAds = [], this.gridId = ["adunit-fa6a909e7c49a724", "adunit-110b61a35691213c", "adunit-8bb5d8703bb2adda"], this.share_start_time = 0, this.share_end_time = 0, this.share_interval_time = 3100, this.isBannerShow = !1, this.videoCallback = null, this.getSystem(), this.getLaunchOptions(), this.onShowAlways(), this.checkUpdate(), this.onHide()
		}
		createVideoAd() {
			if (this.ch) {
				this.videoAd = this.ch.createRewardedVideoAd({
					adUnitId: this.videoId
				}), this.videoAd.onLoad(() => {
					console.log("视频创建成功"), V.videoEnable = !0, this.videoAd.offLoad()
				}), this.videoAd.onError(t => {
					console.log("视频创建错误：", t), V.videoEnable = !1
				}), this.videoAd.load();
				let t = t => {
					t && t.isEnded ? (console.info("视频观看成功"), this.videoCallback && this.videoCallback(!0)) : (console.log("视频观看失败"), this.videoCallback && this.videoCallback(!1))
				};
				this.videoAd.onClose(t)
			}
		}
		showVideoAd(t = null) {
			this.ch && this.videoAd ? (this.videoCallback = t, this.videoAd.show().catch(e => {
				this.showToast("暂无广告，请稍后再试"), t && t(!1)
			})) : st.mainCH.showToast("暂无广告")
		}
		createBannerAd() {
			if (this.ch) {
				let t = this.refreshBanId();
				this.bannerAd = this.ch.createBannerAd({
					adUnitId: t,
					adIntervals: 30,
					style: {
						left: V.screenWidth / 2 - 150,
						top: V.screenHeight - 105,
						width: 300
					}
				}), this.bannerAd.onLoad(() => {
					console.log("banner创建成功 id=", t), this.bannerAd.offLoad()
				}), this.bannerAd.onResize(() => {
					console.log("Resize", this.bannerAd), this.bannerAd.style.left = (V.screenWidth - this.bannerAd.style.realWidth) / 2, this.bannerAd.offResize()
				}), this.bannerAd.onError(t => {
					console.log("创建banner失败: ", t)
				}), this.isBannerShow ? this.showBannerAd() : this.hideBannerAd()
			}
		}
		refreshBanId() {
			return this.banIndex++, this.banIndex > this.bannerId.length - 1 && (this.banIndex = 0), this.bannerId[this.banIndex]
		}
		destroyBannerAd() {
			this.bannerAd && (console.log("销毁 banner"), this.bannerAd.destroy(), this.bannerAd = null)
		}
		resetBannerAd() {
			this.ch && (console.log("刷新 banner"), this.destroyBannerAd(), this.createBannerAd())
		}
		showBannerAd() {
			this.isBannerShow = !0, this.ch && this.bannerAd && X.game_banner && (console.log("显示 banner"), this.bannerAd.show())
		}
		hideBannerAd() {
			this.isBannerShow = !1, this.ch && this.bannerAd && (console.log("隐藏 banner"), this.bannerAd.hide())
		}
		createInterstitialAd() {
			this.ch && (this.insertAd = this.ch.createInterstitialAd({
				adUnitId: this.insertId
			}), this.insertAd.onLoad(() => {
				console.log("插屏广告加载完毕")
			}), this.insertAd.onError(t => {
				console.log("插屏广告错误", t)
			}))
		}
		showInterstitialAd(t = null) {
			if (console.log("显示插屏广告"), this.ch && this.insertAd) {
				t && this.insertAd.onClose(() => {
					console.log("插屏广告关闭"), this.insertAd.offClose(), t && t()
				}), this.insertAd.show().catch(t => {
					console.log("创建插屏广告失败"), console.log(`errCode:${t.errMsg},errMsg:${t.errCode}`)
				})
			}
		}
		createCustomAd(t, e, i, s = 0) {
			if (this.ch) {
				if (Laya.Browser.height / Laya.Browser.width < .5 && (t += s), V.systemInfo.SDKVersion < "2.11.1") return;
				let n = this.ch.createCustomAd({
					adUnitId: this.customId[i],
					adIntervals: 30,
					style: {
						left: t,
						top: e,
						fixed: !1
					}
				});
				n.onLoad(() => {
					console.info("原生模板广告创建成功")
				}), n.onError(t => {
					console.info("原生模板广告错误" + this.customId[i], t)
				}), this.customAds.push(n)
			}
		}
		showCustomAd(t) {
			this.ch && this.customAds[t] && X.show_custom && this.customAds[t].show()
		}
		hideCustomAd(t = null) {
			if (console.log("隐藏原生模板广告"), this.ch && this.customAds && this.customAds.length > 0)
				for (let t = 0; t < this.customAds.length; t++) this.customAds[t] && this.customAds[t].hide()
		}
		createGridAd(t = 0, e = V.screenHeight - 100, i, s = 5) {
			if (this.ch) {
				if (V.systemInfo.SDKVersion < "2.10.2") return;
				console.info("创建格子广告");
				var n = this.ch.createGridAd({
					adUnitId: this.gridId[i],
					adIntervals: 30,
					style: {
						top: e,
						left: t,
						width: 100,
						height: 100
					},
					gridCount: s
				});
				n.onLoad(() => {
					console.info("格子广告创建成功")
				}), n.onError(t => {
					console.info("格子广告创建错误", t)
				}), n.onResize(t => {
					console.info("格子广告大小：", t)
				}), this.gridAds.push(n)
			}
		}
		showGridAd(t) {
			console.info("显示格子广告"), this.ch && this.gridAds[t] && X.show_grid && this.gridAds[t].show()
		}
		hideGridAd(t = null) {
			if (console.log("隐藏格子广告"), this.ch && this.gridAds && this.gridAds.length > 0)
				for (let t = 0; t < this.gridAds.length; t++) this.gridAds[t] && this.gridAds[t].hide()
		}
		showShareMenu() {
			this.ch && (this.setShareAppMessage(), this.ch.showShareMenu({
				withShareTicket: !1
			}), console.log("显示转发按钮"))
		}
		setShareAppMessage() {
			this.ch && (console.log("设置转发信息"), K.shareDataLoad(() => {
				this.ch.onShareAppMessage(() => {
					let t = K.getOneShareData();
					return console.log("setShareAppMessage sdb: ", t), {
						title: t.title,
						imageUrl: t.img_url,
						success: t => {},
						fail: t => {}
					}
				})
			}))
		}
		share(t = null) {
			if (this.ch) {
				if (!K.isCanShareToday()) return void this.showToast("今日奖励次数已达上限");
				this.share_start_time = Laya.Browser.now();
				let e = e => {
					this.share_end_time = Laya.Browser.now(), this.share_end_time - this.share_start_time >= this.share_interval_time ? (t && t(!0), K.addShareToday()) : t && t(!1)
				};
				this.onShow(e), K.shareDataLoad(() => {
					let t = K.getOneShareData(),
						e = Laya.Browser.now() + "" + ~~(1e4 * (.1 + Math.random() / 2));
					this.ch.shareAppMessage({
						title: t.title,
						imageUrl: t.img_url,
						query: "&sn=" + e + "&share_id=" + t.id
					})
				})
			}
		}
		checkUpdate() {
			if (this.ch) {
				let t = this.ch.getUpdateManager();
				t.onCheckForUpdate(t => {
					console.log("是否有新版本:", t.hasUpdate)
				}), t.onUpdateFailed(() => {
					this.showToast("新版本下载失败")
				}), t.onUpdateReady(() => {
					this.showModal("更新提示", "新版本已经准备好，是否重启应用？", !0, e => {
						e && t.applyUpdate()
					})
				})
			}
		}
		gotoOther(t, e, i, s = null) {
			this.ch && e && this.ch.navigateToMiniProgram({
				appId: e,
				path: i,
				success(t) {
					console.log("打开成功: appid = ", e), s && s(!0)
				},
				fail(t) {
					console.log("打开失败: appid = ", e), s && s(!1)
				}
			})
		}
		setKeepScreenOn(t = !0) {
			this.ch && this.ch.setKeepScreenOn({
				keepScreenOn: t,
				success(t) {
					console.log("屏幕常亮开启")
				},
				fail(t) {
					console.log("setKeepScreenOn调用失败")
				}
			})
		}
	}
	class j extends Y {
		constructor(t) {
			super(t), this.videoAd = null, this.videoId = "2c473cc690cba1d1e8745d3338cbd153", this.bannerAd = null, this.banIndex = 0, this.bannerId = ["0caed23b1bf34f163ab7d0720cb87895"], this.insertAd = null, this.insertId = "4f48ec0d49a60bafd777f050e2c20636", this.boxAd = null, this.boxAdId = "5e0e7c3c816cef6c182f6f6c85cf857d", this.share_start_time = 0, this.share_end_time = 0, this.share_interval_time = 3e3, this.videoCallback = null, this.getSystem(), this.getLaunchOptions(), this.onShowAlways(), this.createBannerAd(), this.createVideoAd(), this.createInterstitialAd(), this.setShareAppMessage(), this.createAppBox(), this.checkUpdate()
		}
		createVideoAd() {
			if (this.ch) {
				this.videoAd = this.ch.createRewardedVideoAd({
					adUnitId: this.videoId
				}), this.videoAd.onLoad(() => {
					console.log("视频创建成功"), V.videoEnable = !0, this.videoAd.offLoad()
				}), this.videoAd.onError(t => {
					console.log("视频创建错误：", t), V.videoEnable = !1
				}), this.videoAd.load();
				let t = t => {
					t && t.isEnded ? (console.log("视频观看成功"), this.videoCallback && this.videoCallback(!0)) : (console.log("视频观看失败"), this.videoCallback && this.videoCallback(!1)), F.sound_switch || (Laya.SoundManager.muted = !0)
				};
				this.videoAd.onClose(t)
			}
		}
		showVideoAd(t = null) {
			this.ch && this.videoAd && (this.videoCallback = t, this.videoAd.show().catch(t => {
				this.showToast("获取视频失败")
			}))
		}
		createBannerAd() {
			if (this.ch) {
				let t = this.refreshBanId();
				this.bannerAd = this.ch.createBannerAd({
					adUnitId: t,
					adIntervals: 30,
					style: {
						top: V.screenHeight - 80,
						left: 0,
						width: V.screenWidth
					}
				}), this.bannerAd.onLoad(() => {
					console.log("banner创建成功 id=", t), this.bannerAd.offLoad()
				}), this.bannerAd.onResize(() => {
					console.log("Resize", this.bannerAd), this.bannerAd.style.left = (V.screenWidth - this.bannerAd.style.realWidth) / 2, this.bannerAd.style.top = V.screenHeight - this.bannerAd.style.realHeight, this.bannerAd.offResize()
				}), this.bannerAd.onError(t => {
					console.log("创建banner失败: ", t)
				})
			}
		}
		refreshBanId() {
			return this.banIndex++, this.banIndex > this.bannerId.length - 1 && (this.banIndex = 0), this.bannerId[this.banIndex]
		}
		destroyBannerAd() {
			this.bannerAd && (console.log("销毁 banner"), this.bannerAd.destroy(), this.bannerAd = null)
		}
		resetBannerAd() {
			this.ch && (console.log("刷新 banner"), this.destroyBannerAd(), this.createBannerAd(), this.bannerAd.show())
		}
		showBannerAd() {
			this.ch && this.bannerAd && (console.log("显示 banner"), this.bannerAd.show())
		}
		hideBannerAd() {
			console.log("隐藏 banner"), this.ch && this.bannerAd && this.bannerAd.hide()
		}
		createInterstitialAd() {
			this.ch && (this.insertAd = this.ch.createInterstitialAd({
				adUnitId: this.insertId
			}), this.insertAd.onLoad(() => {
				console.log("插屏广告加载完毕"), this.insertAd.offLoad()
			}), this.insertAd.onError(t => {
				console.log("插屏广告错误", t), this.insertAd.offError()
			}))
		}
		showInterstitialAd(t = null) {
			if (console.log("显示插屏广告"), this.ch && this.insertAd) {
				t && (this.insertAd.offClose(), this.insertAd.onClose(() => {
					console.log("插屏广告关闭"), this.insertAd.offClose(), t && t()
				})), this.insertAd.show().catch(t => {
					console.log("创建插屏广告失败"), console.log(`errCode:${t.errMsg},errMsg:${t.errCode}`)
				})
			}
		}
		showShareMenu() {
			this.ch && (this.setShareAppMessage(), this.ch.showShareMenu({
				withShareTicket: !1
			}), console.log("显示转发按钮"))
		}
		setShareAppMessage() {
			this.ch && (console.log("设置转发信息"), K.shareDataLoad(() => {
				this.ch.onShareAppMessage(() => {
					let t = K.getOneShareData();
					return console.log("setShareAppMessage sdb: ", t), {
						title: t.title,
						imageUrl: t.img_url,
						success: t => {},
						fail: t => {}
					}
				})
			}))
		}
		share(t = null) {
			if (this.ch) {
				if (!K.isCanShareToday()) return void this.showToast("今日奖励次数已达上限");
				this.share_start_time = Laya.Browser.now();
				let e = e => {
					this.share_end_time = Laya.Browser.now(), this.share_end_time - this.share_start_time >= this.share_interval_time ? (t && t(!0), K.addShareToday()) : t && t(!1)
				};
				this.onShow(e), K.shareDataLoad(() => {
					let t = K.getOneShareData(),
						e = Laya.Browser.now() + "" + ~~(1e4 * (.1 + Math.random() / 2));
					this.ch.shareAppMessage({
						title: t.title,
						imageUrl: t.img_url,
						query: "&sn=" + e + "&share_id=" + t.id
					})
				})
			}
		}
		gotoOther(t, e, i = null) {
			this.ch && t && this.ch.navigateToMiniProgram({
				appId: t,
				path: e,
				success(e) {
					console.log("打开成功: appId = ", t), i && i(!0)
				},
				fail(e) {
					console.log("打开失败: appId = ", t), i && i(!1)
				}
			})
		}
		createAppBox() {
			this.ch && (this.boxAd = this.ch.createAppBox({
				adUnitId: this.boxAdId
			}), this.boxAd.load())
		}
		showAppBox() {
			this.ch && this.boxAd && this.boxAd.show()
		}
		addColorSign(t = null) {
			this.ch && this.ch.addColorSign({
				success(e) {
					console.log("----subscribeAppMsg----success", e), t && t(!0)
				},
				fail(e) {
					console.log("----subscribeAppMsg----fail", e), t && t(!0)
				}
			})
		}
		saveAppToDesktop() {
			this.ch && this.ch.saveAppToDesktop()
		}
		subscribeAppMsg() {
			this.ch && this.ch.subscribeAppMsg({
				subscribe: !0,
				success(t) {
					console.log("----subscribeAppMsg----success", t)
				},
				fail(t) {
					console.log("----subscribeAppMsg----fail", t)
				}
			})
		}
		checkUpdate() {
			if (this.ch) {
				let t = this.ch.getUpdateManager();
				t.onCheckForUpdate(t => {
					console.log("是否有新版本:", t.hasUpdate)
				}), t.onUpdateFailed(() => {
					this.showToast("新版本下载失败")
				}), t.onUpdateReady(() => {
					this.showModal("更新提示", "新版本已经准备好，是否重启应用？", !0, e => {
						e && t.applyUpdate()
					})
				})
			}
		}
	}
	class q extends Y {
		constructor(t) {
			super(t), this.videoAd = null, this.videoId = "2rqd5wdjpp40bmff4d", this.bannerAd = null, this.banIndex = 0, this.bannerId = ["d5qmn16ddbf2j3m7ia"], this.insertAd = null, this.insertId = "35e9gsqo2nt1iqvov0", this.btnMoreGame = null, this.gameRecorderManager = null, this.isRecording = !1, this.recordingBeginTime = 0, this.recordingEndTime = 0, this.clipIndexList = [], this.recordResp = null, this.recordTime = 0, this.videoCallback = null, this.getSystem(), this.getLaunchOptions(), this.onShowAlways(), this.getGameRecorderManager(), this.checkUpdate(), this.onHide()
		}
		share(t = null, e = "article", i = {}) {
			if (this.ch) {
				let s = K.getOneShareData(),
					n = Laya.Browser.now() + "" + ~~(1e4 * (.1 + Math.random() / 2));
				"article" == e ? this.ch.shareAppMessage({
					title: s.title,
					imageUrl: s.img_url,
					query: "&sn=" + n + "&share_id=" + s.id,
					extra: i,
					success() {
						t && t(!0)
					},
					fail(e) {
						t && t(!1)
					}
				}) : this.ch.shareAppMessage({
					channel: e,
					title: s.title,
					imageUrl: s.img_url,
					query: "&sn=" + n + "&share_id=" + s.id,
					extra: i,
					success() {
						t && t(!0)
					},
					fail(e) {
						t && t(!1)
					}
				})
			}
		}
		createVideoAd() {
			if (this.ch) {
				this.videoAd = this.ch.createRewardedVideoAd({
					adUnitId: this.videoId
				}), this.videoAd.onLoad(() => {
					V.videoEnable = !0
				}), this.videoAd.onError(t => {
					V.videoEnable = !1
				}), this.videoAd.load();
				let t = t => {
					t && t.isEnded ? this.videoCallback && this.videoCallback(!0) : this.videoCallback && this.videoCallback(!1)
				};
				this.videoAd.onClose(t)
			}
		}
		showVideoAd(t = null) {
			this.ch && this.videoAd && (this.videoCallback = t, this.videoAd.show().catch(t => {
				this.showToast("暂无视频，请稍后再试"), this.videoAd.load()
			}))
		}
		createBannerAd() {
			if (this.ch) {
				let t = this.refreshBanId(),
					e = 150;
				e = Laya.Browser.width / Laya.Browser.height < .5 ? 250 : 150, this.bannerAd = this.ch.createBannerAd({
					adUnitId: t,
					style: {
						width: e,
						top: V.screenHeight - e / 16 * 9
					}
				}), this.bannerAd.onLoad(() => {
					this.hideBannerAd()
				}), this.bannerAd.onError(t => {}), this.bannerAd.onResize(t => {
					this.bannerAd.style.top = V.screenHeight - t.height, this.bannerAd.style.left = (V.screenWidth - t.width) / 2
				})
			}
		}
		refreshBanId() {
			return this.banIndex++, this.banIndex > this.bannerId.length - 1 && (this.banIndex = 0), this.bannerId[this.banIndex]
		}
		destroyBannerAd() {
			this.bannerAd && (this.bannerAd.destroy(), this.bannerAd = null)
		}
		resetBannerAd() {
			this.ch && (this.destroyBannerAd(), this.createBannerAd(), this.showBannerAd())
		}
		showBannerAd() {
			this.ch && this.bannerAd && X.game_banner && this.bannerAd.show()
		}
		hideBannerAd() {
			this.bannerAd && this.bannerAd.hide()
		}
		createInterstitialAd() {
			const t = "Toutiao" === V.appName;
			this.ch && t && (this.insertAd = this.ch.createInterstitialAd({
				adUnitId: this.insertId
			}), this.insertAd.onLoad(() => {
				this.insertAd.offLoad()
			}), this.insertAd.onError(t => {
				this.insertAd.offError()
			}))
		}
		showInterstitialAd(t) {
			if (this.ch && this.insertAd) {
				t && this.insertAd.onClose(() => {
					this.insertAd.offClose(), t()
				}), this.insertAd.show().catch(t => {})
			} else t && t()
		}
		getGameRecorderManager() {
			this.ch && (this.gameRecorderManager = this.ch.getGameRecorderManager(), this.gameRecorderManager.onError(t => {}), this.gameRecorderManager.onInterruptionBegin(t => {
				this.showToast("录屏中断")
			}), this.gameRecorderManager.onInterruptionEnd(t => {
				this.showToast("录屏中断")
			}), this.gameRecorderManager.onStart(t => {
				this.isRecording = !0, this.recordingBeginTime = (new Date).getTime()
			}), this.gameRecorderManager.onStop(t => {
				this.recordResp = t, this.isRecording = !1, this.recordingEndTime = (new Date).getTime(), this.recordClip()
			}))
		}
		startGameRecorderManager() {
			this.ch && this.gameRecorderManager.start({
				duration: 300
			})
		}
		stopGameRecorderManager() {
			this.ch && this.gameRecorderManager.stop()
		}
		recordClip() {
			this.ch && (this.recordTime = Math.floor((this.recordingEndTime - this.recordingBeginTime) / 1e3), this.gameRecorderManager.recordClip({
				timeRange: [this.recordTime, 0]
			}))
		}
		recordShare(t = null) {
			this.ch && (this.recordTime > 3 ? this.share(e => {
				t && t(e)
			}, "video", {
				videoPath: this.recordResp.videoPath
			}) : this.showToast("录屏时间不足"))
		}
		createBtnMoreGame(t, e, i) {
			if (this.ch) {
				let s = Laya.Browser.width / 640,
					n = 450;
				n = Laya.Browser.width / Laya.Browser.height < .5 ? 550 : 450, this.btnMoreGame = this.ch.createMoreGamesButton({
					type: "image",
					image: t,
					style: {
						left: 0,
						top: n * s / Laya.Browser.pixelRatio,
						width: e * s / Laya.Browser.pixelRatio,
						height: i * s / Laya.Browser.pixelRatio,
						lineHeight: 0,
						backgroundColor: "#00000000",
						textColor: "#00000000",
						textAlign: "center",
						fontSize: 16,
						borderRadius: 4,
						borderWidth: 1,
						borderColor: "#00000000"
					},
					appLaunchOptions: [],
					onNavigateToMiniGame(t) {}
				}), this.btnMoreGame.onTap(() => {})
			}
		}
		showBtnMoreGame() {
			this.ch && this.btnMoreGame && this.btnMoreGame.show()
		}
		showMoreGamesModal() {}
		hideBtnMoreGame() {
			this.ch && this.btnMoreGame && this.btnMoreGame.hide()
		}
		checkUpdate() {
			if (this.ch) {
				let t = this.ch.getUpdateManager();
				t.onCheckForUpdate(t => {}), t.onUpdateFailed(() => {
					this.showToast("新版本下载失败")
				}), t.onUpdateReady(() => {
					this.showModal("更新提示", "新版本已经准备好，是否重启应用？", !0, e => {
						e && t.applyUpdate()
					})
				})
			}
		}
	}
	class J extends Y {
		constructor(t) {
			super(t), this.videoAd = null, this.videoId = "", this.bannerAd = null, this.banIndex = 0, this.bannerId = [""], this.insertAd = null, this.insertId = ""
		}
		createVideoAd() {
			throw new Error("Method not implemented.")
		}
		showVideoAd() {
			throw new Error("Method not implemented.")
		}
		createBannerAd() {
			throw new Error("Method not implemented.")
		}
		destroyBannerAd() {
			throw new Error("Method not implemented.")
		}
		showBannerAd() {
			throw new Error("Method not implemented.")
		}
		hideBannerAd() {
			throw new Error("Method not implemented.")
		}
	}
	class Z {
		static init() {
			this.eventDispatcher = new Laya.EventDispatcher, this.eventDis = new Laya.EventDispatcher
		}
		static isX() {
			return Laya.Browser.width / Laya.Browser.height < .49
		}
		static screenAdaptation(t, e = 100) {
			Laya.Browser.width / Laya.Browser.height < .49 && (t.y = t.y + e)
		}
		static pxTodb(t) {
			return t * (Laya.Browser.width / 640) / Laya.Browser.pixelRatio
		}
		static numFixed(t, e) {
			return (Array(e).join("0") + t).slice(-e)
		}
		static time2Countdown(t) {
			t = Math.floor(t);
			let e = Math.floor(t / 1e3);
			e > 0 && (t -= 1e3 * e);
			let i = Math.floor(t / 10);
			return this.numFixed(e, 2) + ":" + this.numFixed(i, 2)
		}
		static time3Countdown(t) {
			t = Math.ceil(t);
			let e = Math.floor(t / 1e3 / 60);
			e > 0 && (t -= 1e3 * e * 60);
			let i = Math.ceil(t / 1e3);
			return i > 0 && (t -= 1e3 * i), this.numFixed(e, 2) + ":" + this.numFixed(i, 2) + ":"
		}
		static getArrRandomly(t) {
			for (var e = t.length - 1; e >= 0; e--) {
				var i = Math.floor(Math.random() * (e + 1)),
					s = t[i];
				t[i] = t[e], t[e] = s
			}
			return t
		}
		static getRandomArr(t = [], e = 1) {
			const i = this.getArrRandomly(t);
			let s = [];
			for (let t = 0; t < e; t++) s.push(i[t]);
			return s
		}
		static removeSp3(t, e) {
			if (t) {
				var i = t.indexOf(e);
				i > -1 && t.splice(i, 1)
			}
		}
		static getSp(t, e, i, s) {
			var n = W.Mem.getSP(t, e);
			n ? (W.Mem.recoverySP(n), s.call(i, t, e)) : (W.Mem.setMenu({
				id: t,
				sid: e
			}, {
				snc: 1,
				li: 999
			}), W.Mem.loadPrefabs(W.MEM_LOAD_TYPE.SHOW_NOW, this, () => {
				s.call(i, t, e)
			}))
		}
	}
	Z.eventDispatcher = null, Z.eventDis = null;
	class Q extends Y {
		constructor(t) {
			super(t), this.videoAd = null, this.videoId = "458659", this.bannerAd = null, this.banIndex = 0, this.bannerId = ["188159"], this.insertAd = null, this.insertId = "188160", this.nativeAd = null, this.nativeId = "458658", this.gameBannerAd = null, this.gameBannerAdId = "283596", this.gamePortalAd = null, this.gamePortalAdId = "458661", this.gameDrawerAd = null, this.gameDrawerAdId = "", this.isShowToast = !1, this.isShortcut = !0, this.videoCallback = null, this.create_shortcut_time = 0, this.interstitial_time = 0, this.nativeId_time = 0, this.isCallback = !1, this.getSystem(), this.getLaunchOptions(), this.onShowAlways(), this.createVideoAd(), this.createNativeAd(), this.createGamePortalAd(), this.onHide()
		}
		setEnableDebug() {
			this.ch && this.ch.setEnableDebug({
				enableDebug: !0,
				success: function() {},
				complete: function() {},
				fail: function() {}
			})
		}
		createVideoAd() {
			if (this.ch) {
				console.log("点击创建视频", this.ch), this.videoAd = this.ch.createRewardedVideoAd({
					adUnitId: this.videoId
				}), V.videoEnable = !0, this.videoAd.onLoad(() => {
					console.log("励视频加载成功"), V.videoEnable = !0, this.videoAd.show().catch(t => {
						console.info("视频拉取失败：", t)
					})
				}), this.videoAd.onError(t => {
					console.log("视频创建错误：", t), V.videoEnable = !1, this.isShowToast && this.showToast("暂无广告，请稍后再试", "none", 1e3), this.videoCallback && this.videoCallback(!1)
				});
				let t = t => {
					console.log("关闭视频：", t), t && t.isEnded ? (console.log("视频观看成功"), this.isCallback || (this.isCallback = !0, this.videoCallback && this.videoCallback(!0))) : (console.log("视频观看失败"), this.videoCallback && this.videoCallback(!1))
				};
				this.videoAd.onClose(t)
			}
		}
		showVideoAd(t = null) {
			this.isShowToast = !0, this.isCallback = !1, console.log("点击观看视频"), this.ch && this.videoAd ? (this.videoCallback = t, this.isShortcut = !1, this.videoAd.load()) : (this.showToast("暂无广告，请稍后再试", "none", 1e3), this.videoCallback && this.videoCallback(!1), t && t(!0))
		}
		createBannerAd() {
			if (this.ch) {
				let t = this.refreshBanId();
				this.bannerAd = this.ch.createBannerAd({
					adUnitId: t
				}), this.bannerAd.onLoad(() => {
					console.log("banner创建成功 id=", t)
				}), this.bannerAd.onResize(() => {
					console.log("banner onresize")
				}), this.bannerAd.onError(t => {
					console.log("创建banner失败: ", t)
				})
			}
		}
		refreshBanId() {
			return this.banIndex++, this.banIndex > this.bannerId.length - 1 && (this.banIndex = 0), this.bannerId[this.banIndex]
		}
		destroyBannerAd() {
			console.log("this.bannerAd：", this.bannerAd), this.bannerAd && (console.log("销毁banner"), this.bannerAd.destroy(), this.bannerAd = null)
		}
		resetBannerAd() {
			this.ch && (console.log("刷新banner"), this.destroyBannerAd(), this.createBannerAd(), this.bannerAd.show())
		}
		showBannerAd() {
			this.ch && this.bannerAd && X.game_banner && (console.log("显示banner", this.bannerAd), this.bannerAd.show())
		}
		hideBannerAd() {
			this.ch && this.bannerAd && this.bannerAd.hide()
		}
		createInterstitialAd() {
			this.ch && (this.insertAd = this.ch.createInsertAd({
				adUnitId: this.insertId
			}), this.insertAd.onLoad(() => {
				this.insertAd.offLoad(), console.log("插屏广告加载完毕")
			}), this.insertAd.onError(t => {
				this.insertAd.offError(), console.log("插屏广告错误", t)
			}))
		}
		showInterstitialAd(t = null) {
			this.ch && this.insertAd && (console.log("进入展示插屏广告"), this.insertAd.onClose(() => {
				console.log("插屏广告关闭"), this.insertAd.offClose(), t && t()
			}), this.insertAd.load(), this.insertAd.show())
		}
		createGameBannerAd() {
			this.ch && (console.log("快应用平台版本号: ", this.ch.getSystemInfoSync().platformVersionCode), this.ch.getSystemInfoSync().platformVersionCode >= 1076 ? (this.gameBannerAd = this.ch.createGameBannerAd({
				adUnitId: this.gameBannerAdId
			}), this.gameBannerAd.onLoad(() => {
				console.log("互推横幅加载成功")
			}), this.gameBannerAd.onError(t => {
				console.log("互推横幅错误：", t)
			})) : console.log("快应用平台版本号低于1076，暂不支持互推盒子相关 API"))
		}
		showGameBannerAd(t = null) {
			this.gameBannerAd && X.showAd() ? this.gameBannerAd.show().then(() => {
				console.log("显示互推横幅广告成功"), t && t(!0)
			}).catch(function(e) {
				console.log("互推横幅显示失败:", e), t && t(!1)
			}) : t && t(!1)
		}
		hideGameBannerAd() {
			this.gameBannerAd && this.gameBannerAd.hide()
		}
		createGamePortalAd() {
			this.ch && (console.log("快应用平台版本号: ", this.ch.getSystemInfoSync().platformVersionCode), this.ch.getSystemInfoSync().platformVersionCode >= 1076 ? (this.gamePortalAd = this.ch.createGamePortalAd({
				adUnitId: this.gamePortalAdId
			}), this.gamePortalAd.onLoad(() => {
				console.log("互推9宫格加载成功")
			}), this.gamePortalAd.onError(t => {
				console.log("互推9宫格错误：", t)
			})) : console.log("快应用平台版本号低于1076，暂不支持互推盒子相关 API"))
		}
		showGamePortalAd(t = !1) {
			this.gamePortalAd ? (console.log("显示插屏", Laya.Browser.now() - this.interstitial_time), this.interstitial_time = Laya.Browser.now(), this.gamePortalAd.load().then(() => {
				this.gamePortalAd.show().then(() => {
					Z.eventDis.event("native_open")
				}).catch(t => {
					this.showToast("暂无广告，请稍后再试"), Z.eventDis.event("native_close")
				})
			}).catch(t => {
				this.showToast("暂无广告，请稍后再试"), console.log("load fail with:" + t.errCode + "," + t.errMsg)
			})) : this.showToast("暂无广告，请稍后再试")
		}
		hideGamePortalAd() {
			this.gamePortalAd && this.gamePortalAd.hide()
		}
		createGameDrawerAd() {
			if (this.ch) {
				if (console.log("快应用平台版本号1: ", this.ch.getSystemInfoSync().platformVersionCode), this.ch.getSystemInfoSync().platformVersionCode >= 1090) {
					let t = Laya.Browser.width / 640 * 840;
					console.log("top: ", Laya.Browser.clientHeight, t), this.gameDrawerAd = this.ch.createGameDrawerAd({
						adUnitId: this.gameDrawerAdId,
						style: {
							top: t
						}
					}), this.gameDrawerAd.onError(t => {
						console.log("互推抽屉广告错误：", t)
					})
				} else console.log("快应用平台版本号低于1076，暂不支持互推盒子相关 API");
				this.hideGameDrawerAd()
			}
		}
		showGameDrawerAd() {
			this.gameDrawerAd && this.gameDrawerAd.show().then(() => {
				console.log("显示互推抽屉广告成功")
			}).catch(t => {
				console.log("显示互推抽屉广告失败:" + t)
			})
		}
		hideGameDrawerAd() {
			this.gameDrawerAd && this.gameDrawerAd.hide()
		}
		createNativeAd(t = null) {
			if (this.ch) {
				if (console.log("创建原生广告"), Laya.Browser.now() - this.nativeId_time < 2e4) return;
				this.nativeId_time = Laya.Browser.now(), this.nativeAd = this.ch.createNativeAd({
					adUnitId: this.nativeId
				}), this.nativeAd.onLoad(e => {
					console.log("原生广告加载完毕", e), this.adContent = e.adList[0], t && t(e.adList[0]), this.nativeAd.offLoad()
				}), this.nativeAd.onError(t => {
					console.log("原生广告错误", t), this.nativeAd.offError()
				}), this.nativeAd.load()
			}
		}
		clickNativeAd() {
			this.ch && (console.log("点击原生广告--点击上报"), this.nativeAd && this.adContent && this.nativeAd.reportAdClick({
				adId: this.adContent.adId
			}))
		}
		showNativeAd() {
			this.ch && (console.log("显示原生广告上报"), this.nativeAd && this.adContent && this.nativeAd.reportAdShow({
				adId: this.adContent.adId
			}))
		}
		destroyNativeAd() {
			this.ch && (console.log("销毁原生广告"), this.nativeAd && (this.nativeAd.destroy(), this.nativeAd = null))
		}
		gotoOther(t, e, i, s = null) {
			this.ch && e && this.ch.navigateToMiniGame({
				pkgName: e,
				path: i,
				success: function() {
					console.log("打开成功: pkgName = ", e), s && s(!0)
				},
				fail: function(t) {
					console.log("打开失败: pkgName = ", e), s && s(!1)
				}
			})
		}
		installShortcut(t = null) {
			let e = Laya.Browser.window.qg;
			this.ch && (console.log("点击 创建桌面图标"), this.create_shortcut_time = Laya.Browser.now(), e.hasShortcutInstalled({
				success: i => {
					this.isShortcut = !1, console.log("桌面图标是否存在:", i), 0 == i && e.installShortcut({
						success: () => {
							console.log("创建桌面图标成功", i), t && t(!0)
						},
						fail: e => {
							console.log("创建桌面图标失败", e), t && t(!0)
						},
						complete: () => {
							console.log("创建桌面图标完成")
						}
					})
				},
				fail: function(t) {},
				complete: function() {}
			}))
		}
		hasShortcutInstalled(t = null) {
			this.ch && this.ch.hasShortcutInstalled({
				success: e => {
					t && t(e)
				},
				fail: function(e) {
					t && t(!1)
				},
				complete: function() {}
			})
		}
		reportMonitor() {
			this.ch && (console.log("reportMonitor：", this.ch), this.ch.reportMonitor("game_scene", 0))
		}
		setKeepScreenOn(t = !0) {
			this.ch && this.ch.setKeepScreenOn({
				keepScreenOn: t,
				success(t) {
					console.log("屏幕常亮开启")
				},
				fail(t) {
					console.log("setKeepScreenOn调用失败")
				}
			})
		}
		exitApplication() {
			this.ch && this.ch.exitApplication({
				success: function() {
					console.log("exitApplication success")
				},
				fail: function() {
					console.log("exitApplication fail")
				},
				complete: function() {
					console.log("exitApplication complete")
				}
			})
		}
		showCustomAd() {}
		hideCustomAd() {}
	}
	class $ {
		static setScale(t) {
			t.scale(Laya.stage.width / 720, Laya.stage.width / 720)
		}
		static getScaleRate() {
			return Laya.stage.width / 720
		}
		static mouseX() {
			return Laya.stage.mouseX / $.getScaleRate()
		}
		static mouseY() {
			return Laya.stage.mouseY / $.getScaleRate()
		}
		static height() {
			return Laya.stage.height
		}
		static width() {
			return Laya.stage.width
		}
		static localToGlobal(t, e) {
			var i = t.localToGlobal(e, !1);
			return i.x = i.x / $.getScaleRate(), i.y = i.y / $.getScaleRate(), i
		}
		static disrupt() {
			return function() {
				return .5 - Math.random()
			}
		}
	}
	class tt extends Y {
		constructor(t) {
			super(t), this.videoAd = null, this.videoId = "1317acddbabd47ecb696153fb6f53358", this.bannerAd = null, this.banIndex = 0, this.bannerId = ["898a20891444434b889bea1a60dc1e4d"], this.insertAd = null, this.insertId = "c19ecdee78b148998d3bdbe9f4410247", this.nativeAd = null, this.nativeCurrentAd = null, this.nativeId = "06dc42bfa10a41fc97543d8fb8f11975", this.adList = [], this.nativeId_time = 0, this.customAd_time = 0, this.boxBannerAd = null, this.boxBannerAdId = "ad83db0e2fb3427d9d45817701fa67d9", this.boxPortalAd = null, this.boxPortalAdId = "e589d8e63a374c9bb92645e31541f53c", this.is_hide_portal_ad = !1, this.customAd = null, this.customId = ["3a0f3a15105045679050cab3c652d8d2", "171afeffc7544a05a7b0f00ed391d502"], this.interstitial_time = 0, this.isShortcut = !0, this.create_shortcut_time = 0, this.bannerAdHeight = 200, this.show_hint = !0, this.customIdIndex = -1, this.videoCallback = null, this.getSystem(), this.onShowAlways(), this.createVideoAd(), this.createBoxBannerAd(), this.onHide(), Laya.timer.once(2e3, this, () => {
				this.createBoxPortalAd()
			}), F.go_game_time = Laya.Browser.now()
		}
		createVideoAd() {
			if (this.ch) {
				this.videoAd = qg.createRewardedVideoAd({
					posId: this.videoId
				}), this.videoAd.onLoad(() => {
					console.log("视频创建成功"), V.videoEnable = !0, this.videoAd.offLoad()
				}), this.videoAd.onError(t => {
					V.videoEnable = !1, console.log("加载视频失败：", t)
				});
				let t = t => {
					console.log("视频观看回调", t), this.isShortcut = !0, t && t.isEnded ? (console.log("视频观看成功"), this.videoCallback && this.videoCallback(!0)) : (console.log("视频观看失败"), this.videoCallback && this.videoCallback(!1)), F.sound_switch && (Laya.SoundManager.muted = !1)
				};
				this.videoAd.onClose(t)
			}
		}
		showVideoAd(t = null, e = !0) {
			console.info("看视频")
		}
		createBannerAd() {
			if (this.ch) {
				this.bannerAdHeight = 200;
				let t = this.refreshBanId();
				this.bannerAd = qg.createBannerAd({
					posId: t,
					style: {}
				});
				let e = t => {
					console.log("banner大小：", t), this.bannerAdHeight = t.height, this.bannerAd.offSize()
				};
				this.bannerAd.onSize(e), this.bannerAd.onError(t => {
					console.log("创建banner广告报错: ", t)
				}), this.hideBannerAd()
			}
		}
		refreshBanId() {
			return this.banIndex++, this.banIndex > this.bannerId.length - 1 && (this.banIndex = 0), this.bannerId[this.banIndex]
		}
		destroyBannerAd() {
			this.bannerAd && this.bannerAd.destroy()
		}
		resetBannerAd() {
			this.ch && (this.destroyBannerAd(), this.createBannerAd())
		}
		showBannerAd() {
			this.ch && X.game_banner && (console.log("展示banner"), this.bannerAd && this.bannerAd.show().then(() => {
				console.log("banner广告展示成功")
			}).catch(t => {
				console.log("banner广告展示失败", t)
			}))
		}
		hideBannerAd() {
			this.bannerAd && (console.log("隐藏banner"), this.bannerAd.hide())
		}
		createInterstitialAd() {
			this.ch && (this.insertAd = this.ch.createInterstitialAd({
				posId: this.insertId
			}), this.insertAd.show().then(() => {
				console.log("插屏广告展示成功")
			}).catch(t => {
				console.log("插屏广告失败：", t)
			}))
		}
		showInterstitialAd(t = null, e = !1) {
			if (this.ch) {
				if (!e) {
					if (Laya.Browser.now() - F.go_game_time < X.fist_screen_time || Laya.Browser.now() - this.interstitial_time < X.interval_screen_time) return void(t && t(!1));
					console.log("显示插屏", Laya.Browser.now() - this.interstitial_time), this.interstitial_time = Laya.Browser.now()
				}
				console.log("显示插屏1"), this.insertAd = this.ch.createInterstitialAd({
					posId: this.insertId
				}), this.insertAd.show().then(() => {
					console.log("插屏广告展示成功"), t && t(!0)
				}).catch(e => {
					console.log("插屏广告展示失败：", e), t && t(!1)
				}), this.insertAd.offClose(), this.insertAd.onClose(() => {
					t && t(!1)
				})
			}
		}
		createNativeAd(t = null) {
			if (this.ch) {
				if (console.log("创建原生广告", this.nativeId), Laya.Browser.now() - this.nativeId_time < 2e4) return;
				this.nativeId_time = Laya.Browser.now(), this.nativeAd = this.ch.createNativeAd({
					posId: this.nativeId
				}), this.nativeAd.onLoad(e => {
					console.log("原生广告加载完毕", e.adList), this.adContent = e.adList[0], t && t(e.adList[0]), this.nativeAd.offLoad()
				}), this.nativeAd.onError(t => {
					console.log("原生广告错误", t), this.nativeAd.offError()
				}), this.nativeAd.load()
			}
		}
		destroyNativeAd() {
			this.ch && this.nativeAd && (console.log("销毁原生广告"), this.nativeAd.destroy(), this.nativeAd = null, this.adContent = null)
		}
		clickNativeAd() {
			this.ch && this.nativeAd && this.adContent && (console.info("点击原生广告"), this.nativeAd.reportAdShow({
				adId: this.adContent.adId + ""
			}), this.nativeAd.reportAdClick({
				adId: this.adContent.adId + ""
			}))
		}
		showNativeAd() {
			this.ch && this.nativeAd && this.adContent && this.nativeAd.reportAdShow({
				adId: this.adContent.adId + ""
			})
		}
		createCustomAd(t, e, i, s = 0, n = !0, a = null) {
			this.ch && (this.customIdIndex = i, Laya.Browser.width / Laya.Browser.height < .5 && (e += s), e = Z.pxTodb(e * $.getScaleRate()), this.customAd && this.customAd.destroy(), console.info("创建原生模板广告：", this.customId[i], e), this.customAd = 0 == t && 0 == e ? this.ch.createCustomAd({
				posId: this.customId[i]
			}) : this.ch.createCustomAd({
				posId: this.customId[i],
				style: {
					left: t,
					top: e
				}
			}), this.customAd.onLoad(() => {
				console.info("原生模板广告加载成功")
			}), n && this.showCustomAd(), this.customAd.onError(t => {
				console.log("原生模板广告加载失败", t)
			}), this.customAd.offClose(), this.customAd.onClose(() => {
				a && a(!1)
			}))
		}
		showCustomAd(t = null) {
			console.info("显示原生"), this.customAd && this.customAd.show().then(() => {
				console.log("原生模板广告展示完成"), t && t(!0)
			}).catch(e => {
				this.customIdIndex = -1, console.log("原生模板广告展示失败", JSON.stringify(e)), t && t(!1)
			})
		}
		hideCustomAd() {
			console.info("隐藏原生"), this.customAd && this.customAd.hide()
		}
		createBoxBannerAd() {
			this.ch && (this.ch.createBoxBannerAd ? (this.destroyBoxBannerAd(), this.boxBannerAd = this.ch.createBoxBannerAd({
				posId: this.boxBannerAdId
			}), this.boxBannerAd.onError(t => {
				console.log("互推横幅错误：", t), this.boxBannerAd.offError()
			}), console.info("创建互推横幅:", this.boxBannerAd)) : console.log("快应用平台版本号低于1076，暂不支持互推盒子相关 API"))
		}
		showBoxBannerAd(t = null) {
			this.boxBannerAd ? (console.log("显示互推横幅"), this.boxBannerAd.show().then(() => {
				console.log("显示互推横幅广告成功"), t && t(!0)
			}).catch(function(e) {
				console.log("互推横幅显示失败:", e), t && t(!1)
			})) : t && t(!1)
		}
		hideBoxBannerAd() {
			this.boxBannerAd && this.boxBannerAd.hide().then(function() {
				console.log("互推横幅隐藏成功")
			}).catch(function(t) {
				console.log("互推横幅隐藏失败:", t)
			})
		}
		destroyBoxBannerAd() {
			null != this.boxBannerAd && (this.boxBannerAd.destroy(), this.boxBannerAd = null)
		}
		createBoxPortalAd() {
			if (this.ch && this.ch.createBoxPortalAd) {
				console.info("创建9宫格：", this.boxPortalAdId);
				let t = Z.pxTodb(Z.isX() ? 320 : 300);
				this.boxPortalAd = this.ch.createBoxPortalAd({
					posId: this.boxPortalAdId,
					image: "",
					marginTop: t
				}), this.boxPortalAd.onError(t => {
					console.log("互推9宫格错误：", t)
				}), this.boxPortalAd.onClose(() => {
					console.log("互推9宫格关闭：", this.is_hide_portal_ad), this.boxPortalAd.isDestroyed || (this.is_hide_portal_ad || this.showBoxPortalAd(), Z.eventDis.event("native_close"))
				}), this.boxPortalAd.onShow(t => {
					console.log("互推9宫格展开：", t), Z.eventDis.event("native_open")
				}), this.showBoxPortalAd(), console.info("创建互推9宫格1:", this.boxPortalAd)
			}
		}
		showBoxPortalAd(t = !1) {
			this.is_hide_portal_ad = !1, this.boxPortalAd && this.boxPortalAd.show().then(() => {
				console.log("互推9宫格显示成功")
			}).catch(t => {
				console.log("显示互推9宫格错误：", t)
			})
		}
		hideBoxPortalAd() {
			this.is_hide_portal_ad = !0, this.boxPortalAd && this.boxPortalAd.hide().then(function() {
				console.log("互推9宫格隐藏成功")
			}).catch(function(t) {
				console.log("互推9宫格隐藏失败:" + t.errCode + "," + t.errMsg)
			})
		}
		destroyBoxPortalAd() {
			this.boxPortalAd && (this.hideBoxPortalAd(), this.boxPortalAd.isDestroyed = !0, this.boxPortalAd.destroy(), this.boxPortalAd = null)
		}
		installShortcut() {
			let t = this.ch = Laya.Browser.window.qg;
			this.ch && (this.create_shortcut_time = Laya.Browser.now(), t.installShortcut({
				success: function() {
					console.log("创建成功")
				},
				fail: function(t) {
					console.log("创建失败", t)
				},
				complete: function() {}
			}))
		}
		hasShortcutInstalled(t = null) {
			this.ch = Laya.Browser.window.qg;
			this.ch && this.ch.hasShortcutInstalled({
				success: function(e) {
					t && t(e)
				},
				fail: function(e) {
					t && t(!1)
				}
			})
		}
		share(t = null) {
			this.ch && this.ch.share({
				success: () => {
					t && t(!0), this.showToast("分享成功")
				},
				fail: (e, i) => {
					t && t(!1), this.showToast("分享失败")
				},
				cancel: () => {
					t && t(!1), this.showToast("取消分享")
				},
				complete: function() {}
			})
		}
		gotoOther(t, e, i = null) {
			this.ch && e && this.ch.navigateToMiniGame({
				pkgName: e,
				success: function() {
					console.log("打开成功: pkgName = ", e), i && i(!0)
				},
				fail: function(t) {
					console.log("打开失败: pkgName = ", e), i && i(!1)
				}
			})
		}
		showToast(t, e = "none", i = 2e3) {
			this.ch && this.ch.showToast({
				message: t,
				icon: e,
				duration: i
			})
		}
		setKeepScreenOn(t = !0) {
			this.ch && this.ch.setKeepScreenOn({
				keepScreenOn: t,
				success(t) {
					console.log("屏幕常亮开启")
				},
				fail(t) {
					console.log("setKeepScreenOn调用失败")
				}
			})
		}
		exitApplication() {
			this.ch && this.ch.exitApplication({
				success: function() {
					console.log("exitApplication success")
				},
				fail: function() {
					console.log("exitApplication fail")
				},
				complete: function() {
					console.log("exitApplication complete")
				}
			})
		}
	}
	class et extends Y {
		constructor(t) {
			super(t), this.videoAd = null, this.videoId = "yfZC8xjF", this.bannerAd = null, this.banIndex = 0, this.bannerId = ["ivUXNGW6"], this.insertAd = null, this.insertId = "Lf0YWzqi", this.qg = null, this.qg = Laya.Browser.window.qg, this.getSystemInfo(), this.onShowAlways(), this.createBannerAd(), this.createVideoAd(), this.createInterstitialAd(), this.onHide()
		}
		getSystemInfo() {
			if (this.qg) {
				let t = V.systemInfo = this.qg.getSystemInfoSync();
				V.screenWidth = t.screenWidth, V.screenHeight = t.screenHeight, console.log("系统参数：", t)
			}
		}
		share(t = null, e = "article", i = {}) {
			this.ch && K.shareDataLoad(() => {
				let s = K.getOneShareData(),
					n = Laya.Browser.now() + "" + ~~(1e4 * (.1 + Math.random() / 2));
				"article" == e ? this.ch.shareAppMessage({
					title: s.title,
					imageUrl: s.img_url,
					query: "&sn=" + n + "&share_id=" + s.id,
					extra: i,
					success() {
						console.log("分享成功"), t && t(!0)
					},
					fail(e) {
						console.log("分享失败"), t && t(!1)
					}
				}) : this.ch.shareAppMessage({
					channel: e,
					title: s.title,
					imageUrl: s.img_url,
					query: "&sn=" + n + "&share_id=" + s.id,
					extra: i,
					success() {
						console.log("分享成功"), t && t(!0)
					},
					fail(e) {
						console.log("分享失败"), t && t(!1)
					}
				})
			})
		}
		createVideoAd() {
			this.qg
		}
		showVideoAd(t = null) {
			this.qg && this.qg && (this.videoAd = this.qg.createRewardedVideoAd({
				adUnitId: this.videoId
			}), this.videoAd.load(), this.videoAd.offLoad(), this.videoAd.onLoad(() => {
				console.log("励视频加载成功"), V.videoEnable = !0, this.videoAd.show(), this.videoAd.offLoad()
			}), this.videoAd.offRewarded(), this.videoAd.onRewarded(() => {
				console.log("激励视频广告完成，发放奖励"), t && t(!0), this.videoAd.offRewarded()
			}), this.videoAd.onError(), this.videoAd.onError(t => {
				console.log("视频广告拉取失败", t), this.videoAd.onError()
			}))
		}
		createBannerAd(t = !1) {
			if (this.qg) {
				let t = this.refreshBanId();
				this.bannerAd = this.qg.createBannerAd({
					adUnitId: this.bannerId,
					adIntervals: t,
					style: {
						top: -1
					}
				})
			}
		}
		refreshBanId() {
			return this.banIndex++, this.banIndex > this.bannerId.length - 1 && (this.banIndex = 0), this.bannerId[this.banIndex]
		}
		destroyBannerAd() {}
		showBannerAd() {
			this.qg && (console.log("显示 banner"), this.bannerAd.show())
		}
		hideBannerAd() {
			this.qg && (console.log("隐藏 banner"), this.bannerAd.hide())
		}
		createInterstitialAd() {
			this.qg && (this.insertAd = this.qg.createInsertAd({
				adUnitId: this.insertId
			}), this.insertAd.hide())
		}
		showInterstitialAd() {
			console.log("显示插屏广告"), this.qg && (this.insertAd.load(), this.insertAd.onLoad(() => {
				console.log("insert 广告加载成功"), this.insertAd.show(), this.insertAd.offLoad()
			}))
		}
		showToast(t, e = "none", i = 2e3) {
			this.ch && this.ch.showToast({
				message: t,
				duration: i
			})
		}
	}
	class it extends Y {
		constructor(t) {
			super(t), this.videoAd = null, this.videoId = "159231", this.bannerAd = null, this.banIndex = 0, this.bannerId = ["159225", "159225"], this.insertAd = null, this.insertId = "159226", this.nativeAd = null, this.nativeId = "159230", this.videoCallback = null, this.addEventListener(), this.createVideoAd()
		}
		createVideoAd() {
			if (this.ch) {
				console.log("点击创建视频"), this.videoAd = this.ch.createRewardVideoAd(), this.videoAd.onLoad(() => {
					console.log("励视频加载成功"), V.videoEnable = !0, this.videoAd.offLoad()
				}), this.videoAd.onError(t => {
					console.log("视频创建错误：", t), V.videoEnable = !1
				}), this.videoAd.load();
				let t = t => {
					t && t.isEnded ? (console.log("视频观看成功"), this.videoCallback && this.videoCallback(!0)) : (console.log("视频观看失败"), this.videoCallback && this.videoCallback(!1))
				};
				this.videoAd.onClose(t)
			}
		}
		showVideoAd(t = null) {
			console.log("点击观看视频", V.videoEnable), this.ch && this.videoAd && (this.videoCallback = t, this.videoAd.load().then(() => {
				this.videoAd.show()
			}).catch(t => {
				console.log("拉取视频失败", t), this.showToast("暂无广告，请稍后再试")
			}))
		}
		createBannerAd() {
			if (this.ch) {
				let t = this.refreshBanId();
				this.bannerAd = this.ch.createBannerAd({
					adUnitId: t,
					adIntervals: 30,
					style: {
						gravity: 7
					}
				}), this.bannerAd.onLoad(() => {
					console.log("banner创建成功 id=", t), this.bannerAd.offLoad()
				}), this.bannerAd.onResize(() => {
					console.log("Resize", this.bannerAd), this.bannerAd.offResize()
				}), this.bannerAd.onError(t => {
					console.log("创建banner失败: ", t)
				}), this.hideBannerAd()
			}
		}
		refreshBanId() {
			return this.banIndex++, this.banIndex > this.bannerId.length - 1 && (this.banIndex = 0), this.bannerId[this.banIndex]
		}
		destroyBannerAd() {
			console.log("this.bannerAd：", this.bannerAd), this.bannerAd && (console.log("销毁banner"), this.bannerAd.destroy(), this.bannerAd = null)
		}
		resetBannerAd() {
			this.ch && (console.log("刷新banner"), this.destroyBannerAd(), this.createBannerAd())
		}
		showBannerAd() {
			this.ch && this.bannerAd && (console.log("显示banner", this.bannerAd), this.bannerAd.show())
		}
		hideBannerAd() {
			this.ch && this.bannerAd && this.bannerAd.hide()
		}
		createInterstitialAd() {
			this.ch
		}
		showInterstitialAd() {
			console.log("显示插屏广告"), this.ch
		}
		shareAppMessage() {
			this.ch && K.shareDataLoad(() => {
				let t = K.getOneShareData(),
					e = Laya.Browser.now() + "" + ~~(1e4 * (.1 + Math.random() / 2));
				this.ch.shareAppMessage({
					title: t.title,
					imageUrl: t.img_url,
					query: "&sn=" + e + "&share_id=" + t.id,
					success: t => {
						console.log("shareAppMessage share success", JSON.stringify(t))
					},
					fail: t => {
						console.log("shareAppMessage share fail", JSON.stringify(t))
					}
				})
			})
		}
		reportUserAction() {
			this.ch && this.ch.reportUserAction({
				scene: "xxx",
				action: "PLAY",
				score: "100",
				success: function(t) {
					console.log(t)
				},
				fail: function(t) {
					console.error(t)
				}
			})
		}
		addEventListener() {
			this.ch && document.addEventListener("visibilitychange", t => {
				console.log(document.visibilityState), "visible" == document.visibilityState && console.log("回到前台"), "hidden" == document.visibilityState && console.log("退出前台")
			})
		}
		showToast(t, e = "none", i = 2e3) {
			this.ch && this.ch.showToast({
				content: t,
				duration: i
			})
		}
	}
	class st {
		constructor(t) {
			console.log("platform:", t), st.platform = t, this.initPlatform()
		}
		initPlatform() {
			console.log("CM.platform:", st.platform), st.platform == st.CH_WEIXIN ? st.mainCH = new z(st.onWindow()) : st.platform == st.CH_QQ ? st.mainCH = new j(st.onWindow()) : st.platform == st.CH_ZJ ? st.mainCH = new q(st.onWindow()) : st.platform == st.CH_BAIDU ? st.mainCH = new J(st.onWindow()) : st.platform == st.CH_OPPO ? st.mainCH = new Q(st.onWindow()) : st.platform == st.CH_VIVO ? st.mainCH = new tt(st.onWindow()) : st.platform == st.CH_MZ ? st.mainCH = new et(st.onWindow()) : st.platform == st.CH_UC && (st.mainCH = new it(st.onWindow()))
		}
		static onWindow() {
			return st.platform == st.CH_WEIXIN ? Laya.Browser.window.wx : st.platform == st.CH_QQ ? Laya.Browser.window.qq : st.platform == st.CH_ZJ ? Laya.Browser.window.tt : st.platform == st.CH_BAIDU ? Laya.Browser.window.swan : st.platform == st.CH_OPPO ? Laya.Browser.window.qg : st.platform == st.CH_VIVO ? Laya.Browser.window.qg : st.platform == st.CH_XIAOMI ? Laya.Browser.window.qg : st.platform == st.CH_HUAWEI ? Laya.Browser.window.hbs : st.platform == st.CH_MZ ? Laya.Browser.window.mz : st.platform == st.CH_UC ? Laya.Browser.window.uc : void console.log("CM:", 4)
		}
		static onMiniGame() {
			return console.info("渠道：", st.platform), st.platform == st.CH_WEIXIN ? Laya.Browser.onMiniGame : st.platform == st.CH_QQ ? "qq" in Laya.Browser.window && Laya.Browser.userAgent.indexOf("MiniGame") > -1 : st.platform == st.CH_ZJ ? Laya.Browser.onMiniGame : st.platform == st.CH_BAIDU ? Laya.Browser.onBDMiniGame : st.platform == st.CH_OPPO ? Laya.Browser.onQGMiniGame : st.platform == st.CH_VIVO ? Laya.Browser.onVVMiniGame : st.platform == st.CH_XIAOMI ? Laya.Browser.onKGMiniGame : st.platform == st.CH_HUAWEI || st.platform != st.CH_MZ && (st.platform != st.CH_UC && void 0)
		}
		static getPlatform() {
			return this.platform
		}
		static isPlatform(t) {
			return t == this.platform
		}
	}
	st.mainCH = null, st.CH_WEIXIN = "WX", st.CH_QQ = "QQ", st.CH_ZJ = "ZJ", st.CH_BAIDU = "BD", st.CH_VIVO = "VIVO", st.CH_OPPO = "OPPO", st.CH_HUAWEI = "HW", st.CH_XIAOMI = "XM", st.CH_MZ = "MZ", st.CH_UC = "UC", st.platform = st.CH_VIVO;
	class nt extends Laya.Script {
		constructor() {
			super(), this.positionType = 1, this.switchType = 0, this.start_time = 0
		}
		onEnable() {
			this.start_time = Laya.Browser.now(), this.node = this.owner, this.bg = this.node.getChildByName("bg"), this.btnAd = this.node.getChildByName("btnAd"), this.icon = this.node.getChildByName("icon"), this.btnClose = this.bg.getChildByName("btnClose"), this.icon.on(Laya.Event.CLICK, this, this.onBtnAd), this.btnAd.on(Laya.Event.CLICK, this, this.onBtnAd), this.btnClose.on(Laya.Event.CLICK, this, this.onBtnClose), this.initPosition(), this.initData()
		}
		initData() {}
		native_open() {
			this.node.visible = !1
		}
		native_close() {
			3 != this.switchType && this.show(), 1 == this.switchType && this.show(), 2 != this.switchType || Z.isX() || this.onBtnClose(), 4 == this.switchType && this.onBtnClose()
		}
		initPosition() {
			1 == this.positionType && (this.node.y = $.height() - this.node.height)
		}
		initSwitch() {
			1 == this.switchType && (this.node.visible = !1), 2 != this.switchType || Z.isX() || this.onBtnClose(), 3 == this.switchType && this.onBtnClose(), 4 == this.switchType && this.onBtnClose(), 6 != this.switchType || Z.isX() || (this.node.height = 200, this.icon.height = 200, this.bg.height = 200)
		}
		refreshAd() {
			this.node.visible = !1, 1 == this.switchType && X.advertisement_game && X.advertisement && st.mainCH.adContent && Laya.timer.once(X.ad_game_show_time, this, () => {
				this.show(), Laya.timer.once(X.ad_game_hide_time, this, () => {
					this.node.visible = !1, this.refreshAd()
				})
			})
		}
		stopRefresh() {
			1 == this.switchType && (this.node.visible = !1, Laya.timer.clearAll(this))
		}
		show() {
			if (X.advertisement && st.mainCH.adContent && X.showAd()) {
				this.node.visible = !0, st.mainCH.showNativeAd();
				let t = st.mainCH.adContent.imgUrlList[0] ? st.mainCH.adContent.imgUrlList[0] : st.mainCH.adContent.icon;
				t.indexOf("jpg?") > -1 && (t = t.split("jpg?")[0] + "jpg"), t.indexOf("png?") > -1 && (t = t.split("png?")[0] + "png"), this.icon.skin = t
			} else this.node.visible = !1
		}
		onBtnAd() {
			console.info("点击了"), st.mainCH.clickNativeAd()
		}
		onBtnClose() {
			console.info("点击了关闭"), this.node.visible = !1
		}
		onDisable() {
			console.info("关闭了广告"), this.node && Laya.Browser.now() - this.start_time > 500 && (Z.eventDis.off("native_open", this, this.native_open), Z.eventDis.off("native_close", this, this.native_close))
		}
	}
	class at {
		constructor() {
			this.CLICK_MAP = "ClickMap", this.CLICK_BUILD = "ClickBuild", this.COLLECTIVE_BUILD = "CollectiveBuild", this.SET_POS_MENU = "SetBuildMenuPos", this.SHOW_MENU = "ShowMenu", this.HIDE_MENU = "HideMenu", this.OFF_SHOW_MENU = "OffShowMenu", this.OFF_HIDE_MENU = "OffHideMenu", this.BUILD_BUILDORUP = "BuildOrUp", this.BUILD_BUILDORUP_ADV = "BuildOrUpADV", this.BUILD_CLICKBLICK_INIT = "ClickBlockInit", this.BUILD_UPBUILD = "BuildUpBuild", this.BUILD_NEW = "build", this.BUILD_BUILD_DISMANTLE = "BuildBuildDismantle", this.BUILD_HANDLEROOMBUFF = "BuildHandleRoomBuff", this.BUILD_FINDDOOR = "BuildFindDoor", this.BUILD_FINDBEDANDDOOR = "BuildFindBedAndDoor", this.BUILD_FINDROOM = "BuildFindRoom", this.BUILD_GOTOBED = "BuildGoToBed", this.BUILD_GET_ROOMALLBLOCK = "BuildGetRoomAllBlock", this.BUILD_FINDBLOCKPOS = "BuildFindBlockPos", this.BUILD_PARALYSIS_ON = "BuildParalysis_on", this.BUILD_SKILLEVENT = "BuildSkillEvent", this.BUILD_SETTWINKSKin = "BuildSetTWinkSkin", this.BUILD_SET_ROOM_DIE = "BuildSetRoomDie", this.BUILD_GET_AT_BUILDCOUNT = "BuildGetBuildAtCount", this.BUILD_GET_GAME_BUILDCOUNT = "BuildGetGameCount", this.BUILD_REACHC = "BuildReachConditions", this.MAP_BUILD_NEW = "NewBuild", this.MAP_UPBUILD = "MapUpBuild", this.MAP_BUILD_DISMANTLE = "MapBuildDismantle", this.MAP_DISTANCE = "MapReturnDistance", this.MAP_ADD_ACTIVITY = "MapAddActivity", this.MAP_GET_ACTIVITYMAP = "MapGetActivityMap", this.MAP_MAPMOVE = "MapMapMove", this.MAP_DEMOLISH = "MAPDemolish", this.MGM_START_END_PATH = "MGMGetStartPos_EndPos_Path", this.MGM_PROTAGONIST_MOVE = "MGMProtagonistMove", this.MGM_AIORTROLLIS_MOVE = "MGMAIOrTrollIsMove", this.MGM_FIND_AROUND_BUILD = "MGMFindTheTarget", this.MGM_GET_ROOMCOUNT = "MGMGetRoomCount", this.MGM_GET_BLOCKFINDROOM = "MGMGetBlockIsRoom", this.MGM_SET_BLOCKWALKABLE = "MGMSetBlockWalkable", this.MGM_SET_BLOCKDYNWALKABLE = "MGMSetBlockDynWalkable", this.MGM_GET_OPENSPACE = "MGMGetOpenSpace", this.MGM_MONTIORPLAYERAROUND = "MGMMonitorPlayerAround", this.MGM_FINDPOSBLOCK = "MGMFindPosBLock", this.MGM_BUILDDIE = "MGMBuildDie", this.MGM_GET_DATAPOSTMAPPOS = "MGMGetDataPosTMapPos", this.MGM_GET_MAPPOSTSCENEPOS = "MGMGetMapPosTScenePos", this.MGM_GET_BLOCKPOSS = "MGMGetBlockPosS", this.MGM_GET_POSAROUND = "MGMGetPosAroundBuild", this.MGM_IS_SCREENRANGE = "MGMIsScreenRange", this.MGM_ROOMBLACK = "MGMRoomBlack", this.MGM_LOOKPOS = "MGMLookPos", this.MGM_POSINSAFE = "MGMPosInSafe", this.TL_GET_AROUNDPLAYER = "TLGetAroundPlayer", this.TL_MOVESELECT_HANDLE = "TLMoveSelectHandle", this.TL_MOVEOVER_HANDLE = "TLMoveOverHandle", this.TL_STARTATTACK = "TLStartAttack", this.TL_TROLLHIT = "TLTrollHit", this.TL_TROLLMOVE = "TLTrollMove", this.TL_TROLL_SAFE = "TLTrollSafe", this.TL_MOVESPEED_REDUCTION = "TLMoveSpeedReduction", this.TL_VERTIGO_REDUCTION = "TLVertigoReduction", this.PAIL_FILTERDIEAI = "PAILFilterDieAI", this.PAIL_KILLPLAYER = "PAILKillPlayer", this.PAIL_SET_ATTACKEDAI = "PAILSetAtackedAI", this.OINPUT_Event_RS_ON = "OInPutEvent_RS_on", this.OINPUT_Event_ON = "OInPutEvent_on", this.OINPUT_Event_OFF = "OInPutEvent_off", this.PLOGIC_OFFEVENTHANDLE = "PLogicOffEventHandle", this.PLOGIC_TESTAROUNDBLOCK = "PLogicTestAroundBlock", this.GM_STARTGAME = "GMStartGame", this.GM_GAMEOVER = "GMGameOver", this.UIGM_SHOW = "UIGMshow", this.UIGM_HIDE = "UIGMhide", this.UIGM_TIPS = "UIGMTips", this.UIGM_SHOWSKILL = "UIGMShowSkill", this.UIGM_HIDESKILL = "UIGMHideSkill", this.UIGM_PLAYERHIT = "UIGMPlayerHit", this.UIGM_PLAYERHITEFFECT = "UIGMplayerHitEffect", this.SKILL_ADDUPEVENT = "SkillAddEvent", this.TROLLSKILL_ADDUPEVENT = "TrollSkillAddEvent", this.BATTLEUI_TASKCOMPLETE = "BattleUITaskComplete", this.MAINLG_TROLLUPDATA = "MainLgTrollUpData", this.CLICK_MAP = "ClickMap", this.CLICK_BUILD = "ClickBuild", this.COLLECTIVE_BUILD = "CollectiveBuild", this.SET_POS_MENU = "SetBuildMenuPos", this.SHOW_MENU = "ShowMenu", this.HIDE_MENU = "HideMenu", this.OFF_SHOW_MENU = "OffShowMenu", this.OFF_HIDE_MENU = "OffHideMenu", this.BUILD_BUILDORUP = "BuildOrUp", this.BUILD_BUILDORUP_ADV = "BuildOrUpADV", this.BUILD_CLICKBLICK_INIT = "ClickBlockInit", this.BUILD_UPBUILD = "BuildUpBuild", this.BUILD_NEW = "build", this.BUILD_BUILD_DISMANTLE = "BuildBuildDismantle", this.BUILD_HANDLEROOMBUFF = "BuildHandleRoomBuff", this.BUILD_FINDDOOR = "BuildFindDoor", this.BUILD_FINDBEDANDDOOR = "BuildFindBedAndDoor", this.BUILD_FINDROOM = "BuildFindRoom", this.BUILD_GOTOBED = "BuildGoToBed", this.BUILD_GET_ROOMALLBLOCK = "BuildGetRoomAllBlock", this.BUILD_FINDBLOCKPOS = "BuildFindBlockPos", this.BUILD_PARALYSIS_ON = "BuildParalysis_on", this.BUILD_SKILLEVENT = "BuildSkillEvent", this.BUILD_SETTWINKSKin = "BuildSetTWinkSkin", this.BUILD_SET_ROOM_DIE = "BuildSetRoomDie", this.BUILD_GET_AT_BUILDCOUNT = "BuildGetBuildAtCount", this.BUILD_GET_GAME_BUILDCOUNT = "BuildGetGameCount", this.BUILD_REACHC = "BuildReachConditions", this.MAP_BUILD_NEW = "NewBuild", this.MAP_UPBUILD = "MapUpBuild", this.MAP_BUILD_DISMANTLE = "MapBuildDismantle", this.MAP_DISTANCE = "MapReturnDistance", this.MAP_ADD_ACTIVITY = "MapAddActivity", this.MAP_GET_ACTIVITYMAP = "MapGetActivityMap", this.MAP_MAPMOVE = "MapMapMove", this.MAP_DEMOLISH = "MAPDemolish", this.MGM_START_END_PATH = "MGMGetStartPos_EndPos_Path", this.MGM_PROTAGONIST_MOVE = "MGMProtagonistMove", this.MGM_AIORTROLLIS_MOVE = "MGMAIOrTrollIsMove", this.MGM_FIND_AROUND_BUILD = "MGMFindTheTarget", this.MGM_GET_ROOMCOUNT = "MGMGetRoomCount", this.MGM_GET_BLOCKFINDROOM = "MGMGetBlockIsRoom", this.MGM_SET_BLOCKWALKABLE = "MGMSetBlockWalkable", this.MGM_SET_BLOCKDYNWALKABLE = "MGMSetBlockDynWalkable", this.MGM_GET_OPENSPACE = "MGMGetOpenSpace", this.MGM_MONTIORPLAYERAROUND = "MGMMonitorPlayerAround", this.MGM_FINDPOSBLOCK = "MGMFindPosBLock", this.MGM_BUILDDIE = "MGMBuildDie", this.MGM_GET_DATAPOSTMAPPOS = "MGMGetDataPosTMapPos", this.MGM_GET_MAPPOSTSCENEPOS = "MGMGetMapPosTScenePos", this.MGM_GET_BLOCKPOSS = "MGMGetBlockPosS", this.MGM_GET_POSAROUND = "MGMGetPosAroundBuild", this.MGM_IS_SCREENRANGE = "MGMIsScreenRange", this.MGM_ROOMBLACK = "MGMRoomBlack", this.MGM_LOOKPOS = "MGMLookPos", this.TL_GET_AROUNDPLAYER = "TLGetAroundPlayer", this.TL_MOVESELECT_HANDLE = "TLMoveSelectHandle", this.TL_MOVEOVER_HANDLE = "TLMoveOverHandle", this.TL_STARTATTACK = "TLStartAttack", this.TL_TROLLHIT = "TLTrollHit", this.TL_MOVESPEED_REDUCTION = "TLMoveSpeedReduction", this.TL_VERTIGO_REDUCTION = "TLVertigoReduction", this.PAIL_FILTERDIEAI = "PAILFilterDieAI", this.PAIL_KILLPLAYER = "PAILKillPlayer", this.PAIL_SET_ATTACKEDAI = "PAILSetAtackedAI", this.OINPUT_Event_RS_ON = "OInPutEvent_RS_on", this.OINPUT_Event_ON = "OInPutEvent_on", this.PLOGIC_OFFEVENTHANDLE = "PLogicOffEventHandle", this.PLOGIC_TESTAROUNDBLOCK = "PLogicTestAroundBlock", this.GM_STARTGAME = "GMStartGame", this.GM_GAMEOVER = "GMGameOver", this.UIGM_SHOW = "UIGMshow", this.UIGM_HIDE = "UIGMhide", this.UIGM_TIPS = "UIGMTips", this.UIGM_SHOWSKILL = "UIGMShowSkill", this.UIGM_HIDESKILL = "UIGMHideSkill", this.UIGM_PLAYERHIT = "UIGMPlayerHit", this.UIGM_PLAYERHITEFFECT = "UIGMplayerHitEffect", this.SKILL_ADDUPEVENT = "SkillAddEvent", this.BATTLEUI_TASKCOMPLETE = "BattleUITaskComplete", this.MAINLG_TROLLUPDATA = "MainLgTrollUpData"
		}
	}
	class lt {
		constructor(t, e) {
			this._callback = null, this._this = null, this._callback = null, this._this = null, this._callback = t, this._this = e
		}
		notify(...t) {
			this._callback.call(this._this, ...t)
		}
		compar(t) {
			return this._this == t
		}
		notifyReturn(...t) {
			return this._callback.call(this._this, ...t)
		}
	}
	class ot extends at {
		constructor() {
			super(), this.listEvent = {}
		}
		static get instance() {
			return this._ins && null != this._ins || (this._ins = new ot), this._ins
		}
		AddListEvent(t, e, i) {
			this.listEvent[t] && (this.listEvent[t] = null), this.listEvent[t] = new lt(e, i)
		}
		removeListEvent(t, e) {
			this.listEvent[t] && delete this.listEvent[t]
		}
		Fire(t, ...e) {
			let i = this.listEvent[t];
			i && i.notify(...e)
		}
		FireReturn(t, ...e) {
			let i = this.listEvent[t];
			return i ? i.notifyReturn(...e) : null
		}
	}
	class ht {
		constructor() {
			this._isUp = !1, this._UpList = {}
		}
		static get instance() {
			return this._ins && null != this._ins || (this._ins = new ht), this._ins
		}
		AddUPEvent(t, e, i) {
			this._UpList[t] && (this._UpList[t] = null), this._UpList[t] = new lt(e, i)
		}
		removeListEvent(t) {
			this._UpList[t] && delete this._UpList[t]
		}
		removeAllListEvent() {
			for (let t in this._UpList) delete this._UpList[t]
		}
		HandleUPEvent() {
			if (this._isUp)
				for (let t in this._UpList) {
					let e = this._UpList[t];
					e && e.notify()
				}
		}
		StartGame() {
			this._isUp = !0
		}
		GameOver() {
			this._isUp = !1
		}
	}
	class rt {
		constructor() {
			this._listOnce = {}, this._listLoop = {}, this._gameTime = 0, this._listOnce = {}, this._listLoop = {}, this._gameTime = 0, ht.instance.AddUPEvent("TimeManager", this.UpTime, this), ht.instance.AddUPEvent("HandleOnceEvent", this.HandleOnceEvent, this), ht.instance.AddUPEvent("HandleLoopEven", this.HandleLoopEven, this)
		}
		static get instance() {
			return this._ins && null != this._ins || (this._ins = new rt), W.FPS.use_laya_timer = !1, this._ins
		}
		get gameTime() {
			return this._gameTime / 1e3
		}
		set gameTime(t) {
			this._gameTime = t
		}
		UpTime() {
			W.FPS.pushFPS();
			let t = W.FPS.getAvgDelta();
			this._gameTime += t
		}
		StartGame() {
			this._gameTime = 0
		}
		AfterAPeriodOfTime_Bool(t, e) {
			return this.gameTime - t >= e
		}
		AfterAPeriodOfTime_Proportion(t, e) {
			let i = this.gameTime - t;
			return i /= e, i *= 1e3, i = Math.floor(i), i /= 1e3, i = Math.min(1, i)
		}
		AddTimeOnceEvent(t, e, i, s) {
			this._listOnce[t] && (this._listOnce[t] = null), this._listOnce[t] = {
				observer: new lt(e, i),
				time: s,
				timeInterval: this.gameTime
			}
		}
		RemoveListOnceEvent(t) {
			this._listOnce[t] && delete this._listOnce[t]
		}
		AddTimeLoopEvent(t, e, i, s) {
			this._listLoop[t] && (this._listLoop[t] = null), this._listLoop[t] = {
				observer: new lt(e, i),
				time: s,
				timeInterval: this.gameTime
			}
		}
		RemoveListLoopEvent(t) {
			this._listLoop[t] && delete this._listLoop[t]
		}
		HandleOnceEvent() {
			for (let t in this._listOnce) {
				let e = this._listOnce[t];
				e && (this.AfterAPeriodOfTime_Bool(e.timeInterval, e.time) && (e.observer.notify(), this.RemoveListOnceEvent(t)))
			}
		}
		HandleLoopEven() {
			for (let t in this._listLoop) {
				let e = this._listLoop[t];
				e && (this.AfterAPeriodOfTime_Bool(e.timeInterval, e.time) && (e.observer.notify(), e.timeInterval = this.gameTime))
			}
		}
		GameOver() {
			this._listLoop = {}, this._listOnce = {}
		}
	}
	class _t {
		constructor() {
			this._room = null, this.ppTime = 0, this._ppTimeInterval = 3, this.soundManager = Laya.SoundManager, this._room = null, this.ppTime = 0, this._ppTimeInterval = 3, this.BG_music = {
				gameBGM: "bgm.ogg",
				gs: "gs.ogg"
			}, this.TB_sound = {
				troll_Wll: "troll_Wall.ogg",
				troll_attack: "troll_attack.ogg",
				troll_up: "troll_up.ogg",
				troll_rage: "troll_rage.ogg",
				build_at_attack: "at_attack.ogg",
				build_build: "build_build.ogg",
				build_up: "build_up.ogg",
				build_die: "build_die.ogg",
				build_PP: "build_PP.ogg"
			}, this.Other_sound = {
				btn_gameStart: "btn_gameStart.ogg",
				ermt_0: "ermt_0.ogg",
				timer: "timer.ogg",
				game_fail: "game_fail.ogg",
				CC: "cc.ogg",
				MP: "maopao.ogg",
				weixiu: "weixiu.ogg",
				tcOpen: "TCOpen.ogg",
				Btn_Down: "BtnDown.ogg",
				Btn_Up: "BtnUp.ogg"
			}, this.ermt = [], this.path = "res/sounds/"
		}
		static get instance() {
			return (this._ins || null == this._ins) && (this._ins = new _t), this._ins
		}
		playMusic(t) {
			this.GetPath(t)
		}
		PlaySound(t, e = 1, i = null, s = null) {
			let n = this.GetPath(t);
			if (null == i) this.soundManager.playSound(n, e);
			else {
				ot.instance.FireReturn(ot.instance.MGM_IS_SCREENRANGE, i, s) && this.soundManager.playSound(n, e)
			}
		}
		StopSound(t) {
			let e = this.GetPath(t);
			this.soundManager.stopSound(e)
		}
		StopMusic() {
			this.soundManager.stopMusic()
		}
		StopAll() {
			this.soundManager.stopAll()
		}
		StopAllSound() {
			this.soundManager.stopAllSound()
		}
		CloaseSound() {
			this.soundManager.stopAllSound()
		}
		GetPath(t) {
			return this.path + t
		}
		AddUpSound(t) {
			this._room = t, rt.instance.AddTimeLoopEvent("Sound_UpSound", this.UpSound, this, .1)
		}
		GameOver() {
			this._room = null, this.ppTime = 0
		}
		UpSound() {}
	}
	var dt, ct, ut, pt, gt, mt, It, ft, yt, bt, At, St, vt, Tt, Lt;
	! function(t) {
		t[t.GAME_END = 101] = "GAME_END", t[t.REFRESH_PLAYER_SKIN = 102] = "REFRESH_PLAYER_SKIN", t[t.GAME_CLEAR = 103] = "GAME_CLEAR", t[t.NEXT_GAME = 104] = "NEXT_GAME", t[t.TOUCH_FINISHLINE = 105] = "TOUCH_FINISHLINE", t[t.TOUCH_STAGE = 106] = "TOUCH_STAGE", t[t.TOUCH_PROP = 107] = "TOUCH_PROP", t[t.TOUCH_DOOR = 108] = "TOUCH_DOOR", t[t.TOUCH_RED_HEART = 109] = "TOUCH_RED_HEART", t[t.TOUCH_BLACK_HEART = 110] = "TOUCH_BLACK_HEART", t[t.TOUCH_WEDDING = 111] = "TOUCH_WEDDING", t[t.TOUCH_Cloth = 112] = "TOUCH_Cloth"
	}(dt || (dt = {})),
	function(t) {
		t.Skin = "skin"
	}(ct || (ct = {})),
	function(t) {
		t.AtkLevel = "atk_lv", t.HPLevel = "hp_lv"
	}(ut || (ut = {})),
	function(t) {
		t[t.Neutral = 0] = "Neutral", t[t.Player = 1] = "Player", t[t.Enemy = 2] = "Enemy"
	}(pt || (pt = {})),
	function(t) {
		t.ENDSTAGE = "end_stage", t.Winposition = "Winposition", t.Failposition = "Failposition"
	}(gt || (gt = {})),
	function(t) {
		t[t.bed_1 = 1] = "bed_1", t[t.door_1 = 2] = "door_1", t[t.repair_1 = 3] = "repair_1", t[t.game_1 = 4] = "game_1", t[t.at_1 = 5] = "at_1", t[t.ice_1 = 6] = "ice_1", t[t.barb_1 = 7] = "barb_1", t[t.particlea_1 = 8] = "particlea_1", t[t.spell_1 = 9] = "spell_1", t[t.entrapment_1 = 10] = "entrapment_1", t[t.guillotine_1 = 11] = "guillotine_1", t[t.energyhood_1 = 12] = "energyhood_1", t[t.smoney_1 = 13] = "smoney_1", t[t.longrange_1 = 14] = "longrange_1", t[t.solenoid_1 = 15] = "solenoid_1", t[t.mine_1 = 16] = "mine_1", t[t.mine_2 = 17] = "mine_2", t[t.mine_3 = 18] = "mine_3", t[t.mine_4 = 19] = "mine_4"
	}(mt || (mt = {}));
	class Et extends W.S3D {
		static GetES() {
			return this.equip_show
		}
		static getBigES() {
			let t = this.GetES().clone();
			return t.setSkinID(149), t
		}
		static changeToW(t, e) {
			let i = t.getEquipID(e);
			if (i > 0) {
				let s = W.ICache.getItemValue(i, "ae");
				s = s.split("_")[0] + "_W";
				let n = W.ICache.getItemIdByae(s);
				t.setEquipID(e, n)
			}
		}
	}
	Et.SKY_CHANGE_PRE_GRADE = 3;
	class Ct extends Laya.Script3D {
		constructor() {
			super(), this.alpha = 0, this.t = 0
		}
		onEnable() {
			this.sp3 = this.owner, this.t = 0, this.mesh_sp3 = this.sp3.getChildAt(0), this.alpha = 1
		}
		onDisable() {
			Laya.Tween.clearAll(this), Laya.timer.clearAll(this)
		}
		onUpdate() {
			if (this.Target && this.mesh_sp3) {
				this.mesh_sp3.meshRenderer.material._ColorA = this.alpha;
				let t = W.Vec3.zero,
					e = this.Target.transform.position.clone();
				e.y += 1, this.t += Laya.timer.delta / 400, Laya.Vector3.lerp(this.sp3.transform.position, e, this.t, t), this.sp3.transform.position = t.clone()
			}
		}
		ShowTwinkle() {
			this.alpha = 1, Laya.Tween.to(this, {
				alpha: 0
			}, 3e3, null, Laya.Handler.create(this, function() {
				W.Mem.recoveryComplexSP(this, {
					self: !0,
					rcom: !0
				})
			}), 0, !0)
		}
		set Target(t) {
			this._target = t, Laya.timer.once(400, this, () => {
				this.ShowTwinkle()
			})
		}
		get Target() {
			return this._target
		}
	}
	class Mt extends Laya.Script3D {
		constructor() {
			super(), this.alpha = 0, this.sca = 0, this.t = 0
		}
		onEnable() {
			this.sp3 = this.owner, this.t = 0, this.mesh_sp3 = this.sp3.getChildAt(0).getChildAt(0), this.sca = 2, this.alpha = 1
		}
		onDisable() {
			Laya.Tween.clearAll(this), Laya.timer.clearAll(this)
		}
		onUpdate() {
			if (this.Target && this.mesh_sp3) {
				this.mesh_sp3.meshRenderer.material._ColorA = this.alpha;
				let t = W.Vec3.zero,
					e = W.Vec3.zero,
					i = this.Target.transform.position.clone();
				this.t += Laya.timer.delta / 400, Laya.Vector3.lerp(this.sp3.transform.position, i, this.t, t), this.sp3.transform.position = t.clone(), Laya.Vector3.lerp(this.sp3.transform.localScale, W.Vec3.one, this.t, e), this.sp3.transform.localScale = e
			}
		}
		ShowTwinkle() {
			this.alpha = 1, Laya.Tween.to(this, {
				alpha: 0
			}, 2e3, null, Laya.Handler.create(this, function() {
				W.Mem.recoveryComplexSP(this, {
					self: !0,
					rcom: !0
				})
			}), 0, !0)
		}
		set Target(t) {
			this._target = t, Laya.timer.once(400, this, () => {
				this.ShowTwinkle()
			})
		}
		get Target() {
			return this._target
		}
	}
	class Bt extends Laya.Script3D {
		constructor() {
			super(), this.t = 0
		}
		onEnable() {
			this.sp3 = this.owner, this.t = 0, this.sp3.transform.localScale = W.Vec3.zero
		}
		onDisable() {
			Laya.Tween.clearAll(this), Laya.timer.clearAll(this)
		}
		onUpdate() {
			if (this.Target) {
				let t = W.Vec3.zero,
					e = W.Vec3.zero,
					i = this.Target.transform.position.clone();
				this.t += Laya.timer.delta / 400, Laya.Vector3.lerp(this.sp3.transform.position, i, this.t, t), this.sp3.transform.position = t.clone(), Laya.Vector3.lerp(this.sp3.transform.localScale, W.Vec3.one, this.t, e), this.sp3.transform.localScale = e
			}
		}
		set Target(t) {
			this._target = t, Laya.timer.once(400, this, () => {
				W.Mem.recoveryComplexSP(this.sp3, {
					self: !0,
					rcom: !0
				})
			})
		}
		get Target() {
			return this._target
		}
	}
	class kt extends Laya.Script3D {
		constructor() {
			super(), this.broke = !1, this.sca = 0, this.buff_sca = 0, this.spell_alpha = 0
		}
		onEnable() {
			this.sca = 1, this.sp3 = this.owner, this.broke = !1
		}
		onUpdate() {
			this.sp3.transform.localScale = new Laya.Vector3(this.sca, this.sca, this.sca), this.door_buff && (this.door_buff.transform.localScale = new Laya.Vector3(this.buff_sca, this.buff_sca, this.buff_sca)), this.block && this.block._build
		}
		onDisable() {
			Laya.Tween.clearAll(this), Laya.timer.clearAll(this)
		}
		closeDoor() {}
		openDoor() {}
		BuildUp() {
			let t = this.block.level;
			if (this.inSkin < mt.mine_1) var e = W.Mem.getSP(this.rid, t - 1);
			else e = W.Mem.getSP(this.rid + t - 1, -1);
			e && (W.Mem.recoveryComplexSP(this.sp3, {
				self: !1,
				rcom: !0
			}), W.Transform3D.addChild(this.sp3, e))
		}
		brokeBuild() {
			W.Mem.recoveryComplexSP(this.sp3, {
				self: !0,
				rcom: !0
			}), this.door_buff && W.Mem.recoveryComplexSP(this.door_buff, {
				self: !0,
				rcom: !0
			})
		}
		set roomIndex(t) {
			this._room_index = t
		}
		get roomIndex() {
			return this._room_index
		}
		set inSkin(t) {
			this._in_skin = t
		}
		get inSkin() {
			return this._in_skin
		}
		set block(t) {
			this._block = t
		}
		get block() {
			return this._block
		}
		set rid(t) {
			this._rid = t
		}
		get rid() {
			return this._rid
		}
		set blockImg(t) {
			this._blockImg = t
		}
		get blockImg() {
			return this._blockImg
		}
		set Obj(t) {
			this._obj = t
		}
		get Obj() {
			return this._obj
		}
		set JT(t) {
			this._jt = t
		}
		get JT() {
			return this._jt
		}
		gameOver1() {}
		IceEvent(t) {
			this.buff_sca = 0, this.door_buff = W.Mem.getSP(this.rid + 1, 0), this.door_buff && (W.Mem.recoveryComplexSP(this.sp3), W.Transform3D.addChild(Et.main.scene3D, this.door_buff), this.door_buff.transform.position = t.transform.position, this.door_buff.transform.rotationEuler = t.transform.rotationEuler), Laya.Tween.to(this, {
				buff_sca: 1
			}, 1500, null, null, 0, !0)
		}
		BarbEvent(t) {
			this.buff_sca = 0, this.door_buff = W.Mem.getSP(this.rid + 1, 0), this.door_buff && (W.Transform3D.addChild(Et.main.scene3D, this.door_buff), this.door_buff.transform.position = t.transform.position, this.door_buff.transform.rotationEuler = t.transform.rotationEuler), Laya.Tween.to(this, {
				buff_sca: 1
			}, 1500, null, null, 0, !0)
		}
		EnergyhoodEvent(t) {
			this.buff_sca = 0, this.door_buff = W.Mem.getSP(this.rid + 1, 0), this.door_buff && (W.Transform3D.addChild(Et.main.scene3D, this.door_buff), this.door_buff.transform.position = t.transform.position, this.door_buff.transform.rotationEuler = t.transform.rotationEuler), Laya.Tween.to(this, {
				buff_sca: 1
			}, 1500, null, null, 0, !0)
		}
		SpellEvent(t) {
			let e = W.Mem.getSP(this.rid + 1, 0);
			if (e) {
				W.Transform3D.addChild(this.sp3, e), W.Comp.auto(e, Ct, !0).Target = t
			}
		}
		EntrapmentEvent(t) {
			let e = W.Mem.getSP(this.rid + 1, 0);
			if (e) {
				let i = new Laya.Sprite3D;
				W.Transform3D.addChild(i, e), W.Transform3D.addChild(this.sp3, i), W.Comp.auto(i, Mt, !0).Target = t
			}
		}
		GuillotineEvent(t) {
			this.sca = 0;
			let e = W.Mem.getSP(this.rid + 1, 0);
			if (e) {
				let i = new Laya.Sprite3D;
				W.Transform3D.addChild(i, e), W.Transform3D.addChild(this.sp3, i), W.Comp.auto(i, Bt, !0).Target = t
			}
		}
		birthGoldEvent() {
			Laya.Tween.to(this, {
				sca: .8
			}, 100, null, Laya.Handler.create(this, () => {
				Laya.Tween.to(this, {
					sca: 1
				}, 100, null, Laya.Handler.create(this, () => {}), 0, !0)
			}), 0, !0)
		}
	}
	class wt extends Laya.Script {
		constructor() {
			super()
		}
		onEnable() {
			this.node = this.owner
		}
		onUpdate() {
			if (this.SP3 && this.SP3.transform) {
				let t = this.SP3.transform.position.clone(),
					e = W.Transform3D.WorldToScreen2(Et.main.camera, t);
				this.node.pos(e.x, e.y), this.build_scr || (this.build_scr = this.SP3.getComponent(kt), this.build_scr.block)
			}
		}
		set SP3(t) {
			this._sp3 = t
		}
		get SP3() {
			return this._sp3
		}
	}
	class Ot extends wt {
		constructor() {
			super()
		}
		onEnable() {
			super.onEnable()
		}
		onUpdate() {
			if (this.SP3 && this.SP3.transform) {
				let t = this.SP3.transform.position.clone(),
					e = W.Transform3D.WorldToScreen2(Et.main.camera, t);
				this.node.pos(e.x + this.node.width / 2, e.y)
			}
		}
	}
	class Pt {
		constructor() {
			this.PRArr = new Array, this.closeArr = new Array
		}
		static get instance() {
			return this._ins && null != this._ins || (this._ins = new Pt), this._ins
		}
		Shake(t, e) {
			t && null != t && null != t && (t.scaleX = 1, t.scaleY = 1, Laya.Tween.to(t, {
				scaleX: 1 + e,
				scaleY: 1 + e
			}, 50, null, Laya.Handler.create(this, function() {
				Laya.Tween.to(t, {
					scaleX: 1 - 2 * e,
					scaleY: 1 - 2 * e
				}, 50, null, Laya.Handler.create(this, function() {
					Laya.Tween.to(t, {
						scaleX: 1,
						scaleY: 1
					}, 50, null, null, 0, !0)
				}), 0, !0)
			}), 0, !0))
		}
		ShakeHide(t, e) {
			t && null != t && null != t && (t.scaleX = 1, t.scaleY = 1, Laya.Tween.to(t, {
				scaleX: 0,
				scaleY: 0
			}, 50, null, Laya.Handler.create(this, function() {
				e && e()
			}), 0, !0))
		}
		GetPR() {
			let t = null;
			if (this.PRArr.length > 0) t = this.PRArr.shift();
			else {
				t = new Laya.View;
				let e = Laya.loader.getRes("Prefabs/RF.json");
				t.createView(e)
			}
			return t
		}
		RFEffect(t, e, i, s) {
			var n = this.GetPR();
			if (null == n) return;
			W.Comp.auto(n, Ot, !0).SP3 = s.SP3, Laya.stage.getChildAt(0).getChildAt(0).addChild(n), n.zOrder = 3;
			let a = this.closeArr.length;
			this.closeArr.push({
				index: a,
				view: n
			}), n.getChildAt(0).getChildAt(0).skin = t, n.getChildAt(0).getChildAt(1).text = "+" + e;
			let l = n.getChildAt(0);
			l.alpha = 0, l.scaleY = 0, l.scaleX = 0, l.pos(0, 0), Laya.Tween.to(l, {
				alpha: 1,
				scaleX: 1,
				scaleY: 1,
				y: l.y - 15
			}, 500, null, Laya.Handler.create(this, function() {
				Laya.Tween.to(l, {
					y: l.y - 45
				}, 1e3, null, Laya.Handler.create(this, function() {
					Laya.Tween.to(l, {
						y: l.y - 45,
						alpha: 0,
						scaleX: 0,
						scaleY: 0
					}, 1e3, null, Laya.Handler.create(this, function() {
						this.PRArr.push(n), n.removeSelf(), this.RemoveCloseArr(n)
					}), 0, !0)
				}), 0, !0)
			}), 0, !0)
		}
		RemoveCloseArr(t) {
			if (this.closeArr.length > 0)
				for (let e = this.closeArr.length - 1; e >= 0; e--) {
					if (this.closeArr[e].view == t) return void this.closeArr.splice(e, 1)
				}
		}
		GameOver() {
			if (this.closeArr.length > 0) {
				for (let t = 0; t < this.closeArr.length; t++) {
					let e = this.closeArr[t];
					null != e.view.parent && (e.view.parent.removeChild(e.view), this.PRArr.push(e.view))
				}
				this.closeArr.length = 0
			}
		}
		Hide(t) {
			t && null != t && null != t && Laya.Tween.to(t, {
				scaleX: 0,
				scaleY: 0
			}, 200, null, Laya.Handler.create(this, () => {
				t.visible = !1
			}), 0, !0)
		}
		Show(t) {
			t && null != t && null != t && (t.visible = !0, Laya.Tween.to(t, {
				scaleX: 1,
				scaleY: 1
			}, 200, null, null, 0, !0))
		}
		Alpha(t, e = 1, i = 1) {
			t && null != t && null != t && Laya.Tween.to(t, {
				alpha: i
			}, 1e3 * e, null, null, 0, !0)
		}
		ClickDown(t) {
			Laya.Tween.to(t, {
				scaleX: .9,
				scaleY: .9
			}, 50, null, null, 0, !0), _t.instance.PlaySound(_t.instance.Other_sound.Btn_Down)
		}
		ClickUp(t) {
			Laya.Tween.to(t, {
				scaleX: 1,
				scaleY: 1
			}, 50, null, null, 0, !0), _t.instance.PlaySound(_t.instance.Other_sound.Btn_Up)
		}
		MoveOut(t) {
			Laya.Tween.to(t, {
				scaleX: 1,
				scaleY: 1
			}, 50, null, null, 0, !0), _t.instance.PlaySound(_t.instance.Other_sound.Btn_Up)
		}
		AddBtnEvent(t) {
			if (t.length > 0)
				for (let e = 0; e < t.length; e++) {
					let i = t[e];
					i.on(Laya.Event.MOUSE_DOWN, this, this.ClickDown, [i]), i.on(Laya.Event.MOUSE_UP, this, this.ClickUp, [i]), i.on(Laya.Event.MOUSE_OUT, this, this.MoveOut, [i])
				}
		}
		RemoveBtnEvent(t) {
			if (t.length > 0)
				for (let e = 0; e < t.length; e++) {
					let i = t[e];
					i.off(Laya.Event.MOUSE_DOWN, this, this.ClickDown), i.off(Laya.Event.MOUSE_UP, this, this.ClickUp), i.off(Laya.Event.MOUSE_OUT, this, this.MoveOut)
				}
		}
		Breathing(t, e, i, s = 1) {
			t && null != t && null != t && e != i && (e++, Laya.Tween.to(t, {
				alpha: s
			}, 200, null, Laya.Handler.create(this, () => {
				s = 0 == s ? 1 : 0, this.Breathing(t, e, i, s)
			}), 0, !0))
		}
		ShakeHead(t, e, i, s = -1) {
			t && null != t && null != t && e != i && (e++, Laya.Tween.to(t, {
				x: t.x + 2 * s
			}, 50, null, Laya.Handler.create(this, () => {
				Laya.Tween.to(t, {
					x: t.x + 2 * s * -1
				}, 50, null, Laya.Handler.create(this, () => {
					s = -1 == s ? 1 : -1, this.ShakeHead(t, e, i, s)
				}), 0, !0)
			}), 0, !0))
		}
		RotEffect(t, e, i, s = -1, n = !1) {
			t && null != t && null != t && (e != i ? (e++, Laya.Tween.to(t, {
				rotation: t.rotation + 10 * s
			}, 50, null, Laya.Handler.create(this, () => {
				Laya.Tween.to(t, {
					rotation: t.rotation + 10 * s * -1
				}, 50, null, Laya.Handler.create(this, () => {
					s = -1 == s ? 1 : -1, this.RotEffect(t, e, i, s, n)
				}), 0, !0)
			}), 0, !0)) : n && Laya.timer.once(1e3, this, () => {
				t.visible && this.RotEffect(t, 0, i, -1, !0)
			}, null, !0))
		}
		ScaleEffect(t, e, i, s = -1, n = !1) {
			t && null != t && null != t && (e != i ? (e++, Laya.Tween.to(t, {
				scaleX: t.scaleX + .1 * s,
				scaleY: t.scaleY + .1 * s
			}, 50, null, Laya.Handler.create(this, () => {
				Laya.Tween.to(t, {
					scaleX: t.scaleX + .1 * s * -1,
					scaleY: t.scaleY + .1 * s * -1
				}, 50, null, Laya.Handler.create(this, () => {
					s = -1 == s ? 1 : -1, this.ScaleEffect(t, e, i, s, n)
				}), 0, !0)
			}), 0, !0)) : n && Laya.timer.once(1e3, this, () => {
				0 != t.visible && this.ScaleEffect(t, 0, i, -1, !0)
			}, null, !0))
		}
		ADVEffect(t, e = 0) {
			t && null != t && null != t && t.visible && (0 == e ? Laya.timer.once(2e3, this, () => {
				this.RotEffect(t, 0, 5), this.ADVEffect(t, 1)
			}, null, !0) : Laya.timer.once(2e3, this, () => {
				this.ScaleEffect(t, 0, 5), this.ADVEffect(t, 0)
			}, null, !0))
		}
		RotEffect_360(t, e) {
			t && null != t && null != t && t.visible && Laya.Tween.to(t, {
				rotation: t.rotation + e
			}, 1e3, null, Laya.Handler.create(this, () => {
				this.RotEffect_360(t, e)
			}), 0, !0)
		}
		Gold3Effwct(t) {
			if (!t) return;
			let e = t.y;
			t.visible = !0, t.scale(0, 0), Laya.Tween.to(t, {
				scaleX: 1,
				scaleY: 1,
				y: t.y - 10
			}, 200, null, Laya.Handler.create(this, () => {
				Laya.Tween.to(t, {
					y: t.y - 30
				}, 500, null, Laya.Handler.create(this, () => {
					Laya.Tween.to(t, {
						scaleX: 0,
						scaleY: 0,
						y: t.y - 20
					}, 500, null, Laya.Handler.create(this, () => {
						t.y = e, t.visible = !1
					}, null, !0))
				}, null, !0))
			}, null, !0))
		}
	}
	class xt {
		constructor() {
			this.path = "res/effect/", this.effectStr = {
				bulletEffect: "bulletEffect",
				trollAttackEffect: "trollAttackEffect",
				trollBaoqiEffect: "trollBaoqiEffect",
				trollZH: "trollZH",
				buildDownEffect: "buildDownEffect",
				build_vertigo: "build_vertigo"
			}, this.loadeffect = {
				bulletEffect: !1,
				trollAttackEffect: !1,
				trollBaoqiEffect: !1,
				trollZH: !1,
				buildDownEffect: !1,
				build_vertigo: !1
			}, this.bulletArr = [], this.playEffectPos = [], this.AddUpData()
		}
		static get instance() {
			return this._ins || null != this._ins || (this._ins = new xt), this._ins
		}
		AddUpData() {
			ht.instance.AddUPEvent("EffectPlayUp", this.PlayEffectUp, this)
		}
		getEffect(t, e, i, s, n) {
			if (this.bulletArr.length > 0)
				for (let e = 0; e < this.bulletArr.length; e++) {
					let i = this.bulletArr[e];
					if (null != i.anim && i.effectName == t) {
						let t = i.anim;
						return i.anim = null, t
					}
				}
			if (this.loadeffect[t]) {
				let e = new Laya.Animation;
				e.loadAtlas(this.path + t + ".atlas"), e.play(0, !1);
				let i = e.getGraphicBounds(!0);
				return e.pivot(i.width / 2, i.height / 2), e
			}
			Laya.loader.load(this.path + t + ".atlas", Laya.Handler.create(this, () => {
				let a = new Laya.Animation;
				a.loadAtlas(this.path + t + ".atlas"), a.play(0, !1);
				let l = a.getGraphicBounds(!0);
				a.pivot(l.width / 2, l.height / 2), this.loadeffect[t] = !0, this.PlayAnim(a, e, i, t, s, n)
			}))
		}
		PlayEffectUp() {
			if (this.playEffectPos.length > 0) {
				let t = this.playEffectPos.shift(),
					e = this.getEffect(t.effectName, t.pos.x, t.pos.y, t.iszOeder, t.loop);
				null != e && this.PlayAnim(e, t.pos.x, t.pos.y, t.effectName, t.iszOeder, t.loop)
			}
		}
		AddBulletArr(t, e) {
			for (let i = 0; i < this.bulletArr.length; i++) {
				let s = this.bulletArr[i];
				if (s.effectName == t && null == s.anim) return void(s.anim = e)
			}
			let i = {
				effectName: t,
				anim: e
			};
			this.bulletArr.push(i)
		}
		AddEffect(t, e, i, s = !1, n = 0) {
			this.playEffectPos.push({
				effectName: t,
				pos: {
					x: e,
					y: i
				},
				iszOeder: s,
				loop: n
			})
		}
		PlayAnim(t, e, i, s, n, a) {
			this.panel.addChild(t), t.zOrder = n ? Number.MAX_VALUE : i, t.pos(e, i), 0 == a ? (t.play(0, !1), t.on(Laya.Event.COMPLETE, this, () => {
				this.AddBulletArr(s, t), this.panel.removeChild(t), t.offAll()
			})) : (t.play(0, !0), Laya.timer.once(a, this, () => {
				this.AddBulletArr(s, t), this.panel.removeChild(t), t.stop()
			}))
		}
		get panel() {
			return (this._panel || null == this._panel) && (this._panel = ot.instance.FireReturn(ot.instance.MAP_GET_ACTIVITYMAP)), this._panel
		}
		GameOver() {
			this.playEffectPos = []
		}
	}
	class Dt extends Laya.Script3D {
		constructor() {
			super(), this.alpha = 0
		}
		onEnable() {
			this.sp3 = this.owner
		}
		onUpdate() {
			this.sp3.meshRenderer && (this.sp3.meshRenderer.material.albedoColorA = this.alpha)
		}
		jtShow(t = 0) {
			Laya.Tween.to(this, {
				alpha: t
			}, 1e3, null, Laya.Handler.create(this, () => {
				1 == t ? this.jtShow() : this.jtShow(1)
			}), 0, !0)
		}
		onDisable() {
			Laya.Tween.clearAll(this)
		}
	}
	class Ut extends kt {
		constructor() {
			super(...arguments), this.lo_x = 0, this.ro_x = 0
		}
		onEnable() {
			super.onEnable(), this.mesh_door = this.sp3.getChildAt(0).getChildAt(1);
			let t = this.mesh_door.transform.localRotationEuler;
			t.x = 0, this.mesh_door.transform.localRotationEuler = t
		}
		onUpdate() {
			if (super.onUpdate(), this.block && this.block._build) {
				let t = this.sp3.transform.localPosition.clone();
				this.moveMod ? t.z = this.lo_x : t.x = this.lo_x, this.sp3.transform.localPosition = t
			}
			let t = this.mesh_door.transform.localRotationEuler;
			t.x = this.ro_x, this.mesh_door.transform.localRotationEuler = t
		}
		closeDoor() {
			this.moveMod ? (this.lo_x = this.sp3.transform.localPosition.z, Laya.Tween.to(this, {
				lo_x: this.sp3.transform.localPosition.z + 1
			}, 500, null, Laya.Handler.create(this, () => {}), 0, !0)) : (this.lo_x = this.sp3.transform.localPosition.x, Laya.Tween.to(this, {
				lo_x: this.sp3.transform.localPosition.x + 1
			}, 500, null, Laya.Handler.create(this, () => {}), 0, !0)), this.JT && W.Mem.recoveryComplexSP(this.JT, {
				self: !0,
				rcom: !0
			})
		}
		openDoor() {
			this.moveMod ? (this.lo_x = this.sp3.transform.localPosition.z, Laya.Tween.to(this, {
				lo_x: this.sp3.transform.localPosition.z - 1
			}, 500, null, Laya.Handler.create(this, () => {}), 0, !0)) : (this.lo_x = this.sp3.transform.localPosition.x, Laya.Tween.to(this, {
				lo_x: this.sp3.transform.localPosition.x - 1
			}, 500, null, Laya.Handler.create(this, () => {}), 0, !0))
		}
		get moveMod() {
			let t = Math.abs(this.sp3.transform.localRotationEulerY);
			return t % 180 != 0 && t > 1
		}
	}
	class Rt {
		constructor() {
			this.f_ro_target = 0, this.f_ro = 0, this.v_ro_target = 0, this.v_ro = 0, this.mode = 0, this.dvro_max = 0, this.dfro_max = 0, this.face_ctrl_auto = !0
		}
		init(t, e = 0, i = 720, s = 720) {
			this.role = t, this.mode = e, this.dvro_max = i * Math.PI / 180, this.dfro_max = s * Math.PI / 180, this.v_ro = this.role.transform.rotationEuler.y * W.Mathf.DegToRad, this.f_ro = this.v_ro
		}
		onUpdate() {
			if (!this.role) return;
			if (this.role.destroyed) return;
			if (this.mode == Rt.MODE_V_NOW_F_NOW || this.mode == Rt.MODE_V_NOW_F_SLOW) this.v_ro = this.v_ro_target;
			else {
				let t = this.dvro_max * W.FPS.getDelta() * .001;
				this.v_ro = W.Mathf.RadLerp(this.v_ro, this.v_ro_target, 1, Laya.Ease.linearNone, W.LerpType.Max, t)
			}
			let t = this.v_ro;
			if (!this.face_ctrl_auto && this.f_target_pos) {
				var e = this.role.transform.position;
				this.f_ro_target = Math.atan2(this.f_target_pos.x - e.x, this.f_target_pos.z - e.z), t = this.f_ro_target
			}
			if (this.mode == Rt.MODE_V_NOW_F_NOW || this.mode == Rt.MODE_V_SLOW_F_NOW) this.f_ro = t;
			else {
				this.f_ro = this.role.transform.rotationEuler.y * W.Mathf.DegToRad;
				let e = this.dfro_max * W.FPS.getDelta() * .001;
				this.f_ro = W.Mathf.RadLerp(this.f_ro, t, 1, Laya.Ease.linearNone, W.LerpType.Max, e)
			}
			this.updateFRo(this.f_ro)
		}
		updateFRo(t) {
			let e = this.role.transform,
				i = e.rotationEuler.clone();
			i.setValue(0, t * W.Mathf.RadToDeg, 0), e.rotationEuler = i
		}
		updateVRo(t) {
			this.v_ro_target = t
		}
		setForwardToPos(t) {
			this.f_target_pos = t, this.face_ctrl_auto = !t
		}
		releaseForwardPos() {
			this.f_target_pos = null, this.face_ctrl_auto = !0
		}
	}
	Rt.MODE_V_NOW_F_NOW = 0, Rt.MODE_V_NOW_F_SLOW = 1, Rt.MODE_V_SLOW_F_NOW = 2, Rt.MODE_V_SLOW_F_SLOW = 3;
	class Nt extends Laya.Script3D {
		constructor() {
			super(), this.cur_bed_level = 1, this.move_ctrl = new Rt
		}
		onAwake() {
			this.sp3 = this.owner, this.meshSp3 = this.sp3.getChildAt(0), this.meshSp3 || console.log("meshSp3 null"), this.anim = this.meshSp3.getComponent(Laya.Animator), this.playAnim("standby", 0), this.move_ctrl.init(this.sp3, Rt.MODE_V_NOW_F_SLOW, 360, 360), this.move_ctrl.updateVRo(Math.PI), this.player_light = W.Transform3D.Find(this.sp3, "player_light")
		}
		onUpdate() {
			if (this.player_light) {
				let t = this.sp3.transform.position.clone();
				t.y = 0, this.player_light.transform.position = t.clone()
			}
			if (this.Player && this.Player.player) {
				if (!this.Player.isDie) return void W.Mem.recoveryComplexSP(this.sp3, {
					self: !0,
					rcom: !0
				});
				let t = new Laya.Point(this.Player.player.x, this.Player.player.y);
				if (this.Player.bed)
					if (this.meshSp3.transform.localRotationEuler = new Laya.Vector3(0, 0, 0), this.Player.bed.level > this.cur_bed_level && (this.cur_bed_level = this.Player.bed.level, this.bed_hp = null), this.bed_hp) {
						let t = this.bed_hp.transform.position.clone(),
							e = this.bed_hp.transform.rotationEuler.clone(),
							i = this.bed_hp.transform.getWorldLossyScale();
						this.sp3.transform.rotationEuler = e.clone(), this.sp3.transform.setWorldLossyScale(i.clone()), this.sp3.transform.position = t.clone()
					} else {
						let t = this.Player.bed,
							e = ie.instance.getSp3ByBlock(t);
						this.bed_hp = W.Transform3D.Find(e, "hp_player")
					}
				else {
					let e = new Laya.Vector3(-t.x / 90, 0, -t.y / 90);
					if (this.sp3.transform.position = e, this.last_pos_v3) {
						let t = new W.Vec3;
						if (W.Vec3.subtract(this.last_pos_v3, this.sp3.transform.position, t), W.Vec3.scalarLength(t) > 1e-5) {
							let e = Math.atan2(t.x, t.z);
							this.move_ctrl.updateVRo(e)
						}
					}
					this.move_ctrl.onUpdate(), this.meshSp3.transform.localRotationEuler = new Laya.Vector3(0, 180, 0)
				}
				if (ni.Model == Lt.HumanModel && this.Player.isGod && (this.Player.bed || ie.instance.setCameraPos(t.x, t.y)), ni.Model == Lt.TrollModel) {
					if (!ni.isTrollGameLookPlayer) return;
					0 == this.Player.uid && ie.instance.setCameraPos(t.x, t.y)
				}
				this.last_pos_v3 = this.sp3.transform.position.clone()
			}
		}
		upBed() {
			let t = this.Player.bed,
				e = ie.instance.getSp3ByBlock(t);
			this.bed_hp = W.Transform3D.Find(e, "hp_player"), this.playAnim("lie_down", .1)
		}
		onDisable() {
			Laya.Tween.clearAll(this)
		}
		set roomIndex(t) {
			this._room_index = t
		}
		get roomIndex() {
			return this._room_index
		}
		set Player(t) {
			this._player = t
		}
		get Player() {
			return this._player
		}
		playAnim(t, e = 0) {
			this.anim && (this.anim.speed = 1.5, this.anim_name != t && (this.anim.play(t), this.anim_name = t, this.anim.crossFade(t, e)))
		}
	}
	class Gt extends Laya.Script3D {
		constructor() {
			super(), this.state = 0, this.is_attack_2 = !1, this.move_ctrl = new Rt
		}
		onEnable() {
			this.sp3 = this.owner, this.meshSp3 = this.sp3.getChildAt(0), this.anim = this.meshSp3.getComponent(Laya.Animator), this.playAnim("walk"), this.move_ctrl.init(this.sp3, Rt.MODE_V_NOW_F_SLOW, 360, 360)
		}
		onUpdate() {
			if (this.troll_light) {
				let t = this.sp3.transform.position.clone();
				t.y = 0, this.troll_light.transform.position = t.clone()
			}
			if (this.Troll && this.Troll.troll) {
				let t = new Laya.Point(this.Troll.troll.x, this.Troll.troll.y),
					e = new W.Vec3(-t.x / 90, 0, -t.y / 90);
				if (this.sp3.transform.position = e, this.state != this.Troll.state && (this.state = this.Troll.state, this.changeTrollState(this.state)), this.last_pos_v3) {
					let t = new W.Vec3;
					if (W.Vec3.subtract(this.last_pos_v3, this.sp3.transform.position, t), W.Vec3.scalarLength(t) > 1e-5) {
						let e = Math.atan2(t.x, t.z);
						this.move_ctrl.updateVRo(e)
					}
				}
				this.move_ctrl.onUpdate(), this.meshSp3.transform.localRotationEuler = new Laya.Vector3(0, 180, 0), this.last_pos_v3 = this.sp3.transform.position.clone(), 2 == this.state ? this.is_attack_2 ? this.anim.speed = 1 / this.Troll.atSpeed / 2 : this.anim.speed = 1 / this.Troll.atSpeed : this.anim.speed = 1.5
			}
		}
		onLateUpdate() {
			if (ni.Model == Lt.TrollModel && this.Troll && this.Troll.troll) {
				let t = new Laya.Point(this.Troll.troll.x, this.Troll.troll.y);
				ni.isTrollGameStart && ie.instance.setCameraPos(t.x, t.y)
			}
		}
		playAnim(t, e = 0) {
			this.anim_name != t && this.anim && (this.anim.crossFade(t, e), this.anim_name = t)
		}
		onDisable() {
			Laya.Tween.clearAll(this)
		}
		set Troll(t) {
			this._troll = t
		}
		get Troll() {
			return this._troll
		}
		changeTrollState(t) {
			switch (t) {
				case 0:
					this.playAnim("walk", .1);
					break;
				case 1:
					this.playAnim("stand", .1);
					break;
				case 2:
					this.is_attack_2 = W.Random.getBoolInRandom(.5), this.is_attack_2 ? this.playAnim("attack_2") : this.playAnim("attack");
					let e = ie.instance.getDoor(this._troll._attackRoom);
					if (e) {
						let t = -W.Vec3.towardsRey2D(e.transform.position, this.sp3.transform.position);
						this.move_ctrl.updateVRo(t * W.Mathf.DegToRad)
					}
					break;
				case 3:
					this.playAnim("stand", .1);
					break;
				case 4:
					this.playAnim("walk", .1);
					break;
				case 5:
					this.playAnim("stand", .1)
			}
		}
	}
	class Ht extends W.DramaTemp {
		constructor() {
			super(...arguments), this.drid = 0, this.rid = 0, this.sid = 0, this.sceid = 0
		}
		static creatByJson(t) {
			let e = super.creatByJson(t, Ht);
			return e.drid = t.drid, e.rid = t.rid, e.sid = t.sid, e.sceid = t.sceid, e.icon = t.icon, e
		}
		static Init() {
			super.Init(), this.at_temp_list = this.InitCell(this.AT_TEMP_KEY, Ft.creatByJson)
		}
		static Get(t) {
			return 0 == (t %= this.list.length) && (t = 1), this.list[t]
		}
		static getDrama() {
			return super.getDrama()
		}
		static GetAtTemp(t) {
			return this.at_temp_list[t]
		}
	}
	Ht.AT_TEMP_KEY = "at_temp";
	class Ft {
		static creatByJson(t) {
			let e = new Ft;
			return e.ty = t.rid, e.bu_ef = t.bu_ef, e.hit_ef = t.hit_ef, e
		}
	}
	class Wt extends kt {
		constructor() {
			super()
		}
		onEnable() {
			super.onEnable();
			let t = W.Transform3D.Find(this.sp3, "hp_at_b");
			this.sp_b = t.getChildAt(0), this.sp3_fire_point = W.Transform3D.Find(this.sp3, "hp_fire")
		}
		onUpdate() {
			if (super.onUpdate(), this.block && this.block._build && this.sp_b) {
				let t = this.block._build.getChildAt(0).rotation;
				this.sp_b.transform.rotationEuler = new Laya.Vector3(0, -t, 0)
			}
		}
		BuildUp() {
			let t = this.block.level,
				e = W.Mem.getSP(this.rid, t - 1),
				i = W.Mem.getSP(this.rid + 1, t - 1);
			if (e) {
				W.Mem.recoveryComplexSP(this.sp3), W.Transform3D.addChild(this.sp3, e);
				let t = W.Transform3D.Find(e, "hp_at_b");
				W.Transform3D.addChild(t, i), this.sp_b = i, this.sp3_fire_point = W.Transform3D.Find(this.sp3, "hp_fire")
			}
		}
		PlayFireEffect() {
			let t = Ht.GetAtTemp(this.block.level).bu_ef;
			if (t) {
				let e = W.Mem.getSP(t);
				W.Transform3D.addChild(this.sp3_fire_point, e), W.Transform3D.playParticle(e), this.setParticleOrder(e)
			}
		}
		setParticleOrder(t) {
			t && t.particleRenderer && (t.particleRenderer.sharedMaterial.depthTest = Laya.RenderState.DEPTHTEST_OFF);
			for (var e = 0; e < t.numChildren; e++) {
				let i = t.getChildAt(e);
				i && i.particleRenderer && (i.particleRenderer.sharedMaterial.depthTest = Laya.RenderState.DEPTHTEST_OFF)
			}
		}
	}
	class Vt extends Laya.Script3D {
		constructor() {
			super(), this.alpha = 0
		}
		onEnable() {
			this.sp3 = this.owner, this.mesh_sp3 = this.sp3.getChildAt(0), this.ShowTwinkle()
		}
		onUpdate() {
			this.mesh_sp3.meshRenderer.sharedMaterial._ColorA = this.alpha
		}
		ShowTwinkle() {
			this.alpha = 0, Laya.Tween.to(this, {
				alpha: 1
			}, 2e3, null, Laya.Handler.create(this, function() {
				Laya.Tween.to(this, {
					alpha: 0
				}, 2e3, null, Laya.Handler.create(this, function() {
					this.ShowTwinkle()
				}), 0, !0)
			}), 0, !0)
		}
	}
	class Yt extends Laya.Script3D {
		constructor() {
			super(), this.index = 0
		}
		onEnable() {
			this.sp3 = this.owner
		}
		onDisable() {
			Laya.Tween.clearAll(this), Laya.timer.clearAll(this)
		}
		onUpdate() {}
		ShowTwinkle() {
			Laya.timer.once(1e3, this, () => {
				this.index += 1, this.index > 1 && (this.index = 0);
				let t = W.Mem.getSP(1800, this.index);
				W.Mem.recoveryComplexSP(this.sp3, {
					self: !1
				}), W.Transform3D.addChild(this.sp3, t), this.ShowTwinkle()
			})
		}
	}
	class Xt extends Laya.Script3D {
		constructor() {
			super(), this.sca = 0
		}
		onEnable() {
			this.sp3 = this.owner, this.sp3_n = W.Mem.getSP(1900, 1), W.Transform3D.addChild(this.sp3, this.sp3_n)
		}
		onDisable() {
			Laya.Tween.clearAll(this), Laya.timer.clearAll(this)
		}
		onUpdate() {
			this.sp3_n.transform.localScale = new Laya.Vector3(1, this.sca, 1)
		}
		ShowTwinkle() {
			Laya.Tween.to(this, {
				sca: .6
			}, 500, null, Laya.Handler.create(this, () => {
				Laya.Tween.to(this, {
					sca: 1
				}, 500, null, Laya.Handler.create(this, () => {
					this.ShowTwinkle()
				}))
			}))
		}
	}
	class Kt extends kt {
		constructor() {
			super(...arguments), this.m_y = 0
		}
		onEnable() {
			super.onEnable(), this.entrapment = W.Transform3D.Find(this.sp3, "entramentImage_1"), this.m_y = 0, this.playAnim()
		}
		onUpdate() {
			super.onUpdate(), this.entrapment.transform.rotate(new Laya.Vector3(0, Laya.timer.delta / 1200 * 360, 0), !0, !1);
			let t = this.entrapment.transform.localPosition.clone();
			t.y = this.m_y, this.entrapment.transform.localPosition = t.clone()
		}
		playAnim() {
			Laya.Tween.to(this, {
				m_y: .35
			}, 400, null, Laya.Handler.create(this, () => {
				Laya.Tween.to(this, {
					m_y: 0
				}, 400, null, Laya.Handler.create(this, () => {
					this.playAnim()
				}))
			}))
		}
	}
	class zt extends kt {
		constructor() {
			super(...arguments), this.m_z = 0
		}
		onEnable() {
			super.onEnable(), this.guillotine = W.Transform3D.Find(this.sp3, "guillotine_3"), this.m_z = -20, this.playAnim()
		}
		onUpdate() {
			super.onUpdate();
			let t = this.guillotine.transform.localRotationEuler.clone();
			t.z = this.m_z, this.guillotine.transform.localRotationEuler = t.clone()
		}
		playAnim() {
			Laya.Tween.to(this, {
				m_z: -60
			}, 800, null, Laya.Handler.create(this, () => {
				Laya.Tween.to(this, {
					m_z: -20
				}, 800, null, Laya.Handler.create(this, () => {
					this.playAnim()
				}))
			}))
		}
	}
	class jt extends kt {
		onEnable() {
			super.onEnable(), this.solenoid = W.Transform3D.Find(this.sp3, "solenoidimg")
		}
		onUpdate() {
			super.onUpdate(), this.solenoid.transform.rotate(new Laya.Vector3(0, 0, Laya.timer.delta / 1200 * 360), !0, !1)
		}
	}
	class qt extends kt {
		onEnable() {
			super.onEnable(), this.spell = W.Transform3D.Find(this.sp3, "spellimg_1")
		}
		onUpdate() {
			super.onUpdate(), this.spell.transform.rotate(new Laya.Vector3(0, Laya.timer.delta / 1200 * 360, 0), !0, !1)
		}
	}
	class Jt {
		constructor() {
			this.uid = -1, this.name = null, this._roomIndex = -1, this._curRoom = -1, this._playerType = -1, this._animIndex = -1, this._speed = 6, this._bed = null, this._isBed = !1, this._isRoom = !1, this._isGod = !1, this._isDie = !1, this._buildAdvantage = 0, this._advantage = 0, this._HP = 1, this._dieTime = null, this.uid = -1, this.name = null, this._roomIndex = -1, this._curRoom = -1, this._playerType = -1, this._skPath = "res/Skeleton/player/player_0.sk", this._animIndex = -1, this._speed = 4.5, this._bed = null, this._isBed = !1, this._isRoom = !1, this._isGod = !1, this._isDie = !1, this._buildAdvantage = 0, this._advantage = 0, this._HP = 1, this._dieTime = null
		}
		get animNum() {
			return 5
		}
		set playerType(t) {
			this._playerType = t
		}
		get playerType() {
			return this._playerType
		}
		get roomIndex() {
			return this._roomIndex
		}
		set roomIndex(t) {
			this._roomIndex = t
		}
		get curRoom() {
			return this._curRoom
		}
		set curRoom(t) {
			this._curRoom = t
		}
		LoadAnim() {
			this._animFactory = new Laya.Templet, this._animFactory.on(Laya.Event.COMPLETE, this, this.parseComplete), this._animFactory.loadAni(this.skin)
		}
		parseComplete() {
			null != this._player && this._player.destroy(), this._player = this._animFactory.buildArmature(0), this._player.visible = !0, this._player.play(1, !0), this._player.pivotY = -20;
			let t = di.instance.build.GetAIPos(this._playerType);
			this.SetPlayerPos(t[0], t[1]), this._player.zOrder = this._player.y
		}
		SetPlayerPos(t, e) {
			ot.instance.Fire(ot.instance.MAP_ADD_ACTIVITY, this.player, t, e);
			new Laya.Point(this.player.x, this.player.y)
		}
		get player() {
			return this._player ? this._player : null
		}
		get x() {
			return this.player.x
		}
		get y() {
			return this.player.y
		}
		set x(t) {
			this.player.x = t
		}
		set y(t) {
			this.player.y = t
		}
		get speed() {
			let t = new Laya.Point;
			return t = new Laya.Point(this.player.x, this.player.y), ie.instance.playerMove(this), this._speed
		}
		set speed(t) {
			this._speed = t
		}
		set isbed(t) {
			this._isBed = t
		}
		get isbed() {
			return this._isBed
		}
		get isRoom() {
			return this._isRoom
		}
		set isRoom(t) {
			this._isRoom = t
		}
		set buildAdvantage(t) {
			this._buildAdvantage += t
		}
		get advantage() {
			return this.isRoom && (this._advantage += 20), this.isbed && (this._advantage += 10), this._advantage += this._buildAdvantage, this._advantage
		}
		Hit(t) {
			return this._HP -= t, this._HP <= 0 && ot.instance.Fire(ot.instance.UIGM_PLAYERHIT, this.uid), this._HP > 0
		}
		get isGod() {
			return this._isGod
		}
		set isGod(t) {
			this._isGod = t
		}
		get isDie() {
			return this._isDie = this._HP > 0, this._isDie || (this.player.visible = !1, this._dieTime = rt.instance.gameTime), this._isDie
		}
		set direction(t) {
			this.player.scaleX = t
		}
		set bed(t) {
			this._bed = t
		}
		get bed() {
			return this._bed
		}
		GameOver() {
			this._HP = 1, this._isBed = !1, this._isRoom = !1, this._isGod = !1, this._roomIndex = -1, this._curRoom = -1, this._playerType = -1, this._isDie = !1, this.player.visible = !1, this._buildAdvantage = 0, this.player.parent.removeChild(this.player), this.bed = null, this.name = null, this._dieTime = null
		}
		set id(t) {
			this._id = t
		}
		get id() {
			return this._id + 1
		}
		get skin() {
			return this._id > 5 ? this._skPath : this._skPath = "res/Skeleton/player/player_" + this._id + ".sk"
		}
		get dieTime() {
			return null == this._dieTime ? rt.instance.gameTime : this._dieTime
		}
		get win() {
			return this.isGod ? di.instance.player.win : Math.floor(100 * Math.random())
		}
		get lose() {
			return this.isGod ? di.instance.player.lose : Math.floor(100 * Math.random())
		}
	}
	class Zt extends Jt {}
	class Qt {
		constructor() {
			this._diePlayer = [], this._players = [], Qt._ins = this, this._diePlayer = [], this._players = []
		}
		static get instance() {
			return this._ins && null != this._ins ? this._ins : null
		}
		gettroll() {}
		StartGame(t) {
			this.CreateAllPlayer(t)
		}
		CreateAllPlayer(t = 1) {
			for (let e = 0; e < t; e++) this.CreatePlayer(e);
			ni.Model == Lt.HumanModel && (this._player = this._players[0], this._player.isGod = !0, this._player.name = yi.instance.getLanguage("181"))
		}
		CreatePlayer(t = 0) {
			let e = this.GetDiePlayer();
			if (this._players.push(e), e.playerType = t, e.isGod = !1, ni.Model == Lt.HumanModel && 0 == t) e.id = this.selectIndex;
			else {
				let i = null;
				ni.Model == Lt.HumanModel ? i = di.instance.game.GetPlayerArr(t - 1) : ni.Model == Lt.TrollModel && (i = di.instance.game.GetPlayerArr(t)), e.id = i.index, e.name = i.name
			}
			e.uid = t, e.LoadAnim(), ie.instance.addPlayer(0, 0, e, t)
		}
		GetDiePlayer() {
			if (this._diePlayer.length > 0) return this._diePlayer.shift();
			return new Zt
		}
		get playerSorts() {
			if (ni.Model == Lt.HumanModel && this._players.length > 3)
				for (let t = 0; t < this._players.length; t++) {
					let e = this._players[t];
					for (let t = 1; t < this._players.length; t++) {
						let i = this._players[t];
						if (i.advantage < e.advantage) {
							let t = e;
							e = i, i = t
						}
					}
				}
			return this._players
		}
		get players() {
			let t = [];
			for (let e = 0; e < this._players.length; e++) {
				let i = this._players[e];
				i.isGod || t.push(i)
			}
			return t
		}
		get player() {
			return this._player
		}
		get playerArr() {
			return this._players
		}
		get allDead() {
			for (let t = 0; t < this._players.length; t++) {
				if (this._players[t].isDie) return !1
			}
			return !0
		}
		GameOver() {
			if (this._players.length > 0) {
				for (let t = 0; t < this._players.length; t++) {
					let e = this._players[t];
					e.GameOver(), this._diePlayer.push(e)
				}
				this._players.length = 0
			}
			this._player = void 0
		}
		get selectIndex() {
			return -1 != F.try_index ? F.try_index : di.instance.player.playerSelectIndex
		}
		GetPlayerName(t) {
			for (let e = 0; e < this._players.length; e++) {
				let i = this._players[e];
				if (i.roomIndex == t) return i.name
			}
			return null
		}
		GetPlayerSkinId(t) {
			for (let e = 0; e < this._players.length; e++) {
				let i = this._players[e];
				if (i.roomIndex == t) return i.id
			}
			return 0
		}
		get head() {
			if (this._players.length > 0) {
				let t = [];
				if (ni.Model == Lt.HumanModel)
					for (let e = 1; e < this._players.length; e++) {
						let i = this._players[e];
						t.push(i.id - 1)
					} else if (ni.Model == Lt.TrollModel)
						for (let e = 0; e < this._players.length; e++) {
							let i = this._players[e];
							t.push(i.id - 1)
						}
				return t
			}
			return null
		}
		LookPos(t) {
			if (ni.Model != Lt.HumanModel || -1 != this._player.roomIndex)
				if (t + 1 < this._players.length) {
					let e = this._players[t + 1];
					e && ot.instance.Fire(ot.instance.MGM_LOOKPOS, e.x, e.y)
				} else if (t + 1 == this._players.length)
				if (ni.Model == Lt.HumanModel) ot.instance.Fire(ot.instance.MGM_LOOKPOS, this._player.x, this._player.y);
				else if (ni.Model == Lt.TrollModel) {
				let t = this._players[0];
				t && ot.instance.Fire(ot.instance.MGM_LOOKPOS, t.x, t.y)
			}
		}
	}
	class $t extends Laya.Script3D {
		constructor() {
			super(), this.cur_timer = 0
		}
		onEnable() {
			this.sp3 = this.owner, this.timer = W.Random.getRealInRandom(2e3, 3e3), this.cur_timer = Laya.timer.currTimer, this.point = new Laya.Sprite3D, this.anim = this.sp3.getComponent(Laya.Animator), this.playAnim("open"), Laya.timer.once(2e3, this, () => {
				this.playAnim("standby", .1)
			}), this.name = new Laya.Label, this.name.fontSize = 20, this.name.bold = !0, this.name.color = "#ffffff", this.name.align = "center", this.name.valign = "middle", this.name.width = 141, this.name.height = 35, this.name.anchorX = .5, this.name.anchorY = .5, this.name.font = "SimHei", this.name.text = this.name_n, Laya.stage.getChildAt(0).getChildAt(0).addChild(this.name), this.name.zOrder = 3
		}
		onUpdate() {
			let t = this.sp3.transform.position.clone();
			t.y += 1.5;
			let e = W.Transform3D.WorldToScreen2(this.camera, t);
			this.name.pos(e.x, e.y)
		}
		setPlayer(t) {
			this.player = t
		}
		playAnim(t, e = 0) {
			this.anim && (this.anim_name = t, this.anim.speed = 1, this.anim.crossFade(t, e))
		}
		onDisable() {
			this.name && this.name.destroy()
		}
	}
	class te extends Laya.Script3D {
		constructor() {
			super()
		}
		onEnable() {
			this.sp3 = this.owner, this.anim = this.sp3.getComponent(Laya.Animator), this.playAnim("open"), Laya.timer.once(2e3, this, () => {
				this.playAnim("standby", .1)
			}), this.name = new Laya.Label, this.name.fontSize = 20, this.name.bold = !0, this.name.color = "#ff0400", this.name.align = "center", this.name.valign = "middle", this.name.width = 141, this.name.height = 35, this.name.anchorX = .5, this.name.anchorY = .5, this.name.font = "SimHei", this.name.text = this.name_n, Laya.stage.getChildAt(0).getChildAt(0).addChild(this.name), this.name.zOrder = 3
		}
		onUpdate() {
			let t = this.sp3.transform.position.clone();
			t.y += 2.3;
			let e = W.Transform3D.WorldToScreen2(this.camera, t);
			this.name.pos(e.x, e.y)
		}
		playAnim(t, e = 0) {
			"standby" != t && this.anim && (this.anim_name = t, this.anim.speed = 1, this.anim.crossFade(t, e))
		}
		onDisable() {
			this.name && this.name.destroy()
		}
	}
	class ee extends Laya.Script3D {
		constructor() {
			super()
		}
		onEnable() {
			this.sp3 = this.owner
		}
		onDisable() {
			Laya.Tween.clearAll(this.sp3)
		}
		onUpdate() {
			this.target_pos
		}
	}
	class ie {
		constructor() {
			this.player_list = new Array, this.build_list = new Array, this._landSkin = [1e3, 1100, 1200, 1201, 1202, 1203, 1204, 1205, 0, 0, 1102], this._inSkin = [0, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2e3, 2100, 2200, 2300, 2400, 2500, 2600, 2700, 2800, 2801, 2802, 2803], this.home_camera_pos = W.Conversion.UnityToLayaPos(new Laya.Vector3(.84, .444, -2.61)), this.home_camera_ros = W.Conversion.UnityToLayaRE(new Laya.Vector3(.23, -20, 0)), this.match_camera_pos = W.Conversion.UnityToLayaPos(new Laya.Vector3(1.126, 2.16, -3.404)), this.match_camera_ros = W.Conversion.UnityToLayaRE(new Laya.Vector3(5, -20, 0)), this.match_camera_posX = W.Conversion.UnityToLayaPos(new Laya.Vector3(1.33, 1.81, -3.99)), this.match_camera_rosX = W.Conversion.UnityToLayaRE(new Laya.Vector3(6, -20, 0)), this.home_light_timer = 0, this.twinkle_index = 0
		}
		initData(t) {
			Et.InitLoadUI({
				caller: this,
				ch: W.CH.OPPO,
				plan_res: [this.load],
				dt: Ht,
				rpb_func: null,
				hn: "NullScene.scene",
				open_manual: !1,
				cache_func: () => {
					t()
				}
			})
		}
		static get instance() {
			return this._ins && null != this._ins || (this._ins = new ie), this._ins
		}
		load() {
			for (var t = 1e3; t <= 1001; t++) W.Mem.setMenu({
				id: t
			}, {
				sdc: 100,
				li: 5e3
			});
			for (t = 1100; t <= 1102; t++) W.Mem.setMenu({
				id: t
			}, {
				sdc: 100,
				li: 5e3
			});
			for (t = 1200; t <= 1205; t++) W.Mem.setMenu({
				id: t
			}, {
				sdc: 100,
				li: 5e3
			});
			for (t = 4e3; t <= 4001; t++) W.Mem.setMenu({
				id: t
			}, {
				sdc: 10,
				li: 100
			});
			for (var e = 0; e < 10; e++) W.Mem.setMenu({
				id: 1300,
				sid: e
			}, {
				sdc: 20,
				li: 100
			});
			for (e = 0; e < 13; e++) W.Mem.setMenu({
				id: 1400,
				sid: e
			}, {
				sdc: 20,
				li: 100
			});
			for (e = 0; e < 1; e++) W.Mem.setMenu({
				id: 1500,
				sid: e
			}, {
				sdc: 10,
				li: 100
			});
			for (e = 0; e < 10; e++) W.Mem.setMenu({
				id: 1600,
				sid: e
			}, {
				sdc: 10,
				li: 100
			});
			for (e = 0; e < 13; e++) W.Mem.setMenu({
				id: 1700,
				sid: e
			}, {
				sdc: 10,
				li: 100
			});
			for (e = 0; e < 13; e++) W.Mem.setMenu({
				id: 1701,
				sid: e
			}, {
				sdc: 10,
				li: 100
			});
			for (e = 0; e < 13; e++) W.Mem.setMenu({
				id: 4002,
				sid: e
			}, {
				sdc: 10,
				li: 100
			});
			for (e = 0; e < 2; e++) W.Mem.setMenu({
				id: 1800,
				sid: e
			}, {
				sdc: 10,
				li: 100
			});
			for (e = 0; e < 1; e++) W.Mem.setMenu({
				id: 1801,
				sid: e
			}, {
				sdc: 10,
				li: 100
			});
			for (e = 0; e < 2; e++) W.Mem.setMenu({
				id: 1900,
				sid: e
			}, {
				sdc: 10,
				li: 100
			});
			for (e = 0; e < 1; e++) W.Mem.setMenu({
				id: 1901,
				sid: e
			}, {
				sdc: 10,
				li: 100
			});
			for (e = 0; e < 1; e++) W.Mem.setMenu({
				id: 2e3,
				sid: e
			}, {
				sdc: 10,
				li: 100
			});
			for (e = 0; e < 1; e++) W.Mem.setMenu({
				id: 2100,
				sid: e
			}, {
				sdc: 10,
				li: 100
			});
			for (e = 0; e < 1; e++) W.Mem.setMenu({
				id: 2101,
				sid: e
			}, {
				sdc: 10,
				li: 100
			});
			for (e = 0; e < 1; e++) W.Mem.setMenu({
				id: 2200,
				sid: e
			}, {
				sdc: 10,
				li: 100
			});
			for (e = 0; e < 1; e++) W.Mem.setMenu({
				id: 2201,
				sid: e
			}, {
				sdc: 10,
				li: 100
			});
			for (e = 0; e < 2; e++) W.Mem.setMenu({
				id: 2300,
				sid: e
			}, {
				sdc: 10,
				li: 100
			});
			for (e = 0; e < 1; e++) W.Mem.setMenu({
				id: 2301,
				sid: e
			}, {
				sdc: 10,
				li: 100
			});
			for (e = 0; e < 1; e++) W.Mem.setMenu({
				id: 2400,
				sid: e
			}, {
				sdc: 10,
				li: 100
			});
			for (e = 0; e < 1; e++) W.Mem.setMenu({
				id: 2401,
				sid: e
			}, {
				sdc: 10,
				li: 100
			});
			for (e = 0; e < 1; e++) W.Mem.setMenu({
				id: 2500,
				sid: e
			}, {
				sdc: 10,
				li: 100
			});
			for (e = 0; e < 1; e++) W.Mem.setMenu({
				id: 2600,
				sid: e
			}, {
				sdc: 10,
				li: 100
			});
			for (e = 0; e < 1; e++) W.Mem.setMenu({
				id: 2700,
				sid: e
			}, {
				sdc: 10,
				li: 100
			});
			for (t = 2800; t <= 2803; t++) W.Mem.setMenu({
				id: t
			}, {
				sdc: 10,
				li: 100
			});
			for (t = 3e3; t <= 3005; t++) W.Mem.setMenu({
				id: t
			}, {
				snc: 10,
				li: 20
			});
			for (t = 3200; t <= 3206; t++) W.Mem.setMenu({
				id: t
			}, {
				snc: 10,
				li: 20
			});
			W.Mem.setMenu({
				id: 6e3
			}, {
				snc: 1,
				li: 1
			}), W.Mem.setMenu({
				id: 7e3
			}, {
				snc: 1,
				li: 1
			});
			for (t = 5e3; t <= 5007; t++) W.Mem.setMenu({
				id: t
			}, {
				snc: 5,
				li: 5
			});
			for (t = 5100; t <= 5104; t++) W.Mem.setMenu({
				id: t
			}, {
				sdc: 10,
				li: 10
			});
			for (t = 5200; t <= 5205; t++) W.Mem.setMenu({
				id: t
			}, {
				sdc: 10,
				li: 10
			})
		}
		addScene3D() {
			let t = Laya.stage.getChildAt(0).getChildAt(0);
			Et.build({
				ac: new W.Vec3(207 / 255, 207 / 255, 207 / 255),
				fp: 1e3,
				fog: !1,
				fc: new W.V3C(21, 24, 36),
				fs: 11,
				fr: 13.5,
				lc: new W.Vec3(1, 1, 1),
				li: 2.3,
				le: new W.Vec3(50, -30, 0)
			}, W.S3T.MAIN, t), Et.main.camera.orthographic = !1, Et.main.camera.fieldOfView = 45, Et.main.camera.transform.position = W.Conversion.UnityToLayaPos(new Laya.Vector3(0, 5, 0)), Et.main.camera.transform.rotationEuler = W.Conversion.UnityToLayaRE(new Laya.Vector3(50, -30, 0)), Et.main.camera.clearFlag = Laya.CameraClearFlags.SolidColor, Et.main.camera.clearColor = new Laya.Vector4(0, 0, 0, 1), t.addChild(Et.main.scene3D), Et.main.scene3D.zOrder = 2, Laya.timer.clearAll(this);
			let e = Et.main.scene3D.parent.getChildAt(7);
			e && (e.visible = !1)
		}
		addHomeScene() {
			W.Sound.playMusic(8001), this.home_scene = new Laya.Scene3D, Laya.stage.getChildAt(0).getChildAt(0).addChild(this.home_scene);
			let t = W.Mem.getSP(6e3);
			W.Transform3D.addChild(this.home_scene, t), this.home_scene.zOrder = 2;
			let e = W.Transform3D.Find(this.home_scene, "hp_player"),
				i = W.Mem.getSP(3e3 + di.instance.player.playerSelectIndex);
			W.Transform3D.addChild(e, i), this.setRoleIndesty(i, !0), this.home_camera = new Laya.Camera, this.home_camera.fieldOfView = 80;
			W.Comp.auto(this.home_camera, ee);
			W.Transform3D.addChild(this.home_scene, this.home_camera), this.home_camera.transform.rotationEuler = this.home_camera_ros, this.home_camera.transform.position = this.home_camera_pos, this.home_light = new Laya.DirectionLight, this.home_light.transform.rotationEuler = W.Conversion.UnityToLayaRE(new Laya.Vector3(50, 63, 0)), this.home_scene.addChild(this.home_light), this.home_light.lightmapBakedType, this.home_scene.enableFog = !1, this.home_scene.fogColor = new Laya.Vector3(49 / 255, 65 / 255, 89 / 255), this.home_scene.fogStart = 5, this.home_scene.fogRange = 15, this.setShadow();
			let s = "res/home/sky/sky_env1.lmat";
			this.home_camera.clearFlag = Laya.CameraClearFlags.Sky, Laya.loader.create(s, Laya.Handler.create(this, () => {
				let t = Laya.loader.getRes(s);
				this.home_camera.skyRenderer.material = t, this.home_light_timer = 0, Laya.timer.loop(1, this, this.whetherChange, [this.home_camera])
			}))
		}
		setShadow() {
			this.home_light.shadowMode = Laya.ShadowMode.SoftLow, this.home_light.shadowDistance = 20, this.home_light.shadowResolution = 1024, this.home_light.shadowCascadesMode = Laya.ShadowCascadesMode.NoCascades, this.home_light.shadowNormalBias = 2, this.home_light.lightmapBakedType = Laya.DirectionLight.LIGHTMAPBAKEDTYPE_REALTIME, this.home_light.shadowStrength = 1
		}
		setHomeCamera() {
			let t = this.home_camera.getComponent(ee);
			t.target_pos = this.home_camera_pos, t.target_ros = this.home_camera_ros, Laya.Tween.to(this.home_camera, {
				position: {
					x: t.target_pos.x,
					y: t.target_pos.y,
					z: t.target_pos.z
				}
			}, 1500, Laya.Ease.quartInOut), Laya.Tween.to(this.home_camera, {
				rotationEuler: {
					x: t.target_ros.x,
					y: t.target_ros.y,
					z: t.target_ros.z
				}
			}, 1500, Laya.Ease.quartInOut)
		}
		setMatchCamera() {
			let t = this.home_camera.getComponent(ee);
			Z.isX() ? (t.target_pos = this.match_camera_posX, t.target_ros = this.match_camera_rosX, Laya.Tween.to(this.home_camera, {
				position: {
					x: t.target_pos.x,
					y: t.target_pos.y,
					z: t.target_pos.z
				}
			}, 1500, Laya.Ease.quartInOut), Laya.Tween.to(this.home_camera, {
				rotationEuler: {
					x: t.target_ros.x,
					y: t.target_ros.y,
					z: t.target_ros.z
				}
			}, 1500, Laya.Ease.quartInOut)) : (t.target_pos = this.match_camera_pos, t.target_ros = this.match_camera_ros)
		}
		addHomeAI(t, e, i) {
			console.log("加ai", t);
			let s = [];
			W.Transform3D.FindFor(this.home_scene, ["hp_AI"], this, t => {
				s.push(t)
			});
			let n = W.Mem.getSP(3e3 + t),
				a = W.Comp.auto(n, $t, !0);
			a.name_n = i, a.camera = this.home_camera, W.Transform3D.addChild(s[e - 2], n);
			let l = W.Transform3D.Find(this.home_scene, "hp_player").getChildAt(0);
			a.setPlayer(l), this.setRoleIndesty(n, !0)
		}
		addHomePlayer() {
			let t = W.Transform3D.Find(this.home_scene, "hp_player");
			W.Mem.recoveryComplexSP(t, {
				rcom: !0
			});
			let e = W.Mem.getSP(3e3 + Qt.instance.selectIndex),
				i = W.Comp.auto(e, $t, !0);
			i.name_n = yi.instance.getLanguage("70"), i.camera = this.home_camera, W.Transform3D.addChild(t, e)
		}
		addHomeTroll(t, e) {
			console.log("加鬼", t);
			let i = W.Transform3D.Find(this.home_scene, "hp_enemy"),
				s = W.Mem.getSP(3200 + t),
				n = W.Comp.auto(s, te, !0);
			n.name_n = e, n.camera = this.home_camera, W.Transform3D.addChild(i, s), this.setRoleIndesty(s, !0), W.S3D.setShadowCast(s), ie.cur_troll_index = t
		}
		setRoleIndesty(t, e) {
			let i = this.getSkinMesh(t);
			for (var s = 0; s < i.length; s++) {
				let t = i[s];
				t.skinnedMeshRenderer.sharedMaterial.albedoIntensity = e ? 1.8 : 1.1
			}
		}
		getSkinMesh(t) {
			let e = [];
			for (var i = 0; i < t.numChildren; i++) {
				let s = t.getChildAt(i);
				s instanceof Laya.SkinnedMeshSprite3D && e.push(s)
			}
			return e
		}
		whetherChange(t) {
			if (t.skyRenderer.material.rotation += .001 * Laya.timer.delta * 3.6, this.home_light_timer += Laya.timer.delta, this.home_light_timer > 3100) this.home_light.intensity = .78, this.home_light_timer = 0;
			else if (this.home_light_timer > 3070) this.home_light.intensity = 6;
			else if (this.home_light_timer > 3050) this.home_light.intensity = .5;
			else if (this.home_light_timer > 3040) this.home_light.intensity = 8;
			else if (this.home_light_timer > 3030) this.home_light.intensity = 0;
			else if (this.home_light_timer > 3e3) {
				this.home_light.intensity = 5;
				let t = W.Transform3D.Find(this.home_scene, "effect_lighting"),
					e = W.Mem.getSP(5005);
				this.home_scene.addChild(e), e.transform.position = t.transform.position.clone(), e.transform.rotationEuler = t.transform.rotationEuler.clone(), W.Transform3D.playParticle(e)
			}
		}
		changePlayerSkin() {
			let t = W.Transform3D.Find(this.home_scene, "hp_player");
			W.Mem.recoveryComplexSP(t, {
				self: !1
			});
			let e = W.Mem.getSP(3e3 + di.instance.player.playerSelectIndex);
			W.Transform3D.addChild(t, e), this.setRoleIndesty(e, !0)
		}
		clearHome() {
			Laya.timer.clear(this, this.whetherChange), W.Mem.recoveryComplexSP(ie.instance.home_scene, {
				self: !0,
				rcom: !0
			}), ie.instance.home_scene.destroy(), W.Sound.playMusic(8e3)
		}
		addPlayer(t, e, i, s) {
			let n = new Laya.Sprite3D;
			Et.main.scene3D.addChild(n), n.name = "player";
			let a = 3e3;
			a = 0 == s ? 3e3 + Qt.instance.selectIndex : 3e3 + i.id - 1;
			let l = W.Mem.getSP(a),
				o = new Laya.Vector3(-t / 90, 0, -e / 90);
			if (o.y = 0, l)
				if (W.Transform3D.addChild(n, l), n.transform.position = o, this.player_list.push(n), this.setRoleIndesty(l, !1), 0 == s) {
					this.player_light = W.Mem.getSP(7e3), W.Transform3D.addChild(Et.main.scene3D, this.player_light);
					let t = W.Comp.auto(n, Nt);
					t.Player = i, t.player_light = this.player_light
				} else {
					W.Comp.auto(n, Nt).Player = i
				}
		}
		addTroll(t, e, i) {
			let s = new Laya.Sprite3D;
			Et.main.scene3D.addChild(s), s.name = "troll";
			let n = W.Mem.getSP(3200 + di.instance.player.trollIndex),
				a = new Laya.Vector3(-t / 90, 0, -e / 90);
			if (a.y = 0, n) {
				W.Transform3D.addChild(s, n), s.transform.position = a;
				let t = W.Comp.auto(s, Gt);
				t.Troll = i, this.troll = s, this.setRoleIndesty(n, !1), ni.Model == Lt.TrollModel && (this.player_light = W.Mem.getSP(7e3), W.Transform3D.addChild(Et.main.scene3D, this.player_light), t.troll_light = this.player_light)
			}
		}
		clearScene3D() {
			Et.main.scene3D && (W.Mem.recoveryComplexSP(Et.main.scene3D, {
				rcom: !0
			}), Et.main.scene3D.destroy()), Et.main.scene3D = null, this.build_list = [], this.player_list = [], this.build_list.length = 0, this.player_list.length = 0, this.twinkle_index = 0
		}
		showLand(t, e, i, s) {
			let n = this._landSkin[i];
			if (n) {
				let i = W.Mem.getSP(n),
					a = new Laya.Vector3(-t / 90, 0, -e / 90);
				a.y = 0, i && (Et.main.scene3D.addChild(i), i.transform.position = a, s % 180 == 0 && (s += 180), s += 180, i.transform.rotationEuler = new Laya.Vector3(0, s, 0))
			}
		}
		showIn(t, e, i, s, n, a) {
			let l = new Laya.Vector3(-t / 90, .2, -e / 90);
			l.y = 0;
			let o = new Laya.Sprite3D;
			Et.main.scene3D.addChild(o), o.transform.position = l, s % 180 == 0 && (s += 180), i == mt.door_1 || i == mt.at_1 ? o.transform.rotationEuler = new Laya.Vector3(0, s, 0) : o.transform.rotationEuler = new Laya.Vector3(0, 0, 0);
			let h = this._inSkin[i];
			if (h) {
				let s;
				if (s = i >= 16 ? W.Mem.getSP(h) : W.Mem.getSP(h, 0), new Laya.Vector3(-t / 90, .2, -e / 90).y = 0, s) {
					let t;
					if (s.numChildren > 1 && s.getChildAt(1) && s.getChildAt(1).numChildren > 0 && "player" == s.getChildAt(1).getChildAt(0).name && s.getChildAt(1).getChildAt(0).destroy(), W.Transform3D.addChild(o, s), i == mt.door_1) t = W.Comp.auto(o, Ut, !0);
					else if (i == mt.entrapment_1) t = W.Comp.auto(o, Kt, !0);
					else if (i == mt.guillotine_1) t = W.Comp.auto(o, zt, !0);
					else if (i == mt.solenoid_1) t = W.Comp.auto(o, jt, !0);
					else if (i == mt.spell_1) t = W.Comp.auto(o, qt, !0);
					else if (i == mt.at_1) {
						let e = W.Mem.getSP(h + 1, 0),
							i = W.Transform3D.Find(s, "hp_at_b");
						W.Transform3D.addChild(i, e), t = W.Comp.auto(o, Wt, !0)
					} else t = W.Comp.auto(o, kt, !0);
					return t.roomIndex = n, t.inSkin = i, t.rid = h, t.blockImg = a, this.build_list.push(o), o
				}
				console.log("sp3 null")
			}
		}
		setNewBuildBlock(t, e) {
			for (var i = 0; i < this.build_list.length; i++) {
				let s = this.build_list[i],
					n = s.getComponent(kt);
				if (n || console.log("setNewBuildBlock BuildScript null"), n.blockImg == e) {
					n.block = t, t.SP3 = s;
					break
				}
			}
		}
		ShowTwinkle(t, e) {
			let i = new Laya.Sprite3D;
			Et.main.scene3D.addChild(i);
			let s = new Laya.Vector3(-t / 90, 0, -e / 90);
			i.transform.position = s; {
				let t = W.Mem.getSP(4001);
				t && (this.twinkle_index += 1, W.Transform3D.addChild(i, t), this.twinkle_index <= 1 && W.Comp.auto(t, Vt, !0))
			}
		}
		ShowJT(t, e, i) {
			{
				let s = W.Mem.getSP(4e3),
					n = new Laya.Vector3(-t / 90, 0, -e / 90);
				if (n.y = .1, s) {
					return Et.main.scene3D.addChild(s), s.transform.position = n, i % 180 == 0 && (i += 180), s.transform.rotationEuler = new Laya.Vector3(0, i, 0), W.Comp.auto(s, Dt, !0).jtShow(), s
				}
			}
		}
		setCameraPos(t, e) {
			let i = new Laya.Vector3(-t / 90, 0, -e / 90);
			Laya.Vector3.add(i, W.Conversion.UnityToLayaPos(new Laya.Vector3(5.44, 13.53, -9.73)), i), Et.main.camera.transform.position = i
		}
		closeDoor(t) {
			this.getDoor(t).getComponent(Ut).closeDoor()
		}
		openDoor(t, e, i, s) {
			let n = this.getDoor(t).getComponent(Ut);
			n.openDoor();
			let a = ie.instance.ShowJT(e, i, s);
			n.JT = a
		}
		getDoor(t) {
			let e;
			for (var i = 0; i < this.build_list.length; i++) {
				let s = this.build_list[i],
					n = s.getComponent(kt);
				if (n.inSkin == mt.door_1 && n.roomIndex == t) {
					e = s;
					break
				}
			}
			return e
		}
		getBuild(t) {
			for (var e = 0; e < this.build_list.length; e++) {
				let i = this.build_list[e];
				if (i.getComponent(kt).blockImg == t.build) return i
			}
		}
		BuildUp(t) {
			for (var e = 0; e < this.build_list.length; e++) {
				let i = this.build_list[e],
					s = i.getComponent(kt);
				if (s.block && t.build) {
					if (s.block.build == t.build && (s.BuildUp(), ni.Model == Lt.HumanModel && t.roomIndex == Qt.instance.player.roomIndex)) {
						let t = W.Mem.getSP(5006);
						Et.main.scene3D.addChild(t);
						let e = i.transform.position.clone();
						e.y = .1, t.transform.position = e, W.Transform3D.playParticle(t)
					}
				} else console.warn("警告：当前建筑没有block ", i)
			}
		}
		mouseDown(t) {
			let e = Et.main.camera,
				i = Laya.Browser.width / 640,
				s = new Laya.Vector2(Laya.stage.mouseX * i, Laya.stage.mouseY * i),
				n = new Laya.Ray(new Laya.Vector3(0, 0, 0), new Laya.Vector3(0, 0, 0)),
				a = new Laya.HitResult;
			if (e.viewportPointToRay(s, n), Et.main.scene3D.physicsSimulation.rayCast(n, a), a.succeeded) {
				a.point;
				let e = a.collider.owner,
					i = Math.floor(-e.transform.position.x),
					s = Math.floor(-e.transform.position.z);
				var l = t.RoomFindBlock(s, i); - 1 != l.roomIndex ? ot.instance.Fire(ot.instance.CLICK_BUILD, s, i, l.inSkin, l.roomIndex) : ot.instance.Fire(ot.instance.HIDE_MENU)
			} else ot.instance.Fire(ot.instance.HIDE_MENU)
		}
		MoveMap(t) {
			if (ni.Model == Lt.TrollModel && ni.isTrollGameStart) return;
			Et.main.camera.transform.translate(new Laya.Vector3(t.x / 90, 0, t.y / 90), !1)
		}
		PlayerMovePosFix(t) {
			let e = -Et.main.camera.transform.localRotationEulerY - 180;
			return t = W.Vec2.rotate(t, W.Vec2.ZERO, e * W.Mathf.DegToRad)
		}
		getSp3ByBlock(t) {
			for (var e = 0; e < this.build_list.length; e++) {
				let i = this.build_list[e],
					s = i.getComponent(kt);
				if (s && s.block && t && s.block.build == t.build) return i
			}
		}
		goBed(t) {
			for (var e = 0; e < this.player_list.length; e++) {
				let i = this.player_list[e].getComponent(Nt);
				i.Player.player == t.player && i.upBed()
			}
		}
		setTowerSub(t, e) {
			for (var i = 0; i < this.build_list.length; i++) {
				let s = this.build_list[i].getComponent(kt);
				if (s.block && s.inSkin == mt.at_1 && s.block.build == e) return void(s.Obj = t)
			}
		}
		playerMove(t) {
			for (var e = 0; e < this.player_list.length; e++) {
				let i = this.player_list[e].getComponent(Nt);
				i.Player.player == t.player && (i.Player.bed || i.playAnim("walk", 0))
			}
		}
		trollMove(t) {
			if (!t) return;
			let e = this.troll.getComponent(Gt);
			e && e.Troll && e.playAnim("walk", .1)
		}
		playerStand(t) {
			if (t)
				for (var e = 0; e < this.player_list.length; e++) {
					let i = this.player_list[e].getComponent(Nt);
					i.Player.player == t.player && (i.Player.bed || i.playAnim("standby", 0))
				}
		}
		trollStand(t) {
			if (!t) return;
			let e = this.troll.getComponent(Gt);
			if (e && e.Troll) {
				"walk" == e.anim.getControllerLayer().getCurrentPlayState().animatorState.name && e.playAnim("stand", .1)
			}
		}
		trollDead() {
			let t = this.troll.getComponent(Gt);
			t ? t.playAnim("dead") : console.warn("鬼没有脚本")
		}
		playHitDoorEffect(t) {
			let e = this.getDoor(t.roomIndex),
				i = e.transform.position.clone(),
				s = e.transform.rotationEuler.clone();
			i.y += .5, this.playEffect(5e3, i, s)
		}
		playEffect(t, e, i = null) {
			let s = W.Mem.getSP(t);
			Et.main.scene3D.addChild(s), s.transform.position = e.clone(), i && (s.transform.rotationEuler = i.clone()), W.Transform3D.playParticle(s)
		}
		playTrollUpEffect() {
			if (this.troll) {
				let t = W.Mem.getSP(5003);
				this.troll.addChild(t);
				let e = this.troll.transform.position.clone();
				e.y += .1, t.transform.position = e, W.Transform3D.playParticle(t), Laya.timer.once(2e3, this, () => {
					W.Mem.recoverySP(t)
				})
			}
		}
		playTrollRBloodEffect() {
			if (this.troll) {
				let t = W.Mem.getSP(5004);
				this.troll.addChild(t);
				let e = this.troll.transform.position.clone();
				e.y += .1, t.transform.position = e, W.Transform3D.playParticle(t), Laya.timer.once(2e3, this, () => {
					W.Mem.recoverySP(t)
				})
			}
		}
		showTrollRBloodEffect() {
			if (!this.troll) return;
			if (this._bloodEffect) return;
			this._bloodEffect = W.Mem.getSP(5004), this.troll.addChild(this._bloodEffect);
			let t = this.troll.transform.position.clone();
			t.y += .1, this._bloodEffect.transform.position = t, W.Transform3D.playParticle(this._bloodEffect)
		}
		hideTrollRBloodEffect() {
			this._bloodEffect && (W.Mem.recoverySP(this._bloodEffect), this._bloodEffect = null)
		}
		playTrollRageEffect() {
			if (this._effect_troll_rage && (W.Mem.recoverySP(this._effect_troll_rage), this._effect_troll_rage = null), this.troll) {
				let t = W.Mem.getSP(5001);
				this.troll.addChild(t);
				let e = this.troll.transform.position.clone();
				e.y += .1, t.transform.position = e, W.Transform3D.playParticle(t), Laya.timer.once(2e3, this, () => {
					W.Mem.recoverySP(t)
				})
			}
		}
		showTrollRageEffect() {
			if (!this.troll) return;
			if (null != this._effect_troll_rage) return;
			this._effect_troll_rage = W.Mem.getSP(5001), this.troll.addChild(this._effect_troll_rage);
			let t = this.troll.transform.position.clone();
			t.y += .1, this._effect_troll_rage.transform.position = t, W.Transform3D.playParticle(this._effect_troll_rage)
		}
		hideTrollRageEffect() {
			this.troll && null != this._effect_troll_rage && (W.Mem.recoverySP(this._effect_troll_rage), this._effect_troll_rage = null)
		}
		showTrollShieldEffect() {
			if (!this.troll) return;
			if (null != this._effect_troll_shield) return;
			this._effect_troll_shield = W.Mem.getSP(5002), this.troll.addChild(this._effect_troll_shield);
			let t = this.troll.transform.position.clone();
			t.y += .1, this._effect_troll_shield.transform.position = t, W.Transform3D.playParticle(this._effect_troll_shield)
		}
		hideTrollShieldEffect() {
			this.troll && null != this._effect_troll_shield && (W.Mem.recoverySP(this._effect_troll_shield), this._effect_troll_shield = null)
		}
		buildVertigoEffect(t) {
			let e = W.Mem.getSP(5007);
			Et.main.scene3D.addChild(e);
			let i = this.getBuild(t).transform.position.clone();
			i.y = .9, e.transform.position = i, W.Transform3D.playParticle(e), Laya.timer.once(3e3, this, () => {
				W.Mem.recoverySP(e)
			})
		}
		IceEvent(t) {
			if (t)
				for (var e = 0; e < this.build_list.length; e++) {
					let i = this.build_list[e],
						s = i.getComponent(kt);
					if (s.block && s.inSkin == mt.ice_1) {
						let e = this.getDoor(t.roomIndex);
						s.IceEvent(e), W.Comp.auto(i, Yt).ShowTwinkle()
					}
				}
		}
		BarbEvent(t) {
			if (t)
				for (var e = 0; e < this.build_list.length; e++) {
					let i = this.build_list[e],
						s = i.getComponent(kt);
					if (s.block && s.inSkin == mt.barb_1) {
						let e = this.getDoor(t.roomIndex);
						s.BarbEvent(e), W.Comp.auto(i, Xt).ShowTwinkle()
					}
				}
		}
		SpellEvent(t) {
			if (t)
				for (var e = 0; e < this.build_list.length; e++) {
					let t = this.build_list[e].getComponent(kt);
					t.block && t.inSkin == mt.spell_1 && t.SpellEvent(this.troll)
				}
		}
		EntrapmentEvent(t) {
			if (t)
				for (var e = 0; e < this.build_list.length; e++) {
					let t = this.build_list[e].getComponent(kt);
					t.block && t.inSkin == mt.entrapment_1 && t.EntrapmentEvent(this.troll)
				}
		}
		GuillotineEvent(t) {
			if (t)
				for (var e = 0; e < this.build_list.length; e++) {
					let t = this.build_list[e].getComponent(kt);
					t.block && t.inSkin == mt.guillotine_1 && t.GuillotineEvent(this.troll)
				}
		}
		EnergyhoodEvent(t) {
			if (t)
				for (var e = 0; e < this.build_list.length; e++) {
					let i = this.build_list[e].getComponent(kt);
					if (i.block && i.inSkin == mt.energyhood_1) {
						let e = this.getDoor(t.roomIndex);
						i.EnergyhoodEvent(e)
					}
				}
		}
		birthGoldEvent(t) {
			for (var e = 0; e < this.build_list.length; e++) {
				let i = this.build_list[e].getComponent(kt);
				i.block && i.block.build == t.build && i.birthGoldEvent()
			}
		}
		BuildDismantle(t) {
			let e, i = -1;
			for (var s = 0; s < this.build_list.length; s++) {
				let n = (e = this.build_list[s]).getComponent(kt);
				if (n.block && n.block.build == t.build) {
					i = s;
					break
				}
			}
			i > -1 && (this.build_list.splice(i, 1), W.Mem.recoveryComplexSP(e, {
				self: !0,
				rcom: !0
			}))
		}
	}
	ie.cur_troll_index = 0, ie.load_all = !1;
	class se {
		constructor() {
			this._images = [], this._showArea = [], this._blackArr = [], this._mapW = 90, this._showDataCoordinate = {
				startX: 0,
				endX: 44,
				startY: 0,
				endY: 36
			}, this._resShowMap = !1, this._screen = Laya.stage.getChildAt(0).getChildAt(0), this._sceneWidth = Laya.stage.width, this._sceneHeight = Laya.stage.height, this._screen.width = this._sceneWidth, this._screen.height = this._sceneHeight, this._showCols = Math.floor((this._sceneHeight + 180) / this._mapW), this._showRows = Math.floor((this._sceneWidth + 180) / this._mapW), this._images = new Array, this._showArea = new Array, this._blackArr = new Array, this._panelMap = new Laya.Sprite, this._landMap = new Laya.Sprite, this._inMap = new Laya.Sprite, this._activityMap = new Laya.Sprite, this._panelMap.addChild(this._landMap), this._panelMap.addChild(this._inMap), this._panelMap.addChild(this._activityMap), this._screen.addChild(this._panelMap)
		}
		AddEvent() {
			ot.instance.AddListEvent(ot.instance.CLICK_MAP, this.BlockClickEvent, this), ot.instance.AddListEvent(ot.instance.SET_POS_MENU, this.SetBuildMenuPos, this), ot.instance.AddListEvent(ot.instance.MAP_BUILD_NEW, this.NewBuild, this), ot.instance.AddListEvent(ot.instance.MAP_UPBUILD, this.BuildUp, this), ot.instance.AddListEvent(ot.instance.MAP_BUILD_DISMANTLE, this.BuildDismantle, this), ot.instance.AddListEvent(ot.instance.MAP_ADD_ACTIVITY, this.AddAtivity, this), ot.instance.AddListEvent(ot.instance.MAP_MAPMOVE, this.MoveMap, this), ot.instance.AddListEvent(ot.instance.MAP_DISTANCE, this.ReturnDistance, this), ot.instance.AddListEvent(ot.instance.MAP_GET_ACTIVITYMAP, this.GetActivityMap, this), ot.instance.AddListEvent(ot.instance.MAP_DEMOLISH, this.Demolish, this)
		}
		SetMapData(t) {
			ie.instance.addScene3D(), this._mapData = t, this.readMapCR(), this.Init()
		}
		Init() {
			this._landMap.width = this._numRows * this._mapW, this._landMap.height = this._numCols * this._mapW, this._inMap.width = this._numRows * this._mapW, this._inMap.height = this._numCols * this._mapW, this._activityMap.width = this._numRows * this._mapW, this._activityMap.height = this._numCols * this._mapW, this._panelMap.width = this._numRows * this._mapW, this._panelMap.height = this._numCols * this._mapW, this._landMap.pos(0, 0), this._inMap.pos(0, 0)
		}
		readMapCR() {
			let t = this._mapData.GetMapColsOrRows();
			this._numCols = t[0], this._numRows = t[1]
		}
		get numCols() {
			return this._numCols
		}
		get numRows() {
			return this._numRows
		}
		GetImage() {
			var t;
			return this._images.length > 0 && (t = this._images.shift()), null == t && (t = this.CreateImage()), t.visible = !0, t.width = 90.4, t.height = 90.4, t.pivot(45.2, 45.2), t.rotation = 0, t.name = "", t
		}
		CreateImage() {
			return new Laya.Image
		}
		ClearMap() {
			for (let t = this._landMap.numChildren - 1; t >= 0; t--) {
				let e = this._landMap.getChildAt(t);
				e.visible = !1, this._images.push(e), this._landMap.removeChild(e)
			}
			ie.instance.clearScene3D()
		}
		Demolish(t, e) {
			null != t && (this._images.push(t), t.visible = !1, this._inMap.removeChild(t)), null != e && (this._images.push(e), e.visible = !1)
		}
		get panelMap() {
			return this._panelMap
		}
		SetShowPoint(t, e, i, s) {
			this._showX = t, this._showY = e, this._posX = i, this._posY = s
		}
		ShowPoint() {
			for (let e = this._showDataCoordinate.startX; e < this._showDataCoordinate.endX + 1; e++) {
				var t = [];
				for (let i = this._showDataCoordinate.startY; i < this._showDataCoordinate.endY + 1; i++) t.push(this.ShowLandImag(e, i));
				this._showArea.push(t)
			}
			this.MoveMapReachPos(this._posX, this._posY, this._showX, this._showY), this.BuildIn()
		}
		MoveMapReachPos(t, e, i, s) {
			var n = this.ScreenPosTMapPos(t, e),
				a = this.DataPosTMapPos(i, s),
				l = [n.x - a.x, n.y - a.y];
			this._panelMap.x += l[0], this._panelMap.y += l[1]
		}
		ShowLandImag(t, e) {
			let i = this._mapData.readMap(t, e),
				s = 90 * e + 45,
				n = 90 * t + 45,
				a = this.GetImage();
			return this._landMap.addChild(a), a.pos(s, n), a.rotation = 90 * i.landRot, this.SetMapSkin(a, null, i.landBlock, null), a.name = t + "_" + e, ie.instance.showLand(s, n, i.landBlock, a.rotation), a
		}
		ShowInImag(t, e, i = 0) {
			let s = this._mapData.readMap(t, e),
				n = 90 * e + 45,
				a = 90 * t + 45,
				l = this.GetImage();
			return this._inMap.addChild(l), l.pos(n, a), l.rotation = 90 * s.inRot, this.SetMapSkin(null, l, null, s.inBlock), ie.instance.showIn(n, a, s.inBlock, l.rotation, i, l), l
		}
		SetMapSkin(t, e, i, s) {
			var n = this._mapData.GetImageSkin(i, s);
			null != t && (t.skin = "map/" + n.landSkin + ".png", t.name = n.landSkin), null != e && this.SkinSelect(e, n.inSkin)
		}
		SkinSelect(t, e) {
			var i = e.split("_")[0];
			if (t.name = e, "at" == i) {
				let i;
				t.skin = "Atower/" + e + ".png", t.numChildren > 0 ? i = t.getChildAt(0) : (i = this.GetImage(), t.addChild(i), i.pos(45, 45)), i.skin = "Atower/" + e + "_B.png"
			} else t.skin = "build/" + e + ".png"
		}
		CalculationShowRangeY() {
			var t, e, i = this._posX,
				s = this._sceneWidth - i + 45,
				n = i + 45,
				a = Math.floor(s / 90),
				l = Math.floor(n / 90);
			t = this._showY - l, e = this._showY + a, t = Math.max(0, t), e = Math.min(e, this._numRows), this._showDataCoordinate.startY = t, this._showDataCoordinate.endY = e
		}
		CalculationShowRangeX() {
			var t, e, i = this._posY,
				s = this._sceneHeight - i + 45,
				n = i + 45,
				a = Math.floor(s / 90),
				l = Math.floor(n / 90);
			t = this._showX - l, e = this._showX + a, t = Math.max(0, t), e = Math.min(e + 1, this._numCols), this._showDataCoordinate.startX = t, this._showDataCoordinate.endX = e
		}
		BlockClickEvent(t, e, i) {
			ie.instance.mouseDown(this._mapData)
		}
		ScreenPosTMapPos(t, e) {
			return {
				x: t - this._panelMap.x,
				y: e - this._panelMap.y
			}
		}
		MapPosTScreenPos(t, e) {
			return {
				x: t + this._panelMap.x,
				y: e + this._panelMap.y
			}
		}
		MapPosTDataPos(t, e) {
			return {
				x: Math.floor(e / this._mapW),
				y: Math.floor(t / this._mapW)
			}
		}
		DataPosTMapPos(t, e) {
			return {
				x: e * this._mapW + 45,
				y: t * this._mapW + 45
			}
		}
		MoveMap(t, e, i = !0) {
			let s = new W.Vec2(t, e);
			i && (s = ie.instance.PlayerMovePosFix(s)), t = s.x, e = s.y, 0 == t && 0 == e || (t > 0 ? this._panelMap.x < -80 ? this._panelMap.x += t : t = 0 : this._panelMap.x > -(this._panelMap.width - this._sceneWidth - 80) ? this._panelMap.x += t : t = 0, e > 0 ? this._panelMap.y < -80 ? this._panelMap.y += e : e = 0 : this._panelMap.y > -(this._panelMap.height - this._sceneHeight - 80) ? this._panelMap.y += e : e = 0, 0 == t && 0 == e || (s.setValue(t, e), ie.instance.MoveMap(s)))
		}
		IsScreenRange(t, e) {
			let i = this.MapPosTDataPos(t, e);
			return i.x >= this._showDataCoordinate.startX && i.x <= this._showDataCoordinate.endX && i.y >= this._showDataCoordinate.startY && i.y <= this._showDataCoordinate.endY
		}
		DetectionDisplayArea(t, e) {}
		RecyclingResourcesOutsideTheArea(t, e) {
			var i = null;
			if (t > 0 ? (i = this._showArea.shift(), this._showArea.push(i)) : t < 0 && (i = this._showArea.pop(), this._showArea.unshift(i)), null != i)
				for (let t = 0; t < i.length; t++) {
					var s = i[t];
					this._images.push(s), i[t] = null
				}
			if (e > 0)
				for (let t = 0; t < this._showArea.length; t++)
					for (let e = 0; e < this._showArea[t].length; e++) {
						if (null == (s = this._showArea[t][e])) break;
						0 == e ? this._images.push(s) : (this._showArea[t][e - 1] = s, e == this._showArea[t].length - 1 && (this._showArea[t][e] = null))
					} else if (e < 0)
						for (let t = 0; t < this._showArea.length; t++)
							for (let e = this._showArea[t].length - 1; e >= 0; e--) {
								if (null == (s = this._showArea[t][e])) break;
								e == this._showArea[t].length - 1 ? this._images.push(s) : (this._showArea[t][e + 1] = s, 0 == e && (this._showArea[t][e] = null))
							}
			this._showDataCoordinate.startX += t, this._showDataCoordinate.endX += t, this._showDataCoordinate.startY += e, this._showDataCoordinate.endY += e
		}
		ShowDisplayableArea() {
			for (let e = this._showDataCoordinate.startX; e < this._showDataCoordinate.endX + 1; e++)
				for (let i = this._showDataCoordinate.startY; i < this._showDataCoordinate.endY + 1; i++) {
					var t = this._showArea[e - this._showDataCoordinate.startX][i - this._showDataCoordinate.startY];
					null == t && (t = this.ShowLandImag(e, i), this._showArea[e - this._showDataCoordinate.startX][i - this._showDataCoordinate.startY] = t)
				}
			console.log("测试2", "startX:", this._showDataCoordinate.startX, "endX:", this._showDataCoordinate.endX, "startY:", this._showDataCoordinate.startY, "endY:", this._showDataCoordinate.endY), this._resShowMap = !1
		}
		BuildIn() {
			var t = this._mapData.build;
			if (!(t.length <= 0)) {
				var e = new Array;
				for (let i = 0; i < t.length; i++) {
					let s = t[i],
						n = this._mapData.BlockFindRoom(s.x, s.y);
					e.push({
						pos: s.x + "_" + s.y,
						build: this.ShowInImag(s.x, s.y, n),
						roomIndex: n
					})
				}
				ot.instance.Fire(ot.instance.COLLECTIVE_BUILD, e)
			}
		}
		NewBuild(t, e, i) {
			this._mapData.SetMap(t, e, i);
			let s = this.ShowInImag(t, e),
				n = this._mapData.BlockFindRoom(t, e);
			ot.instance.Fire(ot.instance.BUILD_NEW, t + "_" + e, s, n), xt.instance.AddEffect(xt.instance.effectStr.buildDownEffect, s.x, s.y)
		}
		BuildUp(t, e) {
			this.SkinSelect(t, e)
		}
		BuildDismantle(t, e, i) {
			if (null != t && (this._inMap.removeChild(t), t.visible = !1, t.numChildren > 0))
				for (let e = t.numChildren - 1; e >= 0; e--) {
					let i = t.getChildAt(e);
					i.visible = !1, t.removeChild(i), this._images.push(i)
				}
			let s = this.MapPosTDataPos(e, i);
			this._mapData.SetMap(s.x, s.y, "")
		}
		SetBuildMenuPos(t, e, i) {
			let s = this.DataPosTMapPos(t, e),
				n = this.MapPosTScreenPos(s.x, s.y);
			i.pos(n.x, n.y), ot.instance.Fire(ot.instance.SHOW_MENU)
		}
		ReturnDistance(t, e) {
			let i = t.x,
				s = t.y,
				n = Math.abs(i - e.x),
				a = Math.abs(s - e.y);
			return n * n + a * a
		}
		AddAtivity(t, e, i) {
			this._activityMap.addChild(t);
			let s = this.DataPosTMapPos(e, i);
			t.pos(s.x, s.y)
		}
		GetActivityMap() {
			return this._activityMap
		}
		GetPathMapPos(t) {
			if (!t) return null;
			let e = [];
			for (let i = 1; i < t.length; i++) {
				let s = t[i],
					n = this.DataPosTMapPos(s.x, s.y);
				e.push([n.x, n.y])
			}
			return e
		}
		GameOver() {
			this._showArea.length = 0, this._showDataCoordinate = {
				startX: -1,
				startY: -1,
				endX: -1,
				endY: -1
			}, this.ClearMap(), this.SelfTest(), this.ClearRoomblack(), this._showDataCoordinate = {
				startX: 0,
				endX: 44,
				startY: 0,
				endY: 36
			}
		}
		SelfTest() {
			if (this._images.length > 0)
				for (let t = this._images.length - 1; t >= 0; t--) {
					let e = this._images[t];
					for (let i = t - 1; i >= 0; i--) {
						e == this._images[i] && this._images.splice(i, 1)
					}
				}
		}
		RoomBlack(t) {
			if (t.length > 0)
				for (let e = 0; e < t.length; e++) {
					let i = t[e],
						s = this.GetImage();
					this._activityMap.addChild(s), s.pos(i.x, i.y), s.skin = "UI/zhezhao.png", s.alpha = 0, this._blackArr.push(s), Pt.instance.Alpha(s, 1, 1)
				}
		}
		ClearRoomblack() {
			if (this._blackArr.length > 0) {
				for (let t = 0; t < this._blackArr.length; t++) {
					let e = this._blackArr[t];
					e.removeSelf(), e.visible = !1, this._images.push(e)
				}
				this._blackArr = []
			}
		}
		get MapPanelMaxPos() {
			return {
				x: this._panelMap.width - 80,
				y: this._panelMap.height - 80
			}
		}
	}
	class ne {
		constructor() {
			this._index = null, this._landSkin = ["floor_1", "floor_2", "wall_1", "wall_2", "wall_3", "wall_4", "wall_5", "wall_6", "empty_1", "HSZZ0_1", "hxk_1"], this._map = [], this._index = null, this._maps = {
				map0: [
					["9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "3_3_0_0", "6_3_0_0", "3_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0"],
					["9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "6_2_0_0", "10_0_0_0", "6_2_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0"],
					["9_0_0_0", "9_0_0_0", "2_0_0_0", "6_3_0_0", "6_3_0_0", "6_3_0_0", "6_3_0_0", "6_3_0_0", "6_3_0_0", "6_3_0_0", "6_3_0_0", "6_3_0_0", "6_3_0_0", "6_3_0_0", "6_3_0_0", "6_3_0_0", "6_3_0_0", "6_3_0_0", "6_3_0_0", "6_3_0_0", "6_3_0_0", "6_3_0_0", "3_1_0_0", "10_0_0_0", "3_2_0_0", "6_3_0_0", "6_3_0_0", "6_3_0_0", "6_3_0_0", "6_3_0_0", "6_3_0_0", "6_3_0_0", "6_3_0_0", "6_3_0_0", "3_0_0_0", "9_0_0_0", "9_0_0_0"],
					["9_0_0_0", "9_0_0_0", "4_2_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "4_0_0_0", "9_0_0_0", "9_0_0_0"],
					["9_0_0_0", "9_0_0_0", "4_2_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "4_0_0_0", "9_0_0_0", "9_0_0_0"],
					["9_0_0_0", "9_0_0_0", "4_2_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "2_0_0_0", "6_3_0_0", "6_3_0_0", "6_3_0_0", "6_3_0_0", "3_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "2_0_0_0", "6_3_0_0", "6_3_0_0", "6_3_0_0", "6_3_0_0", "3_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "2_0_0_0", "6_3_0_0", "6_3_0_0", "6_3_0_0", "3_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "4_0_0_0", "9_0_0_0", "9_0_0_0"],
					["9_0_0_0", "9_0_0_0", "4_2_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "4_2_0_0", "1_0_0_0", "1_0_0_0", "1_0_0_0", "1_0_0_0", "4_0_0_0", "0_0_0_0", "0_0_0_0", "2_0_0_0", "5_2_0_0", "1_0_0_0", "1_0_0_0", "1_0_0_0", "1_0_0_0", "4_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "4_2_0_0", "1_0_0_0", "1_0_1_0", "1_0_0_0", "4_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "4_0_0_0", "9_0_0_0", "9_0_0_0"],
					["9_0_0_0", "9_0_0_0", "4_2_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "4_2_0_0", "1_0_0_0", "1_0_0_0", "1_0_0_0", "1_0_0_0", "4_0_0_0", "0_0_0_0", "0_0_0_0", "4_2_0_0", "1_0_0_0", "1_0_0_0", "1_0_0_0", "1_0_0_0", "1_0_0_0", "4_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "4_2_0_0", "1_0_0_0", "1_0_0_0", "1_0_0_0", "4_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "4_0_0_0", "9_0_0_0", "9_0_0_0"],
					["9_0_0_0", "9_0_0_0", "4_2_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "4_2_0_0", "1_0_0_0", "1_0_0_0", "1_0_1_0", "1_0_0_0", "4_0_0_0", "0_0_0_0", "0_0_0_0", "4_2_0_0", "1_0_0_0", "1_0_0_0", "3_3_0_0", "6_1_0_0", "6_1_0_0", "2_2_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "4_2_0_0", "1_0_0_0", "1_0_0_0", "1_0_0_0", "4_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "4_0_0_0", "9_0_0_0", "9_0_0_0"],
					["9_0_0_0", "9_0_0_0", "4_2_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "4_2_0_0", "1_0_0_0", "1_0_0_0", "1_0_0_0", "1_0_0_0", "4_0_0_0", "0_0_0_0", "0_0_0_0", "4_2_0_0", "1_0_0_0", "1_0_0_0", "1_0_2_3", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "4_2_0_0", "1_0_0_0", "1_0_0_0", "1_0_0_0", "4_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "4_0_0_0", "9_0_0_0", "9_0_0_0"],
					["9_0_0_0", "9_0_0_0", "4_2_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "4_2_0_0", "1_0_0_0", "1_0_0_0", "1_0_0_0", "1_0_0_0", "4_0_0_0", "0_0_0_0", "0_0_0_0", "4_2_0_0", "1_0_0_0", "1_0_0_0", "2_3_0_0", "6_3_0_0", "6_3_0_0", "6_3_0_0", "3_0_0_0", "0_0_0_0", "0_0_0_0", "4_2_0_0", "1_0_0_0", "1_0_0_0", "1_0_0_0", "4_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "4_0_0_0", "9_0_0_0", "9_0_0_0"],
					["9_0_0_0", "9_0_0_0", "4_2_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "3_2_0_0", "6_1_0_0", "1_0_2_0", "6_1_0_0", "6_1_0_0", "2_2_0_0", "0_0_0_0", "0_0_0_0", "4_2_0_0", "1_0_1_0", "1_0_0_0", "1_0_0_0", "1_0_0_0", "1_0_0_0", "1_0_0_0", "4_0_0_0", "0_0_0_0", "0_0_0_0", "3_2_0_0", "6_1_0_0", "1_0_2_0", "6_1_0_0", "2_2_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "4_0_0_0", "9_0_0_0", "9_0_0_0"],
					["9_0_0_0", "9_0_0_0", "4_2_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "3_2_0_0", "6_1_0_0", "6_1_0_0", "6_1_0_0", "6_1_0_0", "6_1_0_0", "6_1_0_0", "2_2_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "4_0_0_0", "9_0_0_0", "9_0_0_0"],
					["9_0_0_0", "9_0_0_0", "4_2_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "4_0_0_0", "9_0_0_0", "9_0_0_0"],
					["9_0_0_0", "9_0_0_0", "4_2_0_0", "0_0_0_0", "0_0_0_0", "2_0_0_0", "6_3_0_0", "6_3_0_0", "3_0_0_0", "0_0_0_0", "2_0_0_0", "6_3_0_0", "6_3_0_0", "3_0_0_0", "0_0_0_0", "0_0_0_0", "2_0_0_0", "6_3_0_0", "1_0_2_2", "6_3_0_0", "3_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "2_0_0_0", "6_3_0_0", "6_3_0_0", "3_0_0_0", "2_0_0_0", "6_3_0_0", "3_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "4_0_0_0", "9_0_0_0", "9_0_0_0"],
					["9_0_0_0", "9_0_0_0", "4_2_0_0", "0_0_0_0", "0_0_0_0", "4_2_0_0", "1_0_0_0", "1_0_0_0", "4_0_0_0", "0_0_0_0", "4_2_0_0", "1_0_0_0", "1_0_0_0", "4_0_0_0", "0_0_0_0", "0_0_0_0", "4_2_0_0", "1_0_0_0", "1_0_0_0", "1_0_0_0", "4_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "4_2_0_0", "1_0_0_0", "1_0_0_0", "4_0_0_0", "4_2_0_0", "1_0_0_0", "4_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "4_0_0_0", "9_0_0_0", "9_0_0_0"],
					["9_0_0_0", "9_0_0_0", "4_2_0_0", "0_0_0_0", "0_0_0_0", "4_2_0_0", "1_0_0_0", "1_0_0_0", "4_0_0_0", "0_0_0_0", "4_2_0_0", "1_0_0_0", "1_0_0_0", "4_0_0_0", "0_0_0_0", "0_0_0_0", "4_2_0_0", "1_0_0_0", "1_0_0_0", "1_0_0_0", "3_2_0_0", "3_0_0_0", "0_0_0_0", "0_0_0_0", "4_2_0_0", "1_0_0_0", "1_0_1_0", "3_2_0_0", "2_2_0_0", "1_0_0_0", "4_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "4_0_0_0", "9_0_0_0", "9_0_0_0"],
					["9_0_0_0", "9_0_0_0", "4_2_0_0", "0_0_0_0", "0_0_0_0", "4_2_0_0", "1_0_0_0", "1_0_0_0", "3_2_0_0", "1_0_2_2", "2_2_0_0", "1_0_0_0", "1_0_0_0", "4_0_0_0", "0_0_0_0", "2_0_0_0", "3_1_0_0", "1_0_0_0", "1_0_0_0", "1_0_0_0", "1_0_0_0", "4_0_0_0", "0_0_0_0", "0_0_0_0", "4_2_0_0", "1_0_0_0", "1_0_0_0", "1_0_0_0", "1_0_0_0", "1_0_0_0", "4_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "4_0_0_0", "9_0_0_0", "9_0_0_0"],
					["9_0_0_0", "9_0_0_0", "4_2_0_0", "0_0_0_0", "0_0_0_0", "4_2_0_0", "1_0_0_0", "1_0_1_0", "1_0_0_0", "1_0_0_0", "1_0_0_0", "1_0_0_0", "1_0_0_0", "4_0_0_0", "0_0_0_0", "4_2_0_0", "1_0_0_0", "1_0_0_0", "1_0_0_0", "1_0_0_0", "1_0_1_0", "4_0_0_0", "0_0_0_0", "0_0_0_0", "4_2_0_0", "1_0_0_0", "1_0_0_0", "1_0_0_0", "1_0_0_0", "1_0_0_0", "4_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "4_0_0_0", "9_0_0_0", "9_0_0_0"],
					["9_0_0_0", "9_0_0_0", "4_2_0_0", "0_0_0_0", "0_0_0_0", "4_2_0_0", "1_0_0_0", "1_0_0_0", "1_0_0_0", "1_0_0_0", "1_0_0_0", "1_0_0_0", "1_0_0_0", "4_0_0_0", "0_0_0_0", "4_2_0_0", "1_0_0_0", "1_0_0_0", "1_0_0_0", "1_0_0_0", "1_0_0_0", "4_0_0_0", "0_0_0_0", "0_0_0_0", "3_2_0_0", "7_0_0_0", "1_0_0_0", "1_0_0_0", "1_0_0_0", "5_0_0_0", "2_2_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "4_0_0_0", "9_0_0_0", "9_0_0_0"],
					["9_0_0_0", "9_0_0_0", "4_2_0_0", "0_0_0_0", "0_0_0_0", "3_2_0_0", "6_1_0_0", "6_1_0_0", "6_1_0_0", "6_1_0_0", "6_1_0_0", "6_1_0_0", "6_1_0_0", "2_2_0_0", "0_0_0_0", "3_2_0_0", "6_1_0_0", "6_1_0_0", "6_1_0_0", "6_1_0_0", "6_1_0_0", "2_2_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "3_2_0_0", "1_0_2_0", "6_1_0_0", "6_1_0_0", "2_2_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "3_2_0_0", "4_1_0_0", "3_0_0_0"],
					["3_3_0_0", "4_1_0_0", "3_1_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "10_0_0_0", "10_0_0_0", "4_0_0_0"],
					["4_2_0_0", "10_0_0_0", "10_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "3_3_0_0", "4_1_0_0", "3_1_0_0"],
					["3_2_0_0", "4_1_0_0", "3_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "2_0_0_0", "6_3_0_0", "1_0_2_2", "6_3_0_0", "3_0_0_0", "0_0_0_0", "2_0_0_0", "6_3_0_0", "6_3_0_0", "6_3_0_0", "6_3_0_0", "6_3_0_0", "3_0_0_0", "0_0_0_0", "0_0_0_0", "2_0_0_0", "1_0_2_2", "3_0_0_0", "2_0_0_0", "6_3_0_0", "6_3_0_0", "3_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "4_0_0_0", "9_0_0_0", "9_0_0_0"],
					["9_0_0_0", "9_0_0_0", "4_2_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "2_0_0_0", "6_3_0_0", "5_2_0_0", "1_0_0_0", "1_0_0_0", "1_0_0_0", "4_0_0_0", "0_0_0_0", "4_2_0_0", "1_0_0_0", "1_0_0_0", "1_0_0_0", "1_0_0_0", "1_0_0_0", "4_0_0_0", "0_0_0_0", "0_0_0_0", "4_2_0_0", "1_0_0_0", "4_0_0_0", "4_2_0_0", "1_0_1_0", "1_0_0_0", "4_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "4_0_0_0", "9_0_0_0", "9_0_0_0"],
					["9_0_0_0", "9_0_0_0", "4_2_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "4_2_0_0", "1_0_0_0", "1_0_0_0", "1_0_0_0", "1_0_0_0", "1_0_0_0", "4_0_0_0", "0_0_0_0", "1_0_2_1", "1_0_0_0", "1_0_0_0", "1_0_0_0", "1_0_0_0", "1_0_0_0", "4_0_0_0", "0_0_0_0", "0_0_0_0", "4_2_0_0", "1_0_0_0", "4_0_0_0", "4_2_0_0", "1_0_0_0", "1_0_0_0", "4_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "4_0_0_0", "9_0_0_0", "9_0_0_0"],
					["9_0_0_0", "9_0_0_0", "4_2_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "4_2_0_0", "1_0_0_0", "1_0_0_0", "1_0_0_0", "1_0_0_0", "1_0_1_0", "4_0_0_0", "0_0_0_0", "4_2_0_0", "1_0_0_0", "1_0_0_0", "1_0_0_0", "1_0_0_0", "1_0_0_0", "4_0_0_0", "0_0_0_0", "0_0_0_0", "4_2_0_0", "1_0_0_0", "4_0_0_0", "4_2_0_0", "1_0_0_0", "1_0_0_0", "4_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "4_0_0_0", "9_0_0_0", "9_0_0_0"],
					["9_0_0_0", "9_0_0_0", "4_2_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "4_2_0_0", "1_0_0_0", "1_0_0_0", "1_0_0_0", "1_0_0_0", "1_0_0_0", "4_0_0_0", "0_0_0_0", "4_2_0_0", "1_0_0_0", "1_0_0_0", "1_0_0_0", "1_0_1_0", "1_0_0_0", "4_0_0_0", "0_0_0_0", "0_0_0_0", "4_2_0_0", "1_0_0_0", "4_0_0_0", "4_2_0_0", "1_0_0_0", "1_0_0_0", "4_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "4_0_0_0", "9_0_0_0", "9_0_0_0"],
					["9_0_0_0", "9_0_0_0", "4_2_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "3_2_0_0", "6_1_0_0", "6_1_0_0", "7_0_0_0", "1_0_0_0", "1_0_0_0", "4_0_0_0", "0_0_0_0", "3_2_0_0", "6_1_0_0", "7_0_0_0", "1_0_0_0", "1_0_0_0", "1_0_0_0", "4_0_0_0", "0_0_0_0", "0_0_0_0", "4_2_0_0", "1_0_0_0", "3_2_0_0", "2_2_0_0", "1_0_0_0", "1_0_0_0", "4_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "4_0_0_0", "9_0_0_0", "9_0_0_0"],
					["9_0_0_0", "9_0_0_0", "4_2_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "3_2_0_0", "6_1_0_0", "6_1_0_0", "2_2_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "4_2_0_0", "1_0_0_0", "1_0_0_0", "5_0_0_0", "2_2_0_0", "0_0_0_0", "0_0_0_0", "4_2_0_0", "1_0_0_0", "1_0_0_0", "1_0_0_0", "1_0_0_0", "1_0_0_0", "4_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "4_0_0_0", "9_0_0_0", "9_0_0_0"],
					["9_0_0_0", "9_0_0_0", "4_2_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "3_2_0_0", "6_1_0_0", "6_1_0_0", "2_2_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "3_2_0_0", "6_1_0_0", "6_1_0_0", "6_1_0_0", "6_1_0_0", "6_1_0_0", "2_2_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "4_0_0_0", "9_0_0_0", "9_0_0_0"],
					["9_0_0_0", "9_0_0_0", "4_2_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "2_0_0_0", "6_3_0_0", "6_3_0_0", "6_3_0_0", "6_3_0_0", "3_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "4_0_0_0", "9_0_0_0", "9_0_0_0"],
					["9_0_0_0", "9_0_0_0", "4_2_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "4_2_0_0", "1_0_0_0", "1_0_0_0", "1_0_0_0", "1_0_0_0", "4_0_0_0", "0_0_0_0", "2_0_0_0", "6_3_0_0", "6_3_0_0", "6_3_0_0", "6_3_0_0", "3_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "2_0_0_0", "6_1_0_0", "6_1_0_0", "6_1_0_0", "1_0_2_2", "3_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "4_0_0_0", "9_0_0_0", "9_0_0_0"],
					["9_0_0_0", "9_0_0_0", "4_2_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "4_2_0_0", "1_0_0_0", "1_0_0_0", "1_0_0_0", "1_0_0_0", "4_0_0_0", "0_0_0_0", "4_2_0_0", "1_0_0_0", "1_0_0_0", "1_0_0_0", "1_0_1_0", "4_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "4_2_0_0", "1_0_0_0", "1_0_1_0", "1_0_0_0", "1_0_0_0", "4_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "4_0_0_0", "9_0_0_0", "9_0_0_0"],
					["9_0_0_0", "9_0_0_0", "4_2_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "4_2_0_0", "1_0_0_0", "1_0_0_0", "1_0_0_0", "1_0_0_0", "4_0_0_0", "0_0_0_0", "4_2_0_0", "1_0_0_0", "1_0_0_0", "1_0_0_0", "1_0_0_0", "4_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "4_2_0_0", "1_0_0_0", "1_0_0_0", "1_0_0_0", "1_0_0_0", "4_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "4_0_0_0", "9_0_0_0", "9_0_0_0"],
					["9_0_0_0", "9_0_0_0", "4_2_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "4_2_0_0", "1_0_0_0", "1_0_0_0", "1_0_0_0", "1_0_0_0", "4_0_0_0", "0_0_0_0", "3_2_0_0", "7_0_0_0", "1_0_0_0", "1_0_0_0", "2_0_0_0", "2_2_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "3_2_0_0", "3_0_0_0", "1_0_0_0", "1_0_0_0", "1_0_0_0", "4_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "4_0_0_0", "9_0_0_0", "9_0_0_0"],
					["9_0_0_0", "9_0_0_0", "4_2_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "4_2_0_0", "1_0_0_0", "1_0_0_0", "1_0_1_0", "1_0_0_0", "4_0_0_0", "0_0_0_0", "0_0_0_0", "4_2_0_0", "1_0_0_0", "1_0_0_0", "3_2_0_0", "3_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "2_0_0_0", "2_2_0_0", "1_0_0_0", "1_0_0_0", "1_0_0_0", "4_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "4_0_0_0", "9_0_0_0", "9_0_0_0"],
					["9_0_0_0", "9_0_0_0", "4_2_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "4_2_0_0", "1_0_0_0", "1_0_0_0", "1_0_0_0", "1_0_0_0", "4_0_0_0", "0_0_0_0", "0_0_0_0", "4_2_0_0", "1_0_0_0", "1_0_0_0", "1_0_0_0", "4_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "4_2_0_0", "1_0_0_0", "1_0_0_0", "1_0_0_0", "1_0_0_0", "4_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "4_0_0_0", "9_0_0_0", "9_0_0_0"],
					["9_0_0_0", "9_0_0_0", "4_2_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "3_2_0_0", "6_1_0_0", "1_0_2_0", "6_1_0_0", "6_1_0_0", "2_2_0_0", "0_0_0_0", "0_0_0_0", "3_2_0_0", "6_1_0_0", "1_0_2_0", "6_1_0_0", "2_2_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "3_2_0_0", "6_1_0_0", "6_1_0_0", "6_1_0_0", "6_1_0_0", "2_2_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "4_0_0_0", "9_0_0_0", "9_0_0_0"],
					["9_0_0_0", "9_0_0_0", "4_2_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "4_0_0_0", "9_0_0_0", "9_0_0_0"],
					["9_0_0_0", "9_0_0_0", "4_2_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "0_0_0_0", "4_0_0_0", "9_0_0_0", "9_0_0_0"],
					["9_0_0_0", "9_0_0_0", "3_2_0_0", "6_1_0_0", "6_1_0_0", "6_1_0_0", "6_1_0_0", "6_1_0_0", "6_1_0_0", "6_1_0_0", "6_1_0_0", "6_1_0_0", "6_1_0_0", "6_1_0_0", "6_1_0_0", "6_1_0_0", "6_1_0_0", "6_1_0_0", "6_1_0_0", "6_1_0_0", "6_1_0_0", "6_1_0_0", "3_0_0_0", "10_0_0_0", "3_3_0_0", "6_1_0_0", "6_1_0_0", "6_1_0_0", "6_1_0_0", "6_1_0_0", "6_1_0_0", "6_1_0_0", "6_1_0_0", "6_1_0_0", "2_2_0_0", "9_0_0_0", "9_0_0_0"],
					["9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "6_2_0_0", "10_0_0_0", "6_2_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0"],
					["9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "3_2_0_0", "6_1_0_0", "3_1_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0"],
					["9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0"],
					["9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0"],
					["9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0"],
					["9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0"],
					["9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0", "9_0_0_0"]
				]
			}, this._gameMapData = new Array, this._rooms = new Array, this._build = new Array, this._landSkin = ["floor_1", "floor_2", "wall_1", "wall_2", "wall_3", "wall_4", "wall_5", "wall_6", "empty_1", "HSZZ0_1", "hxk_1"], this._inSkin = ["", "bed_1", "door_1", "repair_1", "game_1", "at_1", "ice_1", "barb_1", "particlea_1", "spell_1", "entrapment_1", "guillotine_1", "energyhood_1", "smoney_1", "longrange_1", "solenoid_1", "mine_1", "mine_2", "mine_3", "mine_4"]
		}
		SelectMap(t) {
			return this._index = t, this._map = this._maps["map" + t], null == this._map ? (this._index = null, !1) : (this.MapConversion(), !0)
		}
		IsWalkable(t, e) {
			let i = this.readMap(t, e),
				s = this._landSkin[i.landBlock].split("_")[0];
			return "floor" == s || "hxk" == s
		}
		GetMapColsOrRows() {
			return null != this._index ? (this._numClos = this._map.length, this._numRows = this._map[0].length, [this._numClos, this._numRows]) : null
		}
		readMap(t, e) {
			t < 0 && (t = 0), t >= this._gameMapData.length && (t = this._gameMapData.length - 1);
			let i = this._gameMapData[t];
			return e < 0 && (i = this._gameMapData[0], e = 0), e >= i.length && (e = i.length - 1), i[e]
		}
		SetMap(t, e, i) {
			if (0 == i.length) this.readMap(t, e).inBlock = 0;
			else
				for (let s = 0; s < this._inSkin.length; s++)
					if (i == this._inSkin[s]) return void(this.readMap(t, e).inBlock = s)
		}
		GetImageSkin(t, e) {
			var i = this._landSkin[t],
				s = this._inSkin[e];
			return null == i && (i = ""), null == s && (s = ""), {
				landSkin: i,
				inSkin: s
			}
		}
		MapConversion() {
			for (let e = 0; e < this._map.length; e++) {
				var t = new Array;
				for (let i = 0; i < this._map[e].length; i++) {
					let s = this._map[e][i].split("_"),
						n = {
							landBlock: parseInt(s[0]),
							landRot: parseInt(s[1]),
							inBlock: parseInt(s[2]),
							inRot: parseInt(s[3])
						};
					t.push(n);
					let a = this._inSkin[n.inBlock].split("_")[0];
					"bed" == a && this._rooms.push({
						pos: e + "_" + i,
						door: "",
						room: []
					}), "" != a && this._build.push({
						x: e,
						y: i
					})
				}
				this._gameMapData.push(t)
			}
			this.SearchRooms()
		}
		SearchRooms() {
			for (let e = 0; e < this._rooms.length; e++) {
				var t = [];
				let i = this._rooms[e],
					s = i.pos.split("_");
				this.SearchRoom(parseInt(s[0]), parseInt(s[1]), t, []), i.room = t, i.door = t[0]
			}
		}
		SearchRoom(t, e, i, s) {
			var n = t + "_" + e;
			if (this.SearchArray(n, i) || this.SearchArray(n, s)) return;
			let a = this.readMap(t, e),
				l = this._landSkin[a.landBlock].split("_")[0],
				o = this._inSkin[a.inBlock].split("_")[0];
			"floor" == l ? "door" != o ? (i.push(n), this.SearchRoom(t + 1, e, i, s), this.SearchRoom(t - 1, e, i, s), this.SearchRoom(t, e + 1, i, s), this.SearchRoom(t, e - 1, i, s)) : i.unshift(n) : s.push(n)
		}
		SearchArray(t, e) {
			if (0 != e.length)
				for (let i = 0; i < e.length; i++)
					if (t == e[i]) return !0;
			return !1
		}
		RoomFindBlock(t, e) {
			let i = this.readMap(t, e),
				s = this._landSkin[i.landBlock].split("_")[0],
				n = this._inSkin[i.inBlock].split("_")[0];
			return "floor" != s ? {
				inSkin: n,
				roomIndex: -1
			} : {
				inSkin: n,
				roomIndex: this.BlockFindRoom(t, e)
			}
		}
		BlockFindRoom(t, e) {
			let i = this.readMap(t, e);
			if ("floor" != this._landSkin[i.landBlock].split("_")[0]) return -1;
			for (let i = 0; i < this._rooms.length; i++) {
				let s = this._rooms[i],
					n = t + "_" + e;
				if (this.BlockIsRoom(s.room, n)) return i
			}
			return -1
		}
		BlockIsRoom(t, e) {
			for (let i = 0; i < t.length; i++)
				if (t[i] == e) return !0;
			return !1
		}
		get build() {
			return this._build
		}
		GetDoorFloor(t) {
			let e = this._rooms[t],
				i = e.door.split("_"),
				s = this.readMap(parseInt(i[0]), parseInt(i[1]) + 1),
				n = this.readMap(parseInt(i[0]) + 1, parseInt(i[1])),
				a = this.readMap(parseInt(i[0]), parseInt(i[1]) - 1),
				l = this.readMap(parseInt(i[0]) - 1, parseInt(i[1]));
			return this.DoorAroundBlock(s, e.room, parseInt(i[0]) + "_" + (parseInt(i[1]) + 1)) ? [parseInt(i[0]), parseInt(i[1]) + 1] : this.DoorAroundBlock(n, e.room, parseInt(i[0]) + 1 + "_" + parseInt(i[1])) ? [parseInt(i[0]) + 1, parseInt(i[1])] : this.DoorAroundBlock(a, e.room, parseInt(i[0]) + "_" + (parseInt(i[1]) - 1)) ? [parseInt(i[0]), parseInt(i[1]) - 1] : this.DoorAroundBlock(l, e.room, parseInt(i[0]) - 1 + "_" + parseInt(i[1])) ? [parseInt(i[0]) - 1, parseInt(i[1])] : void 0
		}
		DoorAroundBlock(t, e, i) {
			return (0 == t.landBlock || 0 != t.inBlock) && !this.BlockIsRoom(e, i)
		}
		GetAroundBuild(t, e, i) {
			let s = 90 * i;
			s *= s;
			let n = [];
			return this.AroundBuild(t, e, n, [], s), n
		}
		AroundBuild(t, e, i, s, n) {
			if (this.SearchArrayAround(t, e, i) || this.SearchArrayAround(t, e, s)) return;
			t * t + e * e > n ? s.push([t, e]) : this.PosIsBuild(t, e) ? (i.push([t, e]), this.AroundBuild(t, e + 1, i, s, n), this.AroundBuild(t, e - 1, i, s, n), this.AroundBuild(t + 1, e, i, s, n), this.AroundBuild(t - 1, e, i, s, n)) : s.push([t, e])
		}
		SearchArrayAround(t, e, i) {
			if (i.length > 0)
				for (let s = 0; s < i.length; s++) {
					let n = i[s];
					if (n[0] == t && n[1] == e) return !0
				}
			return !1
		}
		PosIsBuild(t, e) {
			return 0 != this.readMap(t, e).inBlock
		}
		GetRoomCount() {
			return this._rooms.length
		}
		GetOpenSpace(t, e) {
			let i = this._rooms[t],
				s = [];
			for (let t = 0; t < i.room.length; t++) {
				let e = i.room[t].split("_"),
					n = parseInt(e[0]),
					a = parseInt(e[1]);
				0 == this.readMap(n, a).inBlock && s.push({
					x: n,
					y: a
				})
			}
			if (0 == s.length) return null; {
				let i = null;
				if (e) {
					let e = this._rooms[t].door.split("_"),
						n = {
							x: parseInt(e[0]),
							y: parseInt(e[1])
						};
					i = s[0];
					for (let t = 1; t < s.length; t++) {
						let e = s[t],
							a = Math.abs(i.x - n.x),
							l = Math.abs(i.y - n.y),
							o = Math.abs(e.x - n.x),
							h = Math.abs(e.y - n.y);
						a * a + l * l > o * o + h * h && (i = e)
					}
				} else {
					i = s[Math.floor(Math.random() * s.length)]
				}
				return i
			}
		}
		FindPlayerAround(t, e) {
			let i = Math.max(t - 1, 0),
				s = Math.max(e - 1, 0),
				n = Math.min(t + 1, this._numClos),
				a = Math.min(e + 1, this._numRows),
				l = [];
			for (let t = i; t <= n; t++)
				for (let e = s; e <= a; e++) {
					let i = this.FindPlayerAroundDoorOrBed(t, e);
					null != i && l.push(i)
				}
			if (0 == l.length) return null;
			if (1 == l.length) return l[0]; {
				let i = l[0];
				for (let s = 1; s < l.length; s++) {
					let n = l[s];
					this.Distance(i.x, i.y, t, e) > this.Distance(n.x, n.y, t, e) && (i = n)
				}
				return i
			}
		}
		FindTrollAround(t, e) {
			let i = Math.max(t - 1, 0),
				s = Math.max(e - 1, 0),
				n = Math.min(t + 1, this._numClos),
				a = Math.min(e + 1, this._numRows),
				l = [];
			for (let t = i; t <= n; t++)
				for (let e = s; e <= a; e++) {
					let i = this.FindTrollAroundDoorOrBed(t, e);
					null != i && l.push(i)
				}
			if (0 == l.length) return null;
			if (1 == l.length) return l[0]; {
				let i = l[0];
				for (let s = 1; s < l.length; s++) {
					let n = l[s];
					this.Distance(i.x, i.y, t, e) > this.Distance(n.x, n.y, t, e) && (i = n)
				}
				return i
			}
		}
		Distance(t, e, i, s) {
			let n = t - i,
				a = e - s;
			return n * n + a * a
		}
		FindPlayerAroundDoorOrBed(t, e) {
			let i = this.readMap(t, e),
				s = this._inSkin[i.inBlock].split("_")[0];
			return "door" == s ? {
				build: "door",
				x: t,
				y: e
			} : "bed" == s ? {
				build: "bed",
				x: t,
				y: e
			} : null
		}
		FindTrollAroundDoorOrBed(t, e) {
			let i = this.readMap(t, e),
				s = this._inSkin[i.inBlock].split("_")[0];
			return "at" == s ? {
				build: "at",
				x: t,
				y: e
			} : "game" == s ? {
				build: "game",
				x: t,
				y: e
			} : null
		}
		GetRoom(t) {
			return this._rooms[t]
		}
		GameOver() {
			this._gameMapData = new Array, this._rooms = new Array, this._build = new Array, this._index = null, this._map = void 0
		}
		GetPosAroundBuild(t, e, i, s) {
			let n = new Array,
				a = Math.max(0, t - s),
				l = Math.max(0, e - s),
				o = Math.min(this._numClos, t + s),
				h = Math.min(this._numRows, e + s);
			for (let t = a; t < o; t++)
				for (let e = l; e < h; e++) {
					let s = this.readMap(t, e);
					if (this._inSkin[s.inBlock].split("_")[0] == i) {
						let i = t + "_" + e;
						n.push(i)
					}
				}
			return n
		}
	}
	class ae {
		constructor() {
			this._moveArr = new Array, this._rotArr = new Array, this._trackMoveArr = new Array, this._scaleArr = new Array, this.Init(), this.AddUPEvent()
		}
		static get instance() {
			return this._ins && null != this._ins || (this._ins = new ae), this._ins
		}
		AddUPEvent() {
			ht.instance.AddUPEvent("UpHandleEvent", this.UpHandleEvent, this)
		}
		removeUpEvent() {
			ht.instance.removeListEvent("UpHandleEvent")
		}
		Init() {
			this._moveArr = new Array, this._rotArr = new Array, this._trackMoveArr = new Array, this._scaleArr = new Array
		}
		Move(t) {
			let e = t.speed / 60;
			if (t.pos.length > 0) {
				let s = t.pos[0],
					n = t.node.x - s[0],
					a = t.node.y - s[1];
				var i = Math.abs(n) + Math.abs(a);
				return n > 0 ? t.node.x -= e * (Math.abs(n) / i) : n < 0 && (t.node.x += e * (Math.abs(n) / i)), a > 0 ? t.node.y -= e * (Math.abs(a) / i) : a < 0 && (t.node.y += e * (Math.abs(a) / i)), Math.abs(n) < e && (t.node.x = s[0]), Math.abs(a) < e && (t.node.y = s[1]), t.node.x == s[0] && t.node.y == s[1] && (1 == t.pos.length ? (this.RemoveArr(t.node, this._moveArr), !0) : (t.pos.shift(), !1))
			}
		}
		TrackMove(t) {
			let e = t.moveSpeed / 60,
				i = t.rotSpeed / 60,
				s = t.node.x,
				n = t.node.y,
				a = s - t.tar.x,
				l = n - t.tar.y;
			var o = Math.abs(a) + Math.abs(l);
			let h, r = this.AircraftAngle(t.node, t.tar),
				_ = t.node.rotation - r;
			h = _ > 0 ? t.node.rotation - 360 - r : t.node.rotation + 360 - r, Math.abs(_) > Math.abs(h) && (_ = h), Math.abs(_) < i ? t.node.rotation = r : _ > 0 ? t.node.rotation -= i : t.node.rotation += i, a > 0 ? t.node.x -= e * (Math.abs(a) / o) : a < 0 && (t.node.x += e * (Math.abs(a) / o)), l > 0 ? t.node.y -= e * (Math.abs(l) / o) : l < 0 && (t.node.y += e * (Math.abs(l) / o)), Math.abs(a) < 5 && Math.abs(l) < 5 && (this.RemoveArr(t.node, this._trackMoveArr), t.node.visible = !1)
		}
		Rot(t) {
			let e, i = t.rotSpeed / 60,
				s = t.node.rotation - t.angle;
			e = s > 0 ? t.node.rotation - 360 - t.angle : t.node.rotation + 360 - t.angle, Math.abs(s) > Math.abs(e) && (s = e), Math.abs(s) < 10 ? (t.node.rotation = t.angle, this.RemoveArr(t.node, this._rotArr), t.func && t.func()) : s > 0 ? t.node.rotation -= i : t.node.rotation += i
		}
		AircraftAngle(t, e) {
			var i = t.localToGlobal(new Laya.Point(t.pivotX, t.pivotY)),
				s = e.localToGlobal(new Laya.Point(e.pivotX, e.pivotY)),
				n = [0, 1],
				a = [i.x, i.y],
				l = [s.x, s.y],
				o = [a[0] - l[0], a[1] - l[1]],
				h = (n[0] * o[1] - n[1] * o[0]) / (Math.sqrt(Math.pow(n[0], 2) + Math.pow(n[1], 2)) * Math.sqrt(Math.pow(o[0], 2) + Math.pow(o[1], 2))),
				r = Math.asin(h) / Math.PI * 180;
			return o[1] <= 0 && (r = 180 - r), r %= 360
		}
		RemoveArr(t, e) {
			for (let i = 0; i < e.length; i++)
				if (t == e[i].node) {
					e.splice(i, 1);
					break
				}
		}
		SetRot(t, e) {
			t.rotation = this.AircraftAngle(t, e)
		}
		Scale(t) {
			t.node.scaleX += t.off, t.node.scaleY += t.off, t.node.scaleX >= t.x && t.node.scaleY >= t.y && (t.node.scaleX = t.x, t.node.scaleY = t.y, this.RemoveArr(t.node, this._scaleArr))
		}
		AddMove(t, e, i) {
			this._moveArr.forEach(s => {
				if (s.node == t) return s.pos = e, void(s.speed = i)
			});
			let s = {
				node: t,
				pos: e,
				speed: i
			};
			this._moveArr.push(s)
		}
		AddTMoveMent(t, e, i, s) {
			this._trackMoveArr.forEach(n => {
				if (n.node == t) return n.tar = e, n.rotSpeed = i, void(n.moveSpeed = s)
			});
			let n = {
				node: t,
				tar: e,
				rotSpeed: i,
				moveSpeed: s
			};
			this._trackMoveArr.push(n)
		}
		AddRotation(t, e, i, s) {
			let n = this.AircraftAngle(t, e);
			this._rotArr.forEach(a => {
				if (a.node == t) return a.angle = n, a.rotSpeed = i, a.tar = e, void(a.func = s)
			});
			let a = {
				node: t,
				tar: e,
				angle: n,
				rotSpeed: i,
				func: s
			};
			this._rotArr.push(a)
		}
		AddScale(t, e, i, s) {
			this._scaleArr.forEach(n => {
				if (n.node == t) return n.x = e, n.y = i, void(n.off = s)
			});
			let n = {
				node: t,
				x: e,
				y: i,
				off: s
			};
			this._scaleArr.push(n)
		}
		HandelMoveEvent_Update() {
			if (this._moveArr.length > 0)
				for (let t = this._moveArr.length - 1; t >= 0; t--) {
					let e = this._moveArr[t];
					this.Move(e)
				}
		}
		HandelRotEvent_Update() {
			if (this._rotArr.length > 0)
				for (let t = this._rotArr.length - 1; t >= 0; t--) {
					let e = this._rotArr[t];
					this.Rot(e)
				}
		}
		HandelTrackMoveMentEvent_Update() {
			if (this._trackMoveArr.length > 0)
				for (let t = this._trackMoveArr.length - 1; t >= 0; t--) {
					let e = this._trackMoveArr[t];
					this.TrackMove(e)
				}
		}
		HandleScaleEvent_Update() {
			if (this._scaleArr.length > 0)
				for (let t = 0; t < this._scaleArr.length; t++) {
					let e = this._scaleArr[t];
					this.Scale(e)
				}
		}
		UpHandleEvent() {
			this.HandelRotEvent_Update(), this.HandelMoveEvent_Update(), this.HandelTrackMoveMentEvent_Update(), this.HandleScaleEvent_Update()
		}
		OperationMovement(t, e, i) {
			t.x += e, t.y += i
		}
		GameOver() {
			this._moveArr.length = 0, this._rotArr.length = 0, this._trackMoveArr.length = 0
		}
	}
	class le {
		AddUpEvent() {
			rt.instance.AddTimeLoopEvent("UpTask", this.UpTask, this, .1)
		}
		RemoveUpEvent() {
			rt.instance.RemoveListLoopEvent("UpTask")
		}
		UpTask() {
			this._player && this._player.bed && this.taskFunc && this.taskFunc()
		}
		Task1() {
			null != this._player.bed && (this.room = this._player.bed.room, this.TaskCompelet())
		}
		Task2() {
			this._player.bed.level >= 2 && this.TaskCompelet()
		}
		Task3() {
			this.room.door.level >= 2 && this.TaskCompelet()
		}
		Task4() {
			this.room.bed.level >= 3 && this.TaskCompelet()
		}
		Task5() {
			this.room.bed.level >= 4 && this.TaskCompelet()
		}
		Task6() {
			ot.instance.FireReturn(ot.instance.BUILD_GET_AT_BUILDCOUNT, this._player.roomIndex) > 1 && this.TaskCompelet()
		}
		Task7() {
			this.room.bed.level >= 5 && this.TaskCompelet()
		}
		Task8() {
			ot.instance.FireReturn(ot.instance.BUILD_GET_GAME_BUILDCOUNT, this._player.roomIndex) > 1 && this.TaskCompelet()
		}
		Task9() {
			this.room.bed.level >= 7 && this.TaskCompelet()
		}
		Task10() {
			ot.instance.FireReturn(ot.instance.BUILD_REACHC, "at_5", this._player.roomIndex) && this.TaskCompelet()
		}
		Task11() {
			ot.instance.FireReturn(ot.instance.BUILD_REACHC, "mine_1", this._player.roomIndex) && this.TaskCompelet()
		}
		set task(t) {
			switch (t) {
				case 0:
					this.taskFunc = this.Task1;
					break;
				case 1:
					this.taskFunc = this.Task2;
					break;
				case 2:
					this.taskFunc = this.Task3;
					break;
				case 3:
					this.taskFunc = this.Task4;
					break;
				case 4:
					this.taskFunc = this.Task5;
					break;
				case 5:
					this.taskFunc = this.Task6;
					break;
				case 6:
					this.taskFunc = this.Task7;
					break;
				case 7:
					this.taskFunc = this.Task8;
					break;
				case 8:
					this.taskFunc = this.Task9;
					break;
				case 9:
					this.taskFunc = this.Task10;
					break;
				case 10:
					this.taskFunc = this.Task11;
					break;
				default:
					this.taskFunc = null
			}
		}
		TaskCompelet() {
			ot.instance.Fire(ot.instance.BATTLEUI_TASKCOMPLETE), this.taskFunc = null
		}
		set player(t) {
			this._player = t
		}
	}
	class oe {
		constructor() {
			this._zOrder = 0
		}
		LoadPanel(t = !1) {
			let e = Laya.loader.getRes(this._path);
			this.panel = new Laya.View, this.panel.createView(e), t && this.scene.addChild(this.panel), this.panel.zOrder = this._zOrder, this.ReadUIInfo()
		}
		Init() {}
		ReadUIInfo() {}
		set path(t) {
			this._path = t
		}
		get path_Str() {
			return this._path
		}
		set zOrder(t) {
			this._zOrder = t
		}
		get scene() {
			return null == oe.scene && (oe.scene = Laya.stage.getChildAt(0).getChildAt(0)), oe.scene
		}
		AddUpData() {}
		Show(...t) {
			this.scene.addChild(this.panel), this._Show(...t)
		}
		Hide(...t) {
			this.scene.removeChild(this.panel), this._Hide(...t)
		}
		_Show(...t) {}
		_Hide(...t) {}
	}
	oe.strArr = {
		battleUI: "battleUI",
		startGameUI: "startGameUI",
		gameOverUI: "gameOverUI",
		macthingUI: "macthingUI",
		skillUI: "skillUI",
		shopUI: "shopUI",
		treasureChestUI: "treasureChestUI",
		CreditUI: "CreditUI"
	};
	class he extends wt {
		constructor() {
			super()
		}
		onEnable() {
			super.onEnable()
		}
		onUpdate() {
			if (this.SP3 && this.SP3.transform) {
				let t = this.SP3.transform.position.clone();
				t.y += 1;
				let e = W.Transform3D.WorldToScreen2(Et.main.camera, t);
				this.node.pos(e.x, e.y)
			}
		}
		set SP3(t) {
			this._sp3 = t
		}
		get SP3() {
			return this._sp3
		}
	}! function(t) {
		t[t.move = 0] = "move", t[t.wait = 1] = "wait", t[t.attack = 2] = "attack", t[t.vertigo = 3] = "vertigo", t[t.escape = 4] = "escape", t[t.ide = 5] = "ide"
	}(It || (It = {})),
	function(t) {
		t[t.ide = 0] = "ide", t[t.attack = 1] = "attack", t[t.move = 2] = "move"
	}(ft || (ft = {}));
	class re {
		constructor() {
			this._hpMax = 270, this._hpCur = 270, this._power = 10, this._speed = 4.5, this._r = 4, this._atSpeed = 1, this._atR = 1.5, this._lastAtTime = 0, this._speedScale = 1, this._powerScale = 1, this._atSpeedScale = 1, this._rScale = 1, this._moveSpeedTime = 0, this._vertigoTime = 0, this._startVertiogTime = 0, this._abilityPoint = 0, this._attackUpCount = 0, this._attackPro = 0, this.isGuillotine = !1, this._level = 1, this._attackUpCur = 0, this._hpMax = 270, this._hpCur = 270, this._power = 10, this._speed = 4.5, this._r = 4, this._atSpeed = 1, this._atR = 1.5, this._lastAtTime = 0, this._speedScale = 1, this._powerScale = 1, this._atSpeedScale = 1, this._rScale = 1, this._state = It.attack, this._animindex = ft.ide, this._moveSpeedTime = 0, this._vertigoTime = 0, this._startVertiogTime = 0, this._abilityPoint = 0, this._attackUpCount = 0, this.attackUpCur = 0, this._attackPro = 0, this.isGuillotine = !1
		}
		Init() {
			ni.Model == Lt.HumanModel ? (this._powers = di.instance.troll.powers, this._hps = di.instance.troll.hps, this._upData = di.instance.troll.upData, this._speed = 4.5) : ni.Model == Lt.TrollModel && (this._powers = di.instance.troll.powersTroll, this._hps = di.instance.troll.hpsTroll, this._upData = di.instance.troll.upDataTroll, this._speed = 6), this._attackPro = di.instance.troll.attackPro, this._level = 1, this._power = this._powers[this._level - 1], this._hpMax = this._hps[this.level - 1], this._hpCur = this._hpMax, null != this._hpStrip && (this.hpStrip = this.hp), this._r = 4, this._atSpeed = 1, this._atR = 1.5, this._lastAtTime = 0, this._speedScale = 1, this._powerScale = 1, this._atSpeedScale = 1, this._rScale = 1, this._state = It.ide, this._animindex = ft.ide, this._moveSpeedTime = 0, this._vertigoTime = 0, this._abilityPoint = 0, this._attackUpCount = this._upData[this._level - 1], this.attackUpCur = 0
		}
		set hpMax(t) {
			this._hpMax = t
		}
		get hpMax() {
			return this._hpMax
		}
		set hpCur(t) {
			this._hpCur = t, this.hpCur > this.hpMax && (this._hpCur = this.hpMax), this.hpStrip = this.hp
		}
		get hpCur() {
			return this._hpCur
		}
		set power(t) {
			this._power = t
		}
		get power() {
			return this._power * this._powerScale
		}
		set atSpeed(t) {
			this._atSpeed = t > .2 ? t : .2
		}
		get atSpeed() {
			return this._atSpeed * this._atSpeedScale < .2 ? .2 : this._atSpeed * this._atSpeedScale
		}
		set powerScale(t) {
			this._powerScale = t
		}
		get powerScale() {
			return this._powerScale
		}
		set speedScale(t) {
			t < 0 && (t = .1), this._speedScale = t
		}
		get speedScale() {
			return this._speedScale
		}
		set rScale(t) {
			this._rScale = t
		}
		get rScale() {
			return this._rScale
		}
		set atSpeedScale(t) {
			this._atSpeedScale = t
		}
		get atSpeedScale() {
			return this._atSpeedScale
		}
		get r() {
			return this._r * this._rScale * this._r * this._rScale * 8100
		}
		set speed(t) {
			this._speed > 13.5 ? this._speed = 13.5 : this._speed = t
		}
		get speed() {
			return this._speed * this._speedScale
		}
		get hp() {
			return this._hpCur / this._hpMax
		}
		get troll() {
			return this._troll ? this._troll : null
		}
		set direction(t) {
			this.troll.scaleX = t
		}
		get attackUpCur() {
			return this._attackUpCur
		}
		set attackUpCur(t) {
			this._attackUpCur = t, this.lvlNode && 1 == this.lvlNode.visible && (this.lab_lvl.text = String(this._level), this.lvlNode.graphics.clear(), this.lvlNode.graphics.drawPie(18, 18, 23, 360 - this.attackUpCur / this._attackUpCount * 360, 360, "#00ee00"))
		}
		StartGame() {
			this.LoadAnim()
		}
		LoadAnim() {
			this._trollFactory = new Laya.Templet, this._trollFactory.on(Laya.Event.COMPLETE, this, this.parseComplete), this._trollFactory.loadAni(this.skin)
		}
		parseComplete() {
			null != this._troll && this._troll.destroy(), this._troll = this._trollFactory.buildArmature(0);
			let t = di.instance.build.GetTrollPos();
			ot.instance.Fire(ot.instance.MAP_ADD_ACTIVITY, this.troll, t[0], t[1]), this.setplay(ft.move, !0), this._troll.play(0, !0), this._troll.zOrder = this._troll.y, this.Init(), ie.instance.addTroll(this.troll.x, this.troll.y, this)
		}
		get x() {
			return this.troll.x
		}
		get y() {
			return this.troll.y
		}
		set x(t) {
			this.troll.x = t
		}
		set y(t) {
			this.troll.y = t
		}
		set range(t) {
			this._range = t, this._r = 8100 * this.range * this.range
		}
		get range() {
			return this._range
		}
		hit(t) {
			this.hpCur -= t, this._abilityPoint += .01, this.hpStrip = this.hp, 0 == this.hp && this.BeDoomed(), this.hp <= .3 && !this.isGuillotine && (this.isGuillotine = !0, ot.instance.Fire(ot.instance.BUILD_HANDLEROOMBUFF, this._attackRoom, 4))
		}
		BeDoomed() {}
		set lastAtTime(t) {
			this._lastAtTime = t
		}
		get lastAtTime() {
			return this._lastAtTime
		}
		get atR() {
			return this._atR * this._atR * 8100
		}
		StateDetection(t) {
			return this._state == t
		}
		set state(t) {
			this._state = t
		}
		get state() {
			return this._state
		}
		setplay(t, e) {
			this.troll.play(t, e), this._animindex = t
		}
		IsPlayIndex(t) {
			return this._animindex == t
		}
		set animIndex(t) {
			this._animindex = t
		}
		set moveSpeedTime(t) {
			this._moveSpeedTime = t
		}
		get moveSpeedTime() {
			return this._moveSpeedTime
		}
		get vertigoTime() {
			return this._vertigoTime
		}
		get startVertiogTime() {
			return this._startVertiogTime
		}
		set vertigoTime(t) {
			0 == t ? (this._vertigoTime = 0, this._startVertiogTime = 0, this.state = this.upstate) : (0 != this._startVertiogTime ? this._vertigoTime += t : (this._startVertiogTime = rt.instance.gameTime, this._vertigoTime = t), this.StateDetection(It.vertigo) || (this.upstate = this.state, this.state = It.vertigo))
		}
		gethpStrip() {
			return this._hpStrip ? this._hpStrip : null
		}
		set hpStrip(t) {
			if (null == this._hpStrip) {
				this._hpStrip = new Laya.View;
				let t = Laya.loader.getRes("Prefabs/TrollBloodStrip.json");
				if (this._hpStrip.createView(t), Laya.stage.getChildAt(0).getChildAt(0).addChild(this._hpStrip), this._hpStrip.zOrder = 3, this._levelText = this._hpStrip.getChildByName("level"), this.lvlNode = this._hpStrip.getChildByName("lvlNode"), this.lab_lvl = this.lvlNode.getChildByName("lab_lvl"), ni.Model == Lt.TrollModel) {
					this._levelText.strokeColor = "#00ee00";
					let t = this._hpStrip.getChildByName("HP");
					t.skin = "UI/dj4.png", t.pos(0, 5), t.scale(.75, .5), this.attackUpCur = this.attackUpCur
				} else this.lvlNode.visible = !1
			}
			t >= 0 && t <= 1 && (ni.Model == Lt.HumanModel ? this._hpStrip.getChildAt(1).scaleX = t : ni.Model == Lt.TrollModel && (this._hpStrip.getChildAt(1).scaleX = .75 * t), this._levelText.text = "LV." + this._level), W.Comp.auto(this._hpStrip, he, !0).SP3 = ie.instance.troll
		}
		Attack() {
			this._animindex != ft.attack && (this._animindex = ft.attack), this._troll.play(this._animindex, !1), this._abilityPoint++, this._attack()
		}
		_attack() {}
		set abilityPoint(t) {
			this._abilityPoint = t
		}
		UpAdilityPoint() {
			let t = .5 * Math.random(),
				e = .3 * Math.random(),
				i = .1 * Math.random(),
				s = .1 * Math.random();
			this.hpMax += t * this._abilityPoint * this.hpMax * .02, this.hpCur += t * this._abilityPoint * this.hpMax * .02, this.power += e * this._abilityPoint * this.power * .03, this.atSpeed -= i * this._abilityPoint * .05, this.speed += s * this._abilityPoint * .1, this.abilityPoint = 0, ie.instance.playTrollRBloodEffect()
		}
		EscapeUp() {
			this.atSpeedScale = 1, this.speedScale = 1, this.powerScale = 1, this.isGuillotine = !1, this.level++, this.power = this._powers[this._level];
			let t = this._hps[this.level];
			t -= this.hpMax, this.hpMax = this._hps[this.level], this.hpCur += t, this._attackUpCount = this._upData[this._level - 1], this.attackUpCur = 0, _t.instance.PlaySound(_t.instance.TB_sound.troll_up), ot.instance.Fire(ot.instance.UIGM_TIPS, yi.instance.getLanguage("188") + this._level), ie.instance.playTrollUpEffect()
		}
		get level() {
			return this._level
		}
		set level(t) {
			t <= 13 && (t >= this._powers.length && (t = this._powers.length - 1), this._level = t, this._levelText && (this._levelText.text = "Lv." + this._level))
		}
		get skin() {
			return "res/Skeleton/mg/mg_" + di.instance.player.trollIndex + ".sk"
		}
		TrollSkill() {
			this.OnTrollSkill(), rt.instance.AddTimeOnceEvent("OffTrollSkill", this.OffTrollSkill, this, 5)
		}
		OnTrollSkill() {}
		OffTrollSkill() {}
		AttackEvent(...t) {}
		StartAttack(t) {}
		Escape() {}
		GameOver() {
			this._hpStrip && (this._hpStrip.removeSelf(), this._hpStrip.visible = !1, this._hpStrip = null)
		}
		get attackUpCount() {
			return this._attackUpCount + this._attackUpCount * this._attackPro
		}
	}
	class _e extends re {
		constructor() {
			super(), this._paralysis = !1, this._attackTime = 0, this._rageTime = 20, this._isRage = !1, this._isShiled = !1, this._paralysis = !1, this._attackTime = 0, this._rageTime = 20, this._isRage = !1
		}
		_attack() {
			this.atSpeedScale > .5 ? this.atSpeedScale -= .05 : this._isRage ? this.atSpeedScale = this.atSpeed1 : this.atSpeedScale = 1, this.attackUpCur++, this.attackUpCur > this.attackUpCount && this.EscapeUp(), this.Rage()
		}
		addEx() {
			this.attackUpCur++, this.attackUpCur > this.attackUpCount && this.EscapeUp()
		}
		OnTrollSkill() {
			this.atSpeedScale -= .3, this.powerScale = 1.25
		}
		OffTrollSkill() {
			this.atSpeedScale = 1, this.powerScale = 1
		}
		AttackEvent(...t) {
			this.Paralysis(t[0])
		}
		Paralysis(t) {
			if (!this._paralysis && "door" == t.name && t.isUse && (ie.instance.playHitDoorEffect(t), t.hp <= .2)) {
				if (Math.random() <= .3) {
					xt.instance.AddEffect(xt.instance.effectStr.trollZH, this.x - 80, this.y - 135, !0);
					let t = ot.instance.FireReturn(ot.instance.MGM_GET_POSAROUND, this.x, this.y, "at", 4);
					ot.instance.Fire(ot.instance.BUILD_PARALYSIS_ON, t), ot.instance.Fire(ot.instance.UIGM_TIPS, yi.instance.getLanguage("184"))
				}
				this._paralysis = !0
			}
		}
		StartAttack(t) {
			null != t && (this._attackRoom = t.room.roomIndex, t.room.isEnerguhood = !1, ot.instance.Fire(ot.instance.BUILD_HANDLEROOMBUFF, this._attackRoom, 3)), this._attackTime = rt.instance.gameTime, this._paralysis = !1
		}
		Rage() {
			rt.instance.AfterAPeriodOfTime_Bool(this._attackTime, this._rageTime) && this.Rage_on()
		}
		Rage_on(t = 5) {
			let e = Math.random();
			!this._isRage && e <= 1 && (_t.instance.PlaySound(_t.instance.TB_sound.troll_rage), ot.instance.Fire(ot.instance.UIGM_TIPS, yi.instance.getLanguage("185")), this._isRage = !0, this.atSpeed1 = this.atSpeedScale, this.atSpeedScale -= .3, rt.instance.AddTimeOnceEvent("rang_off", this.Rage_off, this, t), null != this._attackRoom && ot.instance.Fire(ot.instance.BUILD_HANDLEROOMBUFF, this._attackRoom, 0), ni.Model == Lt.HumanModel ? ie.instance.playTrollRageEffect() : ie.instance.showTrollRageEffect(), xt.instance.AddEffect(xt.instance.effectStr.trollBaoqiEffect, this.x, this.y - 60, !0)), this._attackTime = rt.instance.gameTime
		}
		Rage_off() {
			this._isRage = !1, this.atSpeedScale = this.atSpeed1, ie.instance.hideTrollRageEffect()
		}
		Shiled_on(t = 5) {
			this._isShiled || (_t.instance.PlaySound(_t.instance.TB_sound.troll_rage), ot.instance.Fire(ot.instance.UIGM_TIPS, yi.instance.getLanguage("186")), this._isShiled = !0, rt.instance.AddTimeOnceEvent("shiled_off", this.Shiled_off, this, t), ie.instance.showTrollShieldEffect())
		}
		Shiled_off() {
			this._isShiled = !1, ie.instance.hideTrollShieldEffect()
		}
		hit(t) {
			this._isShiled || super.hit(t)
		}
		Escape() {
			ot.instance.Fire(ot.instance.BUILD_HANDLEROOMBUFF, this._attackRoom, 3), ot.instance.Fire(ot.instance.UIGM_TIPS, yi.instance.getLanguage("187"))
		}
		InSafe(t) {}
		GameOver() {
			this._isShiled = !1, this._isRage = !1, super.GameOver()
		}
	}
	class de {
		constructor() {
			de._ins = this, this._troll = new _e
		}
		static get instance() {
			return this._ins && null != this._ins ? this._ins : null
		}
		get troll() {
			return this._troll.troll
		}
		get trollSprict() {
			return this._troll
		}
		StartGame() {
			this._troll.StartGame()
		}
		GameOver() {
			this._troll.GameOver()
		}
	}
	class ce extends oe {
		constructor() {
			super(), this.timernum = 33, this.taskIndex = 0, this.path = "Prefabs/BattleUI.json", this.zOrder = 3
		}
		ReadUIInfo() {
			this.gold1 = this.panel.getChildByName("Gold1").getChildAt(0), this.gold2 = this.panel.getChildByName("Gold2").getChildAt(0), this.gold3 = this.panel.getChildByName("Gold3"), this.gold3.text = yi.instance.getLanguage("155") + " X5", this.timepanel = this.panel.getChildByName("timePanel"), this.timer = this.timepanel.getChildByName("timer"), this.taskTroll = this.panel.getChildByName("taskTroll"), this.taskTroll.getChildByName("game").text = yi.instance.getLanguage("213"), this.head = this.panel.getChildByName("head"), this.btn_mul = this.panel.getChildByName("btn_mul"), this.video = this.btn_mul.getChildByName("video"), this.used = this.btn_mul.getChildByName("used"), this.used.skin = "UI/" + yi.instance.getPicture() + "/wz.png", this.btn_mul.getChildByName("text").text = yi.instance.getLanguage("94") + "X2", this.backBtn = this.panel.getChildByName("back"), this.backPanel = this.panel.getChildByName("BattleBackUI"), this.backPanel.getChildByName("pic").skin = "UI/" + yi.instance.getPicture() + "/zant_2.png", this.cGame = this.backPanel.getChildByName("cGame"), this.rGame = this.backPanel.getChildByName("rGame"), this.cGame.getChildByName("pic").skin = "UI/" + yi.instance.getPicture() + "/zant_4.png", this.rGame.getChildByName("pic").skin = "UI/" + yi.instance.getPicture() + "/zant_3.png", this.backPanel.width = this.scene.width, this.backPanel.height = this.scene.height, this.backPanel.visible = !1, this.backBtn.on(Laya.Event.CLICK, this, this.BackBtnClickEvent), this.cGame.on(Laya.Event.CLICK, this, this.CGameClickEvent), this.rGame.on(Laya.Event.CLICK, this, this.RGameClickEvent), this.btn_mul.on(Laya.Event.CLICK, this, this.onBtnMul);
			let t = [this.cGame, this.rGame, this.backBtn, this.btn_mul];
			Pt.instance.AddBtnEvent(t), this.backPanel.y = Z.isX() ? 0 : -100
		}
		Init() {
			this.gold1.text = "0", this.gold2.text = "0", ni.Model == Lt.HumanModel ? (this.timernum = 30, this.panel.getChildByName("Gold1").visible = !0, this.panel.getChildByName("Gold2").visible = !0) : ni.Model == Lt.TrollModel && (this.timernum = 10, this.panel.getChildByName("Gold1").visible = !1, this.panel.getChildByName("Gold2").visible = !1), this.timer.text = this.timernum.toString(), this.timepanel.visible = !0, this.HeadInit(), this.TaskInit(), rt.instance.AddTimeLoopEvent("StartTimer", this.StartTimer, this, 1), this.btn_mul.visible = ni.Model == Lt.HumanModel, this.taskTroll.visible = !1
		}
		UpGold() {
			let t = Qt.instance.player.roomIndex,
				e = di.instance.game.GetRoomPR(t);
			null != e && (this.gold1.text = e.gold1.toString(), this.gold2.text = e.gold2.toString())
		}
		onBtnMul() {
			this.used.visible || yi.instance.showVideo(() => {
				F.gold_mul = 2, this.used.visible = !0, this.video.visible = !1
			})
		}
		AddUpData() {
			ni.Model == Lt.HumanModel && rt.instance.AddTimeLoopEvent("UpGpld", this.UpGold, this, .25)
		}
		StartTimer() {
			this.timernum--, this.timer.text = this.timernum.toString(), 0 == this.timernum && (rt.instance.RemoveListLoopEvent("StartTimer"), ni.Model == Lt.HumanModel ? ot.instance.Fire(ot.instance.UIGM_TIPS, yi.instance.getLanguage("198")) : ni.Model == Lt.TrollModel && ot.instance.Fire(ot.instance.UIGM_SHOWSKILL), _t.instance.PlaySound(_t.instance.Other_sound.ermt_0), this.timepanel.visible = !1, ot.instance.Fire(ot.instance.MAINLG_TROLLUPDATA), ni.Model == Lt.TrollModel && (this.taskTroll.visible = !1, ot.instance.Fire(ot.instance.OINPUT_Event_RS_ON))), ni.Model == Lt.TrollModel && (3 == this.timernum && (this.taskTroll.visible = !0, ot.instance.Fire(ot.instance.OINPUT_Event_OFF), ot.instance.Fire(ot.instance.MGM_LOOKPOS, de.instance.trollSprict.x, de.instance.trollSprict.y), ni.isTrollGameStart = !0), 9 == this.timernum && (ni.isTrollGameLookPlayer = !1)), this.timernum < 10 && _t.instance.PlaySound(_t.instance.Other_sound.timer)
		}
		HeadInit() {
			if (this.head.numChildren > 0) {
				let t = Qt.instance.head,
					e = [];
				for (let i = 0; i < t.length; i++) {
					let s = this.head.getChildAt(i),
						n = s.getChildByName("head");
					s.getChildByName("red").alpha = 0, s.getChildByName("x").visible = !1;
					let a = t[i];
					n.skin = "pipei/pGame_" + a + ".png", s.on(Laya.Event.CLICK, this, this.HeadClickEvent, [i]), e.push(s);
					let l = s.getChildByName("player");
					l && (l.visible = ni.Model == Lt.HumanModel)
				}
				if (ni.Model == Lt.HumanModel) {
					let i = this.head.getChildAt(t.length),
						s = i.getChildByName("head");
					s.skin = "pipei/pGame_" + di.instance.player.playerSelectIndex + ".png", -1 != F.try_index && (s.skin = "pipei/pGame_" + F.try_index + ".png"), i.on(Laya.Event.CLICK, this, this.HeadClickEvent, [t.length]), e.push(i), i.getChildByName("x").visible = !1;
					let n = i.getChildByName("player");
					n && (n.visible = !0)
				}
				Pt.instance.AddBtnEvent(e)
			}
		}
		playerHit(t) {
			if (t < 0 || t > 5) return;
			let e = this.head.getChildAt(t);
			if (e) {
				let t = e.getChildByName("x");
				t.visible = !0, t.scale(1.5, 1.5), t.alpha = 0, Laya.Tween.to(t, {
					scaleX: 1,
					scaleY: 1,
					alpha: 1
				}, 300, null, null, 0, !0)
			}
		}
		playerHitEffect(t) {
			if (ni.Model == Lt.HumanModel) {
				if (t < 0 || t > 5) return
			} else if (ni.Model == Lt.TrollModel && (t < 0 || t > 6)) return;
			let e = this.head.getChildAt(t);
			if (e) {
				let t = e.getChildByName("red"),
					i = e.getChildByName("head");
				Pt.instance.Breathing(t, 0, 4), Pt.instance.ShakeHead(i, 0, 6)
			}
		}
		HeadClickEvent(t) {
			Qt.instance.LookPos(t)
		}
		TaskInit() {
			if (ni.Model == Lt.TrollModel) return this.taskPanel = this.panel.getChildByName("task"), void(this.taskPanel.visible = !1);
			di.instance.player.DZCount < di.instance.cdn.cdn.taskOpenCount ? (this.taskPanel && this.taskText || (this.taskPanel = this.panel.getChildByName("task"), this.taskText = this.taskPanel.getChildByName("taskText"), this.taskBtn = this.taskPanel.getChildByName("taskBtn"), ot.instance.AddListEvent(ot.instance.BATTLEUI_TASKCOMPLETE, this.CompleteTask, this), this.taskPanel.visible = !0), this.taskIndex = 0, this.tasklg.player = Qt.instance.player, this.tasklg.task = this.taskIndex, this.tasklg.AddUpEvent(), this.TaskPanel()) : this.taskPanel && (this.taskPanel.visible = !1)
		}
		CompleteTask() {
			this.taskBtn.text = yi.instance.getLanguage("22"), this.taskBtn.color = "#23af00", this.taskBtn.underlineColor = "#23af00", this.taskBtn.on(Laya.Event.CLICK, this, this.TaskBtnClickEvent)
		}
		TaskBtnClickEvent() {
			this.taskIndex++, this.TaskPanel(), this.tasklg.task = this.taskIndex
		}
		TaskPanel() {
			let t = di.instance.task.GetTaskText(this.taskIndex);
			t ? (this.taskIndex > di.instance.player.taskIndex && (di.instance.player.taskIndex++, di.instance.player.gold += 5, this.gold3.y = 225.5, Pt.instance.Gold3Effwct(this.gold3)), this.taskText.text = t, this.taskBtn.text = yi.instance.getLanguage("63"), this.taskBtn.color = "#d60303", this.taskBtn.underlineColor = "#d60303", this.taskBtn.offAll()) : (this.TaskOver(), this.tasklg.RemoveUpEvent())
		}
		TaskOver() {
			this.taskPanel.visible = !1, ot.instance.Fire(ot.instance.UIGM_TIPS, yi.instance.getLanguage("199")), di.instance.player.taskOk = !0
		}
		get tasklg() {
			return this._tasklg && null != this._tasklg || (this._tasklg = new le), this._tasklg
		}
		BackBtnClickEvent() {
			yi.instance.InterstitialAdShow(), Z.eventDis.event("open_setting"), this.backPanel.visible = !0, this.panel.height = this.scene.height
		}
		CGameClickEvent() {
			this.backPanel.visible = !1, this.panel.height = this.scene.height
		}
		RGameClickEvent() {
			ot.instance.Fire(ot.instance.GM_GAMEOVER, null), this.CGameClickEvent()
		}
		_Show() {
			this.used.visible = !1, this.panel.height = this.scene.height, this.backPanel.visible = !1, yi.instance.clickData && yi.instance.clickData.FunctionVideo ? this.video.visible = !1 : this.video.visible = !0
		}
		_Hide() {
			this.panel.height = this.scene.height;
			let t = [];
			for (let e = 0; e < this.head.numChildren; e++) {
				let i = this.head.getChildAt(e);
				t.push(i)
			}
			Pt.instance.RemoveBtnEvent(t)
		}
	}
	class ue extends oe {
		constructor() {
			super(), this._timegold = 10, this._wingold = 10, this._killgold = 20, this.rewardGold = 10, this._rewardTimeMin = 210, this._rewardTimeMax = 330, this._timegold = 10, this._wingold = 10, this._killgold = 20, this.rewardGold = 10, this._rewardTimeMin = 210, this._rewardTimeMax = 330, this.path = "Prefabs/GameOverUI.json", this.zOrder = 10
		}
		ReadUIInfo() {
			this.panel.width = this.scene.width, this.panel.height = this.scene.height, this.bg = this.panel.getChildByName("bg"), this.bg.width = this.scene.width, this.bg.height = this.scene.height, this.redPanel = this.panel.getChildByName("red"), this.root1 = this.panel.getChildByName("root1"), this.redPanel.y = (this.scene.height - this.redPanel.height) / 2, this.root1.y = this.scene.height - this.root1.height, this.rewardBtn_1 = this.root1.getChildByName("rewardBtn_1"), this.rewardBtn_3 = this.root1.getChildByName("rewardBtn_3"), this.rewardBtn_3.getChildByName("tt").skin = "UI/" + yi.instance.getPicture() + "/jiesuan_7.png", this.rewardBtn_1.skin = "UI/" + yi.instance.getPicture() + "/jiesuan_6.png", this.loseImg = this.redPanel.getChildByName("loseImg"), this.winImg = this.redPanel.getChildByName("winImg"), this.win = this.redPanel.getChildByName("win"), this.loser = this.redPanel.getChildByName("loser"), this.mvp = this.redPanel.getChildByName("mvp"), this.mvp.skin = "UI/" + yi.instance.getPicture() + "/mvp.png", this.allGold = this.root1.getChildByName("gold"), this.gg = this.root1.getChildByName("gg"), this.tips = this.root1.getChildByName("ttt"), this.win.visible = !1, this.loser.visible = !1, this.rewardBtn_1.on(Laya.Event.CLICK, this, this.getReward), this.rewardBtn_3.on(Laya.Event.CLICK, this, this.RewardBtn_3_ClickEvent);
			let t = [this.rewardBtn_1, this.rewardBtn_3];
			Pt.instance.AddBtnEvent(t)
		}
		StartGame() {
			Pt.instance.Shake(this.rewardBtn_1, .05), Laya.timer.once(100, this, function() {
				ot.instance.FireReturn(ot.instance.UIGM_SHOW, oe.strArr.shopUI), ot.instance.FireReturn(ot.instance.UIGM_SHOW, oe.strArr.startGameUI) && this.Hide()
			})
		}
		_Show() {
			if (this.buildS3D(), this.OpenTreasureChest(), this.loser.visible = !di.instance.game.isWin, this.win.visible = di.instance.game.isWin, _t.instance.PlaySound(_t.instance.Other_sound.game_fail), this.mvp.visible = !1, di.instance.game.isWin ? this.Win() : this.Lose(), this.Reward(), this.allGold.text = this.rewardGold.toString(), this.win.getChildAt(0).skin = ni.Model == Lt.HumanModel ? "UI/" + yi.instance.getPicture() + "/jiesuan_4.png" : "UI/" + yi.instance.getPicture() + "/js_w4.png", this.loser.getChildAt(0).skin = ni.Model == Lt.HumanModel ? "UI/" + yi.instance.getPicture() + "/jiesuan_3.png" : "UI/" + yi.instance.getPicture() + "/js_w3.png", yi.instance.clickData && yi.instance.clickData.endBanner) {
				if (1 == yi.instance.playCount && 2 == yi.instance.clickData.delay_error_count) return;
				this.showAndHideBanner(), Laya.timer.loop(3e3, this, this.showAndHideBanner)
			}
		}
		showAndHideBanner() {
			yi.instance.showBanner(), Laya.timer.once(2e3, this, function() {
				yi.instance.hideBanner()
			})
		}
		IsMVP() {
			di.instance.game.isMvp && (di.instance.player.mvp++, this.mvp.visible = !0)
		}
		_Hide() {
			yi.instance.playCount++, W.Mem.recoveryComplexSP(Et.shop.scene3D, {
				rcom: !0
			}), Et.shop.scene3D.destroy(), this.rewardGold = 10, this.gg.visible = !1, Laya.timer.clear(this, this.showAndHideBanner)
		}
		Reward() {
			let t = [0, 0, 0],
				e = rt.instance.gameTime;
			e >= this._rewardTimeMin && (t[0] = Math.floor(Math.min(e / this._rewardTimeMax, 1) * this._timegold)), di.instance.game.isWin && (t[1] = this._wingold, di.instance.game.isMvp ? t[2] = this._killgold : t[2] = this._killgold / 2);
			this.rewardGold = 20
		}
		getReward() {
			if (yi.instance.clickData && yi.instance.clickData.homepageVideo) {
				if (1 == yi.instance.playCount && 2 == yi.instance.clickData.delay_play_count) return void this.RewardBtn_1_ClickEvent();
				yi.instance.showVideo(function() {
					this.RewardBtn_1_ClickEvent()
				}.bind(this), function() {
					this.RewardBtn_1_ClickEvent()
				}.bind(this))
			} else this.RewardBtn_1_ClickEvent()
		}
		RewardBtn_1_ClickEvent() {
			di.instance.player.gold += this.rewardGold, this.StartGame(), ot.instance.Fire(ot.instance.UIGM_TIPS, yi.instance.getLanguage("15") + " X" + this.rewardGold + yi.instance.getLanguage("155"))
		}
		RewardBtn_3_ClickEvent() {
			let t = this;
			yi.instance.showVideo(() => {
				di.instance.player.gold += 3 * t.rewardGold, t.StartGame(), ot.instance.Fire(ot.instance.UIGM_TIPS, yi.instance.getLanguage("15") + " X" + 3 * t.rewardGold + yi.instance.getLanguage("155"))
			})
		}
		OpenTreasureChest() {
			if (di.instance.player.DZCount >= di.instance.cdn.cdn.treasureChestOpenCount) {
				let t = null;
				if (di.instance.player.DZCount == di.instance.cdn.cdn.treasureChestOpenCount) t = di.instance.cdn.cdn.treasureChestArr[di.instance.cdn.cdn.treasureChestFirstShow], di.instance.cdn.tcArr = t, ot.instance.Fire(ot.instance.UIGM_SHOW, oe.strArr.treasureChestUI);
				else {
					let e = di.instance.player.DZCount - di.instance.cdn.cdn.treasureChestFirstShow;
					if (e % di.instance.cdn.cdn.treasureChestShow == 0) {
						let i = Math.floor(e / di.instance.cdn.cdn.treasureChestShow) % di.instance.cdn.cdn.treasureChestLoopShow.length,
							s = di.instance.cdn.cdn.treasureChestLoopShow[i];
						t = di.instance.cdn.cdn.treasureChestArr[s], di.instance.cdn.tcArr = t, ot.instance.Fire(ot.instance.UIGM_SHOW, oe.strArr.treasureChestUI)
					}
				}
			}
		}
		Win() {
			this.tips.text = yi.instance.getLanguage("211"), di.instance.player.win++, this.IsMVP(), this.gg.visible = !0, Pt.instance.RotEffect_360(this.gg, 36), this.winImg.visible = !1, this.loseImg.visible = !1, this.rewardBtn_3.skin = "chest_n/box_10.png", ni.Model == Lt.HumanModel ? (this.winImg.skin = "StartGameUI/player_" + di.instance.game.mvpIndex + ".png", this.addRole(!1, di.instance.game.mvpIndex)) : ni.Model == Lt.TrollModel && (this.addRole(!0, di.instance.player.trollIndex), this.winImg.skin = "StartGameUI/mg_" + di.instance.player.trollIndex + ".png", this.win.visible = !0, this.loser.visible = !1)
		}
		Lose() {
			this.tips.text = yi.instance.getLanguage("210"), this.gg.visible = !1, di.instance.player.lose++, this.winImg.visible = !1, this.loseImg.visible = !1, this.rewardBtn_3.skin = "result_n/jiesuan_10.png", ni.Model == Lt.HumanModel ? this.addRole(!0, ie.cur_troll_index) : ni.Model == Lt.TrollModel && (this.addRole(!1, 0), this.win.visible = !1, this.loser.visible = !0)
		}
		buildS3D() {
			Et.build({
				ac: new W.V3C(150),
				fp: 1e3,
				lc: new W.Vec3(1),
				li: .51,
				lq: new W.Quat(1, 0, 1.6, -2),
				sh: !1,
				sky_ri: .2
			}, W.S3T.SHOP, this.scene), Et.shop.scene3D.zOrder = 11;
			let t = Et.shop.camera;
			t.clearFlag = Laya.CameraClearFlags.DepthOnly, t.transform.position = W.Conversion.UnityToLayaPos(new Laya.Vector3(0, Z.isX() ? 3.2 : 3.3, Z.isX() ? 7 : 6)), t.transform.rotationEuler = W.Conversion.UnityToLayaRE(new Laya.Vector3(27, 180, 0)), t.fieldOfView = 60
		}
		addRole(t, e) {
			let i = null;
			t || (i = W.Mem.getSP(3e3 + e)), i = i ? W.Mem.getSP(3200 + e) : W.Mem.getSP(3005), W.Transform3D.addChild(Et.shop.scene3D, i), i.transform.localScale = new Laya.Vector3(1.2, 1.2, 1.2)
		}
	}
	class pe extends Laya.Scene {
		constructor() {
			super(), this.resultIndex = 1, this.mulList = [10, 1, 20, 1, 30, 50], this.goodsType = ["gold", "smoney", "gold", "particlea", "gold", "gold"], this.imgList = ["img/turn/gold1.png", "img/turn/gold2.png", "img/turn/gold3.png", "img/turn/gold4.png", "img/turn/gold5.png", "img/turn/gold6.png"], this.imgTextList = ["img/turn/type_2.png", "img/turn/type_4.png", "img/turn/type_3.png", "img/turn/type_6.png", "img/turn/type_1.png", "img/turn/type_5.png"], this.rewardSkin = null, this.rewardEquit = null, this.is_turn = !1, this.is_Item_type = 0, this.maxtime = 3600, this.is_max_award = !1
		}
		onOpened(t) {
			Z.isX() && (this.root.height = 1340, this.root.y = $.height() - this.root.height), this.is_turn = !1, this.is_Item_type = 0, this.is_max_award = !1, this.source_scene = t, this.setRewardSkin(), this.init2DUI(), this.refreshData()
		}
		init2DUI() {
			this.btnCancel.offAll(), this.btnStart.offAll(), this.btnFreeTrun.offAll(), this.btnStart1.offAll(), Pt.instance.AddBtnEvent([this.btnCancel, this.btnStart, this.btnFreeTrun]), this.btnCancel.on(Laya.Event.CLICK, this, this.onBtnCancel), this.btnStart.on(Laya.Event.CLICK, this, this.onBtnStart), this.btnFreeTrun.on(Laya.Event.CLICK, this, this.onBtnStart), this.btnStart1.on(Laya.Event.CLICK, this, this.onBtnStart1), this.btnFreeTrun.getChildByName("ttt").skin = "UI/" + yi.instance.getPicture() + "/turn_btn_text.png", this.btnStart.getChildByName("ttt").skin = "UI/" + yi.instance.getPicture() + "/turn_btn_text.png", this.btnCancel.skin = "UI/" + yi.instance.getPicture() + "/bt_back.png", Laya.timer.loop(1, this, () => {
				this.update()
			}), yi.instance.clickData && yi.instance.clickData.FunctionVideo ? this.btnStart.getChildByName("video").visible = !1 : this.btnStart.getChildByName("video").visible = !0, yi.instance.showBanner()
		}
		refreshData() {
			this.lbHint.text = yi.instance.getLanguage("206") + (3 - H.getTurnNum()), this.pro.width = Math.floor(287 / 3 * H.getTurnNum()) + 1, 3 - H.getTurnNum() == 0 && (this.lbHint.text = yi.instance.getLanguage("207")), H.getFreeTurn() ? (this.lbHint.text = yi.instance.getLanguage("208"), this.btnStart.visible = !1, this.btnFreeTrun.visible = !0) : (this.btnStart.visible = !0, this.btnFreeTrun.visible = !1)
		}
		update() {
			this.is_turn && this.checkPointerAngel()
		}
		onBtnStart() {
			H.getFreeTurn() ? this.is_turn || (this.is_turn = !0, H.setFreeTurn(0), H.addTurnNum(1), this.startTable(), this.refreshData()) : this.is_turn || yi.instance.showVideo(() => {
				H.addTurnNum(1), this.is_turn = !0, this.startTable(), this.refreshData()
			})
		}
		onBtnStart1() {
			H.getFreeTurn() ? this.is_turn || (this.is_turn = !0, H.setFreeTurn(0), H.addTurnNum(1), this.startTable(), this.refreshData()) : this.is_turn || (X.is_turn_video ? yi.instance.showVideo(() => {
				H.addTurnNum(1), this.is_turn = !0, this.startTable(), this.refreshData()
			}) : st.mainCH.showToast("抽奖券不足，请先领取抽奖券"))
		}
		onBtnClose() {
			Laya.timer.clearAll(this), this.btnCancel.offAll(Laya.Event.CLICK), this.btnStart.offAll(Laya.Event.CLICK), this.btnStart1.offAll(Laya.Event.CLICK), this.close()
		}
		showSkin(t) {
			var e = this.table.getChildAt(t).getChildByName("ivAward"),
				i = this.table.getChildAt(t).getChildByName("ivType"),
				s = this.table.getChildAt(t).getChildByName("lbAward");
			e.skin = this.imgList[t], i.skin = this.imgTextList[t], s.text = "x" + this.mulList[t], i.visible = !1, s.visible = !0
		}
		resetTable() {
			this.table.rotation = 0
		}
		startTable() {
			this.is_Item_type = 0, this.resetTable(), this.btnCancel.disabled = !0, this.btnCancel.gray = !1, this.is_max_award = !1;
			let t = D.getIntegerInRandom(2, 1),
				e = D.getIntegerInRandom(100, 0);
			if (1 == t && H.getTurnNum() >= 3) this.is_max_award = !0, this.resultIndex = 1, 1 != this.mulList[1] && 1 == this.mulList[3] && (this.resultIndex = 3);
			else if (2 == t && H.getTurnNum() >= 3) this.is_max_award = !0, this.resultIndex = 3, 1 != this.mulList[3] && 1 == this.mulList[1] && (this.resultIndex = 1);
			else if (e < 20) this.resultIndex = 5;
			else {
				var i = [0, 2, 4];
				this.resultIndex = i[D.getIntegerInRandom(0, i.length - 1)]
			}
			let s = 1e3 * (4 * Math.random() + 4),
				n = 5 + ~~(5 * Math.random()),
				a = 60 * this.resultIndex + D.getRealInRandom(-25, 25);
			this.rotateTable(a + 360 * n, s), console.log("angle:", a)
		}
		rotateTable(t, e) {
			Laya.Tween.to(this.table, {
				rotation: t
			}, e, Laya.Ease.cubicOut, Laya.Handler.create(this, this.showResult))
		}
		showResult() {
			this.is_turn = !1, console.info("抽奖结果:", this.resultIndex, this.mulList[this.resultIndex]), this.btnCancel.disabled = !1, this.is_max_award && H.setTurnNum(0), this.refreshData(), "gold" == this.goodsType[this.resultIndex] ? (di.instance.player.gold += this.mulList[this.resultIndex], ot.instance.Fire(ot.instance.UIGM_TIPS, yi.instance.getLanguage("15") + " X" + this.mulList[this.resultIndex] + yi.instance.getLanguage("155"))) : "smoney" == this.goodsType[this.resultIndex] ? (di.instance.player.ModifiedBuileprintQuantity(this.goodsType[this.resultIndex], this.mulList[this.resultIndex]), ot.instance.Fire(ot.instance.UIGM_TIPS, yi.instance.getLanguage("15") + " X" + this.mulList[this.resultIndex] + yi.instance.getLanguage("137"))) : "particlea" == this.goodsType[this.resultIndex] && (di.instance.player.ModifiedBuileprintQuantity(this.goodsType[this.resultIndex], this.mulList[this.resultIndex]), ot.instance.Fire(ot.instance.UIGM_TIPS, yi.instance.getLanguage("15") + " X" + this.mulList[this.resultIndex] + yi.instance.getLanguage("143"))), H.saveData()
		}
		checkPointerAngel() {
			let t = ~~Math.abs(this.table.rotation) % 360,
				e = 0;
			if (t >= 328 || t <= 28) e = 0;
			else if (t > 28 && t <= 88) e = 1;
			else if (t > 88 && t <= 148) e = 2;
			else if (t > 148 && t <= 208) e = 3;
			else if (t > 208 && t <= 268) e = 4;
			else {
				if (!(t > 268 && t <= 328)) return;
				e = 5
			}
			if (this.lastIndex == e) return;
			let i = this.table.getChildAt(e);
			if (this.setItemData(i, 1), null != this.lastIndex && null != this.lastIndex) {
				let t = this.table.getChildAt(this.lastIndex);
				this.setItemData(t, 0)
			}
			this.lastIndex = e
		}
		setItemData(t, e) {
			let i = t.getChildByName("light");
			i.visible = !!e
		}
		setRewardSkin() {
			for (var t = 0; t < 6; t++) this.showSkin(t)
		}
		onBtnCancel() {
			yi.instance.hideBanner(), this.onBtnClose()
		}
		showGold(t) {}
		onDisable() {
			pe.instance = null
		}
	}
	pe.SCENE_NAME = "Prefabs/Turntable.scene";
	class ge extends Laya.Scene {
		constructor() {
			super(), this.test = !1
		}
		onOpened(t) {
			this.zOrder = 1, this.test || Laya.stage.getChildAt(0).getChildAt(0).getChildByName("StartGame").addChild(this), this.test = !0, this.initBtn(), this.initSound(), this.initShake(), Z.isX() && (this.root.y = 40), yi.instance.showBanner()
		}
		initBtn() {
			Pt.instance.AddBtnEvent([this.btn_close, this.btn_voice, this.btn_shake]), this.btn_close.on(Laya.Event.CLICK, this, this.onBtnClose), this.btn_voice.on(Laya.Event.CLICK, this, this.onBtnSound), this.btn_shake.on(Laya.Event.CLICK, this, this.onBtnShake), this.btn_shake.parent.getChildByName("sss").skin = "UI/" + yi.instance.getPicture() + "/shezhi_4.png", this.btn_shake.parent.getChildByName("zz").skin = "UI/" + yi.instance.getPicture() + "/shezhi_7.png", this.btn_shake.parent.getChildByName("ss").skin = "UI/" + yi.instance.getPicture() + "/shezhi_3.png"
		}
		initSound() {
			F.sound_switch ? (Laya.SoundManager.muted = !1, this.btn_voice.skin = "UI/" + yi.instance.getPicture() + "/switch_on.png") : (Laya.SoundManager.muted = !0, this.btn_voice.skin = "UI/" + yi.instance.getPicture() + "/switch_off.png")
		}
		initShake() {
			F.shake_switch ? this.btn_shake.skin = "UI/" + yi.instance.getPicture() + "/switch_on.png" : this.btn_shake.skin = "UI/" + yi.instance.getPicture() + "/switch_off.png"
		}
		onBtnSound() {
			F.sound_switch = 1 == F.sound_switch ? 0 : 1, this.initSound()
		}
		onBtnShake() {
			F.shake_switch = 1 == F.shake_switch ? 0 : 1, this.initShake()
		}
		onBtnClose() {
			yi.instance.hideBanner(), this.closeSelf(), this.close(), ge.instance = null
		}
		closeSelf() {}
	}
	ge.SCENE_NAME = "Prefabs/Setting.scene";
	class me extends Laya.Scene {
		constructor() {
			super()
		}
		onOpened(t) {
			this.itemId = t, Z.isX() && (this.root.y = 100, this.root1.y += 100), me.instance = this, ot.instance.Fire(ot.instance.UIGM_TIPS, "打开了皮肤试用界面"), Laya.timer.once(1e3, this, function() {
				this.buildS3D(), this.initData(), this.initBtn()
			}), Laya.timer.once(2e3, this, function() {
				this.addRole()
			})
		}
		buildS3D() {
			Et.build({
				ac: new W.V3C(150),
				fp: 1e3,
				lc: new W.Vec3(1),
				li: .8,
				lq: new W.Quat(1, 0, 1.6, -2),
				sh: !1,
				sky_ri: .2
			}, W.S3T.SHOP, this), Et.shop.scene3D.zOrder = 2;
			let t = Et.shop.camera;
			t.clearFlag = Laya.CameraClearFlags.DepthOnly, ot.instance.Fire(ot.instance.UIGM_TIPS, "创建3d模型"), t.transform.position = W.Conversion.UnityToLayaPos(new Laya.Vector3(0, Z.isX() ? 3.2 : 2.8, Z.isX() ? 7 : 6)), t.transform.rotationEuler = W.Conversion.UnityToLayaRE(new Laya.Vector3(27, 180, 0)), t.fieldOfView = 60
		}
		addRole() {
			let t = W.Mem.getSP(3e3 + this.itemId);
			if (ot.instance.Fire(ot.instance.UIGM_TIPS, ""), console.log("1111111111111111111", t), ot.instance.Fire(ot.instance.UIGM_TIPS, "添加3d模型"), !t) return console.log("22222222222222222"), void this.close();
			console.log("3333333333333333"), W.Transform3D.addChild(Et.shop.scene3D, t), Laya.timer.once(1e3, this, function() {
				console.log("4444444444444444"), ot.instance.Fire(ot.instance.UIGM_TIPS, "模型放大"), t.transform.localScale = new Laya.Vector3(1.5, 1.5, 1.5)
			})
		}
		initBtn() {
			this.btnCancel.offAll(), this.btnSure.offAll(), Pt.instance.AddBtnEvent([this.btnCancel, this.btnSure]), this.btnCancel.on(Laya.Event.CLICK, this, this.onBtnCancel), this.btnSure.on(Laya.Event.CLICK, this, this.onBtnSure), this.btnCancel.skin = "UI/" + yi.instance.getPicture() + "/shiy_2.png", this.btnSure.getChildByName("tt").skin = "UI/" + yi.instance.getPicture() + "/shiy_4.png", this.item.parent.getChildByName("sss").skin = "UI/" + yi.instance.getPicture() + "/w.png", this.item.parent.getChildByName("ss").skin = "UI/" + yi.instance.getPicture() + "/shiy_4.png", yi.instance.clickData && yi.instance.clickData.FunctionVideo && (this.btnSure.getChildByName("video").visible = !1)
		}
		initData() {
			this.item.skin = "StartGameUI/player_" + this.itemId + ".png"
		}
		onBtnSure() {
			yi.instance.showVideo(() => {
				ye.ins && (F.try_index = this.itemId, ye.ins.selectIndex = this.itemId, ye.ins.LoadAnim()), this.close()
			})
		}
		onBtnCancel() {
			this.btnCancel.offAll(), Laya.timer.once(100, this, () => {
				this.close()
			})
		}
		onDisable() {
			W.Mem.recoveryComplexSP(Et.shop.scene3D, {
				rcom: !0
			}), Et.shop.scene3D.destroy(), Z.eventDispatcher.event("close_Start_try")
		}
		onClosed() {
			me.instance = null
		}
	}
	me.SCENE_NAME = "Prefabs/StartTry.scene";
	class Ie {
		constructor() {
			this._name_1 = ["Abigil", "Leo", "Hale", "Angelia", "Abner", "Max", "John", "Amber", "Becky", "Jeff", "Beck", "Carmen", "Basil", "Cindy", "Stev", "Darcy", "Jack", "Diana", "Eva", "Byron", "Frieda", "Gina", "Troy", "Hellen", "Jason", "Hebe", "Irene", "Jamie", "Jane", "Joey", "Judy", "Tony", "Kelly", "Lisa", "Barton", "Linda", "Sue", "Tina", "Ken", "Wendy", "Clark", "Eden", "Glenn", "Tim", "York", "Baron", "dony"]
		}
		static get instance() {
			return this._instance
		}
		get name() {
			let t;
			Math.random();
			return t = this._name_1[Math.floor(Math.random() * this._name_1.length)]
		}
	}
	Ie._instance = new Ie;
	class fe extends oe {
		constructor() {
			super(), this.time = 0, this.playerSKin = 5, this.headImg = [0, 1, 3, 4, 5, 6], this._isMatch = !1, this._aiNameArr = [], this.index = 0, this.time = 0, this.playerSKin = 5, this.headImg = [0, 1, 3, 4, 5, 6], this._isMatch = !1, this._aiNameArr = [], this.path = "Prefabs/MatchingUI.json", this.zOrder = 10
		}
		ReadUIInfo() {
			this.panel.height = this.scene.height, this.heads = this.panel.getChildByName("head"), this.math_icon = this.panel.getChildByName("math_icon"), this.lb_math_name = this.panel.getChildByName("lb_math_name"), this.startGameBtn = this.panel.getChildByName("startGameBtn"), this.startText = this.startGameBtn.getChildByName("lb_start"), this.black = this.startGameBtn.getChildByName("black"), this.pp = this.panel.getChildByName("PP"), this.panel.getChildByName("game").text = yi.instance.getLanguage("209"), this.backBtn = this.panel.getChildByName("backBtn"), this.backBtn.on(Laya.Event.CLICK, this, this.BackBtnClickEvent), Pt.instance.AddBtnEvent([this.backBtn])
		}
		HeadInit() {
			for (let t = 0; t < this.heads.numChildren; t++) {
				let e = this.heads.getChildAt(t);
				e.skin = "pipei/select_3.png", e.getChildByName("no").visible = !0, 2 == t && (e.getChildByName("no").skin = "pipei/z20kb3.png"), e.getChildByName("name").text = "????"
			}
		}
		StartGame() {
			console.log("开始游戏"), ie.load_all ? (_t.instance.PlaySound(_t.instance.Other_sound.btn_gameStart), ot.instance.Fire(ot.instance.GM_STARTGAME), Pt.instance.Shake(this.startGameBtn, .05), Laya.timer.once(200, this, () => {
				this.Hide()
			}, null, !0)) : Laya.timer.loop(1, this, this.zbStart)
		}
		zbStart() {
			ie.load_all && (_t.instance.PlaySound(_t.instance.Other_sound.btn_gameStart), ot.instance.Fire(ot.instance.GM_STARTGAME), Pt.instance.Shake(this.startGameBtn, .05), Laya.timer.once(200, this, () => {
				this.Hide()
			}, null, !0), Laya.timer.clear(this, this.zbStart))
		}
		_Show() {
			ie.instance.setMatchCamera(), this.pp.text = "00:00", this.pp.visible = !0, this.HeadInit(), this._isMatch = !1, this.startText.skin = "pipei/pipei_7.png", this.black.alpha = 0, Laya.timer.loop(1e3, this, this.MatchEvent);
			let t = this.heads.getChildAt(2),
				e = t.getChildByName("no");
			e.skin = "StartGameUI/player_" + di.instance.player.playerSelectIndex + ".png", this.math_icon.skin = "pipei/pGame_" + di.instance.player.playerSelectIndex + ".png", -1 != F.try_index && (e.skin = "StartGameUI/player_" + F.try_index + ".png", this.math_icon.skin = "pipei/pGame_" + F.try_index + ".png"), t.getChildByName("name").text = yi.instance.getLanguage("70"), this.lb_math_name.text = yi.instance.getLanguage("70"), this.StartBtnClick(), ie.instance.addHomePlayer()
		}
		_Hide() {
			this.index = 0, Laya.timer.clear(this, this.MatchEvent), this.headImg = [0, 1, 3, 4, 5, 6], this.time = 0, this._aiNameArr.length = 0, ie.instance.clearHome()
		}
		MatchEvent() {
			if (this.headImg.length > 0) {
				this.time++, this.time < 10 ? this.pp.text = "00:0" + this.time : this.pp.text = "00:" + this.time;
				let t = Math.random();
				if (t < .9) {
					t = Math.floor(Math.random() * this.headImg.length);
					let e = this.headImg[t],
						i = this.heads.getChildAt(e);
					i.getChildByName("no").visible = !1, this.headImg.splice(t, 1);
					let s = i.getChildByName("name"),
						n = Ie.instance.name;
					if (0 == e) i.skin = "StartGameUI/mg_" + di.instance.player.trollIndex + ".png", di.instance.game.trollName = n, ie.instance.addHomeTroll(di.instance.player.trollIndex, n), this.math_icon.skin = "bullet/mg_" + di.instance.player.trollIndex + ".png";
					else {
						let t = Math.floor(Math.random() * this.playerSKin);
						i.skin = "StartGameUI/player_" + t + ".png", di.instance.game.playerArr = {
							name: n,
							index: t
						}, this.index += 1, ie.instance.addHomeAI(t, this.index, n), this.math_icon.skin = "pipei/pGame_" + t + ".png"
					}
					this.lb_math_name.text = n, s.text = n, Pt.instance.Shake(i, .2), _t.instance.PlaySound(_t.instance.Other_sound.MP)
				}
			} else this._isMatch && (Laya.timer.clear(this, this.MatchEvent), this.StartGame(), this.pp.visible = !0)
		}
		StartBtnClick() {
			this._isMatch ? (Laya.timer.clear(this, this.MatchEvent), this.StartGame(), this.pp.visible = !0) : (this._isMatch = !0, this.startText.skin = "pipei/pipei_6.png", this.startGameBtn.off(Laya.Event.CLICK, this, this.StartBtnClick), Pt.instance.Alpha(this.black, .5, 1), this.index += 1), Pt.instance.Shake(this.startGameBtn, .1)
		}
		BackBtnClickEvent() {
			this.Hide(), Pt.instance.Shake(this.startGameBtn, .1), Laya.timer.clear(this, this.MatchEvent), ot.instance.Fire(ot.instance.UIGM_SHOW, "startGameUI")
		}
		static InitWithoutUI() {
			let t = [0, 1, 3, 4, 5, 6];
			for (let e = 0; e < t.length; e++) {
				let t = Ie.instance.name;
				di.instance.game.trollName = t;
				let e = Math.floor(6 * Math.random());
				di.instance.game.playerArr = {
					name: t,
					index: e
				}
			}
			ot.instance.Fire(ot.instance.GM_STARTGAME), ie.instance.clearHome()
		}
	}
	class ye extends oe {
		constructor() {
			super(), this._anim = null, this._animFactory = null, this.selectIndex = 0, this.currIndex = 0, this.gsTime = 3, this.selectIng = !1, this._anim = null, this._animFactory = null, this.selectIndex = 0, this.gsTime = 3, this.path = "Prefabs/StartGame.json", this.zOrder = 10, Z.init(), F.go_game_time = Laya.Browser.now(), ye.ins = this
		}
		ReadUIInfo() {
			this.panel.width = this.scene.width, this.panel.height = this.scene.height, this.bg = this.panel.getChildByName("bg"), this.bg.height = this.scene.height, this.startGameBtn = this.panel.getChildByName("StartBtn"), this.startGameBtn.getChildByName("StartBtn").skin = "UI/" + yi.instance.getPicture() + "/ks.png", this.startGameTrollBtn = this.panel.getChildByName("StartBtnTroll"), this.startGameTrollBtn.skin = "UI/" + yi.instance.getPicture() + "/mg2.png", this.startGameTrollBtn.getChildByName("new").skin = "UI/" + yi.instance.getPicture() + "/ic2.png", this.startGameBtn.pos(this.panel.width / 2, this.panel.height / 2), this.deng = this.panel.getChildByName("deng"), this.select = this.panel.getChildByName("Select"), this.shopBtn = this.panel.getChildByName("Shop"), this.shopBtn.skin = "UI/" + yi.instance.getPicture() + "/shopBtn.png", this.gs = this.panel.getChildByName("gs"), this.gs.visible = !1, this.gs.width = this.scene.height, this.gs.height = this.scene.height, this.gsPanel = this.gs.getChildByName("GS"), this.gsPanel.getChildByName("pic").skin = "UI/" + yi.instance.getPicture() + "/aq_3.png", this.gsPanel.getChildByName("gsBtn").getChildByName("gslab").skin = "UI/" + yi.instance.getPicture() + "/gaoshi_1.png", this.gsBtn = this.gsPanel.getChildByName("gsBtn"), this.gsText = this.gsBtn.getChildByName("gstext"), this.gslab = this.gsBtn.getChildByName("gslab"), this.gsPanel.y = (this.scene.height - this.gsPanel.height) / 2, this.gold3 = this.panel.getChildByName("gold").getChildByName("text"), this.gold3.text = di.instance.player.gold.toString(), di.instance.player.goldText = this.gold3, _t.instance.PlaySound(_t.instance.BG_music.gs), this.startGameBtn.on(Laya.Event.CLICK, this, this.start), this.startGameTrollBtn.on(Laya.Event.CLICK, this, this.StartGameTroll), this.shopBtn.on(Laya.Event.CLICK, this, this.ShopBtnClickEvent), this.btn_turn = this.panel.getChildByName("btn_turn"), this.btn_turn.skin = "UI/" + yi.instance.getPicture() + "/lucky.png", this.btn_check = this.panel.getChildByName("btn_check"), this.btn_check.skin = "UI/" + yi.instance.getPicture() + "/qd.png", this.btn_set = this.panel.getChildByName("btn_set"), this.creditBtn = this.panel.getChildByName("creditBtn"), this.creditBtn.skin = "UI/" + yi.instance.getPicture() + "/cc.png", this.creditBtn1 = this.panel.getChildByName("gold").getChildByName("creditBtn"), this.btn_turn.on(Laya.Event.CLICK, this, this.onBtnTurn), this.btn_check.on(Laya.Event.CLICK, this, this.onBtnCheckin), this.btn_set.on(Laya.Event.CLICK, this, this.onBtnSetting), this.creditBtn.on(Laya.Event.CLICK, this, this.CreditBtnClickEvent), this.creditBtn1.on(Laya.Event.CLICK, this, this.CreditBtnClickEvent), this.spTroll = this.panel.getChildByName("spTroll"), this.spTroll.getChildByName("t").getChildByName("t").skin = "UI/" + yi.instance.getPicture() + "/w3.png", this.imgTrollTimes = this.spTroll.getChildByName("imgTrollTimes"), this.btnTrollYes = this.spTroll.getChildByName("btnTrollYes"), this.btnTrollYes.getChildByName("txt").skin = "UI/" + yi.instance.getPicture() + "/w1.png", this.btnTrollNo = this.spTroll.getChildByName("btnTrollNo"), this.btnTrollNo.skin = "UI/" + yi.instance.getPicture() + "/w2.png", this._anim || this.SelectHandle(), Pt.instance.AddBtnEvent([this.shopBtn, this.startGameBtn, this.startGameTrollBtn, this.btn_turn, this.btn_check, this.btn_set, this.creditBtn, this.creditBtn1, this.btnTrollYes, this.btnTrollNo]), this._Show(), this.gs.visible = !0, this.gsBtn.visible = !1, Laya.timer.once(3e3, this, () => {
				this.gsBtn.visible = !0
			}), this.GsTime(), this.AddSeleceEvent(), this.initData()
		}
		CreditBtnClickEvent() {
			ot.instance.Fire(ot.instance.UIGM_SHOW, oe.strArr.CreditUI)
		}
		initData() {
			new st(st.CH_VIVO), G.load(() => {
				H.checkIsNewDay() && (H.setFreeTurn(1), H.setTurnNum(0), 2 == H.getShowCheckin() && H.setShowCheckin(1)), H.setLoginTime(), H.saveData()
			})
		}
		start() {
			if (yi.instance.clickData && yi.instance.clickData.startVideo) {
				if (1 == yi.instance.playCount && 2 == yi.instance.clickData.delay_play_count) return void this.StartGame();
				yi.instance.showVideo(function() {
					this.StartGame()
				}.bind(this), function() {
					this.StartGame()
				}.bind(this))
			} else this.StartGame()
		}
		StartGame() {
			ni.Model = Lt.HumanModel, F.click_num = 0, F.gold_mul = 1, F.show_home_music = !0, this.RandomDiff(), Pt.instance.Shake(this.startGameBtn, .05), Laya.timer.once(100, this, function() {
				ot.instance.FireReturn(ot.instance.UIGM_SHOW, oe.strArr.macthingUI) && this.Hide()
			})
		}
		StartGameTroll() {
			let t = di.instance.player.videoNum;
			t || (di.instance.player.videoNum = 0, t = 0), t < 3 ? (Laya.Tween.clearAll(this.spTroll), this.btnTrollYes.offAll(Laya.Event.CLICK), this.btnTrollNo.offAll(Laya.Event.CLICK), this.spTroll.scale(0, 0), this.spTroll.visible = !0, this.imgTrollTimes.skin = "home_n/t_" + t + ".png", this.spTroll.getChildByName("txt1").text = yi.instance.getLanguage("204"), this.spTroll.getChildByName("txt2").text = yi.instance.getLanguage("205"), Laya.Tween.to(this.spTroll, {
				scaleX: 1,
				scaleY: 1
			}, 200, Laya.Ease.linearInOut, Laya.Handler.create(this, () => {
				this.btnTrollYes.on(Laya.Event.CLICK, this, this.TrollChallenge, [!1]), this.btnTrollNo.on(Laya.Event.CLICK, this, this.TrollChallengeNo)
			}))) : this.OpenTrollGame(!1)
		}
		TrollChallenge(t = !0) {
			yi.instance.showVideo(() => {
				di.instance.player.videoNum++, Laya.Tween.clearAll(this.spTroll), this.btnTrollYes.offAll(Laya.Event.CLICK), this.btnTrollNo.offAll(Laya.Event.CLICK), this.spTroll.scale(0, 0), this.spTroll.visible = !1, this.OpenTrollGame(t)
			})
		}
		TrollChallengeNo() {
			this.btnTrollYes.offAll(Laya.Event.CLICK), this.btnTrollNo.offAll(Laya.Event.CLICK), Laya.Tween.to(this.spTroll, {
				scaleX: 0,
				scaleY: 0
			}, 200, Laya.Ease.linearInOut, Laya.Handler.create(this, () => {
				this.spTroll.visible = !1
			}))
		}
		OpenTrollGame(t = !0) {
			ni.Model = Lt.TrollModel, ni.isTrollGameStart = !1, ni.isTrollGameLookPlayer = !0;
			let e = di.instance.player.PlayerSkin,
				i = [];
			for (let t = 0; t < 6; t++) {
				let s = !0;
				for (let i = 0; i < e.length; i++) e[i] == t && (s = !1);
				s && i.push(t)
			}
			let s = i[D.getIntegerInRandom(i.length - 1, 0)];
			t && i && i.length > 0 && X.showStartTry() ? (Z.eventDispatcher.once("close_Start_try", this, () => {
				this.RandomDiff(), Pt.instance.Shake(this.startGameBtn, .05), Laya.timer.once(100, this, function() {
					this.Hide(), fe.InitWithoutUI()
				})
			}), Laya.Scene.open(me.SCENE_NAME, !1, s)) : (this.RandomDiff(), Pt.instance.Shake(this.startGameBtn, .05), Laya.timer.once(100, this, function() {
				this.Hide(), fe.InitWithoutUI()
			}))
		}
		SelectHandle() {
			let t = di.instance.player.PlayerSkin;
			this.selectIndex = di.instance.player.playerSelectIndex;
			for (let e = 0; e < t.length; e++) {
				let i = t[e],
					s = this.select.getChildAt(i);
				if (s.getChildByName("adv").visible = !1, this.selectIndex == i) {
					s.getChildByName("text").visible = !0, s.skin = "home_n/home_k_3.png"
				} else {
					s.getChildByName("text").visible = !1
				}
			}
			this.LoadAnim()
		}
		AddSeleceEvent() {
			let t = [];
			for (let e = 0; e < this.select.numChildren; e++) {
				let i = this.select.getChildAt(e);
				i.getChildByName("text").skin = "UI/" + yi.instance.getPicture() + "/sy.png", i.getChildByName("adv").getChildByName("get").skin = "UI/" + yi.instance.getPicture() + "/hq.png", yi.instance.clickData && yi.instance.clickData.FunctionVideo && (i.getChildByName("adv").getChildByName("video").visible = !1), i.on(Laya.Event.CLICK, this, this.Select, [e]), t.push(i)
			}
			Pt.instance.AddBtnEvent(t)
		}
		Select(t) {
			if (this.selectIng) ot.instance.Fire(ot.instance.UIGM_TIPS, yi.instance.getLanguage("215"));
			else if (this.selectIng = !0, Laya.timer.once(2e3, this, function() {
					this.selectIng = !1
				}), this.currIndex = t, this.currIndex != this.selectIndex && null != this.selectIndex) {
				let t = this.select.getChildAt(this.currIndex),
					e = t.getChildByName("adv"),
					i = t.getChildByName("text"),
					s = this.select.getChildAt(this.selectIndex),
					n = this,
					a = s.getChildByName("text");
				e.visible ? yi.instance.showVideo(() => {
					a.visible = !1, s.skin = "home_n/home_k_2.png", t.skin = "home_n/home_k_3.png", i.visible = !0, e.visible = !1, n.selectIndex = this.currIndex, n.LoadAnim(), di.instance.player.playerSelectIndex = this.currIndex, di.instance.player.PlayerSkin = [this.currIndex], ie.instance.changePlayerSkin()
				}) : (s.skin = "home_n/home_k_2.png", t.skin = "home_n/home_k_3.png", a.visible = !1, i.visible = !0, this.selectIndex = this.currIndex, this.LoadAnim(), di.instance.player.playerSelectIndex = this.currIndex, di.instance.player.PlayerSkin = [this.currIndex], ie.instance.changePlayerSkin())
			}
		}
		LoadAnim() {
			this._animFactory = new Laya.Templet, this._animFactory.on(Laya.Event.COMPLETE, this, this.parseComplete), this._animFactory.loadAni(this.skin)
		}
		parseComplete() {
			this._anim && this._anim.destroy(), this._anim = this._animFactory.buildArmature(0), this._anim.visible = !0, this._anim.play(0, !0), this._anim.pivotY = -20, this.deng.addChild(this._anim), this._anim.pos(this.deng.pivotX, this.deng.pivotY), this._anim.zOrder = 3
		}
		get skin() {
			return "res/Skeleton/player/player_" + this.selectIndex + ".sk"
		}
		_Show(...t) {
			-1 != F.try_index && (F.try_index = -1, this.selectIndex = di.instance.player.playerSelectIndex, this.LoadAnim()), ie.instance.addHomeScene()
		}
		_Hide(...t) {
			ot.instance.Fire(ot.instance.UIGM_HIDE, oe.strArr.shopUI)
		}
		ShopBtnClickEvent() {
			ot.instance.Fire(ot.instance.UIGM_SHOW, oe.strArr.shopUI)
		}
		RandomDiff() {
			let t = di.instance.cdn.cdn.diff,
				e = t.diffCount,
				i = 0,
				s = di.instance.player.DZCount;
			for (let t = 0; t < e.length; t++) {
				s < e[t] ? i = t : t == e.length - 1 && (i = e.length)
			}
			let n = Math.floor(Math.random() * t.diff[i].length);
			di.instance.troll.difficulty = t.diff[i][n]
		}
		GsTime() {
			this.gsText.text = "", this.gslab.visible = !0, this.gsBtn.on(Laya.Event.CLICK, this, this.CloseGs), Pt.instance.AddBtnEvent([this.gsBtn])
		}
		CloseGs() {
			if (this.gs.removeSelf(), this.gs.visible = !1, this.gs.destroy(!0), yi.instance.clickData && yi.instance.clickData.homepageVideo) {
				if (1 == yi.instance.playCount && 2 == yi.instance.clickData.delay_play_count) return;
				yi.instance.showVideo()
			}
		}
		YesBtnClickEvent_1() {
			di.instance.player.ysOK = !0, this.gs.visible = !0, this.GsTime()
		}
		onBtnTurn() {
			Laya.Scene.open(pe.SCENE_NAME, !1)
		}
		onBtnCheckin() {
			Laya.Scene.open(bi.SCENE_NAME, !1)
		}
		onBtnSetting() {
			Laya.Scene.open(ge.SCENE_NAME, !1)
		}
	}
	class be extends oe {
		constructor() {
			super(), this.path = "Prefabs/TipsUI.json", this.zOrder = 100
		}
		ReadUIInfo() {
			this.panel.pos(this.scene.width / 2, .25 * this.scene.height), this.textTips = this.panel.getChildByName("Text")
		}
		_Show(t) {
			this.textTips.text = t, Laya.stage.addChild(this.panel), Pt.instance.Shake(this.panel, .05), Laya.timer.once(1e3, this, this.ShakeHide, null, !0)
		}
		ShakeHide() {
			let t = this;
			Pt.instance.ShakeHide(this.panel, function() {
				t.Hide()
			})
		}
	}
	class Ae extends oe {
		constructor() {
			super(), this._repair_Skill = !1, this._repairTimeInterval = 20, this._roomindex = 0, this._isShow = !1, this._repair_Skill = !1, this._repairTimeInterval = 20, this._roomindex = 0, this._isShow = !1, this.path = "Prefabs/SkillUI.json", this.zOrder = 10
		}
		ReadUIInfo() {
			this.panel.width = 1, this._skill_repair = this.panel.getChildByName("skill1"), this._skill_repair.getChildByName("pic").skin = "UI/" + yi.instance.getPicture() + "/weixiu.png", this._repair_mask = this._skill_repair.getChildByName("mask_skill1"), this._repair_mask_m = this._skill_repair.addChild(new Laya.Sprite), this._repair_mask_m.pos(0, 0), this._repair_mask_m.size(84, 84), this._repair_mask_m.addChild(this._repair_mask), this._repair_mask_m.mask = this._repair_mask, this._repair_mask.visible = !1, this._skill_repair.on(Laya.Event.CLICK, this, this.Repair_Click), this._skill_player = this.panel.getChildByName("skill2"), this.AddEvent()
		}
		AddEvent() {
			ot.instance.AddListEvent(ot.instance.SKILL_ADDUPEVENT, this.AddUpEvent, this)
		}
		Init() {
			this._isShow = !1, this.HideSkill(), this._repairTime = 0, this._repair_Skill = !1, this._repair_mask_m.graphics.clear()
		}
		AddUpEvent() {
			this._isShow = !0, rt.instance.AddTimeLoopEvent("SkillUIUpEvent", this.UpEvent, this, .02), this.ShowSkill()
		}
		UpEvent() {
			this._repair_Skill && this.Darw(this._skill_repair, this._repair_mask_m, this._repairTime, this._repairTimeInterval)
		}
		Darw(t, e, i, s) {
			let n = rt.instance.AfterAPeriodOfTime_Proportion(i, s);
			e.graphics.clear(), 1 == n ? (i = 0, this._repair_Skill = !1) : e.graphics.drawPie(42, 42, 60, 0, 360 * (1 - n), 360, "#000000")
		}
		Repair_Click() {
			this._repair_Skill || (this._repairTime = rt.instance.gameTime, this._repair_Skill = !0, this._repair_mask_m.graphics.clear(), ot.instance.Fire(ot.instance.BUILD_SKILLEVENT, this._roomindex, 0), Pt.instance.Shake(this._skill_repair, .2))
		}
		set roomIndex(t) {
			this._roomindex = t
		}
		HideSkill() {
			Pt.instance.Hide(this._skill_repair), Pt.instance.Hide(this._skill_player)
		}
		ShowSkill() {
			this._isShow && Pt.instance.Show(this._skill_repair)
		}
		SkillPlayerClickEvent() {
			this._skill_player_func && this._skill_player_func()
		}
		DoubleGlod1() {}
		InvincibleDoor() {}
		DounbleAttackSpeed() {}
		AwayTroll() {}
		DoubleGold2() {}
	}
	class Se extends oe {
		constructor() {
			super(), this._bgHeight = 100, this._buttonHeight = 134, this.advArr = {}, this._shopBtnArr = [], this._bgHeight = 100, this._buttonHeight = 144, this.advArr = {}, this.path = "Prefabs/ShopUI.json", this.zOrder = 20
		}
		ReadUIInfo() {
			this.panel.width = this.scene.width, this.panel.height = this.scene.height, this.panel.pivot(this.panel.width / 2, this.panel.height / 2), this.panel.pos(this.panel.pivotX, this.panel.pivotY), this._shopBtnArr = [], this._shop = this.panel.getChildByName("menu"), this._select = this._shop.getChildByName("select"), this._build = this._shop.getChildByName("build"), this._closeBtn = this._shop.getChildByName("close"), this._closeBtn.skin = "UI/" + yi.instance.getPicture() + "/close.png", this._gold = this._shop.getChildByName("gold"), this._shop.getChildByName("tt").skin = "UI/" + yi.instance.getPicture() + "/shop_1.png", this._select.getChildAt(0).getChildByName("text").text = yi.instance.getLanguage("67"), this._select.getChildAt(1).getChildByName("text").text = yi.instance.getLanguage("68"), this._select.getChildAt(2).getChildByName("text").text = yi.instance.getLanguage("69"), this._closeBtn.on(Laya.Event.CLICK, this, this.Close), this._shopPrefabs = Laya.loader.getRes("Prefabs/ShopMenu.json"), this.SelectInit()
		}
		SelectInit() {
			if (this._select.numChildren > 0) {
				let t = [];
				for (let e = 0; e < this._select.numChildren; e++) {
					let i = this._select.getChildAt(e);
					i.on(Laya.Event.CLICK, this, this.SelectClickEvent, [e]), t.push(i)
				}
				t.push(this._closeBtn), Pt.instance.AddBtnEvent(t)
			}
		}
		ShowShopMenu() {
			if (this._build.numChildren > 0) {
				this._build.height = this._build.numChildren * this._buttonHeight, this._shop.height = this._build.height + this._bgHeight;
				for (let t = 0; t < this._build.numChildren; t++) {
					let e = this._build.getChildAt(t);
					e.scale(0, 0), Laya.Tween.to(e, {
						x: 246.5,
						y: t * this._buttonHeight + 74,
						scaleX: 1,
						scaleY: 1
					}, 200, null, null, 100 * t, !0)
				}
			}
		}
		SelectClickEvent(t) {
			this.ClearBuild(), this.selectTSkin(t);
			let e = di.instance.build.GetShopData(t);
			for (let t = 0; t < e.length; t++) {
				let i = e[t];
				this.SetShopBtnInfo(i)
			}
			this.ShowShopMenu()
		}
		selectTSkin(t) {
			if (this._select.numChildren > 0)
				for (let e = 0; e < this._select.numChildren; e++) {
					let i = this._select.getChildAt(e);
					t == e ? (i.skin = "shop_n/shop_5.png", i.getChildAt(0).color = "#548f87") : (i.skin = "shop_n/shop_6.png", i.getChildAt(0).color = "#ffffff")
				}
		}
		ShopBtnEvent(...t) {
			let e = t[0].split("_")[0],
				i = t[1];
			console.info("str: ", e);
			let s = di.instance.build.GetShopBuildMoney(e),
				n = di.instance.player.isVip ? s[1] / 2 : s[1];
			di.instance.player.gold >= n ? (di.instance.player.gold -= n, di.instance.player.ModifiedBuileprintQuantity(e, 1), i.text = di.instance.player.GetBuileprintNum(e), this._gold.text = di.instance.player.gold.toString(), ot.instance.Fire(ot.instance.UIGM_TIPS, yi.instance.getLanguage("196"))) : ot.instance.Fire(ot.instance.UIGM_SHOW, oe.strArr.CreditUI)
		}
		ShopBtnEvent_ADV(...t) {
			let e = t[0].split("_")[0],
				i = t[1];
			yi.instance.showVideo(() => {
				di.instance.player.ModifiedBuileprintQuantity(e, 1), i.text = di.instance.player.GetBuileprintNum(e)
			})
		}
		getAdvNum(t) {
			let e = this.advArr[t];
			return e || (this.advArr[t] = 0, this.advArr[t])
		}
		setAdvNum(t) {
			this.advArr[t] = di.instance.player.DZCount
		}
		SetShopBtnInfo(t) {
			let e = t.split("_"),
				i = e[0],
				s = parseInt(e[1]),
				n = this.shopBtn,
				a = di.instance.build.GetShopBuildMoney(i),
				l = di.instance.build.GetIntroduce(i, 1),
				o = di.instance.player.GetBuileprintNum(i),
				h = n.getChildByName("btn"),
				r = h.getChildByName("goldText1"),
				_ = n.getChildByName("name"),
				d = n.getChildByName("count"),
				c = n.getChildByName("introduce"),
				u = n.getChildByName("buildImg"),
				p = n.getChildByName("subBuildImg"),
				g = h.getChildByName("adv");
			n.getChildByName("has").text = yi.instance.getLanguage("212"), h.getChildByName("adv").text = yi.instance.getLanguage("15"), u.skin = "build/" + i + "_1.png";
			let m = di.instance.build.GetSubSkin(i);
			null == m ? p.visible = !1 : (p.visible = !0, p.skin = m), _.text = a[0], r.text = a[1].toString(), c.text = l, d.text = o, 1 == s ? (r.visible = !0, r.getChildByName("vip").visible = di.instance.player.isVip, g.visible = !1, di.instance.player.gold >= a[1] ? (h.skin = "shop_n/menuBtn.png", r.color = "#ffffff") : (h.skin = "shop_n/menuBtnNo.png", r.color = "#ffffff"), h.on(Laya.Event.CLICK, this, this.ShopBtnEvent, [t, d])) : (r.visible = !1, g.visible = !0, h.on(Laya.Event.CLICK, this, this.ShopBtnEvent_ADV, [t, d])), this._build.addChild(n), Pt.instance.AddBtnEvent([h])
		}
		get shopBtn() {
			let t;
			return this._shopBtnArr.length > 0 ? ((t = this._shopBtnArr.shift()).visible = !0, t) : ((t = new Laya.View).createView(this._shopPrefabs), t)
		}
		ClearBuild() {
			if (this._build.numChildren > 0)
				for (let t = this._build.numChildren - 1; t >= 0; t--) {
					let e = this._build.getChildAt(t);
					e.removeSelf(), e.visible = !1, e.getChildByName("btn").offAll(), this._shopBtnArr.push(e), Pt.instance.RemoveBtnEvent([e])
				}
		}
		_Show(...t) {
			this.panel.alpha = 1, this.SelectClickEvent(0), this._gold.text = di.instance.player.gold.toString(), yi.instance.showBanner()
		}
		_Hide(...t) {
			this.ClearBuild(), this.panel.scale(1, 1), yi.instance.hideBanner()
		}
		Close() {
			Laya.Tween.to(this.panel, {
				scaleX: .1,
				scaleY: .1,
				alpha: 0
			}, 300, null, Laya.Handler.create(this, () => {
				this.Hide()
			}), 0, !0)
		}
	}
	class ve extends oe {
		constructor() {
			super(), this.path = "Prefabs/TreasureChestUI.json", this.zOrder = 11
		}
		ReadUIInfo() {
			this.imgArr = new Array, this.useImgArr = new Array, this.panel.width = this.scene.width, this.panel.height = this.scene.height, this.closeBtn = this.panel.getChildByName("closeBtn"), this.advBtn = this.panel.getChildByName("advBtn"), this.tcEffct = this.panel.getChildByName("tceffect"), this.tcText = this.panel.getChildByName("tcText"), this.tcText.getChildAt(0).skin = "UI/" + yi.instance.getPicture() + "/box_8.png", this.qq = this.panel.getChildByName("qq"), this.box = this.panel.getChildByName("box"), this.qq.visible = !1, this.qq.zOrder = -2, this.advBtn.getChildByName("pic").skin = "UI/" + yi.instance.getPicture() + "/box_4.png", this.closeBtn.skin = "UI/" + yi.instance.getPicture() + "/box_4.png", this.advBtn.on(Laya.Event.CLICK, this, this.ADVClickEvent), this.closeBtn.on(Laya.Event.CLICK, this, this.CloseBtnClickEvent), Pt.instance.AddBtnEvent([this.closeBtn]), this.tc = new Laya.Animation, this.tc.zOrder = -1, this.panel.addChild(this.tc), this.tc.x = this.scene.width / 2, this.tc.y = this.scene.height / 2, this.tc.gotoAndStop(0)
		}
		Init() {}
		_Hide(...t) {
			this.qq.visible = !1, this.qq.rotation = 0, this.tcText.visible = !1, this.advBtn.visible = !1, this.advBtn.rotation = 0, this.advBtn.scale(1, 1), this.closeBtn.visible = !1, this.ClearImg()
		}
		_Show(...t) {
			this.box.skin = "taAnim/tc_0.png", this.qq.visible = !0, this.qq.alpha = 0, this.tcText.visible = !0, this.tcText.alpha = 0, this.advBtn.visible = !0, this.advBtn.alpha = 0, this.closeBtn.visible = !0, this.closeBtn.alpha = 0, this.tc.gotoAndStop(0), this.tc.y = -this.tc.getBounds().height, this.TcEffectInit(), this.Start()
		}
		Start() {
			this.box.y = 180, Laya.Tween.to(this.box, {
				y: .44 * this.scene.height
			}, 1500, Laya.Ease.expoIn, Laya.Handler.create(this, () => {}), 0, !0, !0), Laya.Tween.to(this.tc, {
				y: .4 * this.scene.height
			}, 1e3, Laya.Ease.circIn, Laya.Handler.create(this, () => {
				this.TcEffectInit(), this.tc.play(0, !1, "dd"), this.tcText.y = .2 * this.scene.height, this.advBtn.y = this.tc.y + 2 * this.advBtn.height + (Z.isX() ? 100 : 0), this.closeBtn.y = this.advBtn.y + this.advBtn.height / 2 + 1.2 * this.closeBtn.height, Pt.instance.Alpha(this.advBtn, .4), Pt.instance.Alpha(this.closeBtn, .4), Pt.instance.Alpha(this.tcText, .05), Pt.instance.ADVEffect(this.advBtn, 0), this.TcEffect()
			}), 0, !0)
		}
		TcEffectInit() {}
		TcEffect(t = 0) {}
		ADVClickEvent() {
			yi.instance.showVideo(() => {
				_t.instance.PlaySound(_t.instance.Other_sound.tcOpen), this.TcEffectInit(), this.MoveDown(this.tc, this.advBtn.y, 1, 600, () => {
					Laya.Tween.to(this.box, {
						rotation: 15
					}, 200, null, Laya.Handler.create(this, () => {
						Laya.Tween.to(this.box, {
							rotation: -15
						}, 200, null, Laya.Handler.create(this, () => {
							Laya.Tween.to(this.box, {
								rotation: 10
							}, 150, null, Laya.Handler.create(this, () => {
								Laya.Tween.to(this.box, {
									rotation: -10
								}, 150, null, Laya.Handler.create(this, () => {
									Laya.Tween.to(this.box, {
										rotation: 0
									}, 110, null, Laya.Handler.create(this, () => {
										this.box.skin = "taAnim/tc_2.png", this.open()
									}))
								}))
							}))
						}))
					}))
				}), this.advBtn.visible = !1, this.qq.visible = !1, this.box.skin = "taAnim/tc_1.png", this.MoveDown(this.closeBtn, this.closeBtn.y + this.closeBtn.height, 0, 200, () => {
					this.closeBtn.visible = !1
				})
			})
		}
		open() {
			this.tc.play(0, !0, "openLoop"), this.tc.offAll(), this.OpenOver()
		}
		MoveDown(t, e, i, s, n = null) {
			t && Laya.Tween.to(t, {
				y: e,
				alpha: i
			}, s, null, Laya.Handler.create(this, () => {
				n && n()
			}), 0, !0)
		}
		OpenOver() {
			let t = di.instance.cdn.tcArr;
			if (t) {
				let e = 100,
					i = 20,
					s = this.tc.y - this.box.height / 2 - 250;
				for (let n = 0; n < t.length; n++) {
					let a = t[n].split("_");
					di.instance.player.ModifiedBuileprintQuantity(a[0], 1);
					let l = this.img,
						o = l.getChildAt(0);
					l.skin = "build/" + t[n] + ".png";
					let h = di.instance.build.GetSubSkin(a[0]);
					h ? (o.skin = h, o.visible = !0) : o.visible = !1;
					let r = n % 5,
						_ = e + (l.width + i) * r,
						d = s + Math.floor(n / 5) * (l.height + 20);
					Laya.Tween.to(l, {
						x: _,
						y: d,
						alpha: 1,
						scaleX: 1,
						scaleY: 1
					}, 300 * n, Laya.Ease.bounceIn, null, 0, !0)
				}
			}
			this.closeBtn.visible = !0, Pt.instance.Alpha(this.closeBtn, .5, 1), this.closeBtn.y = this.tc.y + this.tc.getBounds().height
		}
		ClearImg() {
			if (this.useImgArr.length > 0) {
				for (let t = 0; t < this.useImgArr.length; t++) {
					let e = this.useImgArr[t];
					e.removeSelf(), this.imgArr.push(e)
				}
				this.useImgArr.length = 0
			}
		}
		get img() {
			let t;
			if (this.imgArr.length > 0) t = this.imgArr.shift();
			else {
				let e = new Laya.Image;
				(t = new Laya.Image).width = 90, t.height = 90, t.pivot(45, 45), e.width = 90, e.height = 90, e.pivot(45, 45), t.addChild(e), e.pos(45, 45)
			}
			return t.scale(0, 0), t.alpha = 0, this.panel.addChild(t), t.pos(this.tc.x, this.tc.y - 90), this.useImgArr.push(t), t
		}
		CloseBtnClickEvent() {
			this.Hide(), Laya.timer.once(1e3, this, () => {
				Laya.timer.clearAll(this)
			})
		}
	}
	class Te extends oe {
		constructor() {
			super(), this._cd_crazy = 45, this._timer_crazy = 0, this._cd_shield = 45, this._timer_shield = 0, this.path = "Prefabs/TrollSkillUI.json", this.zOrder = 99, this._cd_crazy = 45, this._timer_crazy = null, this._cd_shield = 45, this._timer_shield = null
		}
		ReadUIInfo() {
			this.btn_crazy = this.panel.getChildByName("btn_crazy"), this.video_crazy = this.btn_crazy.getChildByName("video"), this.mask_crazy_m = this.btn_crazy.addChild(new Laya.Sprite), this.mask_crazy_m.pos(0, 0), this.mask_crazy_m.size(84, 84), this.video_crazy.visible = !1, this.mask_crazy = this.btn_crazy.getChildByName("mask_crazy"), this.mask_crazy_m.addChild(this.mask_crazy), this.mask_crazy_m.mask = this.mask_crazy, this.mask_crazy.visible = !1, this.btn_crazy.on(Laya.Event.CLICK, this, this.onBtnCrazy), this.btn_shield = this.panel.getChildByName("btn_shield"), this.video_shield = this.btn_shield.getChildByName("video"), this.mask_shield_m = this.btn_shield.addChild(new Laya.Sprite), this.mask_shield_m.pos(0, 0), this.mask_shield_m.size(84, 84), this.video_shield.visible = !1, this.btn_crazy.getChildByName("pic").skin = "UI/" + yi.instance.getPicture() + "/jn3.png", this.btn_shield.getChildByName("pic").skin = "UI/" + yi.instance.getPicture() + "/jn4.png", this.mask_shield = this.btn_shield.getChildByName("mask_shield"), this.mask_shield_m.addChild(this.mask_shield), this.mask_shield_m.mask = this.mask_shield, this.mask_shield.visible = !1, this.btn_shield.on(Laya.Event.CLICK, this, this.onBtnShield), this.AddEvent()
		}
		AddEvent() {
			ot.instance.AddListEvent(ot.instance.TROLLSKILL_ADDUPEVENT, this.AddUpEvent, this)
		}
		Init() {
			this._timer_crazy = null, this._timer_shield = null, this.HideSkill()
		}
		AddUpEvent() {
			rt.instance.AddTimeLoopEvent("TrollSkillUIUpEvent", this.UpEvent, this, .02), this.ShowSkill()
		}
		UpEvent() {
			if (this.mask_crazy_m.graphics.clear(), this.mask_shield_m.graphics.clear(), null != this._timer_crazy) {
				let t = rt.instance.AfterAPeriodOfTime_Proportion(this._timer_crazy, this._cd_crazy);
				1 == t ? (this._timer_crazy = null, this.video_crazy.visible = !1) : this.mask_crazy_m.graphics.drawPie(42, 42, 60, 360 * t - 90, 270, "#000000")
			}
			if (null != this._timer_shield) {
				let t = rt.instance.AfterAPeriodOfTime_Proportion(this._timer_shield, this._cd_shield);
				1 == t ? (this._timer_shield = null, this.video_shield.visible = !1) : this.mask_shield_m.graphics.drawPie(42, 42, 60, 360 * t - 90, 270, "#000000")
			}
		}
		HideSkill() {}
		ShowSkill() {}
		SkillPlayerClickEvent() {}
		DoubleGlod1() {}
		InvincibleDoor() {}
		DounbleAttackSpeed() {}
		AwayTroll() {}
		DoubleGold2() {}
		onBtnCrazy() {
			null != this._timer_crazy ? 1 == rt.instance.AfterAPeriodOfTime_Proportion(this._timer_crazy, 5) && yi.instance.showVideo(() => {
				Pt.instance.Shake(this.btn_crazy, .2), this._timer_crazy = rt.instance.gameTime, de.instance.trollSprict.Rage_on(5), yi.instance.clickData && yi.instance.clickData.FunctionVideo ? this.video_crazy.visible = !1 : this.video_crazy.visible = !0
			}) : (Pt.instance.Shake(this.btn_crazy, .2), this._timer_crazy = rt.instance.gameTime, de.instance.trollSprict.Rage_on(5), yi.instance.clickData && yi.instance.clickData.FunctionVideo ? this.video_crazy.visible = !1 : this.video_crazy.visible = !0)
		}
		onBtnShield() {
			null != this._timer_shield ? 1 == rt.instance.AfterAPeriodOfTime_Proportion(this._timer_shield, 5) && yi.instance.showVideo(() => {
				Pt.instance.Shake(this.btn_shield, .2), this._timer_shield = rt.instance.gameTime, de.instance.trollSprict.Shiled_on(5), yi.instance.clickData && yi.instance.clickData.FunctionVideo ? this.video_shield.visible = !1 : this.video_shield.visible = !0
			}) : (Pt.instance.Shake(this.btn_shield, .2), this._timer_shield = rt.instance.gameTime, de.instance.trollSprict.Shiled_on(5), yi.instance.clickData && yi.instance.clickData.FunctionVideo ? this.video_shield.visible = !1 : this.video_shield.visible = !0)
		}
	}
	class Le extends oe {
		constructor() {
			super(), this._bgHeight = 100, this._buttonHeight = 134, this.path = "Prefabs/CreditUI.json", this.zOrder = 25, this.isBuying = !1, this.payList = [], this.postNum = 0, this.money_List = [{
				id: 0,
				coin: 20,
				item_id: 1802068
			}, {
				id: 1,
				coin: 100,
				item_id: 1802072
			}, {
				id: 2,
				coin: 200,
				item_id: 1802077
			}, {
				id: 3,
				coin: 500,
				item_id: 1802087
			}, {
				id: 4,
				coin: 1e3,
				item_id: 1802091
			}]
		}
		ReadUIInfo() {
			var t = [];
			this.panel.width = this.scene.width, this.panel.height = this.scene.height, this.panel.pivot(this.panel.width / 2, this.panel.height / 2), this.panel.pos(this.panel.pivotX, this.panel.pivotY), this._bg = this.panel.getChildByName("bg"), this._goldBtn = this._bg.getChildByName("goldBtn"), this._vipBtn = this._bg.getChildByName("vipBtn"), this._vipBg = this._bg.getChildByName("vipBg"), this._goldBg = this._bg.getChildByName("goldBg"), this._closeBtn = this._bg.getChildByName("closeBtn"), this._closeBtn.on(Laya.Event.CLICK, this, this.Close), this._goldBtn.on(Laya.Event.CLICK, this, this.goldClick), this._vipBtn.on(Laya.Event.CLICK, this, this.vipClick);
			for (let e = 0; e < this._goldBg.numChildren; e++) {
				let i = this._goldBg.getChildByName("g" + (e + 1)).getChildByName("buy");
				i.on(Laya.Event.CLICK, this, function() {
					if (this.isBuying) return ot.instance.Fire(ot.instance.UIGM_TIPS, yi.instance.getLanguage("214"));
					this.isBuying = !0, this.onBuyGoldClick(e)
				}), t.push(i)
			}
			let e = this._vipBg.getChildByName("g1").getChildByName("buy");
			e.on(Laya.Event.CLICK, this, function() {
				if (this.isBuying) return ot.instance.Fire(ot.instance.UIGM_TIPS, yi.instance.getLanguage("214"));
				this.isBuying = !0, this.onBuyVipClick()
			}), t.push(this._closeBtn), t.push(this._goldBtn), t.push(this._vipBtn), t.push(e), Pt.instance.AddBtnEvent(t)
		}
		_Show(...t) {
			yi.instance.showBanner(), this.panel.alpha = 1, this.panel.zOrder = 1e4, this.changePage(1)
		}
		_Hide(...t) {
			yi.instance.hideBanner(), this.panel.scale(1, 1)
		}
		goldClick() {
			this.changePage(1)
		}
		vipClick() {
			this.changePage(2)
		}
		onBuyGoldClick(t) {
			this.money_List[t].item_id;
			let e = this.money_List[t].coin,
				i = "https://auroth.cn/api/apps/hg_pay_callback?transaction_game=" + ("BuyGoldId" + String(Math.random()).slice(2, 18));
			Laya.LocalStorage.setItem(yi.instance.localPayInfo, JSON.stringify({
				url: i,
				num: e
			})), this.postNum = 0, this.payList.push([i, e]), Laya.timer.loop(3e3, this, this.loopIsPaySuccess)
		}
		fail() {
			this.postNum >= 40 && (this.isBuying = !1, this.payList.pop(), Laya.LocalStorage.setItem(yi.instance.localPayInfo, null), Laya.timer.clearAll(this))
		}
		loopIsPaySuccess() {
			if (0 == this.payList.length) return void Laya.timer.clearAll(this);
			let t = this.payList[this.payList.length - 1];
			this.postNum++, yi.instance.send(t[0]).then(function(e) {
				(200 == e.code || this.postNum >= 100) && (this.postNum = 0, yi.instance.paySuccess(t[1]), this.isBuying = !1, this.payList.pop(), 0 == this.payList.length && Laya.timer.clearAll(this))
			}.bind(this))
		}
		onBuyVipClick() {
			let t = "https://auroth.cn/api/apps/hg_pay_callback?transaction_game=" + ("BuyVipId" + String(Math.random()).slice(2, 18));
			Laya.LocalStorage.setItem(yi.instance.localPayInfo, JSON.stringify({
				url: t,
				num: -1
			})), this.postNum = 0, this.payList.push([t, -1]), Laya.timer.loop(3e3, this, this.loopIsPaySuccess)
		}
		changePage(t) {
			this.tabNum = t, this._vipBg.visible = 2 == t, this._goldBg.visible = 1 == t;
			let e = yi.instance.getPicture(),
				i = "UI/CreditUI";
			e && (i = "UI/" + e), this._goldBtn.skin = 1 == t ? i + "/14.png" : i + "/13.png", this._vipBtn.skin = 1 == t ? i + "/16.png" : i + "/17.png"
		}
		Close() {
			Laya.Tween.to(this.panel, {
				scaleX: .1,
				scaleY: .1,
				alpha: 0
			}, 300, null, Laya.Handler.create(this, () => {
				this.Hide()
			}), 0, !0)
		}
	}
	class Ee {
		constructor() {
			this.script = {
				battleUI: null,
				startGameUI: null,
				gameOverUI: null,
				macthingUI: null,
				tipsUI: null,
				skillUI: null,
				shopUI: null,
				treasureChestUI: null,
				trollSkillUI: null,
				CreditUI: null
			}, Ee._ins = this, this.ReadUIInfo(), this.AddEvent()
		}
		static get instance() {
			return this._ins
		}
		AddEvent() {
			ot.instance.AddListEvent(ot.instance.UIGM_SHOW, this.Show, this), ot.instance.AddListEvent(ot.instance.UIGM_HIDE, this.Hide, this), ot.instance.AddListEvent(ot.instance.UIGM_TIPS, this.Tips, this), ot.instance.AddListEvent(ot.instance.UIGM_HIDESKILL, this.HideSkill, this), ot.instance.AddListEvent(ot.instance.UIGM_SHOWSKILL, this.ShowSkill, this), ot.instance.AddListEvent(ot.instance.UIGM_PLAYERHIT, this.PlayerHit, this), ot.instance.AddListEvent(ot.instance.UIGM_PLAYERHITEFFECT, this.playerHitEffect, this)
		}
		ReadUIInfo() {
			this.script.battleUI = new ce, this.script.gameOverUI = new ue, this.script.macthingUI = new fe, this.script.startGameUI = new ye, this.script.tipsUI = new be, this.script.skillUI = new Ae, this.script.shopUI = new Se, this.script.CreditUI = new Le, this.script.treasureChestUI = new ve, this.script.trollSkillUI = new Te
		}
		Init() {
			this.script.battleUI.Init()
		}
		LoadOne() {
			Laya.loader.load([this.script.startGameUI.path_Str, this.script.battleUI.path_Str, this.script.gameOverUI.path_Str, this.script.macthingUI.path_Str, this.script.tipsUI.path_Str, this.script.skillUI.path_Str, this.script.shopUI.path_Str, this.script.CreditUI.path_Str, this.script.treasureChestUI.path_Str, this.script.trollSkillUI.path_Str], Laya.Handler.create(this, this.LoadOneClass))
		}
		LoadOneClass() {
			this.script.startGameUI.LoadPanel(!0), this.script.battleUI.LoadPanel(), this.script.gameOverUI.LoadPanel(), this.script.macthingUI.LoadPanel(), this.script.tipsUI.LoadPanel(), this.script.skillUI.LoadPanel(), this.script.shopUI.LoadPanel(), this.script.CreditUI.LoadPanel(), this.script.treasureChestUI.LoadPanel(), this.script.trollSkillUI.LoadPanel()
		}
		AddUpData() {}
		StartGame() {
			this.script.battleUI.AddUpData(), this.script.battleUI.Init(), this.script.skillUI.Init(), this.script.battleUI.Show(), this.script.trollSkillUI.Init()
		}
		GameMove(t) {
			this.script.battleUI.Hide(), this.script.skillUI.Hide(), this.script.trollSkillUI.Hide(), t ? this.script.startGameUI.Show() : this.script.gameOverUI.Show()
		}
		Show(t) {
			let e = this.script[t];
			return null != e && (e.Show(), !0)
		}
		Hide(t) {
			let e = this.script[t];
			return null != e && (e.Hide(), !0)
		}
		Tips(t) {
			this.script.tipsUI.Show(t)
		}
		set SkillRoomindex(t) {
			this.script.skillUI.roomIndex = t, this.script.skillUI.Show()
		}
		ShowSkill() {
			ni.Model == Lt.HumanModel ? this.script.skillUI.ShowSkill() : ni.Model == Lt.TrollModel && this.script.trollSkillUI.Show()
		}
		HideSkill() {
			ni.Model == Lt.HumanModel ? this.script.skillUI.HideSkill() : ni.Model == Lt.TrollModel && this.script.trollSkillUI.HideSkill()
		}
		PlayerHit(t) {
			ni.Model == Lt.HumanModel ? this.script.battleUI.playerHit(t - 1) : ni.Model == Lt.TrollModel && this.script.battleUI.playerHit(t)
		}
		playerHitEffect(t) {
			ni.Model == Lt.HumanModel ? this.script.battleUI.playerHitEffect(t - 1) : ni.Model == Lt.TrollModel && this.script.battleUI.playerHitEffect(t)
		}
	}
	class Ce {
		constructor() {
			this._offEventHandle = null, this._block = null, this._offEventHandle = null, this._block = null, this.AddEvent()
		}
		get player() {
			return Qt.instance.player
		}
		get troll() {
			return de.instance.trollSprict
		}
		AddEvent() {
			ot.instance.AddListEvent(ot.instance.PLOGIC_OFFEVENTHANDLE, this.OffEventHandle, this), ot.instance.AddListEvent(ot.instance.PLOGIC_TESTAROUNDBLOCK, this.TestAroundBlock, this)
		}
		PlayerMove(t, e) {
			if (0 == t && 0 == e) return;
			let i = 0,
				s = 0;
			t > 0 ? i = 1 : t < 0 && (i = -1), e > 0 ? s = 1 : e < 0 && (s = -1), this.player.player.zOrder = this.player.y, 0 != i && (this.player.direction = i);
			let n = ot.instance.FireReturn(ot.instance.MGM_PROTAGONIST_MOVE, this.player.x, this.player.y, i, s);
			if (null != n.x) {
				Math.abs(this.player.x - n.x) <= 60 && (t = 0)
			}
			if (null != n.y) {
				Math.abs(this.player.y - n.y) <= 60 && (e = 0)
			}
			ae.instance.OperationMovement(this.player.player, t * this.player.speed, e * this.player.speed)
		}
		TrollMove(t, e) {
			if (0 == t && 0 == e) return;
			let i = 0,
				s = 0;
			t > 0 ? i = 1 : t < 0 && (i = -1), e > 0 ? s = 1 : e < 0 && (s = -1), this.troll.troll.zOrder = this.troll.y, 0 != i && (this.troll.direction = i);
			let n = ot.instance.FireReturn(ot.instance.MGM_PROTAGONIST_MOVE, this.troll.x, this.troll.y, i, s);
			if (null != n.x) {
				Math.abs(this.troll.x - n.x) <= 60 && (t = 0)
			}
			if (null != n.y) {
				Math.abs(this.troll.y - n.y) <= 60 && (e = 0)
			}
			ae.instance.OperationMovement(this.troll.troll, t * this.troll.speed, e * this.troll.speed)
		}
		TestAroundBlock() {
			ni.Model == Lt.HumanModel ? this.TestAroundBlock_Human() : ni.Model == Lt.TrollModel && this.TestAroundBlock_Troll()
		}
		TestAroundBlock_Human() {
			this.player.curRoom = ot.instance.FireReturn(ot.instance.MGM_GET_BLOCKFINDROOM, this.player.x, this.player.y);
			let t = ot.instance.FireReturn(ot.instance.MGM_MONTIORPLAYERAROUND, this.player.x, this.player.y);
			if (null == t) return this._block = null, this._offEventHandle = null, void ot.instance.Fire(ot.instance.OFF_HIDE_MENU);
			if (-1 == this.player.curRoom) return void ot.instance.Fire(ot.instance.OFF_HIDE_MENU);
			this._block = t.block;
			let e = {
					x: null,
					y: null
				},
				i = this._block.x - this.player.x,
				s = this._block.y - this.player.y;
			Math.abs(i) > Math.abs(s) ? (e.x = i > 0 ? this._block.x + 90 : this._block.x - 90, e.y = this._block.y) : (e.y = s > 0 ? this._block.y + 90 : this._block.y - 90, e.x = this._block.x), e = ot.instance.FireReturn(ot.instance.MGM_GET_MAPPOSTSCENEPOS, e.x, e.y), "door" == t.build ? t.block.isOpen ? (this._offEventHandle = this.OffDoor, ot.instance.Fire(ot.instance.OFF_SHOW_MENU, "closeDoor", {
				x: e[0],
				y: e[1]
			}, t.block)) : (this._offEventHandle = this.OpenDoor, ot.instance.Fire(ot.instance.OFF_SHOW_MENU, "openDoor", {
				x: e[0],
				y: e[1]
			}, t.block)) : "bed" == t.build && (null != this.player.bed ? (this._offEventHandle = this.DownBen, ot.instance.Fire(ot.instance.OFF_SHOW_MENU, "upBed", {
				x: e[0],
				y: e[1]
			}, t.block)) : (this._offEventHandle = this.UpBed, t.block.isOpen || ot.instance.Fire(ot.instance.OFF_SHOW_MENU, "upBed", {
				x: e[0],
				y: e[1]
			}, t.block)))
		}
		TestAroundBlock_Troll() {
			ot.instance.FireReturn(ot.instance.TL_TROLL_SAFE);
			let t = ot.instance.FireReturn(ot.instance.MGM_MONTIORPLAYERAROUND, this.troll.x, this.troll.y);
			if (null != t) {
				let e = {
						x: null,
						y: null
					},
					i = t.block.x - this.troll.x,
					s = t.block.y - this.troll.y;
				return Math.abs(i) > Math.abs(s) ? (e.x = i > 0 ? t.block.x + 90 : t.block.x - 90, e.y = t.block.y) : (e.y = s > 0 ? t.block.y + 90 : t.block.y - 90, e.x = t.block.x), e = ot.instance.FireReturn(ot.instance.MGM_GET_MAPPOSTSCENEPOS, e.x, e.y), void("door" == t.build ? t.block.isOpen || ot.instance.Fire(ot.instance.TL_STARTATTACK, t.block) : "bed" == t.build && ot.instance.Fire(ot.instance.TL_STARTATTACK, t.block))
			}
			let e = ot.instance.FireReturn(ot.instance.MGM_AIORTROLLIS_MOVE, this.troll.x, this.troll.y);
			e ? ot.instance.Fire(ot.instance.TL_STARTATTACK, e) : ot.instance.Fire(ot.instance.TL_TROLLMOVE)
		}
		OffEventHandle() {
			this._offEventHandle(this._block)
		}
		UpBed(t) {
			this.player.player.visible = !1, this.player.player.stop(), this.player.roomIndex = t.room.roomIndex, this.player.curRoom = t.room.roomIndex, this.player.bed = t, _t.instance.AddUpSound(t.room), ot.instance.Fire(ot.instance.BUILD_GOTOBED, t, this.player.id, !0, 0 == this.player.uid), ot.instance.Fire(ot.instance.OINPUT_Event_ON), this._offEventHandle = this.DownBen, ot.instance.Fire(ot.instance.OFF_SHOW_MENU, "upBed"), ot.instance.Fire(ot.instance.OFF_HIDE_MENU), ot.instance.Fire(ot.instance.PAIL_KILLPLAYER, t), Ee.instance.SkillRoomindex = this.player.roomIndex, ie.instance.goBed(this.player)
		}
		DownBen(t) {
			t.isOpen ? ot.instance.Fire(ot.instance.UIGM_TIPS, yi.instance.getLanguage("182")) : (this.player.player.visible = !0, this.player.player.play(0, !0), t.build.skin = "build/bed_1.png", t.isOpen = !1, this.player.bed = null, ot.instance.Fire(ot.instance.OINPUT_Event_RS_ON), this._offEventHandle = this.UpBed, ot.instance.Fire(ot.instance.OFF_SHOW_MENU, "upBed"))
		}
		OpenDoor(t) {
			t.OpenDoor(), ot.instance.Fire(ot.instance.MGM_SET_BLOCKDYNWALKABLE, t.x, t.y, t.isOpen), this._offEventHandle = this.OffDoor, ot.instance.Fire(ot.instance.OFF_SHOW_MENU, "closeDoor"), rt.instance.AddTimeOnceEvent("closeDoor", () => {
				this.OffDoor(t)
			}, this, 1.5)
		}
		OffDoor(t) {
			t.CloseDoor(), ot.instance.Fire(ot.instance.MGM_SET_BLOCKDYNWALKABLE, t.x, t.y, t.isOpen), this._offEventHandle = this.OpenDoor, ot.instance.Fire(ot.instance.OFF_SHOW_MENU, "openDoor")
		}
		GameOver() {
			this._block = null, this._offEventHandle = null
		}
	}! function(t) {
		t[t.Slide = 0] = "Slide", t[t.RS = 1] = "RS"
	}(yt || (yt = {}));
	class Me {
		constructor() {
			this._clickDownPos = {
				x: 0,
				y: 0
			}, this._clickMoveStartPos = {
				x: 0,
				y: 0
			}, this._clickMoveEndPos = {
				x: 0,
				y: 0
			}, this._SOX = 0, this._SOY = 0, this._RSX = 0, this._RSY = 0, this._mapMoveSpeed = 20, this._RSOffR = 79, this._isMove = !1, this._RSmove = !1, this.RS_C = null, this.RS_D = null, this.off = .01, this._isRSClickUp = !1, this._OIM = yt.Slide, this._clickDownPos = {
				x: 0,
				y: 0
			}, this._clickMoveStartPos = {
				x: 0,
				y: 0
			}, this._clickMoveEndPos = {
				x: 0,
				y: 0
			}, this._SOX = 0, this._SOY = 0, this._RSX = 0, this._RSY = 0, this._mapMoveSpeed = 20, this._RSOffR = 79, this._rs = 1 * this._RSOffR, this._isMove = !1, this._RSmove = !1, this.RS_C = null, this.RS_D = null, this.off = .01, this._progLogic = new Ce, this._scene = Laya.stage.getChildAt(0).getChildAt(0), this._panel = new Laya.Sprite, this._panel.width = Laya.stage.width, this._panel.height = Laya.stage.height, this._scene.addChild(this._panel), this._panel.visible = !1, this._panel.zOrder = 1, this.AddEvent()
		}
		AddEvent() {
			ot.instance.AddListEvent(ot.instance.OINPUT_Event_RS_ON, this.Event_RS_on, this), ot.instance.AddListEvent(ot.instance.OINPUT_Event_ON, this.Event_on, this), ot.instance.AddListEvent(ot.instance.OINPUT_Event_OFF, this.Event_off, this)
		}
		Event_on() {
			this.Event_RS_off(), this._panel.on(Laya.Event.CLICK, this, this.ClickEvent), this._panel.on(Laya.Event.MOUSE_DOWN, this, this.ClickDownEvent), this._panel.on(Laya.Event.MOUSE_MOVE, this, this.MoveSlideEvent), this._panel.on(Laya.Event.MOUSE_UP, this, this.ClickUPEvent), this._panel.visible = !0
		}
		Event_off() {
			this._panel.off(Laya.Event.CLICK, this, this.ClickEvent), this._panel.off(Laya.Event.MOUSE_DOWN, this, this.ClickDownEvent), this._panel.off(Laya.Event.MOUSE_MOVE, this, this.MoveSlideEvent), this._panel.off(Laya.Event.MOUSE_UP, this, this.ClickUPEvent), this._panel.visible = !1
		}
		Event_RS_on() {
			this.Event_off(), null == this.RS_C && this.CreateRSImg(), this.RS_C.visible = !0, this._panel.on(Laya.Event.MOUSE_DOWN, this, this.ClickDownEvent), this._panel.on(Laya.Event.MOUSE_UP, this, this.ClickUPEvent), this._panel.on(Laya.Event.MOUSE_MOVE, this, this.MoveRSEvent), ht.instance.AddUPEvent("MoveRSEvent_UpData", this.MoveRSEvent_UpData, this), rt.instance.AddTimeLoopEvent("TestAroundBlock", () => {
				this._RSmove && ot.instance.Fire(ot.instance.PLOGIC_TESTAROUNDBLOCK)
			}, this, .2), this._panel.visible = !0
		}
		Event_RS_off() {
			this._panel.off(Laya.Event.MOUSE_DOWN, this, this.ClickDownEvent), this._panel.off(Laya.Event.MOUSE_UP, this, this.ClickUPEvent), this._panel.off(Laya.Event.MOUSE_MOVE, this, this.MoveRSEvent), ht.instance.removeListEvent("MoveRSEvent_UpData"), rt.instance.RemoveListLoopEvent("TestAroundBlock"), this._panel.visible = !1, this.RS_C.visible = !1
		}
		MoveSlideEvent() {
			if (this._isRSClickUp && (this._clickMoveEndPos = {
					x: this._panel.mouseX,
					y: this._panel.mouseY
				}, this._SOX = this._clickMoveEndPos.x - this._clickMoveStartPos.x, this._SOY = this._clickMoveEndPos.y - this._clickMoveStartPos.y, ot.instance.Fire(ot.instance.MAP_MAPMOVE, this.SOX, this.SOY), this._clickMoveStartPos = {
					x: this._panel.mouseX,
					y: this._panel.mouseY
				}, !this._isMove)) {
				let t = Math.abs(this._SOX),
					e = Math.abs(this._SOY);
				(t > this.off || e > this.off) && (ot.instance.Fire(ot.instance.HIDE_MENU), this._isMove = !0)
			}
		}
		MoveRSEvent() {
			this._isRSClickUp && (this._clickMoveEndPos = {
				x: this._panel.mouseX,
				y: this._panel.mouseY
			}, this._RSX = this._clickMoveEndPos.x - this._clickDownPos.x, this._RSY = this._clickMoveEndPos.y - this._clickDownPos.y, this._RSmove = !0)
		}
		MoveRSEvent_UpData() {
			let t = W.FPS.getAvgDelta() / 16.66667;
			this.MoveRS_D(this.RSX * t, this.RSY * t)
		}
		ClickDownEvent() {
			this._isRSClickUp = !0, this._clickDownPos = {
				x: this._panel.mouseX,
				y: this._panel.mouseY
			}, this._clickMoveStartPos = {
				x: this._panel.mouseX,
				y: this._panel.mouseY
			}, this._clickMoveEndPos = {
				x: this._panel.mouseX,
				y: this._panel.mouseX
			}, this._RSX = 0, this._RSY = 0, this._SOX = 0, this._SOY = 0, this._isMove = !1, null != this.RS_C && (this.RS_C.pos(this._clickDownPos.x, this._clickDownPos.y), this.RS_D.pos(this.RS_C.pivotX, this.RS_C.pivotY))
		}
		ClickUPEvent() {
			this._isRSClickUp = !1, this._clickDownPos = {
				x: null,
				y: null
			}, this._clickMoveStartPos = {
				x: null,
				y: null
			}, this._clickMoveEndPos = {
				x: null,
				y: null
			}, this._RSX = 0, this._RSY = 0, this._SOX = 0, this._SOY = 0, this._RSmove = !1, this.InitRSPos(), ni.Model == Lt.HumanModel ? ie.instance.playerStand(Qt.instance.player) : ni.Model == Lt.TrollModel && ie.instance.trollStand(de.instance.trollSprict)
		}
		ClickEvent() {
			this._isMove || ni.Model == Lt.HumanModel && ot.instance.Fire(ot.instance.CLICK_MAP, this._panel.mouseX, this._panel.mouseY, Qt.instance.player.roomIndex)
		}
		get RSX() {
			return this._RSX > 0 ? this._RSX = Math.min(this._RSX, this._RSOffR) : this._RSX < 0 && (this._RSX = Math.max(this._RSX, -this._RSOffR)), this._RSX / this._RSOffR
		}
		get RSY() {
			return this._RSY > 0 ? this._RSY = Math.min(this._RSY, this._RSOffR) : this._RSY < 0 && (this._RSY = Math.max(this._RSY, -this._RSOffR)), this._RSY / this._RSOffR
		}
		getOIMod(t) {
			return this._OIM == t
		}
		get SOX() {
			return this._SOX > 0 ? Math.min(this._SOX, this._mapMoveSpeed) : this._SOX < 0 ? Math.max(this._SOX, -this._mapMoveSpeed) : this._SOX
		}
		get SOY() {
			return this._SOY > 0 ? Math.min(this._SOY, this._mapMoveSpeed) : this._SOY < 0 ? Math.max(this._SOY, -this._mapMoveSpeed) : this._SOY
		}
		GameOver() {
			this.Event_off(), this.Event_RS_off(), this.ClickUPEvent()
		}
		CreateRSImg() {
			this.InitRS_C(), this.InitRS_D(), this._scene.addChild(this.RS_C), this.RS_C.addChild(this.RS_D), this.InitRSPos(), this.RS_C.zOrder = 3, this.RS_D.zOrder = 3
		}
		InitRSPos() {
			let t = this._scene.width / 2,
				e = (1 - this.RS_C.height / this._scene.height) * this._scene.height;
			this.RS_C.pos(t, e), this.RS_D.pos(this.RS_C.pivotX, this.RS_C.pivotY)
		}
		InitRS_C() {
			this.RS_C = this.CreateImg(), this.RS_C.skin = "UI/RS_C.png", this.RS_C.width = 242, this.RS_C.height = 242, this.RS_C.pivot(121, 121)
		}
		InitRS_D() {
			this.RS_D = this.CreateImg(), this.RS_D.skin = "UI/RS_D.png", this.RS_D.width = 84, this.RS_D.height = 84, this.RS_D.pivot(42, 42)
		}
		CreateImg() {
			return new Laya.Image
		}
		MoveRS_D(t, e) {
			if (0 == t && 0 == e) this.RS_D.pos(121, 121);
			else {
				let i = t * this._rs,
					s = e * this._rs,
					n = Math.atan2(s, i),
					a = 121,
					l = 121,
					o = 0,
					h = 0;
				a = i > 0 ? Math.min(Math.cos(n) * this._RSOffR, i) : i < 0 ? Math.max(Math.cos(n) * this._RSOffR, i) : 0, l = s > 0 ? Math.min(Math.sin(n) * this._RSOffR, s) : s < 0 ? Math.max(Math.sin(n) * this._RSOffR, s) : 0, o = a / this._RSOffR, h = l / this._RSOffR, this.RS_D.pos(a + 121, l + 121);
				let r = new W.Vec2(o, h);
				r = ie.instance.PlayerMovePosFix(r), ni.Model == Lt.HumanModel ? this._progLogic.PlayerMove(r.x, r.y) : ni.Model == Lt.TrollModel && this._progLogic.TrollMove(r.x, r.y)
			}
		}
	}
	class Be {
		constructor(t, e) {
			this.walkable = !0, this.dynWalkable = !0, this.costMultiplier = 1, this.x = t, this.y = e
		}
	}
	class ke {
		constructor(t, e) {
			this._nodes = [], this._numCols = t, this._numRows = e, this._nodes = [];
			for (let i = 0; i < t; i++) {
				this._nodes[i] = [];
				for (let t = 0; t < e; t++) this._nodes[i][t] = new Be(i, t)
			}
		}
		set mapData(t) {
			this._mapData = t
		}
		getNode(t, e) {
			return t < 0 || t >= this.numCols || e < 0 || e >= this.numRows ? null : this._nodes[t][e]
		}
		setEndNode(t, e) {
			if (this._endNode = this.getNode(t, e), null == this._endNode) return !0;
			if (!this._endNode.walkable) {
				let i = [],
					s = this.getNode(t - 1, e),
					n = this.getNode(t + 1, e),
					a = this.getNode(t, e - 1),
					l = this.getNode(t, e + 1);
				if (null != s && s.walkable && i.push(s), null != n && n.walkable && i.push(n), null != a && a.walkable && i.push(a), null != l && l.walkable && i.push(l), i.length > 0) {
					let t = i[Math.floor(Math.random() * i.length)];
					this._endNode = t
				}
			}
			return !1
		}
		setStartNode(t, e) {
			this._startNode = this._nodes[t][e]
		}
		setWalkable(t, e, i) {
			this._nodes[t][e].walkable = i
		}
		setDynWalkable(t, e, i) {
			this._nodes[t][e].dynWalkable = i
		}
		get endNode() {
			return this._endNode
		}
		get numCols() {
			return this._numCols
		}
		get numRows() {
			return this._numRows
		}
		get startNode() {
			return this._startNode
		}
		SetAllWalkable() {
			for (let t = 0; t < this.numCols; t++)
				for (let e = 0; e < this._numRows; e++) this.setWalkable(t, e, this._mapData.IsWalkable(t, e)), this.setDynWalkable(t, e, this._mapData.IsWalkable(t, e))
		}
	}
	class we {
		constructor() {
			this._straightCost = 1, this._diagCost = Math.SQRT2, this._slant = !1, this._heuristic = this.euclidian
		}
		findPath(t) {
			return this._grid = t, this._open = [], this._closed = [], this._startNode = this._grid.startNode, this._endNode = this._grid.endNode, this._startNode.g = 0, this._startNode.h = this._heuristic(this._startNode), this._startNode.f = this._startNode.g + this._startNode.h, this.search()
		}
		search() {
			for (var t = this._startNode; t != this._endNode;) {
				for (var e = Math.max(0, t.x - 1), i = Math.min(this._grid.numCols - 1, t.x + 1), s = Math.max(0, t.y - 1), n = Math.min(this._grid.numRows - 1, t.y + 1), a = e; a <= i; a++)
					for (var l = s; l <= n; l++)
						if (this._slant || a == t.x || l == t.y) {
							var o = this._grid.getNode(a, l);
							if (o != t && o.walkable && this._grid.getNode(t.x, o.y).walkable && this._grid.getNode(o.x, t.y).walkable) {
								var h = this._straightCost;
								t.x != o.x && t.y != o.y && (h = this._diagCost);
								var r = t.g + h * o.costMultiplier,
									_ = this._heuristic(o),
									d = r + _;
								this.isOpen(o) || this.isClosed(o) ? o.f > d && (o.f = d, o.g = r, o.h = _, o.parent = t) : (o.f = d, o.g = r, o.h = _, o.parent = t, this._open.push(o))
							}
						} if (this._closed.push(t), 0 == this._open.length) return console.log("AStar >> no path found", a), !1;
				let c = this._open.length;
				for (let t = 0; t < c; t++)
					for (let e = t + 1; e < c; e++)
						if (this._open[t].f > this._open[e].f) {
							let i = this._open[t];
							this._open[t] = this._open[e], this._open[e] = i
						} t = this._open.shift()
			}
			return this.buildPath(), !0
		}
		buildPath() {
			this._path = new Array;
			var t = this._endNode;
			for (this._path.push(t); t != this._startNode;) t = t.parent, this._path.unshift(t)
		}
		get path() {
			return this._path
		}
		isOpen(t) {
			for (var e = 0; e < this._open.length; e++)
				if (this._open[e] == t) return !0;
			return !1
		}
		isClosed(t) {
			for (var e = 0; e < this._closed.length; e++)
				if (this._closed[e] == t) return !0;
			return !1
		}
		manhattan(t) {
			return Math.abs(t.x - this._endNode.x) * this._straightCost + Math.abs(t.y + this._endNode.y) * this._straightCost
		}
		euclidian(t) {
			var e = t.x - this._endNode.x,
				i = t.y - this._endNode.y;
			return Math.sqrt(e * e + i * i) * this._straightCost
		}
		diagonal(t) {
			var e = Math.abs(t.x - this._endNode.x),
				i = Math.abs(t.y - this._endNode.y),
				s = Math.min(e, i),
				n = e + i;
			return this._diagCost * s + this._straightCost * (n - 2 * s)
		}
		get visited() {
			return this._closed.concat(this._open)
		}
		set slant(t) {
			this._slant = t
		}
	}
	class Oe {
		constructor() {
			this._map = new se, this._mapData = new ne, this._operInput = new Me, this.AddEvent(), this.screen = Laya.stage.getChildAt(0).getChildAt(0)
		}
		AddEvent() {
			this._map.AddEvent(), ot.instance.AddListEvent(ot.instance.MGM_START_END_PATH, this.GetStartPos_EndPos_Path, this), ot.instance.AddListEvent(ot.instance.MGM_PROTAGONIST_MOVE, this.ProtagonistMove, this), ot.instance.AddListEvent(ot.instance.MGM_AIORTROLLIS_MOVE, this.AIOrTrollIsMove, this), ot.instance.AddListEvent(ot.instance.MGM_FIND_AROUND_BUILD, this.FindTheTarget, this), ot.instance.AddListEvent(ot.instance.MGM_BUILDDIE, this.BuildDie, this), ot.instance.AddListEvent(ot.instance.MGM_GET_ROOMCOUNT, this.GetRoomCount, this), ot.instance.AddListEvent(ot.instance.MGM_GET_BLOCKFINDROOM, this.GetBlockIsRoom, this), ot.instance.AddListEvent(ot.instance.MGM_SET_BLOCKWALKABLE, this.SetBlockWalkable, this), ot.instance.AddListEvent(ot.instance.MGM_SET_BLOCKDYNWALKABLE, this.SetBlockDynWalkable, this), ot.instance.AddListEvent(ot.instance.MGM_GET_OPENSPACE, this.GetOpenSpace, this), ot.instance.AddListEvent(ot.instance.MGM_MONTIORPLAYERAROUND, this.MonitorPlayerAround, this), ot.instance.AddListEvent(ot.instance.MGM_FINDPOSBLOCK, this.FindPosBLock, this), ot.instance.AddListEvent(ot.instance.MGM_GET_DATAPOSTMAPPOS, this.GetDataPosTMapPos, this), ot.instance.AddListEvent(ot.instance.MGM_GET_MAPPOSTSCENEPOS, this.GetMapPosTScenePos, this), ot.instance.AddListEvent(ot.instance.MGM_GET_BLOCKPOSS, this.GetRoomBlockPos, this), ot.instance.AddListEvent(ot.instance.MGM_GET_POSAROUND, this.GetPosAroundBuild, this), ot.instance.AddListEvent(ot.instance.MGM_IS_SCREENRANGE, this.IsScreenRange, this), ot.instance.AddListEvent(ot.instance.MGM_ROOMBLACK, this.RoomBlock, this), ot.instance.AddListEvent(ot.instance.MGM_LOOKPOS, this.LookPos, this), ot.instance.AddListEvent(ot.instance.MGM_POSINSAFE, this.IsPosInSafe, this)
		}
		SelectMap(t = 0) {
			this._mapData.SelectMap(t), this._map.SetMapData(this._mapData), this._grid = new ke(this._map.numCols, this._map.numRows), this._grid.mapData = this._mapData, this._grid.SetAllWalkable()
		}
		ShowMap() {
			this.SetScnenShowPos(20, 21), this._operInput.Event_RS_on(), ni.Model == Lt.TrollModel && this._operInput.Event_on()
		}
		SetScnenShowPos(t, e) {
			this._map.SetShowPoint(t, e, this.screen.width / 2, this.screen.height / 2), this._map.ShowPoint()
		}
		LookPos(t, e) {
			let i = this._map.ScreenPosTMapPos(this.screen.width / 2, this.screen.height / 2),
				s = this._map.ScreenPosTMapPos(0, 0),
				n = this._map.ScreenPosTMapPos(this.screen.width, this.screen.height),
				a = this._map.MapPanelMaxPos,
				l = n.x - a.x,
				o = n.y - a.y,
				h = i.x - t,
				r = i.y - e;
			h > 5 ? h >= s.x && (h = s.x - 90) : h < -5 && h < l && (h = l), r > 5 ? r >= s.y && (r = s.y - 90) : r < -5 && r < o && (r = o), this._map.MoveMap(h, r, !1), this.MoveMapLoop(0)
		}
		MoveMapLoop(t) {
			t > 20 || (Laya.timer.once(20, this, this.MoveMapLoop, [t + 1]), this._map.MoveMap(.1, .01, !1))
		}
		GetStartPos_EndPos_Path(t, e, i, s) {
			let n = this._map.MapPosTDataPos(t, e),
				a = this._map.MapPosTDataPos(i, s);
			if (this._grid.setStartNode(n.x, n.y), this._grid.setEndNode(a.x, a.y)) return;
			let l = new we;
			l.findPath(this._grid);
			let o = l.path;
			return this._map.GetPathMapPos(o)
		}
		ProtagonistMove(t, e, i, s) {
			this.ProtagonistMapMove(t, e);
			let n = this._map.MapPosTDataPos(t, e),
				a = this._grid.getNode(n.x, n.y + i),
				l = this._grid.getNode(n.x + s, n.y),
				o = {
					x: null,
					y: null
				};
			if (!a.dynWalkable) {
				let t = this._map.DataPosTMapPos(a.x, a.y).x;
				o.x = t
			}
			if (!l.dynWalkable) {
				let t = this._map.DataPosTMapPos(l.x, l.y).y;
				o.y = t
			}
			return o
		}
		MonitorPlayerAround(t, e) {
			let i = this._map.MapPosTDataPos(t, e),
				s = this._mapData.FindPlayerAround(i.x, i.y);
			if (null == s) return null; {
				let t = ot.instance.FireReturn(ot.instance.BUILD_FINDBLOCKPOS, s.x + "_" + s.y);
				return null == t ? null : {
					build: s.build,
					block: t
				}
			}
		}
		AIOrTrollIsMove(t, e) {
			let i = this._map.MapPosTDataPos(t, e);
			if (ni.Model == Lt.TrollModel) {
				let t = this._mapData.FindTrollAround(i.x, i.y);
				if (null == t) return null;
				i.x = t.x, i.y = t.y
			}
			let s = this._grid.getNode(i.x, i.y),
				n = this._mapData.BlockFindRoom(i.x, i.y);
			return s.dynWalkable ? null : ot.instance.FireReturn(ot.instance.BUILD_FINDBLOCKPOS, i.x + "_" + i.y, n)
		}
		FindPosBLock(t, e) {
			let i = this._map.MapPosTDataPos(t, e),
				s = i.x + "_" + i.y;
			return ot.instance.FireReturn(ot.instance.BUILD_FINDBLOCKPOS, s)
		}
		ProtagonistMapMove(t, e) {
			let i = this._map.MapPosTScreenPos(t, e),
				s = 0,
				n = 0,
				a = this.screen.width / 2,
				l = this.screen.height / 2;
			s = a - i.x, n = l - i.y, this._map.MoveMap(s, n)
		}
		FindTheTarget(t, e) {
			let i = this._map.MapPosTDataPos(t, e);
			return this._mapData.GetAroundBuild(i.x, i.y, 6)
		}
		GetRoomCount() {
			return this._mapData.GetRoomCount()
		}
		GetBlockIsRoom(t, e) {
			let i = this._map.MapPosTDataPos(t, e);
			return this._mapData.BlockFindRoom(i.x, i.y)
		}
		SetBlockWalkable(t, e, i) {
			let s = this._map.MapPosTDataPos(t, e);
			this._grid.setWalkable(s.x, s.y, i)
		}
		SetBlockDynWalkable(t, e, i) {
			let s = this._map.MapPosTDataPos(t, e);
			this._grid.setDynWalkable(s.x, s.y, i)
		}
		GetOpenSpace(t, e = !1) {
			return this._mapData.GetOpenSpace(t, e)
		}
		BuildDie(t, e, i) {
			let s = this._map.MapPosTDataPos(t, e);
			this._mapData.readMap(s.x, s.y).inBlock = 0, this.SetBlockDynWalkable(t, e, !0)
		}
		GetDataPosTMapPos(t, e) {
			let i = this._map.DataPosTMapPos(t, e);
			return [i.x, i.y]
		}
		GetMapPosTScenePos(t, e) {
			let i = this._map.MapPosTScreenPos(t, e);
			return [i.x, i.y]
		}
		GetRoomBlockPos(t) {
			let e = this._mapData.GetRoom(t);
			if (null != e) {
				let t = e.room,
					i = [];
				for (let e = 0; e < t.length; e++) {
					let s = t[e].split("_"),
						n = this._map.DataPosTMapPos(parseInt(s[0]), parseInt(s[1]));
					i.push(n)
				}
				return i
			}
			return null
		}
		GameOver() {
			this._operInput.GameOver(), this._mapData.GameOver(), this._map.GameOver(), delete this._grid
		}
		GetPosAroundBuild(t, e, i, s) {
			let n = this._map.MapPosTDataPos(t, e);
			return this._mapData.GetPosAroundBuild(n.x, n.y, i, s)
		}
		IsScreenRange(t, e) {
			return this._map.IsScreenRange(t, e)
		}
		RoomBlock(t) {
			let e = this.GetRoomBlockPos(t);
			null != e && this._map.RoomBlack(e)
		}
		IsPosInSafe(t, e) {
			let i = this._map.MapPosTDataPos(t, e),
				s = this._mapData.readMap(i.x, i.y);
			return !(!s || 10 != s.landBlock)
		}
	}
	class Pe extends wt {
		constructor() {
			super()
		}
		onEnable() {
			super.onEnable()
		}
		onUpdate() {
			if (this.SP3 && this.SP3.transform) {
				let t = this.SP3.transform.position.clone();
				t.y += .5, t.x -= .1;
				let e = W.Transform3D.WorldToScreen2(Et.main.camera, t);
				this.node.pos(e.x, e.y)
			}
		}
		set SP3(t) {
			this._sp3 = t
		}
		get SP3() {
			return this._sp3
		}
	}
	class xe {
		constructor() {
			this._isUse = !1, this._isOpen = !0, this._build = null, this._name = null, this._level = -1, this._pos = {
				x: null,
				y: null
			}, this._invincible = !1, this._HPStrip = null, this._battleBB = null, this._promptUpImg = null, this.isPromptUp = !1, this._x = null, this._y = null
		}
		Hit(t) {
			if (this.invincible) return !0;
			this.hpCur -= t, this.hp <= 0 && (this.isUse = !1, this.hpCur = 0), this.hpStrip = this.hp, this._HPStrip.visible || (this._HPStrip.visible = !0);
			let e = this.hpCur > 0;
			return Pt.instance.Shake(this.build, (1 - this.hp) / 5 + .05), e || (this.room.Die(this), this.build.visible = !1, _t.instance.PlaySound(_t.instance.TB_sound.build_die, 1, this.x, this.y), ot.instance.Fire(ot.instance.BUILD_SETTWINKSKin, this.x, this.y), ot.instance.Fire(ot.instance.MGM_BUILDDIE, this.x, this.y, this.build), this.GameOver()), e
		}
		set hpMax(t) {
			t < 0 || (this._hpMax = t)
		}
		get hpMax() {
			return this._hpMax
		}
		set hpCur(t) {
			t < 0 && (t = 0), t > this._hpMax && (t = this._hpMax), this._hpCur = t, this.hpStripView = this.hp
		}
		get hpCur() {
			return this._hpCur
		}
		get hp() {
			return this.hpCur / this.hpMax
		}
		set battleBB(t) {
			this._battleBB = t
		}
		get battleBB() {
			return this._battleBB
		}
		get isOpen() {
			return this._isOpen
		}
		set isOpen(t) {
			this._isOpen = t
		}
		set build(t) {
			if (this._build = t, null == this._build ? (this._x = null, this._y = null) : (this._x = this.build.x, this._y = this.build.y), null == t) this.level = -1;
			else {
				let e = parseInt(t.name.split("_")[1]);
				this._level = e
			}
			ie.instance.setNewBuildBlock(this, this.build), this.isPromptUp = !1
		}
		get build() {
			return this._build
		}
		set level(t) {
			t >= this._level && (this._level = t)
		}
		get level() {
			return Math.max(0, this._level)
		}
		set time(t) {
			this._time = t < 0 ? 0 : t
		}
		get time() {
			return this._time
		}
		set timeInterval(t) {
			this._timeInterval = t < 0 ? 0 : t
		}
		get timeInterval() {
			return this._timeInterval
		}
		get name() {
			return null == this._name && null != this._build && (this._name = this._build.name.split("_")[0]), this._name
		}
		get buildName() {
			return this.name + "_" + this.level
		}
		get isUse() {
			return this._isUse
		}
		set isUse(t) {
			this._isUse = t
		}
		set hpStripView(t) {
			null != this._HPStrip && (this.hpStrip = t)
		}
		set hpStrip(t) {
			if (null == this._HPStrip) {
				let t = Laya.loader.getRes("Prefabs/BuildBloodStrip.json");
				this._HPStrip = new Laya.View, this._HPStrip.createView(t), Laya.stage.getChildAt(0).getChildAt(0).addChild(this._HPStrip), this._HPStrip.zOrder = 2, W.Comp.auto(this._HPStrip, he, !0).SP3 = ie.instance.getSp3ByBlock(this)
			} else {
				Laya.stage.getChildAt(0).getChildAt(0).addChild(this._HPStrip), this._HPStrip.zOrder = 2, W.Comp.auto(this._HPStrip, he, !0).SP3 = ie.instance.getSp3ByBlock(this)
			}
			t >= 0 && t <= 1 && (this._HPStrip.getChildAt(1).scaleX = t)
		}
		get x() {
			return this._x
		}
		get y() {
			return this._y
		}
		GameOver() {
			if (this.HidePromptUp(), this._GameOver(), null != this._HPStrip && this._build && null != this._build && (this._HPStrip.removeSelf(), this._HPStrip.visible = !1), this.isUse = !1, this.build = null, this.isOpen = !0, this.invincible = !1, this.room = null, this._name = null, this.SP3) {
				ie.instance.BuildDismantle(this);
				let t = this.SP3.getComponent(kt);
				t && t.brokeBuild()
			}
		}
		_GameOver() {
			ot.instance.Fire(ot.instance.MAP_DEMOLISH, this.build, null)
		}
		get pos() {
			return this._pos
		}
		set pos(t) {
			this._pos = t
		}
		set room(t) {
			this._room = t
		}
		get room() {
			return this._room
		}
		set invincible(t) {
			this._invincible = t
		}
		get invincible() {
			return this._invincible
		}
		get roomIndex() {
			return this.room.roomIndex
		}
		ShowPromptUp() {
			if (!this._promptUpImg) {
				this._promptUpImg = new Laya.Image;
				let t = new Laya.Image;
				this._promptUpImg.scaleX = 2, this._promptUpImg.scaleY = 2, this._promptUpImg.addChild(t), this._promptUpImg.width = 42, this._promptUpImg.height = 42, this._promptUpImg.pivot(21, 21), t.skin = "UI/Up.png", t.width = 42, t.height = 42, t.pivot(21, 21), t.pos(0, 0), this._promptUpImg.zOrder = 2;
				let e = W.Comp.auto(this._promptUpImg, Pe, !0),
					i = ie.instance.getBuild(this);
				e.SP3 = i, Laya.stage.getChildAt(0).getChildAt(0).addChild(this._promptUpImg)
			}
			if (this._build) {
				Laya.stage.getChildAt(0).getChildAt(0).addChild(this._promptUpImg);
				let t = W.Comp.auto(this._promptUpImg, Pe, !0),
					e = ie.instance.getBuild(this);
				t.SP3 = e, this._promptUpImg.zOrder = 2, this._promptUpImg.visible = !0, Pt.instance.Shake(this._promptUpImg, .1), this.UpDownTween(this._promptUpImg.getChildAt(0))
			}
		}
		UpDownTween(t, e = 1) {
			Laya.Tween.to(t, {
				y: t.y + 10 * e
			}, 200, null, Laya.Handler.create(this, () => {
				this.UpDownTween(t, -1 * e)
			}), 0, !0)
		}
		HidePromptUp() {
			this._promptUpImg && (Laya.Tween.clearAll(this._promptUpImg), this._promptUpImg.removeSelf(), this._promptUpImg.visible = !0), null != this._build && ot.instance.Fire(ot.instance.BUILD_SETTWINKSKin, this.x, this.y)
		}
		set SP3(t) {
			this._sp3 = t
		}
		get SP3() {
			return this._sp3
		}
	}
	class De {
		constructor() {
			this._blockInfos = new Array, this.Constructor()
		}
		Constructor() {}
		UpData() {
			if (this._blockInfos.length > 0)
				for (let t = 0; t < this._blockInfos.length; t++) {
					let e = this._blockInfos[t];
					e.isUse && rt.instance.AfterAPeriodOfTime_Bool(e.time, e.timeInterval) && (e.time = rt.instance.gameTime, this.Handel_UpData(e))
				}
		}
		FindBlockInfo_Pos(t) {
			if (this._blockInfos.length > 0)
				for (let e = 0; e < this._blockInfos.length; e++) {
					if (!this._blockInfos[e].isUse) continue;
					let i = this.StrTPos(t);
					if (i.x == this._blockInfos[e].pos.x && i.y == this._blockInfos[e].pos.y) return this._blockInfos[e]
				}
			return null
		}
		FindBlockInfo_RoomIndex(t) {
			if (this._blockInfos.length > 0)
				for (let e = 0; e < this._blockInfos.length; e++)
					if (this._blockInfos[e].isUse && t == this._blockInfos[e].room.roomIndex) return this._blockInfos[e];
			return null
		}
		FindBlockInfo_RoomIndex_count(t) {
			let e = 0;
			if (this._blockInfos.length > 0)
				for (let i = 0; i < this._blockInfos.length; i++) this._blockInfos[i].isUse && t == this._blockInfos[i].room.roomIndex && e++;
			return e
		}
		GetRoomAllBlock(t) {
			let e = [];
			if (this._blockInfos.length > 0)
				for (let i = 0; i < this._blockInfos.length; i++) this._blockInfos[i].isUse && t == this._blockInfos[i].room.roomIndex && e.push(this._blockInfos[i]);
			return e.length > 0 ? e : null
		}
		GetBlockInfo() {
			if (this._blockInfos.length > 0)
				for (let t = this._blockInfos.length - 1; t >= 0; t--)
					if (!this._blockInfos[t].isUse) {
						let e = this._blockInfos[t];
						return this._blockInfos.splice(t, 1), e
					} return new xe
		}
		Build(t, e, i) {
			let s = this.GetBlockInfo();
			return s.build = e, s.room = i, s.isUse = !0, s.isOpen = !1, s.hpMax = 1, s.hpCur = s.hpMax, s.time = rt.instance.gameTime, s.timeInterval = 1, s.pos = this.StrTPos(t), this._blockInfos.push(s), this.SetBlockInfo(s), s.hpStripView = s.hp, this._build(s), ot.instance.Fire(ot.instance.MGM_SET_BLOCKDYNWALKABLE, s.x, s.y, s.isOpen), s
		}
		_build(t) {}
		BuildUp(t, e = null) {
			null == e && (e = this.FindBlockInfo_Pos(t)), e.level++, this.SetBlockInfo(e), ie.instance.BuildUp(e)
		}
		SetBlockInfo(t) {
			let e = di.instance.build.GetBuildData(t.name, t.level);
			this.BlockInfo(t, e)
		}
		BlockInfo(t, e) {}
		Handel_UpData(t) {}
		ReachConditions(t, e) {
			if (this._blockInfos.length > 0)
				for (let i = 0; i < this._blockInfos.length; i++) {
					let s = this._blockInfos[i];
					if (s.isUse && s.room.roomIndex == e && s.level >= t) return !0
				}
			return !1
		}
		GameOver() {
			if (this._blockInfos.length > 0)
				for (let t = 0; t < this._blockInfos.length; t++) {
					this._blockInfos[t].GameOver()
				}
			this._GameOver()
		}
		_GameOver() {}
		StrTPos(t) {
			let e = t.split("_");
			return {
				x: parseInt(e[0]),
				y: parseInt(e[1])
			}
		}
	}
	class Ue extends xe {
		get pREffect() {
			return this.build.visible
		}
		get pR() {
			return this._pR
		}
		set pR(t) {
			this._pR = t
		}
	}
	class Re extends Ue {
		set head(t) {
			this._head || (this._head = new Laya.Image, this._head.width = 90, this._head.height = 90, this._head.pivot(45, 45)), this.build.addChild(this._head), this._head.visible = !0, this._head.pos(45, 45), this._head.skin = "bullet/head_" + t + ".png"
		}
		_GameOver() {
			this._head && (this._head.removeSelf(), this._head.visible = !1), ot.instance.Fire(ot.instance.MAP_DEMOLISH, this.build, null)
		}
	}
	class Ne extends De {
		Handel_UpData(t) {
			this.IncreasePR(t)
		}
		BlockInfo(t, e) {
			t.pR = e[3], t.room.bed = t
		}
		IncreasePR(t) {
			let e = t.pR * t.room.prLevel * t.room.doubleGold1;
			if (ni.Model == Lt.HumanModel && t._room._roomIndex == Qt.instance.player.roomIndex && (e *= F.gold_mul), di.instance.game.SetPR(t.room.roomIndex, e, 0), t.isOpen) {
				let e = .01 * t.level;
				t.pREffect && (ie.instance.birthGoldEvent(t), Pt.instance.Shake(t.build, e), ni.Model == Lt.HumanModel && t._room._roomIndex == Qt.instance.player.roomIndex ? Pt.instance.RFEffect("UI/gold1.png", t.pR * F.gold_mul, t.build, t) : Pt.instance.RFEffect("UI/gold1.png", t.pR, t.build, t))
			}
		}
		GetBlockInfo() {
			if (this._blockInfos.length > 0)
				for (let t = this._blockInfos.length - 1; t >= 0; t--)
					if (!this._blockInfos[t].isUse) {
						let e = this._blockInfos[t];
						return this._blockInfos.splice(t, 1), e
					} return new Re
		}
	}
	class Ge extends xe {
		constructor() {
			super(), this.adv = !1
		}
		OpenDoor() {
			this.isOpen || (this.jt.visible = !0, this.build.parent.addChild(this.jt), this.jt.rotation = this.build.rotation, this.jt.pos(this.x, this.y), this.jtShow(), this.moveMod ? Laya.Tween.to(this.build, {
				x: this.build.x + 90
			}, 500, null, null, 0, !0) : Laya.Tween.to(this.build, {
				y: this.build.y + 90
			}, 500, null, null, 0, !0), this.isOpen = !0, ie.instance.openDoor(this.roomIndex, this.x, this.y, this.jt.rotation))
		}
		CloseDoor(t = !1) {
			this.isOpen && (this.moveMod ? Laya.Tween.to(this.build, {
				x: this.build.x - 90
			}, 500, null, Laya.Handler.create(this, () => {
				t && _t.instance.PlaySound(_t.instance.TB_sound.build_build, 1, this.x, this.y)
			}), 0, !0) : Laya.Tween.to(this.build, {
				y: this.build.y - 90
			}, 500, null, Laya.Handler.create(this, () => {
				t && _t.instance.PlaySound(_t.instance.TB_sound.build_build, 1, this.x, this.y)
			}), 0, !0), this.jt.visible = !1, this.jt.removeSelf(), this.isOpen = !1, ie.instance.closeDoor(this.roomIndex))
		}
		get moveMod() {
			let t = Math.abs(this.build.rotation);
			return 0 == t || 180 == t
		}
		get jt() {
			if (null == this._jt) {
				let t = new Laya.Image;
				t.width = 46, t.height = 46, t.pivot(23, 23), t.skin = "UI/jt.png", this._jt = t
			}
			return this._jt
		}
		jtShow(t = 0) {
			Laya.Tween.to(this.jt, {
				alpha: t
			}, 1e3, null, Laya.Handler.create(this, () => {
				null != this.jt && this.jt.visible && (1 == t ? this.jtShow() : this.jtShow(1))
			}), 0, !0)
		}
		_GameOver() {
			this.adv = !1, this.jt.visible = !1, this.jt.removeSelf(), ot.instance.Fire(ot.instance.MAP_DEMOLISH, this.build, null)
		}
	}
	class He extends De {
		BlockInfo(t, e) {
			t.hpMax = e[3], t.hpCur = e[3], t.battleBB = .01 * t.level, t.room.door = t
		}
		_build(t) {
			t.OpenDoor()
		}
		BloodReturn(t) {
			1 != t.hp && (t.hpCur += t.hpMax * t.battleBB, t.hpStrip = t.hp)
		}
		Handel_UpData(t) {
			this.BloodReturn(t)
		}
		GetBlockInfo() {
			if (this._blockInfos.length > 0)
				for (let t = this._blockInfos.length - 1; t >= 0; t--)
					if (!this._blockInfos[t].isUse) {
						let e = this._blockInfos[t];
						return this._blockInfos.splice(t, 1), e
					} return new Ge
		}
	}
	class Fe extends Laya.Script {
		constructor() {
			super()
		}
		onAwake() {
			this._bullet_2d = this.owner
		}
		Refresh3DBullet(t, e, i) {
			Fe.act_bullet_count++, this._sp3 && W.Mem.recoverySP(this._sp3), this.fly_cost_time = 0;
			let s = Number(t.split("_")[1]) - 1;
			this._sp3 = W.Mem.getSp2({
				id: 4002,
				sid: s
			}), this._sp3 || console.log("Refresh3DBullet 逻辑出错"), Et.main.scene3D.addChild(this._sp3);
			let n = this._sp3.getChildAt(0);
			n && n.meshRenderer && (n.meshRenderer.sharedMaterial.depthTest = Laya.RenderState.DEPTHTEST_OFF), this.level = i, this.fire_point_y = e, console.log("Refresh3DBullet act_bullet_count", Fe.act_bullet_count)
		}
		_Set3DTransform() {
			let t = this._bullet_2d;
			if (t && this._sp3) {
				let e = Math.min(W.Mathf.Lerp(0, .5, this.fly_cost_time / 500), .5);
				this._sp3.transform.position = new Laya.Vector3(-t.x / 90, this.fire_point_y + e, -t.y / 90), this._sp3.transform.rotationEuler = new W.Vec3(0, -this._bullet_2d.rotation, 0)
			} else console.log("_Set3DTransform 逻辑出错")
		}
		onUpdate() {
			this._sp3 ? (this.fly_cost_time += W.FPS.getAvgDelta(), this._Set3DTransform()) : console.log("onUpdate 逻辑出错")
		}
		onDisable() {
			if (this.fly_cost_time = 0, this._sp3) {
				let t = Ht.GetAtTemp(this.level).hit_ef;
				if (t) {
					let e = W.Mem.getSP(t);
					W.Transform3D.addChild(Et.main.scene3D, e), e.transform.position = this._sp3.transform.position.clone(), W.Transform3D.playParticle(e), this.setParticleOrder(e)
				}
				W.Mem.recoverySP(this._sp3)
			} else console.log("onDisable 逻辑出错");
			this._sp3 = null, Fe.act_bullet_count--, console.log("onDisable act_bullet_count", Fe.act_bullet_count)
		}
		setParticleOrder(t) {
			t && t.particleRenderer && (t.particleRenderer.sharedMaterial.depthTest = Laya.RenderState.DEPTHTEST_OFF);
			for (var e = 0; e < t.numChildren; e++) {
				let i = t.getChildAt(e);
				i && i.particleRenderer && (i.particleRenderer.sharedMaterial.depthTest = Laya.RenderState.DEPTHTEST_OFF)
			}
		}
	}
	Fe.act_bullet_count = 0;
	class We {
		constructor() {
			this.Init(), ht.instance.AddUPEvent("BulletMoveUp", this.MoveUP, this)
		}
		get troll() {
			return de.instance.troll
		}
		Init() {
			this.BulletImgArr = new Array, this.bulletSprite = ot.instance.FireReturn(ot.instance.MAP_GET_ACTIVITYMAP)
		}
		TrackMoveMent(t, e) {
			ae.instance.SetRot(t, this.troll), ae.instance.AddTMoveMent(t, this.troll, 180, e), ae.instance.AddScale(t, 1, 1, .35)
		}
		attack(t, e, i, s, n) {
			var a = this.GetBuild();
			this.InitBuild(a, t, s);
			var l = a.bullet.parent.globalToLocal(e);
			a.bullet.pos(l.x, l.y), a.bullet.skin = "bullet/" + i + "_Bullet.png";
			let o = n.SP3.getComponent(Wt);
			if (o && o.sp3_fire_point) {
				let t = a.bullet.getComponent(Fe);
				t || (t = a.bullet.addComponent(Fe)), t.Refresh3DBullet(i, o.sp3_fire_point.transform.position.y, n.level)
			}
			this.TrackMoveMent(a.bullet, a.movespeed)
		}
		InitBuild(t, e, i) {
			t.bullet.width = 90, t.bullet.height = 90, t.movespeed = 1e3, t.bullet.pivotX = 45, t.bullet.pivotY = 45, t.bullet.rotation = 0, t.bullet.scaleX = .2, t.bullet.scaleY = .2, t.power = e, t.bullet.visible = !0, t.roomIndex = i, this.bulletSprite.addChild(t.bullet)
		}
		GetBuild() {
			if (this.BulletImgArr.length > 0)
				for (var t = 0; t < this.BulletImgArr.length; t++) {
					let e = this.BulletImgArr[t];
					if (!e.isUse) return e.isUse = !0, e
				}
			var e = new Laya.Image;
			e.visible = !0;
			var i = {
				bullet: e,
				isUse: !0,
				power: 0,
				movespeed: 0,
				roomIndex: -1
			};
			return this.BulletImgArr.push(i), i
		}
		MoveUP() {
			this.HandleMoveOver()
		}
		HandleMoveOver() {
			if (this.BulletImgArr.length > 0)
				for (var t = this.BulletImgArr.length - 1; t >= 0; t--) {
					var e = this.BulletImgArr[t];
					if (null != e && e.isUse) {
						var i = e.bullet.localToGlobal(new Laya.Point(e.bullet.pivotX, e.bullet.pivotY)),
							s = this.troll.localToGlobal(new Laya.Point(this.troll.pivotX, this.troll.pivotY));
						if (this.Distance(i, s) < 400) {
							let t = e;
							xt.instance.AddEffect(xt.instance.effectStr.bulletEffect, t.bullet.x - 20, t.bullet.y - 20, !0), this.Attack(t.bullet, t.power, t.roomIndex), t.isUse = !1
						}
					}
				}
		}
		Attack(t, e, i) {
			ot.instance.Fire(ot.instance.TL_TROLLHIT, e, i), t.visible = !1, this.bulletSprite.removeChild(t)
		}
		Distance(t, e) {
			var i = t.x - e.x,
				s = t.y - e.y;
			return i * i + s * s
		}
		GameOver() {
			this.BulletImgArr.length > 0 && this.BulletImgArr.forEach(t => {
				t.bullet.removeSelf(), t.bullet.visible = !1
			})
		}
	}
	class Ve extends xe {
		constructor() {
			super(), this._subObj = null, this._rSpeed = 0, this._isAttack = !1, this._paralysis = !1
		}
		get subObj() {
			if (null == this._subObj && null != this.build) {
				if (!(this.build.numChildren > 0)) return null;
				this._subObj = this.build.getChildAt(0)
			}
			return this._subObj
		}
		get attackPos() {
			return this._attackPos = this.subObj.localToGlobal(Ve._forwardPos, !0), this._attackPos
		}
		set power(t) {
			t < 0 && (t = this._power), this._power = t
		}
		get power() {
			return this._power
		}
		set attackSpeed(t) {
			t < 0 || (this._attackSpeed = t)
		}
		get attackSpeed() {
			return 1 / (this._attackSpeed + this.room.atSpeed + this._rSpeed)
		}
		set rSpeed(t) {
			this._rSpeed = t
		}
		set attackRadius(t) {
			t <= 0 && (t = 4), this._attackRadius = t
		}
		get attackRadius() {
			return 8100 * this._attackRadius * this._attackRadius * this.room.atRange
		}
		set isAttack(t) {
			this._isAttack = t
		}
		get isAttack() {
			return this._isAttack
		}
		set paralysis(t) {
			this._paralysis = t
		}
		get paralysis() {
			return this._paralysis
		}
		_GameOver() {
			null != this.build && null != this.subObj && this.build.removeChild(this.subObj), ot.instance.Fire(ot.instance.MAP_DEMOLISH, this.build, this.subObj), this._subObj = null
		}
	}
	Ve._forwardPos = new Laya.Point(45, 0);
	class Ye extends De {
		UpData() {
			if (this._blockInfos.length > 0 && null != this._bulletManager.troll)
				for (let t = 0; t < this._blockInfos.length; t++) {
					let e = this._blockInfos[t];
					if (e.isUse) {
						if (e.paralysis) return;
						if (rt.instance.AfterAPeriodOfTime_Bool(e.time, e.attackSpeed)) {
							let t = ot.instance.FireReturn(ot.instance.MAP_DISTANCE, e.build, this._bulletManager.troll);
							if (t <= e.attackRadius) {
								let i = e.room;
								i.BuffSwitch(i.buffTypeStr.solenoid) ? e.rSpeed = (1 - t / e.attackRadius) * i.solenoidMax : e.rSpeed = 0, i.BuffSwitch(i.buffTypeStr.smoney) && i.SmoneyEvent(e.level), e.time = rt.instance.gameTime, this.Handel_UpData(e)
							}
						}
					}
				}
		}
		Constructor() {
			this._bulletManager = new We, this._bullet_effet_Arr = [], this._use_bullet_effet_arr = []
		}
		Handel_UpData(t) {
			this.ShootSkill(t)
		}
		ShootSkill(t) {
			let e = this;
			ie.instance.setTowerSub(t.subObj, t.build), ae.instance.AddRotation(t.subObj, this._bulletManager.troll, 720, () => {
				if (Pt.instance.Shake(t.subObj, .2), !t.isUse) return;
				let i = e.img;
				e.Effect(i, t);
				let s = t.SP3.getComponent(Wt);
				s && s.PlayFireEffect(), e.Attack(t)
			})
		}
		Attack(t) {
			_t.instance.PlaySound(_t.instance.TB_sound.build_at_attack, 1, t.x, t.y), this._bulletManager.attack(t.power, t.attackPos, t.buildName, t.roomIndex, t), t.time = rt.instance.gameTime
		}
		BlockInfo(t, e) {
			t.power = e[3], t.attackRadius = e[4], t.attackSpeed = 1, t.rSpeed = 0, t.paralysis = !1
		}
		UpGradeAttackSpeed(t, e) {
			.2 != t.attackSpeed && (t.attackSpeed -= e, t.attackSpeed <= .2 && (t.attackSpeed = .2))
		}
		_GameOver() {
			this._bulletManager.GameOver(), this.ClearBulletEffectAll()
		}
		GetBlockInfo() {
			if (this._blockInfos.length > 0)
				for (let t = this._blockInfos.length - 1; t >= 0; t--)
					if (!this._blockInfos[t].isUse) {
						let e = this._blockInfos[t];
						return this._blockInfos.splice(t, 1), e
					} return new Ve
		}
		get img() {
			let t;
			return this._bullet_effet_Arr.length > 0 ? t = this._bullet_effet_Arr.shift() : ((t = new Laya.Image).width = 59, t.height = 95, t.pivot(30, 81), t.skin = "UI/bullet_effect.png"), t.alpha = 0, t.visible = !0, this._use_bullet_effet_arr.push(t), t
		}
		ClearBulletEffectAll() {
			if (this._use_bullet_effet_arr.length > 0) {
				for (let t = this._use_bullet_effet_arr.length - 1; t >= 0; t--) {
					let e = this._use_bullet_effet_arr[t];
					this.ClearBulletEffect(e)
				}
				this._use_bullet_effet_arr = []
			}
		}
		ClearBulletEffect(t) {
			Laya.Tween.clearAll(t), t.removeSelf(), t.visible = !1, this._bullet_effet_Arr.push(t)
		}
		Effect(t, e) {
			e.isUse && (e.subObj.addChild(t), t.pos(45, 0), Laya.Tween.to(t, {
				alpha: 1
			}, 20, null, Laya.Handler.create(this, () => {
				Laya.Tween.to(t, {
					alpha: 0
				}, 20, null, Laya.Handler.create(this, () => {
					this.ClearBulletEffect(t)
				}), 0, !0)
			}), 0, !0))
		}
	}
	class Xe extends De {
		Handel_UpData(t) {
			t.room.die || this.IncreasePR(t)
		}
		BlockInfo(t, e) {
			t.pR = e[3]
		}
		IncreasePR(t) {
			ie.instance.birthGoldEvent(t);
			let e = t.pR * t.room.prLevel * t.room.doubleGold1;
			di.instance.game.SetPR(t.room.roomIndex, e, 0);
			let i = .01 * t.level;
			t.pREffect && (Pt.instance.Shake(t.build, i), Pt.instance.RFEffect("UI/gold1.png", t.pR, t.build, t))
		}
		GetBlockInfo() {
			if (this._blockInfos.length > 0)
				for (let t = this._blockInfos.length - 1; t >= 0; t--)
					if (!this._blockInfos[t].isUse) {
						let e = this._blockInfos[t];
						return this._blockInfos.splice(t, 1), e
					} return new Ue
		}
	}
	class Ke extends De {
		Handel_UpData(t) {
			t.room.die || this.IncreasePR(t)
		}
		BlockInfo(t, e) {
			t.pR = e[3], 1 == t.level ? t.timeInterval = 2 : t.timeInterval = 1
		}
		IncreasePR(t) {
			ie.instance.birthGoldEvent(t);
			let e = t.pR * t.room.doubleGold2;
			di.instance.game.SetPR(t.room.roomIndex, 0, e);
			let i = .01 * t.level;
			Pt.instance.Shake(t.build, i), Pt.instance.RFEffect("UI/gold2.png", e, t.build, t)
		}
	}
	class ze extends xe {}
	class je {
		constructor() {
			this.bulletSprite = ot.instance.FireReturn(ot.instance.MAP_GET_ACTIVITYMAP), this.imgs = new Array, this.imgUse = new Array
		}
		static get instence() {
			return this._ins && null != this._ins || (this._ins = new je), this._ins
		}
		get troll() {
			return (this._troll || null == this._troll) && (this._troll = de.instance.trollSprict), this._troll
		}
		TriggerEvent(t, e) {
			if (e.isUse) switch (t) {
				case 0:
					this.SpellEvent(e);
					break;
				case 1:
					this.EntrapmentEvent(e);
					break;
				case 2:
					this.GuillotineEvent(e);
					break;
				case 3:
					return this.EnergyhoodEvent(e)
			}
		}
		get spellImage() {
			return this._spellImage && null != this._spellImage || (this._spellImage = this.Img, this._spellImage.skin = "map/spellimg_0.png"), this._spellImage
		}
		SpellEvent(t) {
			if (!t.isUse) return;
			Math.random() <= .3 && (this.bulletSprite.addChild(this.spellImage), this.spellImage.x = t.x, this.spellImage.y = t.y, this.spellImage.visible = !0, this.spellImage.alpha = 1, ae.instance.SetRot(this.spellImage, this.troll.troll), Laya.Tween.to(this.spellImage, {
				x: this.troll.x,
				y: this.troll.y - 100
			}, 400, null, Laya.Handler.create(this, function() {
				this.troll.troll.addChild(this.spellImage), this.spellImage.pos(this.troll.troll.pivotX, this.troll.troll.pivotY - 100), Laya.Tween.to(this.spellImage, {
					alpha: 0
				}, 3e3, null, Laya.Handler.create(this, function() {
					this.spellImage.visible = !1, this.spellImage.removeSelf()
				}), 0, !0), ot.instance.Fire(ot.instance.TL_VERTIGO_REDUCTION, 3)
			}), 0, !0), ie.instance.SpellEvent(t))
		}
		get entramentImage() {
			return this._entrapmentImage && null != this._entrapmentImage || (this._entrapmentImage = this.Img, this._entrapmentImage.skin = "map/entramentImage_1.png"), this._entrapmentImage
		}
		EntrapmentEvent(t) {
			t.isUse && (this.bulletSprite.addChild(this.entramentImage), this.entramentImage.pos(t.x, t.y), this.entramentImage.visible = !0, this.entramentImage.alpha = 1, this.entramentImage.scale(2, 2), ae.instance.SetRot(this.entramentImage, this.troll.troll), Laya.Tween.to(this.entramentImage, {
				x: this.troll.x,
				y: this.troll.y,
				scaleX: 1,
				scaleY: 1
			}, 400, null, Laya.Handler.create(this, function() {
				this.troll.troll.addChild(this.entramentImage), this.entramentImage.pos(this.troll.troll.pivotX, this.troll.troll.pivotY), this._entrapmentImage.skin = "map/entramentImage_2.png", Laya.Tween.to(this.entramentImage, {
					alpha: 0
				}, 2e3, null, Laya.Handler.create(this, function() {
					this.entramentImage.visible = !1, this.entramentImage.removeSelf()
				}), 0, !0), ot.instance.Fire(ot.instance.TL_VERTIGO_REDUCTION, 2)
			}), 0, !0), ie.instance.EntrapmentEvent(t))
		}
		get guillotineImg() {
			return this._guillotineImg && null != this._guillotineImg || (this._guillotineImg = this.Img, this._guillotineImg.skin = "map/guillotineImg.png"), this._guillotineImg
		}
		GuillotineEvent(t) {
			if (!t.isUse) return;
			let e = .1 * this.troll.hpMax;
			this.bulletSprite.addChild(this.guillotineImg), this.guillotineImg.pos(t.x, t.y), ae.instance.SetRot(this.guillotineImg, this.troll.troll), Laya.Tween.to(this.guillotineImg, {
				x: this.troll.x,
				y: this.troll.y,
				scaleX: 1,
				scaleY: 1,
				rotation: this.guillotineImg.rotation - 720
			}, 400, null, Laya.Handler.create(this, function() {
				ot.instance.Fire(ot.instance.TL_TROLLHIT, e, t.room.roomIndex), this.guillotineImg.removeSelf(), this.guillotineImg.visible = !1
			}), 0, !0), ie.instance.GuillotineEvent(t)
		}
		get energuhoodImg() {
			return this._energuhoodImg && null != this._energuhoodImg || (this._energuhoodImg = this.Img, this._energuhoodImg.skin = "map/energuhoodImg.png"), this._energuhoodImg
		}
		EnergyhoodEvent(t) {
			if (t.isUse) return this.energuhoodImg.scale(0, 0), null != t.build && (t.build.addChild(this.energuhoodImg), this.energuhoodImg.pos(45, 45), this.energuhoodImg.alpha = 0), ie.instance.EnergyhoodEvent(t), this.energuhoodImg
		}
		IceEvent(t) {
			if (!t.isUse) return;
			let e = this.Img;
			return e.zOrder = 1, e.skin = "map/Ice_ice.png", e.alpha = 0, e.scale(0, 0), e.pos(45, 45), t.build.addChild(e), Laya.Tween.to(e, {
				scaleX: 1,
				scaleY: 1,
				alpha: 1
			}, 1500, null, null, 0, !0), ie.instance.IceEvent(t), e
		}
		BarbEvent(t) {
			if (!t.isUse) return;
			let e = this.Img;
			return e.zOrder = 2, e.skin = "map/Barb_barb.png", e.alpha = 0, e.scale(0, 0), e.pos(45, 45), t.build.addChild(e), Laya.Tween.to(e, {
				scaleX: 1,
				scaleY: 1,
				alpha: 1
			}, 1500, null, null, 0, !0), ie.instance.BarbEvent(t), e
		}
		get Img() {
			let t = null;
			return (t = this.imgs.length > 0 ? this.imgs.shift() : new Laya.Image).width = 90.4, t.height = 90.4, t.pivot(45.2, 45.2), t.rotation = 0, t.name = "event", t.visible = !0, t.zOrder = 0, this.imgUse.push(t), t
		}
		repairEvent(t) {
			if (!t.isUse) return;
			let e = this.Img;
			e.skin = "map/wrench.png", t.build.addChild(e), Laya.stage.getChildAt(0).getChildAt(0).addChild(e), e.zOrder = 3;
			let i = W.Comp.auto(e, he, !0),
				s = ie.instance.getDoor(t.roomIndex);
			return i.SP3 = s, e
		}
		GameOver() {
			for (let t = this.imgUse.length - 1; t >= 0; t--) {
				let e = this.imgUse[t];
				e.removeSelf(), e.visible = !1, e.pivot(45, 45), this.imgs.push(e)
			}
			this.imgUse.length = 0, this._energuhoodImg = null, this._spellImage = null, this._guillotineImg = null, this._entrapmentImage = null
		}
		TrollIceEvent() {
			this.troll.atSpeedScale -= .3
		}
		TrollBarbEvent(t) {
			let e = .01 * this.troll.hpMax;
			ot.instance.Fire(ot.instance.TL_TROLLHIT, e, t)
		}
	}
	class qe {
		constructor(t) {
			this.isuse = !1, this._die = !1, this._roomIndex = null, this._attacked = !1, this.prLevel = 1, this.doubleGold1 = 1, this.doubleGold2 = 1, this.repairNum = 0, this.repairTime = 0, this.pr = 0, this.energuhoodImg = null, this.isEnerguhood = !1, this.isBarb = !1, this.barbTime = 0, this.repairSkillImg = null, this.repairIndex = 0, this._blocks = [], this.isuse = !1, this._die = !1, this._roomIndex = null, this._attacked = !1, this.prLevel = 1, this.doubleGold1 = 1, this.doubleGold2 = 1, this._buffType = {
				ice: 0,
				barb: 0,
				repair: 0,
				particlea: 0,
				spell: 1,
				entrapment: 1,
				guillotine: 1,
				energyhood: 1,
				smoney: 2,
				longrange: 2,
				solenoid: 2
			}, this.buildBuff = {
				ice: null,
				barb: null,
				repair: null,
				particlea: null,
				spell: null,
				entrapment: null,
				guillotine: null,
				energyhood: null,
				smoney: null,
				longrange: null,
				solenoid: null
			}, this.buff_immediately = {
				ice: {
					addFunc: null,
					removeFunc: null,
					isUse: !1
				},
				barb: {
					addFunc: null,
					removeFunc: null,
					isUse: !1
				},
				repair: {
					addFunc: null,
					removeFunc: null,
					isUse: !1
				},
				particlea: {
					addFunc: null,
					removeFunc: null,
					isUse: !1
				}
			}, this.buff_event = {
				spell: {
					addFunc: null,
					removeFunc: null,
					isUse: !1
				},
				entrapment: {
					addFunc: null,
					removeFunc: null,
					isUse: !1
				},
				guillotine: {
					addFunc: null,
					removeFunc: null,
					isUse: !1
				},
				energyhood: {
					addFunc: null,
					removeFunc: null,
					isUse: !1
				}
			}, this.buff_other = {
				smoney: {
					addFunc: null,
					removeFunc: null,
					isUse: !1
				},
				longrange: {
					addFunc: null,
					removeFunc: null,
					isUse: !1
				},
				solenoid: {
					addFunc: null,
					removeFunc: null,
					isUse: !1
				}
			}, this.repairNum = 0, this.repairTime = 0, this.pr = 0, this.energuhoodImg = null, this.isEnerguhood = !1, this.isBarb = !1, this.barbTime = 0, this.repairSkillImg = null, this.repairIndex = 0, this.AddFunc(), this.StartGame(), this.roomIndex = t, this._blocks = new Array
		}
		BuildBuff(t) {
			let e = this.buildBuff[t];
			e && e.call(this)
		}
		AddBuff_immediately(t) {
			let e = this.buff_immediately[t];
			e.isUse = !0, null != e.addFunc && e.addFunc.call(this)
		}
		RemoveBuff_immediately(t) {
			let e = this.buff_immediately[t];
			e.isUse = !1, null != e.removeFunc && e.removeFunc.call(this)
		}
		AddBuff_event(t) {
			this.buff_event[t].isUse = !0
		}
		RemoveBuff_event(t) {
			let e = this.buff_event[t];
			e.isUse = !1, null != e.removeFunc && e.removeFunc.call(this)
		}
		AddbBuff_other(t) {
			this.buff_other[t].isUse = !0
		}
		RemoveBuff_other(t) {
			let e = this.buff_other[t];
			e.isUse = !1, null != e.removeFunc && e.removeFunc.call(this)
		}
		AddBuff(t) {
			switch (this._buffType[t]) {
				case 0:
					this.AddBuff_immediately(t);
					break;
				case 1:
					this.AddBuff_event(t);
					break;
				case 2:
					this.AddbBuff_other(t)
			}
			this.BuildBuff(t)
		}
		RemoveBuff(t) {
			switch (this._buffType[t]) {
				case 0:
					this.RemoveBuff_immediately(t);
					break;
				case 1:
					this.RemoveBuff_event(t);
					break;
				case 2:
					this.RemoveBuff_other(t)
			}
		}
		AddFunc() {
			this.buff_immediately.ice.addFunc = this.IceEvent, this.buff_immediately.barb.addFunc = this.BarbEvent, this.buff_immediately.particlea.addFunc = this.ParticleaEvent, this.buff_immediately.repair.addFunc = this.RepairEvent, this.buff_immediately.ice.removeFunc = this.RemoveIceEvent, this.buff_immediately.barb.removeFunc = this.RemoveBarbEvent, this.buff_immediately.repair.removeFunc = this.RemoveRepairEvent, this.buff_event.spell.removeFunc = this.RemoveSpellEvent, this.buff_event.guillotine.removeFunc = this.RemoveGuillotineEvent, this.buff_event.entrapment.removeFunc = this.RemoveEntarpmentEvent, this.buff_other.solenoid.removeFunc = this.RemoveSoleniodEvent, this.buff_other.smoney.removeFunc = this.RemoveSmoneyEvent, this.buff_immediately.particlea.removeFunc = this.RemoveParticleaEvent, this.buff_event.energyhood.removeFunc = this.RemoveEnergyhoodEvent, this.buff_other.longrange.removeFunc = this.RemoveLongrangEvent, this.buildBuff.spell = this.SpellBuild, this.buildBuff.guillotine = this.GuillotneBuild, this.buildBuff.entrapment = this.EntrapmentBuild, this.buildBuff.solenoid = this.SoleniodBuild, this.buildBuff.smoney = this.SmoneyBuild, this.buildBuff.particlea = this.ParticleaBuild, this.buildBuff.ice = this.IceBuild, this.buildBuff.barb = this.BarbBuild, this.buildBuff.energyhood = this.EnergyhoodBuild, this.buildBuff.longrange = this.LongrangeBuild
		}
		Init() {}
		StartGame() {
			this.roomBuild = {
				spell: [],
				ice: [],
				entrapment: [],
				barb: [],
				guillotine: [],
				repair: [],
				energyhood: [],
				smoney: [],
				longrange: [],
				particlea: [],
				solenoid: []
			}, this.buff_immediately.barb.isUse = !1, this.buff_immediately.ice.isUse = !1, this.buff_immediately.particlea.isUse = !1, this.buff_immediately.repair.isUse = !1, this.buff_other.longrange.isUse = !1, this.buff_other.smoney.isUse = !1, this.buff_other.solenoid.isUse = !1, this.buff_event.energyhood.isUse = !1, this.buff_event.entrapment.isUse = !1, this.buff_event.guillotine.isUse = !1, this.buff_event.spell.isUse = !1
		}
		get roomIndex() {
			return this._roomIndex
		}
		set roomIndex(t) {
			this._roomIndex = t
		}
		get atRange() {
			return this.BuffSwitch(qe.buffTypeStr.longrange) ? qe._atrange : 1
		}
		get atSpeed() {
			return this.BuffSwitch(qe.buffTypeStr.particlea) ? qe._atSpeed : 0
		}
		Build(t, e) {
			let i = e.name.split("_")[0],
				s = !1;
			if (this.IsAllowArchitecture(i)) {
				let n = this.block;
				n.build = e, n.pos = this.PosTxy(t), n.room = this, n.isUse = !0, n.isOpen = !1, n.hpMax = 10, n.hpCur = 10, n.level = 1, s = !0, this._blocks.push(n), this.roomBuild[i].push(n), this.AddBuff(i), ot.instance.Fire(ot.instance.MGM_SET_BLOCKDYNWALKABLE, n.x, n.y, n.isOpen)
			}
			return s
		}
		IsAllowArchitecture(t) {
			let e = this.roomBuild[t],
				i = qe.roomBuildCount[t];
			return null != e && e.length < i
		}
		getBlock(t, e) {
			let i = this.roomBuild[t];
			if (!(i.length > 1)) return i[0];
			for (let t = 0; t < i.length; t++) {
				let s = i[t];
				if (s.pos.x == e.x && s.pos.y == e.y) return s
			}
		}
		BuildDismantle(t) {
			let e = t.name,
				i = this.roomBuild[e];
			if (i.length > 1)
				for (let e = i.length - 1; e >= 0; e--) {
					if (t == i[e]) return void i.splice(e, 1)
				} else this.roomBuild[e].length = 0
		}
		PosTxy(t) {
			let e = t.split("_");
			return {
				x: parseInt(e[0]),
				y: parseInt(e[1])
			}
		}
		get block() {
			return new ze
		}
		BuffSwitch(t) {
			let e = !1;
			switch (this._buffType[t]) {
				case 0:
					e = this.getBuffSwitch(this.buff_immediately, t);
					break;
				case 1:
					e = this.getBuffSwitch(this.buff_event, t);
					break;
				case 2:
					e = this.getBuffSwitch(this.buff_other, t)
			}
			return e
		}
		getBuffSwitch(t, e) {
			let i = t[e];
			return null != i && i.isUse
		}
		UpHandle() {
			this.die || (this.RepairUp(), this.EnergyhoodUp(), this.BarbUp())
		}
		IceEvent() {
			this.iceImg = je.instence.IceEvent(this.door)
		}
		IceBuild() {
			this.roomBuild.ice[0] && this.IceSkinExchange(1)
		}
		IceSkinExchange(t) {
			let e = this.roomBuild.ice[0];
			e && e.isUse && (e.build.skin = "build/ice_" + t + ".png", 3 == ++t && (t = 1), Laya.timer.once(1e3, this, this.IceSkinExchange, [t], !0))
		}
		RemoveIceEvent() {
			this.RemoveImg(this.iceImg), Laya.timer.clear(this, this.IceSkinExchange)
		}
		BarbEvent() {
			this.barbImg = je.instence.BarbEvent(this.door)
		}
		RemoveBarbEvent() {
			this.RemoveImg(this.barbImg), this.isBarb = !1, this.barb_2.visible = !1, this.barb_2.removeSelf(), this.barb_2 = void 0
		}
		RemoveImg(t) {
			t && Laya.Tween.to(t, {
				alpha: 0
			}, 500, null, Laya.Handler.create(this, function() {
				t.visible = !1, t.alpha = 1, t.removeSelf(), t = null
			}))
		}
		BarbBuild() {
			let t = this.roomBuild.barb[0];
			if (t) {
				if (!this.barb_2) {
					let e = this.img;
					e.pos(45, 45), e.skin = "map/barb_2.png", e.alpha = 0, t.build.addChild(e), this.barb_2 = e
				}
				this.BarbSkinExchange(1)
			}
		}
		BarbSkinExchange(t) {
			this.barb_2 && Laya.Tween.to(this.barb_2, {
				alpha: t
			}, 700, null, Laya.Handler.create(this, function() {
				t = 1 == t ? 0 : 1, this.BarbSkinExchange(t)
			}), 0, !0)
		}
		RepairEvent() {
			this.repairImg && null != this.repairImg || this.door.isUse && (this.repairImg = je.instence.repairEvent(this.door)), this.repairNum++
		}
		RemoveRepairEvent() {
			this.roomBuild.repair.length <= 1 ? this.RemoveImg(this.repairImg) : this.buff_immediately.repair.isUse = !0
		}
		RepairUp() {
			this.BuffSwitch(qe.buffTypeStr.repair) && (1 != this.door.hp ? rt.instance.AfterAPeriodOfTime_Bool(this.repairTime, 1) && (this.repairTime = rt.instance.gameTime, this.Repatir_Tween_show(this.repairImg)) : this.repairImg.visible && this.Repatir_Tween_hide())
		}
		Repatir_Tween_show(t, e = !1) {
			if (null == t) return;
			t.visible = !0;
			let i = 0;
			i = e ? .1 * this.door.hpMax / 4 : .02 * this.door.hpMax * this.repairNum / 4, t.rotation = 0, Laya.Tween.to(t, {
				rotation: t.rotation - 30,
				alpha: 1
			}, 250, null, Laya.Handler.create(this, () => {
				this.door.hpCur += i, this.door.isUse && _t.instance.PlaySound(_t.instance.Other_sound.weixiu, 1, this.door.x, this.door.y), Laya.Tween.to(t, {
					rotation: t.rotation + 30
				}, 250, null, Laya.Handler.create(this, () => {
					this.door.hpCur += i, Laya.Tween.to(t, {
						rotation: t.rotation + 30
					}, 250, null, Laya.Handler.create(this, () => {
						this.door.hpCur += i, this.door.isUse && _t.instance.PlaySound(_t.instance.Other_sound.weixiu, 1, this.door.x, this.door.y), Laya.Tween.to(t, {
							rotation: t.rotation - 30
						}, 250, null, Laya.Handler.create(this, () => {
							this.door.hpCur += i
						}), 0, !0)
					}), 0, !0)
				}), 0, !0)
			}), 0, !0)
		}
		Repatir_Tween_hide() {
			this.repairImg.visible = !1
		}
		SoleniodEvent() {}
		SoleniodBuild() {
			let t = this.roomBuild.solenoid[0];
			if (t) {
				let e = this.img;
				t.build.addChild(e), e.pos(45, 45), this.soneliodImg = e, this.SoleniodSkinExchange(0)
			}
		}
		SoleniodSkinExchange(t) {
			this.soneliodImg.skin = "map/solenoidimg_" + t + ".png", 3 == ++t && (t = 0), Laya.timer.once(40, this, this.SoleniodSkinExchange, [t], !0)
		}
		RemoveSoleniodEvent() {
			this.soneliodImg.visible = !1, this.soneliodImg.removeSelf(), this.soneliodImg = void 0, Laya.timer.clear(this, this.SoleniodSkinExchange)
		}
		get solenoidMax() {
			return qe._solenoidMax
		}
		SmoneyEvent(t) {
			let e = this.bed.pR / 200 * t;
			e = Math.ceil(e), this.pr += e
		}
		SmoneyBuild() {
			let t = this.roomBuild.smoney[0];
			if (t) {
				let e = this.img;
				t.build.addChild(e), e.pos(45, 45), e.skin = "UI/" + yi.instance.getPicture() + "/money.png", e.alpha = 0, this.smoneyImg = e, this.SmoneySkinTwinkle(1), rt.instance.AddTimeLoopEvent("UpATMPR" + this.roomIndex, this.UpATMPR, this, 1)
			}
		}
		SmoneySkinTwinkle(t) {
			this.smoneyImg && Laya.Tween.to(this.smoneyImg, {
				alpha: t
			}, 500, null, Laya.Handler.create(this, function() {
				t = 1 == t ? 0 : 1, this.SmoneySkinTwinkle(t)
			}), 0, !0)
		}
		UpATMPR() {
			if (!this.roomBuild.smoney[0] || !this.roomBuild.smoney[0].isUse) return rt.instance.RemoveListLoopEvent("UpATMPR" + this.roomIndex), void(this.pr = 0);
			let t = this.roomBuild.smoney[0];
			if (0 == this.pr) return;
			let e = this.pr;
			this.pr = 0, di.instance.game.SetPR(this.roomIndex, e, 0), Pt.instance.Shake(t.build, .2), Pt.instance.RFEffect("UI/gold1.png", e, t.build, t)
		}
		RemoveSmoneyEvent() {
			Laya.Tween.clearAll(this.smoneyImg), this.smoneyImg.visible = !1, this.smoneyImg.removeSelf(), this.smoneyImg = void 0, rt.instance.RemoveListLoopEvent("UpATMPR" + this.roomIndex), this.pr = 0
		}
		ParticleaEvent() {}
		ParticleaBuild() {
			let t = this.roomBuild.particlea[0];
			if (t) {
				let e = this.img;
				t.build.addChild(e), e.skin = "map/particleaImg.png", e.pos(45, 45), this.particleaImg = e, this.ParticleaSkinRotation()
			}
		}
		ParticleaSkinRotation() {
			this.particleaImg && Laya.Tween.to(this.particleaImg, {
				rotation: 360
			}, 1e3, null, Laya.Handler.create(this, function() {
				this.particleaImg.rotation = 0, this.ParticleaSkinRotation()
			}), 0, !0)
		}
		RemoveParticleaEvent() {
			Laya.Tween.clearAll(this.particleaImg), this.particleaImg.visible = !1, this.particleaImg.removeSelf(), this.particleaImg = void 0
		}
		LongrangeEvent() {}
		LongrangeBuild() {
			let t = this.roomBuild.longrange[0];
			if (t) {
				let e = this.img;
				e.pos(45, 45), e.skin = "map/longrange_2.png", t.build.addChild(e), this.longrange_2 = e, this.longrange_2.alpha = 0, this.LongrangSkinTwinkle(1)
			}
		}
		LongrangSkinTwinkle(t) {
			this.longrange_2 && Laya.Tween.to(this.longrange_2, {
				alpha: t
			}, 500, null, Laya.Handler.create(this, function() {
				t = 1 == t ? 0 : 1, this.LongrangSkinTwinkle(t)
			}), 0, !0)
		}
		RemoveLongrangEvent() {
			this.longrange_2.visible = !1, this.longrange_2.removeSelf(), this.longrange_2 = void 0
		}
		SpellEvent() {
			if (this.BuffSwitch(qe.buffTypeStr.spell)) {
				let t = this.roomBuild.spell[0];
				je.instence.TriggerEvent(0, t)
			}
		}
		SpellBuild() {
			let t = this.roomBuild.spell[0];
			if (t) {
				let e = this.img;
				e.skin = "map/spellimg_0.png", t.build.addChild(e), e.pos(45, 45), this.spellImg = e, this.SpellSkinExchange(0)
			}
		}
		SpellSkinExchange(t) {
			this.spellImg.skin = "map/spellimg_" + t + ".png", 3 == ++t && (t = 0), Laya.timer.once(100, this, this.SpellSkinExchange, [t], !0)
		}
		RemoveSpellEvent() {
			Laya.timer.clear(this, this.SpellSkinExchange), this.spellImg.visible = !1, this.spellImg.removeSelf(), this.spellImg = void 0
		}
		EntrapmentEvent() {
			if (this.BuffSwitch(qe.buffTypeStr.entrapment)) {
				let t = this.roomBuild.entrapment[0];
				je.instence.TriggerEvent(1, t)
			}
		}
		EntrapmentBuild() {
			let t = this.roomBuild.entrapment[0];
			if (t) {
				let e = this.img;
				e.skin = "map/entramentImage_1.png", e.pos(45, 45), t.build.addChild(e), this.entrapmentImg = e
			}
		}
		RemoveEntarpmentEvent() {
			this.entrapmentImg.visible = !1, this.entrapmentImg.removeSelf(), this.entrapmentImg = void 0
		}
		GuillotineEvent() {
			if (this.BuffSwitch(qe.buffTypeStr.guillotine)) {
				let t = this.roomBuild.guillotine[0];
				je.instence.TriggerEvent(2, t)
			}
		}
		GuillotneBuild() {
			let t = this.roomBuild.guillotine[0];
			if (t) {
				let e = this.img;
				t.build.addChild(e), e.pos(45, 45), e.skin = "map/guillotine_3.png", this.guillotneImg = e, this.GuillotneExchange(1)
			}
		}
		GuillotneExchange(t) {
			let e = this.roomBuild.guillotine[0];
			e && (e.build.skin = "build/guillotine_" + t + ".png", 3 == ++t && (t = 1), Laya.timer.once(500, this, this.GuillotneExchange, [t], !0))
		}
		RemoveGuillotineEvent() {
			this.guillotneImg.visible = !1, this.guillotneImg.removeSelf(), Laya.timer.clear(this, this.GuillotneExchange)
		}
		EnergyhoodEvent() {
			this.BuffSwitch(qe.buffTypeStr.energyhood) && (this.energuhoodImg = je.instence.TriggerEvent(3, this.door))
		}
		EnergyhoodBuild() {
			let t = this.roomBuild.energyhood[0];
			if (t) {
				let e = this.img;
				t.build.addChild(e), e.skin = "map/energyhood_2.png", e.pos(45, 38), e.pivot(45, 38), this.energyhood_2 = e, this.EnergyhoodSkinRotation()
			}
		}
		EnergyhoodSkinRotation() {
			this.energyhood_2 && Laya.Tween.to(this.energyhood_2, {
				rotation: 360
			}, 500, null, Laya.Handler.create(this, () => {
				this.energyhood_2 && (this.energyhood_2.rotation = 0, this.EnergyhoodSkinRotation())
			}), 0, !0)
		}
		RemoveEnergyhoodEvent() {
			if (!this.BuffSwitch(qe.buffTypeStr.energyhood)) {
				let t = this.roomBuild.energyhood[0];
				t.invincible && (this.energuhoodImg.removeSelf(), t.invincible = !1, Laya.Tween.clearAll(this.energuhoodImg), this.energuhoodImg.visible = !1, this.energuhoodImg = null), this.energyhood_2.visible = !1, this.energyhood_2.removeSelf(), this.energyhood_2 = void 0, Laya.Tween.clearAll(this.energyhood_2)
			}
		}
		DoorHit() {
			null == this.energuhoodImg && this.EnergyhoodEvent(), this.AttackHitEffect(this.energuhoodImg, () => {
				this.door.invincible = !0, rt.instance.AddTimeOnceEvent("DoorInvincible" + this.roomIndex, function() {
					this.door.invincible = !1, this.energuhoodImg && Laya.Tween.to(this.energuhoodImg, {
						alpha: 0
					}, 300, null, Laya.Handler.create(this, function() {
						this.energuhoodImg.removeSelf(), this.energuhoodImg = null
					}), 0, !0)
				}, this, 3)
			})
		}
		EnergyhoodUp() {
			this.BuffSwitch(qe.buffTypeStr.energyhood) && this.door.hp <= .3 && !this.isEnerguhood && (this.isEnerguhood = !0, this.DoorHit())
		}
		AttackHitEffect(t, e) {
			t && null != t && (t.visible = !0, Laya.Tween.to(t, {
				scaleX: 1.1,
				scaleY: 1.1,
				alpha: 1
			}, 350, null, Laya.Handler.create(this, function() {
				Laya.Tween.to(t, {
					scaleX: 1,
					scaleY: 1
				}, 200, null, Laya.Handler.create(this, function() {
					e && e()
				}), 0, !0)
			}), 0, !0))
		}
		get buffTypeStr() {
			return qe.buffTypeStr
		}
		HandleRoomBuff(t) {
			switch (t) {
				case 0:
					this.SpellEvent();
					break;
				case 1:
					this.EntrapmentEvent();
					break;
				case 2:
					this.HandleIceEvent();
					break;
				case 3:
					this.HandleBarbEvent();
					break;
				case 4:
					this.GuillotineEvent()
			}
		}
		HandleIceEvent() {
			this.BuffSwitch(this.buffTypeStr.ice) && je.instence.TrollIceEvent()
		}
		HandleBarbEvent() {
			this.BuffSwitch(this.buffTypeStr.barb) && (this.isBarb = !this.isBarb, this.barbTime = rt.instance.gameTime)
		}
		BarbUp() {
			this.isBarb && rt.instance.AfterAPeriodOfTime_Bool(this.barbTime, 1) && (je.instence.TrollBarbEvent(this.roomIndex), this.barbTime = rt.instance.gameTime)
		}
		get img() {
			let t = null;
			if (qe.imgs.length > 0)
				for (let e = 0; e < qe.imgs.length; e++) {
					let i = qe.imgs[e];
					if (!i.visible) {
						i.visible = !0, t = i;
						break
					}
				}
			return null == t && (t = new Laya.Image, qe.imgs.push(t)), t.width = 90.4, t.height = 90.4, t.pivot(45.2, 45.2), t.rotation = 0, t.name = "room", t.visible = !0, t
		}
		GameOver() {
			if (this._blocks.length > 0)
				for (let t = 0; t < this._blocks.length; t++) {
					this._blocks[t].GameOver()
				}
			this.spellImg = void 0, this.guillotneImg = void 0, this.entrapmentImg = void 0, this.repairSkillImg = void 0, this.isuse = !1, this.die = !1, this.prLevel = 1, Laya.timer.clearAll(this)
		}
		static GameOver() {
			for (let t = 0; t < this.imgs.length; t++) {
				let e = this.imgs[t];
				e.visible && (e.visible = !1, e.removeSelf(), Laya.Tween.clearAll(e))
			}
		}
		SkillEvent(t) {
			switch (t) {
				case 0:
					this.RepairSkillEvent()
			}
		}
		RepairSkillEvent() {
			this.door.isUse ? (this.repairSkillImg || (this.repairSkillImg = je.instence.repairEvent(this.door)), this.RepairSkill(), rt.instance.AddTimeLoopEvent("RepairSkill" + this.roomIndex, this.RepairSkill, this, 1)) : ot.instance.Fire(ot.instance.UIGM_TIPS, yi.instance.getLanguage("183"))
		}
		RepairSkill() {
			5 == this.repairIndex ? (this.repairSkillImg.visible = !1, rt.instance.RemoveListLoopEvent("RepairSkill" + this.roomIndex), this.repairIndex = 0) : (this.Repatir_Tween_show(this.repairSkillImg, !0), this.repairIndex++)
		}
		PosFindBlock(t) {
			let e = t.split("_"),
				i = parseInt(e[0]),
				s = parseInt(e[1]);
			if (this._blocks.length > 0) {
				for (let t = 0; t < this._blocks.length; t++) {
					let e = this._blocks[t];
					if (e.isUse && e.pos.x == i && e.pos.y == s) return e
				}
				return null
			}
		}
		set die(t) {
			this._die = t
		}
		get die() {
			return this._die
		}
		Die(t) {
			this.door.isUse || (this.repairImg && (this.repairImg.removeSelf(), this.repairImg.visible = !1, this.repairImg = null), this.iceImg && (this.iceImg.removeSelf(), this.iceImg.visible = !1, this.iceImg = null), this.barbImg && (this.barbImg.removeSelf(), this.barbImg.visible = !1, this.barbImg = null), this.energuhoodImg && (this.energuhoodImg.removeSelf(), Laya.Tween.clearAll(this.energuhoodImg), this.energuhoodImg.visible = !1, this.energuhoodImg = null)), this.RemoveBuff(t.name)
		}
		GetBuildNum(t) {
			let e = this.roomBuild[t];
			return e ? e.length : null
		}
	}
	qe._atrange = 1.3, qe._atSpeed = 1, qe.imgs = new Array, qe._solenoidMax = 2, qe.roomBuildCount = {
		spell: 1,
		ice: 1,
		entrapment: 1,
		barb: 1,
		guillotine: 1,
		repair: 4,
		energyhood: 1,
		smoney: 1,
		longrange: 1,
		particlea: 1,
		solenoid: 1
	}, qe.buffTypeStr = {
		spell: "spell",
		ice: "ice",
		entrapment: "entrapment",
		barb: "barb",
		guillotine: "guillotine",
		repair: "repair",
		energyhood: "energyhood",
		smoney: "smoney",
		longrange: "longrange",
		particlea: "particlea",
		solenoid: "solenoid"
	};
	class Je extends wt {
		constructor() {
			super()
		}
		onEnable() {
			super.onEnable()
		}
		onUpdate() {
			if (this.SP3 && this.SP3.transform) {
				let t = this.SP3.transform.position.clone(),
					e = W.Transform3D.WorldToScreen2(Et.main.camera, t);
				this.node.pos(e.x, e.y)
			}
		}
	}
	class Ze {
		constructor() {
			this._bgHeight = 150, this._buttonHeight = 140, this._selectIndex = 0, this.buildCount = qe.roomBuildCount, this._menus = new Array, this._btnarr = new Array, this._dashedBox = [], this._boxArr = [], this._panel = ot.instance.FireReturn(ot.instance.MAP_GET_ACTIVITYMAP), this.AddEvent(), this.LoadMenu()
		}
		AddEvent() {
			ot.instance.AddListEvent(ot.instance.SHOW_MENU, this.MenuShow, this), ot.instance.AddListEvent(ot.instance.HIDE_MENU, this.MenuHide, this), ot.instance.AddListEvent(ot.instance.OFF_SHOW_MENU, this.ShowOff, this), ot.instance.AddListEvent(ot.instance.OFF_HIDE_MENU, this.HideOff, this)
		}
		LoadMenu() {
			let t = Laya.loader.getRes("Prefabs/menu.json");
			this._sceen = Laya.stage.getChildAt(0).getChildAt(0), this._menu = new Laya.View, this._menu.createView(t), this.InitMenu()
		}
		InitMenu() {
			this._buildLoad = Laya.loader.getRes("Prefabs/buildMenu.json"), this._head = this._menu.getChildByName("head"), this._head.removeSelf(), this._menuBg = this._menu.getChildByName("BG"), this._select = this._menu.getChildByName("select"), this._upText = this._menu.getChildByName("UpText"), this._upImg = this._menu.getChildByName("UpImg"), this._select.getChildAt(0).getChildAt(0).text = yi.instance.getLanguage("93"), this._select.getChildAt(1).getChildAt(0).text = yi.instance.getLanguage("94"), this._select.getChildAt(2).getChildAt(0).text = yi.instance.getLanguage("67"), this._select.getChildAt(3).getChildAt(0).text = yi.instance.getLanguage("68"), this._select.getChildAt(4).getChildAt(0).text = yi.instance.getLanguage("69");
			for (let t = 0; t < this._select.numChildren; t++) {
				let e = t,
					i = this._select.getChildAt(t);
				i.on(Laya.Event.CLICK, this, this.SelectBtnEvent, [e, i])
			}
			this._build = this._menu.getChildByName("build");
			let t = Laya.loader.getRes("Prefabs/off.json");
			this._off = new Laya.View, this._off.createView(t), Laya.stage.getChildAt(0).getChildAt(0).addChild(this._off), this._off.visible = !1, this._off.zOrder = 20, this._off.on(Laya.Event.CLICK, this, function() {
				ot.instance.Fire(ot.instance.PLOGIC_OFFEVENTHANDLE)
			})
		}
		SelectBtnEvent(t, e) {
			if (t != this._selectIndex) {
				let i = this._select.getChildAt(this._selectIndex),
					s = i.skin;
				i.skin = e.skin, e.skin = s, this._selectIndex = t, this.BuildMenu(), this.MenuShow()
			}
			for (let e = 0; e < this._select.numChildren; e++) {
				this._select.getChildAt(e).getChildByName("text").color = t == e ? "#367c74" : "#ffffff"
			}
			e.skin = "build_n/select_0.png"
		}
		getmenu() {
			let t = null;
			if (this._menus.length > 0 && ((t = this._menus.shift()).visible = !0), null == t) {
				(t = new Laya.View).createView(this._buildLoad);
				let e = t.getChildByName("btn");
				Pt.instance.AddBtnEvent([e])
			}
			return t
		}
		BuildMenu() {
			this.ClearMenu();
			var t = di.instance.build.getbasicBuildData(this._selectIndex);
			for (let e = 0; e < t.length; e++) this.SubOption(t[e]);
			this._select.visible = !0, this._build.y = 139, this._upText.text = yi.instance.getLanguage("29"), this._upText.fontSize = 45, this._upImg.skin = "UI/" + yi.instance.getPicture() + "/jz_1.png"
		}
		BuildUpMenu(t, e = !0) {
			this.ClearMenu();
			let i = t.buildName,
				s = this.getUpBuildName(i);
			e && this.SubOption(s.str), "bed" != t.name && "door" != t.name ? this.Dismantle(t.buildName) : "door" != t.name || t.adv || di.instance.player.DZCount >= di.instance.cdn.cdn.doorADVOpneCount && this.KingADV(s.str), this._select.visible = !1, this._build.y = 72
		}
		getUpBuildName(t) {
			let e = t.split("_"),
				i = parseInt(e[1]) + 1;
			return {
				name: e[0],
				level: i,
				str: e[0] + "_" + i
			}
		}
		ClearMenu() {
			if (this._build.numChildren > 0)
				for (let t = this._build.numChildren - 1; t >= 0; t--) {
					let e = this._build.getChildAt(t);
					e.visible = !1, this._menus.push(e), this._build.removeChild(e);
					let i = e.getChildByName("btn");
					i.off(Laya.Event.CLICK, this, this.DismantleClickEvent), i.off(Laya.Event.CLICK, this, this.MenuClickEvent), i.off(Laya.Event.CLICK, this, this.MenuClickEvent_ADV)
				}
			this._btnarr.length = 0
		}
		KingADV(t) {
			let e = t.split("_"),
				i = di.instance.build.GetBuildData(e[0], parseInt(e[1]));
			if (!i) return;
			let s = di.instance.build.GetIntroduce(e[0], parseInt(e[1])),
				n = this.getmenu(),
				a = n.getChildByName("buildImg"),
				l = n.getChildByName("subBuildImg"),
				o = n.getChildByName("name"),
				h = n.getChildByName("introduce");
			n.getChildByName("count").getChildByName("counttext").parent.visible = !1;
			let r = n.getChildByName("btn"),
				_ = r.getChildByName("goldText1"),
				d = r.getChildByName("goldText2"),
				c = r.getChildByName("mod1"),
				u = r.getChildByName("mod2"),
				p = r.getChildByName("mod3"),
				g = r.getChildByName("mod4");
			if (c.getChildByName("textUp").text = yi.instance.getLanguage("31"), c.getChildByName("textDown").text = yi.instance.getLanguage("50") + yi.instance.getLanguage("30"), c.visible = !1, u.visible = !1, p.visible = !1, g.visible = !0, g.getChildByName("label").text = yi.instance.getLanguage("91"), _.visible = !1, d.visible = !1, "at" == e[0]) a.skin = "Atower/" + t + ".png", l.skin = "Atower/" + t + "_B.png", l.visible = !0;
			else {
				a.skin = "build/" + t + ".png";
				let i = di.instance.build.GetSubSkin(e[0]);
				null == i ? l.visible = !1 : (l.visible = !0, l.skin = i)
			}
			this._build.addChild(n), h.text = s + "\n" + yi.instance.getLanguage("200"), o.text = i[0], r.skin = "load/doorAdvBtn.png", r.on(Laya.Event.CLICK, this, this.MenuClickEvent_ADV, [t])
		}
		Dismantle(t) {
			let e = t.split("_"),
				i = di.instance.build.GetBuildData(e[0], parseInt(e[1])),
				s = this.getmenu(),
				n = s.getChildByName("buildImg"),
				a = s.getChildByName("subBuildImg"),
				l = s.getChildByName("btn"),
				o = l.getChildByName("goldText1"),
				h = l.getChildByName("goldText2"),
				r = l.getChildByName("mod1"),
				_ = l.getChildByName("mod2"),
				d = l.getChildByName("mod3"),
				c = l.getChildByName("mod4");
			c.getChildByName("label").text = yi.instance.getLanguage("91"), r.getChildByName("textUp").text = yi.instance.getLanguage("31"), r.getChildByName("textDown").text = yi.instance.getLanguage("50") + yi.instance.getLanguage("30"), r.visible = !1, _.visible = !1, d.visible = !1, c.visible = !1;
			let u = s.getChildByName("name"),
				p = s.getChildByName("introduce");
			s.getChildByName("count").getChildByName("counttext").parent.visible = !1, a.visible = !1, u.text = yi.instance.getLanguage("202"), p.text = yi.instance.getLanguage("201"), o.visible = !1, h.visible = !1, 0 != i[1] && 0 != i[2] ? (o.visible = !0, h.visible = !0, o.text = "+ " + (i[1] / 2).toString(), h.text = "+ " + (i[2] / 2).toString(), o.y = 26, h.y = 68) : 0 != i[1] ? (o.text = "+ " + (i[1] / 2).toString(), o.visible = !0, o.y = 50.625) : 0 != i[2] && (h.text = "+ " + (i[2] / 2).toString(), h.visible = !0, h.y = 50.625), n.skin = "build/TearDown.png", l.skin = "load/chBtn.png", this._build.addChild(s), l.on(Laya.Event.CLICK, this, this.DismantleClickEvent)
		}
		SubOption(t) {
			if (!this._room) return;
			let e = t.split("_"),
				i = di.instance.build.GetBuildData(e[0], parseInt(e[1]));
			if (null == i) {
				let t = di.instance.build.GetBuildData(e[0], parseInt(e[1]) - 1),
					i = di.instance.build.GetIntroduce(e[0], parseInt(e[1]) - 1);
				return this._upText.text = t[0] + "\n" + i, void(this._upText.fontSize = 21)
			}
			this._upText.text = yi.instance.getLanguage("52"), this._upText.fontSize = 45, this._upImg.skin = "UI/" + yi.instance.getPicture() + "/sj_2.png";
			let s = di.instance.build.GetIntroduce(e[0], parseInt(e[1])),
				n = t.split("_"),
				a = this.getmenu(),
				l = a.getChildByName("buildImg"),
				o = a.getChildByName("subBuildImg"),
				h = a.getChildByName("btn"),
				r = h.getChildByName("goldText1"),
				_ = h.getChildByName("goldText2"),
				d = h.getChildByName("mod1"),
				c = h.getChildByName("mod2"),
				u = h.getChildByName("mod3"),
				p = h.getChildByName("mod4");
			d.getChildByName("textUp").text = yi.instance.getLanguage("31"), d.getChildByName("textDown").text = yi.instance.getLanguage("50") + yi.instance.getLanguage("30"), d.visible = !1, c.visible = !1, u.visible = !1, p.visible = !1, r.visible = !1, _.visible = !1;
			let g = a.getChildByName("name"),
				m = a.getChildByName("introduce"),
				I = a.getChildByName("count").getChildByName("counttext"),
				f = di.instance.player.GetBuileprintNum(e[0]),
				y = this._room.GetBuildNum(e[0]),
				b = this.buildCount[e[0]];
			if (m.text = s, g.text = i[0], this._build.addChild(a), h.on(Laya.Event.CLICK, this, this.MenuClickEvent, [t]), "at" == n[0]) l.skin = "Atower/" + t + ".png", o.skin = "Atower/" + t + "_B.png", o.visible = !0;
			else {
				l.skin = "build/" + t + ".png";
				let e = di.instance.build.GetSubSkin(n[0]);
				null == e ? o.visible = !1 : (o.visible = !0, o.skin = e)
			}
			if (null != y) {
				if (null == f || 0 == f) return I.parent.visible = !1, d.visible = !0, h.skin = "load/menuBtnNo.png", void h.on(Laya.Event.CLICK, this, this.MenuClickEvent, [t]);
				if (I.parent.visible = !0, I.text = f.toString(), y == b) {
					return u.visible = !0, u.getChildByName("textUp").text = y + "/" + b, h.skin = "load/menuBtnNo.png", void h.on(Laya.Event.CLICK, this, this.MenuClickEvent, [t])
				}
				c.visible = !0, c.getChildByName("text").text = yi.instance.getLanguage("89") + y + "/" + b
			} else I.parent.visible = !1;
			0 != i[1] && 0 != i[2] ? (r.visible = !0, _.visible = !0, r.text = i[1], _.text = i[2], r.y = 26, _.y = 68) : 0 != i[1] ? (r.text = i[1], r.visible = !0, r.y = 50.625) : 0 != i[2] && (_.text = i[2], _.visible = !0, _.y = 50.625);
			let A = di.instance.game.GetRoomPR(this._room.roomIndex);
			A.gold1 >= i[1] && A.gold2 >= i[2] ? h.skin = "load/menuBtn.png" : (h.skin = "load/menuBtnNo.png", this._btnarr.push({
				gold1: i[1],
				gold2: i[2],
				btn: h
			}))
		}
		UpBtn() {
			if (this._btnarr.length > 0) {
				let t = di.instance.game.GetRoomPR(this._room.roomIndex);
				for (let e = this._btnarr.length - 1; e >= 0; e--) {
					let i = this._btnarr[e];
					t.gold1 >= i.gold1 && t.gold2 >= i.gold2 && (i.btn.skin = "load/menuBtn.png", this._btnarr.splice(e, 1))
				}
			}
		}
		MenuShow() {
			if (yi.instance.showBanner(), F.click_num++, this._build.numChildren > 0) {
				this._build.height = this._build.numChildren * this._buttonHeight, this._menu.height = this._bgHeight + this._build.height, this._menuBg.height = this._menu.height + 80;
				let t = this._build.numChildren;
				for (let e = 0; e < t; e++) {
					let t = this._build.getChildAt(e);
					t.scale(0, 1), Laya.Tween.to(t, {
						x: 305,
						y: e * this._buttonHeight + 70,
						scaleX: 1,
						scaleY: 1
					}, 200, null, null, 100 * e, !0)
				}
			}
			this._sceen.addChild(this._menu);
			let t = this._head.x,
				e = this._head.y;
			this._sceen.addChild(this._head), this._head.pos(t, e), this._menu.x = this._sceen.width / 2;
			let i = this._head.y / this._sceen.height,
				s = 1 - i;
			this._menu.y = i > s ? this._head.y - 45 - this._menu.height : this._head.y + 45, this._menu.zOrder = 19, ot.instance.Fire(ot.instance.UIGM_HIDESKILL)
		}
		MenuHide() {
			yi.instance.hideBanner(), this._menu.parent == Laya.stage.getChildAt(0).getChildAt(0) && (this._menu.removeSelf(), this._head.removeSelf(), this.ClearMenu(), ot.instance.Fire(ot.instance.BUILD_CLICKBLICK_INIT), ot.instance.Fire(ot.instance.UIGM_SHOWSKILL))
		}
		get head() {
			return 0 == this._build.numChildren ? (ot.instance.Fire(ot.instance.UIGM_TIPS, yi.instance.getLanguage("203")), null) : this._head
		}
		MenuClickEvent(t) {
			ot.instance.Fire(ot.instance.BUILD_BUILDORUP, t), this.MenuHide()
		}
		MenuClickEvent_ADV(t) {
			yi.instance.showVideo(() => {
				this._room.door.adv = !0, ot.instance.Fire(ot.instance.BUILD_BUILDORUP_ADV, t), this.MenuHide()
			})
		}
		DismantleClickEvent() {
			_t.instance.PlaySound(_t.instance.Other_sound.CC), ot.instance.Fire(ot.instance.BUILD_BUILD_DISMANTLE), this.MenuHide()
		}
		ShowOff(t, e = null, i) {
			t == yi.instance.getLanguage("61") && this.GameOver(), this._off.getChildByName("offImg").skin = "UI/" + yi.instance.getPicture() + "/" + t + ".png", this._off.visible = !0, W.Comp.auto(this._off, Je, !0).SP3 = ie.instance.getSp3ByBlock(i)
		}
		HideOff() {
			this._off.visible = !1
		}
		TwinkleHandle(t) {
			for (let e = 0; e < t.length; e++) {
				let i = t[e],
					s = this.GetTwinkleImg();
				s.visible = !0, s.pos(i.x, i.y), this._panel.addChild(s), this.ShowTwinkle(s), this._dashedBox.push(s);
				let n = new Laya.Point(s.x, s.y);
				ie.instance.ShowTwinkle(n.x, n.y)
			}
		}
		setTwinkleSkin(t, e, i = 1) {
			let s = null;
			if (this._dashedBox.length > 0)
				for (let i = 0; i < this._dashedBox.length; i++) {
					let n = this._dashedBox[i];
					if (n.x == t && n.y == e) {
						s = n;
						break
					}
				}
			null != s && (s.skin = "UI/dashed_" + i + ".png")
		}
		ShowTwinkle(t) {
			t.alpha = 0, Laya.Tween.to(t, {
				alpha: 1
			}, 2e3, null, Laya.Handler.create(this, function() {
				Laya.Tween.to(t, {
					alpha: 0
				}, 2e3, null, Laya.Handler.create(this, function() {
					this.ShowTwinkle(t)
				}), 0, !0)
			}), 0, !0)
		}
		GetTwinkleImg() {
			let t;
			return (t = this._boxArr.length > 0 ? this._boxArr.shift() : new Laya.Image).width = 90, t.height = 90, t.pivot(45, 45), t.skin = "UI/dashed_1.png", t
		}
		GameOver() {
			for (let t = 0; t < this._dashedBox.length; t++) {
				let e = this._dashedBox[t];
				e.removeSelf(), Laya.Tween.clearAll(e), this._boxArr.push(e)
			}
			this._dashedBox.length = 0, this._btnarr.length = 0
		}
		StartGame() {
			rt.instance.AddTimeLoopEvent("UpBtn", this.UpBtn, this, .2)
		}
		set room(t) {
			this._room = t
		}
	}
	class Qe {
		constructor() {
			this.clickBlock = {
				x: null,
				y: null,
				blockC: null,
				roomIndex: null,
				block: null
			}, this._buildInfo = {
				bed: new Ne,
				door: new He,
				game: new Ke,
				at: new Ye,
				mine: new Xe
			}, this._loadBuild = !1, this._buildMenu = new Ze, this._rooms = [], this._roomBuild = new Array, this.AddEvent(), this.AddUPEvent()
		}
		AddEvent() {
			ot.instance.AddListEvent(ot.instance.CLICK_BUILD, this.ClickBuildEvent, this), ot.instance.AddListEvent(ot.instance.COLLECTIVE_BUILD, this.CollectiveBuild, this), ot.instance.AddListEvent(ot.instance.BUILD_NEW, this.Build, this), ot.instance.AddListEvent(ot.instance.BUILD_BUILDORUP, this.BuildOrUp, this), ot.instance.AddListEvent(ot.instance.BUILD_BUILDORUP_ADV, this.BuildOrUpADV, this), ot.instance.AddListEvent(ot.instance.BUILD_CLICKBLICK_INIT, this.ClickBlockInit, this), ot.instance.AddListEvent(ot.instance.BUILD_UPBUILD, this.BuildUp, this), ot.instance.AddListEvent(ot.instance.BUILD_BUILD_DISMANTLE, this.BuildDismantle, this), ot.instance.AddListEvent(ot.instance.BUILD_HANDLEROOMBUFF, this.HandleRoomBuff, this), ot.instance.AddListEvent(ot.instance.BUILD_FINDDOOR, this.FindDoor, this), ot.instance.AddListEvent(ot.instance.BUILD_FINDBEDANDDOOR, this.FindBedAndDoor, this), ot.instance.AddListEvent(ot.instance.BUILD_FINDROOM, this.GetRoom, this), ot.instance.AddListEvent(ot.instance.BUILD_GOTOBED, this.GoToBed, this), ot.instance.AddListEvent(ot.instance.BUILD_GET_ROOMALLBLOCK, this.FindRoomBuild, this), ot.instance.AddListEvent(ot.instance.BUILD_FINDBLOCKPOS, this.FindBlockPos, this), ot.instance.AddListEvent(ot.instance.BUILD_PARALYSIS_ON, this.Paralysis_on, this), ot.instance.AddListEvent(ot.instance.BUILD_SKILLEVENT, this.SkillEvent, this), ot.instance.AddListEvent(ot.instance.BUILD_SETTWINKSKin, this.SetTwinkleSkin, this), ot.instance.AddListEvent(ot.instance.BUILD_SET_ROOM_DIE, this.SetRoomDie, this), ot.instance.AddListEvent(ot.instance.BUILD_GET_AT_BUILDCOUNT, this.GetBuildAtCount, this), ot.instance.AddListEvent(ot.instance.BUILD_GET_GAME_BUILDCOUNT, this.GetBuildGameCount, this), ot.instance.AddListEvent(ot.instance.BUILD_REACHC, this.ReachConditions, this), Z.eventDis.offAllCaller(this), Z.eventDis.on("open_setting", this, () => {
				console.info("打开设置"), this._buildMenu && this._buildMenu.MenuHide()
			})
		}
		AddUPEvent() {
			ht.instance.AddUPEvent("buildManager", this.UpData, this)
		}
		ClickBuildEvent(t, e, i, s) {
			if (null != this.clickBlock.x && null != this.clickBlock.y && this.clickBlock.x == t && this.clickBlock.y == e) return void this._buildMenu.MenuHide();
			this.clickBlock.x = t, this.clickBlock.y = e, this.clickBlock.blockC = null, this.clickBlock.block = null, this.clickBlock.roomIndex = s;
			var n = this._buildInfo[i];
			let a = this.GetRoom(s),
				l = null;
			if (ni.Model == Lt.TrollModel || s != Qt.instance.player.roomIndex) {
				if (!a.bed.isUse && 0 != i.length)
					if (n) {
						let i = t + "_" + e;
						null != (o = n.FindBlockInfo_Pos(i)) && (this.clickBlock.block = o, this.clickBlock.blockC = n, this._buildMenu.BuildUpMenu(o, !1), l = this._buildMenu.head)
					} else {
						let s = a.getBlock(i, {
							x: t,
							y: e
						});
						null != s && (this.clickBlock.block = s, this.clickBlock.blockC = n, this._buildMenu.BuildUpMenu(s), l = this._buildMenu.head)
					}
			} else if (null == n)
				if (0 == i.length) this._buildMenu.BuildMenu(), l = this._buildMenu.head;
				else {
					let s = a.getBlock(i, {
						x: t,
						y: e
					});
					null != s && (this.clickBlock.block = s, this.clickBlock.blockC = n, this._buildMenu.BuildUpMenu(s, !0), l = this._buildMenu.head)
				}
			else {
				let i = t + "_" + e;
				var o;
				null != (o = n.FindBlockInfo_Pos(i)) && (this.clickBlock.block = o, this.clickBlock.blockC = n, this._buildMenu.BuildUpMenu(o), l = this._buildMenu.head)
			}
			null != l && ot.instance.Fire(ot.instance.SET_POS_MENU, t, e, l)
		}
		CollectiveBuild(t) {
			if (!(t.length < 0)) {
				for (let e = 0; e < t.length; e++) {
					let i = t[e];
					this.Build(i.pos, i.build, i.roomIndex)
				}
				this._loadBuild = !0
			}
		}
		Build(t, e, i) {
			let s = e.name.split("_")[0],
				n = this._buildInfo[s],
				a = this.GetRoom(i);
			if (n) {
				let l = n.Build(t, e, a);
				this.AddRoomBuild(i, l), this._loadBuild && (_t.instance.PlaySound(_t.instance.TB_sound.build_build, 1, e.x, e.y), ni.Model == Lt.HumanModel && i == Qt.instance.player.roomIndex && di.instance.player.ModifiedBuileprintQuantity(s, -1))
			} else if (ni.Model == Lt.HumanModel && Qt.instance.player && i == Qt.instance.player.roomIndex) {
				if (di.instance.player.GetBuileprintNum(s) <= 0) {
					ot.instance.Fire(ot.instance.UIGM_TIPS, yi.instance.getLanguage("95")), ot.instance.Fire(ot.instance.MAP_DEMOLISH, e, null);
					let t = di.instance.game.GetRoomPR(i),
						s = e.name.split("_"),
						n = di.instance.build.GetBuildData(s[0], parseInt(s[1]));
					t.gold1 += n[1], t.gold2 += n[2], ot.instance.Fire(ot.instance.MAP_BUILD_DISMANTLE, e, e.x, e.y)
				} else if (a.Build(t, e)) this._loadBuild && (_t.instance.PlaySound(_t.instance.TB_sound.build_build, 1, e.x, e.y), di.instance.player.ModifiedBuileprintQuantity(s, -1));
				else {
					ot.instance.Fire(ot.instance.MAP_DEMOLISH, e, null);
					let t = di.instance.game.GetRoomPR(i),
						s = e.name.split("_"),
						n = di.instance.build.GetBuildData(s[0], parseInt(s[1]));
					t.gold1 += n[1], t.gold2 += n[2], ot.instance.Fire(ot.instance.MAP_BUILD_DISMANTLE, e, e.x, e.y), ot.instance.Fire(ot.instance.UIGM_TIPS, yi.instance.getLanguage("96"))
				}
			} else if (a.Build(t, e)) this._loadBuild && _t.instance.PlaySound(_t.instance.TB_sound.build_build, 1, e.x, e.y);
			else {
				ot.instance.Fire(ot.instance.MAP_DEMOLISH, e, null);
				let t = di.instance.game.GetRoomPR(i),
					s = e.name.split("_"),
					n = di.instance.build.GetBuildData(s[0], parseInt(s[1]));
				t.gold1 += n[1], t.gold2 += n[2], ot.instance.Fire(ot.instance.MAP_BUILD_DISMANTLE, e, e.x, e.y)
			}
		}
		BuildUp(t, e) {
			let i = e.name.split("_")[0];
			this._buildInfo[i].BuildUp(t, e), ni.Model == Lt.HumanModel && _t.instance.PlaySound(_t.instance.TB_sound.build_up, 1, e.x, e.y)
		}
		BuildOrUp(t) {
			if (ni.Model == Lt.TrollModel) return;
			let e = di.instance.game.GetRoomPR(Qt.instance.player.roomIndex),
				i = t.split("_"),
				s = di.instance.build.GetBuildData(i[0], parseInt(i[1]));
			if (0 == s[5].length || this.ReachConditions(s[5], Qt.instance.player.roomIndex))
				if (e.gold1 >= s[1] && e.gold2 >= s[2])
					if (e.gold1 -= s[1], e.gold2 -= s[2], null == this.clickBlock.blockC) ot.instance.Fire(ot.instance.MAP_BUILD_NEW, this.clickBlock.x, this.clickBlock.y, t);
					else {
						let e = this.clickBlock.blockC.FindBlockInfo_Pos(this.clickBlock.x + "_" + this.clickBlock.y);
						null != e ? (_t.instance.PlaySound(_t.instance.TB_sound.build_up), ot.instance.Fire(ot.instance.MAP_UPBUILD, e.build, t), this.clickBlock.blockC.BuildUp(this.clickBlock.x + "_" + this.clickBlock.y), xt.instance.AddEffect(xt.instance.effectStr.buildDownEffect, e.build.x, e.build.y), this._buildMenu.MenuHide()) : ot.instance.Fire(ot.instance.UIGM_TIPS, yi.instance.getLanguage("98"))
					}
			else e.gold1 < s[1] && e.gold2 < s[2] ? ot.instance.Fire(ot.instance.UIGM_TIPS, yi.instance.getLanguage("99")) : e.gold1 < s[1] ? ot.instance.Fire(ot.instance.UIGM_TIPS, yi.instance.getLanguage("100")) : ot.instance.Fire(ot.instance.UIGM_TIPS, yi.instance.getLanguage("101"));
			else {
				let t = s[5].split("_"),
					e = di.instance.build.GetBuildData(t[0], parseInt(t[1]));
				ot.instance.Fire(ot.instance.UIGM_TIPS, yi.instance.getLanguage("97") + e[0])
			}
		}
		BuildOrUpADV(t) {
			if (null == this.clickBlock.blockC) ot.instance.Fire(ot.instance.MAP_BUILD_NEW, this.clickBlock.x, this.clickBlock.y, t);
			else {
				let e = this.clickBlock.blockC.FindBlockInfo_Pos(this.clickBlock.x + "_" + this.clickBlock.y);
				null != e ? (_t.instance.PlaySound(_t.instance.TB_sound.build_up), ot.instance.Fire(ot.instance.MAP_UPBUILD, e.build, t), this.clickBlock.blockC.BuildUp(this.clickBlock.x + "_" + this.clickBlock.y), xt.instance.AddEffect(xt.instance.effectStr.buildDownEffect, e.build.x, e.build.y), this._buildMenu.MenuHide()) : ot.instance.Fire(ot.instance.UIGM_TIPS, yi.instance.getLanguage("98"))
			}
		}
		ReachConditions(t, e) {
			let i = t.split("_"),
				s = parseInt(i[1]);
			return !!this._buildInfo[i[0]].ReachConditions(s, e) || (di.instance.build.GetBuildData(i[0], parseInt(i[1])), !1)
		}
		BuildDismantle() {
			if (null != this.clickBlock.blockC) var t = this.clickBlock.blockC.FindBlockInfo_Pos(this.clickBlock.x + "_" + this.clickBlock.y);
			else {
				let e = (t = this.clickBlock.block).room;
				e.RemoveBuff(t.name), e.BuildDismantle(t)
			}
			let e = t.x,
				i = t.y;
			if (ni.Model == Lt.TrollModel) return;
			let s = di.instance.game.GetRoomPR(Qt.instance.player.roomIndex);
			if (s) {
				let e = di.instance.build.GetBuildData(t.name, t.level),
					i = Math.floor(e[1] / 2),
					n = Math.floor(e[2] / 2);
				s.gold1 += i, s.gold2 += n, 0 != e[1] && Pt.instance.RFEffect("UI/gold1.png", i, t.build, t), 0 != e[2] && Pt.instance.RFEffect("UI/gold2.png", n, t.build, t)
			}
			ie.instance.BuildDismantle(t), t.GameOver(), ot.instance.Fire(ot.instance.MAP_BUILD_DISMANTLE, t.build, e, i), this._buildMenu.MenuHide()
		}
		ClickBlockInit() {
			this.clickBlock.x = null, this.clickBlock.y = null, this.clickBlock.blockC = null, this.clickBlock.roomIndex = null, this.clickBlock.block = null
		}
		UpData() {
			for (let t = 0; t < this._rooms.length; t++) {
				this._rooms[t].UpHandle()
			}
			this._buildInfo.mine.UpData(), this._buildInfo.door.UpData(), this._buildInfo.game.UpData(), this._buildInfo.at.UpData(), this._buildInfo.bed.UpData()
		}
		FindDoor(t) {
			return this._buildInfo.door.FindBlockInfo_RoomIndex(t)
		}
		FindBedAndDoor(t) {
			return {
				bed: this._buildInfo.bed.FindBlockInfo_RoomIndex(t),
				door: this.FindDoor(t)
			}
		}
		GoToBed(t, e, i = !1, s = !1) {
			t.build.skin = "build/bed_1.png", t.head = e, t.isOpen = !0;
			let n = this.FindDoor(t.room.roomIndex);
			if (n.CloseDoor(s), ot.instance.Fire(ot.instance.MGM_SET_BLOCKDYNWALKABLE, n.x, n.y, n.isOpen), i) {
				let e = ot.instance.FireReturn(ot.instance.MGM_GET_BLOCKPOSS, t.room.roomIndex);
				null != e && (this._buildMenu.TwinkleHandle(e), this._roomBlock = this.GetRoomBuild(t.room.roomIndex).block, this._buildMenu.room = t.room, rt.instance.AddTimeLoopEvent("RoomBuildUp", this.RoomBuildUp, this, .02))
			}
		}
		FindRoomBuild(t) {
			let e = [];
			for (let i in this._buildInfo) {
				let s = this._buildInfo[i].GetRoomAllBlock(t);
				null != s && (e = e.concat(s))
			}
			return e.length > 0 ? e : null
		}
		FindBlockPos(t, e) {
			for (let e in this._buildInfo) {
				let i = this._buildInfo[e].FindBlockInfo_Pos(t);
				if (null != i) return i
			}
			if (-1 != e) {
				return this.GetRoom(e).PosFindBlock(t)
			}
			return null
		}
		GameOver() {
			je.instence.GameOver(), qe.GameOver(), this.ClearRoom(), this._buildMenu.GameOver(), this._buildInfo.mine.GameOver(), this._buildInfo.at.GameOver(), this._buildInfo.bed.GameOver(), this._buildInfo.door.GameOver(), this._buildInfo.game.GameOver(), this._buildMenu.MenuHide(), this._buildMenu.HideOff(), this.clickBlock = {
				x: null,
				y: null,
				blockC: null,
				roomIndex: null,
				block: null
			}, this._roomBlock = null, this._roomBuild.length = 0, this._loadBuild = !1
		}
		ClearRoom() {
			for (let t = 0; t < this._rooms.length; t++) {
				this._rooms[t].GameOver()
			}
		}
		GetRoom(t) {
			if (t >= 0 && t < this._rooms.length)
				for (let e = 0; e < this._rooms.length; e++) {
					let i = this._rooms[e];
					if (t == i.roomIndex) return i
				}
			let e = new qe(t);
			return this._rooms.push(e), this.SortRoom(), e
		}
		StartGame() {
			if (this._rooms.length > 0)
				for (let t = 0; t < this._rooms.length; t++) {
					this._rooms[t].StartGame()
				}
			this._buildMenu.StartGame()
		}
		Paralysis_on(t) {
			if (t.length > 0) {
				for (let e = 0; e < t.length; e++) {
					let i = t[e],
						s = this._buildInfo.at.FindBlockInfo_Pos(i);
					s && s.isUse && (s.paralysis = !0, xt.instance.AddEffect(xt.instance.effectStr.build_vertigo, s.x, s.y, !0, 3e3), ie.instance.buildVertigoEffect(s))
				}
				this._paralyss = t, rt.instance.AddTimeOnceEvent("paralysis_off", this.paralysis_off, this, 3)
			}
		}
		paralysis_off() {
			let t = this._paralyss;
			if (t.length > 0)
				for (let e = 0; e < t.length; e++) {
					let i = t[e],
						s = this._buildInfo.at.FindBlockInfo_Pos(i);
					s && s.isUse && (s.paralysis = !1)
				}
			this._paralyss = null
		}
		HandleRoomBuff(t, e) {
			if (t < this._rooms.length && t >= 0) {
				this._rooms[t].HandleRoomBuff(e)
			}
		}
		SortRoom() {
			if (this._rooms.length > 1)
				for (let t = 0; t < this._rooms.length - 1; t++)
					for (let e = t + 1; e < this._rooms.length; e++)
						if (this._rooms[t].roomIndex > this._rooms[e].roomIndex) {
							let i = this._rooms[t];
							this._rooms[t] = this._rooms[e], this._rooms[e] = i
						}
		}
		SkillEvent(t, e) {
			let i = this._rooms[t];
			i && i.SkillEvent(e)
		}
		GetRoomBuild(t) {
			if (this._roomBuild.length > 0)
				for (let e = 0; e < this._roomBuild.length; e++) {
					let i = this._roomBuild[e];
					if (i.roomIndex == t) return i
				}
			let e = {
				roomIndex: t,
				block: []
			};
			return this._roomBuild.push(e), e
		}
		AddRoomBuild(t, e) {
			let i = this.GetRoomBuild(t);
			for (let t = 0; t < i.block.length; t++) {
				if (i.block[t] == e) return
			}
			i.block.push(e)
		}
		RoomBuildUp() {
			if (this._roomBlock && this._roomBlock.length > 0)
				for (let t = this._roomBlock.length - 1; t >= 0; t--) {
					let e = this._roomBlock[t];
					e.isUse ? this.UpInspect(e.name, e.level + 1) ? (ni.Model == Lt.HumanModel && (e.room.roomIndex, Qt.instance.player.roomIndex), e.isPromptUp || (this.SetTwinkleSkin(e.x, e.y, 0), e.isPromptUp = !0, e.ShowPromptUp(), ni.Model == Lt.HumanModel && (e.room.roomIndex, Qt.instance.player.roomIndex))) : e.isPromptUp && (this.SetTwinkleSkin(e.x, e.y), e.isPromptUp = !1, e.HidePromptUp()) : this._roomBlock.splice(t, 1)
				}
		}
		SetTwinkleSkin(t, e, i = 1) {
			this._buildMenu.setTwinkleSkin(t, e, i)
		}
		UpInspect(t, e) {
			let i = t + "_" + e;
			if (ni.Model == Lt.TrollModel) return;
			let s = di.instance.game.GetRoomPR(Qt.instance.player.roomIndex),
				n = i.split("_"),
				a = di.instance.build.GetBuildData(n[0], parseInt(n[1]));
			return !!a && (!(0 != a[5].length && !this.ReachConditions(a[5], Qt.instance.player.roomIndex)) && (s.gold1 >= a[1] && s.gold2 >= a[2]))
		}
		SetRoomDie(t) {
			this.GetRoom(t).die = !0
		}
		GetBuildAtCount(t) {
			return this._buildInfo.at.FindBlockInfo_RoomIndex_count(t)
		}
		GetBuildGameCount(t) {
			return this._buildInfo.game.FindBlockInfo_RoomIndex_count(t)
		}
	}! function(t) {
		t[t.move = 0] = "move", t[t.wait = 1] = "wait", t[t.attack = 2] = "attack", t[t.vertigo = 3] = "vertigo", t[t.escape = 4] = "escape", t[t.ide = 5] = "ide"
	}(bt || (bt = {})),
	function(t) {
		t[t.ide = 0] = "ide", t[t.attack = 1] = "attack", t[t.move = 2] = "move"
	}(At || (At = {}));
	class $e {
		constructor() {
			this._path = null
		}
		FindTheTarget() {}
		AddUpEvent() {}
		Move() {
			if (null != this._path && (this._troll.StateDetection(bt.move) || this._troll.StateDetection(bt.escape)) && !this._troll.StateDetection(bt.vertigo) && this._path.length > 0) {
				let e = ot.instance.FireReturn(ot.instance.MGM_AIORTROLLIS_MOVE, this._path[0][0], this._path[0][1]);
				if (null != e) return ot.instance.Fire(ot.instance.TL_STARTATTACK, e), void(this._path = null);
				let i = this._troll.speed,
					s = this._path[0],
					n = this._troll.x - s[0],
					a = this._troll.y - s[1];
				var t = Math.abs(n) + Math.abs(a);
				let l = this._troll.gethpStrip();
				n > 0 ? (this._troll.x -= i * (Math.abs(n) / t), this._troll.troll.scaleX = -1, null != l && (l.scaleX = -1)) : n < 0 && (this._troll.x += i * (Math.abs(n) / t), this._troll.troll.scaleX = 1, null != l && (l.scaleX = 1)), n > 0 ? this._troll.x -= i * (Math.abs(n) / t) : n < 0 && (this._troll.x += i * (Math.abs(n) / t)), a > 0 ? (this._troll.y -= i * (Math.abs(a) / t), this._troll.troll.zOrder = this._troll.y) : a < 0 && (this._troll.y += i * (Math.abs(a) / t), this._troll.troll.zOrder = this._troll.y), Math.abs(n) < i && (this._troll.x = s[0]), Math.abs(a) < i && (this._troll.y = s[1]), this._troll.x == s[0] && this._troll.y == s[1] && (_t.instance.PlaySound(_t.instance.TB_sound.troll_Wll, 1, this._troll.x, this._troll.y), 1 == this._path.length ? (this._path = null, ot.instance.Fire(ot.instance.TL_MOVEOVER_HANDLE)) : (this._path.shift(), ot.instance.Fire(ot.instance.TL_MOVESELECT_HANDLE)))
			}
		}
		set troll(t) {
			this._troll = t
		}
		set path(t) {
			this._path = t
		}
		get path() {
			return this._path
		}
	}! function(t) {
		t[t.justfierce = 0] = "justfierce", t[t.healthy = 1] = "healthy", t[t.weak = 2] = "weak", t[t.counselled = 3] = "counselled"
	}(St || (St = {})),
	function(t) {
		t[t.move = 0] = "move", t[t.wait = 1] = "wait", t[t.attack = 2] = "attack", t[t.vertigo = 3] = "vertigo", t[t.escape = 4] = "escape", t[t.ide = 5] = "ide"
	}(vt || (vt = {})),
	function(t) {
		t[t.ide = 0] = "ide", t[t.attack = 1] = "attack", t[t.move = 2] = "move"
	}(Tt || (Tt = {}));
	class ti {
		constructor() {
			this._aroundBuild = [], this._Uptime = null, this._moveOverHandle = null, this._moveSelectHandle = null, this._UpDatahandle = null, this._homeTime = 0, this._eTime = 0, this._aeTime = 0, this._eTimePro = .5, this._eHpPro = .3, this._aroundPlayer = void 0, this._curAtPlayer = void 0, this._attackTarget = void 0, this._attackTime = null, this._inSafePlace = !1, this._addEx = 0, this._aroundBuild = [], this.logicState = St.justfierce, this._Uptime = null, this._moveOverHandle = null, this._moveSelectHandle = null, this._UpDatahandle = null, this._homeTime = 0, this._eTime = 0, this._aeTime = 0, this._eTimePro = .5, this._eHpPro = .3, this.CC_troll = new $e, this.AddEvent()
		}
		GameOver() {
			Laya.timer.clearAll(this), this._aroundBuild = [], this._aroundPlayer = void 0, this._curAtPlayer = void 0, this._attackTarget = void 0, this.logicState = St.justfierce, this._moveOverHandle = null, this._moveSelectHandle = null, this._UpDatahandle = null, this._Uptime = null, this._attackTime = null, this._homeTime = 0, this._troll.troll.removeSelf(), this.CC_troll.path = null, this._addEx = 0
		}
		StartGame() {
			this._eTimePro = di.instance.troll.eTimePro, this._eHpPro = di.instance.troll.eHpPro
		}
		set troll(t) {
			this._troll = t, this.CC_troll.troll = t
		}
		get troll() {
			return this._troll
		}
		AddEvent() {
			ot.instance.AddListEvent(ot.instance.TL_GET_AROUNDPLAYER, this.GetTrollAroundPlayer, this), ot.instance.AddListEvent(ot.instance.TL_MOVESELECT_HANDLE, this.MoveSelectHandle, this), ot.instance.AddListEvent(ot.instance.TL_MOVEOVER_HANDLE, this.MoveOverHander, this), ot.instance.AddListEvent(ot.instance.TL_STARTATTACK, this.StartAttack, this), ot.instance.AddListEvent(ot.instance.TL_TROLLHIT, this.Hit, this), ot.instance.AddListEvent(ot.instance.TL_MOVESPEED_REDUCTION, this.MoveSpeedReduction, this), ot.instance.AddListEvent(ot.instance.TL_VERTIGO_REDUCTION, this.VertigoReduction, this), ot.instance.AddListEvent(ot.instance.TL_TROLL_SAFE, this.TrollSafe, this), ot.instance.AddListEvent(ot.instance.TL_TROLLMOVE, this.TrollMove, this)
		}
		UpData() {
			null != this._Uptime && rt.instance.AfterAPeriodOfTime_Bool(this._Uptime, .5) && (this.Reduction(), this._Uptime = rt.instance.gameTime), ni.Model == Lt.HumanModel && this._troll.IsPlayIndex(Tt.move) && this.CC_troll.Move(), null != this._UpDatahandle && this._UpDatahandle(), ni.Model == Lt.TrollModel && (this._inSafePlace ? (this.HomeBB(), ie.instance.showTrollRBloodEffect()) : ie.instance.hideTrollRBloodEffect(), 0 == this._addEx && (this._addEx = rt.instance.gameTime), rt.instance.AfterAPeriodOfTime_Bool(this._addEx, 2) && (this._addEx = rt.instance.gameTime, this.troll.addEx()))
		}
		TrollAttack() {
			if (this._troll.troll.play(1, !1), this._troll.Attack(), rt.instance.AfterAPeriodOfTime_Bool(this._attackTime, 20) && (this._troll.TrollSkill(), this._attackTime = Number.MAX_VALUE), null != this._attackTarget && null != this._attackTarget.x && null != this._attackTarget.y) {
				_t.instance.PlaySound(_t.instance.TB_sound.troll_attack, 1, this._troll.x, this._troll.y), xt.instance.AddEffect(xt.instance.effectStr.trollAttackEffect, this._attackTarget.x, this._attackTarget.y);
				let t = this._attackTarget.Hit(this._troll.power);
				this._curAtPlayer != this._attackTarget && this._troll.AttackEvent(this._attackTarget), ni.Model == Lt.TrollModel && (null == this._curAtPlayer && this._attackTarget instanceof Re || this._curAtPlayer instanceof Zt && null == this._curAtPlayer.name) && (this.GetTrollAroundPlayer(), this._aroundPlayer.length > 0 && (this._curAtPlayer = this._aroundPlayer[0], this._attackTarget = this._curAtPlayer)), t || (null == this._curAtPlayer || this._curAtPlayer.bed != this._attackTarget && this._curAtPlayer != this._attackTarget ? (null == this._curAtPlayer ? this.AttackBuild() : null != this._curAtPlayer.bed ? this._attackTarget = this._curAtPlayer.bed : this.AttackBuild(), this.SetMovePath()) : (this.PlayerDie(this._curAtPlayer), ni.Model == Lt.TrollModel && (this._curAtPlayer = void 0, this._attackTarget = void 0)), ni.Model == Lt.TrollModel && (this._UpDatahandle = null))
			}
		}
		PlayerDie(t) {
			if (!t || null == t) return;
			t.Hit(500);
			let e = t.bed;
			t.bed = null, ot.instance.Fire(ot.instance.BUILD_SET_ROOM_DIE, t.roomIndex), ot.instance.Fire(ot.instance.MGM_ROOMBLACK, t.roomIndex), null != e && e.isUse && e.GameOver(), ot.instance.Fire(ot.instance.UIGM_TIPS, yi.instance.getLanguage("189") + t.name + yi.instance.getLanguage("195")), ni.Model == Lt.HumanModel ? t.isGod && ot.instance.Fire(ot.instance.GM_GAMEOVER) : ni.Model == Lt.TrollModel ? Qt.instance.allDead && ot.instance.Fire(ot.instance.GM_GAMEOVER, !0) : ni.Model == Lt.HumanModel && (this.FindPlayer(), this.SetMovePath())
		}
		BloodVolumeDetector() {
			this._troll.StateDetection(vt.escape) || this._troll.hp <= this._eHpPro && this.Escape()
		}
		TrollPatrol() {
			if (ni.Model == Lt.TrollModel) return;
			let t = ot.instance.FireReturn(ot.instance.MGM_GET_ROOMCOUNT),
				e = Math.floor(Math.random() * t),
				i = ot.instance.FireReturn(ot.instance.BUILD_FINDBEDANDDOOR, e);
			i.door.isOpen ? this._attackTarget = i.bed : this._attackTarget = i.door, this._moveSelectHandle = this.Chase, this._moveOverHandle = this.SelectDaquan, this._UpDatahandle = null, this.SetMovePath()
		}
		SelectDaquan() {
			switch (Math.floor(2 * Math.random())) {
				case 0:
					this.TrollPatrol();
					break;
				case 1:
					this.FindPlayer()
			}
		}
		AttackBuild() {
			if (this.GetTrollAroundPlayer(), this._aroundPlayer.length > 0) this._curAtPlayer = this._aroundPlayer[0], this._attackTarget = this._curAtPlayer, this.SetMovePath();
			else if (this._aroundBuild.length <= 3 && (this._aroundBuild = ot.instance.FireReturn(ot.instance.MGM_FIND_AROUND_BUILD, this._troll.x, this._troll.y)), this._aroundBuild.length > 0) {
				let t = this._aroundBuild.shift(),
					e = ot.instance.FireReturn(ot.instance.MGM_FINDPOSBLOCK, t[0], t[1]);
				this._attackTarget = e
			} else this.FindPlayer()
		}
		FindPlayer() {
			if (ni.Model == Lt.TrollModel) return;
			let t = this.players,
				e = Math.floor(Math.random() * t.length);
			if (t[e].isDie) {
				if (this._curAtPlayer = t[e], this._curAtPlayer.isRoom) {
					let t = ot.instance.FireReturn(ot.instance.BUILD_FINDDOOR, this._curAtPlayer.curRoom);
					null == t || t.isOpen ? this._attackTarget = this._curAtPlayer : this._attackTarget = t
				} else this._attackTarget = this._curAtPlayer;
				this._UpDatahandle = null, this._moveSelectHandle = this.Chase, this._moveOverHandle = this.Chase, this.SetMovePath()
			} else this.FindPlayer()
		}
		SetMovePath() {
			if (ni.Model == Lt.TrollModel) return;
			let t = ot.instance.FireReturn(ot.instance.MGM_START_END_PATH, this._troll.x, this._troll.y, this._attackTarget.x, this._attackTarget.y);
			if (null != t && 0 == t.length && (this.GetTrollAroundPlayer(), this._aroundPlayer.length > 0)) {
				this._curAtPlayer = this._aroundPlayer[0], this._attackTarget = this._curAtPlayer;
				let e = this._curAtPlayer.player;
				t.push([Math.round(e.x), Math.round(e.y)])
			}
			null != t && t && 0 != t.length ? (this.CC_troll.path = t, this._troll.IsPlayIndex(Tt.move) || this._troll.setplay(Tt.move, !0), this._troll.state = vt.move, _t.instance.PlaySound(_t.instance.TB_sound.troll_Wll, 1, this._troll.x, this._troll.y)) : this.AttackBuild()
		}
		Chase() {
			if (ni.Model != Lt.TrollModel)
				if (this.GetTrollAroundPlayer(), this._aroundPlayer.length > 0) {
					let t = Math.floor(Math.random() * this._aroundPlayer.length);
					this._curAtPlayer = this._aroundPlayer[t], this._attackTarget = this._curAtPlayer, this.SetMovePath(), this._UpDatahandle = null, this._moveSelectHandle = null, this._moveOverHandle = this.StartAttack
				} else null == this.CC_troll.path && this.FindPlayer()
		}
		Escape() {
			if (ni.Model == Lt.TrollModel) return;
			if (this.troll.StateDetection(vt.escape) || this.troll.StateDetection(vt.vertigo)) return;
			this._troll.state = vt.escape;
			let t = di.instance.build.GetTrollPos();
			this._UpDatahandle = null, this._moveSelectHandle = null, t = ot.instance.FireReturn(ot.instance.MGM_GET_DATAPOSTMAPPOS, t[0], t[1]);
			let e = ot.instance.FireReturn(ot.instance.MGM_START_END_PATH, this._troll.x, this._troll.y, t[0], t[1]);
			null != e ? (this.CC_troll.path = e, this._moveOverHandle = this.EscapeMoveOverHandle, this._troll.IsPlayIndex(Tt.move) || this._troll.setplay(Tt.move, !0), ot.instance.Fire(ot.instance.BUILD_HANDLEROOMBUFF, this._attackTarget.roomIndex, 1), this.troll.Escape()) : this.Escape()
		}
		EscapeMoveOverHandle() {
			this._homeTime = rt.instance.gameTime, this._moveOverHandle = null, this._UpDatahandle = this.HomeUpHandle
		}
		HomeUpHandle() {
			rt.instance.AfterAPeriodOfTime_Bool(this._homeTime, 1) && (this._homeTime = rt.instance.gameTime, this.HomeBB())
		}
		HomeBB() {
			this._troll.hpCur += .1 * this._troll.hpMax, ie.instance.showTrollRBloodEffect(), ni.Model == Lt.HumanModel && 1 == this._troll.hp && (this._UpDatahandle = null, ie.instance.hideTrollRBloodEffect(), this.FindPlayer())
		}
		MoveOverHander() {
			null != this._moveOverHandle && this._moveOverHandle()
		}
		MoveSelectHandle() {
			null != this._moveSelectHandle && this._moveSelectHandle()
		}
		AttackHandle() {
			if (this._troll.StateDetection(vt.attack) && (rt.instance.AfterAPeriodOfTime_Bool(this._troll.lastAtTime, this._troll.atSpeed) && (this._troll.lastAtTime = rt.instance.gameTime, this.AtRadius(this._attackTarget.x, this._attackTarget.y) ? (null == this._attackTime && (this._attackTime = rt.instance.gameTime), this.TrollAttack()) : this.Chase()), rt.instance.AfterAPeriodOfTime_Bool(this._eTime, this.aeTime))) {
				this._eTime = rt.instance.gameTime, Math.random() < this._eTimePro && (this.troll.hp > .5 ? this.FindPlayer() : this.Escape())
			}
		}
		StartAttack(t = null) {
			null != t && (this._attackTarget = t, this.troll.StartAttack(this._attackTarget), ot.instance.Fire(ot.instance.BUILD_HANDLEROOMBUFF, t.roomIndex, 2), ot.instance.Fire(ot.instance.PAIL_SET_ATTACKEDAI, t.roomIndex), this._curAtPlayer && ot.instance.Fire(ot.instance.UIGM_PLAYERHITEFFECT, this._curAtPlayer.uid)), console.log("猛鬼开始攻击"), this._UpDatahandle = this.AttackHandle, this.troll.state = vt.attack, this._Uptime = rt.instance.gameTime, this._eTime = rt.instance.gameTime
		}
		Hit(t, e) {
			if (!(this._troll.hp <= 0)) {
				if (this._troll.hit(t), this._troll.hp <= 0) {
					let t = Qt.instance.GetPlayerName(e);
					return null == t ? ot.instance.Fire(ot.instance.UIGM_TIPS, yi.instance.getLanguage("190")) : ot.instance.Fire(ot.instance.UIGM_TIPS, yi.instance.getLanguage("191") + t), ni.Model == Lt.HumanModel && e == Qt.instance.player.roomIndex ? di.instance.game.isMvp = !0 : di.instance.game.isMvp = !1, di.instance.game.mvpIndex = Qt.instance.GetPlayerSkinId(e), ni.Model == Lt.HumanModel ? ot.instance.Fire(ot.instance.GM_GAMEOVER, !0) : ni.Model == Lt.TrollModel && ot.instance.Fire(ot.instance.GM_GAMEOVER, !1), void ie.instance.trollDead()
				}
				this._troll.StateDetection(vt.escape) || this.BloodVolumeDetector()
			}
		}
		get players() {
			return Qt.instance.playerSorts
		}
		GetTrollAroundPlayer() {
			let t = [],
				e = this.players;
			for (let i = 0; i < e.length; i++) {
				let s = e[i];
				if (!s.isDie) continue;
				if (-1 != s.curRoom) {
					let t = ot.instance.FireReturn(ot.instance.BUILD_FINDDOOR, s.curRoom);
					if (null != t && !t.isOpen) continue
				}
				let n = Math.abs(s.x - this._troll.x),
					a = Math.abs(s.y - this._troll.y);
				n * n + a * a < this._troll.r && t.push(s)
			}
			this._aroundPlayer = t
		}
		AtRadius(t, e) {
			let i = Math.abs(this._troll.x - t),
				s = Math.abs(this._troll.y - e);
			return i * i + s * s <= this._troll.atR
		}
		MoveSpeedReduction(t) {
			this._troll.speedScale -= t, this._troll.moveSpeedTime = rt.instance.gameTime
		}
		VertigoReduction(t = 0) {
			this._troll.vertigoTime = t
		}
		Reduction() {
			this._troll.StateDetection(vt.vertigo) && rt.instance.AfterAPeriodOfTime_Bool(this._troll.startVertiogTime, this._troll.vertigoTime) && this.VertigoReduction()
		}
		get aeTime() {
			return this._troll.level >= 5 ? this._aeTime = 20 : this._aeTime = 10, this._aeTime
		}
		TrollSafe() {
			let t = ot.instance.FireReturn(ot.instance.MGM_POSINSAFE, this._troll.x, this._troll.y);
			this._inSafePlace = t, this._troll.InSafe(t)
		}
		TrollMove() {
			this._troll.IsPlayIndex(Tt.move) || this._troll.setplay(Tt.move, !0), ie.instance.trollMove(this._troll), this._troll.state = vt.move, _t.instance.PlaySound(_t.instance.TB_sound.troll_Wll, 1, this._troll.x, this._troll.y)
		}
	}
	class ei {
		Move(t, e) {
			let i = t.speed,
				s = e,
				n = t.x - s[0],
				a = t.y - s[1],
				l = Math.abs(n) + Math.abs(a);
			return n > 0 ? (t.x -= i * (Math.abs(n) / l) * 2, t.direction = -1) : n < 0 && (t.x += i * (Math.abs(n) / l) * 2, t.direction = 1), a > 0 ? (t.y -= i * (Math.abs(a) / l) * 2, t.player.zOrder = t.y) : a < 0 && (t.y += i * (Math.abs(a) / l) * 2, t.player.zOrder = t.y), Math.abs(n) < i && (t.x = s[0]), Math.abs(a) < i && (t.y = s[1]), t.x == s[0] && t.y == s[1]
		}
		GoToBed(t, e) {
			t.player.visible = !1, t.player.stop(), t.player.pos(e.x, e.y), t.bed = e, ot.instance.Fire(ot.instance.BUILD_GOTOBED, e, t.id, 0 == t.uid), ie.instance.goBed(t)
		}
	}
	class ii {
		constructor() {
			this._AILevelNum = 4, this._build = [
				["game_1", "at_1"],
				["ice_1", "barb_1", "particlea_1", "spell_1", "entrapment_1", "guillotine_1", "energyhood_1", "smoney_1", "longrange_1", "solenoid_1", "repair_1", "mine_1", "mine_2", "mine_3", "mine_4"]
			], this._bed_4 = ["game_1", "at_1"], this._AILevelNum = 4, this._AILevelArr = [
				[1.6, 1.7, 1.8, 1.9, 2],
				[1.3, 1.4, 1.5, 1.6, 1.7],
				[1.2, 1.3, 1.4, 1.5, 1.6],
				[1.1, 1.2, 1.3, 1.4, 1.5],
				[1, 1.05, 1.1, 1.15, 1.2]
			], this._AI = {
				player: [],
				room: [],
				bed: [],
				target: [],
				path: [],
				build: [],
				nextBuild: [],
				weight: []
			}, this._noTarget = [], this.CC_Player = new ei
		}
		StartGame() {
			this.FindRoom(), this.RetestAI(), this.GetPath(), this.AddMoveHandle(), this.AIGoTobedOver(), rt.instance.AddTimeLoopEvent("GoldCoinDetection", this.GoldCoinDetection, this, 1), this.RandomAILevel()
		}
		RandomAILevel() {
			this._AILevelNum = Math.floor(Math.random() * this._AILevelArr.length)
		}
		AddMoveHandle() {
			ht.instance.AddUPEvent("AIMove", this.PlayerMoveHandle, this)
		}
		RemoveMoveHandle() {
			ht.instance.removeListEvent("AIMove"), rt.instance.RemoveListLoopEvent("GoldCoinDetection")
		}
		AddEvent() {
			ot.instance.AddListEvent(ot.instance.PAIL_FILTERDIEAI, this.FilterDieAI, this), ot.instance.AddListEvent(ot.instance.PAIL_KILLPLAYER, this.KillPlayer, this), ot.instance.AddListEvent(ot.instance.PAIL_SET_ATTACKEDAI, this.setAttackedAI, this)
		}
		FindRoom() {
			let t = ot.instance.FireReturn(ot.instance.MGM_GET_ROOMCOUNT),
				e = [];
			for (let i = 0; i < t; i++) e.push(i);
			for (let t = 0; t < this._AI.player.length; t++) {
				let i = Math.floor(Math.random() * e.length),
					s = e[i];
				e.splice(i, 1);
				let n = ot.instance.FireReturn(ot.instance.BUILD_FINDBEDANDDOOR, s);
				null == n || n.bed.isOpen ? (this._AI.bed.push(null), this._AI.target.push(null), this._noTarget.push(t)) : (this._AI.bed.push(n.bed), n.door.isOpen ? this._AI.target.push(n.bed) : this._AI.target.push(n.door)), this._AI.path.push(null)
			}
		}
		GetPath() {
			for (let t = 0; t < this._AI.player.length; t++) this.SetPath(t)
		}
		SetPath(t) {
			let e = this._AI.player[t],
				i = this._AI.target[t];
			if (null != i) {
				let s = ot.instance.FireReturn(ot.instance.MGM_START_END_PATH, e.x, e.y, i.x, i.y);
				this._AI.path[t] = s
			} else this._AI.path[t] = null
		}
		RetestAI() {
			let t = ot.instance.FireReturn(ot.instance.MGM_GET_ROOMCOUNT);
			for (let e = 0; e < t; e++) {
				let t = ot.instance.FireReturn(ot.instance.BUILD_FINDBEDANDDOOR, e);
				if ((t.bed || null != t.bed) && (!t.bed.isOpen && t.bed.isUse)) {
					if (!(this._noTarget.length > 0)) return; {
						let e = this._noTarget.shift();
						this._AI.bed[e] = t.bed, t.door.isOpen ? this._AI.target[e] = t.bed : this._AI.target[e] = t.door
					}
				}
			}
		}
		PlayerMoveHandle() {
			let t = 0;
			for (let e = 0; e < this._AI.player.length; e++) {
				let i = this._AI.player[e],
					s = this._AI.path[e];
				i.isDie && (null != s && s.length > 0 ? this.CC_Player.Move(i, s[0]) && (s.shift(), 0 == s.length ? this._AI.bed[e].isOpen && this._AI.bed[e].isUse ? (this._AI.bed[e] = null, this._AI.target[e] = null, this._noTarget.push(e), this.RetestAI(), this.SetPath(e)) : (this.CC_Player.GoToBed(i, this._AI.bed[e]), i.roomIndex = i.curRoom, this._AI.room[e] = ot.instance.FireReturn(ot.instance.BUILD_FINDROOM, i.roomIndex), i.isbed = !0, this.UpOrBuild(e)) : (i.curRoom = ot.instance.FireReturn(ot.instance.MGM_GET_BLOCKFINDROOM, i.x, i.y), -1 == i.curRoom ? i.isRoom = !1 : i.isRoom = !0, this._AI.bed[e].isOpen && this._AI.bed[e].isUse && (this._AI.bed[e] = null, this._AI.target[e] = null, this._noTarget.push(e), this.RetestAI(), this.SetPath(e)))) : t++)
			}
			t >= (ni.Model == Lt.TrollModel ? 6 : 5) && ht.instance.removeListEvent("AIMove")
		}
		set players(t) {
			this._AI.player = t
		}
		FilterDieAI() {
			for (let t = this._AI.player.length - 1; t >= 0; t--) {
				this._AI.player[t].isDie || this._AI.player.splice(t, 1)
			}
		}
		GoldCoinDetection() {
			this.AttackedAIEventHandle();
			for (let t = 0; t < this._AI.player.length; t++) {
				let e = this._AI.player[t];
				if (!e.isDie) continue;
				if (!e.isbed) continue;
				let i = di.instance.game.GetRoomPR(e.roomIndex),
					s = "";
				if (null == this._AI.nextBuild[t].build)
					if (null != this._AI.nextBuild[t].upbuild && this._AI.nextBuild[t].upbuild.isUse) {
						let e = this._AI.nextBuild[t].upbuild.level + 1;
						s = this._AI.nextBuild[t].upbuild.name + "_" + e
					} else s = "";
				else s = this._AI.nextBuild[t].build;
				let n = s.split("_"),
					a = di.instance.build.GetBuildData(n[0], parseInt(n[1]));
				if (null != a)
					if (i.gold1 >= a[1] && i.gold2 >= a[2]) {
						if (null == this._AI.nextBuild[t].build) {
							i.gold1 -= a[1], i.gold2 -= a[2], ot.instance.Fire(ot.instance.MAP_UPBUILD, this._AI.nextBuild[t].upbuild.build, s);
							let e = this._AI.nextBuild[t].upbuild.build.x + "_" + this._AI.nextBuild[t].upbuild.build.y;
							if (ot.instance.Fire(ot.instance.BUILD_UPBUILD, e, this._AI.nextBuild[t].upbuild), parseInt(n[1]) > 5) {
								let e = this._AI.room[t];
								if (1 == e.prLevel) {
									let t = Math.floor(Math.random() * this._AILevelArr[this._AILevelNum].length);
									e.prLevel = this._AILevelArr[this._AILevelNum][t]
								}
							}
						} else {
							let t = null;
							null != (t = "at" == n[0] ? ot.instance.FireReturn(ot.instance.MGM_GET_OPENSPACE, e.roomIndex, !0) : ot.instance.FireReturn(ot.instance.MGM_GET_OPENSPACE, e.roomIndex)) && (i.gold1 -= a[1], i.gold2 -= a[2], ot.instance.Fire(ot.instance.MAP_BUILD_NEW, t.x, t.y, s))
						}
						this._AI.nextBuild[t].build = null, this._AI.nextBuild[t].mod = null, this._AI.nextBuild[t].upbuild = null, this.UpOrBuild(t)
					} else {
						Math.random() < .2 && (this._AI.nextBuild[t].build = null, this._AI.nextBuild[t].mod = null, this._AI.nextBuild[t].upbuild = null, this.UpOrBuild(t))
					}
				else this._AI.nextBuild[t].build = null, this._AI.nextBuild[t].mod = null, this._AI.nextBuild[t].upbuild = null, this.UpOrBuild(t)
			}
		}
		UpOrBuild(t) {
			if (null == this._AI.nextBuild[t].mod) {
				this.GetAiBuild(t);
				let e = [
					[],
					[],
					[],
					[]
				];
				for (let i = 0; i < this._AI.build[t].length; i++) {
					let s = this._AI.build[t][i],
						n = s.name;
					"bed" == n ? e[0].push(s) : "at" == n ? e[1].push(s) : "door" == n ? e[2].push(s) : "game" == n && e[3].push(s)
				}
				if (!(e[0].length > 0 && e[2].length > 0)) return;
				let i = e[0][0],
					s = e[2][0];
				if (i.level < 5) {
					let n = Math.random();
					if (n < .7) 10 == i.level ? (this._AI.nextBuild[t].mod = 1, this._AI.nextBuild[t].build = this._build[0][this._AI.nextBuild[t].mod]) : this._AI.nextBuild[t].upbuild = e[0][0];
					else if (n < .75)
						if (e[1].length > 0) {
							let i = Math.floor(Math.random() * e[1].length);
							this._AI.nextBuild[t].upbuild = e[1][i]
						} else this._AI.nextBuild[t].mod = 1, this._AI.nextBuild[t].build = this._build[0][this._AI.nextBuild[t].mod];
					else 13 == s.level ? (this._AI.nextBuild[t].mod = 0, this._AI.nextBuild[t].build = this._build[0][this._AI.nextBuild[t].mod]) : this._AI.nextBuild[t].upbuild = e[2][0]
				} else {
					if (Math.random() < .65) {
						let n = Math.random();
						if (n < .4) 10 == i.level ? (this._AI.nextBuild[t].mod = 1, this._AI.nextBuild[t].build = this._build[0][this._AI.nextBuild[t].mod]) : this._AI.nextBuild[t].upbuild = e[0][0];
						else if (n < .7)
							if (e[1].length > 0) {
								let i = Math.floor(Math.random() * e[1].length);
								this._AI.nextBuild[t].upbuild = e[1][i]
							} else this._AI.nextBuild[t].mod = 1, this._AI.nextBuild[t].build = this._build[0][this._AI.nextBuild[t].mod];
						else if (n < .85) 13 == s.level ? (this._AI.nextBuild[t].mod = 0, this._AI.nextBuild[t].build = this._build[0][this._AI.nextBuild[t].mod]) : this._AI.nextBuild[t].upbuild = e[2][0];
						else if (e[3].length > 0) {
							let i = Math.floor(Math.random() * e[3].length);
							this._AI.nextBuild[t].upbuild = e[3][i]
						} else this._AI.nextBuild[t].mod = 0, this._AI.nextBuild[t].build = this._build[0][this._AI.nextBuild[t].mod]
					} else {
						let i = Math.random(),
							s = 1;
						if (e[3].length > 0)
							for (let t = 0; t < e.length; t++) {
								let i = e[3][t];
								if (i && i.level >= 2) {
									s = .5;
									break
								}
							}
						if (i < s) {
							let i = Math.floor(Math.random() * this._build[0].length);
							e[3].length > 7 && (i = 1), this._AI.nextBuild[t].mod = i, this._AI.nextBuild[t].build = this._build[0][this._AI.nextBuild[t].mod]
						} else {
							let e = Math.floor(Math.random() * this._build[1].length);
							this._AI.nextBuild[t].mod = e, this._AI.nextBuild[t].build = this._build[1][this._AI.nextBuild[t].mod]
						}
					}
				}
			}
		}
		AIGoTobedOver() {
			this._AI.build = [];
			for (let t = 0; t < this._AI.player.length; t++) this._AI.build.push(null), this._AI.nextBuild.push({
				mod: null,
				upbuild: null,
				build: null
			})
		}
		GetAiBuild(t) {
			let e = this._AI.player[t],
				i = ot.instance.FireReturn(ot.instance.BUILD_GET_ROOMALLBLOCK, e.roomIndex);
			i && i.length > 0 && (this._AI.build[t] = i)
		}
		GameOver() {
			this._AI = {
				player: [],
				room: [],
				bed: [],
				target: [],
				path: [],
				build: [],
				nextBuild: [],
				weight: []
			}, this._noTarget = [], this._attackedAI = null, this.RemoveMoveHandle()
		}
		KillPlayer(t) {
			if (this._AI.player.length > 0)
				for (let e = 0; e < this._AI.player.length; e++) {
					let i = this._AI.player[e];
					if (i.isbed && i.roomIndex == t.room.roomIndex) return void i.Hit(500)
				}
		}
		setAttackedAI(t) {
			if (this._AI.room.length > 0)
				for (let e = 0; e < this._AI.room.length; e++) {
					let i = this._AI.room[e];
					if (i && i.roomIndex == t) return void(this._attackedAI = e)
				}
			this._attackedAI = null
		}
		AttackedAIEventHandle() {
			if (null == this._attackedAI) return;
			let t = this._AI.room[this._attackedAI].door;
			this._AI.nextBuild[this._attackedAI].upbuild != t && t.hp < .5 && (this._AI.nextBuild[this._attackedAI].build = null, this._AI.nextBuild[this._attackedAI].mod = null, this._AI.nextBuild[this._attackedAI].upbuild = t)
		}
	}
	class si {
		constructor() {
			this._trollThawTime = 30, this._trollThawTime = 30, this._trollLgoic = new ti, this._playerAILogic = new ii, this._playerAILogic.AddEvent(), ot.instance.AddListEvent(ot.instance.MAINLG_TROLLUPDATA, this.TrollUpData, this)
		}
		StartGame() {
			this._trollLgoic.StartGame(), this._trollLgoic.troll = de.instance.trollSprict, this._playerAILogic.players = Qt.instance.players, rt.instance.AddTimeOnceEvent("player", this.player, this, 1)
		}
		GameOver() {
			this._trollLgoic.GameOver(), this._playerAILogic.GameOver(), ht.instance.removeListEvent("trollUpData")
		}
		TrollUpData() {
			ht.instance.AddUPEvent("trollUpData", this._trollLgoic.UpData, this._trollLgoic), this._trollLgoic.TrollPatrol(), ni.Model == Lt.HumanModel ? ot.instance.Fire(ot.instance.SKILL_ADDUPEVENT) : ni.Model == Lt.TrollModel && ot.instance.Fire(ot.instance.TROLLSKILL_ADDUPEVENT)
		}
		player() {
			this._playerAILogic.StartGame()
		}
	}! function(t) {
		t[t.TrollModel = 0] = "TrollModel", t[t.HumanModel = 1] = "HumanModel"
	}(Lt || (Lt = {}));
	class ni {
		constructor() {
			this.gold1Arr = [], this.gold2Arr = [], this.gold1Arr = [100, 200, 400, 1e3, 2e3, 3e3, 4e3, 5e3, 6e3, 7e3, 8e3, 9e3, 1e4, 3e4, 5e4, 8e4, 1e5, 15e4, 4e5, 8e5], this.gold2Arr = [100, 200, 300, 400, 500, 600, 700, 1e3, 1500, 2e3, 3e3, 4e3, 5e3, 6e3, 7e3, 8e3, 9e3, 1e4, 15e3, 2e4, 5e4], this._UIManager = new Ee, this._UIManager.AddUpData(), this._UIManager.LoadOne(), this._mapGManager = new Oe, this._buildManager = new Qe, this._playerManager = new Qt, this._trollManager = new de, this._mainTPLogic = new si, this.AddEvent()
		}
		AddEvent() {
			ot.instance.AddListEvent(ot.instance.GM_STARTGAME, this.StartGame, this), ot.instance.AddListEvent(ot.instance.GM_GAMEOVER, this.GameOver, this)
		}
		StartGame() {
			console.log("GameManager StartGame 1"), _t.instance.PlaySound(_t.instance.BG_music.gameBGM), console.log("GameManager StartGame 2"), di.instance.StartGame(), console.log("GameManager StartGame 3"), rt.instance.StartGame(), console.log("GameManager StartGame 4"), this._buildManager.StartGame(), console.log("GameManager StartGame 5"), this._mapGManager.SelectMap(), console.log("GameManager StartGame 6"), this._mapGManager.ShowMap(), console.log("GameManager StartGame 7"), this._playerManager.StartGame(6), console.log("GameManager StartGame 8"), this._UIManager.StartGame(), Laya.timer.once(1e3, this, function() {
				console.log("GameManager StartGame 9"), this._trollManager.StartGame(), console.log("GameManager StartGame 10"), this._mainTPLogic.StartGame(), console.log("GameManager StartGame 11"), ht.instance.StartGame(), console.log("GameManager StartGame 12")
			})
		}
		GameOver(t = !1) {
			this.DD_Economics(), di.instance.GameOver(), _t.instance.StopAll(), xt.instance.GameOver(), rt.instance.GameOver(), ae.instance.GameOver(), di.instance.game.isWin = t;
			Pt.instance.GameOver(), ht.instance.GameOver(), this._mainTPLogic.GameOver(), this._buildManager.GameOver(), this._playerManager.GameOver(), this._trollManager.GameOver(), this._UIManager.GameMove(null == t), this._mapGManager.GameOver()
		}
		DD_Economics() {
			let t = null;
			ni.Model == Lt.HumanModel ? t = di.instance.game.GetRoomPR(this._playerManager.player.roomIndex) : ni.Model == Lt.TrollModel && (t = {
				gold1: 0,
				gold2: 0,
				gold1_Count: 0,
				gold2_Count: 0
			});
			let e = 0,
				i = 0;
			if (t) {
				e = t.gold1_Count, i = t.gold2_Count;
				for (let t = this.gold1Arr.length - 1; t >= 0; t--) {
					let i = this.gold1Arr[t];
					if (e >= i) {
						e = i;
						break
					}
					0 == t && (e = 0)
				}
				for (let t = this.gold2Arr.length - 1; t >= 0; t--) {
					let e = this.gold2Arr[t];
					if (i >= e) {
						i = e;
						break
					}
					0 == t && (i = 0)
				}
			}
		}
	}
	ni.Model = Lt.HumanModel, ni.isTrollGameStart = !1, ni.isTrollGameLookPlayer = !1;
	class ai {
		constructor() {
			this._newBuildData = {
				at: [
					[yi.instance.getLanguage("102"), 8, 0, 4, 4, ""],
					[yi.instance.getLanguage("103"), 16, 0, 8, 4.5, ""],
					[yi.instance.getLanguage("104"), 32, 0, 16, 5, ""],
					[yi.instance.getLanguage("105"), 64, 0, 32, 5.5, ""],
					[yi.instance.getLanguage("106"), 256, 0, 64, 6, "game_1"],
					[yi.instance.getLanguage("107"), 512, 0, 128, 6.5, ""],
					[yi.instance.getLanguage("108"), 1024, 32, 256, 7, "game_2"],
					[yi.instance.getLanguage("109"), 2048, 64, 512, 7.5, ""],
					[yi.instance.getLanguage("110"), 4096, 128, 1024, 8, "game_3"],
					[yi.instance.getLanguage("111"), 8192, 256, 2048, 8.5, "game_4"],
					[yi.instance.getLanguage("112"), 16384, 512, 4096, 9, "game_5"],
					[yi.instance.getLanguage("113"), 32768, 1024, 8192, 9.5, "game_6"],
					[yi.instance.getLanguage("114"), 65536, 2048, 16384, 10, ""]
				],
				bed: [
					[yi.instance.getLanguage("115"), 0, 0, 1, 0, ""],
					[yi.instance.getLanguage("116"), 25, 0, 2, 0, ""],
					[yi.instance.getLanguage("117"), 50, 0, 4, 0, "door_2"],
					[yi.instance.getLanguage("118"), 100, 0, 8, 0, ""],
					[yi.instance.getLanguage("119"), 200, 0, 16, 0, "door_5"],
					[yi.instance.getLanguage("120"), 400, 0, 32, 0, ""],
					[yi.instance.getLanguage("121"), 800, 16, 64, 0, "door_8"],
					[yi.instance.getLanguage("122"), 1600, 32, 128, 0, "door_10"],
					[yi.instance.getLanguage("123"), 3200, 64, 256, 0, "door_11"],
					[yi.instance.getLanguage("124"), 6400, 128, 512, 0, "door_12"]
				],
				door: [
					[yi.instance.getLanguage("125") + "1", 0, 0, 50, 0, ""],
					[yi.instance.getLanguage("125") + "2", 16, 0, 80, 0, ""],
					[yi.instance.getLanguage("125") + "3", 32, 0, 160, 0, ""],
					[yi.instance.getLanguage("125") + "4", 64, 0, 200, 0, ""],
					[yi.instance.getLanguage("125") + "5", 128, 0, 250, 0, ""],
					[yi.instance.getLanguage("126") + "1", 256, 0, 320, 0, ""],
					[yi.instance.getLanguage("126") + "2", 512, 16, 640, 0, ""],
					[yi.instance.getLanguage("126") + "3", 1024, 32, 1280, 0, ""],
					[yi.instance.getLanguage("126") + "4", 2048, 64, 2560, 0, ""],
					[yi.instance.getLanguage("126") + "5", 4096, 128, 5120, 0, ""],
					[yi.instance.getLanguage("127") + "1", 8192, 256, 10240, 0, ""],
					[yi.instance.getLanguage("127") + "2", 16384, 512, 20480, 0, ""],
					[yi.instance.getLanguage("127") + "3", 32768, 1024, 40960, 0, ""]
				],
				door_troll: [
					[yi.instance.getLanguage("125") + "1", 0, 0, 50, 0, ""],
					[yi.instance.getLanguage("125") + "2", 16, 0, 80, 0, ""],
					[yi.instance.getLanguage("125") + "3", 32, 0, 160, 0, ""],
					[yi.instance.getLanguage("125") + "4", 64, 0, 320, 0, ""],
					[yi.instance.getLanguage("125") + "5", 128, 0, 640, 0, ""],
					[yi.instance.getLanguage("126") + "1", 256, 0, 1280, 0, ""],
					[yi.instance.getLanguage("126") + "2", 512, 16, 2560, 0, ""],
					[yi.instance.getLanguage("126") + "3", 1024, 32, 5120, 0, ""],
					[yi.instance.getLanguage("126") + "4", 2048, 64, 10240, 0, ""],
					[yi.instance.getLanguage("126") + "5", 4096, 128, 20480, 0, ""],
					[yi.instance.getLanguage("127") + "1", 8192, 256, 40960, 0, ""],
					[yi.instance.getLanguage("127") + "2", 16384, 512, 81920, 0, ""],
					[yi.instance.getLanguage("127") + "3", 32768, 1024, 163840, 0, ""]
				],
				game: [
					[yi.instance.getLanguage("148"), 200, 0, 1, 0, ""],
					[yi.instance.getLanguage("149"), 400, 0, 2, 0, ""],
					[yi.instance.getLanguage("150"), 800, 0, 4, 0, ""],
					[yi.instance.getLanguage("151"), 1600, 0, 6, 0, ""],
					[yi.instance.getLanguage("152"), 3200, 0, 8, 0, ""],
					[yi.instance.getLanguage("153"), 6400, 0, 10, 0, ""],
					[yi.instance.getLanguage("129"), 12800, 0, 15, 0, ""],
					[yi.instance.getLanguage("130"), 25600, 0, 20, 0, ""],
					[yi.instance.getLanguage("131"), 51200, 0, 25, 0, ""],
					[yi.instance.getLanguage("132"), 102400, 0, 30, 0, ""]
				],
				mine: [
					[yi.instance.getLanguage("133"), 0, 128, 8, 0, ""],
					[yi.instance.getLanguage("134"), 0, 1024, 32, 0, ""],
					[yi.instance.getLanguage("135"), 0, 2048, 128, 0, ""],
					[yi.instance.getLanguage("136"), 0, 4096, 512, 0, ""]
				]
			}, this._newBuildData1 = {
				spell: [yi.instance.getLanguage("173"), 0, 64, 0, 0, ""],
				ice: [yi.instance.getLanguage("137"), 0, 256, 0, 0, ""],
				entrapment: [yi.instance.getLanguage("174"), 0, 512, 0, 0, ""],
				barb: [yi.instance.getLanguage("138"), 0, 512, 0, 0, ""],
				guillotine: [yi.instance.getLanguage("139"), 0, 2048, 0, 0, ""],
				repair: [yi.instance.getLanguage("140"), 0, 64, 0, 0, ""],
				energyhood: [yi.instance.getLanguage("141"), 0, 64, 0, 0, ""],
				smoney: [yi.instance.getLanguage("37"), 0, 128, 0, 0, ""],
				longrange: [yi.instance.getLanguage("142"), 0, 256, 0, 0, ""],
				particlea: [yi.instance.getLanguage("143"), 0, 2048, 0, 0, ""],
				solenoid: [yi.instance.getLanguage("144"), 0, 2048, 0, 0, ""]
			}, this._introduce = {
				at: [
					[yi.instance.getLanguage("145") + "  4\n" + yi.instance.getLanguage("146") + "4"],
					[yi.instance.getLanguage("145") + "  8\n" + yi.instance.getLanguage("146") + "4.5"],
					[yi.instance.getLanguage("145") + "  16\n" + yi.instance.getLanguage("146") + "5"],
					[yi.instance.getLanguage("145") + "  32\n" + yi.instance.getLanguage("146") + "5.5"],
					[yi.instance.getLanguage("145") + "  64\n" + yi.instance.getLanguage("146") + "6\n" + yi.instance.getLanguage("147") + yi.instance.getLanguage("148")],
					[yi.instance.getLanguage("145") + "  128\n" + yi.instance.getLanguage("146") + "6.5"],
					[yi.instance.getLanguage("145") + "  256\n" + yi.instance.getLanguage("146") + "7\n" + yi.instance.getLanguage("147") + yi.instance.getLanguage("149")],
					[yi.instance.getLanguage("145") + "  512\n" + yi.instance.getLanguage("146") + "7.5"],
					[yi.instance.getLanguage("145") + "  1024\n" + yi.instance.getLanguage("146") + "8\n" + yi.instance.getLanguage("147") + yi.instance.getLanguage("150")],
					[yi.instance.getLanguage("145") + "  2048\n" + yi.instance.getLanguage("146") + "8.5\n" + yi.instance.getLanguage("147") + yi.instance.getLanguage("151")],
					[yi.instance.getLanguage("145") + "  4096\n" + yi.instance.getLanguage("146") + "9\n" + yi.instance.getLanguage("147") + yi.instance.getLanguage("152")],
					[yi.instance.getLanguage("145") + "  8192\n" + yi.instance.getLanguage("146") + "9.5\n" + yi.instance.getLanguage("147") + yi.instance.getLanguage("153")],
					[yi.instance.getLanguage("145") + "  16384\n" + yi.instance.getLanguage("146") + "10"]
				],
				bed: [
					[yi.instance.getLanguage("154") + "  1" + yi.instance.getLanguage("155") + "/s"],
					[yi.instance.getLanguage("154") + "  2" + yi.instance.getLanguage("155") + "s"],
					[yi.instance.getLanguage("154") + "  4" + yi.instance.getLanguage("155") + "/s\n" + yi.instance.getLanguage("147") + yi.instance.getLanguage("156") + "2"],
					[yi.instance.getLanguage("154") + "  8" + yi.instance.getLanguage("155") + "/s"],
					[yi.instance.getLanguage("154") + "  16" + yi.instance.getLanguage("155") + "/s\n" + yi.instance.getLanguage("147") + yi.instance.getLanguage("156") + "5"],
					[yi.instance.getLanguage("154") + "  32" + yi.instance.getLanguage("155") + "/s"],
					[yi.instance.getLanguage("154") + "  64" + yi.instance.getLanguage("155") + "/s\n" + yi.instance.getLanguage("147") + yi.instance.getLanguage("157") + "3"],
					[yi.instance.getLanguage("154") + "  128" + yi.instance.getLanguage("155") + "/s\n" + yi.instance.getLanguage("147") + yi.instance.getLanguage("157") + "5"],
					[yi.instance.getLanguage("154") + "  256" + yi.instance.getLanguage("155") + "/s\n" + yi.instance.getLanguage("147") + yi.instance.getLanguage("158") + "1"],
					[yi.instance.getLanguage("154") + "  512" + yi.instance.getLanguage("155") + "/s\n" + yi.instance.getLanguage("147") + yi.instance.getLanguage("158") + "2"]
				],
				door: [
					[yi.instance.getLanguage("159") + "   50HP"],
					[yi.instance.getLanguage("159") + "   70HP"],
					[yi.instance.getLanguage("159") + "   140HP"],
					[yi.instance.getLanguage("159") + "   200HP"],
					[yi.instance.getLanguage("159") + "   250HP"],
					[yi.instance.getLanguage("159") + "   320HP"],
					[yi.instance.getLanguage("159") + "   640HP"],
					[yi.instance.getLanguage("159") + "   1280HP"],
					[yi.instance.getLanguage("159") + "   2560HP"],
					[yi.instance.getLanguage("159") + "   5120HP"],
					[yi.instance.getLanguage("159") + "   10240HP"],
					[yi.instance.getLanguage("159") + "   20480HP"],
					[yi.instance.getLanguage("159") + "   40960HP"]
				],
				game: [
					[yi.instance.getLanguage("154") + "  1" + yi.instance.getLanguage("160") + "/2s"],
					[yi.instance.getLanguage("154") + "  2" + yi.instance.getLanguage("160") + "/s"],
					[yi.instance.getLanguage("154") + "  4" + yi.instance.getLanguage("160") + "/s"],
					[yi.instance.getLanguage("154") + "  6" + yi.instance.getLanguage("160") + "/s"],
					[yi.instance.getLanguage("154") + "  8" + yi.instance.getLanguage("160") + "/s"],
					[yi.instance.getLanguage("154") + "  10" + yi.instance.getLanguage("160") + "/s"],
					[yi.instance.getLanguage("154") + "  15" + yi.instance.getLanguage("160") + "/s"],
					[yi.instance.getLanguage("154") + "  20" + yi.instance.getLanguage("160") + "/s"],
					[yi.instance.getLanguage("154") + "  25" + yi.instance.getLanguage("160") + "/s"],
					[yi.instance.getLanguage("154") + "  30" + yi.instance.getLanguage("160") + "/s"]
				],
				mine: [
					[yi.instance.getLanguage("154") + "  8" + yi.instance.getLanguage("155") + "/s"],
					[yi.instance.getLanguage("154") + "  32" + yi.instance.getLanguage("155") + "/s"],
					[yi.instance.getLanguage("154") + "  128" + yi.instance.getLanguage("155") + "/s"],
					[yi.instance.getLanguage("154") + "  512" + yi.instance.getLanguage("155") + "/s"]
				]
			}, this._introduce1 = {
				spell: yi.instance.getLanguage("161") + yi.instance.getLanguage("162"),
				ice: yi.instance.getLanguage("161") + yi.instance.getLanguage("163"),
				entrapment: yi.instance.getLanguage("161") + yi.instance.getLanguage("164"),
				barb: yi.instance.getLanguage("161") + yi.instance.getLanguage("165"),
				guillotine: yi.instance.getLanguage("161") + yi.instance.getLanguage("166"),
				repair: yi.instance.getLanguage("161") + yi.instance.getLanguage("167"),
				energyhood: yi.instance.getLanguage("161") + yi.instance.getLanguage("168"),
				smoney: yi.instance.getLanguage("161") + yi.instance.getLanguage("169"),
				longrange: yi.instance.getLanguage("161") + yi.instance.getLanguage("170"),
				particlea: yi.instance.getLanguage("161") + yi.instance.getLanguage("171"),
				solenoid: yi.instance.getLanguage("161") + yi.instance.getLanguage("172")
			}, this._basicBuildData = [
				["at_1", "game_1", "repair_1"],
				["mine_1", "mine_2", "mine_3", "mine_4"],
				["spell_1", "energyhood_1", "smoney_1", "ice_1"],
				["entrapment_1", "barb_1", "guillotine_1"],
				["longrange_1", "particlea_1", "solenoid_1"]
			], this._ShopBuildData = [
				["spell_1", "energyhood_1", "smoney_1", "ice_1"],
				["entrapment_1", "barb_1", "guillotine_2", "repair_1"],
				["longrange_1", "particlea_1", "solenoid_2"]
			], this._skin = {
				spell: "map/spellimg_0.png",
				energyhood: "map/energyhood_2.png",
				smoney: "UI/" + yi.instance.getPicture() + "/money.png",
				guillotine: "map/guillotine_3.png",
				particlea: "map/particleaImg.png",
				solenoid: "map/solenoidimg_1.png"
			}, this._ShopBuildMoney = {
				repair: [yi.instance.getLanguage("140"), 10],
				spell: [yi.instance.getLanguage("173"), 20],
				smoney: [yi.instance.getLanguage("37"), 20],
				ice: [yi.instance.getLanguage("137"), 30],
				entrapment: [yi.instance.getLanguage("174"), 30],
				barb: [yi.instance.getLanguage("138"), 50],
				energyhood: [yi.instance.getLanguage("141"), 50],
				guillotine: [yi.instance.getLanguage("139"), 999],
				longrange: [yi.instance.getLanguage("142"), 30],
				particlea: [yi.instance.getLanguage("143"), 100],
				solenoid: [yi.instance.getLanguage("144"), 999]
			}, this._AIPos = [
				[21, 22],
				[21, 23],
				[22, 22],
				[22, 23],
				[23, 22],
				[23, 23]
			], this._trollPos = [
				[22, 1],
				[41, 23],
				[21, 35],
				[1, 23]
			], this.AtBasePower = [1, 2, 4, 6, 14, 22.5, 40, 75], this.bulletBuff = {
				1: [0, 0, .01, .02, .03, .04, .05, .08],
				2: [0, 0, 0, 0, 0, .5, .7, 1],
				3: [0, 0, 1, 2, 3, 4, 5, 8]
			}, this.AtBuffEff = [
				[0, 0, 0, 0, 0, .01, .02, .04],
				[0, 0, 0, 0, 0, .01, .02, .04],
				[0, 0, 0, 0, 0, .01, .02, .04]
			]
		}
		GetSubSkin(t) {
			let e = this._skin[t];
			return e || null
		}
		GetBuildData(t, e) {
			let i = this._newBuildData[t];
			return ni.Model == Lt.TrollModel && "door" == t && (i = this._newBuildData.door_troll), null == i ? (i = this._newBuildData1[t], 1 == e && null != i ? i : void 0) : i[e - 1]
		}
		getbasicBuildData(t) {
			return t >= this._basicBuildData.length && (t = 0), this._basicBuildData[t]
		}
		GetBulidBuff(t, e) {
			var i = this.bulletBuff[t.toString()];
			return null != i ? i[e] : 0
		}
		GetAtBuffEff(t, e) {
			return this.AtBuffEff[t - 1][e]
		}
		GetAtPower(t) {
			return t >= 0 && t < 8 ? this.AtBasePower[t] : null
		}
		GetAIPos(t) {
			return this._AIPos[t]
		}
		GetTrollPos() {
			let t = Math.floor(Math.random() * this._trollPos.length);
			return this._trollPos[t]
		}
		GetIntroduce(t, e) {
			let i = this._introduce[t];
			return null == i ? (i = this._introduce1[t], 1 == e && null != i ? i : void 0) : i[e - 1]
		}
		GetShopData(t) {
			return this._ShopBuildData[t]
		}
		GetShopBuildMoney(t) {
			return this._ShopBuildMoney[t]
		}
	}
	class li {
		constructor() {
			this.PR = {}, this._startGame = !1, this._winOrLoser = !1, this._isMvp = !1, this._mvpIndex = -1, this._playerArr = new Array, this._lpPath = null, this.PR = {}, this._startGame = !1, this._winOrLoser = !1, this._isMvp = !1, this._mvpIndex = -1, this._playerArr = new Array, this._lpPath = null
		}
		GetRoomPR(t) {
			let e = this.PR[t];
			return null == e ? null : e
		}
		SetRoomPR(t) {
			let e = this.PR[t];
			return null == e && (ni.Model == Lt.HumanModel ? e = {
				gold1: 0,
				gold2: 0,
				gold1_Count: 0,
				gold2_Count: 0
			} : ni.Model == Lt.TrollModel && (e = {
				gold1: 200,
				gold2: 0,
				gold1_Count: 0,
				gold2_Count: 0
			}), this.PR[t] = e), e
		}
		ClearPR() {
			this.PR = {}
		}
		SetPR(t, e, i) {
			let s = this.PR[t];
			s || (s = this.SetRoomPR(t)), s.gold1 += e, s.gold2 += i, s.gold1_Count += e, s.gold2_Count += i
		}
		GameOver() {
			this.PR = {}, this._playerArr = [], this._lpPath = null, this._startGame = !1
		}
		StartGame() {
			this._startGame = !0
		}
		set isWin(t) {
			this._winOrLoser = t
		}
		get isWin() {
			return this._winOrLoser
		}
		set playerArr(t) {
			this._playerArr.push(t)
		}
		GetPlayerArr(t) {
			return this._playerArr[t]
		}
		get trollName() {
			return this._trollName
		}
		set trollName(t) {
			this._trollName = t
		}
		get playerInfo() {
			return this._playerInfo
		}
		sortPlayer(t) {
			if (this.InitPlayerInfo(t), this._playerInfo.length > 0)
				for (let t = 0; t < this._playerInfo.length - 1; t++) {
					let e = this._playerInfo[t];
					for (let i = t; i < this._playerInfo.length; i++) {
						let s = this._playerInfo[i];
						if (e.time < s.time) this._playerInfo[t] = s, this._playerInfo[i] = e, e = s;
						else if (e.time == s.time) {
							.3 * e.gold1 + .7 * e.gold2 < .3 * s.gold1 + .7 * s.gold2 && (this._playerInfo[t] = s, this._playerInfo[i] = e, e = s)
						}
					}
				}
		}
		InitPlayerInfo(t) {
			let e = t;
			if (e.length > 0) {
				let t = [];
				for (let i = 0; i < e.length; i++) {
					let s = e[i],
						n = this.GetRoomPR(s.roomIndex);
					n || (n = {
						gold1_Count: 0,
						gold2_Count: 0
					});
					let a = s.win,
						l = s.lose,
						o = {
							roomindex: s.roomIndex,
							name: s.name,
							time: s.dieTime,
							gold1: n.gold1_Count,
							gold2: n.gold2_Count,
							win: a,
							lose: l
						};
					t.push(o)
				}
				this._playerInfo = t
			}
		}
		get isMvp() {
			return this._isMvp
		}
		set isMvp(t) {
			this._isMvp = t
		}
		set lpPath(t) {
			this._lpPath = t
		}
		get lpPath() {
			return this._lpPath
		}
		get isStart() {
			return this._startGame
		}
		get mvpIndex() {
			return this._mvpIndex
		}
		set mvpIndex(t) {
			this._mvpIndex = t
		}
	}
	class oi {
		constructor() {
			this._key = "PlayerData", this._trollIndex = 0, this.countI = 3, this.skinMaxNum = 6, this.skin = [0, 6, 2, 3, 4, 5], this._key = "PlayerData", this._trollIndex = 0, this.countI = 3, this.skinMaxNum = 6, this.skin = [0, 6, 2, 3, 4, 5], this._data = {
				_playerSelectIndex: 0,
				_playerSkin: [0],
				_win: 0,
				_lose: 0,
				_mvp: 0,
				_gold: 0,
				_task: 0,
				_vipTime: 0,
				_time: 0,
				_videoNum: 0,
				_signTime: 0,
				_taskOk: !1,
				_ysOK: !1,
				_blueprint: {
					spell: 1,
					ice: 1,
					entrapment: 1,
					barb: 1,
					guillotine: 1,
					repair: 10,
					energyhood: 1,
					smoney: 1,
					longrange: 1,
					particlea: 1,
					solenoid: 1
				}
			}, this._goldTextArr = [], this.Read()
		}
		get key() {
			return this._key
		}
		get trollIndex() {
			let t = Math.floor(this.DZCount / this.countI),
				e = Math.floor(t % this.skinMaxNum);
			return this._trollIndex = e, this.skin[this._trollIndex]
		}
		get PlayerSkin() {
			return this._data._playerSkin
		}
		set PlayerSkin(t) {
			this.InspectplayerSkin(t[0]) || (this._data._playerSkin.push(t[0]), this.Write())
		}
		InspectplayerSkin(t) {
			for (let e = 0; e < this._data._playerSkin.length; e++) {
				if (this._data._playerSkin[e] == t) return !0
			}
			return !1
		}
		get playerSelectIndex() {
			return this._data._playerSelectIndex
		}
		set playerSelectIndex(t) {
			this._data._playerSelectIndex = t
		}
		Read() {
			let t = Laya.LocalStorage.getJSON("mengguibieqiaomen");
			t && (this._data._playerSelectIndex = t._playerSelectIndex ? t._playerSelectIndex : this._data._playerSelectIndex, this._data._playerSkin = t._playerSkin ? t._playerSkin : this._data._playerSkin, this._data._win = t._win ? t._win : this._data._win, this._data._lose = t._lose ? t._lose : this._data._lose, this._data._mvp = t._mvp ? t._mvp : this._data._mvp, this._data._gold = t._gold ? t._gold : this._data._gold, this._data._task = t._task ? t._task : this._data._task, this._data._taskOk = t._taskOk ? t._taskOk : this._data._taskOk, this._data._ysOK = t._ysOK ? t._ysOK : this._data._ysOK, this._data._blueprint = t._blueprint ? t._blueprint : this._data._blueprint, this._data._vipTime = t._vipTime ? t._vipTime : this._data._vipTime, this._data._time = t._time ? t._time : this._data._time, this._data._videoNum = t._videoNum ? t._videoNum : this._data._videoNum, this._data._signTime = t._signTime ? t._signTime : this._data._signTime), console.log("读取本地数据", this._data)
		}
		Write() {
			Laya.LocalStorage.setJSON("mengguibieqiaomen", this._data), Laya.stage.event("UPDATASERVER")
		}
		get win() {
			return this._data._win
		}
		get lose() {
			return this._data._lose
		}
		get mvp() {
			return this._data._mvp
		}
		set win(t) {
			this._data._win = t, this.Write()
		}
		set lose(t) {
			this._data._lose = t, this.Write()
		}
		set mvp(t) {
			this._data._mvp = t, this.Write()
		}
		get time() {
			return this._data._time
		}
		set time(t) {
			this._data._time = t, this.Write()
		}
		get videoNum() {
			return this._data._videoNum
		}
		set videoNum(t) {
			this._data._videoNum = t, this.Write()
		}
		get signTime() {
			return this._data._signTime
		}
		set signTime(t) {
			this._data._signTime = t, this.Write()
		}
		GetBuileprintNum(t) {
			let e = this._data._blueprint[t];
			return null != e ? e : null
		}
		ModifiedBuileprintQuantity(t, e) {
			null != this._data._blueprint[t] && (this._data._blueprint[t] += e, this._data._blueprint[t] < 0 && (this._data._blueprint[t] = 0), this.Write())
		}
		set goldText(t) {
			this._goldTextArr.push(t)
		}
		get gold() {
			return this._data._gold
		}
		get taskIndex() {
			return this._data._task
		}
		set taskIndex(t) {
			this._data._task = t, this.Write()
		}
		set gold(t) {
			if (this._data._gold = t, this._data._gold < 0 && (this._data._gold = 0), this._goldTextArr.length > 0)
				for (let t = 0; t < this._goldTextArr.length; t++) {
					this._goldTextArr[t].text = this._data._gold.toString()
				}
			this.Write()
		}
		get DZCount() {
			return this._data._win + this._data._lose
		}
		get taskOk() {
			return this._data._taskOk
		}
		set taskOk(t) {
			this._data._taskOk = t, this.Write()
		}
		set ysOK(t) {
			this._data._ysOK = t, this.Write()
		}
		get ysOK() {
			return this._data._ysOK
		}
		set isVip(t) {
			this._data._vipTime = t, this.Write()
		}
		get isVip() {
			return this._data._vipTime
		}
	}
	class hi {
		constructor() {
			this._cdn = {
				taskOpenCount: 3,
				animSelectOpenCount: 1,
				shopOpenCount: 1,
				diff: {
					diffCount: [5],
					diff: [
						[0, 1],
						[1, 2]
					]
				},
				treasureChestOpenCount: 2,
				treasureChestShow: 2,
				treasureChestFirstShow: 2,
				treasureChestLoopShow: [3, 0, 1, 2],
				treasureChestArr: [
					["repair_1", "repair_1", "repair_1", "spell_1", "spell_1", "ice_1"],
					["repair_1", "repair_1", "repair_1", "ice_1", "barb_1"],
					["repair_1", "repair_1", "smoney_1", "ice_1", "entrapment_1", "energyhood_1"],
					["repair_1", "repair_1", "repair_1", "repair_1", "ice_1", "entrapment_1", "longrange_1", "longrange_1", "particlea_1"]
				],
				doorADVOpneCount: 2
			}, this.tcArr = null
		}
		get cdn() {
			return this._cdn
		}
	}
	class ri {
		constructor() {
			this.powers = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768, 65536, 131072], this.powersTroll = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768, 65536, 131072], this.hps = [300, 400, 800, 1600, 3200, 6400, 12800, 12800, 51200, 51200, 204800, 204800, 819200, 819200, 3276800, 3276800, 13107200], this.hpsTroll = [300, 400, 800, 1600, 3200, 6400, 12800, 12800, 51200, 51200, 204800, 204800, 819200, 819200, 3276800, 3276800, 13107200], this.upData = [30, 50, 60, 60, 60, 65, 70, 75, 80, 85, 90, 95], this.upDataTroll = [30, 50, 60, 60, 60, 65, 70, 75, 80, 85, 90, 95], this._difficulty = 0, this._eHpPro = [.3, .3, .3], this._attackPro = [0, 0, -.1], this._eTimePro = [.55, .5, .3], this.powers = [3, 6, 10, 25, 50, 80, 150, 400, 800, 1500, 3e3, 6e3, 12e3, 2e4, 4e4, 8e4, 17e4], this.powersTroll = [5, 10, 18, 40, 70, 135, 280, 512, 1200, 2300, 4500, 9e3, 17e3, 34e3, 65536, 131072, 131072], this.hps = [400, 700, 1e3, 2e3, 4e3, 9e3, 22e3, 32e3, 51200, 8e4, 204800, 3e5, 819200, 819200, 3276800, 3276800, 13107200], this.hpsTroll = [150, 300, 400, 800, 1600, 1600, 3200, 3200, 6400, 6400, 12800, 12800, 51200, 51200, 102400, 102400, 204800], this.upData = [30, 40, 50, 55, 60, 65, 70, 75, 80, 85, 90, 90, 90, 90, 90, 90], this.upDataTroll = [25, 40, 50, 55, 60, 65, 70, 75, 80, 85, 90, 90, 90, 90, 90, 90], this._difficulty = 0, this._eHpPro = [.3, .3, .3], this._attackPro = [0, 0, -.1], this._eTimePro = [.55, .5, .3]
		}
		get eHpPro() {
			return this._eHpPro[this._difficulty]
		}
		get attackPro() {
			return this._attackPro[this._difficulty]
		}
		get eTimePro() {
			return this._eTimePro[this._difficulty]
		}
		set difficulty(t) {
			(t < 0 || t >= this._eHpPro.length) && (t = 0), this._difficulty = t
		}
		get diffCount() {
			return this._eHpPro.length
		}
	}
	class _i {
		constructor() {
			this.taskTextArr = [yi.instance.getLanguage("77"), yi.instance.getLanguage("78"), yi.instance.getLanguage("79"), yi.instance.getLanguage("80"), yi.instance.getLanguage("81"), yi.instance.getLanguage("82"), yi.instance.getLanguage("83"), yi.instance.getLanguage("84"), yi.instance.getLanguage("85"), yi.instance.getLanguage("86"), yi.instance.getLanguage("87")]
		}
		GetTaskText(t) {
			return t < 0 && t >= this.taskTextArr.length ? null : this.taskTextArr[t]
		}
	}
	class di {
		static get instance() {
			return this._ins && null != this._ins || (this._ins = new di), this._ins
		}
		get build() {
			return this._buildData && null != this._buildData || (this._buildData = new ai), this._buildData
		}
		get game() {
			return this._gameData && null != this._gameData || (this._gameData = new li), this._gameData
		}
		get player() {
			return this._playerData && null != this._playerData || (this._playerData = new oi), this._playerData
		}
		get troll() {
			return this._trollData && null != this._trollData || (this._trollData = new ri), this._trollData
		}
		get cdn() {
			return this._cdnData && null != this._cdnData || (this._cdnData = new hi), this._cdnData
		}
		get task() {
			return this._taskData && null != this._taskData || (this._taskData = new _i), this._taskData
		}
		GameOver() {
			this._gameData.GameOver()
		}
		StartGame() {
			this._gameData.StartGame()
		}
	}
	var ci, ui, pi, gi = Laya.View,
		mi = Laya.Scene,
		Ii = Laya.ClassUtils.regClass;
	! function(t) {
		class e extends mi {
			constructor() {
				super()
			}
			createChildren() {
				super.createChildren(), this.loadScene("NullScene")
			}
		}
		t.NullSceneUI = e, Ii("ui.NullSceneUI", e)
	}(ci || (ci = {})),
	function(t) {
		! function(t) {
			class e extends Laya.Image {
				constructor() {
					super(), this.createUI(e.uiView)
				}
				createUI(t) {
					laya.utils.ClassUtils.createByJson(t, this, this)
				}
			}
			e.uiView = {
				type: "Image",
				props: {
					y: 0,
					x: 0,
					width: 640,
					presetID: 1,
					name: "native_ad",
					mouseThrough: !0,
					isPresetRoot: !0,
					height: 320
				},
				compId: 618,
				child: [{
					type: "Image",
					props: {
						y: 0,
						x: 320,
						width: 640,
						skin: "img/navigate/icon_1.png",
						presetID: 7,
						name: "icon",
						height: 320,
						anchorX: .5
					},
					compId: 631
				}, {
					type: "Image",
					props: {
						y: 0,
						x: 320,
						width: 640,
						visible: !0,
						presetID: 9,
						name: "bg",
						mouseThrough: !0,
						height: 320,
						anchorX: .5
					},
					compId: 634,
					child: [{
						type: "Image",
						props: {
							width: 35,
							visible: !0,
							top: 5,
							skin: "img/navigate/gg_2_2.png",
							right: 5,
							presetID: 6,
							name: "btnClose",
							height: 35
						},
						compId: 630
					}, {
						type: "Image",
						props: {
							skin: "img/navigate/ad_4.png",
							presetID: 14
						},
						compId: 644
					}]
				}, {
					type: "Image",
					props: {
						y: 1,
						x: 320,
						visible: !0,
						skin: "img/navigate/ad_1.png",
						presetID: 3,
						name: "btnAd",
						anchorY: .5,
						anchorX: .5
					},
					compId: 626,
					child: [{
						type: "Image",
						props: {
							y: 49,
							x: 144,
							skin: "img/navigate/ad_2.png",
							presetID: 13,
							anchorY: .5,
							anchorX: .5
						},
						compId: 643
					}, {
						type: "Script",
						props: {
							y: 0,
							x: 0,
							presetID: 11,
							runtime: "anim/AnimScale.ts"
						},
						compId: 641
					}]
				}, {
					type: "Script",
					props: {
						presetID: 10,
						runtime: "navigate/NativeAd.ts"
					},
					compId: 638
				}],
				loadList: ["img/navigate/icon_1.png", "img/navigate/gg_2_2.png", "img/navigate/ad_4.png", "img/navigate/ad_1.png", "img/navigate/ad_2.png"],
				loadList3D: []
			}, t.native_adUI = e, Ii("ui.prefab.native_adUI", e)
		}(t.prefab || (t.prefab = {}))
	}(ci || (ci = {})),
	function(t) {
		! function(t) {
			class e extends gi {
				constructor() {
					super()
				}
				createChildren() {
					super.createChildren(), this.loadScene("Prefabs/BattleUI")
				}
			}
			t.BattleUIUI = e, Ii("ui.Prefabs.BattleUIUI", e);
			class i extends gi {
				constructor() {
					super()
				}
				createChildren() {
					super.createChildren(), this.loadScene("Prefabs/BuildBloodStrip")
				}
			}
			t.BuildBloodStripUI = i, Ii("ui.Prefabs.BuildBloodStripUI", i);
			class s extends gi {
				constructor() {
					super()
				}
				createChildren() {
					super.createChildren(), this.loadScene("Prefabs/buildMenu")
				}
			}
			t.buildMenuUI = s, Ii("ui.Prefabs.buildMenuUI", s);
			class n extends mi {
				constructor() {
					super()
				}
				createChildren() {
					super.createChildren(), this.loadScene("Prefabs/CheckIn")
				}
			}
			t.CheckInUI = n, Ii("ui.Prefabs.CheckInUI", n);
			class a extends mi {
				constructor() {
					super()
				}
				createChildren() {
					super.createChildren(), this.createView(a.uiView)
				}
			}
			a.uiView = {
				type: "Scene",
				props: {
					y: 0,
					x: 0
				},
				compId: 2,
				child: [{
					type: "Box",
					props: {
						visible: !1,
						top: 0,
						right: 0,
						left: 0,
						bottom: 0,
						bgColor: "#000000"
					},
					compId: 18
				}, {
					type: "Image",
					props: {
						y: 10,
						x: 10,
						visible: !0,
						top: 0,
						skin: "zj_wx/bg.png",
						right: 0,
						name: "bg",
						left: 0,
						bottom: 0
					},
					compId: 3
				}, {
					type: "View",
					props: {
						top: 0,
						right: 0,
						name: "view",
						left: 0,
						bottom: 0
					},
					compId: 4,
					child: [{
						type: "Image",
						props: {
							skin: "zj_wx/g.png",
							centerY: -200,
							centerX: 0
						},
						compId: 17
					}, {
						type: "Image",
						props: {
							skin: "zj_wx/img_box.png",
							name: "box",
							centerY: -200,
							centerX: 0
						},
						compId: 6
					}, {
						type: "Box",
						props: {
							width: 496,
							name: "progress",
							height: 114,
							centerY: 100,
							centerX: 0
						},
						compId: 10,
						child: [{
							type: "Image",
							props: {
								skin: "zj_wx/proBg.png",
								name: "bg",
								centerX: 0
							},
							compId: 11,
							child: [{
								type: "Image",
								props: {
									x: 10,
									width: 0,
									var: "pro",
									skin: "zj_wx/pro.png",
									sizeGrid: "0,267,0,208",
									centerY: 0
								},
								compId: 12
							}]
						}, {
							type: "Image",
							props: {
								y: 80,
								skin: "zj_wx/tip.png",
								name: "txt",
								centerX: 0
							},
							compId: 13
						}]
					}]
				}, {
					type: "Image",
					props: {
						width: 400,
						var: "CrazyBtn",
						skin: "UI/selectShopBtn.png",
						pivotY: 55,
						pivotX: 228,
						height: 130,
						centerX: 0,
						bottom: 1
					},
					compId: 14,
					child: [{
						type: "Image",
						props: {
							skin: "UI/English/onClickOpenBoxBtn.png",
							name: "pic",
							centerY: 0,
							centerX: 0
						},
						compId: 20
					}, {
						type: "Box",
						props: {
							name: "fingerGroup",
							centerY: -19,
							centerX: 83
						},
						compId: 9,
						child: [{
							type: "Sprite",
							props: {
								y: 103,
								x: 18,
								visible: !1,
								var: "ring",
								texture: "zj_wx/guangquan.png"
							},
							compId: 7
						}, {
							type: "Sprite",
							props: {
								y: 152,
								x: 178,
								var: "finger",
								texture: "zj_wx/shouzhi.png"
							},
							compId: 8
						}]
					}, {
						type: "Image",
						props: {
							y: -105,
							x: 156,
							skin: "zj_wx/img_jiantou.png"
						},
						compId: 19
					}]
				}],
				loadList: ["zj_wx/bg.png", "zj_wx/g.png", "zj_wx/img_box.png", "zj_wx/proBg.png", "zj_wx/pro.png", "zj_wx/tip.png", "UI/selectShopBtn.png", "UI/English/onClickOpenBoxBtn.png", "zj_wx/guangquan.png", "zj_wx/shouzhi.png", "zj_wx/img_jiantou.png"],
				loadList3D: []
			}, t.CrazyClickBoxUI = a, Ii("ui.Prefabs.CrazyClickBoxUI", a);
			class l extends Laya.Sprite {
				constructor() {
					super(), this.createUI(l.uiView)
				}
				createUI(t) {
					laya.utils.ClassUtils.createByJson(t, this, this)
				}
			}
			l.uiView = {
				type: "Sprite",
				props: {
					y: 0,
					x: 0,
					width: 750,
					presetID: 1,
					name: "CreditUI",
					isPresetRoot: !0,
					height: 1336,
					centerX: 0
				},
				compId: 273,
				child: [{
					type: "Image",
					props: {
						skin: "UI/CreditUI/8.png",
						scaleY: .7,
						scaleX: .7,
						name: "bg",
						centerY: 0,
						centerX: 0
					},
					compId: 291,
					child: [{
						type: "Image",
						props: {
							y: -49,
							skin: "UI/CreditUI/6.png",
							name: "title",
							centerX: 0
						},
						compId: 349,
						child: [{
							type: "Image",
							props: {
								y: 26,
								skin: "UI/English/tt.png",
								name: "txt",
								centerX: 0
							},
							compId: 440
						}]
					}, {
						type: "Button",
						props: {
							y: -14,
							x: 632,
							stateNum: 1,
							skin: "UI/CreditUI/4.png",
							name: "closeBtn"
						},
						compId: 351
					}, {
						type: "Button",
						props: {
							y: 85,
							x: 135,
							width: 204,
							stateNum: 1,
							skin: "UI/English/13.png",
							pivotY: 39,
							pivotX: 102,
							name: "goldBtn",
							height: 78
						},
						compId: 352
					}, {
						type: "Button",
						props: {
							y: 85,
							x: 358,
							width: 204,
							stateNum: 1,
							skin: "UI/English/16.png",
							pivotY: 39,
							pivotX: 102,
							name: "vipBtn",
							height: 78
						},
						compId: 353
					}, {
						type: "Image",
						props: {
							width: 644,
							name: "goldBg",
							height: 791,
							centerY: 36,
							centerX: 0
						},
						compId: 395,
						child: [{
							type: "Image",
							props: {
								y: 20,
								skin: "UI/CreditUI/1.png",
								name: "g1",
								centerX: 0
							},
							compId: 357,
							child: [{
								type: "Image",
								props: {
									skin: "UI/CreditUI/9.png",
									centerY: 0
								},
								compId: 362
							}, {
								type: "Image",
								props: {
									y: 35,
									x: 34,
									skin: "UI/CreditUI/15.png"
								},
								compId: 361
							}, {
								type: "Image",
								props: {
									y: 50,
									x: 183,
									skin: "UI/CreditUI/12.png"
								},
								compId: 363
							}, {
								type: "Text",
								props: {
									y: 64,
									x: 252,
									width: 65,
									text: "X20",
									height: 31,
									fontSize: 36,
									font: "Microsoft YaHei",
									color: "#fbf8f8",
									runtime: "Laya.Text"
								},
								compId: 364
							}, {
								type: "Button",
								props: {
									x: 481,
									width: 179,
									stateNum: 1,
									skin: "UI/CreditUI/5.png",
									pivotY: 44,
									pivotX: 90,
									name: "buy",
									labelSize: 40,
									labelPadding: "5",
									labelFont: "Microsoft YaHei",
									labelColors: "#fbf8f8",
									labelAlign: "center",
									label: "$0.99",
									height: 87,
									centerY: 0
								},
								compId: 365
							}, {
								type: "Image",
								props: {
									y: 110,
									x: 19.5,
									skin: "UI/English/c1.png",
									name: "txt"
								},
								compId: 434
							}]
						}, {
							type: "Image",
							props: {
								y: 178,
								skin: "UI/CreditUI/1.png",
								name: "g2",
								centerX: 0
							},
							compId: 367,
							child: [{
								type: "Image",
								props: {
									skin: "UI/CreditUI/9.png",
									centerY: 0
								},
								compId: 368
							}, {
								type: "Image",
								props: {
									y: 35,
									x: 34,
									skin: "UI/CreditUI/15.png"
								},
								compId: 369
							}, {
								type: "Image",
								props: {
									y: 50,
									x: 183,
									skin: "UI/CreditUI/12.png"
								},
								compId: 370
							}, {
								type: "Text",
								props: {
									y: 64,
									x: 252,
									width: 65,
									text: "X100",
									height: 31,
									fontSize: 36,
									font: "Microsoft YaHei",
									color: "#fbf8f8",
									runtime: "Laya.Text"
								},
								compId: 371
							}, {
								type: "Button",
								props: {
									x: 481,
									width: 179,
									stateNum: 1,
									skin: "UI/CreditUI/5.png",
									pivotY: 44,
									pivotX: 90,
									name: "buy",
									labelSize: 40,
									labelPadding: "5",
									labelFont: "Microsoft YaHei",
									labelColors: "#fbf8f8",
									labelAlign: "center",
									label: "$4.99",
									height: 87,
									centerY: 0
								},
								compId: 372
							}, {
								type: "Image",
								props: {
									y: 117.5,
									x: 106,
									width: 200,
									skin: "UI/English/c2.png",
									pivotX: 100,
									name: "txt",
									height: 23
								},
								compId: 435
							}]
						}, {
							type: "Image",
							props: {
								y: 337,
								skin: "UI/CreditUI/1.png",
								name: "g3",
								centerX: 0
							},
							compId: 374,
							child: [{
								type: "Image",
								props: {
									skin: "UI/CreditUI/9.png",
									centerY: 0
								},
								compId: 375
							}, {
								type: "Image",
								props: {
									y: 35,
									x: 34,
									skin: "UI/CreditUI/15.png"
								},
								compId: 376
							}, {
								type: "Image",
								props: {
									y: 50,
									x: 183,
									skin: "UI/CreditUI/12.png"
								},
								compId: 377
							}, {
								type: "Text",
								props: {
									y: 64,
									x: 252,
									width: 96,
									text: "X200",
									height: 31,
									fontSize: 36,
									font: "Microsoft YaHei",
									color: "#fbf8f8",
									runtime: "Laya.Text"
								},
								compId: 378
							}, {
								type: "Button",
								props: {
									x: 481,
									width: 179,
									stateNum: 1,
									skin: "UI/CreditUI/5.png",
									pivotY: 44,
									pivotX: 90,
									name: "buy",
									labelSize: 40,
									labelPadding: "5",
									labelFont: "Microsoft YaHei",
									labelColors: "#fbf8f8",
									labelAlign: "center",
									label: "$9.99",
									height: 87,
									centerY: 0
								},
								compId: 379
							}, {
								type: "Image",
								props: {
									y: 113,
									x: 9,
									skin: "UI/English/c3.png",
									name: "txt"
								},
								compId: 436
							}]
						}, {
							type: "Image",
							props: {
								y: 497,
								skin: "UI/CreditUI/1.png",
								name: "g4",
								centerX: 0
							},
							compId: 381,
							child: [{
								type: "Image",
								props: {
									skin: "UI/CreditUI/9.png",
									centerY: 0
								},
								compId: 382
							}, {
								type: "Image",
								props: {
									y: 35,
									x: 34,
									skin: "UI/CreditUI/15.png"
								},
								compId: 383
							}, {
								type: "Image",
								props: {
									y: 50,
									x: 183,
									skin: "UI/CreditUI/12.png"
								},
								compId: 384
							}, {
								type: "Text",
								props: {
									y: 64,
									x: 252,
									width: 102,
									text: "X500",
									height: 31,
									fontSize: 36,
									font: "Microsoft YaHei",
									color: "#fbf8f8",
									runtime: "Laya.Text"
								},
								compId: 385
							}, {
								type: "Button",
								props: {
									x: 481,
									width: 179,
									stateNum: 1,
									skin: "UI/CreditUI/5.png",
									pivotY: 44,
									pivotX: 90,
									name: "buy",
									labelSize: 40,
									labelPadding: "5",
									labelFont: "Microsoft YaHei",
									labelColors: "#fbf8f8",
									labelAlign: "center",
									label: "$19.99",
									height: 87,
									centerY: 0
								},
								compId: 386
							}, {
								type: "Image",
								props: {
									y: 114,
									x: 6,
									skin: "UI/English/c4.png",
									name: "txt"
								},
								compId: 437
							}]
						}, {
							type: "Image",
							props: {
								y: 658,
								skin: "UI/CreditUI/1.png",
								name: "g5",
								centerX: 0
							},
							compId: 388,
							child: [{
								type: "Image",
								props: {
									skin: "UI/CreditUI/9.png",
									centerY: 0
								},
								compId: 389
							}, {
								type: "Image",
								props: {
									y: 35,
									x: 34,
									skin: "UI/CreditUI/15.png"
								},
								compId: 390
							}, {
								type: "Image",
								props: {
									y: 50,
									x: 183,
									skin: "UI/CreditUI/12.png"
								},
								compId: 391
							}, {
								type: "Text",
								props: {
									y: 64,
									x: 252,
									width: 113,
									text: "X1000",
									height: 31,
									fontSize: 36,
									font: "Microsoft YaHei",
									color: "#fbf8f8",
									runtime: "Laya.Text"
								},
								compId: 392
							}, {
								type: "Button",
								props: {
									x: 481,
									width: 179,
									stateNum: 1,
									skin: "UI/CreditUI/5.png",
									pivotY: 44,
									pivotX: 90,
									name: "buy",
									labelSize: 40,
									labelPadding: "5",
									labelFont: "Microsoft YaHei",
									labelColors: "#fbf8f8",
									labelAlign: "center",
									label: "$39.99",
									height: 87,
									centerY: 0
								},
								compId: 393
							}, {
								type: "Image",
								props: {
									y: 117,
									x: 14,
									skin: "UI/English/c5.png",
									name: "txt"
								},
								compId: 439
							}]
						}]
					}, {
						type: "Image",
						props: {
							width: 644,
							visible: !1,
							name: "vipBg",
							height: 791,
							centerY: 47,
							centerX: 0
						},
						compId: 396,
						child: [{
							type: "Image",
							props: {
								y: 15,
								skin: "UI/CreditUI/1.png",
								name: "g1",
								height: 200,
								centerX: 0
							},
							compId: 397,
							child: [{
								type: "Image",
								props: {
									x: 25,
									skin: "UI/CreditUI/10.png",
									centerY: 0
								},
								compId: 399
							}, {
								type: "Image",
								props: {
									y: 53.5,
									x: 231.5,
									skin: "UI/CreditUI/3.png"
								},
								compId: 400
							}, {
								type: "Button",
								props: {
									x: 481,
									width: 179,
									stateNum: 1,
									skin: "UI/CreditUI/5.png",
									pivotY: 44,
									pivotX: 90,
									name: "buy",
									labelSize: 40,
									labelPadding: "5",
									labelFont: "Microsoft YaHei",
									labelColors: "#fbf8f8",
									labelAlign: "center",
									label: "$4.99",
									height: 87,
									centerY: 0
								},
								compId: 402
							}, {
								type: "Image",
								props: {
									y: 112,
									skin: "UI/English/zz.png",
									centerX: -22
								},
								compId: 441
							}]
						}, {
							type: "Image",
							props: {
								y: 236,
								skin: "UI/CreditUI/1.png",
								name: "g2",
								height: 250,
								centerX: -2
							},
							compId: 404,
							child: [{
								type: "Image",
								props: {
									y: 10.5,
									x: 14,
									skin: "UI/CreditUI/11.png"
								},
								compId: 406
							}, {
								type: "Image",
								props: {
									x: 118,
									skin: "UI/CreditUI/12.png",
									centerY: 0
								},
								compId: 407
							}, {
								type: "Text",
								props: {
									y: 109.5,
									x: 191.5,
									width: 104,
									text: "X200",
									height: 31,
									fontSize: 36,
									font: "Microsoft YaHei",
									color: "#fbf8f8",
									runtime: "Laya.Text"
								},
								compId: 408
							}, {
								type: "Image",
								props: {
									y: -17.5,
									x: 304,
									skin: "UI/CreditUI/2.png"
								},
								compId: 432
							}]
						}, {
							type: "Image",
							props: {
								y: 510,
								skin: "UI/CreditUI/1.png",
								name: "g3",
								height: 250,
								centerX: -2
							},
							compId: 411,
							child: [{
								type: "Image",
								props: {
									y: 11,
									x: 15,
									skin: "UI/CreditUI/11.png"
								},
								compId: 413
							}, {
								type: "Image",
								props: {
									skin: "UI/English/xx.png",
									scaleY: .9,
									scaleX: .9,
									name: "pic",
									centerY: 18,
									centerX: 11
								},
								compId: 414
							}]
						}]
					}]
				}],
				loadList: ["map/HSZZ0_1.png", "UI/shopBtn.png", "load/shopTipsbg.png", "load/mihuan.png", "load/close.png", "StartGameUI/goldBg.png", "StartGameUI/gold3.png", "UI/CreditUI/8.png", "UI/CreditUI/6.png", "UI/English/tt.png", "UI/CreditUI/4.png", "UI/English/13.png", "UI/English/16.png", "UI/CreditUI/1.png", "UI/CreditUI/9.png", "UI/CreditUI/15.png", "UI/CreditUI/12.png", "UI/CreditUI/5.png", "UI/English/c1.png", "UI/English/c2.png", "UI/English/c3.png", "UI/English/c4.png", "UI/English/c5.png", "UI/CreditUI/10.png", "UI/CreditUI/3.png", "UI/English/zz.png", "UI/CreditUI/11.png", "UI/CreditUI/2.png", "UI/English/xx.png"],
				loadList3D: []
			}, t.CreditUIUI = l, Ii("ui.Prefabs.CreditUIUI", l);
			class o extends gi {
				constructor() {
					super()
				}
				createChildren() {
					super.createChildren(), this.loadScene("Prefabs/GameOver")
				}
			}
			t.GameOverUI = o, Ii("ui.Prefabs.GameOverUI", o);
			class h extends gi {
				constructor() {
					super()
				}
				createChildren() {
					super.createChildren(), this.loadScene("Prefabs/GameOverUI")
				}
			}
			t.GameOverUIUI = h, Ii("ui.Prefabs.GameOverUIUI", h);
			class r extends mi {
				constructor() {
					super()
				}
				createChildren() {
					super.createChildren(), this.loadScene("Prefabs/Main")
				}
			}
			t.MainUI = r, Ii("ui.Prefabs.MainUI", r);
			class _ extends gi {
				constructor() {
					super()
				}
				createChildren() {
					super.createChildren(), this.loadScene("Prefabs/MatchingUI")
				}
			}
			t.MatchingUIUI = _, Ii("ui.Prefabs.MatchingUIUI", _);
			class d extends Laya.Image {
				constructor() {
					super(), this.createUI(d.uiView)
				}
				createUI(t) {
					laya.utils.ClassUtils.createByJson(t, this, this)
				}
			}
			d.uiView = {
				type: "Image",
				props: {
					y: 150,
					x: 135,
					width: 570,
					skin: "pipei/menuBg.png",
					presetID: 1,
					pivotY: 5,
					pivotX: 285,
					name: "menu",
					isPresetRoot: !0,
					height: 60,
					alpha: 1
				},
				compId: 211,
				child: [{
					type: "Image",
					props: {
						y: 0,
						x: -2,
						width: 570,
						skin: "build_n/tc_3.png",
						sizeGrid: "10,10,10,10",
						presetID: 15,
						name: "BG",
						height: 265
					},
					compId: 215
				}, {
					type: "Image",
					props: {
						x: 283,
						width: 90,
						visible: !1,
						top: -4,
						skin: "pipei/etc85.png",
						presetID: 2,
						pivotY: 45,
						pivotX: 45,
						name: "head"
					},
					compId: 147
				}, {
					type: "Image",
					props: {
						y: 4,
						x: 200,
						skin: "build_n/sj_2.png",
						presetID: 25,
						name: "UpImg"
					},
					compId: 226
				}, {
					type: "Label",
					props: {
						y: 40,
						x: 283,
						width: 570,
						visible: !1,
						valign: "middle",
						text: "升级",
						strokeColor: "#000000",
						stroke: 5,
						presetID: 16,
						pivotY: 32,
						pivotX: 285,
						name: "UpText",
						height: 64,
						fontSize: 45,
						font: "Microsoft YaHei",
						color: "#33ff46",
						bold: !0,
						align: "center"
					},
					compId: 216
				}, {
					type: "Sprite",
					props: {
						y: 69,
						x: 283,
						width: 540,
						scaleY: .9,
						scaleX: .9,
						rotation: 0,
						presetID: 3,
						pivotX: 270,
						name: "select",
						height: 70
					},
					compId: 149,
					child: [{
						type: "Image",
						props: {
							y: 35,
							x: 55,
							width: 90,
							skin: "build_n/select_1.png",
							sizeGrid: "0,0,0,0",
							presetID: 4,
							pivotY: 25,
							pivotX: 45,
							name: "menu1",
							height: 50
						},
						compId: 150,
						child: [{
							type: "Label",
							props: {
								y: 0,
								x: 0,
								wordWrap: !0,
								width: 90,
								valign: "middle",
								text: "基础",
								presetID: 5,
								name: "text",
								height: 50,
								fontSize: 14,
								color: "#ffffff",
								bold: !0,
								align: "center"
							},
							compId: 155
						}]
					}, {
						type: "Image",
						props: {
							y: 35,
							x: 160,
							width: 90,
							skin: "build_n/select_1.png",
							sizeGrid: "0,0,0,0",
							presetID: 17,
							pivotY: 25,
							pivotX: 45,
							name: "menu1",
							height: 50
						},
						compId: 217,
						child: [{
							type: "Label",
							props: {
								y: 0,
								x: 0,
								wordWrap: !0,
								width: 90,
								valign: "middle",
								text: "赚钱",
								presetID: 18,
								name: "text",
								height: 50,
								fontSize: 14,
								color: "#ffffff",
								bold: !0,
								align: "center"
							},
							compId: 218
						}]
					}, {
						type: "Image",
						props: {
							y: 35,
							x: 268,
							width: 90,
							skin: "build_n/select_1.png",
							sizeGrid: "0,0,0,0",
							presetID: 19,
							pivotY: 25,
							pivotX: 45,
							name: "menu1",
							height: 50
						},
						compId: 219,
						child: [{
							type: "Label",
							props: {
								y: 0,
								x: 0,
								wordWrap: !0,
								width: 90,
								valign: "middle",
								text: "高科技",
								presetID: 20,
								name: "text",
								height: 50,
								fontSize: 14,
								color: "#ffffff",
								bold: !0,
								align: "center"
							},
							compId: 220
						}]
					}, {
						type: "Image",
						props: {
							y: 35,
							x: 375,
							width: 90,
							skin: "build_n/select_1.png",
							sizeGrid: "0,0,0,0",
							presetID: 21,
							pivotY: 25,
							pivotX: 45,
							name: "menu1",
							height: 50
						},
						compId: 221,
						child: [{
							type: "Label",
							props: {
								y: 0,
								x: 0,
								wordWrap: !0,
								width: 90,
								valign: "middle",
								text: "黑科技",
								presetID: 22,
								name: "text",
								height: 50,
								fontSize: 14,
								color: "#ffffff",
								bold: !0,
								align: "center"
							},
							compId: 222
						}]
					}, {
						type: "Image",
						props: {
							y: 35,
							x: 481,
							width: 97,
							skin: "build_n/select_1.png",
							sizeGrid: "0,0,0,0",
							presetID: 23,
							pivotY: 25,
							pivotX: 45,
							name: "menu1",
							height: 50
						},
						compId: 223,
						child: [{
							type: "Label",
							props: {
								y: 0,
								x: 0,
								wordWrap: !0,
								width: 96,
								valign: "middle",
								text: "神级道具",
								presetID: 24,
								name: "text",
								height: 50,
								fontSize: 14,
								color: "#ffffff",
								bold: !0,
								align: "center"
							},
							compId: 224
						}]
					}]
				}, {
					type: "Sprite",
					props: {
						y: 139,
						x: 285,
						width: 540,
						presetID: 12,
						pivotX: 270,
						name: "build",
						height: 360
					},
					compId: 159
				}],
				loadList: ["pipei/menuBg.png", "build_n/tc_3.png", "pipei/etc85.png", "build_n/sj_2.png", "build_n/select_1.png"],
				loadList3D: []
			}, t.menuUI = d, Ii("ui.Prefabs.menuUI", d);
			class c extends mi {
				constructor() {
					super()
				}
				createChildren() {
					super.createChildren(), this.loadScene("Prefabs/NativeScreen")
				}
			}
			t.NativeScreenUI = c, Ii("ui.Prefabs.NativeScreenUI", c);
			class u extends gi {
				constructor() {
					super()
				}
				createChildren() {
					super.createChildren(), this.loadScene("Prefabs/off")
				}
			}
			t.offUI = u, Ii("ui.Prefabs.offUI", u);
			class p extends gi {
				constructor() {
					super()
				}
				createChildren() {
					super.createChildren(), this.loadScene("Prefabs/RF")
				}
			}
			t.RFUI = p, Ii("ui.Prefabs.RFUI", p);
			class g extends mi {
				constructor() {
					super()
				}
				createChildren() {
					super.createChildren(), this.loadScene("Prefabs/Setting")
				}
			}
			t.SettingUI = g, Ii("ui.Prefabs.SettingUI", g);
			class m extends gi {
				constructor() {
					super()
				}
				createChildren() {
					super.createChildren(), this.loadScene("Prefabs/ShopMenu")
				}
			}
			t.ShopMenuUI = m, Ii("ui.Prefabs.ShopMenuUI", m);
			class I extends Laya.Sprite {
				constructor() {
					super(), this.createUI(I.uiView)
				}
				createUI(t) {
					laya.utils.ClassUtils.createByJson(t, this, this)
				}
			}
			I.uiView = {
				type: "Sprite",
				props: {
					y: 0,
					x: 0,
					width: 640,
					texture: "map/HSZZ0_1.png",
					presetID: 1,
					name: "ShopUI",
					isPresetRoot: !0,
					height: 1136
				},
				compId: 273,
				child: [{
					type: "Sprite",
					props: {
						y: 101,
						x: 9,
						texture: "shop_n/tc_4.png"
					},
					compId: 297
				}, {
					type: "Image",
					props: {
						x: 320,
						width: 520,
						top: 252,
						presetID: 2,
						pivotX: 260,
						name: "menu",
						height: 77,
						alpha: 1
					},
					compId: 275,
					child: [{
						type: "Sprite",
						props: {
							y: 23,
							x: 261,
							width: 501,
							rotation: 0,
							presetID: 4,
							pivotY: 26,
							pivotX: 251,
							name: "select",
							height: 52
						},
						compId: 149,
						child: [{
							type: "Image",
							props: {
								y: 26,
								x: 62,
								width: 158,
								skin: "shop_n/shop_6.png",
								sizeGrid: "13,15,17,17",
								presetID: 5,
								pivotY: 25,
								pivotX: 61,
								name: "menu1",
								height: 50
							},
							compId: 276,
							child: [{
								type: "Label",
								props: {
									y: 0,
									x: 0,
									wordWrap: !0,
									width: 156,
									valign: "middle",
									text: "高科技",
									presetID: 6,
									name: "text",
									height: 50,
									fontSize: 18,
									color: "#ffffff",
									align: "center"
								},
								compId: 220
							}]
						}, {
							type: "Image",
							props: {
								y: 25,
								x: 227,
								width: 176,
								skin: "UI/shopBtn.png",
								sizeGrid: "0,0,0,0",
								presetID: 7,
								pivotY: 25,
								pivotX: 61,
								name: "menu1",
								height: 50
							},
							compId: 221,
							child: [{
								type: "Label",
								props: {
									y: 0,
									x: 0,
									wordWrap: !0,
									width: 173,
									valign: "middle",
									text: "黑科技",
									presetID: 8,
									name: "text",
									height: 50,
									fontSize: 18,
									color: "#ffffff",
									align: "center"
								},
								compId: 222
							}]
						}, {
							type: "Image",
							props: {
								y: 26,
								x: 416,
								width: 141,
								skin: "UI/shopBtn.png",
								sizeGrid: "0,0,0,0",
								presetID: 9,
								pivotY: 25,
								pivotX: 61,
								name: "menu1",
								height: 50
							},
							compId: 223,
							child: [{
								type: "Label",
								props: {
									y: 0,
									x: 0,
									wordWrap: !0,
									width: 140,
									valign: "middle",
									text: "神级道具",
									presetID: 10,
									name: "text",
									height: 50,
									fontSize: 18,
									color: "#ffffff",
									align: "center"
								},
								compId: 224
							}]
						}]
					}, {
						type: "Image",
						props: {
							y: -99.5,
							skin: "shop_n/shop_1.png",
							name: "tt",
							centerX: 0
						},
						compId: 292
					}, {
						type: "Image",
						props: {
							y: 61,
							x: 260,
							width: 493,
							presetID: 12,
							pivotX: 247,
							name: "build",
							height: 360
						},
						compId: 159
					}, {
						type: "Image",
						props: {
							y: 734,
							skin: "shop_n/close.png",
							presetID: 13,
							name: "close",
							centerX: 0
						},
						compId: 277
					}, {
						type: "Image",
						props: {
							y: -197,
							x: 23,
							width: 174,
							skin: "StartGameUI/goldBg.png",
							presetID: 16,
							pivotY: 31,
							height: 61
						},
						compId: 286,
						child: [{
							type: "Image",
							props: {
								y: 30.5,
								x: 0,
								width: 92,
								skin: "StartGameUI/gold3.png",
								presetID: 17,
								pivotY: 48,
								pivotX: 46,
								height: 95
							},
							compId: 287
						}]
					}, {
						type: "Label",
						props: {
							y: -197,
							x: 124,
							width: 110,
							valign: "middle",
							text: "10000",
							presetID: 15,
							pivotY: 26,
							pivotX: 55,
							name: "gold",
							height: 51,
							fontSize: 35,
							color: "#ffffff",
							align: "center"
						},
						compId: 279
					}]
				}],
				loadList: ["map/HSZZ0_1.png", "UI/shopBtn.png", "load/shopTipsbg.png", "load/mihuan.png", "load/close.png", "StartGameUI/goldBg.png", "StartGameUI/gold3.png", "shop_n/tc_4.png", "shop_n/shop_6.png", "shop_n/shop_1.png", "shop_n/close.png", "prefab/native_ad.prefab"],
				loadList3D: []
			}, t.ShopUIUI = I, Ii("ui.Prefabs.ShopUIUI", I);
			class f extends gi {
				constructor() {
					super()
				}
				createChildren() {
					super.createChildren(), this.loadScene("Prefabs/SkillUI")
				}
			}
			t.SkillUIUI = f, Ii("ui.Prefabs.SkillUIUI", f);
			class y extends gi {
				constructor() {
					super()
				}
				createChildren() {
					super.createChildren(), this.loadScene("Prefabs/StartGame")
				}
			}
			t.StartGameUI = y, Ii("ui.Prefabs.StartGameUI", y);
			class b extends mi {
				constructor() {
					super()
				}
				createChildren() {
					super.createChildren(), this.loadScene("Prefabs/StartTry")
				}
			}
			t.StartTryUI = b, Ii("ui.Prefabs.StartTryUI", b);
			class A extends gi {
				constructor() {
					super()
				}
				createChildren() {
					super.createChildren(), this.loadScene("Prefabs/TipsUI")
				}
			}
			t.TipsUIUI = A, Ii("ui.Prefabs.TipsUIUI", A);
			class S extends Laya.Sprite {
				constructor() {
					super(), this.createUI(S.uiView)
				}
				createUI(t) {
					laya.utils.ClassUtils.createByJson(t, this, this)
				}
			}
			S.uiView = {
				type: "Sprite",
				props: {
					y: 0,
					x: 0,
					width: 640,
					texture: "UI/zhezhao.png",
					presetID: 1,
					name: "TreasureChestUI",
					isPresetRoot: !0,
					height: 1136
				},
				compId: 328,
				child: [{
					type: "Image",
					props: {
						top: 0,
						skin: "result_n/bg.png",
						sizeGrid: "10,10,10,10",
						right: 0,
						left: 0,
						bottom: 0
					},
					compId: 355
				}, {
					type: "Image",
					props: {
						x: 48,
						skin: "chest_n/box_14.png",
						centerY: 0
					},
					compId: 356
				}, {
					type: "Image",
					props: {
						y: 282,
						x: 320,
						width: 446,
						skin: "chest_n/box_3.png",
						pivotY: 58,
						pivotX: 223,
						name: "tcText",
						height: 133
					},
					compId: 351,
					child: [{
						type: "Image",
						props: {
							y: 65,
							skin: "chest_n/box_8.png",
							centerX: 0
						},
						compId: 352
					}]
				}, {
					type: "Image",
					props: {
						skin: "chest_n/box_10.png",
						presetID: 8,
						name: "advBtn",
						centerX: 0,
						bottom: 100,
						anchorY: .5,
						anchorX: .5
					},
					compId: 330,
					child: [{
						type: "Image",
						props: {
							y: 33,
							x: 21,
							skin: "chest_n/box_2.png",
							presetID: 10
						},
						compId: 336
					}, {
						type: "Image",
						props: {
							y: 33,
							skin: "chest_n/box_5.png",
							presetID: 10,
							name: "pic",
							centerX: 20
						},
						compId: 354
					}]
				}, {
					type: "Image",
					props: {
						skin: "chest_n/box_4.png",
						presetID: 11,
						name: "closeBtn",
						centerX: 0,
						bottom: 20
					},
					compId: 331
				}, {
					type: "Image",
					props: {
						y: 455,
						x: 320,
						width: 436,
						visible: !1,
						skin: "chest_n/box_6.png",
						rotation: 0,
						presetID: 14,
						name: "qq",
						height: 436,
						anchorY: .5,
						anchorX: .5
					},
					compId: 344
				}, {
					type: "Image",
					props: {
						y: 500,
						x: 320,
						width: 382,
						skin: "chest_n/box_13.png",
						pivotY: 181,
						pivotX: 191,
						name: "box",
						height: 321
					},
					compId: 345
				}],
				loadList: ["UI/zhezhao.png", "UI/tcEffect.png", "load/mzBtn.png", "load/microapp备份 4.png", "StartGameUI/huiseBtn.png", "load/gg.png", "result_n/bg.png", "chest_n/box_14.png", "chest_n/box_3.png", "chest_n/box_8.png", "chest_n/box_10.png", "chest_n/box_2.png", "chest_n/box_5.png", "chest_n/box_4.png", "chest_n/box_6.png", "chest_n/box_13.png", "prefab/native_ad.prefab"],
				loadList3D: []
			}, t.TreasureChestUIUI = S, Ii("ui.Prefabs.TreasureChestUIUI", S);
			class v extends gi {
				constructor() {
					super()
				}
				createChildren() {
					super.createChildren(), this.loadScene("Prefabs/TrollBloodStrip")
				}
			}
			t.TrollBloodStripUI = v, Ii("ui.Prefabs.TrollBloodStripUI", v);
			class T extends gi {
				constructor() {
					super()
				}
				createChildren() {
					super.createChildren(), this.loadScene("Prefabs/TrollSkillUI")
				}
			}
			t.TrollSkillUIUI = T, Ii("ui.Prefabs.TrollSkillUIUI", T);
			class L extends mi {
				constructor() {
					super()
				}
				createChildren() {
					super.createChildren(), this.loadScene("Prefabs/Turntable")
				}
			}
			t.TurntableUI = L, Ii("ui.Prefabs.TurntableUI", L);
			class E extends gi {
				constructor() {
					super()
				}
				createChildren() {
					super.createChildren(), this.loadScene("Prefabs/View_4")
				}
			}
			t.View_4UI = E, Ii("ui.Prefabs.View_4UI", E)
		}(t.Prefabs || (t.Prefabs = {}))
	}(ci || (ci = {}));
	class fi extends ci.Prefabs.CrazyClickBoxUI {
		constructor() {
			super(), this._canClose = !1, this._showBanner = !1, this._proValue = 0, this._fingerTweenSign = -1, this._callback = null
		}
		static get Instance() {
			return fi._instance || (fi._instance = new fi), fi._instance
		}
		onAwake() {
			console.log("ui_zj_CrazyClickBoxUI Awake"), this.size(Laya.stage.width, Laya.stage.height), this.pro.parent.parent.getChildAt(1).skin = "UI/" + yi.instance.getPicture() + "/tip.png", this.CrazyBtn.getChildAt(0).skin = "UI/" + yi.instance.getPicture() + "/onClickOpenBoxBtn.png"
		}
		onEnable() {
			console.log("ui_zj_CrazyClickBoxUI onEnable"), this.timer.loop(1e3, this, () => {
				this._fingerTweenSign *= -1, console.log("kk_e_sign", this._fingerTweenSign), Laya.Tween.to(this.finger, {
					x: this.finger.x + 50 * this._fingerTweenSign,
					y: this.finger.x + 50 * this._fingerTweenSign
				}, 1e3, null, null, null, !0, !0)
			}), this.CrazyBtn.on(Laya.Event.CLICK, this, this._clickCrazyBtn), Laya.timer.loop(10, this, () => {
				this._proValue > 0 && (this._proValue -= .008, this._proValue <= 0 && (this._proValue = 0), this.pro.width = 476 * this._proValue)
			})
		}
		_clickCrazyBtn() {
			this._canClose ? this._backHome() : (this._proValue += .14, this._proValue >= 1 && (this._proValue = 1), this.pro.width = 476 * this._proValue, this._showBanner || this._proValue > .7 && (this._showBanner = !0, yi.instance.showBanner(), Laya.timer.once(2e3, this, () => {
				yi.instance.hideBanner(), this._canClose = !0, this._backHome()
			})))
		}
		_backHome() {
			this._hide()
		}
		show(t) {
			if (this._canClose = this._showBanner = !1, this._proValue = 0, this.pro.width = 476 * this._proValue, this._callback = t, yi.instance.hideBanner(), !this.parent) {
				let t = 900;
				Laya.stage.addChild(this), this.zOrder = t
			}
		}
		_hide() {
			yi.instance.hideBanner(), this._callback && this._callback(), this._callback = null, this.parent && this.removeSelf(), Laya.timer.clearAll(this)
		}
	}
	fi._instance = null,
		function(t) {
			t.GET = "GET", t.POST = "POST"
		}(ui || (ui = {})),
		function(t) {
			t[t.Chinese = 1] = "Chinese", t[t.English = 2] = "English", t[t.Indonesian = 3] = "Indonesian", t[t.Vietnamese = 4] = "Vietnamese", t[t.Brazilian = 5] = "Brazilian"
		}(pi || (pi = {}));
	class yi {
		constructor() {
			this.advId = 10528, this.bannerId = 10529, this.localPayInfo = "mengguibieqiaomen3d_pay", this.rewardedVideoAd = null, this.isVideoShow = !1, this.clickData = null, this.playCount = 1, this.successFunc = null, this.failFunc = null, this.cursor = 0, this.tData = null
		}
		static get instance() {
			return this._instance || (this._instance = new yi), window.HagoSdk = this._instance, this._instance
		}
		init() {}
		loadOver() {
			this.loadExelInfo()
		}
		getCountry(t = 0) {}
		getClickData(t = 0) {}
		showVideo(t = null, e = null) {

            console.log("showReward");
		this.successFunc = t, this.failFunc = e, 
            this.successFunc && this.successFunc()
            Unity.call("showReward");
            return;
            E.Instance.showRewardedVideo(() => {
				this.successFunc && this.successFunc()
			}, () => {
				this.failFunc && this.failFunc()
			}), console.log("展示广告")
		}
		adViewed(t) {}
		InterstitialAdShow() {
            console.log("showInter");
            Unity.call("showInter"); 
			E.Instance.showInterstitial()
		}
		gamePause() {
			Laya.timer.pause()
		}
		gameResume() {
			Laya.timer.resume()
		}
		showBanner() {
            console.log("showBanner");
			E.Instance.showBanner()
            Unity.call("showBanner"); 
		}
		hideBanner() {
            console.log("hideBanner");
			E.Instance.hideBanner()
            Unity.call("hideBanner"); 
		}
		loadExelInfo() {
			Laya.loader.load("res/localconfig/Language.csv", Laya.Handler.create(this, this.onLoaclLoded), null, Laya.Loader.TEXT)
		}
		onLoaclLoded() {
			var t = "res/localconfig/Language.csv";
			this.data = Laya.loader.getRes(t);
			const e = function(t) {
				const e = (this.getNextRow(), this.getNextRow(), this.getNextRow());
				if (!e) return null;
				let i = this.getNextRow();
				const s = [];
				for (; i;) {
					const t = {};
					for (let s = 0; s < e.length && s < i.length; s++) t[e[s]] = i[s];
					s.push(t), i = this.getNextRow()
				}
				return s
			}.bind(this)(Laya.loader.getRes(t));
			this.completeHandler(e)
		}
		completeHandler(t) {
			if (this.rawData = t, this.data = {}, t)
				for (const e of t) this.data[e.id] = e;
			this.initLanguage(), Laya.stage.event("LOADLANGUAGE")
		}
		getItem(t) {
			return this.data[t]
		}
		getNextRow() {
			let t = this.getNextColumn();
			if (!t) return null;
			const e = [];
			for (; t && (e.push(t.column), !t.isEnd);) t = this.getNextColumn();
			return e
		}
		getNextColumn() {
			const t = [],
				e = [];
			let i = this.getNextChar();
			if (null == i) return null;
			let s = !1;
			for (; i;) {
				if ("," == i) {
					if (t.length <= 0 || 2 == t.length) break;
					e.push(i)
				} else if ('"' == i) 2 == t.length ? e.push(t.pop()) : t.push(i);
				else if ("\n" == i) {
					if (t.length <= 0 || 2 == t.length) {
						s = !0;
						break
					}
					e.push(i)
				} else {
					if (null == i) {
						s = !0;
						break
					}
					"\r" == i || e.push(i)
				}
				i = this.getNextChar()
			}
			return "\r" == this.peekNextChar() && this.getNextChar(), {
				column: e.join(""),
				isEnd: s
			}
		}
		getNextChar() {
			return !this.data || this.cursor >= this.data.length ? null : this.data.charAt(this.cursor++)
		}
		peekNextChar() {
			return !this.data || this.cursor >= this.data.length ? null : this.data.charAt(this.cursor)
		}
		initLanguage() {
			switch (this.type = pi.English, "en-us") {
				case "id":
					this.type = pi.Indonesian, console.log("语言为印尼语");
					break;
				case "vi":
					this.type = pi.Vietnamese, console.log("语言为越南语");
					break;
				case "pt-br":
					this.type = pi.Brazilian, console.log("语言为巴西语")
			}
		}
		getLanguage(t) {
			switch (this.type) {
				case pi.Chinese:
					t += "_C";
					break;
				case pi.English:
					t += "_E";
					break;
				case pi.Indonesian:
					t += "_I";
					break;
				case pi.Vietnamese:
					t += "_V";
					break;
				case pi.Brazilian:
					t += "_B"
			}
			let e = this.getItem(t);
			return e && e.value ? e.value : t
		}
		getPicture() {
			let t = "English";
			switch (this.type) {
				case pi.Chinese:
					t = "Chinese";
					break;
				case pi.English:
					t = "English";
					break;
				case pi.Indonesian:
					t = "Indonesian";
					break;
				case pi.Vietnamese:
					t = "Vietnamese";
					break;
				case pi.Brazilian:
					t = "Brazilian"
			}
			return t
		}
		startGameCheckPay() {
			Laya.timer.once(5e3, this, function() {
				let t = Laya.LocalStorage.getItem(this.localPayInfo);
				console.log("检查充值", t), t && "null" != t && (t = JSON.parse(t), this.checkPayInfo(0, t))
			})
		}
		checkPayInfo(t, e) {
			let i = e.url,
				s = e.num;
			this.send(i).then(function(i) {
				if (200 == i.code) {
					this.paySuccess(s);
					let t = Laya.LocalStorage.getItem(this.localPayInfo);
					if (t && "null" != t) {
						JSON.parse(t).url == e.url && Laya.LocalStorage.setItem(this.localPayInfo, null)
					}
				} else if (++t > 60) {
					let t = Laya.LocalStorage.getItem(this.localPayInfo);
					if (t && "null" != t) {
						JSON.parse(t).url == e.url && Laya.LocalStorage.setItem(this.localPayInfo, null)
					}
				} else Laya.timer.once(5e3, this, function() {
					this.checkPayInfo(t, e)
				})
			}.bind(this))
		}
		paySuccess(t) {
			-1 != t ? (di.instance._playerData.gold += t, ot.instance.Fire(ot.instance.UIGM_TIPS, yi.instance.getLanguage("196"))) : this.onBuyVipSuccess(), Laya.LocalStorage.setItem(this.localPayInfo, null)
		}
		onBuyVipSuccess() {
			di.instance._playerData.gold += 200, ot.instance.Fire(ot.instance.UIGM_TIPS, yi.instance.getLanguage("196")), di.instance._playerData.isVip = 1
		}
		send(t, e = null, i = ui.GET, s = 3e3) {
			return new Promise((n, a) => {
				let l = new XMLHttpRequest;
				l.onreadystatechange = (() => {
					4 == l.readyState && (l.status >= 200 && l.status < 400 ? (console.log("success"), n(JSON.parse(l.responseText))) : (console.log("fail"), n("fail")), l && l.abort && l.abort())
				}), l.onerror = (t => {
					console.log("request error", t)
				}), l.ontimeout = (() => {
					console.log("timeout"), n("fail"), l && l.abort && l.abort()
				}), !e || "object" != typeof e || e.length || Array.isArray(e) || (e = JSON.stringify(e)), i == ui.GET && e && (t += "?" + e, e = null), l.open(i, t, !0), l.timeout = s, i == ui.POST && l.setRequestHeader("Content-Type", "application/json; charset=utf-8"), l.send(e), console.log(`[hs_game]Request URL:${t}`)
			})
		}
	}
	yi._instance = null;
	class bi extends Laya.Scene {
		constructor() {
			super(), this.day = 0
		}
		onOpened() {
			Z.isX() && (this.root.y = 40), bi.instance = this, this.day = 0, B.checkTodayBoolCheck() ? (this.btnGet.visible = !1, this.btnDouble.visible = !1) : (this.btnGet.visible = !0, this.btnDouble.visible = !0), this.init2DUI()
		}
		init2DUI() {
			this.btnClose.offAll(), this.btnGet.offAll(), this.btnDouble.offAll(), Pt.instance.AddBtnEvent([this.btnGet, this.btnDouble, this.btnClose]), this.btnClose.on(Laya.Event.CLICK, this, this.onBtnClosed), this.btnGet.on(Laya.Event.CLICK, this, this.onMoreGet, [1]), this.btnDouble.on(Laya.Event.CLICK, this, this.onMoreGet, [2]), this.btnDouble.getChildByName("txt").skin = "UI/" + yi.instance.getPicture() + "/text5.png", this.btnGet.skin = "UI/" + yi.instance.getPicture() + "/text1.png", this.btnDouble.parent.getChildByName("tt").skin = "UI/" + yi.instance.getPicture() + "/title.png", B.refresh(), this.listData = [], this.listData = B.getList(), this.refresh()
		}
		refresh() {
			B.refresh();
			for (var t = 0; t < 7; t++) this.updateItem(this.root.getChildByName("item" + t), t), this.root.getChildByName("item" + t).getChildByName("daychecked").skin = "UI/" + yi.instance.getPicture() + "/text2.png", 6 == t && (this.root.getChildByName("item" + t).getChildByName("dayBg").getChildByName("dayName").skin = "UI/" + yi.instance.getPicture() + "/day7.png", this.root.getChildByName("item" + t).getChildByName("dayBg").getChildByName("dayNum").skin = "UI/" + yi.instance.getPicture() + "/at_7.png");
			this.refreshBtn()
		}
		setIcon(t, e, i, s, n = !1) {
			t.skin = e, t.width = i, t.height = s, n && (t.centerX = .5, t.centerY = .5)
		}
		updateItem(t, e, i, s) {
			t.offAll(Laya.Event.CLICK), t.offAll(Laya.Event.MOUSE_DOWN);
			var n = this.listData[e],
				a = n.prt,
				l = B.getState(a),
				o = t.getChildByName("dayBg");
			if (n.eid) {
				i = "img/skin/" + x.getItemByID(n.eid).ic
			}
			var h = o.getChildByName("dayName"),
				r = o.getChildByName("dayGoods"),
				_ = o.getChildByName("dayPrize"),
				d = o.getChildByName("dayLight"),
				c = (o.getChildByName("dayNum"), t.getChildByName("daychecked"));
			_.text = "x" + n.pq, d.visible = !1, r.skin = i || "img/checkin/gold" + a + ".png", c.visible = !1, h && (h.skin = "img/checkin/day" + a + ".png"), 0 == l || (1 == l ? this.day = a : 2 == l && (c.visible = !0)), 1 == l && (t.offAll(), t.on(Laya.Event.CLICK, this, this.onMoreGet, [t]))
		}
		onSingerGet() {
			this.getCheckin(1)
		}
		onMoreGet(t) {
			t > 1 ? yi.instance.showVideo(() => {
				this.btnGet.visible = !1, this.btnDouble.visible = !1, this.showGold(this.btnDouble), this.getCheckin(2)
			}) : (this.btnGet.visible = !1, this.btnDouble.visible = !1, this.showGold(this.btnGet), this.getCheckin(1))
		}
		onBtnCell(t) {
			this.btnGet.visible = !1, this.btnDouble.visible = !1, this.showGold(t), this.getCheckin(1)
		}
		onSecondGet(t, e, i) {}
		onBtnClosed() {
			this.btnClose.offAll(), this.btnDouble.offAll(), Laya.timer.clearAll(this), bi.instance = null, this.close()
		}
		refreshBtn() {
			for (var t = !0, e = 0; e < this.listData.length; e++) {
				var i = this.listData[e];
				1 == B.getState(i.prt) && (t = !1)
			}
			t ? (this.btnGet.visible = !1, this.btnDouble.visible = !1) : (this.btnGet.visible = !0, this.btnDouble.visible = !0)
		}
		getCheckin(t) {
			for (var e = 0; e < this.listData.length; e++) {
				var i = this.listData[e];
				if (1 == B.getState(i.prt)) return this.mergeItemByTask(i, t), B.completeTask(i.prt), console.log("执行签到 task_id=" + i.id), this.refresh(), void H.saveData()
			}
		}
		mergeItemByTask(t, e = 1) {
			if ("item" == t.pt) {
				var i = x.getItemByID(t.eid);
				2 != x.getItemState(i.id).state ? (x.incItem(i, 1), i.sid, i.sid, this.onBtnClosed()) : (di.instance.player.gold += t.pq * e, ot.instance.Fire(ot.instance.UIGM_TIPS, yi.instance.getLanguage("15") + " X" + t.pq * e + yi.instance.getLanguage("155")))
			} else "gold" == t.pt ? (di.instance.player.gold += t.pq * e, ot.instance.Fire(ot.instance.UIGM_TIPS, yi.instance.getLanguage("15") + " X" + t.pq * e + yi.instance.getLanguage("155")), console.info("奖励: ", t.pq * e + ""), this.onBtnClosed()) : "smoney" == t.pt ? (di.instance.player.ModifiedBuileprintQuantity(t.pt, t.pq * e), ot.instance.Fire(ot.instance.UIGM_TIPS, yi.instance.getLanguage("15") + " X" + t.pq * e + yi.instance.getLanguage("37")), this.onBtnClosed()) : "particlea" == t.pt && (di.instance.player.ModifiedBuileprintQuantity(t.pt, t.pq * e), ot.instance.Fire(ot.instance.UIGM_TIPS, yi.instance.getLanguage("15") + " X" + t.pq * e + yi.instance.getLanguage("143")), this.onBtnClosed())
		}
		showGold(t) {}
		onDisable() {
			bi.instance = null
		}
	}
	bi.SCENE_NAME = "Prefabs/CheckIn.scene";
	class Ai {
		static loadFont() {
			[
				["font/sz_count.fnt", "sz_count"],
				["font/sz_g.fnt", "sz_g"],
				["font/sz_gcount.fnt", "sz_gcount"]
			].forEach(([t, e]) => {
				var i = new Laya.BitmapFont;
				i.loadFont(t, new Laya.Handler(this, this.onFontLoaded, [i, e]))
			})
		}
		static onFontLoaded(t, e) {
			Laya.Text.registerBitmapFont(e, t)
		}
	}
	class Si {
		constructor() {
			this.res_id = 0, this.way = 0, this.pack_type = 0, this.way_qq = 0, this.way_zijie = 0, this.way_baidu = 0, this.way_vivo = 0, this.way_oppo = 0, this.way_huawei = 0, this.way_xiaomi = 0, this.version_qq = 0, this.version_zijie = 0, this.version_baidu = 0, this.version_vivo = 0, this.version_oppo = 0, this.version_huawei = 0, this.version_xiaomi = 0
		}
		static creatByJson(t) {
			var e = new Si;
			return e.res_id = t.rid, e.res_type = t.rty, e.pack_type = t.t, e.res = "res/" + this.getSubPackName(e.pack_type) + "/" + t.res, e.way = t.way, e.version = t.v, e.way_qq = t.q, e.way_zijie = t.z, e.way_baidu = t.b, e.way_vivo = t.i, e.way_oppo = t.o, e.way_huawei = t.h, e.way_xiaomi = t.x, e.version_qq = t.qv, e.version_zijie = t.zv, e.version_baidu = t.bv, e.version_vivo = t.iv, e.version_oppo = t.ov, e.version_huawei = t.hv, e.version_xiaomi = t.xv, e
		}
		static getSubPackName(t) {
			switch (t) {
				case 0:
					return "";
				case 1:
					return "atlas";
				case 2:
					return "other";
				case 3:
					return "home";
				case 6:
					return "share";
				case 7:
					return "sounds";
				case 11:
					return "map_1";
				case 12:
					return "map_2"
			}
		}
	}
	class vi {
		constructor() {
			this.load_way_force = 2, this.sub_pakage_enable = !0, this.channel = "VIVO", this.sub_package_stage = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], this.music_asyn_arr = new Array, vi.instance = this
		}
		getCompleteRes(t) {
			var e = t.way,
				i = t.version;
			if (this.channel == vi.CH_ZJ ? (e = t.way_zijie, i = t.version_zijie + "") : this.channel == vi.CH_QQ ? (e = t.way_qq, i = t.version_qq + "") : this.channel == vi.CH_BAIDU ? (e = t.way_baidu, i = t.version_baidu + "") : this.channel == vi.CH_VIVO ? (e = t.way_vivo, i = t.version_vivo + "") : this.channel == vi.CH_OPPO ? (e = t.way_oppo, i = t.version_oppo + "") : this.channel == vi.CH_XIAOMI ? (e = t.way_xiaomi, i = t.version_xiaomi + "") : this.channel == vi.CH_HUAWEI && (e = t.way_huawei, i = t.version_huawei + ""), 3 == this.load_way_force) return this.base_url + "/" + this.channel + "/" + i + "/" + t.res;
			if (2 == this.load_way_force) {
				if (0 == e) return t.res;
				if (1 == e) return this.base_url + "/" + this.channel + "/" + i + "/" + t.res
			} else {
				if (1 == this.load_way_force) return this.base_url + "/" + this.channel + i + "/" + t.res;
				if (0 == this.load_way_force) return t.res
			}
			return t.res
		}
		setLoadWayForce(t) {
			this.load_way_force = t
		}
		setChannel(t) {}
		loadSubPack(t, e) {
			if (console.log("加载分包", st.onMiniGame(), this.sub_pakage_enable, 2 == this.load_way_force), st.onMiniGame() && 2 == this.load_way_force)
				if (this.sub_pakage_enable)
					if (console.log("加载分包", t), this.sub_package_stage[t] == vi.SUB_PACKAGE_STAGE_NO) {
						let s = st.onWindow();
						if (s) {
							this.sub_package_stage[t] = vi.SUB_PACKAGE_STAGE_LOADING;
							var i = (new Date).getTime();
							s.loadSubpackage({
								name: Si.getSubPackName(t),
								success: s => {
									this.sub_package_stage[t] = vi.SUB_PACKAGE_STAGE_SC, console.log(Si.getSubPackName(t) + "分包 加载耗时：" + ((new Date).getTime() - i)), e()
								},
								fail: i => {
									console.error(Si.getSubPackName(t) + "分包加载失败", JSON.stringify(i)), e()
								}
							})
						}
					} else this.sub_package_stage[t] == vi.SUB_PACKAGE_STAGE_LOADING ? e() : this.sub_package_stage[t] == vi.SUB_PACKAGE_STAGE_SC && e();
			else e();
			else e()
		}
		loadSubSounds(t) {}
		playSound(t, e) {}
		stopSound(t) {}
		playMusic(t) {}
		stopMusic() {
			Laya.SoundManager.stopMusic()
		}
		activeAllSound(t) {
			Laya.SoundManager.muted = !t
		}
	}
	vi.JSON_PATH = "res/atlas/json/", vi.DBMODULE_PATH = "res/atlas/dbmodule/", vi.LOADER_CORE_JSON_RES = vi.JSON_PATH + "loader_core.json", vi.SUB_ID_ALTAS = 1, vi.SUB_ID_OTHER = 2, vi.SUB_ID_HOME = 3, vi.SUB_ID_FPS = 4, vi.SUB_ID_BOX = 5, vi.SUB_ID_SHARE = 6, vi.SUB_ID_SOUNDS = 7, vi.SUB_ID_MAP_1 = 11, vi.SUB_ID_MAP_2 = 12, vi.SUB_ID_MAP_3 = 13, vi.SUB_ID_MAP_4 = 14, vi.SUB_ID_MAP_5 = 15, vi.SUB_ID_MAP_6 = 16, vi.CH_WEIXIN = "WX", vi.CH_QQ = "QQ", vi.CH_ZJ = "ZJ", vi.CH_BAIDU = "BD", vi.CH_VIVO = "VIVO", vi.CH_OPPO = "OPPO", vi.CH_HUAWEI = "HW", vi.CH_XIAOMI = "XM", vi.SUB_PACKAGE_STAGE_NO = 0, vi.SUB_PACKAGE_STAGE_LOADING = 1, vi.SUB_PACKAGE_STAGE_SC = 2;
	class Ti extends Laya.Script {
		constructor() {
			super(), Ai.loadFont(), W.Tween.init(), this.spth = ["Prefabs/buildMenu.json", "Prefabs/off.json", "Prefabs/BuildBloodStrip.json", "Prefabs/TrollBloodStrip.json", "Prefabs/RF.json", "Prefabs/menu.json", "Prefabs/ShopMenu.json", "Prefabs/StartGame.json", "Prefabs/BattleUI.json", "Prefabs/GameOverUI.json", "Prefabs/CreditUI.json", "Prefabs/MatchingUI.json", "Prefabs/TipsUI.json", "Prefabs/SkillUI.json", "Prefabs/ShopUI.json", "Prefabs/CreditUI.json", "Prefabs/TreasureChestUI.json", "res/atlas/UI.atlas", "res/atlas/StartGameUI.atlas", "res/atlas/pipei.atlas", "res/atlas/map.atlas", "res/atlas/load.atlas", "res/atlas/bullet.atlas", "res/atlas/build.atlas", "res/atlas/Atower.atlas"], this._loadWidth = 380
		}
		onAwake() {
			this._scene = Laya.stage.getChildAt(0).getChildAt(0), this._loadIng = this._scene.getChildByName("loading"), this._load = this._scene.getChildByName("load"), this._loadText = this._load.getChildByName("loadText"), this._scene.width = Laya.stage.width, this._scene.height = Laya.stage.height, this._loadIng.width = this._scene.width, this._loadIng.height = this._scene.height, this._load.width = 0;
			let t = this._scene.getChildByName("logo");
			switch ("en-us") {
				case "id":
					t.skin = "UI/Indonesian/MTroll.png";
					break;
				case "vi":
					t.skin = "UI/Vietnamese/MTroll.png";
					break;
				case "pt-br":
					t.skin = "UI/Brazilian/MTroll.png";
					break;
				case "en-us":
					t.skin = "UI/English/MTroll.png"
			}
			this._loadText.text = "5%", this._load.width = 20
		}
		onStart() {
			Laya.stage.on("LOADLANGUAGE", this, this.sartGame), new vi;
			Laya.timer.once(200, this, () => {
				W.Mat.initShader('{"BLINNPHONG":[{"defineNames":["RECEIVESHADOW","SHADOW","SHADOW_SOFT_SHADOW_LOW","DIFFUSEMAP","DIRECTIONLIGHT","SPECULARMAP","NORMALMAP","UV"],"passIndex":1,"subShaderIndex":0},{"defineNames":["RECEIVESHADOW","SHADOW","SHADOW_SOFT_SHADOW_LOW","DIFFUSEMAP","DIRECTIONLIGHT","UV"],"passIndex":1,"subShaderIndex":0},{"defineNames":["RECEIVESHADOW","SHADOW","SHADOW_SOFT_SHADOW_LOW","GPU_INSTANCE","DIFFUSEMAP","DIRECTIONLIGHT","UV"],"passIndex":1,"subShaderIndex":0},{"defineNames":["RECEIVESHADOW","SHADOW","SHADOW_SOFT_SHADOW_LOW","DIFFUSEMAP","DIRECTIONLIGHT","UV","BONE"],"passIndex":1,"subShaderIndex":0},{"defineNames":["SHADOW","SHADOW_SOFT_SHADOW_LOW","DIFFUSEMAP","DIRECTIONLIGHT","UV","BONE"],"passIndex":1,"subShaderIndex":0},{"defineNames":["RECEIVESHADOW","SHADOW","SHADOW_SOFT_SHADOW_LOW","DIFFUSEMAP","DIRECTIONLIGHT","UV","BONE","FOG"],"passIndex":0,"subShaderIndex":0},{"defineNames":["SHADOW","SHADOW_SOFT_SHADOW_LOW","DIFFUSEMAP","DIRECTIONLIGHT","UV","UV1","BONE","FOG"],"passIndex":0,"subShaderIndex":0},{"defineNames":["SHADOW","SHADOW_SOFT_SHADOW_LOW","DIFFUSEMAP","DIRECTIONLIGHT","UV","BONE","FOG"],"passIndex":0,"subShaderIndex":0},{"defineNames":["RECEIVESHADOW","SHADOW","SHADOW_SOFT_SHADOW_LOW","DIFFUSEMAP","DIRECTIONLIGHT","SPECULARMAP","NORMALMAP","UV","UV1","COLOR","TILINGOFFSET","FOG"],"passIndex":0,"subShaderIndex":0},{"defineNames":["RECEIVESHADOW","SHADOW","SHADOW_SOFT_SHADOW_LOW","GPU_INSTANCE","DIFFUSEMAP","DIRECTIONLIGHT","UV","UV1","FOG"],"passIndex":0,"subShaderIndex":0},{"defineNames":["RECEIVESHADOW","SHADOW","SHADOW_SOFT_SHADOW_LOW","DIFFUSEMAP","DIRECTIONLIGHT","UV","FOG"],"passIndex":0,"subShaderIndex":0},{"defineNames":["SHADOW","SHADOW_SOFT_SHADOW_LOW","DIFFUSEMAP","DIRECTIONLIGHT","UV","BONE","ALPHATEST","FOG"],"passIndex":0,"subShaderIndex":0},{"defineNames":["RECEIVESHADOW","DIFFUSEMAP","DIRECTIONLIGHT","UV","BONE","FOG"],"passIndex":0,"subShaderIndex":0},{"defineNames":["RECEIVESHADOW","GPU_INSTANCE","DIFFUSEMAP","DIRECTIONLIGHT","UV","FOG"],"passIndex":0,"subShaderIndex":0},{"defineNames":["RECEIVESHADOW","GPU_INSTANCE","DIFFUSEMAP","DIRECTIONLIGHT","NORMALMAP","UV","TILINGOFFSET","FOG"],"passIndex":0,"subShaderIndex":0},{"defineNames":["RECEIVESHADOW","DIFFUSEMAP","DIRECTIONLIGHT","UV","FOG"],"passIndex":0,"subShaderIndex":0},{"defineNames":["RECEIVESHADOW","DIFFUSEMAP","DIRECTIONLIGHT","UV","UV1","BONE","FOG"],"passIndex":0,"subShaderIndex":0},{"defineNames":["RECEIVESHADOW","DIFFUSEMAP","DIRECTIONLIGHT","UV","BONE","ALPHATEST","FOG"],"passIndex":0,"subShaderIndex":0},{"defineNames":["RECEIVESHADOW","SHADOW","DIFFUSEMAP","DIRECTIONLIGHT","SPECULARMAP","NORMALMAP","UV"],"passIndex":1,"subShaderIndex":0},{"defineNames":["RECEIVESHADOW","SHADOW","DIFFUSEMAP","DIRECTIONLIGHT","UV"],"passIndex":1,"subShaderIndex":0},{"defineNames":["RECEIVESHADOW","SHADOW","GPU_INSTANCE","DIFFUSEMAP","DIRECTIONLIGHT","UV"],"passIndex":1,"subShaderIndex":0},{"defineNames":["SHADOW","DIFFUSEMAP","DIRECTIONLIGHT","UV","BONE"],"passIndex":1,"subShaderIndex":0}],"PBRSpecular":[{"defineNames":["RECEIVESHADOW","SHADOW","SHADOW_SOFT_SHADOW_LOW","DIRECTIONLIGHT","UV"],"passIndex":1,"subShaderIndex":0},{"defineNames":["RECEIVESHADOW","SHADOW","SHADOW_SOFT_SHADOW_LOW","DIRECTIONLIGHT","UV","UV1","ALPHATEST","FOG","ALBEDOTEXTURE","NORMALTEXTURE"],"passIndex":0,"subShaderIndex":0},{"defineNames":["RECEIVESHADOW","SHADOW","DIRECTIONLIGHT","UV"],"passIndex":1,"subShaderIndex":0}],"PBR":[{"defineNames":["RECEIVESHADOW","SHADOW","SHADOW_SOFT_SHADOW_LOW","DIRECTIONLIGHT","UV"],"passIndex":1,"subShaderIndex":0},{"defineNames":["SHADOW","SHADOW_SOFT_SHADOW_LOW","DIRECTIONLIGHT","UV","BONE"],"passIndex":1,"subShaderIndex":0},{"defineNames":["SHADOW","SHADOW_SOFT_SHADOW_LOW","DIRECTIONLIGHT","UV","BONE","FOG","ALBEDOTEXTURE","EMISSION","EMISSIONTEXTURE"],"passIndex":0,"subShaderIndex":0},{"defineNames":["RECEIVESHADOW","SHADOW","SHADOW_SOFT_SHADOW_LOW","DIRECTIONLIGHT","UV","UV1","FOG","ALBEDOTEXTURE","EMISSION","EMISSIONTEXTURE"],"passIndex":0,"subShaderIndex":0},{"defineNames":["RECEIVESHADOW","SHADOW","SHADOW_SOFT_SHADOW_LOW","DIRECTIONLIGHT","UV","ALPHATEST","FOG","ALBEDOTEXTURE","NORMALTEXTURE"],"passIndex":0,"subShaderIndex":0},{"defineNames":["RECEIVESHADOW","SHADOW","SHADOW_SOFT_SHADOW_LOW","DIRECTIONLIGHT","UV","ALPHATEST","FOG","ALBEDOTEXTURE","NORMALTEXTURE","OCCLUSIONTEXTURE","METALLICGLOSSTEXTURE"],"passIndex":0,"subShaderIndex":0},{"defineNames":["RECEIVESHADOW","SHADOW","SHADOW_SOFT_SHADOW_LOW","DIRECTIONLIGHT","UV","UV1","ALPHATEST","FOG","ALBEDOTEXTURE"],"passIndex":0,"subShaderIndex":0},{"defineNames":["RECEIVESHADOW","SHADOW","DIRECTIONLIGHT","UV"],"passIndex":1,"subShaderIndex":0}],"SkyBox":[{"defineNames":[],"passIndex":0,"subShaderIndex":0}],"PARTICLESHURIKEN":[{"defineNames":["DIFFUSEMAP","FOG","ADDTIVEFOG","SPHERHBILLBOARD","COLOROVERLIFETIME","SIZEOVERLIFETIMECURVE","TINTCOLOR"],"passIndex":0,"subShaderIndex":0},{"defineNames":["DIFFUSEMAP","FOG","ADDTIVEFOG","STRETCHEDBILLBOARD","SHAPE","TINTCOLOR"],"passIndex":0,"subShaderIndex":0},{"defineNames":["DIFFUSEMAP","FOG","SPHERHBILLBOARD","COLOROVERLIFETIME","SIZEOVERLIFETIMECURVE","TEXTURESHEETANIMATIONCURVE","SHAPE","TINTCOLOR"],"passIndex":0,"subShaderIndex":0},{"defineNames":["DIFFUSEMAP","FOG","HORIZONTALBILLBOARD","COLOROVERLIFETIME","SIZEOVERLIFETIMECURVE","TEXTURESHEETANIMATIONCURVE","SHAPE","TINTCOLOR"],"passIndex":0,"subShaderIndex":0},{"defineNames":["DIFFUSEMAP","FOG","SPHERHBILLBOARD","COLOROVERLIFETIME","SIZEOVERLIFETIMECURVE","SHAPE","TINTCOLOR"],"passIndex":0,"subShaderIndex":0},{"defineNames":["DIFFUSEMAP","FOG","STRETCHEDBILLBOARD","TEXTURESHEETANIMATIONCURVE","TINTCOLOR"],"passIndex":0,"subShaderIndex":0},{"defineNames":["DIFFUSEMAP","FOG","ADDTIVEFOG","SPHERHBILLBOARD","COLOROVERLIFETIME","SIZEOVERLIFETIMECURVE","SHAPE","TINTCOLOR"],"passIndex":0,"subShaderIndex":0},{"defineNames":["DIFFUSEMAP","FOG","RENDERMODE_MESH","COLOROVERLIFETIME","VELOCITYOVERLIFETIMECONSTANT","TINTCOLOR"],"passIndex":0,"subShaderIndex":0},{"defineNames":["DIFFUSEMAP","FOG","ADDTIVEFOG","SPHERHBILLBOARD","SIZEOVERLIFETIMECURVE","SHAPE","TINTCOLOR"],"passIndex":0,"subShaderIndex":0},{"defineNames":["DIFFUSEMAP","FOG","ADDTIVEFOG","RENDERMODE_MESH","COLOROVERLIFETIME","ROTATIONOVERLIFETIMECONSTANT","ROTATIONOVERLIFETIMESEPERATE","TEXTURESHEETANIMATIONCURVE","TINTCOLOR"],"passIndex":0,"subShaderIndex":0},{"defineNames":["DIFFUSEMAP","FOG","ADDTIVEFOG","STRETCHEDBILLBOARD","COLOROVERLIFETIME","SHAPE","TINTCOLOR"],"passIndex":0,"subShaderIndex":0},{"defineNames":["DIFFUSEMAP","FOG","RENDERMODE_MESH","ROTATIONOVERLIFETIME","ROTATIONOVERLIFETIMECONSTANT","TINTCOLOR"],"passIndex":0,"subShaderIndex":0},{"defineNames":["DIFFUSEMAP","FOG","ADDTIVEFOG","STRETCHEDBILLBOARD","COLOROVERLIFETIME","SIZEOVERLIFETIMECURVE","SHAPE","TINTCOLOR"],"passIndex":0,"subShaderIndex":0},{"defineNames":["DIFFUSEMAP","FOG","SPHERHBILLBOARD","ROTATIONOVERLIFETIMERANDOMCONSTANTS","SIZEOVERLIFETIMECURVE","ROTATIONOVERLIFETIME","SHAPE","TINTCOLOR"],"passIndex":0,"subShaderIndex":0},{"defineNames":["DIFFUSEMAP","FOG","SPHERHBILLBOARD","SIZEOVERLIFETIMECURVE","TEXTURESHEETANIMATIONCURVE","TINTCOLOR"],"passIndex":0,"subShaderIndex":0},{"defineNames":["DIFFUSEMAP","FOG","ADDTIVEFOG","SPHERHBILLBOARD","COLOROVERLIFETIME","ROTATIONOVERLIFETIMERANDOMCONSTANTS","SIZEOVERLIFETIMECURVE","ROTATIONOVERLIFETIME","TINTCOLOR"],"passIndex":0,"subShaderIndex":0},{"defineNames":["DIFFUSEMAP","FOG","ADDTIVEFOG","HORIZONTALBILLBOARD","COLOROVERLIFETIME","SIZEOVERLIFETIMECURVE","TINTCOLOR"],"passIndex":0,"subShaderIndex":0},{"defineNames":["DIFFUSEMAP","FOG","ADDTIVEFOG","SPHERHBILLBOARD","SHAPE","TINTCOLOR"],"passIndex":0,"subShaderIndex":0},{"defineNames":["DIFFUSEMAP","FOG","SPHERHBILLBOARD","COLOROVERLIFETIME","ROTATIONOVERLIFETIMERANDOMCONSTANTS","SIZEOVERLIFETIMECURVE","ROTATIONOVERLIFETIME","TEXTURESHEETANIMATIONCURVE","SHAPE","TINTCOLOR"],"passIndex":0,"subShaderIndex":0},{"defineNames":["DIFFUSEMAP","FOG","ADDTIVEFOG","SPHERHBILLBOARD","SIZEOVERLIFETIMECURVE","TINTCOLOR"],"passIndex":0,"subShaderIndex":0},{"defineNames":["DIFFUSEMAP","FOG","ADDTIVEFOG","STRETCHEDBILLBOARD","SIZEOVERLIFETIMECURVE","ROTATIONOVERLIFETIME","ROTATIONOVERLIFETIMECONSTANT","SHAPE","TINTCOLOR"],"passIndex":0,"subShaderIndex":0},{"defineNames":["DIFFUSEMAP","FOG","HORIZONTALBILLBOARD","COLOROVERLIFETIME","SIZEOVERLIFETIMECURVE","TEXTURESHEETANIMATIONCURVE","TINTCOLOR"],"passIndex":0,"subShaderIndex":0},{"defineNames":["DIFFUSEMAP","FOG","SPHERHBILLBOARD","SIZEOVERLIFETIMECURVE","TEXTURESHEETANIMATIONCURVE","SHAPE","TINTCOLOR"],"passIndex":0,"subShaderIndex":0},{"defineNames":["DIFFUSEMAP","FOG","SPHERHBILLBOARD","SIZEOVERLIFETIMECURVE","SHAPE","TINTCOLOR"],"passIndex":0,"subShaderIndex":0},{"defineNames":["DIFFUSEMAP","TILINGOFFSET","FOG","ADDTIVEFOG","RENDERMODE_MESH","ROTATIONOVERLIFETIMECONSTANT","ROTATIONOVERLIFETIMESEPERATE","TINTCOLOR"],"passIndex":0,"subShaderIndex":0},{"defineNames":["DIFFUSEMAP","FOG","RENDERMODE_MESH","TINTCOLOR"],"passIndex":0,"subShaderIndex":0},{"defineNames":["DIFFUSEMAP","FOG","ADDTIVEFOG","SPHERHBILLBOARD","COLOROVERLIFETIME","ROTATIONOVERLIFETIMERANDOMCONSTANTS","SIZEOVERLIFETIMECURVE","ROTATIONOVERLIFETIME","SHAPE","TINTCOLOR"],"passIndex":0,"subShaderIndex":0}]}')
			}), ie.instance.initData(() => {
				W.Mem.setDebugLog(!1), vi.instance.loadSubPack(vi.SUB_ID_ALTAS, () => {
					Ai.loadFont(), vi.instance.loadSubPack(vi.SUB_ID_HOME, () => {
						vi.instance.loadSubPack(vi.SUB_ID_OTHER, () => {
							vi.instance.loadSubPack(vi.SUB_ID_SOUNDS, () => {
								W.Mem.loadPrefabs(W.MEM_LOAD_TYPE.SHOW_NOW, this, () => {
									Laya.loader.load(this.spth, Laya.Handler.create(this, this.onAssetLoaded), Laya.Handler.create(this, this.onLoading, null, !1)), W.Mem.loadPrefabs(W.MEM_LOAD_TYPE.SHOW_DELAY, this, () => {
										console.info("load [HideDelay] Finish!"), ie.load_all = !0
									})
								})
							})
						})
					})
				})
			})
		}
		onUpdate() {
			ht.instance.HandleUPEvent()
		}
		onAssetLoaded(t) {
			yi.instance.loadOver()
		}
		sartGame() {
			new ni, this._loadIng.removeSelf(), this._loadIng.visible = !1, this._loadIng.destroy(!0)
		}
		onLoading(t) {
			let e = t * this._loadWidth;
			t *= 100, t = Math.floor(t);
			let i = Math.ceil(t % 10) / 2,
				s = "";
			for (let t = 0; t < i; t++) s += ".";
			t > 96 && (t = 96), this._loadText.text = t + "%", this._load.width = e
		}
	}
	class Li extends Laya.Scene {
		constructor() {
			super()
		}
		onOpened() {
			this.zOrder = 99, Li.instance = this, this.root.y = $.height() / 2 - this.root.height / 2, this.root1.y = $.height() / 2 - this.root1.height / 2, Z.eventDis.event("native_open"), this.initData(), this.initBtn()
		}
		initBtn() {
			this.btnCancel.offAll(), this.btnSure.offAll(), this.btnLook.offAll(), this.btnCancel1.offAll(), this.btnSure1.offAll(), this.btnLook1.offAll(), this.btnCancel.on(Laya.Event.CLICK, this, this.onBtnCancel), this.btnSure.on(Laya.Event.CLICK, this, this.onBtnSure), this.btnLook.on(Laya.Event.CLICK, this, this.onBtnSure), this.btnCancel1.on(Laya.Event.CLICK, this, this.onBtnCancel), this.btnSure1.on(Laya.Event.CLICK, this, this.onBtnSure), this.btnLook1.on(Laya.Event.CLICK, this, this.onBtnSure)
		}
		initData() {
			st.mainCH.adContent && (st.mainCH.showNativeAd(), st.mainCH.hideBannerAd(), this.icon.skin = st.mainCH.adContent.imgUrlList[0] ? st.mainCH.adContent.imgUrlList[0] : st.mainCH.adContent.icon, this.lb_title.text = st.mainCH.adContent.title, this.lb_des.text = st.mainCH.adContent.desc, this.icon1.skin = st.mainCH.adContent.imgUrlList[0] ? st.mainCH.adContent.imgUrlList[0] : st.mainCH.adContent.icon, this.lb_title1.text = st.mainCH.adContent.title, this.lb_des1.text = st.mainCH.adContent.desc);
			let t = D.getIntegerInRandom(1, 0);
			this.root.visible = 0 == t, this.root1.visible = 1 == t, this.hand.visible = !1
		}
		onBtnCancel() {
			X.closeToNative() ? (st.mainCH.clickNativeAd(), Laya.timer.once(200, this, () => {
				this.close(), Z.eventDis.event("native_close")
			})) : (this.close(), Z.eventDis.event("native_close"))
		}
		onBtnSure() {
			st.mainCH.clickNativeAd()
		}
		onDisable() {}
		onClosed() {
			Li.instance = null
		}
	}
	Li.SCENE_NAME = "Prefabs/NativeScreen.scene";
	class Ei {
		constructor() {}
		static init() {
			var t = Laya.ClassUtils.regClass;
			t("anim/AnimScale.ts", C), t("navigate/NativeAd.ts", nt), t("sceneui/CheckInUI.ts", bi), t("script/UpDataScript.ts", Ti), t("sceneui/NativeScreenUI.ts", Li), t("sceneui/SettingUI.ts", ge), t("sceneui/StartTryUI.ts", me), t("sceneui/TurntableUI.ts", pe)
		}
	}
	Ei.width = 640, Ei.height = 1136, Ei.scaleMode = "fixedwidth", Ei.screenMode = "none", Ei.alignV = "top", Ei.alignH = "left", Ei.startScene = "Prefabs/Main.scene", Ei.sceneRoot = "", Ei.debug = !1, Ei.stat = !1, Ei.physicsDebug = !1, Ei.exportSceneToJson = !0, Ei.init();
	new class {
		constructor() {
			Config.useRetinalCanvas = !0, console.info("启动了"), window.Laya3D ? Laya3D.init(Ei.width, Ei.height) : Laya.init(Ei.width, Ei.height, Laya.WebGL), Laya.Physics && Laya.Physics.enable(), Laya.DebugPanel && Laya.DebugPanel.enable(), Laya.stage.scaleMode = Ei.scaleMode, Laya.stage.screenMode = Ei.screenMode, Laya.stage.alignV = Ei.alignV, Laya.stage.alignH = Ei.alignH, Laya.URL.exportSceneToJson = Ei.exportSceneToJson, (Ei.debug || "true" == Laya.Utils.getQueryString("debug")) && Laya.enableDebugPanel(), Ei.physicsDebug && Laya.PhysicsDebugDraw && Laya.PhysicsDebugDraw.enable(), Ei.stat && Laya.Stat.show(), yi.instance.init(), E.Instance.init(), document.addEventListener("visibilitychange", function(t) {
				0 == t.hidden && _t.instance.PlaySound(_t.instance.BG_music.gameBGM)
			}), Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION)
		}
		onVersionLoaded() {
			Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded))
		}
		onConfigLoaded() {
			Ei.startScene && Laya.Scene.open(Ei.startScene)
		}
	}
}();
