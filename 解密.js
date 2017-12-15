 //加密js：http://ebotapp.entgroup.cn/Content/Scripts/WebCore/webcore.min.js
 var CryptoJS = CryptoJS || function (g, l) {
 	var h = Object.create || function () {
 			function a() {}
 			return function (b) {
 				a.prototype = b;
 				b = new a;
 				a.prototype = null;
 				return b
 			}
 		}(),
 		k = {},
 		n = k.lib = {},
 		p = n.Base = function () {
 			return {
 				extend: function (a) {
 					var b = h(this);
 					a && b.mixIn(a);
 					b.hasOwnProperty("init") && this.init !== b.init || (b.init = function () {
 						b.$super.init.apply(this, arguments)
 					});
 					b.init.prototype = b;
 					b.$super = this;
 					return b
 				}, create: function () {
 					var a = this.extend();
 					a.init.apply(a, arguments);
 					return a
 				}, init: function () {}, mixIn: function (a) {
 					for (var b in a) a.hasOwnProperty(b) && (this[b] = a[b]);
 					a.hasOwnProperty("toString") && (this.toString = a.toString)
 				}, clone: function () {
 					return this.init.prototype.extend(this)
 				}
 			}
 		}(),
 		q = n.WordArray = p.extend({
 			init: function (a, b) {
 				a = this.words = a || [];
 				this.sigBytes = b != l ? b : 4 * a.length
 			}, toString: function (a) {
 				return (a || u).stringify(this)
 			}, concat: function (a) {
 				var b = this.words,
 					d = a.words,
 					c = this.sigBytes;
 				a = a.sigBytes;
 				this.clamp();
 				if (c % 4)
 					for (var f = 0; f < a; f++) b[c + f >>> 2] |= (d[f >>> 2] >>> 24 - f % 4 * 8 & 255) << 24 - (c + f) % 4 * 8;
 				else
 					for (f = 0; f < a; f += 4) b[c + f >>> 2] = d[f >>> 2];
 				this.sigBytes += a;
 				return this
 			}, clamp: function () {
 				var a = this.words,
 					b = this.sigBytes;
 				a[b >>> 2] &= 4294967295 << 32 - b % 4 * 8;
 				a.length = g.ceil(b / 4)
 			}, clone: function () {
 				var a = p.clone.call(this);
 				a.words = this.words.slice(0);
 				return a
 			}, random: function (a) {
 				for (var b = [], d = function (d) {
 					var a = 987654321;
 					return function () {
 						a = 36969 * (a & 65535) + (a >> 16) & 4294967295;
 						d = 18E3 * (d & 65535) + (d >> 16) & 4294967295;
 						return (((a << 16) + d & 4294967295) / 4294967296 + .5) * (.5 < g.random() ? 1 : -1)
 					}
 				}, c = 0, f; c < a; c += 4) {
 					var m = d(4294967296 * (f || g.random()));
 					f = 987654071 * m();
 					b.push(4294967296 * m() | 0)
 				}
 				return new q.init(b, a)
 			}
 		}),
 		v = k.enc = {},
 		u = v.Hex = {
 			stringify: function (a) {
 				var b = a.words;
 				a = a.sigBytes;
 				for (var d = [], c = 0; c < a; c++) {
 					var f = b[c >>> 2] >>> 24 - c % 4 * 8 & 255;
 					d.push((f >>> 4).toString(16));
 					d.push((f & 15).toString(16))
 				}
 				return d.join("")
 			}, parse: function (a) {
 				for (var b = a.length, d = [], c = 0; c < b; c += 2) d[c >>> 3] |= parseInt(a.substr(c, 2), 16) << 24 - c % 8 * 4;
 				return new q.init(d, b / 2)
 			}
 		},
 		r = v.Latin1 = {
 			stringify: function (a) {
 				var b = a.words;
 				a = a.sigBytes;
 				for (var d = [], c = 0; c < a; c++) d.push(String.fromCharCode(b[c >>> 2] >>> 24 - c % 4 * 8 & 255));
 				return d.join("")
 			}, parse: function (a) {
 				for (var b = a.length, d = [], c = 0; c < b; c++) d[c >>> 2] |= (a.charCodeAt(c) & 255) << 24 - c % 4 * 8;
 				return new q.init(d, b)
 			}
 		},
 		w = v.Utf8 = {
 			stringify: function (a) {
 				try {
 					return decodeURIComponent(escape(r.stringify(a)))
 				} catch (b) {
 					throw Error("Malformed UTF-8 data");
 				}
 			}, parse: function (a) {
 				return r.parse(unescape(encodeURIComponent(a)))
 			}
 		},
 		t = n.BufferedBlockAlgorithm = p.extend({
 			reset: function () {
 				this._data = new q.init;
 				this._nDataBytes = 0
 			}, _append: function (a) {
 				"string" == typeof a && (a = w.parse(a));
 				this._data.concat(a);
 				this._nDataBytes += a.sigBytes
 			}, _process: function (a) {
 				var b = this._data,
 					d = b.words,
 					c = b.sigBytes,
 					f = this.blockSize,
 					m = c / (4 * f),
 					m = a ? g.ceil(m) : g.max((m | 0) - this._minBufferSize, 0);
 				a = m * f;
 				c = g.min(4 * a, c);
 				if (a) {
 					for (var e = 0; e < a; e += f) this._doProcessBlock(d, e);
 					e = d.splice(0, a);
 					b.sigBytes -= c
 				}
 				return new q.init(e, c)
 			}, clone: function () {
 				var a = p.clone.call(this);
 				a._data = this._data.clone();
 				return a
 			}, _minBufferSize: 0
 		});
 	n.Hasher = t.extend({
 		cfg: p.extend(),
 		init: function (a) {
 			this.cfg = this.cfg.extend(a);
 			this.reset()
 		}, reset: function () {
 			t.reset.call(this);
 			this._doReset()
 		}, update: function (a) {
 			this._append(a);
 			this._process();
 			return this
 		}, finalize: function (a) {
 			a && this._append(a);
 			return this._doFinalize()
 		}, blockSize: 16,
 		_createHelper: function (a) {
 			return function (b, d) {
 				return (new a.init(d)).finalize(b)
 			}
 		}, _createHmacHelper: function (a) {
 			return function (b, d) {
 				return (new e.HMAC.init(a, d)).finalize(b)
 			}
 		}
 	});
 	var e = k.algo = {};
 	return k
 }(Math);
 CryptoJS.lib.Cipher || function (g) {
 	var l = CryptoJS,
 		h = l.lib,
 		k = h.Base,
 		n = h.WordArray,
 		p = h.BufferedBlockAlgorithm,
 		q = l.enc.Base64,
 		v = l.algo.EvpKDF,
 		u = h.Cipher = p.extend({
 			cfg: k.extend(),
 			createEncryptor: function (d, a) {
 				return this.create(this._ENC_XFORM_MODE, d, a)
 			}, createDecryptor: function (d, a) {
 				return this.create(this._DEC_XFORM_MODE, d, a)
 			}, init: function (d, a, b) {
 				this.cfg = this.cfg.extend(b);
 				this._xformMode = d;
 				this._key = a;
 				this.reset()
 			}, reset: function () {
 				p.reset.call(this);
 				this._doReset()
 			}, process: function (a) {
 				this._append(a);
 				return this._process()
 			}, finalize: function (a) {
 				a && this._append(a);
 				return this._doFinalize()
 			}, keySize: 4,
 			ivSize: 4,
 			_ENC_XFORM_MODE: 1,
 			_DEC_XFORM_MODE: 2,
 			_createHelper: function () {
 				return function (d) {
 					return {
 						encrypt: function (c, f, m) {
 							return ("string" == typeof f ? b : a).encrypt(d, c, f, m)
 						}, decrypt: function (c, f, m) {
 							return ("string" == typeof f ? b : a).decrypt(d, c, f, m)
 						}
 					}
 				}
 			}()
 		});
 	h.StreamCipher = u.extend({
 		_doFinalize: function () {
 			return this._process(!0)
 		}, blockSize: 1
 	});
 	var r = l.mode = {},
 		w = h.BlockCipherMode = k.extend({
 			createEncryptor: function (a, c) {
 				return this.Encryptor.create(a, c)
 			}, createDecryptor: function (a, c) {
 				return this.Decryptor.create(a, c)
 			}, init: function (a, c) {
 				this._cipher = a;
 				this._iv = c
 			}
 		}),
 		r = r.CBC = function () {
 			function a(a, d, c) {
 				var b = this._iv;
 				b ? this._iv = g : b = this._prevBlock;
 				for (var f = 0; f < c; f++) a[d + f] ^= b[f]
 			}
 			var c = w.extend();
 			c.Encryptor = c.extend({
 				processBlock: function (d, c) {
 					var b = this._cipher,
 						f = b.blockSize;
 					a.call(this, d, c, f);
 					b.encryptBlock(d, c);
 					this._prevBlock = d.slice(c, c + f)
 				}
 			});
 			c.Decryptor = c.extend({
 				processBlock: function (d, c) {
 					var b = this._cipher,
 						f = b.blockSize,
 						m = d.slice(c, c + f);
 					b.decryptBlock(d, c);
 					a.call(this, d, c, f);
 					this._prevBlock = m
 				}
 			});
 			return c
 		}(),
 		t = (l.pad = {}).Pkcs7 = {
 			pad: function (a, c) {
 				for (var d = 4 * c, d = d - a.sigBytes % d, b = d << 24 | d << 16 | d << 8 | d, e = [], g = 0; g < d; g += 4) e.push(b);
 				d = n.create(e, d);
 				a.concat(d)
 			}, unpad: function (a) {
 				a.sigBytes -= a.words[a.sigBytes - 1 >>> 2] & 255
 			}
 		};
 	h.BlockCipher = u.extend({
 		cfg: u.cfg.extend({
 			mode: r,
 			padding: t
 		}),
 		reset: function () {
 			u.reset.call(this);
 			var a = this.cfg,
 				c = a.iv,
 				a = a.mode;
 			if (this._xformMode == this._ENC_XFORM_MODE) var b = a.createEncryptor;
 			else b = a.createDecryptor, this._minBufferSize = 1;
 			this._mode && this._mode.__creator == b ? this._mode.init(this, c && c.words) : (this._mode = b.call(a, this, c && c.words), this._mode.__creator = b)
 		}, _doProcessBlock: function (a, c) {
 			this._mode.processBlock(a, c)
 		}, _doFinalize: function () {
 			var a = this.cfg.padding;
 			if (this._xformMode == this._ENC_XFORM_MODE) {
 				a.pad(this._data, this.blockSize);
 				var c = this._process(!0)
 			} else c = this._process(!0), a.unpad(c);
 			return c
 		}, blockSize: 4
 	});
 	var e = h.CipherParams = k.extend({
 			init: function (a) {
 				this.mixIn(a)
 			}, toString: function (a) {
 				return (a || this.formatter).stringify(this)
 			}
 		}),
 		r = (l.format = {}).OpenSSL = {
 			stringify: function (a) {
 				var c = a.ciphertext;
 				a = a.salt;
 				return (a ? n.create([1398893684, 1701076831]).concat(a).concat(c) : c).toString(q)
 			}, parse: function (a) {
 				a = q.parse(a);
 				var c = a.words;
 				if (1398893684 == c[0] && 1701076831 == c[1]) {
 					var b = n.create(c.slice(2, 4));
 					c.splice(0, 4);
 					a.sigBytes -= 16
 				}
 				return e.create({
 					ciphertext: a,
 					salt: b
 				})
 			}
 		},
 		a = h.SerializableCipher = k.extend({
 			cfg: k.extend({
 				format: r
 			}),
 			encrypt: function (a, c, b, m) {
 				m = this.cfg.extend(m);
 				var d = a.createEncryptor(b, m);
 				c = d.finalize(c);
 				d = d.cfg;
 				return e.create({
 					ciphertext: c,
 					key: b,
 					iv: d.iv,
 					algorithm: a,
 					mode: d.mode,
 					padding: d.padding,
 					blockSize: a.blockSize,
 					formatter: m.format
 				})
 			}, decrypt: function (a, c, b, e) {
 				e = this.cfg.extend(e);
 				c = this._parse(c, e.format);
 				return a.createDecryptor(b, e).finalize(c.ciphertext)
 			}, _parse: function (a, c) {
 				return "string" == typeof a ? c.parse(a, this) : a
 			}
 		}),
 		l = (l.kdf = {}).OpenSSL = {
 			execute: function (a, c, b, m) {
 				m || (m = n.random(8));
 				a = v.create({
 					keySize: c + b
 				}).compute(a, m);
 				b = n.create(a.words.slice(c), 4 * b);
 				a.sigBytes = 4 * c;
 				return e.create({
 					key: a,
 					iv: b,
 					salt: m
 				})
 			}
 		},
 		b = h.PasswordBasedCipher = a.extend({
 			cfg: a.cfg.extend({
 				kdf: l
 			}),
 			encrypt: function (b, c, f, e) {
 				e = this.cfg.extend(e);
 				f = e.kdf.execute(f, b.keySize, b.ivSize);
 				e.iv = f.iv;
 				b = a.encrypt.call(this, b, c, f.key, e);
 				b.mixIn(f);
 				return b
 			}, decrypt: function (b, c, e, g) {
 				g = this.cfg.extend(g);
 				c = this._parse(c, g.format);
 				e = g.kdf.execute(e, b.keySize, b.ivSize, c.salt);
 				g.iv = e.iv;
 				return a.decrypt.call(this, b, c, e.key, g)
 			}
 		})
 }();
 CryptoJS.mode.ECB = function () {
 	var g = CryptoJS.lib.BlockCipherMode.extend();
 	g.Encryptor = g.extend({
 		processBlock: function (g, h) {
 			this._cipher.encryptBlock(g, h)
 		}
 	});
 	g.Decryptor = g.extend({
 		processBlock: function (g, h) {
 			this._cipher.decryptBlock(g, h)
 		}
 	});
 	return g
 }();
 (function () {
 	function g(e, a) {
 		var b = (this._lBlock >>> e ^ this._rBlock) & a;
 		this._rBlock ^= b;
 		this._lBlock ^= b << e
 	}

 	function l(e, a) {
 		var b = (this._rBlock >>> e ^ this._lBlock) & a;
 		this._lBlock ^= b;
 		this._rBlock ^= b << e
 	}
 	var h = CryptoJS,
 		k = h.lib,
 		n = k.WordArray,
 		k = k.BlockCipher,
 		p = h.algo,
 		q = [57, 49, 41, 33, 25, 17, 9, 1, 58, 50, 42, 34, 26, 18, 10, 2, 59, 51, 43, 35, 27, 19, 11, 3, 60, 52, 44, 36, 63, 55, 47, 39, 31, 23, 15, 7, 62, 54, 46, 38, 30, 22, 14, 6, 61, 53, 45, 37, 29, 21, 13, 5, 28, 20, 12, 4],
 		v = [14, 17, 11, 24, 1, 5, 3, 28, 15, 6, 21, 10, 23, 19, 12, 4, 26, 8, 16, 7, 27, 20, 13, 2, 41, 52, 31, 37, 47, 55, 30, 40, 51, 45, 33, 48, 44, 49, 39, 56, 34, 53, 46, 42, 50, 36, 29, 32],
 		u = [1, 2, 4, 6, 8, 10, 12, 14, 15, 17, 19, 21, 23, 25, 27, 28],
 		r = [{
 			0: 8421888,
 			268435456: 32768,
 			536870912: 8421378,
 			805306368: 2,
 			1073741824: 512,
 			1342177280: 8421890,
 			1610612736: 8389122,
 			1879048192: 8388608,
 			2147483648: 514,
 			2415919104: 8389120,
 			2684354560: 33280,
 			2952790016: 8421376,
 			3221225472: 32770,
 			3489660928: 8388610,
 			3758096384: 0,
 			4026531840: 33282,
 			134217728: 0,
 			402653184: 8421890,
 			671088640: 33282,
 			939524096: 32768,
 			1207959552: 8421888,
 			1476395008: 512,
 			1744830464: 8421378,
 			2013265920: 2,
 			2281701376: 8389120,
 			2550136832: 33280,
 			2818572288: 8421376,
 			3087007744: 8389122,
 			3355443200: 8388610,
 			3623878656: 32770,
 			3892314112: 514,
 			4160749568: 8388608,
 			1: 32768,
 			268435457: 2,
 			536870913: 8421888,
 			805306369: 8388608,
 			1073741825: 8421378,
 			1342177281: 33280,
 			1610612737: 512,
 			1879048193: 8389122,
 			2147483649: 8421890,
 			2415919105: 8421376,
 			2684354561: 8388610,
 			2952790017: 33282,
 			3221225473: 514,
 			3489660929: 8389120,
 			3758096385: 32770,
 			4026531841: 0,
 			134217729: 8421890,
 			402653185: 8421376,
 			671088641: 8388608,
 			939524097: 512,
 			1207959553: 32768,
 			1476395009: 8388610,
 			1744830465: 2,
 			2013265921: 33282,
 			2281701377: 32770,
 			2550136833: 8389122,
 			2818572289: 514,
 			3087007745: 8421888,
 			3355443201: 8389120,
 			3623878657: 0,
 			3892314113: 33280,
 			4160749569: 8421378
 		}, {
 			0: 1074282512,
 			16777216: 16384,
 			33554432: 524288,
 			50331648: 1074266128,
 			67108864: 1073741840,
 			83886080: 1074282496,
 			100663296: 1073758208,
 			117440512: 16,
 			134217728: 540672,
 			150994944: 1073758224,
 			167772160: 1073741824,
 			184549376: 540688,
 			201326592: 524304,
 			218103808: 0,
 			234881024: 16400,
 			251658240: 1074266112,
 			8388608: 1073758208,
 			25165824: 540688,
 			41943040: 16,
 			58720256: 1073758224,
 			75497472: 1074282512,
 			92274688: 1073741824,
 			109051904: 524288,
 			125829120: 1074266128,
 			142606336: 524304,
 			159383552: 0,
 			176160768: 16384,
 			192937984: 1074266112,
 			209715200: 1073741840,
 			226492416: 540672,
 			243269632: 1074282496,
 			260046848: 16400,
 			268435456: 0,
 			285212672: 1074266128,
 			301989888: 1073758224,
 			318767104: 1074282496,
 			335544320: 1074266112,
 			352321536: 16,
 			369098752: 540688,
 			385875968: 16384,
 			402653184: 16400,
 			419430400: 524288,
 			436207616: 524304,
 			452984832: 1073741840,
 			469762048: 540672,
 			486539264: 1073758208,
 			503316480: 1073741824,
 			520093696: 1074282512,
 			276824064: 540688,
 			293601280: 524288,
 			310378496: 1074266112,
 			327155712: 16384,
 			343932928: 1073758208,
 			360710144: 1074282512,
 			377487360: 16,
 			394264576: 1073741824,
 			411041792: 1074282496,
 			427819008: 1073741840,
 			444596224: 1073758224,
 			461373440: 524304,
 			478150656: 0,
 			494927872: 16400,
 			511705088: 1074266128,
 			528482304: 540672
 		}, {
 			0: 260,
 			1048576: 0,
 			2097152: 67109120,
 			3145728: 65796,
 			4194304: 65540,
 			5242880: 67108868,
 			6291456: 67174660,
 			7340032: 67174400,
 			8388608: 67108864,
 			9437184: 67174656,
 			10485760: 65792,
 			11534336: 67174404,
 			12582912: 67109124,
 			13631488: 65536,
 			14680064: 4,
 			15728640: 256,
 			524288: 67174656,
 			1572864: 67174404,
 			2621440: 0,
 			3670016: 67109120,
 			4718592: 67108868,
 			5767168: 65536,
 			6815744: 65540,
 			7864320: 260,
 			8912896: 4,
 			9961472: 256,
 			11010048: 67174400,
 			12058624: 65796,
 			13107200: 65792,
 			14155776: 67109124,
 			15204352: 67174660,
 			16252928: 67108864,
 			16777216: 67174656,
 			17825792: 65540,
 			18874368: 65536,
 			19922944: 67109120,
 			20971520: 256,
 			22020096: 67174660,
 			23068672: 67108868,
 			24117248: 0,
 			25165824: 67109124,
 			26214400: 67108864,
 			27262976: 4,
 			28311552: 65792,
 			29360128: 67174400,
 			30408704: 260,
 			31457280: 65796,
 			32505856: 67174404,
 			17301504: 67108864,
 			18350080: 260,
 			19398656: 67174656,
 			20447232: 0,
 			21495808: 65540,
 			22544384: 67109120,
 			23592960: 256,
 			24641536: 67174404,
 			25690112: 65536,
 			26738688: 67174660,
 			27787264: 65796,
 			28835840: 67108868,
 			29884416: 67109124,
 			30932992: 67174400,
 			31981568: 4,
 			33030144: 65792
 		}, {
 			0: 2151682048,
 			65536: 2147487808,
 			131072: 4198464,
 			196608: 2151677952,
 			262144: 0,
 			327680: 4198400,
 			393216: 2147483712,
 			458752: 4194368,
 			524288: 2147483648,
 			589824: 4194304,
 			655360: 64,
 			720896: 2147487744,
 			786432: 2151678016,
 			851968: 4160,
 			917504: 4096,
 			983040: 2151682112,
 			32768: 2147487808,
 			98304: 64,
 			163840: 2151678016,
 			229376: 2147487744,
 			294912: 4198400,
 			360448: 2151682112,
 			425984: 0,
 			491520: 2151677952,
 			557056: 4096,
 			622592: 2151682048,
 			688128: 4194304,
 			753664: 4160,
 			819200: 2147483648,
 			884736: 4194368,
 			950272: 4198464,
 			1015808: 2147483712,
 			1048576: 4194368,
 			1114112: 4198400,
 			1179648: 2147483712,
 			1245184: 0,
 			1310720: 4160,
 			1376256: 2151678016,
 			1441792: 2151682048,
 			1507328: 2147487808,
 			1572864: 2151682112,
 			1638400: 2147483648,
 			1703936: 2151677952,
 			1769472: 4198464,
 			1835008: 2147487744,
 			1900544: 4194304,
 			1966080: 64,
 			2031616: 4096,
 			1081344: 2151677952,
 			1146880: 2151682112,
 			1212416: 0,
 			1277952: 4198400,
 			1343488: 4194368,
 			1409024: 2147483648,
 			1474560: 2147487808,
 			1540096: 64,
 			1605632: 2147483712,
 			1671168: 4096,
 			1736704: 2147487744,
 			1802240: 2151678016,
 			1867776: 4160,
 			1933312: 2151682048,
 			1998848: 4194304,
 			2064384: 4198464
 		}, {
 			0: 128,
 			4096: 17039360,
 			8192: 262144,
 			12288: 536870912,
 			16384: 537133184,
 			20480: 16777344,
 			24576: 553648256,
 			28672: 262272,
 			32768: 16777216,
 			36864: 537133056,
 			40960: 536871040,
 			45056: 553910400,
 			49152: 553910272,
 			53248: 0,
 			57344: 17039488,
 			61440: 553648128,
 			2048: 17039488,
 			6144: 553648256,
 			10240: 128,
 			14336: 17039360,
 			18432: 262144,
 			22528: 537133184,
 			26624: 553910272,
 			30720: 536870912,
 			34816: 537133056,
 			38912: 0,
 			43008: 553910400,
 			47104: 16777344,
 			51200: 536871040,
 			55296: 553648128,
 			59392: 16777216,
 			63488: 262272,
 			65536: 262144,
 			69632: 128,
 			73728: 536870912,
 			77824: 553648256,
 			81920: 16777344,
 			86016: 553910272,
 			90112: 537133184,
 			94208: 16777216,
 			98304: 553910400,
 			102400: 553648128,
 			106496: 17039360,
 			110592: 537133056,
 			114688: 262272,
 			118784: 536871040,
 			122880: 0,
 			126976: 17039488,
 			67584: 553648256,
 			71680: 16777216,
 			75776: 17039360,
 			79872: 537133184,
 			83968: 536870912,
 			88064: 17039488,
 			92160: 128,
 			96256: 553910272,
 			100352: 262272,
 			104448: 553910400,
 			108544: 0,
 			112640: 553648128,
 			116736: 16777344,
 			120832: 262144,
 			124928: 537133056,
 			129024: 536871040
 		}, {
 			0: 268435464,
 			256: 8192,
 			512: 270532608,
 			768: 270540808,
 			1024: 268443648,
 			1280: 2097152,
 			1536: 2097160,
 			1792: 268435456,
 			2048: 0,
 			2304: 268443656,
 			2560: 2105344,
 			2816: 8,
 			3072: 270532616,
 			3328: 2105352,
 			3584: 8200,
 			3840: 270540800,
 			128: 270532608,
 			384: 270540808,
 			640: 8,
 			896: 2097152,
 			1152: 2105352,
 			1408: 268435464,
 			1664: 268443648,
 			1920: 8200,
 			2176: 2097160,
 			2432: 8192,
 			2688: 268443656,
 			2944: 270532616,
 			3200: 0,
 			3456: 270540800,
 			3712: 2105344,
 			3968: 268435456,
 			4096: 268443648,
 			4352: 270532616,
 			4608: 270540808,
 			4864: 8200,
 			5120: 2097152,
 			5376: 268435456,
 			5632: 268435464,
 			5888: 2105344,
 			6144: 2105352,
 			6400: 0,
 			6656: 8,
 			6912: 270532608,
 			7168: 8192,
 			7424: 268443656,
 			7680: 270540800,
 			7936: 2097160,
 			4224: 8,
 			4480: 2105344,
 			4736: 2097152,
 			4992: 268435464,
 			5248: 268443648,
 			5504: 8200,
 			5760: 270540808,
 			6016: 270532608,
 			6272: 270540800,
 			6528: 270532616,
 			6784: 8192,
 			7040: 2105352,
 			7296: 2097160,
 			7552: 0,
 			7808: 268435456,
 			8064: 268443656
 		}, {
 			0: 1048576,
 			16: 33555457,
 			32: 1024,
 			48: 1049601,
 			64: 34604033,
 			80: 0,
 			96: 1,
 			112: 34603009,
 			128: 33555456,
 			144: 1048577,
 			160: 33554433,
 			176: 34604032,
 			192: 34603008,
 			208: 1025,
 			224: 1049600,
 			240: 33554432,
 			8: 34603009,
 			24: 0,
 			40: 33555457,
 			56: 34604032,
 			72: 1048576,
 			88: 33554433,
 			104: 33554432,
 			120: 1025,
 			136: 1049601,
 			152: 33555456,
 			168: 34603008,
 			184: 1048577,
 			200: 1024,
 			216: 34604033,
 			232: 1,
 			248: 1049600,
 			256: 33554432,
 			272: 1048576,
 			288: 33555457,
 			304: 34603009,
 			320: 1048577,
 			336: 33555456,
 			352: 34604032,
 			368: 1049601,
 			384: 1025,
 			400: 34604033,
 			416: 1049600,
 			432: 1,
 			448: 0,
 			464: 34603008,
 			480: 33554433,
 			496: 1024,
 			264: 1049600,
 			280: 33555457,
 			296: 34603009,
 			312: 1,
 			328: 33554432,
 			344: 1048576,
 			360: 1025,
 			376: 34604032,
 			392: 33554433,
 			408: 34603008,
 			424: 0,
 			440: 34604033,
 			456: 1049601,
 			472: 1024,
 			488: 33555456,
 			504: 1048577
 		}, {
 			0: 134219808,
 			1: 131072,
 			2: 134217728,
 			3: 32,
 			4: 131104,
 			5: 134350880,
 			6: 134350848,
 			7: 2048,
 			8: 134348800,
 			9: 134219776,
 			10: 133120,
 			11: 134348832,
 			12: 2080,
 			13: 0,
 			14: 134217760,
 			15: 133152,
 			2147483648: 2048,
 			2147483649: 134350880,
 			2147483650: 134219808,
 			2147483651: 134217728,
 			2147483652: 134348800,
 			2147483653: 133120,
 			2147483654: 133152,
 			2147483655: 32,
 			2147483656: 134217760,
 			2147483657: 2080,
 			2147483658: 131104,
 			2147483659: 134350848,
 			2147483660: 0,
 			2147483661: 134348832,
 			2147483662: 134219776,
 			2147483663: 131072,
 			16: 133152,
 			17: 134350848,
 			18: 32,
 			19: 2048,
 			20: 134219776,
 			21: 134217760,
 			22: 134348832,
 			23: 131072,
 			24: 0,
 			25: 131104,
 			26: 134348800,
 			27: 134219808,
 			28: 134350880,
 			29: 133120,
 			30: 2080,
 			31: 134217728,
 			2147483664: 131072,
 			2147483665: 2048,
 			2147483666: 134348832,
 			2147483667: 133152,
 			2147483668: 32,
 			2147483669: 134348800,
 			2147483670: 134217728,
 			2147483671: 134219808,
 			2147483672: 134350880,
 			2147483673: 134217760,
 			2147483674: 134219776,
 			2147483675: 0,
 			2147483676: 133120,
 			2147483677: 2080,
 			2147483678: 131104,
 			2147483679: 134350848
 		}],
 		w = [4160749569, 528482304, 33030144, 2064384, 129024, 8064, 504, 2147483679],
 		t = p.DES = k.extend({
 			_doReset: function () {
 				for (var e = this._key.words, a = [], b = 0; 56 > b; b++) {
 					var d = q[b] - 1;
 					a[b] = e[d >>> 5] >>> 31 - d % 32 & 1
 				}
 				e = this._subKeys = [];
 				for (d = 0; 16 > d; d++) {
 					for (var c = e[d] = [], f = u[d], b = 0; 24 > b; b++) c[b / 6 | 0] |= a[(v[b] - 1 + f) % 28] << 31 - b % 6, c[4 + (b / 6 | 0)] |= a[28 + (v[b + 24] - 1 + f) % 28] << 31 - b % 6;
 					c[0] = c[0] << 1 | c[0] >>> 31;
 					for (b = 1; 7 > b; b++) c[b] >>>= 4 * (b - 1) + 3;
 					c[7] = c[7] << 5 | c[7] >>> 27
 				}
 				a = this._invSubKeys = [];
 				for (b = 0; 16 > b; b++) a[b] = e[15 - b]
 			}, encryptBlock: function (e, a) {
 				this._doCryptBlock(e, a, this._subKeys)
 			}, decryptBlock: function (e, a) {
 				this._doCryptBlock(e, a, this._invSubKeys)
 			}, _doCryptBlock: function (e, a, b) {
 				this._lBlock = e[a];
 				this._rBlock = e[a + 1];
 				g.call(this, 4, 252645135);
 				g.call(this, 16, 65535);
 				l.call(this, 2, 858993459);
 				l.call(this, 8, 16711935);
 				g.call(this, 1, 1431655765);
 				for (var d = 0; 16 > d; d++) {
 					for (var c = b[d], f = this._lBlock, h = this._rBlock, k = 0, n = 0; 8 > n; n++) k |= r[n][((h ^ c[n]) & w[n]) >>> 0];
 					this._lBlock = h;
 					this._rBlock = f ^ k
 				}
 				b = this._lBlock;
 				this._lBlock = this._rBlock;
 				this._rBlock = b;
 				g.call(this, 1, 1431655765);
 				l.call(this, 8, 16711935);
 				l.call(this, 2, 858993459);
 				g.call(this, 16, 65535);
 				g.call(this, 4, 252645135);
 				e[a] = this._lBlock;
 				e[a + 1] = this._rBlock
 			}, keySize: 2,
 			ivSize: 2,
 			blockSize: 2
 		});
 	h.DES = k._createHelper(t);
 	p = p.TripleDES = k.extend({
 		_doReset: function () {
 			var e = this._key.words;
 			this._des1 = t.createEncryptor(n.create(e.slice(0, 2)));
 			this._des2 = t.createEncryptor(n.create(e.slice(2, 4)));
 			this._des3 = t.createEncryptor(n.create(e.slice(4, 6)))
 		}, encryptBlock: function (e, a) {
 			this._des1.encryptBlock(e, a);
 			this._des2.decryptBlock(e, a);
 			this._des3.encryptBlock(e, a)
 		}, decryptBlock: function (e, a) {
 			this._des3.decryptBlock(e, a);
 			this._des2.encryptBlock(e, a);
 			this._des1.decryptBlock(e, a)
 		}, keySize: 6,
 		ivSize: 2,
 		blockSize: 2
 	});
 	h.TripleDES = k._createHelper(p)
 })();
function test(data){
	var webcore = function () {
 		this.shell = function (g) {
 			var l = parseInt(g.substr(g.length - 1,1), 16),
 				h = g.substr(l, 8),
 				k = "";
 			0 == l ? k = g.substr(8, g.length - 9) : (k += g.substr(0, l), k += g.substr(l + 8, g.length - 9 - l));
 			g = k;
 			l = CryptoJS.enc.Utf8.parse(h);
 			h = CryptoJS.enc.Utf8.parse(h);
 			h = CryptoJS.DES.decrypt({
 				ciphertext: CryptoJS.enc.Hex.parse(g)
 			}, l, {
 				iv: h,
 				mode: CryptoJS.mode.ECB,
 				padding: CryptoJS.pad.Pkcs7
 			}).toString(CryptoJS.enc.Utf8);
 			return h.substr(0, h.length - 19)
 		}
 	},
 	webInstace = new webcore;
 	return webInstace.shell(data);
}