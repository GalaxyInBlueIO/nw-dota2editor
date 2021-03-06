'use strict';

var common = {};

common.template = function (str, list) {
	$.each(list, function(key, value) {
		var _regex = new RegExp("\\$\\{" + key + "\\}", "g");
		str = str.replace(_regex, value);
	});
	return str;
};

common.getValueByPath = function (unit, path, defaultValue) {
	if(unit === null || unit === undefined) throw "Unit or path can't be empty!";
	if(path === "" || path === null || path === undefined) return unit;

	path = path.replace(/\[(\d+)\]/g, ".$1").replace(/^\./, "").split(/\./);
	$.each(path, function(i, path) {
		unit = unit[path];
		if(unit === null || unit === undefined) {
			unit = null;
			return false;
		}
	});
	if(unit === null && defaultValue !== undefined) {
		unit = defaultValue;
	}
	return unit;
};

common.setValueByPath = function(unit, path, value) {
	if(!unit || path == null || path === "") throw "Unit or path can't be empty!";

	var _inArray = false;
	var _end = 0;
	var _start = 0;
	var _unit = unit;

	function _nextPath(array) {
		var _key = path.slice(_start, _end);
		if(_inArray) {
			_key = _key.slice(0, -1);
		}
		if(!_unit[_key]) {
			if(array) {
				_unit[_key] = [];
			} else {
				_unit[_key] = {};
			}
		}
		_unit = _unit[_key];
	}

	for(; _end < path.length ; _end += 1) {
		if(path[_end] === ".") {
			_nextPath(false);
			_start = _end + 1;
			_inArray = false;
		} else if(path[_end] === "[") {
			_nextPath(true);
			_start = _end + 1;
			_inArray = true;
		}
	}

	_unit[path.slice(_start, _inArray ? -1 : _end)] = value;

	return unit;
};

common.parseJSON = function (str, defaultVal) {
	try {
		return JSON.parse(str);
	} catch(err) {
		if(defaultVal === undefined) {
			console.warn("Can't parse JSON: " + str);
		}
	}
	return defaultVal === undefined ? null : defaultVal;
};

common.isEmpty = function(val) {
	if($.isArray(val)) {
		return val.length === 0;
	} else {
		return val === null || val === undefined;
	}
};

// ======================= Log ========================
var _DEBUG_IGNORE_LIST = ["KV", "Ability", "Unit"];

window._LOG = function (type, lvl) {
	var _args = Array.prototype.slice.call(arguments, 2);
	_args.unshift("["+type+"]" + common.text.repeat("  ", lvl));
	if($.inArray(type, _DEBUG_IGNORE_LIST) === -1 ) {
		console.log.apply(console, _args);
	}
};

window._WARN = function (type, lvl) {
	var _args = Array.prototype.slice.call(arguments, 2);
	_args.unshift("["+type+"]" + common.text.repeat("  ", lvl));
	console.warn.apply(console, _args);
};

window._ERROR = function (type, lvl) {
	var _args = Array.prototype.slice.call(arguments, 2);
	_args.unshift("["+type+"]" + common.text.repeat("  ", lvl));
	console.error.apply(console, _args);
};

// ======================= Text =======================
common.text = {};

common.text.repeat = function(text, times) {
	var _str = "";
	for(var i = 0 ; i < (times || 0) ; i += 1) {
		_str += text;
	}
	return _str;
};

common.text.preFill = function(text, fillChar, length) {
	text = text + "";
	while(text.length < length) {
		text = fillChar + text;
	}
	return text;
};

common.text.equals = function(strA, strB) {
	return (strA + "").toUpperCase() === (strB + "").toUpperCase();
};

common.text.contains = function(oriStr, subStr) {
	oriStr = (oriStr || "").toUpperCase();
	subStr = (subStr || "").toUpperCase();
	return oriStr.indexOf(subStr) !== -1;
};

common.text.capitalize = function(str) {
	return str.replace(/(^|\s+)\w/g,function(s){ return s.toUpperCase();});
};

common.text.replaceAll = function(str, src, tgt) {
	if(src === tgt) return str;
	for(var i = 0 ; i < 1000 ; i += 1) {
		str = str.replace(src, tgt);
		if(str.indexOf(src) === -1) break;
	}
	return str;
};

// ====================== Array =======================
common.array = {};

/***
 * Nevet Modify it!
 * @type {Array}
 */
common.array.empty = [];

/***
 * Create number array
 */
common.array.num = function(num) {
	var _array = [];
	for(var i = 0 ; i < num ; i += 1) {
		_array[i] = i;
	}
	return _array;
};

common.array.sum = function(list, path) {
	var _sum = 0;
	if(list) {
		$.each(list, function(i, unit) {
			var _val = common.getValueByPath(unit, path);
			if(typeof _val === "number") {
				_sum += _val;
			}
		});
	}
	return _sum;
};

