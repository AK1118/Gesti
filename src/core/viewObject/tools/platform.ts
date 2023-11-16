class Platform{
    //是否浏览器
    static get isBrowser ():boolean{
        return typeof window!=="undefined";
    }
    //是否微信
    static get isWeChatMiniProgram():boolean{
        return typeof wx!=="undefined";
    }
}

export default Platform;