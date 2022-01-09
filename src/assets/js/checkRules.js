//名字规则
let checkName = (rule, value, callback) => {
    //验证名字正则表达式
    const regName = /^[a-zA-Z][a-zA-Z0-9_]{2,11}$/
    if (value.length < 3 || value.length > 12) {
        callback(new Error('长度在 3 到 12 个字符！'))
    } else if (regName.test(value)) {
        //合法的名字
        return callback()
    }
    callback(new Error('仅支持数字、字母或下划线且开头不能为数字！'))
};

//密码规则
let checkPwd = (rule, value, callback) => {
    //验证密码正则表达式
    const regPwd = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,20}$/
    if (value.length < 6 || value.length > 20) {
        callback(new Error('长度在 6 到 20 个字符！'))
    } else if (regPwd.test(value)) {
        //合法的密码
        return callback()
    }
    callback(new Error('至少包含数字、字母或特殊符号任意两种组合！'))
};

//验证码规则
let checkCode = (rule, value, callback) => {
    //验证验证码正则表达式
    const regCode = /^[a-zA-Z0-9]{4}$/
    if (value.length !== 4) {
        callback(new Error('长度为 4 个字符！'))
    }
    if (regCode.test(value)) {
        //合法的验证码
        return callback()
    }
    callback(new Error('仅支持数字或字母！'))
};

//昵称规则
let checkNickname = (rule, value, callback) => {
    //验证昵称正则表达式
    const regNickname = /^[\u4E00-\u9FA5A-Za-z0-9_]+$/
    if (value.length < 3 || value.length > 12) {
        callback(new Error('长度在 3 到 12 个字符！'))
    } else if (regNickname.test(value)) {
        //合法的昵称
        return callback()
    }
    callback(new Error('仅支持字母、汉字、数字或下划线！'))
};

//手机号规则
let checkTel = (rule, value, callback) => {
    if (value === null) {
        return callback()
    } else if (value === '') {
        return callback()
    }
    //验证手机号正则表达式
    const regTel = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
    if (regTel.test(value)) {
        //合法的手机号
        return callback()
    }
    callback(new Error('不合法的手机号！'))
};

//邮箱规则
let checkEmail = (rule, value, callback) => {
    if (value === null) {
        return callback()
    } else if (value === '') {
        return callback()
    }
    //验证邮箱正则表达式
    const regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
    if (regEmail.test(value)) {
        //合法的邮箱
        return callback()
    }
    callback(new Error('不合法的邮箱！'))
};

//id规则
let checkId = (rule, value, callback) => {
    const regId = /^[1-9]\d*$/
    if (regId.test(value)) {
        //合法的id
        return callback()
    }
    callback(new Error('不合法的编号！'))
}

//年龄规则
let checkAge = (rule, value, callback) => {
    if (value === null) {
        return callback()
    } else if (value === '') {
        return callback()
    }
    const regAge = /^[1-9]\d*$/
    if (value > 200) {
        callback(new Error('年龄不合法！'))
    } else if (regAge.test(value)) {
        //合法的id
        return callback()
    }
    callback(new Error('仅支持数字！'))
}

//非非空id规则
let checkIdNull = (rule, value, callback) => {
    if (value === null) {
        return callback()
    } else if (value === '') {
        return callback()
    }
    const regId = /^[1-9]\d*$/
    if (regId.test(value)) {
        //合法的id
        return callback()
    }
    callback(new Error('不合法的编号！'))
}

//快递单号规则
let checkNu = (rule, value, callback) => {
    //验证快递单号正则表达式
    const regNu = /^[0-9a-zA-Z]+$/
    if (regNu.test(value)) {
        //合法的快递单号
        return callback()
    }
    callback(new Error('不合法的快递单号！'))
}

//整数规则
let checkInt = (rule, value, callback) => {
    //验证整数正则表达式
    const regInt = /^[+]{0,1}(\d+)$/
    if (regInt.test(value)) {
        //合法的正整数
        return callback()
    }
    callback(new Error("仅支持正整数！"))
}

//金额规则
let checkMoney = (rule, value, callback) => {
    //验证金额正则表达式
    const regMoney = /^[1-9]{1}\d*(.\d{1,2})?$|^0.\d{1,2}$/
    if (regMoney.test(value)) {
        //合法的金额
        return callback()
    }
    callback(new Error("不合法的金额！"))
}

export default {
    checkName,
    checkPwd,
    checkCode,
    checkNickname,
    checkTel,
    checkEmail,
    checkId,
    checkAge,
    checkIdNull,
    checkNu,
    checkInt,
    checkMoney
}