common.array.max = function(list, path) {
	var _max = null;
	if(list) {
		$.each(list, function(i, unit) {
			var _val = common.getValueByPath(unit, path);
			if(typeof _val === "number" && (_max === null || _max < _val)) {
				_max = _val;
			}
		});
	}
	return _max;
};

common.array.bottom = function(list, path, count) {
	var _list = list.slice();

	_list.sort(function(a, b) {
		var _a = common.getValueByPath(a, path, null);
		var _b = common.getValueByPath(b, path, null);

		if(_a === _b) return 0;
		if(_a < _b || _a === null) {
			return -1;
		} else {
			return 1;
		}
	});
	return !count ? _list : _list.slice(0, count);
};
common.array.top = function(list, path, count) {
	var _list = common.array.bottom(list, path);
	_list.reverse();
	return !count ? _list : _list.slice(0, count);
};

common.array.find = function(val, list, path, findAll, caseSensitive) {
	path = path || "";

	if(caseSensitive === false && typeof val === "string") {
		val = val.toUpperCase();

		var _list = $.grep(list, function(unit) {
			var _val = common.getValueByPath(unit, path);
			return typeof _val === "string" && val === _val.toUpperCase();
		});
	} else {
		var _list = $.grep(list, function(unit) {
			return val === common.getValueByPath(unit, path);
		});
	}

	return findAll ? _list : (_list.length === 0 ? null : _list[0]);
};

common.array.filter = function(val, list, path) {
	return common.array.find(val, list, path, true);
};

common.array.count = function(list, val, path) {
	if(arguments.length === 1) {
		return list.length;
	} else {
		return common.array.find(val, list, path, true).length;
	}
};

common.array.remove = function(val, list) {
	var _item = null;
	for(var i = 0 ; i < list.length ; i += 1) {
		if(list[i] === val) {
			_item = list[i];
			list.splice(i, 1);
			i -= 1;
		}
	}
	return _item;
};

common.array.insert = function(val, list, index) {
	list.splice(index, 0, val);
};

common.array.replace = function(ary1, ary2) {
	ary1.splice(0);
	ary1.push.apply(ary1, ary2);
	return ary1;
};

common.array.moveOffset = function(item, list, offset) {
	var _index = $.inArray(item, list);
	var _tgtPos = _index + offset;
	if(_tgtPos < 0 || _tgtPos >= list.length) return;

	common.array.remove(item, list);
	common.array.insert(item, list, _index + offset);
};

// ======================= Map ========================
common.map = {};

common.map.toArray = function(map) {
	return $.map(map, function(unit) {
		return unit;
	});
};

common.map.join = function(obj, spliter) {
	return $.map(obj, function(value, key) {
		if(value) return key;
	}).join(spliter);
};

common.map.mapKeyInMap = function(keyMap, map) {
	var _isSubSet = true;
	$.each(keyMap, function(key, value) {
		if(!(key in map)) {
			_isSubSet = false;
			return false;
		}
	});

	return _isSubSet;
};

// ======================== UI ========================
common.ui = {};

common.ui.scrollTo = function(element, animate) {
	var $win = $(window);

	if(common.ui.scrollTo.tid != null) {
		clearInterval(common.ui.scrollTo.tid);
		common.ui.scrollTo.tid = null;
	}

	if(animate === false) {
		var _top = typeof element == "number" ? element : $(element).offset().top;
		$win.scrollTop(_top);
	} else {
		common.ui.scrollTo.scrolling = true;
		common.ui.scrollTo.tid = setInterval(function() {
			var _top;
			switch (typeof element) {
				case "number":
					_top = element;
					break;
				default:
					var _ele =  $(element);
					if(_ele.length === 0) {
						clearInterval(common.ui.scrollTo.tid);
						common.ui.scrollTo.scrolling = false;
					}
					_top = _ele.offset().top - 50;
			}

			var w_top = $win.scrollTop();
			if(w_top != _top) {
				$win.scrollTop((w_top + _top) / 2);
			}

			var w_top_now = $win.scrollTop();
			if(Math.abs(w_top_now - _top) < 3 ||
				Math.abs(w_top_now - w_top) < 3) {
				$win.scrollTop(_top);
				clearInterval(common.ui.scrollTo.tid);
				common.ui.scrollTo.tid = null;

				setTimeout(function() {
					common.ui.scrollTo.scrolling = false;
				}, 100);
			}
		}, 30);
	}
};
common.ui.scrollTo.tid = null;
common.ui.scrollTo.scrolling = false;

common.ui.offsetWin = function(ele, offset) {
	ele = $(ele);

	var $win = $(window);
	var _winLeft = $win.scrollLeft();
	var _winTop = $win.scrollTop();

	if(!offset) {
		var _offset = ele.offset();
		_offset.left -= _winLeft;
		_offset.top -= _winTop;
		return _offset;
	} else {
		ele.offset({
			left: offset.left + _winLeft,
			top: offset.top + _winTop
		});
	}
};