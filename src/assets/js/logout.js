import Cookies from 'js-cookie'
import that from '../../main'

//注销登录
export default function logout() {
    Cookies.remove('adminToken')
    Cookies.remove('activePath')
    Cookies.remove('adminId')
    Cookies.remove('adminImg')
    Cookies.remove('adminNickname')
    that.$router.push('/login')
}
