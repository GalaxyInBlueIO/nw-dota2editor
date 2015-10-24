﻿'use strict';

// ======================================================
// =                        技能                        =
// ======================================================
app.factory("Ability", function() {
	function fillAttr(ability, attr, defaultValue) {
		if(defaultValue === undefined) {
			ability[attr] = {};
			$.each(_ability[attr], function(i, item) {
				ability[attr][item[0]] = false;
			});
		} else {
			ability[attr] = defaultValue;
		}

		return function(desc, title) {
			ability._requireList.push({
				attr: attr,
				title: title,
				desc: desc,
			});
		};
	}

	var _ability = function() {
		var _my = this;
		_my._requireList = [];

		// ========================================
		// =                 属性                 =
		// ========================================
		// 名字
		fillAttr(_my, "_name", "undefined")("技能名", "Name");
		
		// 图标
		fillAttr(_my, "AbilityTextureName", "")("图标");

		// 行为
		fillAttr(_my, "AbilityBehavior")("行为");

		// 目标类型
		fillAttr(_my, "AbilityUnitTargetType")("目标类型");

		// 目标队伍
		fillAttr(_my, "AbilityUnitTargetTeam")("目标队伍");

		// 目标标记
		fillAttr(_my, "AbilityUnitTargetFlags")("目标标记");

		// 伤害类型
		fillAttr(_my, "AbilityUnitDamageType","")("伤害类型");

		// 技能类型
		fillAttr(_my, "AbilityType", "DOTA_ABILITY_TYPE_BASIC")("技能类型");

		// 最大等级
		fillAttr(_my, "MaxLevel","4")("最大等级");

		// 需要等级
		fillAttr(_my, "RequiredLevel","1")("需求等级");

		// 升级等级间隔
		fillAttr(_my, "LevelsBetweenUpgrades","2")("升级间隔");

		// 施法前摇
		fillAttr(_my, "AbilityCastPoint","0")("施法前摇");

		// 施法动作
		fillAttr(_my, "AbilityCastAnimation","ACT_DOTA_CAST_ABILITY_1")("施法动作");

		// 魔法消耗
		fillAttr(_my, "AbilityManaCost","0")("魔法消耗");

		// 施法距离
		fillAttr(_my, "AbilityCastRange","0")("施法距离");

		// 施法距离缓冲
		fillAttr(_my, "AbilityCastRangeBuffer","0")("施法距离缓冲");

		// 持续施法时间
		fillAttr(_my, "AbilityChannelTime","0")("持续施法时间");

		// 持续施法每秒耗魔
		fillAttr(_my, "AbilityChannelledManaCostPerSecond","0")("持续施法每秒耗魔");

		// AOE范围
		fillAttr(_my, "AoERadius","0")("AOE范围");

		// ========================================
		// =                 事件                 =
		// ========================================
		_my._events = [];

		// ========================================
		// =                修饰器                =
		// ========================================
		_my._modifiers = [];

		return this;
	};

	_ability.AbilityBehavior = [
		["DOTA_ABILITY_BEHAVIOR_IMMEDIATE","立即",true],
		["DOTA_ABILITY_BEHAVIOR_HIDDEN","隐藏", true],
		["DOTA_ABILITY_BEHAVIOR_PASSIVE","被动", true],
		["DOTA_ABILITY_BEHAVIOR_NO_TARGET","无目标", true],
		["DOTA_ABILITY_BEHAVIOR_UNIT_TARGET","目标", true],
		["DOTA_ABILITY_BEHAVIOR_POINT","点", true],
		["DOTA_ABILITY_BEHAVIOR_AOE","AOE", true],
		["DOTA_ABILITY_BEHAVIOR_CHANNELLED","施法", true],
		["DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE","不可学习"],
		["DOTA_ABILITY_BEHAVIOR_ITEM","物品？"],
		["DOTA_ABILITY_BEHAVIOR_TOGGLE","开关"],
		["DOTA_ABILITY_BEHAVIOR_DIRECTIONAL","方向"],
		["DOTA_ABILITY_BEHAVIOR_AUTOCAST","自动施法"],
		["DOTA_ABILITY_BEHAVIOR_NOASSIST","无辅助网格"],
		["DOTA_ABILITY_BEHAVIOR_AURA","光环（无用）"],
		["DOTA_ABILITY_BEHAVIOR_ATTACK","法球"],
		["DOTA_ABILITY_BEHAVIOR_DONT_RESUME_MOVEMENT","不恢复移动"],
		["DOTA_ABILITY_BEHAVIOR_ROOT_DISABLES","定身无法释放"],
		["DOTA_ABILITY_BEHAVIOR_UNRESTRICTED","无视限制"],
		["DOTA_ABILITY_BEHAVIOR_IGNORE_PSEUDO_QUEUE","强制有效（限自动施法）"],
		["DOTA_ABILITY_BEHAVIOR_IGNORE_CHANNEL","施法打断有效"],
		["DOTA_ABILITY_BEHAVIOR_DONT_CANCEL_MOVEMENT","信使？"],
		["DOTA_ABILITY_BEHAVIOR_DONT_ALERT_TARGET","不惊醒目标"],
		["DOTA_ABILITY_BEHAVIOR_DONT_RESUME_ATTACK","不恢复攻击"],
		["DOTA_ABILITY_BEHAVIOR_NORMAL_WHEN_STOLEN","偷取保持前摇"],
		["DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING","无视后摇"],
		["DOTA_ABILITY_BEHAVIOR_RUNE_TARGET","神符目标"],
	];

	_ability.AbilityUnitTargetType = [
		["DOTA_UNIT_TARGET_HERO","英雄", true],
		["DOTA_UNIT_TARGET_BASIC","基本", true],
		["DOTA_UNIT_TARGET_ALL","所有"],
		["DOTA_UNIT_TARGET_BUILDING","建筑"],
		["DOTA_UNIT_TARGET_COURIER","信使"],
		["DOTA_UNIT_TARGET_CREEP","野怪"],
		["DOTA_UNIT_TARGET_CUSTOM","普通"],
		["DOTA_UNIT_TARGET_MECHANICAL","机械"],
		["DOTA_UNIT_TARGET_NONE","无"],
		["DOTA_UNIT_TARGET_OTHER","其他"],
		["DOTA_UNIT_TARGET_TREE","树木"],
	];
	
	_ability.AbilityUnitTargetTeam = [
		["DOTA_UNIT_TARGET_TEAM_BOTH","双方队伍", true],
		["DOTA_UNIT_TARGET_TEAM_ENEMY","敌方队伍", true],
		["DOTA_UNIT_TARGET_TEAM_FRIENDLY","友方队伍", true],
		["DOTA_UNIT_TARGET_TEAM_CUSTOM","普通队伍"],
		["DOTA_UNIT_TARGET_TEAM_NONE","无"],
	];
	
	_ability.AbilityUnitTargetFlags = [
		["DOTA_UNIT_TARGET_FLAG_CHECK_DISABLE_HELP","检测玩家'禁用帮助'选项"],
		["DOTA_UNIT_TARGET_FLAG_DEAD","已死亡"],
		["DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE","*暂无说明*"],
		["DOTA_UNIT_TARGET_FLAG_INVULNERABLE","无敌"],
		["DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES","魔法免疫的敌人"],
		["DOTA_UNIT_TARGET_FLAG_MANA_ONLY","*暂无说明*"],
		["DOTA_UNIT_TARGET_FLAG_MELEE_ONLY","*暂无说明*"],
		["DOTA_UNIT_TARGET_FLAG_NO_INVIS","不是隐形的"],
		["DOTA_UNIT_TARGET_FLAG_NONE","无"],
		["DOTA_UNIT_TARGET_FLAG_NOT_ANCIENTS","不是远古"],
		["DOTA_UNIT_TARGET_FLAG_NOT_ATTACK_IMMUNE","不是攻击免疫"],
		["DOTA_UNIT_TARGET_FLAG_NOT_CREEP_HERO","不是野怪"],
		["DOTA_UNIT_TARGET_FLAG_NOT_DOMINATED","不可控制的"],
		["DOTA_UNIT_TARGET_FLAG_NOT_ILLUSIONS","不是幻象"],
		["DOTA_UNIT_TARGET_FLAG_NOT_MAGIC_IMMUNE_ALLIES","不是魔法免疫的盟友"],
		["DOTA_UNIT_TARGET_FLAG_NOT_NIGHTMARED","非被催眠的"],
		["DOTA_UNIT_TARGET_FLAG_NOT_SUMMONED","非召唤的"],
		["DOTA_UNIT_TARGET_FLAG_OUT_OF_WORLD","被放逐出世界的"],
		["DOTA_UNIT_TARGET_FLAG_PLAYER_CONTROLLED","玩家控制的"],
		["DOTA_UNIT_TARGET_FLAG_RANGED_ONLY","范围唯一的"],
	];

	_ability.AbilityUnitDamageType = [
		["","无",true],
		["DAMAGE_TYPE_MAGICAL","魔法伤害",true],
		["DAMAGE_TYPE_PHYSICAL","物理伤害",true],
		["DAMAGE_TYPE_PURE","纯粹伤害",true],
	];

	_ability.AbilityType = [
		["DOTA_ABILITY_TYPE_BASIC","普通技能",true],
		["DOTA_ABILITY_TYPE_ULTIMATE","终极技能"],
		["DOTA_ABILITY_TYPE_ATTRIBUTES","用于属性奖励"],
		["DOTA_ABILITY_TYPE_HIDDEN","干啥的?"],
	];

	_ability.AbilityCastAnimation = [
		["ACT_DOTA_ATTACK","攻击",true],
		["ACT_DOTA_CAST_ABILITY_1","施法",true],
		["ACT_DOTA_CHANNEL_ABILITY_1","持续施法"],
		["ACT_DOTA_DISABLED","伤残"],
		["ACT_DOTA_RUN","奔跑"],
		["ACT_DOTA_SPAWN","出生"],
		["ACT_DOTA_TELEPORT","传送"],
		["ACT_DOTA_VICTORY","胜利"],
	];

	return _ability;
});